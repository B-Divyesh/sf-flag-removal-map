use std::fs;
use std::path::Path;
use std::process::Command;
use tempfile::tempdir;

fn binary() -> Command {
    Command::new(env!("CARGO_BIN_EXE_flag-removal-map"))
}

#[derive(Debug, Eq, PartialEq)]
struct TreeEntry {
    path: String,
    kind: &'static str,
    bytes: u64,
    read_only: bool,
    modified_nanos: u128,
    content_hash: u64,
}

/// Capture the repository's names, node kinds, content, and modification
/// metadata. Reading a tree is intentionally separate from the CLI so this
/// claim catches edits anywhere under the supplied repository root.
fn snapshot_tree(root: &Path) -> Vec<TreeEntry> {
    fn hash(bytes: &[u8]) -> u64 {
        bytes.iter().fold(0xcbf29ce484222325_u64, |value, byte| {
            (value ^ u64::from(*byte)).wrapping_mul(0x100000001b3)
        })
    }

    fn visit(root: &Path, path: &Path, output: &mut Vec<TreeEntry>) {
        let metadata = fs::symlink_metadata(path).unwrap();
        let file_type = metadata.file_type();
        let (kind, content_hash) = if file_type.is_file() {
            ("file", hash(&fs::read(path).unwrap()))
        } else if file_type.is_symlink() {
            (
                "symlink",
                hash(path.read_link().unwrap().as_os_str().as_encoded_bytes()),
            )
        } else if file_type.is_dir() {
            ("directory", 0)
        } else {
            ("other", 0)
        };
        let modified_nanos = metadata
            .modified()
            .unwrap()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        output.push(TreeEntry {
            path: path.strip_prefix(root).unwrap().display().to_string(),
            kind,
            bytes: metadata.len(),
            read_only: metadata.permissions().readonly(),
            modified_nanos,
            content_hash,
        });
        if file_type.is_dir() {
            let mut entries = fs::read_dir(path)
                .unwrap()
                .map(|entry| entry.unwrap().path())
                .collect::<Vec<_>>();
            entries.sort();
            for entry in entries {
                visit(root, &entry, output);
            }
        }
    }

    let mut output = Vec::new();
    visit(root, root, &mut output);
    output.sort_by(|left, right| left.path.cmp(&right.path));
    output
}

/// Install a seccomp filter in the child process before it execs the CLI.
/// Any attempt to create or use a network socket kills that child, so a green
/// command is observable proof that the tested workflow made no provider call.
#[cfg(target_os = "linux")]
fn network_denied_binary() -> Command {
    use std::io;
    use std::os::unix::process::CommandExt;

    let mut command = binary();
    unsafe {
        command.pre_exec(|| {
            const BPF_LD_W_ABS: u16 = 0x20;
            const BPF_JMP_JEQ_K: u16 = 0x15;
            const BPF_RET_K: u16 = 0x06;
            const SECCOMP_RET_KILL_PROCESS: u32 = 0x8000_0000;
            const SECCOMP_RET_ALLOW: u32 = 0x7fff_0000;
            let filter = [
                libc::sock_filter {
                    code: BPF_LD_W_ABS,
                    jt: 0,
                    jf: 0,
                    k: 0,
                },
                libc::sock_filter {
                    code: BPF_JMP_JEQ_K,
                    jt: 0,
                    jf: 1,
                    k: libc::SYS_socket as u32,
                },
                libc::sock_filter {
                    code: BPF_RET_K,
                    jt: 0,
                    jf: 0,
                    k: SECCOMP_RET_KILL_PROCESS,
                },
                libc::sock_filter {
                    code: BPF_JMP_JEQ_K,
                    jt: 0,
                    jf: 1,
                    k: libc::SYS_connect as u32,
                },
                libc::sock_filter {
                    code: BPF_RET_K,
                    jt: 0,
                    jf: 0,
                    k: SECCOMP_RET_KILL_PROCESS,
                },
                libc::sock_filter {
                    code: BPF_RET_K,
                    jt: 0,
                    jf: 0,
                    k: SECCOMP_RET_ALLOW,
                },
            ];
            let program = libc::sock_fprog {
                len: filter.len() as u16,
                filter: filter.as_ptr() as *mut libc::sock_filter,
            };
            if libc::prctl(libc::PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0) != 0 {
                return Err(io::Error::last_os_error());
            }
            if libc::prctl(libc::PR_SET_SECCOMP, libc::SECCOMP_MODE_FILTER, &program) != 0 {
                return Err(io::Error::last_os_error());
            }
            Ok(())
        });
    }
    command
}

