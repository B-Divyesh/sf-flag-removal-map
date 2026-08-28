# Adversarial first-read review 3 — FAIL

- Product: Flag Removal Map
- Live URL: <https://flag-removal-map.sociobot.in>
- Candidate reviewed: `3ef4c6c050b5e0727e50271ff317916b408a5e9c`
- Reviewed: 2026-08-28 UTC
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900
- Clean claim-test clone: `/tmp/flag-removal-map-review3.97qcsZ`

## Verdict

**FAIL.** One blocking finding remains. The CLI accepts a malformed observation-end timestamp as removal evidence, while the browser demo rejects the same value. This makes the published browser/CLI parity claim false and reopens review-2 findings `F-2-1` and `F-2-4`.

All other checks in this round passed, including first-read clarity, the one-click sandbox, all 23 registered claim commands, route structure, link crawl, keyboard route focus, live offline reload, and Axe on every route in both themes. A passing command suite does not make the contradictory decision result safe.

## Cold first screen

Recorded before scrolling in separate fresh contexts:

| Question | 390 px | Desktop |
| --- | --- | --- |
| What does it do? | It helps engineering teams decide whether a completed feature flag is ready for human-reviewed removal. | Same. |
| For whom? | Small engineering teams retiring completed feature flags. | Same. |
| What should I click first? | **Try it with sample data** to open a finished removal-plan example. | Same. |

The first-read gate passes. The visible copy answers all three questions: “Review completed flags before removal.”, “For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan.”, and “Try it with sample data”. At 390 px the primary action was visible at y=473–526 with no horizontal overflow.

## Findings

### BLOCKING F-3-1 — a malformed date produces a removal candidate in the CLI but review evidence in the demo

- Reopens: `F-2-1` (dated-evidence rule) and `F-2-4` (claim evidence / browser-CLI parity).
- Public claim: `.factory/claims.json` `browser-cli-parity`: “The demo uses the same decision rule as the CLI.” The demo itself says, “Edit the sample to see the same decision rule as the CLI.”
- Exact reproduction: replace the bundled sample `as_of` value with `2026-08-28garbageT00:00:00Z` and run the CLI. It returns `"classification": "remove"` and repeats the malformed value in its reason: “The dated 30-day observation window ending 2026-08-28garbageT00:00:00Z reports zero evaluations…”. Entering the exact same JSON into live `/demo/` returns **Review evidence** with: “Zero evaluations need a valid observation end date from the last 90 days.”
- Code location: `src/lib.rs` `iso_date_days()` accepts only `value.get(..10)` and ignores the malformed suffix. `site/src/main.ts` uses `Date.parse(asOf)`, which rejects the whole malformed value.
- Why this loses or misleads a first-time visitor: the product tells a team that a valid dated usage report is required before a removal candidate is shown. A damaged export can instead be promoted by the real CLI—the tool the visitor installs—to a removal candidate. The advertised parity is also false.
- Concrete fix: parse the complete value as a strict ISO date or RFC 3339 timestamp in the CLI; reject any suffix or invalid timestamp. Put the decision rule in one shared, fixture-tested definition if possible. Extend `@claim:browser-cli-parity` to run **both** implementations for valid, undated, invalid, stale, active, and malformed-suffix inputs and compare classifications/reasons. The malformed case must assert `review` in both.

## Copy audit

Method: visible sentences and meaningful image alt text; whitespace-delimited words; URLs and hyphenated tokens count as one word. No landing or README sentence exceeds 22 words. No banned marketing adjective appears. The stable terms are **provider export**, **dated usage report**, **evaluation count**, **references**, and **removal plan**.

### Landing-page sentences

