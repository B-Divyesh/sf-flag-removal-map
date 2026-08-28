# Adversarial first-read review 2 — FAIL

- Product: Flag Removal Map
- Live URL: <https://flag-removal-map.sociobot.in>
- Candidate reviewed: `fa27e809a10d4e5f02831ce620a9465f154bafa2`
- Reviewed: 2026-08-28 UTC
- Viewports: 390 × 844 and 1440 × 900, fresh Chromium contexts
- Clean claim-test clone: `/tmp/flag-review-2.aYGZ4S`
- Review posture: first-time visitor, no account, no prior product context

## Verdict

**FAIL.** There are 24 findings, including seven blocking findings. The first screen and one-click demo are substantially clearer than review 1, and all 24 command strings in `.factory/claims.json` exit successfully. The product still cannot pass because the published dated-evidence rule is false in both implementations, the live home page has serious accessibility failures, several earlier claim/routing/metadata findings are only partly fixed, and public claims remain unlisted or unproved.

No product source was modified during this review.

## Cold first screen

The following interpretation was recorded before scrolling or opening DevTools.

| Question | 390 × 844 | 1440 × 900 |
| --- | --- | --- |
| What does it do? | Reviews a completed feature flag by combining provider status, usage, and code references into a removal plan. | Same. |
| For whom? | Small engineering teams retiring completed feature flags. | Same. |
| What should I click first? | **Try it with sample data**. It is the red primary action and is fully visible. | Same. |

The first-read gate passes. Exact copy: “Review completed flags before removal.” and “For small engineering teams retiring completed flags, combine provider status, recent usage, and code references into one review plan.” The mobile first screen has no horizontal overflow and shows the primary and secondary actions before the map.

## Findings, ordered by severity

### BLOCKING F-2-1 — the dated-evidence decision rule is false

- Quotes: landing, “Completed status and dated zero usage”; demo, “A zero count needs a start and end date”; `.factory/claims.json`, “A removal candidate needs completed status and dated zero usage.”
- Live evidence: the default browser sample contains only `count: 0` and `window_days: 30`. It contains no start date, end date, or `as_of`, yet it immediately returns **Removal candidate**.
- CLI evidence: a clean run with `{"window_days":30,"evaluations":{"checkout-v2":0}}` returned `classification: "remove"` while the report showed `"as_of": null`.
- Code evidence: browser `classify()` checks only `days > 0`; Rust `classify()` checks only `window_days > 0`. The registered site test searches source text for `days <= 0` and the phrase “does not prove safety”; it never supplies an undated counterexample.
- Why this misleads: the copy tells a reviewer that the zero count is anchored to dates when neither implementation establishes when the window ended. A stale export can therefore look like current removal evidence.
- Concrete fix: require a valid end timestamp (`as_of`) plus a positive window length in both browser and CLI, or require explicit start/end dates. Missing or invalid dates must classify as **Review**. Add browser/CLI parity tests for dated, undated, invalid-date, stale-date, active, nonzero, and missing-evidence cases.
- History: reopens review-1 claim subfindings `UC-L15`, `UC-L25`, `UC-L36`, `UC-L41`, `UC-R14`, and `UC-R15`.

### BLOCKING F-2-2 — the example command is a keyboard-inaccessible scroll region

- Location: landing install section, `<pre aria-label="Example command">`.
- Live evidence: Axe 4.11 reports serious `scrollable-region-focusable` on desktop in light and dark themes. The long command overflows horizontally, but neither the `pre` nor a descendant is focusable.
- Why this blocks: a keyboard user cannot reach and scroll the full command, so the documented real first step is not fully operable.
- Concrete fix: make the scroll container focusable with `tabindex="0"`, retain a visible focus state and accessible label, and add a live Axe/keyboard assertion at desktop width.

### BLOCKING F-2-3 — the hero caption temporarily fails text contrast during its entry animation

- Quotes: “47° CODE”, “3 sample references”, and “Human review required”.
- Live evidence: during the 500 ms `.hero-map` opacity animation, Axe reports serious `color-contrast`. At the sampled light-theme state the effective contrast was 2.38:1; at a dark-theme sampled state it was 4.36:1. Both require 4.5:1 for the 11 px text.
- Why this blocks: meaningful caption text is faded with the whole map, so its contrast depends on animation progress. Reduced-motion users avoid the transition, but the default experience still enters nonconforming states.
- Concrete fix: keep caption opacity at 1 and animate only a decorative layer or transform. Add Axe checks during animation as well as after it settles, in both themes and at both widths.