#[test]
fn help_documents_inputs_and_exit_codes() {
    let output = binary().arg("--help").output().unwrap();
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(output.status.success());
    assert!(stdout.contains("--evaluations"));
    assert!(stdout.contains("EXIT CODES"));
    assert!(stdout.contains("recent, dated zero evaluations"));
}

#[test]
// @claim:combined-evidence-plan
fn documented_json_workflow_runs_end_to_end() {
    let temp = tempdir().unwrap();
    let repository = temp.path().join("repo");
    fs::create_dir(&repository).unwrap();
    fs::write(
        temp.path().join("flags.json"),
        r#"{"provider":"example","flags":[{"key":"checkout-v2","enabled":false,"status":"completed"}]}"#,
    )
    .unwrap();
    fs::write(
        temp.path().join("evaluations.json"),
        format!(
            r#"{{"as_of":"{}T00:00:00Z","window_days":30,"evaluations":{{"checkout-v2":0}}}}"#,
            flag_removal_map::today_utc_date()
        ),
    )
    .unwrap();
    fs::write(
        repository.join("checkout.ts"),
        "client.boolVariation(\"checkout-v2\", false);",
    )
    .unwrap();

    let output = binary()
        .args(["--flags", temp.path().join("flags.json").to_str().unwrap()])
        .args([
            "--evaluations",
            temp.path().join("evaluations.json").to_str().unwrap(),
        ])
        .args(["--repo", repository.to_str().unwrap(), "--json"])
        .output()
        .unwrap();

    assert!(output.status.success());
    let value: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(value["flags"][0]["classification"], "remove");
    assert_eq!(value["summary"]["references"], 1);
}

#[test]
// @claim:decision-rule
fn dated_evidence_rule_has_cli_counterexamples() {
    let temp = tempdir().unwrap();
    let repository = temp.path().join("repo");
    fs::create_dir(&repository).unwrap();
    fs::write(repository.join("flag.ts"), "use('checkout-v2')").unwrap();
    fs::write(
        temp.path().join("flags.json"),
        r#"{"flags":[{"key":"checkout-v2","enabled":false,"status":"completed"}]}"#,
    )
    .unwrap();
    for (name, usage, expected) in [
        (
            "dated",
            format!(
                r#"{{"as_of":"{}","window_days":30,"evaluations":{{"checkout-v2":0}}}}"#,
                flag_removal_map::today_utc_date()
            ),
            "remove",
        ),
        (
            "undated",
            r#"{"window_days":30,"evaluations":{"checkout-v2":0}}"#.into(),
            "review",
        ),
        (
            "invalid",
            r#"{"as_of":"not-a-date","window_days":30,"evaluations":{"checkout-v2":0}}"#.into(),
            "review",
        ),
        (
            "malformed-suffix",
            format!(
                r#"{{"as_of":"{}garbageT00:00:00Z","window_days":30,"evaluations":{{"checkout-v2":0}}}}"#,
                flag_removal_map::today_utc_date()
            ),
            "review",
        ),
        (
            "stale",
            r#"{"as_of":"2000-01-01","window_days":30,"evaluations":{"checkout-v2":0}}"#.into(),
            "review",
        ),
        (
            "active",
            format!(
                r#"{{"as_of":"{}","window_days":30,"evaluations":{{"checkout-v2":2}}}}"#,
                flag_removal_map::today_utc_date()
            ),
            "keep",
        ),
    ] {
        let path = temp.path().join(format!("{name}.json"));
        fs::write(&path, usage).unwrap();
        let output = binary()
            .args([
                "--flags",
                temp.path().join("flags.json").to_str().unwrap(),
                "--evaluations",
                path.to_str().unwrap(),
                "--repo",
                repository.to_str().unwrap(),
                "--json",
            ])
            .output()
            .unwrap();
        assert!(output.status.success());
        assert_eq!(
            serde_json::from_slice::<serde_json::Value>(&output.stdout).unwrap()["flags"][0]
                ["classification"],
            expected,
            "{name}"
        );
    }
}

#[test]
// @claim:optional-usage-report
fn optional_usage_report_is_accepted_and_routes_to_review() {
    let temp = tempdir().unwrap();
    let repository = temp.path().join("repo");
    fs::create_dir(&repository).unwrap();
    fs::write(repository.join("checkout.ts"), "use('checkout-v2')").unwrap();
    fs::write(
        temp.path().join("flags.json"),
        r#"{"flags":[{"key":"checkout-v2","enabled":false,"status":"completed"}]}"#,
    )
    .unwrap();

    let output = binary()
        .args([
            "--flags",
            temp.path().join("flags.json").to_str().unwrap(),
            "--repo",
            repository.to_str().unwrap(),
            "--json",
        ])
        .output()
        .unwrap();

    assert!(output.status.success());
    let report: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    let flag = &report["flags"][0];
    assert_eq!(flag["classification"], "review");
    assert!(
        flag["reasons"]
            .as_array()
            .unwrap()
            .iter()
            .any(|reason| reason == "No evaluation evidence was supplied for this flag."),
        "a missing optional report must explicitly require human review"
    );
    assert!(!temp.path().join("flag-removal-plan.md").exists());
}