| Words | Exact sentence | Result |
| ---: | --- | --- |
| 5 | Review completed flags before removal. | Pass |
| 21 | For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan. | Pass |
| 14 | An abstract topographic repository map showing three evidence markers joined by a red route. | Pass; meaningful alt text |
| 7 | A flag’s age is not removal evidence. | Pass |
| 9 | A provider export and repository search answer different questions. | Pass |
| 7 | Compare both before changing a completed flag. | Pass |
| 7 | A zero evaluation count can support review. | Pass |
| 9 | It never proves a flag is safe to remove. | Pass |
| 5 | Build a local removal plan. | Pass |
| 7 | Build and install the CLI from source. | Pass |
| 16 | Terminal output from flag-removal-map demo showing one removal candidate, three references, and a temporary plan path. | Pass; meaningful alt text |
| 9 | Enabled status or evaluations in the dated usage report. | Pass |
| 7 | Completed status and recent, dated zero evaluations. | Pass, subject to F-3-1 |
| 4 | Review is still required. | Pass |
| 5 | Missing, stale, conflicting, or incomplete evidence. | Pass |
| 5 | It does not edit code. | Pass; registered claim |
| 6 | You decide what each reference means. | Pass |
| 5 | It does not call providers. | Pass; registered claim |
| 8 | The CLI reads the export files you provide. | Pass |
| 5 | It does not certify safety. | Pass |
| 7 | The plan lists evidence and human checks. | Pass; registered claim |
| 8 | A local CLI for reviewing completed feature flags. | Pass |
| 3 | You are offline. | Pass; conditional status |
| 7 | This page and the sample still work. | Pass; registered claim |

### Landing headings, facts, and controls

All headings make sense in isolation. “FIELD NOTE 01 / FEATURE-FLAG CLEANUP” functions as a decorative eyebrow rather than the page headline. The field-cartography identity is product-specific rather than a generic SaaS template: original topographic art, paper/night palette, square survey marks, and serif/monospace pairing match `.factory/design.md`.

| Copy | Result |
| --- | --- |
| Demo / Install / Privacy | Clear navigation nouns |
| Try it with sample data | Clear primary result action |
| See a completed removal plan | Clear secondary result action |
| Works offline after the first visit / Does not edit repositories / Free under the MIT License | Plain, registered facts |
| Read / Use a provider export | Clear |
| Match / Check a dated usage report and references | Clear and terminologically consistent |
| Review / Write a removal plan | Clear |
| Copy install command / Run the bundled CLI demo / Classification meanings | Clear |
| Reset demo / Start for real / Classify sample flag | Clear demo actions |
| Use dark theme / Use light theme | Clear resulting-theme actions |

### README sentences and copy units

| Words | Exact sentence | Result |
| ---: | --- | --- |
| 14 | Flag Removal Map is a local CLI for engineering teams removing completed feature flags. | Pass |
| 13 | It combines a provider export, a dated usage report, and exact repository references. | Pass |
| 9 | It writes a Markdown removal plan for human review. | Pass |
| 6 | Try the one-click sample at https://flag-removal-map.sociobot.in/demo/. | Pass |
| 7 | Build and install the CLI from source. | Pass |
| 8 | Check the release package locally with `cargo package`. | Pass |
| 14 | The command copies `examples/` to a new temporary directory and prints the generated plan path. | Pass |
| 7 | It does not read your current directory. | Pass |
| 8 | Convert your provider export to this JSON format. | Pass |
| 6 | A dated usage report is optional. | Pass |
| 14 | A zero count needs a valid `as_of` end timestamp from the last 90 days. | **Contradicted by F-3-1** |
| 8 | Create a plan across one or more repositories. | Pass |
| 10 | Print JSON in CI without writing a plan file. | Pass |
| 7 | Repeat `--flag KEY` to select flags. | Pass |
| 8 | Repeat `--exclude NAME` to skip a directory name. | Pass |
| 11 | Add `--fail-on-review` to exit 4 when a flag needs human review. | Pass |
| 3 | `0`: analysis completed. | Pass |
| 7 | `2`: an input or argument was invalid. | Pass |
| 8 | `3`: a repository could not be scanned completely. | Pass |
| 8 | `4`: `--fail-on-review` found at least one flag needing review. | Pass |
| 10 | Keep: the provider says enabled, or the dated usage report records evaluations. | Pass |
| 14 | Removal candidate: the provider says complete and a recent dated usage report records zero evaluations. | **Contradicted by F-3-1** |
| 10 | Review: evidence is missing, stale, conflicts, or the repository scan was incomplete. | Pass |
| 13 | “Removal candidate” means review the flag; it does not prove deletion is safe. | Pass |
| 19 | Every generated plan asks a human to check ownership, rollout state, rollback, references, deployment health, and provider deletion order. | Pass |
| 14 | The CLI accepts JSON collections named `flags`, `items`, or `features`. | Pass |
| 14 | It finds exact flag-key matches and labels code, configuration, test, documentation, and other references. | Pass |
| 11 | `npm run build` compiles the release CLI and the static site into `dist/site/`. | Pass |
| 10 | The CLI reads only paths you provide and never edits repositories. | Pass |
| 5 | It makes no provider calls. | Pass |
| 14 | The browser demo stores only a demo session marker and clears it when you leave. | Pass |
| 1 | MIT. | Pass |
| 2 | See LICENSE. | Pass |

