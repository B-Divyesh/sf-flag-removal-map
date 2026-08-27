//! Offline evidence mapping for feature-flag removal.
//!
//! The public API mirrors the CLI and deliberately stays small:
//!
//! ```no_run
//! use flag_removal_map::{analyze, AnalysisOptions};
//! use std::path::PathBuf;
//!
//! let report = analyze(AnalysisOptions {
//!     flags_path: PathBuf::from("flags.json"),
//!     evaluation_path: Some(PathBuf::from("evaluations.json")),
//!     repositories: vec![PathBuf::from(".")],
//!     only_flags: vec![],
//!     excludes: vec![],
//! }).expect("analysis should complete");
//! assert!(!report.flags.is_empty());
//! ```

use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::{BTreeMap, HashSet};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

const MAX_FILE_BYTES: u64 = 5 * 1024 * 1024;
const DEFAULT_EXCLUDES: &[&str] = &[
    ".git",
    "node_modules",
    "target",
    "dist",
    "build",
    "coverage",
    "vendor",
    ".next",
];

/// Inputs for one local analysis.
#[derive(Debug, Clone)]
pub struct AnalysisOptions {
    pub flags_path: PathBuf,
    pub evaluation_path: Option<PathBuf>,
    pub repositories: Vec<PathBuf>,
    pub only_flags: Vec<String>,
    pub excludes: Vec<String>,
}