### BLOCKING F-2-4 — review-1 F3 is only partly fixed: claim labels exist, but several tests do not prove their claims

- The 24 registered commands all exit 0. This finding is not a hidden command failure; it is a claim-evidence failure.
- `rust-msrv` says Rust 1.78 is supported but ran `cargo test --all-targets` on `rustc 1.98.0`. No 1.78 toolchain was used.
- `repository-read-only` reuses `documented_json_workflow_runs_end_to_end`; it does not snapshot file content, metadata, or paths before and after the run.
- `cli-no-egress` reuses the same test; it does not deny or intercept network access.
- `json-stdout-only` does not assert that no plan file was written.
- `combined-evidence-plan` uses one repository and `--json`; it does not verify the README’s Markdown output or “one or more repositories” case.
- `exit-codes` asserts only 2 and 4 even though README also publishes 0 and 3.
- `single-binary` runs `cargo package`; it does not inspect/install the package and assert exactly one executable target.
- Browser and site claim commands place `--test-name-pattern` after the test file. The observed output runs all four browser tests or all six site tests instead of isolating the named claim.
- Multiple claim IDs point to the same untagged Rust test, contrary to the one-claim/one-tag contract.
- Why this blocks: review 1’s F3 required observable, clean-sandbox evidence. Adding registry rows without the asserted observable leaves those earlier claims untested.
- Concrete fix: give every retained claim one uniquely tagged test that exercises its exact public promise. Run MSRV in a Rust 1.78 toolchain, hash the repository tree for read-only behavior, deny network for CLI flows, assert plan absence, test multiple roots, cover all exit codes, inspect package binaries, and make the Node filters actually select one test.

### BLOCKING F-2-15 — review-1 F7 is half-fixed: returning home does not focus or announce the H1

- Live evidence: direct `/demo/`, `/privacy/`, `/terms/`, and 404 loads focus their H1. Selecting **Start for real**, selecting the home wordmark from `/demo/`, or using Back to return home leaves `document.activeElement` as `BODY`.
- Code evidence: `if (location.pathname !== "/") requestAnimationFrame(focusRoute);` explicitly excludes home.
- Why this blocks: focus behavior changes by destination. A keyboard or screen-reader visitor returning to the main route is not placed at or notified of the destination heading.
- Concrete fix: apply route focus/announcement to home as well, including pageshow/back-forward navigation, and add browser assertions for Demo → Home, Privacy → Home, and browser Back/Forward.

### BLOCKING F-2-16 — review-1 F6 is half-fixed: legal and 404 metadata is incomplete

- Live evidence: `/privacy/` and `/terms/` have `twitter:card` but no `twitter:title`, `twitter:description`, or `twitter:image`. The designed 404 has no Open Graph fields, Twitter card fields, or apple-touch icon.
- Test gap: `@claim:route-metadata` checks only that each main route contains some title and canonical link; it does not assert the required metadata set or inspect 404.
- Why this blocks: prior F6 required per-route canonical, OG, Twitter, and mobile icon metadata. The implementation and its claim test cover only part of that requirement.
- Concrete fix: give every published route the complete metadata set, decide and document whether the 404 should be indexed, then test every required field and the 1200 × 630 image dimensions per route.

### BLOCKING F-2-17 — review-1 F8 is half-fixed on the designed 404

- Live evidence: home, demo, privacy, and terms share the full header/footer. The 404 header has only the wordmark; it omits Demo, Install, Privacy, and theme controls. Its footer omits the external source link.
- Additional accuracy problem: every footer says `build 7cde0dd`, the review-1 commit, while the reviewed candidate is `fa27e80`.
- Why this blocks: review 1 explicitly required one shell on every route plus an accurate version/build ID. The error route still changes navigation and publishes stale provenance.
- Concrete fix: use the shared header/footer on 404 and inject the real build SHA at build time. Add the 404 to the shell and build-ID contract tests.

### HIGH F-2-5 — “No accounts” is an unlisted claim