README headings—Flag Removal Map, Install, Try the bundled sample, Usage, Exit codes, Decision rules, Develop and verify, Privacy and scope, and License—make sense out of context. No copy-only finding was raised; the two marked rows are the same correctness failure, not separate wording defects.

## Demo and sandbox verification

| Check | Result | Evidence |
| --- | --- | --- |
| One-click entry | Pass | Primary landing action opens `/demo/`; its first rendered state is **Removal candidate**. |
| Realistic sample | Pass | Completed `checkout-v2`, today-ended 30-day zero-evaluation report, and three code/config/test references. |
| Persistent banner | Pass | “Demo — sample data stays in this tab.” with Reset demo and Start for real. |
| Reset | Pass | Restores the populated candidate and exactly three references. |
| Storage isolation | Pass | Preloaded `real:sentinel` keys in localStorage and sessionStorage survived classify/reset/exit; only `sessionStorage["demo:flag-removal-map"]` was created, then removed on Start for real. |
| No post-load egress | Pass | Request interception observed zero requests during classify and reset. |
| Offline | Pass | After service-worker control, an offline live `/demo/` reload rendered **Removal candidate**. Observed live requests were same-origin only. |
| CLI demo | Pass | The clean-clone `cli-demo` claim command ran `flag-removal-map demo` from an empty temporary directory and asserted an external temporary plan path. |

## Claims

`.factory/claims.json` contains 23 entries. Each listed command was run verbatim from the clean clone above after `npm ci`; all exited 0.

| Claim IDs with passing registered commands |
| --- |
| `demo-one-click`, `demo-isolation`, `browser-no-egress`, `offline-reload`, `browser-cli-parity`, `decision-rule` |
| `route-metadata`, `404-route`, `accessible-interactions`, `first-screen-facts`, `privacy-site` |
| `cli-demo`, `combined-evidence-plan`, `plan-checklist`, `exit-codes`, `provider-shapes`, `reference-kinds` |
| `repository-read-only`, `json-options`, `source-install`, `cargo-package`, `build-artifacts`, `license-file` |

The landing and README’s user-reliant capability, privacy, sample-count, license, and decision-rule statements have corresponding registry entries; no separate unlisted-claim finding was found. `browser-cli-parity` and `decision-rule` are nevertheless not proved for malformed timestamps, and are contradicted by the reproduction in F-3-1.

## Structure, accessibility, and routes

