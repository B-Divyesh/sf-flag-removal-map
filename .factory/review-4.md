# Adversarial first-read review 4 — FAIL

- Product: Flag Removal Map
- Live URL: <https://flag-removal-map.sociobot.in/>
- Candidate reviewed: `2b0c205260c51ea0260f47afa96839f157693c92`
- Reviewed: 2026-08-28 UTC
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean clone at `/tmp/flag-removal-map-review4.pH7k6i`

## Verdict

**FAIL.** One high-severity finding remains. The product is clear and usable, but a public README capability is not individually registered and tested as required. A PASS requires zero findings and no untested claim.

## Cold first screen

Recorded before scrolling in separate fresh contexts:

| Question | 390 px | Desktop |
| --- | --- | --- |
| What does this do? | It helps an engineering team decide whether a completed feature flag should enter a human-reviewed removal plan. | Same. |
| For whom? | Small engineering teams retiring completed flags. | Same. |
| What should I click first? | **Try it with sample data** to see a finished example. | Same. |

The first-read gate passes. The exact visible copy is “Review completed flags before removal.”, “For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan.”, and “Try it with sample data”. The 390 px page had `scrollWidth` 390, no console errors, and the primary action was visible without scrolling.

## Findings

### HIGH F-4-1 — the README says a dated usage report is optional without a matching claim entry

- Quote/location: README, Usage: “A dated usage report is optional.”
- Evidence: `.factory/claims.json` has no `optional-usage-report` (or equivalent) claim. Its `combined-evidence-plan` entry requires a dated report; `decision-rule` only tests dated, undated, invalid, stale, malformed, and active reports when an evaluations file is supplied. `json-options` and `exit-codes` happen to invoke some no-evaluation paths, but neither claim records or directly asserts the optional-report contract.
- Why this matters: a visitor can rely on this when running the CLI with only a provider export. The claims contract requires that exact public behavior to have a named, observable clean-sandbox test, rather than incidental coverage under another promise.
- Concrete fix: add an `optional-usage-report` entry to `.factory/claims.json` and one uniquely tagged CLI integration test. From a clean temporary directory, run the documented command without `--evaluations`; assert success, a **Review** classification, and the reason that missing evidence requires review. Alternatively remove “is optional” from README.

## Copy audit

Method: visible sentences and meaningful alt text; whitespace-delimited words; URLs and hyphenated terms count as one word. No sentence exceeds 22 words. No banned marketing adjective, inconsistent core term, out-of-context heading, or non-result-naming action was found. The one claim-registry omission is F-4-1.

### Landing sentences

| Words | Exact copy | Check |
| ---: | --- | --- |
| 5 | Review completed flags before removal. | Pass |
| 21 | For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan. | Pass |
| 14 | An abstract topographic repository map showing three evidence markers joined by a red route. | Pass; alt text |
| 7 | A flag’s age is not removal evidence. | Pass |
| 9 | A provider export and repository search answer different questions. | Pass |
| 7 | Compare both before changing a completed flag. | Pass |
| 7 | A zero evaluation count can support review. | Pass |
| 9 | It never proves a flag is safe to remove. | Pass |
| 5 | Build a local removal plan. | Pass |
| 7 | Build and install the CLI from source. | Pass |
| 16 | Terminal output from flag-removal-map demo showing one removal candidate, three references, and a temporary plan path. | Pass; alt text |
| 9 | Enabled status or evaluations in the dated usage report. | Pass |
| 7 | Completed status and recent, dated zero evaluations. | Pass |
| 4 | Review is still required. | Pass |
| 5 | Missing, stale, conflicting, or incomplete evidence. | Pass |
| 5 | It does not edit code. | Pass |
| 6 | You decide what each reference means. | Pass |
| 5 | It does not call providers. | Pass |
| 8 | The CLI reads the export files you provide. | Pass |
| 5 | It does not certify safety. | Pass |
| 7 | The plan lists evidence and human checks. | Pass |
| 8 | A local CLI for reviewing completed feature flags. | Pass |
| 3 | You are offline. | Pass; conditional state |
| 7 | This page and the sample still work. | Pass |