- Quote/location: landing first-screen fact, “No accounts.”
- Why this matters: no `.factory/claims.json` entry asserts the absence of account or authentication behavior.
- Concrete fix: add a `no-accounts` claim with a source/runtime test, or remove the fact.

### HIGH F-2-6 — “3 sample references” is an unlisted quantitative claim

- Quote/location: hero map caption, “3 sample references.”
- Test gap: `demo-one-click` waits for the classification heading but does not assert three browser references.
- Concrete fix: register `browser-sample-references` and assert the exact three realistic rows after direct demo entry and reset.

### HIGH F-2-7 — the plan-checklist promise is unlisted

- Quote/location: landing boundary, “The plan lists evidence and human checks.”
- Test gap: no claim entry promises or checks the human-check sections. `combined-evidence-plan` inspects JSON classification/reference count only.
- Concrete fix: add `plan-checklist` and assert the evidence section and every promised human check in generated Markdown.

### HIGH F-2-8 — browser/CLI parity remains an unlisted claim

- Quote/location: demo, “Edit the sample to see the same decision rule as the CLI.”
- Evidence: no claim entry or test feeds the same fixtures through both implementations. F-2-1 already demonstrates an untested edge of this assertion.
- Concrete fix: add a `browser-cli-parity` claim and compare classifications/reasons for all rule branches, or remove “the same”.

### HIGH F-2-9 — the `--flag` selection claim is unlisted

- Quote/location: README, “Repeat `--flag KEY` to select flags.”
- Concrete fix: register and test repeated selection, missing requested keys, and multiple selected keys.

### HIGH F-2-10 — the `--exclude` behavior claim is unlisted

- Quote/location: README, “Repeat `--exclude NAME` to skip a directory name.”
- Concrete fix: register and test one and multiple excludes with matching nested directories.

### HIGH F-2-11 — exit code 0 is an unlisted claim

- Quote/location: README, “`0`: analysis completed.”
- Existing `exit-codes` claim is limited to invalid-input and review-gate codes.
- Concrete fix: expand the registered claim and uniquely tagged test to cover exit 0.

### HIGH F-2-12 — exit code 3 is an unlisted claim

- Quote/location: README, “`3`: a repository could not be scanned completely.”
- Existing `exit-codes` claim and its test do not cover code 3.
- Concrete fix: add an incomplete-scan fixture and assert exit 3 plus the warning and classification downgrade.

### HIGH F-2-13 — the published `npm test` scope is unlisted

- Quote/location: README, “`npm test` runs Rust unit, integration, documentation, and site tests.”
- Concrete fix: register a script-contract claim that inspects/executes the defined pipeline, or state only “Run `npm test`.”

### HIGH F-2-14 — the privacy page publishes an unlisted compound claim

- Quote/location: `/privacy/`, “The site has no accounts, analytics, advertising, cookies, or remote fonts.”
- Test gap: the unregistered `@claim:privacy-no-egress` source scan covers remote scripts/fonts and fetch-like APIs, but not accounts, advertising, cookies, or runtime storage across the full site.
- Concrete fix: split the sentence into testable claims and register runtime network, cookie, storage, and source assertions for each retained promise.

### HIGH F-2-18 — the required first-screen offline and price facts are absent

- Location: first-screen facts are “Runs from local files”, “Does not edit repositories”, and “No accounts”.
- Why this matters: the mandatory first-screen shape calls for short privacy/offline/price facts. “Runs from local files” does not plainly promise offline operation, and the visitor must scroll or open README/LICENSE to infer cost.
- Concrete fix: use three explicit facts such as “Works offline after the first visit”, “Does not edit repositories”, and “Free under the MIT License”, each mapped to the existing applicable claim test.

### HIGH F-2-19 — the desktop Demo navigation target is only 34 px wide

- Live evidence: the visible header **Demo** link measures 34 × 44 px at 1440 px. The accessibility baseline requires at least 44 × 44 px.
- Concrete fix: add inline padding or a 44 px minimum width to header links and assert both dimensions in the browser suite.

### MINOR F-2-20 — usage terminology still drifts

- Quotes: “recent usage”, “Check usage and references”, “recorded usage”, “dated zero usage”, “dated usage report”, and “evaluations”.
- Why this slows reading: the copy audit declares `dated usage report` as the one term, but the live page and README alternate between six forms.
- Concrete fix: use “dated usage report” for the input and “evaluation count” only for its field. For example, rewrite the lede to “…combine provider status, a dated usage report, and code references…”.