#[test]
// @claim:json-options
fn documented_options_and_output_contracts_are_observable() {
    let temp = tempdir().unwrap();
    let repo = temp.path().join("repo");
    fs::create_dir(&repo).unwrap();
    fs::create_dir(repo.join("ignored")).unwrap();
    fs::write(repo.join("one.ts"), "one").unwrap();
    fs::write(repo.join("ignored/two.ts"), "two").unwrap();
    fs::write(temp.path().join("flags.json"), r#"{"flags":[{"key":"one","enabled":false,"status":"completed"},{"key":"two","enabled":false,"status":"completed"}]}"#).unwrap();
    fs::write(
        temp.path().join("eval.json"),
        format!(
            r#"{{"as_of":"{}","window_days":30,"evaluations":{{"one":0,"two":0}}}}"#,
            flag_removal_map::today_utc_date()
        ),
    )
    .unwrap();
    let json = binary()
        .args([
            "--flags",
            temp.path().join("flags.json").to_str().unwrap(),
            "--evaluations",
            temp.path().join("eval.json").to_str().unwrap(),
            "--repo",
            repo.to_str().unwrap(),
            "--flag",
            "one",
            "--flag",
            "two",
            "--exclude",
            "ignored",
            "--json",
        ])
        .output()
        .unwrap();
    assert!(json.status.success());
    assert!(!temp.path().join("flag-removal-plan.md").exists());
    let value: serde_json::Value = serde_json::from_slice(&json.stdout).unwrap();
    assert_eq!(value["flags"].as_array().unwrap().len(), 2);
    assert_eq!(value["summary"]["references"], 1);
    let missing = binary()
        .args([
            "--flags",
            temp.path().join("flags.json").to_str().unwrap(),
            "--repo",
            repo.to_str().unwrap(),
            "--flag",
            "missing",
        ])
        .output()
        .unwrap();
    assert_eq!(missing.status.code(), Some(2));
}

#[test]
// @claim:repository-read-only
#[cfg(target_os = "linux")]
fn cli_does_not_edit_any_repository_path_or_make_network_syscalls() {
    let temp = tempdir().unwrap();
    let repo = temp.path().join("repo");
    fs::create_dir_all(repo.join("nested/config")).unwrap();
    fs::write(repo.join("flag.ts"), "checkout-v2").unwrap();
    fs::write(repo.join("nested/config/flags.yaml"), "checkout-v2: false").unwrap();
    fs::write(
        repo.join("nested/notes.md"),
        "Keep checkout-v2 until reviewed.",
    )
    .unwrap();
    let before = snapshot_tree(&repo);
    fs::write(
        temp.path().join("flags.json"),
        r#"{"flags":[{"key":"checkout-v2","enabled":false,"status":"completed"}]}"#,
    )
    .unwrap();
    let capture = temp.path().join("analysis.json");
    let output = network_denied_binary()
        .args([
            "--flags",
            temp.path().join("flags.json").to_str().unwrap(),
            "--repo",
            repo.to_str().unwrap(),
            "--json",
        ])
        .output()
        .unwrap();
    assert!(output.status.success());
    fs::write(&capture, &output.stdout).unwrap();
    assert!(serde_json::from_slice::<serde_json::Value>(&output.stdout).is_ok());
    assert!(
        capture.is_file(),
        "the JSON capture is outside the repository fixture"
    );
    assert_eq!(
        snapshot_tree(&repo),
        before,
        "the CLI must not change any repository path, content, or metadata"
    );
}

#[test]
// @claim:plan-checklist
fn markdown_plan_lists_evidence_and_every_human_check_across_repositories() {
    let temp = tempdir().unwrap();
    let repo_a = temp.path().join("a");
    let repo_b = temp.path().join("b");
    fs::create_dir(&repo_a).unwrap();
    fs::create_dir(&repo_b).unwrap();
    fs::write(repo_a.join("flag.ts"), "checkout-v2").unwrap();
    fs::write(repo_b.join("flag.yaml"), "checkout-v2: false").unwrap();
    fs::write(
        temp.path().join("flags.json"),
        r#"{"flags":[{"key":"checkout-v2","enabled":false,"status":"completed"}]}"#,
    )
    .unwrap();
    fs::write(
        temp.path().join("eval.json"),
        format!(
            r#"{{"as_of":"{}","window_days":30,"evaluations":{{"checkout-v2":0}}}}"#,
            flag_removal_map::today_utc_date()
        ),
    )
    .unwrap();
    let plan = temp.path().join("plan.md");
    let output = binary()
        .args([
            "--flags",
            temp.path().join("flags.json").to_str().unwrap(),
            "--evaluations",
            temp.path().join("eval.json").to_str().unwrap(),
            "--repo",
            repo_a.to_str().unwrap(),
            "--repo",
            repo_b.to_str().unwrap(),
            "--out",
            plan.to_str().unwrap(),
        ])
        .output()
        .unwrap();
    assert!(output.status.success());
    let text = fs::read_to_string(plan).unwrap();
    for expected in [
        "### Evidence",
        "Confirm the flag owner",
        "rollback path",
        "mapped code, test, config, and documentation",
        "Deploy the code cleanup",
        "Delete the provider flag",
    ] {
        assert!(text.contains(expected), "missing {expected}");
    }
}

#[test]
// @claim:exit-codes
fn all_documented_exit_codes_are_observable() {
    let temp = tempdir().unwrap();
    let repo = temp.path().join("repo");
    fs::create_dir(&repo).unwrap();
    fs::write(
        temp.path().join("flags.json"),
        r#"{"flags":[{"key":"checkout-v2","enabled":false,"status":"completed"}]}"#,
    )
    .unwrap();
    let zero = binary()
        .args([
            "--flags",
            temp.path().join("flags.json").to_str().unwrap(),
            "--repo",
            repo.to_str().unwrap(),
            "--json",
        ])
        .output()
        .unwrap();
    assert_eq!(zero.status.code(), Some(0));
    let review = binary()
        .args([
            "--flags",
            temp.path().join("flags.json").to_str().unwrap(),
            "--repo",
            repo.to_str().unwrap(),
            "--json",
            "--fail-on-review",
        ])
        .output()
        .unwrap();
    assert_eq!(review.status.code(), Some(4));
    let large = repo.join("large.txt");
    fs::write(&large, vec![b'x'; 5 * 1024 * 1024 + 1]).unwrap();
    let incomplete = binary()
        .args([
            "--flags",
            temp.path().join("flags.json").to_str().unwrap(),
            "--repo",
            repo.to_str().unwrap(),
            "--json",
        ])
        .output()
        .unwrap();
    assert_eq!(incomplete.status.code(), Some(3));
    assert!(String::from_utf8(incomplete.stderr)
        .unwrap()
        .contains("exceeds 5 MiB"));
}

#[test]
fn review_gate_and_invalid_input_use_documented_codes() {
    let temp = tempdir().unwrap();
    fs::write(
        temp.path().join("flags.json"),
        r#"{"flags":[{"key":"unknown-state"}]}"#,
    )
    .unwrap();
    let review = binary()
        .args(["--flags", temp.path().join("flags.json").to_str().unwrap()])
        .args([
            "--repo",
            temp.path().to_str().unwrap(),
            "--json",
            "--fail-on-review",
        ])
        .output()
        .unwrap();
    assert_eq!(review.status.code(), Some(4));

    fs::write(temp.path().join("broken.json"), "not json").unwrap();
    let invalid = binary()
        .args(["--flags", temp.path().join("broken.json").to_str().unwrap()])
        .args(["--repo", temp.path().to_str().unwrap()])
        .output()
        .unwrap();
    assert_eq!(invalid.status.code(), Some(2));
    assert!(String::from_utf8(invalid.stderr)
        .unwrap()
        .contains("not valid JSON"));
}

#[test]
// @claim:cli-demo
fn cli_demo_creates_a_temporary_plan_without_reading_the_working_directory() {
    let temp = tempdir().unwrap();
    let output = binary()
        .current_dir(temp.path())
        .arg("demo")
        .output()
        .unwrap();
    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(stdout.contains("Sample complete: 1 removal candidate, 3 references."));
    let plan = stdout
        .lines()
        .find_map(|line| line.strip_prefix("Plan: "))
        .expect("demo should print its plan path");
    let plan_text = fs::read_to_string(plan).unwrap();
    assert!(plan_text.contains("REMOVE CANDIDATE"));
    assert!(plan_text.contains("Zero observed evaluations never proves"));
    assert!(!temp.path().join("removal-plan.md").exists());
}