/// A machine-readable report. The schema is versioned for CI consumers.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Report {
    pub schema_version: u8,
    pub provider: String,
    pub summary: Summary,
    pub flags: Vec<FlagResult>,
    pub warnings: Vec<String>,
    pub scan_complete: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Summary {
    pub total: usize,
    pub keep: usize,
    pub remove: usize,
    pub review: usize,
    pub references: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FlagResult {
    pub key: String,
    pub name: Option<String>,
    pub classification: Classification,
    pub reasons: Vec<String>,
    pub provider_state: ProviderState,
    pub evaluation: Option<EvaluationEvidence>,
    pub references: Vec<Reference>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Classification {
    Keep,
    Remove,
    Review,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderState {
    pub enabled: Option<bool>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvaluationEvidence {
    pub count: u64,
    pub window_days: Option<u64>,
    pub as_of: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reference {
    pub repository: String,
    pub path: String,
    pub line: usize,
    pub column: usize,
    pub kind: ReferenceKind,
    pub snippet: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ReferenceKind {
    Code,
    Config,
    Test,
    Documentation,
    Other,
}

#[derive(Debug, Clone)]
struct ProviderFlag {
    key: String,
    name: Option<String>,
    enabled: Option<bool>,
    status: Option<String>,
}

/// Reads the supplied exports, scans repositories, and returns a conservative report.
pub fn analyze(options: AnalysisOptions) -> Result<Report, String> {
    if options.repositories.is_empty() {
        return Err("at least one --repo path is required".into());
    }

    let flag_text = fs::read_to_string(&options.flags_path).map_err(|error| {
        format!(
            "could not read flag export {}: {error}",
            options.flags_path.display()
        )
    })?;
    let (provider, mut flags) = parse_provider_export(&flag_text)?;

    if !options.only_flags.is_empty() {
        let wanted: HashSet<&str> = options.only_flags.iter().map(String::as_str).collect();
        flags.retain(|flag| wanted.contains(flag.key.as_str()));
        let found: HashSet<&str> = flags.iter().map(|flag| flag.key.as_str()).collect();
        let missing: Vec<&str> = wanted.difference(&found).copied().collect();
        if !missing.is_empty() {
            return Err(format!(
                "requested flag(s) not present in export: {}",
                missing.join(", ")
            ));
        }
    }
    if flags.is_empty() {
        return Err("flag export contains no usable flags".into());
    }

    let evaluations = match &options.evaluation_path {
        Some(path) => {
            let text = fs::read_to_string(path).map_err(|error| {
                format!(
                    "could not read evaluation export {}: {error}",
                    path.display()
                )
            })?;
            parse_evaluation_export(&text)?
        }
        None => BTreeMap::new(),
    };

    let skip_paths = canonical_input_paths(&options);
    let mut warnings = Vec::new();
    let references = scan_repositories(
        &options.repositories,
        &flags
            .iter()
            .map(|flag| flag.key.clone())
            .collect::<Vec<_>>(),
        &options.excludes,
        &skip_paths,
        &mut warnings,
    )?;
    let scan_complete = warnings.is_empty();

    let mut results = Vec::with_capacity(flags.len());
    for flag in flags {
        let evaluation = evaluations.get(&flag.key).cloned();
        let (mut classification, mut reasons) = classify(&flag, evaluation.as_ref());
        if !scan_complete && classification == Classification::Remove {
            classification = Classification::Review;
            reasons.push(
                "Repository scan was incomplete; removal cannot be mapped confidently.".into(),
            );
        }
        results.push(FlagResult {
            key: flag.key.clone(),
            name: flag.name,
            classification,
            reasons,
            provider_state: ProviderState {
                enabled: flag.enabled,
                status: flag.status,
            },
            evaluation,
            references: references.get(&flag.key).cloned().unwrap_or_default(),
        });
    }

    results.sort_by(|a, b| a.key.cmp(&b.key));
    let summary = Summary {
        total: results.len(),
        keep: results
            .iter()
            .filter(|item| item.classification == Classification::Keep)
            .count(),
        remove: results
            .iter()
            .filter(|item| item.classification == Classification::Remove)
            .count(),
        review: results
            .iter()
            .filter(|item| item.classification == Classification::Review)
            .count(),
        references: results.iter().map(|item| item.references.len()).sum(),
    };

    Ok(Report {
        schema_version: 1,
        provider,
        summary,
        flags: results,
        warnings,
        scan_complete,
    })
}

fn parse_provider_export(text: &str) -> Result<(String, Vec<ProviderFlag>), String> {
    let root: Value = serde_json::from_str(text)
        .map_err(|error| format!("flag export is not valid JSON: {error}"))?;
    let provider = root
        .get("provider")
        .and_then(Value::as_str)
        .unwrap_or("unknown")
        .to_string();

    let entries = if let Some(array) = root.as_array() {
        array.iter().collect::<Vec<_>>()
    } else {
        ["flags", "items", "features"]
            .iter()
            .find_map(|key| root.get(key).and_then(Value::as_array))
            .map(|array| array.iter().collect::<Vec<_>>())
            .ok_or_else(|| {
                "flag export needs a JSON array or a flags/items/features array".to_string()
            })?
    };

    let mut flags = Vec::new();
    let mut seen = HashSet::new();
    for entry in entries {
        let nested = entry.get("feature").filter(|value| value.is_object());
        let key = string_field(entry, &["key", "name", "flagKey"])
            .or_else(|| nested.and_then(|value| string_field(value, &["key", "name"])))
            .map(str::trim)
            .filter(|value| !value.is_empty());
        let Some(key) = key else { continue };
        if !seen.insert(key.to_string()) {
            return Err(format!("flag export contains duplicate key: {key}"));
        }

        let archived = bool_field(entry, &["archived", "isArchived"]);
        let enabled = bool_field(entry, &["enabled", "isEnabled"])
            .or_else(|| nested.and_then(|value| bool_field(value, &["enabled", "isEnabled"])))
            .or_else(|| archived.map(|is_archived| !is_archived));
        let status = string_field(entry, &["status", "state"])
            .or_else(|| nested.and_then(|value| string_field(value, &["status", "state"])))
            .map(ToOwned::to_owned)
            .or_else(|| {
                archived
                    .filter(|value| *value)
                    .map(|_| "archived".to_string())
            });
        let name = entry
            .get("displayName")
            .and_then(Value::as_str)
            .or_else(|| {
                entry
                    .get("name")
                    .and_then(Value::as_str)
                    .filter(|name| *name != key)
            })
            .map(ToOwned::to_owned);

        flags.push(ProviderFlag {
            key: key.to_string(),
            name,
            enabled,
            status,
        });
    }
    Ok((provider, flags))
}

fn parse_evaluation_export(text: &str) -> Result<BTreeMap<String, EvaluationEvidence>, String> {
    let root: Value = serde_json::from_str(text)
        .map_err(|error| format!("evaluation export is not valid JSON: {error}"))?;
    let global_window = number_field(&root, &["window_days", "windowDays"]);
    let global_as_of = string_field(&root, &["as_of", "asOf"]).map(ToOwned::to_owned);
    let source = root
        .get("evaluations")
        .or_else(|| root.get("flags"))
        .or_else(|| root.get("items"))
        .unwrap_or(&root);
    let mut output = BTreeMap::new();

    if let Some(object) = source.as_object() {
        for (key, value) in object {
            if ["window_days", "windowDays", "as_of", "asOf", "provider"].contains(&key.as_str()) {
                continue;
            }
            let count = value
                .as_u64()
                .or_else(|| number_field(value, &["count", "evaluations", "evaluation_count"]));
            if let Some(count) = count {
                output.insert(
                    key.clone(),
                    EvaluationEvidence {
                        count,
                        window_days: number_field(value, &["window_days", "windowDays"])
                            .or(global_window),
                        as_of: string_field(value, &["as_of", "asOf"])
                            .map(ToOwned::to_owned)
                            .or_else(|| global_as_of.clone()),
                    },
                );
            }
        }
    } else if let Some(array) = source.as_array() {
        for entry in array {
            let Some(key) = string_field(entry, &["key", "name", "flagKey"]) else {
                continue;
            };
            let Some(count) = number_field(entry, &["count", "evaluations", "evaluation_count"])
            else {
                continue;
            };
            output.insert(
                key.to_string(),
                EvaluationEvidence {
                    count,
                    window_days: number_field(entry, &["window_days", "windowDays"])
                        .or(global_window),
                    as_of: string_field(entry, &["as_of", "asOf"])
                        .map(ToOwned::to_owned)
                        .or_else(|| global_as_of.clone()),
                },
            );
        }
    } else {
        return Err("evaluation export needs an evaluations object or array".into());
    }
    Ok(output)
}

fn string_field<'a>(value: &'a Value, keys: &[&str]) -> Option<&'a str> {
    keys.iter()
        .find_map(|key| value.get(key).and_then(Value::as_str))
}

fn bool_field(value: &Value, keys: &[&str]) -> Option<bool> {
    keys.iter()
        .find_map(|key| value.get(key).and_then(Value::as_bool))
}

fn number_field(value: &Value, keys: &[&str]) -> Option<u64> {
    keys.iter()
        .find_map(|key| value.get(key).and_then(Value::as_u64))
}

fn classify(
    flag: &ProviderFlag,
    evaluation: Option<&EvaluationEvidence>,
) -> (Classification, Vec<String>) {
    let status = flag.status.as_deref().unwrap_or("").to_ascii_lowercase();
    let active_state = ["active", "live", "running", "enabled"].contains(&status.as_str());
    let completed_state = [
        "completed",
        "complete",
        "archived",
        "disabled",
        "off",
        "removed",
    ]
    .contains(&status.as_str());

    if flag.enabled == Some(true) || active_state {
        return (
            Classification::Keep,
            vec!["Provider export marks the flag active or enabled.".into()],
        );
    }
    if evaluation.is_some_and(|evidence| evidence.count > 0) {
        return (
            Classification::Keep,
            vec!["Evaluation activity exists in the supplied observation window.".into()],
        );
    }
    if (flag.enabled == Some(false) || completed_state)
        && evaluation.is_some_and(|evidence| {
            evidence.count == 0 && evidence.window_days.is_some_and(|days| days > 0)
        })
    {
        let evidence = evaluation.expect("checked above");
        return (
            Classification::Remove,
            vec![
                "Provider export marks the flag completed, archived, or disabled.".into(),
                format!("The supplied {}-day observation window reports zero evaluations; this supports review but does not prove safety.", evidence.window_days.unwrap_or_default()),
            ],
        );
    }

    let mut reasons = Vec::new();
    if flag.enabled.is_none() && status.is_empty() {
        reasons.push("Provider state is missing or unrecognized.".into());
    } else if flag.enabled == Some(false) || completed_state {
        reasons.push(
            "Provider state suggests completion, but bounded zero-evaluation evidence is missing."
                .into(),
        );
    } else {
        reasons.push("Provider state does not explicitly establish completion.".into());
    }
    if evaluation.is_some_and(|evidence| evidence.count == 0 && evidence.window_days.is_none()) {
        reasons.push("Zero evaluations were supplied without an observation window.".into());
    } else if evaluation.is_none() {
        reasons.push("No evaluation evidence was supplied for this flag.".into());
    }
    (Classification::Review, reasons)
}

fn canonical_input_paths(options: &AnalysisOptions) -> HashSet<PathBuf> {
    let mut paths = HashSet::new();
    if let Ok(path) = options.flags_path.canonicalize() {
        paths.insert(path);
    }
    if let Some(path) = &options.evaluation_path {
        if let Ok(path) = path.canonicalize() {
            paths.insert(path);
        }
    }
    paths
}

fn scan_repositories(
    repositories: &[PathBuf],
    keys: &[String],
    extra_excludes: &[String],
    skip_paths: &HashSet<PathBuf>,
    warnings: &mut Vec<String>,
) -> Result<BTreeMap<String, Vec<Reference>>, String> {
    let mut references: BTreeMap<String, Vec<Reference>> =
        keys.iter().cloned().map(|key| (key, Vec::new())).collect();
    let excludes: HashSet<&str> = DEFAULT_EXCLUDES
        .iter()
        .copied()
        .chain(extra_excludes.iter().map(String::as_str))
        .collect();

    for repository in repositories {
        if !repository.exists() {
            return Err(format!(
                "repository path does not exist: {}",
                repository.display()
            ));
        }
        if !repository.is_dir() {
            return Err(format!(
                "repository path is not a directory: {}",
                repository.display()
            ));
        }
        visit_directory(
            repository,
            repository,
            keys,
            &excludes,
            skip_paths,
            warnings,
            &mut references,
        )
        .map_err(|error| {
            format!(
                "could not scan repository {}: {error}",
                repository.display()
            )
        })?;
    }
    for matches in references.values_mut() {
        matches.sort_by(|a, b| {
            (&a.repository, &a.path, a.line, a.column).cmp(&(
                &b.repository,
                &b.path,
                b.line,
                b.column,
            ))
        });
    }
    Ok(references)
}

fn visit_directory(
    repository: &Path,
    directory: &Path,
    keys: &[String],
    excludes: &HashSet<&str>,
    skip_paths: &HashSet<PathBuf>,
    warnings: &mut Vec<String>,
    references: &mut BTreeMap<String, Vec<Reference>>,
) -> io::Result<()> {
    let entries = match fs::read_dir(directory) {
        Ok(entries) => entries,
        Err(error) => {
            warnings.push(format!("Could not read {}: {error}", directory.display()));
            return Ok(());
        }
    };
    for entry in entries {
        let entry = match entry {
            Ok(entry) => entry,
            Err(error) => {
                warnings.push(format!(
                    "Could not inspect an entry in {}: {error}",
                    directory.display()
                ));
                continue;
            }
        };
        let path = entry.path();
        let name = entry.file_name();
        let name = name.to_string_lossy();
        let file_type = match entry.file_type() {
            Ok(file_type) => file_type,
            Err(error) => {
                warnings.push(format!("Could not inspect {}: {error}", path.display()));
                continue;
            }
        };
        if file_type.is_symlink() || excludes.contains(name.as_ref()) {
            continue;
        }
        if file_type.is_dir() {
            visit_directory(
                repository, &path, keys, excludes, skip_paths, warnings, references,
            )?;
            continue;
        }
        if !file_type.is_file()
            || path
                .canonicalize()
                .is_ok_and(|canonical| skip_paths.contains(&canonical))
        {
            continue;
        }
        let metadata = match entry.metadata() {
            Ok(metadata) => metadata,
            Err(error) => {
                warnings.push(format!(
                    "Could not read metadata for {}: {error}",
                    path.display()
                ));
                continue;
            }
        };
        if metadata.len() > MAX_FILE_BYTES {
            warnings.push(format!(
                "Skipped {} because it exceeds 5 MiB",
                path.display()
            ));
            continue;
        }
        let bytes = match fs::read(&path) {
            Ok(bytes) => bytes,
            Err(error) => {
                warnings.push(format!("Could not read {}: {error}", path.display()));
                continue;
            }
        };
        if bytes.iter().take(8192).any(|byte| *byte == 0) {
            continue;
        }
        let Ok(text) = String::from_utf8(bytes) else {
            continue;
        };
        scan_text(repository, &path, &text, keys, references);
    }
    Ok(())
}

fn scan_text(
    repository: &Path,
    path: &Path,
    text: &str,
    keys: &[String],
    references: &mut BTreeMap<String, Vec<Reference>>,
) {
    let relative = path
        .strip_prefix(repository)
        .unwrap_or(path)
        .to_string_lossy()
        .replace('\\', "/");
    let repository_name = repository.to_string_lossy().to_string();
    let kind = reference_kind(path);
    for (line_index, line) in text.lines().enumerate() {
        for key in keys {
            for (column, _) in line.match_indices(key) {
                let snippet: String = line.trim().chars().take(180).collect();
                references.entry(key.clone()).or_default().push(Reference {
                    repository: repository_name.clone(),
                    path: relative.clone(),
                    line: line_index + 1,
                    column: line[..column].chars().count() + 1,
                    kind: kind.clone(),
                    snippet,
                });
            }
        }
    }
}

fn reference_kind(path: &Path) -> ReferenceKind {
    let name = path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    let extension = path
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    if name.contains("test")
        || name.contains("spec")
        || path.components().any(|part| part.as_os_str() == "tests")
    {
        ReferenceKind::Test
    } else if [
        "json",
        "yaml",
        "yml",
        "toml",
        "ini",
        "conf",
        "env",
        "properties",
        "xml",
    ]
    .contains(&extension.as_str())
        || name.starts_with("dockerfile")
    {
        ReferenceKind::Config
    } else if ["md", "mdx", "rst", "txt", "adoc"].contains(&extension.as_str()) {
        ReferenceKind::Documentation
    } else if [
        "rs", "go", "js", "jsx", "ts", "tsx", "py", "rb", "java", "kt", "swift", "cs", "c", "cc",
        "cpp", "h", "hpp", "php", "scala", "sh",
    ]
    .contains(&extension.as_str())
    {
        ReferenceKind::Code
    } else {
        ReferenceKind::Other
    }
}

/// Renders the human checklist written by the CLI.
pub fn render_markdown(report: &Report) -> String {
    let mut output = String::new();
    output.push_str("# Feature flag removal map\n\n");
    output.push_str(&format!(
        "Provider: **{}**  \n",
        escape_markdown(&report.provider)
    ));
    output.push_str(&format!(
        "Scan complete: **{}**  \n",
        if report.scan_complete { "yes" } else { "no" }
    ));
    output.push_str(&format!("Flags: **{}** · Keep: **{}** · Remove candidates: **{}** · Review: **{}** · References: **{}**\n\n", report.summary.total, report.summary.keep, report.summary.remove, report.summary.review, report.summary.references));
    output.push_str("> Zero observed evaluations never proves that removal is safe. Treat this map as evidence for a human-reviewed rollout, not an instruction to delete automatically.\n\n");
    if !report.warnings.is_empty() {
        output.push_str("## Scan warnings\n\n");
        for warning in &report.warnings {
            output.push_str(&format!("- {}\n", escape_markdown(warning)));
        }
        output.push('\n');
    }

    for flag in &report.flags {
        let label = match flag.classification {
            Classification::Keep => "KEEP",
            Classification::Remove => "REMOVE CANDIDATE",
            Classification::Review => "REVIEW",
        };
        output.push_str(&format!("## `{}` — {}\n\n", escape_code(&flag.key), label));
        if let Some(name) = &flag.name {
            output.push_str(&format!("{}\n\n", escape_markdown(name)));
        }
        output.push_str("### Evidence\n\n");
        for reason in &flag.reasons {
            output.push_str(&format!("- {}\n", escape_markdown(reason)));
        }
        let provider_state = flag
            .provider_state
            .status
            .as_deref()
            .unwrap_or("not supplied");
        output.push_str(&format!(
            "- Provider status: `{}`; enabled: `{}`.\n",
            escape_code(provider_state),
            flag.provider_state
                .enabled
                .map(|value| value.to_string())
                .unwrap_or_else(|| "not supplied".into())
        ));
        if let Some(evaluation) = &flag.evaluation {
            output.push_str(&format!(
                "- Evaluations: **{}**; observation window: **{}**; as of: **{}**.\n",
                evaluation.count,
                evaluation
                    .window_days
                    .map(|days| format!("{days} days"))
                    .unwrap_or_else(|| "not supplied".into()),
                evaluation.as_of.as_deref().unwrap_or("not supplied")
            ));
        }
        output.push_str("\n### References\n\n");
        if flag.references.is_empty() {
            output.push_str("No literal references found in the supplied repository paths. Check generated artifacts, runtime configuration, and repositories outside this scan.\n\n");
        } else {
            for reference in &flag.references {
                output.push_str(&format!(
                    "- [ ] `{}` → `{}:{}:{}` ({:?}) — `{}`\n",
                    escape_code(&reference.repository),
                    escape_code(&reference.path),
                    reference.line,
                    reference.column,
                    reference.kind,
                    escape_code(&reference.snippet)
                ));
            }
            output.push('\n');
        }
        if flag.classification == Classification::Keep {
            output.push_str("### Hold point\n\n");
            output.push_str(
                "- [ ] Do not remove the flag while provider or evaluation evidence is active.\n",
            );
            output.push_str("- [ ] Confirm the rollout state and repeat the survey after a representative window.\n\n");
        } else {
            output.push_str("### Removal route\n\n");
            output.push_str(&format!(
                "- [ ] Confirm the flag owner and intended final variation for `{}`.\n",
                escape_code(&flag.key)
            ));
            output.push_str("- [ ] Verify completion in the provider and inspect a representative evaluation window.\n");
            output.push_str(
                "- [ ] Record a rollback path and the release that will remove the flag.\n",
            );
            output.push_str("- [ ] Remove or simplify every mapped code, test, config, and documentation reference.\n");
            output.push_str(
                "- [ ] Search again, then run the affected tests and configuration validation.\n",
            );
            output.push_str(
                "- [ ] Deploy the code cleanup and monitor normal product and error signals.\n",
            );
            output.push_str("- [ ] Delete the provider flag only after the cleanup release is healthy and rollback is no longer needed.\n\n");
        }
    }
    output
}

fn escape_markdown(value: &str) -> String {
    value
        .replace('\\', "\\\\")
        .replace('*', "\\*")
        .replace('_', "\\_")
        .replace('[', "\\[")
        .replace(']', "\\]")
}

fn escape_code(value: &str) -> String {
    value.replace('`', "ˋ")
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn parses_common_provider_shapes() {
        let (_, flags) = parse_provider_export(r#"{"provider":"test","items":[{"key":"alpha","archived":true},{"name":"beta","enabled":true}]}"#).unwrap();
        assert_eq!(flags.len(), 2);
        assert_eq!(flags[0].status.as_deref(), Some("archived"));
        assert_eq!(flags[1].key, "beta");
    }

    #[test]
    fn zero_without_window_requires_review() {
        let flag = ProviderFlag {
            key: "old".into(),
            name: None,
            enabled: Some(false),
            status: Some("completed".into()),
        };
        let evidence = EvaluationEvidence {
            count: 0,
            window_days: None,
            as_of: None,
        };
        assert_eq!(classify(&flag, Some(&evidence)).0, Classification::Review);
    }

    #[test]
    fn completed_with_bounded_zero_is_remove_candidate() {
        let flag = ProviderFlag {
            key: "old".into(),
            name: None,
            enabled: Some(false),
            status: Some("completed".into()),
        };
        let evidence = EvaluationEvidence {
            count: 0,
            window_days: Some(30),
            as_of: None,
        };
        assert_eq!(classify(&flag, Some(&evidence)).0, Classification::Remove);
    }

    #[test]
    fn active_evaluations_force_keep() {
        let flag = ProviderFlag {
            key: "old".into(),
            name: None,
            enabled: Some(false),
            status: Some("completed".into()),
        };
        let evidence = EvaluationEvidence {
            count: 4,
            window_days: Some(30),
            as_of: None,
        };
        assert_eq!(classify(&flag, Some(&evidence)).0, Classification::Keep);
    }

    #[test]
    fn analysis_finds_code_config_test_and_docs() {
        let temp = tempdir().unwrap();
        fs::write(
            temp.path().join("flags.json"),
            r#"{"flags":[{"key":"checkout-v2","enabled":false,"status":"completed"}]}"#,
        )
        .unwrap();
        fs::write(
            temp.path().join("eval.json"),
            r#"{"window_days":30,"evaluations":{"checkout-v2":0}}"#,
        )
        .unwrap();
        fs::write(
            temp.path().join("app.ts"),
            "client.boolVariation('checkout-v2')",
        )
        .unwrap();
        fs::write(temp.path().join("config.yaml"), "flag: checkout-v2").unwrap();
        fs::write(temp.path().join("app.test.ts"), "expect('checkout-v2')").unwrap();
        fs::write(temp.path().join("README.md"), "Remove checkout-v2 later").unwrap();
        let report = analyze(AnalysisOptions {
            flags_path: temp.path().join("flags.json"),
            evaluation_path: Some(temp.path().join("eval.json")),
            repositories: vec![temp.path().to_path_buf()],
            only_flags: vec![],
            excludes: vec![],
        })
        .unwrap();
        assert_eq!(report.summary.references, 4);
        assert_eq!(report.flags[0].classification, Classification::Remove);
        assert!(report.flags[0]
            .references
            .iter()
            .any(|item| item.kind == ReferenceKind::Test));
    }

    #[test]
    fn markdown_includes_guardrails_and_coordinates() {
        let report = Report {
            schema_version: 1,
            provider: "test".into(),
            summary: Summary {
                total: 1,
                keep: 0,
                remove: 0,
                review: 1,
                references: 0,
            },
            flags: vec![FlagResult {
                key: "alpha".into(),
                name: None,
                classification: Classification::Review,
                reasons: vec!["Missing evidence.".into()],
                provider_state: ProviderState {
                    enabled: None,
                    status: None,
                },
                evaluation: None,
                references: vec![],
            }],
            warnings: vec![],
            scan_complete: true,
        };
        let markdown = render_markdown(&report);
        assert!(markdown.contains("Zero observed evaluations never proves"));
        assert!(markdown.contains("Delete the provider flag only after"));
    }
}