### MINOR F-2-21 — “the optional review gate fired” is jargon

- Quote/location: README exit code 4.
- Why this slows reading: “gate fired” does not say which condition occurred.
- Concrete rewrite: “`4`: `--fail-on-review` found at least one flag needing review.”

### MINOR F-2-22 — “real data” is undefined

- Quotes: demo banner, “nothing is saved to your real data”; README, “does not save sample data to real data.”
- Why this is unclear: this CLI has no browser production workspace, so “real data” names no concrete store.
- Concrete rewrite: banner, “Demo — sample data stays in this tab.” README, “The browser demo stores only a demo session marker and clears it when you leave.”

### MINOR F-2-23 — “47° CODE” is an out-of-context label

- Location: hero map caption.
- Why this slows reading: it looks like a coordinate but communicates no product state. It also participates in F-2-3’s contrast failure.
- Concrete fix: mark it purely decorative and remove it from the reading flow, or replace it with “Repository map”.

### MINOR F-2-24 — `aria-busy` becomes false before the result is rendered

- Code location: the demo submit handler sets `aria-busy="true"`, schedules `run()` for 160 ms, then immediately sets `aria-busy="false"`.
- Why this matters: assistive technology receives an inaccurate completion state before the live result changes.
- Concrete fix: set `aria-busy="false"` inside `run()` after DOM replacement, including the error path, and add an asynchronous state assertion.

## Copy audit

Method: whitespace-delimited words; hyphenated terms and URLs count as one word. Visible prose, meaningful alt text, footer prose, and conditional offline copy are included. Fragments/headings/controls are audited separately. No sentence exceeds 22 words. Landing average: 7.36 words. README average: 9.5 words.

### Landing-page sentences

| # | Words | Exact sentence | Flag / rewrite |
| ---: | ---: | --- | --- |
| 1 | 5 | “Review completed flags before removal.” | None. |
| 2 | 19 | “For small engineering teams retiring completed flags, combine provider status, recent usage, and code references into one review plan.” | Terminology drift; see F-2-20. |
| 3 | 14 | “An abstract topographic repository map showing three evidence markers joined by a red route.” | None. |
| 4 | 7 | “A flag’s age is not removal evidence.” | None. |
| 5 | 9 | “A provider export and repository search answer different questions.” | None. |
| 6 | 7 | “Compare both before changing a completed flag.” | None. |
| 7 | 6 | “Zero recent evaluations can support review.” | Terminology drift; rewrite “A zero evaluation count can support review.” |
| 8 | 9 | “It never proves a flag is safe to remove.” | None. |
| 9 | 5 | “Build a local removal plan.” | None. |
| 10 | 7 | “Build and install the CLI from source.” | None. |
| 11 | 16 | “Terminal output from flag-removal-map demo showing one removal candidate, three references, and a temporary plan path.” | None; CLI demo evidence confirms it. |
| 12 | 5 | “Enabled status or recorded usage.” | Terminology drift; rewrite “Enabled status or evaluations in the dated usage report.” |
| 13 | 6 | “Completed status and dated zero usage.” | False; see F-2-1. |
| 14 | 4 | “Review is still required.” | None. |
| 15 | 5 | “Missing, conflicting, or incomplete evidence.” | None in its definition-list context. |
| 16 | 6 | “What the CLI will not do.” | None. |
| 17 | 5 | “It does not edit code.” | Claim coverage is incomplete; see F-2-4. |
| 18 | 6 | “You decide what each reference means.” | None. |
| 19 | 5 | “It does not call providers.” | Claim coverage is incomplete; see F-2-4. |
| 20 | 8 | “The CLI reads the export files you provide.” | None. |
| 21 | 5 | “It does not certify safety.” | None. |
| 22 | 7 | “The plan lists evidence and human checks.” | Unlisted claim; see F-2-7. |
| 23 | 8 | “A local CLI for reviewing completed feature flags.” | None. |
| 24 | 3 | “You are offline.” | None. |
| 25 | 7 | “This page and the sample still work.” | Covered by offline behavior, although the demo route has no offline bar. |

### Landing headings, labels, facts, and controls

