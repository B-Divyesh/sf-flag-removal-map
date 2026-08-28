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
    assert!(stdout.contains("recent, dated zero evaluations"));
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
fn cli_does_not_edit_the_repository_or_need_network_dependencies() {
    let temp = tempdir().unwrap();
    let repo = temp.path().join("repo");
    fs::create_dir(&repo).unwrap();
    let source = repo.join("flag.ts");
    fs::write(&source, "checkout-v2").unwrap();
    let before = fs::read(&source).unwrap();
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
            repo.to_str().unwrap(),
            "--json",
        ])
        .output()
        .unwrap();
    assert!(output.status.success());
    assert_eq!(fs::read(&source).unwrap(), before);
    assert!(!include_str!("../Cargo.lock").contains("reqwest"));
    assert!(!include_str!("../Cargo.lock").contains("hyper"));
}

#[test]
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
