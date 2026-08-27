use clap::{ArgAction, Parser};
use flag_removal_map::{analyze, render_markdown, AnalysisOptions, Classification};
use std::fs;
use std::path::PathBuf;
use std::process::ExitCode;

#[derive(Debug, Parser)]
#[command(
    name = "flag-removal-map",
    version,
    about = "Map feature-flag evidence and repository references into a safe removal plan",
    long_about = "Reads offline provider/evaluation JSON, scans repositories for literal flag-key references, and emits a conservative cleanup plan. It never changes code or contacts a provider.",
    after_help = "CLASSIFICATION\n  keep    Provider says active/enabled or evaluations are present\n  remove  Completed state plus a bounded zero-evaluation window (still requires review)\n  review  Missing, contradictory, or incomplete evidence\n\nEXIT CODES\n  0 analysis completed  2 invalid input  3 incomplete scan  4 --fail-on-review fired"
)]
struct Cli {
    /// Provider flag export JSON
    #[arg(long, value_name = "FILE")]
    flags: PathBuf,

    /// Repository root to scan; repeat for a monorepo or multiple repositories
    #[arg(long, value_name = "PATH", required = true, action = ArgAction::Append)]
    repo: Vec<PathBuf>,

    /// Optional local evaluation-count export JSON
    #[arg(long, value_name = "FILE")]
    evaluations: Option<PathBuf>,

    /// Markdown plan destination (ignored with --json)
    #[arg(long, value_name = "FILE", default_value = "flag-removal-plan.md")]
    out: PathBuf,

    /// Print the versioned report as JSON instead of writing Markdown
    #[arg(long)]
    json: bool,

    /// Analyze only this flag key; repeat to select more flags
    #[arg(long, value_name = "KEY", action = ArgAction::Append)]
    flag: Vec<String>,

    /// Ignore files/directories with this exact name; repeat as needed
    #[arg(long, value_name = "NAME", action = ArgAction::Append)]
    exclude: Vec<String>,

    /// Exit 4 after producing output when any flag is classified review
    #[arg(long)]
    fail_on_review: bool,
}

fn main() -> ExitCode {
    let cli = Cli::parse();
    match run(&cli) {
        Ok(code) => ExitCode::from(code),
        Err((code, message)) => {
            eprintln!("flag-removal-map: {message}");
            ExitCode::from(code)
        }
    }
}

fn run(cli: &Cli) -> Result<u8, (u8, String)> {
    let report = analyze(AnalysisOptions {
        flags_path: cli.flags.clone(),
        evaluation_path: cli.evaluations.clone(),
        repositories: cli.repo.clone(),
        only_flags: cli.flag.clone(),
        excludes: cli.exclude.clone(),
    })
    .map_err(|message| (2, message))?;

    if cli.json {
        let json = serde_json::to_string_pretty(&report)
            .map_err(|error| (2, format!("could not serialize report: {error}")))?;
        println!("{json}");
    } else {
        fs::write(&cli.out, render_markdown(&report))
            .map_err(|error| (2, format!("could not write {}: {error}", cli.out.display())))?;
        eprintln!(
            "Mapped {} flag(s), {} reference(s): {} keep, {} remove, {} review → {}",
            report.summary.total,
            report.summary.references,
            report.summary.keep,
            report.summary.remove,
            report.summary.review,
            cli.out.display()
        );
    }

    if !report.scan_complete {
        for warning in &report.warnings {
            eprintln!("warning: {warning}");
        }
        return Ok(3);
    }
    if cli.fail_on_review
        && report
            .flags
            .iter()
            .any(|flag| flag.classification == Classification::Review)
    {
        return Ok(4);
    }
    Ok(0)
}