| Exact copy | Result |
| --- | --- |
| “Flag Removal Map” | Clear wordmark. |
| “FIELD NOTE 01 / FEATURE-FLAG CLEANUP” | Understandable as a decorative eyebrow. |
| “Demo” / “Install” / “Privacy” | Clear navigation nouns. |
| “Use dark theme” / “Use light theme” | Result-naming verbs. |
| “Try it with sample data” | Required sample action; clear. |
| “See a completed removal plan” | Names the result. |
| “Runs from local files” / “Does not edit repositories” / “No accounts” | Plain, but the group omits price; see F-2-18. “No accounts” is unlisted; see F-2-5. |
| “47° CODE” | Out-of-context; see F-2-23. |
| “3 sample references” | Unlisted quantitative claim; see F-2-6. |
| “Human review required” | Clear. |
| “Read / Use a provider export” | Clear in the three-step strip. |
| “Match / Check usage and references” | Terminology drift; see F-2-20. |
| “Review / Write a removal plan” | Clear. |
| “WHY MORE EVIDENCE IS NEEDED” | Makes sense out of context. |
| “BUILT-IN DECISION RULE” | Clear attribution. |
| “INSTALL THE CLI” | Clear. |
| “Copy install command” | Names the result. |
| “Install command copied” / “Select install command” | Clear success/fallback feedback. |
| “Run the bundled CLI demo” | Clear. |
| “Classification meanings” | Clear. |
| “Keep” / “Removal candidate” / “Review” | Consistent classification terms. |
| “PRODUCT BOUNDARIES” | Clear with its heading. |
| “Privacy” / “Terms” / “Source on GitHub (external)” | Clear; external destination is disclosed. |

### README sentences and copy units

| # | Words | Exact copy | Flag / rewrite |
| ---: | ---: | --- | --- |
| 1 | 14 | “Flag Removal Map is a local CLI for engineering teams removing completed feature flags.” | None. |
| 2 | 13 | “It combines a provider export, a dated usage report, and exact repository references.” | Claim coverage is incomplete for multiple repositories; see F-2-4. |
| 3 | 9 | “It writes a Markdown removal plan for human review.” | Claim coverage is incomplete; see F-2-4 and F-2-7. |
| 4 | 5 | “Open the sample-data demo: https://flag-removal-map.sociobot.in/demo/” | None. |
| 5 | 7 | “Build and install the CLI from source:” | None. |
| 6 | 6 | “Rust 1.78 or newer is supported.” | Not tested on 1.78; see F-2-4. |
| 7 | 8 | “Check the release package locally with `cargo package`.” | None. |
| 8 | 15 | “The command copies `examples/` to a new temporary directory and prints the generated plan path.” | Verified by CLI demo exercise. |
| 9 | 7 | “It does not read your current directory.” | Verified for the bundled demo. |
| 10 | 8 | “Convert your provider export to this JSON format:” | None. |
| 11 | 9 | “Usage counts are optional and stay on your computer:” | Egress proof is incomplete; see F-2-4. |
| 12 | 8 | “Create a plan across one or more repositories:” | Multiple roots are not tested; see F-2-4. |
| 13 | 9 | “Print JSON in CI without writing a plan file:” | Plan-file absence is not asserted; see F-2-4. |
| 14 | 6 | “Repeat `--flag KEY` to select flags.” | Unlisted; see F-2-9. |
| 15 | 8 | “Repeat `--exclude NAME` to skip a directory name.” | Unlisted; see F-2-10. |
| 16 | 11 | “Add `--fail-on-review` to exit 4 when a flag needs human review.” | Registered and exercised. |
| 17 | 3 | “`0`: analysis completed.” | Unlisted; see F-2-11. |
| 18 | 7 | “`2`: an input or argument was invalid.” | Registered and exercised. |
| 19 | 8 | “`3`: a repository could not be scanned completely.” | Unlisted; see F-2-12. |
| 20 | 6 | “`4`: the optional review gate fired.” | Jargon; see F-2-21. |
| 21 | 12 | “Keep: the provider says enabled, or the dated usage report records evaluations.” | Rule coverage is incomplete; see F-2-4. |
| 22 | 14 | “Removal candidate: the provider says complete and a dated usage report records zero evaluations.” | False without a date requirement; see F-2-1. |
| 23 | 11 | “Review: evidence is missing, conflicts, or the repository scan was incomplete.” | Rule coverage is incomplete; see F-2-4. |
| 24 | 13 | “‘Removal candidate’ means review the flag; it does not prove deletion is safe.” | None. |
| 25 | 19 | “Every generated plan asks a human to check ownership, rollout state, rollback, references, deployment health, and provider deletion order.” | Plan checklist is unlisted; see F-2-7. |
| 26 | 14 | “The CLI accepts the format above and JSON collections named `flags`, `items`, or `features`.” | Registered and exercised. |
| 27 | 14 | “It finds exact flag-key matches and labels code, configuration, test, documentation, and other references.” | Registered and exercised for kinds. |
| 28 | 10 | “`npm test` runs Rust unit, integration, documentation, and site tests.” | Unlisted; see F-2-13. |
| 29 | 13 | “`npm run build` compiles the release CLI and the static site into `dist/site/`.” | Registered and exercised. |
| 30 | 11 | “The CLI reads only paths you provide and never edits repositories.” | Registered test does not prove read-only behavior; see F-2-4. |
| 31 | 5 | “It makes no provider calls.” | Registered test does not deny/intercept network; see F-2-4. |
| 32 | 17 | “The browser demo uses a separate session marker and does not save sample data to real data.” | “Real data” is undefined; see F-2-22. |
| 33 | 1 | “MIT.” | Registered and exercised. |
| 34 | 2 | “See LICENSE.” | None. |