| Check | Result |
| --- | --- |
| Titles, one H1, description, canonical, OG/Twitter, favicon, apple touch icon | Pass on home, demo, privacy, terms, and 404 |
| Designed 404 | Pass; unknown URL returned HTTP 404, retained its URL, and showed “This map page does not exist.” |
| Deep links, demo query compatibility, back button, and route focus | Pass; `/demo/`, `/privacy/`, `/terms/`, `?demo=1`, and Back to home placed focus on H1 and updated the polite announcement. |
| Link crawl | Pass; all internal links returned 200; the declared GitHub link was reachable and visibly marked external. |
| Shared shell | Pass; every route includes the consistent header, Privacy/Terms footer links, Factory attribution, version, and build coordinate. |
| Mobile and targets | Pass; home `scrollWidth` was 390 at 390 px; the desktop Demo target was at least 44 × 44 px. |
| Accessibility | Pass; Axe WCAG 2 A/AA returned no violations on home, rendered demo, privacy, terms, and 404 in both light and dark themes at 390 px. |
| Console | Pass; no console errors on home/demo/privacy/terms. |
| Visual identity | Pass; it is a distinct field-cartography system, not a generic template. |

`npm test` passed locally (8 Rust unit tests, 9 CLI integration tests, 1 doctest, 7 site tests, and 6 browser tests). `npm run build` was also exercised through the clean-clone `build-artifacts` claim and produced the release CLI plus `dist/site/`.

## History reconciliation

Every earlier review, polish document, and handoff was read. “Fixed” below means confirmed against live behavior and current source, not merely the repair note.

| Earlier finding | Current result |
| --- | --- |
| Review-1 `F1` | Fixed: audience and first action are visible and plain. |
| Review-1 `F2` | Fixed: direct populated browser demo, sandbox banner/reset/exit, bundled CLI demo, and temporary output. |
| Review-1 `F3` | **Half-fixed:** registry and tagged commands exist, but its parity evidence misses—and product behavior fails—the malformed-date case in F-3-1. |
| Review-1 `F4` | Fixed: designed HTTP 404. |
| Review-1 `F5` | Fixed: source installation is the documented route. |
| Review-1 `F6` | Fixed: complete per-route metadata and icons. |
| Review-1 `F7` | Fixed: home and non-home focus/announce on direct, click, and Back navigation. |
| Review-1 `F8` | Fixed: shared shell and current build coordinate are present, including 404. |
| Review-1 `F9`–`F11` | Fixed: direct headings, result-naming actions, and external-link disclosure. |
| Review-2 `F-2-1` | **Regressed/half-fixed:** malformed `as_of` text is accepted as current evidence by the CLI; F-3-1. |
| Review-2 `F-2-2`, `F-2-3` | Fixed: command region is focusable; animated text scan has no contrast violation. |
| Review-2 `F-2-4` | **Half-fixed:** exact malformed fixture parity was not tested and is false; F-3-1. |
| Review-2 `F-2-5`–`F-2-14` | Fixed: facts/quantities, plan checks, options, exit codes, privacy copy, and registered tests are present and exercised. |
| Review-2 `F-2-15`–`F-2-19` | Fixed: route focus, metadata, 404 shell/build ID, first-screen facts, and 44 px nav target all verified. |
| Review-2 `F-2-20`–`F-2-24` | Fixed: terminology, exit-code language, demo wording, decorative caption, and async busy state are correct. |

The review-1 unlisted-claim families (`UC-L01`–`UC-L46`, `UC-R01`–`UC-R29`) were cross-checked against the current registry and public copy. They remain removed, narrowed, or mapped as documented in polish 2, except the decision/parity subsets covered by the reopened F-3-1.

## Missed leverage

No `.factory/brief.json` is present, so this check used the committed product contract, README, and implemented CLI. No AI, sync, or additional import/export feature is an obvious missing step: the job is deliberately local, deterministic analysis of already-exported provider and usage files, with Markdown/JSON output. Adding an AI layer or provider connection would weaken its offline/no-provider-call promise. Correct validation of the existing evidence is the needed leverage.

## What would make this perfect

Make date parsing strict and identical in browser and CLI, then prove every decision fixture—including malformed timestamp suffixes—through the single parity claim. Rerun this full cold review from a clean clone and fresh live browser contexts. A PASS requires this report to have zero findings.