Landing headings and controls checked: `Demo`, `Install`, `Privacy`, `Try it with sample data`, `See a completed removal plan`, the three product facts, `Read`, `Match`, `Review`, `Copy install command`, `Run the bundled CLI demo`, `Classification meanings`, `Reset demo`, `Start for real`, `Classify sample flag`, and the theme controls. They are clear in context; action controls name their resulting action. The field-cartography art, paper palette, square linework, serif/monospace pairing, and non-generic mobile composition match `.factory/design.md`.

### README sentences and copy units

| Words | Exact copy | Check |
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
| 6 | A dated usage report is optional. | **F-4-1** |
| 14 | A zero count needs a valid `as_of` end timestamp from the last 90 days. | Pass |
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
| 14 | Removal candidate: the provider says complete and a recent dated usage report records zero evaluations. | Pass |
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

README headings (`Install`, `Try the bundled sample`, `Usage`, `Exit codes`, `Decision rules`, `Develop and verify`, `Privacy and scope`, and `License`) make sense independently.

## Demo and sandbox

| Check | Result | Evidence |
| --- | --- | --- |
| One-click sample | Pass | Landing action opens `/demo/`; its initial rendered state is **Removal candidate**. |
| Realistic first result | Pass | Completed `checkout-v2`, current 30-day zero-evaluation report, and exactly three code/config/test references. |
| Banner/reset/discard | Pass | Persistent “Demo — sample data stays in this tab.” banner includes **Reset demo** and **Start for real**. Reset restored the candidate; Start for real removed the marker. |
| Storage isolation | Pass | Only `sessionStorage["demo:flag-removal-map"]` existed in demo; it was absent after Start for real. No real-data namespace is read or written. |
| Privacy/egress | Pass | No request occurred during classify or reset. Requests observed during loads were same-origin assets only. |
| Offline | Pass | After service-worker control, a live offline `/demo/` reload rendered **Removal candidate**. |
| CLI demo | Pass | From an empty temporary directory, `flag-removal-map demo` created a separate system temp sample, printed its plan path, and left the caller directory empty. |

## Claims and quality gates

The clean clone installed with `npm ci`. All 23 command strings in `.factory/claims.json` passed verbatim, then `npm test` and `npm run build` passed. Passing claim IDs: `demo-one-click`, `demo-isolation`, `browser-no-egress`, `offline-reload`, `browser-cli-parity`, `decision-rule`, `route-metadata`, `404-route`, `accessible-interactions`, `first-screen-facts`, `privacy-site`, `cli-demo`, `combined-evidence-plan`, `plan-checklist`, `exit-codes`, `provider-shapes`, `reference-kinds`, `repository-read-only`, `json-options`, `source-install`, `cargo-package`, `build-artifacts`, and `license-file`.

The live landing, demo, README, privacy, and terms claims were cross-checked against these entries. F-4-1 is the only unlisted claim found.

## Structure, accessibility, history, and leverage

- Home, demo, privacy, terms, and designed 404 had route-specific titles, one H1, description, canonical, OG/Twitter metadata, favicon/apple icon, shared shell, and no console errors. The unknown URL returned HTTP 404 and retained its address.
- Valid internal links and the labelled external GitHub link resolved successfully. Skip links on the rendered 404 remain in-page anchors rather than network destinations.
- Direct routes, `?demo=1`, navigation, and Back moved focus to the destination H1 and announced the route. The live axe injection was blocked by the deliberate CSP; the clean-browser claim suite ran Axe with zero WCAG A/AA violations across routes.
- Review-1 `F1`–`F11`, review-2 `F-2-1`–`F-2-24`, and review-3 `F-3-1` were each checked against current code and live behavior. All are fixed: notably strict complete date parsing now agrees in browser and CLI for valid, undated, invalid, stale, active, and malformed-suffix fixtures. The review-1 unlisted-claim families are removed or mapped as documented in polish 2/3. F-4-1 is a newly identified, separate README claim gap.
- `.factory/brief.json` is absent, so missed leverage was assessed from the product contract and README. AI, sync, and a provider connection are not expected additions to this local deterministic CLI; they would conflict with its offline/no-provider-call boundary. Existing Markdown/JSON output covers the implied export need.

## What would make this perfect

Add and pass the precise optional-usage-report claim/test described in F-4-1, then rerun the full clean-clone and fresh-live review. No product interaction or visual change is otherwise indicated.