README headings—“Flag Removal Map”, “Install”, “Try the bundled sample”, “Usage”, “Exit codes”, “Decision rules”, “Develop and verify”, “Privacy and scope”, and “License”—all make sense out of context. No banned marketing adjective appears in the current landing page or README.

## Demo and sandbox evidence

| Check | Result | Evidence |
| --- | --- | --- |
| One click from landing | PASS | Primary action opens `/demo/` with **Removal candidate** already rendered. |
| Realistic sample | PARTIAL | `checkout-v2`, completed/disabled state, zero count, and three source/config/test references are realistic; the promised date is absent (F-2-1). |
| Persistent banner | PASS | “Demo — sample data, nothing is saved to your real data”, Reset demo, and Start for real remain visible. Copy is flagged separately. |
| Reset | PASS | Restores all three inputs, rerenders the removal result, and focuses Provider export. |
| Real-data isolation | PASS for exercised storage | Preloaded `real:sentinel` values in localStorage and sessionStorage survived edit, classify, reset, and exit. Only `sessionStorage["demo:flag-removal-map"]` was added, then removed by Start for real. |
| Requests during edit/classify/reset | PASS | Zero requests after the demo shell loaded. Start for real made the expected same-origin home navigation. |
| Offline reload | PASS | After service-worker control, offline `/demo/` reload rendered **Removal candidate** using only same-origin cached assets. |
| CLI demo | PASS | From an otherwise empty temporary working directory, the release binary exited 0, wrote no product output there, created `/tmp/flag-removal-map-demo-…/removal-plan.md`, and reported one candidate with three references. |

The demo is one-click and isolated, so review-1 F2 itself is fixed. The dated-input contradiction remains blocking under F-2-1.

## Claim-test execution

All commands were read verbatim from `.factory/claims.json` and run from fresh clone `/tmp/flag-review-2.aYGZ4S`. `npm ci` installed 19 packages with zero reported vulnerabilities. Every command exited 0.

