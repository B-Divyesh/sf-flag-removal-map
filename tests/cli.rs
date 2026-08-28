use std::fs;
use std::process::Command;
use tempfile::tempdir;

fn binary() -> Command {
    Command::new(env!("CARGO_BIN_EXE_flag-removal-map"))
}

#[test]
fn help_documents_inputs_and_exit_codes() {
    let output = binary().arg("--help").output().unwrap();
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(output.status.success());
    assert!(stdout.contains("--evaluations"));
    assert!(stdout.contains("EXIT CODES"));
    assert!(stdout.contains("zero-evaluation window"));
}

#[test]
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
        r#"{"window_days":30,"evaluations":{"checkout-v2":0}}"#,
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