The full `npm test` pipeline also passed in that clone: 7 library tests, 4 CLI integration tests, 1 documentation test, 6 site tests, and 4 browser tests. `npm run build` passed as part of the registered `build-artifacts` command.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `demo-one-click` | `npm run test:browser -- --test-name-pattern '@claim:demo-one-click'` | PASS |
| `demo-isolation` | `npm run test:site -- --test-name-pattern '@claim:demo-isolation'` | PASS |
| `browser-no-egress` | `npm run test:browser -- --test-name-pattern '@claim:browser-no-egress'` | PASS |
| `decision-rule` | `npm run test:site -- --test-name-pattern '@claim:decision-rule'` | PASS, false-positive coverage; see F-2-1/F-2-4 |
| `route-metadata` | `npm run test:site -- --test-name-pattern '@claim:route-metadata'` | PASS, incomplete coverage; see F-2-16 |
| `404-route` | `npm run test:site -- --test-name-pattern '@claim:404-route'` | PASS |
| `404-page` | `npm run test:browser -- --test-name-pattern '@claim:404-page'` | PASS |
| `accessibility-site` | `npm run test:site -- --test-name-pattern '@claim:accessibility-site'` | PASS, source-regex only; see F-2-2/F-2-3/F-2-15 |
| `cli-demo` | `cargo test --test cli cli_demo_creates_a_temporary_plan_without_reading_the_working_directory` | PASS |
| `combined-evidence-plan` | `cargo test --test cli documented_json_workflow_runs_end_to_end` | PASS, incomplete coverage; see F-2-4 |
| `exit-codes` | `cargo test --test cli review_gate_and_invalid_input_use_documented_codes` | PASS for 2/4 only |
| `provider-shapes` | `cargo test parses_common_provider_shapes` | PASS |
| `reference-kinds` | `cargo test analysis_finds_code_config_test_and_docs` | PASS |
| `repository-read-only` | `cargo test --test cli documented_json_workflow_runs_end_to_end` | PASS, no mutation assertion |
| `license-file` | `test -f LICENSE && grep -q 'Permission is hereby granted' LICENSE` | PASS |
| `cli-no-egress` | `cargo test --test cli documented_json_workflow_runs_end_to_end` | PASS, no network denial/interception |
| `source-install` | `cargo install --path . --root /tmp/flag-removal-map-claim-install` | PASS |
| `cargo-package` | `cargo package --allow-dirty` | PASS |
| `build-artifacts` | `npm run build && test -x target/release/flag-removal-map && test -f dist/site/index.html` | PASS |
| `json-stdout-only` | `cargo test --test cli documented_json_workflow_runs_end_to_end` | PASS, no absence assertion |
| `optional-evaluations` | `cargo test --test cli review_gate_and_invalid_input_use_documented_codes` | PASS |
| `rust-msrv` | `cargo test --all-targets` | PASS on Rust 1.98, not 1.78 |
| `single-binary` | `cargo package --allow-dirty` | PASS, executable count not asserted |
| `offline-reload` | `npm run test:browser` | PASS |

No listed command failed, so there is no “failing claim test” blocker. F-2-4 and F-2-5 through F-2-14 remain because passing commands do not establish all published promises and several public claims have no registry entry.

## Historical finding reconciliation

### Review-1 top-level findings

| Earlier finding | Current result | Evidence |
| --- | --- | --- |
| F1 audience/action | FIXED | Audience and primary sample action are clear at both widths. |
| F2 demo/CLI demo | FIXED | Direct populated demo, banner/reset/exit, separate marker, offline flow, and CLI temp demo all work. |
| F3 claim verification | **HALF-FIXED — BLOCKING** | Registry exists and all commands pass, but exact evidence gaps and unlisted claims remain; F-2-4 through F-2-14. |
| F4 404 routing | FIXED | Unknown URL returns designed page with HTTP 404 and preserves the URL. |
| F5 nonexistent release | FIXED | README now documents source install only. |
| F6 metadata | **HALF-FIXED — BLOCKING** | Legal Twitter fields and 404 social/mobile fields remain absent; F-2-16. |
| F7 route focus | **HALF-FIXED — BLOCKING** | Non-home routes focus H1; home returns do not; F-2-15. |
| F8 shared shell | **HALF-FIXED — BLOCKING** | Main/legal routes align; 404 and build ID do not; F-2-17. |
| F9 themed copy | FIXED for the quoted headings | Functional headings are now direct. Remaining small copy issues have new IDs F-2-20 through F-2-23. |
| F10 action labels | FIXED | Primary, classification, copy, and theme controls name their result. |
| F11 external disclosure | FIXED | Visible source links say “Source on GitHub (external)”. |

### Review-1 unlisted-claim IDs

Every prior claim subfinding was checked in current copy/code. IDs not listed as reopened below were either removed or replaced with a claim whose observable behavior was confirmed.

- Reopened landing IDs: `UC-L05`, `UC-L09`, `UC-L13`, `UC-L14`, `UC-L15`, `UC-L18`, `UC-L24`–`UC-L28`, `UC-L31`, `UC-L33`, and `UC-L38`–`UC-L45`. They map to F-2-1 and F-2-4 through F-2-8.
- Fixed or removed landing IDs: `UC-L01`–`UC-L04`, `UC-L06`–`UC-L08`, `UC-L10`–`UC-L12`, `UC-L16`–`UC-L17`, `UC-L19`–`UC-L23`, `UC-L29`–`UC-L30`, `UC-L32`, `UC-L34`–`UC-L37`, and `UC-L46`.
- Reopened README IDs: `UC-R02`–`UC-R03`, `UC-R05`, `UC-R09`–`UC-R18`, `UC-R20`–`UC-R21`, `UC-R23`–`UC-R24`, and `UC-R26`. They map to F-2-1, F-2-4, and F-2-7 through F-2-14.
- Fixed or removed README IDs: `UC-R01`, `UC-R04`, `UC-R06`–`UC-R08`, `UC-R19`, `UC-R22`, `UC-R25`, and `UC-R27`–`UC-R29`.

The polish-1 closure table is therefore not fully confirmed. The handoff statement “No known gaps remain” is contradicted by the live and code evidence above.

## Structure, link, identity, and accessibility checks

| Check | Result | Evidence |
| --- | --- | --- |
| Title pattern | PASS | Home, demo, privacy, terms, and 404 have route-specific plain titles under 60 characters. |
| One H1 / heading order | PASS | One H1 on every exercised route; no heading-level skip in rendered states. |
| Description/canonical | PASS | Present on every exercised route. |
| OG/Twitter/apple | FAIL | Legal Twitter fields and 404 metadata are incomplete; F-2-16. |
| Favicon/social art | PASS where referenced | SVG favicon loads; apple icon is 180 × 180; social card is 1200 × 630 and product-specific. |
| Designed HTTP 404 | PASS | Unknown path returns HTTP 404 with a styled H1 and Return home action. |
| Deep links/reload | PASS | `/demo/`, `/privacy/`, `/terms/`, and `/demo/#result-panel` resolve. |
| Back/home focus | FAIL | Home returns leave focus on BODY; F-2-15. |
| Link crawl | PASS | All internal pages/assets and the GitHub source link returned 200; no dead declared link was found. |
| Shared header/footer | FAIL on 404 | F-2-17. |
| Privacy/Terms | PASS | Both are linked from every footer, including 404. |
| Visual identity | PASS | Topographic field-map art, paper/night palette, square survey marks, serif/monospace pairing, and no-gradient layout are recognizably specific to this product. |
| 390 px layout | PASS | `scrollWidth` equals 390 on every route; no visible control is below 44 × 44 px at mobile width. |
| Desktop targets | FAIL | Header Demo link is 34 × 44 px; F-2-19. |
| Axe | FAIL | Home has the serious failures in F-2-2/F-2-3. Demo, privacy, terms, and settled 404 state had zero WCAG A/AA violations in the exercised scans. |
| Console/page errors | PASS on product routes | None on home/demo/privacy/terms. Chromium reports the expected document 404 on the error route. |
| Reduced motion | PASS | CSS removes meaningful transition duration under `prefers-reduced-motion`. |
| JS budget | PASS | Live hashed JavaScript is 6.37 kB raw, below the 150/200 kB limits. |
| Security/cache headers | PASS | Same-origin CSP, Permissions-Policy, Referrer-Policy, nosniff, HSTS, immutable hashed assets, and no-store service worker are live. |

## Missed leverage

No `.factory/brief.json` is present, so this check used the public README, CLI behavior, and product contract. No new AI, sync, import, or export feature is justified for this round. The CLI already accepts provider/usage JSON, scans local repositories, and exports Markdown or JSON. An AI step would add cost, nondeterminism, and privacy complexity to a rule-based safety workflow. Direct provider APIs would conflict with the documented local-file/no-provider-call scope. The obvious leverage is correctness and proof of the existing decision rule, not another feature.

## What would make this perfect

Resolve every finding above, then rerun the review from a fresh browser and a true Rust 1.78 environment. In particular: require genuinely dated zero-usage evidence; add browser/CLI parity fixtures; replace claim-label tests with observable one-claim tests; eliminate all unlisted claims; keep every animated text state above 4.5:1; make the command scroll region and every target keyboard/touch accessible; focus and announce home on return; complete metadata and the shared 404 shell; publish the real build SHA; normalize usage terminology; and rerun live Axe during and after animation. A PASS requires zero remaining findings, not only green command exits.
