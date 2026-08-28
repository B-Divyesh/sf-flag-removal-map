# Adversarial first-read review 8 — PASS

- Product: Flag Removal Map
- Live URL: <https://flag-removal-map.sociobot.in>
- Candidate: `68d123348e839d6bf17c85d7010733c68114bc5f`
- Reviewed: 2026-08-28 UTC
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean local clone for CLI and claims

## Verdict

**PASS.** No blocking, high, medium, low, or untested-claim finding remains. The live site is clear on first read, the sample is immediately usable, and the CLI and browser boundaries match their published evidence.

## Cold first screen

Recorded before scrolling or using the site:

| Question | 390 px | Desktop |
| --- | --- | --- |
| What does it do? | Reviews completed feature flags before removal using provider status, dated usage, and code references. | Same. |
| For whom? | Small engineering teams retiring completed flags. | Same. |
| What should I click first? | **Try it with sample data**; it opens a completed removal-plan result. | Same. |

The exact first-screen copy that supplies those answers is: “Review completed flags before removal.”, “For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan.”, and “Try it with sample data.” The headline is five words, the audience sentence is 21 words, and the primary action is the clear first action.

## Copy audit

Method: whitespace-delimited words; meaningful alt text and conditional status text included. No listed sentence exceeds 22 words. No banned marketing adjective, jargon finding, inconsistent core term, unclear semantic heading, or non-result-naming button was found.

### Landing-page sentences

| Words | Exact sentence | Result |
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
| 3 | You are offline. | Pass; conditional status |
| 7 | This page and the sample still work. | Pass; conditional status |

The three fact lines are 6, 4, and 5 words: “Works offline after the first visit”, “Does not edit repositories”, and “Free under the MIT License”. The actions are “Try it with sample data”, “See a completed removal plan”, “Copy install command”, “Classify sample flag”, “Reset demo”, and “Start for real”; each names its result or destination. Semantic headings such as “Build a local removal plan”, “Classification meanings”, and “What the CLI will not do” make sense in isolation. The cartographic uppercase labels are secondary labels, not the only headings.

### README sentences and copy units

| Words | Exact copy | Result |
| ---: | --- | --- |
| 14 | Flag Removal Map is a local CLI for engineering teams removing completed feature flags. | Pass |
| 13 | It combines a provider export, a dated usage report, and exact repository references. | Pass |
| 9 | It writes a Markdown removal plan for human review. | Pass |
| 6 | Try the one-click sample at https://flag-removal-map.sociobot.in/demo/. | Pass |
| 7 | Build and install the CLI from source. | Pass |
| 8 | Check the release package locally with `cargo package`. | Pass |
| 15 | The command copies `examples/` to a new temporary directory and prints the generated plan path. | Pass |
| 7 | It does not read your current directory. | Pass |
| 8 | Convert your provider export to this JSON format. | Pass |
| 6 | A dated usage report is optional. | Pass |
| 14 | A zero count needs a valid `as_of` end timestamp from the last 90 days. | Pass |
| 8 | Create a plan across one or more repositories. | Pass |
| 9 | Print JSON in CI without writing a plan file. | Pass |
| 6 | Repeat `--flag KEY` to select flags. | Pass |
| 8 | Repeat `--exclude NAME` to skip a directory name. | Pass |
| 11 | Add `--fail-on-review` to exit 4 when a flag needs human review. | Pass |
| 3 | `0`: analysis completed. | Pass |
| 7 | `2`: an input or argument was invalid. | Pass |
| 8 | `3`: a repository could not be scanned completely. | Pass |
| 9 | `4`: `--fail-on-review` found at least one flag needing review. | Pass |
| 12 | Keep: the provider says enabled, or the dated usage report records evaluations. | Pass |
| 15 | Removal candidate: the provider says complete and a recent dated usage report records zero evaluations. | Pass |
| 12 | Review: evidence is missing, stale, conflicts, or the repository scan was incomplete. | Pass |
| 13 | “Removal candidate” means review the flag; it does not prove deletion is safe. | Pass |
| 19 | Every generated plan asks a human to check ownership, rollout state, rollback, references, deployment health, and provider deletion order. | Pass |
| 10 | The CLI accepts JSON collections named `flags`, `items`, or `features`. | Pass |
| 14 | It finds exact flag-key matches and labels code, configuration, test, documentation, and other references. | Pass |
| 13 | `npm run build` compiles the release CLI and the static site into `dist/site/`. | Pass |
| 11 | The CLI reads only paths you provide and never edits repositories. | Pass |
| 5 | It makes no provider calls. | Pass |
| 15 | The browser demo stores only a demo session marker and clears it when you leave. | Pass |
| 1 | MIT. | Pass |
| 2 | See LICENSE. | Pass |

README headings are clear in isolation. Terminology is consistent: **provider export**, **dated usage report**, **evaluation count**, **references**, and **removal plan**.

## Demo and sandbox

| Check | Result | Evidence |
| --- | --- | --- |
| One click enters demo | Pass | Landing action opens `/demo/`; `/?demo=1` redirects directly to it. |
| First demo screen already shows use | Pass | At 390 × 844, “Removal candidate” begins at y=586 and “Edit sample inputs” follows in the viewport. |
| Realistic sample | Pass | `checkout-v2`, completed/disabled status, current 30-day zero-evaluation report, and code/config/test references. |
| Banner and reset | Pass | Persistent “Demo — sample data stays in this tab”; Reset restores the completed sample result. |
| Start-for-real isolation | Pass | It removes only `sessionStorage["demo:flag-removal-map"]` and preserves non-demo sentinels. |
| Browser egress and privacy | Pass | Fresh-route interception observed same-origin assets only; classifying and resetting made zero further requests. |
| Offline | Pass | Service-worker-controlled `/demo/` reload remained usable after `context.setOffline(true)`. |
| CLI demo in a temporary directory | Pass | `flag-removal-map demo` created a separate `/tmp/flag-removal-map-demo-*` sample and `removal-plan.md`; the caller directory contained only captured output. |

The live demo had no JavaScript console errors on home, demo, Privacy, or Terms. Demo edits never write real storage. The one expected browser network console message for the deliberately loaded HTTP 404 is the main-document 404 status, not a script error.

## Claims and clean-clone quality gates

Clean clone: `/tmp/flag-removal-map-review8.459mlh/repo` at the reviewed candidate. `npm ci`, `npm run test:claims`, `npm test`, `npm run build`, and `cargo package --allow-dirty` passed. The package verified at 118.3 KiB uncompressed / 30.6 KiB compressed; the built JavaScript is 3.42 KiB gzip.

All 24 registry commands in `.factory/claims.json` passed from that clone:

`demo-one-click`, `demo-isolation`, `browser-no-egress`, `offline-reload`, `browser-cli-parity`, `decision-rule`, `optional-usage-report`, `route-metadata`, `404-route`, `accessible-interactions`, `first-screen-facts`, `privacy-site`, `cli-demo`, `combined-evidence-plan`, `plan-checklist`, `exit-codes`, `provider-shapes`, `reference-kinds`, `repository-read-only`, `json-options`, `source-install`, `cargo-package`, `build-artifacts`, and `license-file`.

Each has exactly one executable tagged test; the registry-integrity test passed. Landing and README claims map to one of those entries. No unlisted claim-like sentence was found.

## Structure, routes, links, accessibility, and identity

- Live `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with one H1 and one main. An unknown route returned the designed 404 with HTTP 404 and retained its URL.
- Titles, descriptions, canonicals, OG/Twitter metadata, SVG favicon, and apple-touch icon were present per route. `robots.txt` and the sitemap list the public routes.
- All crawled internal links resolved; the GitHub link identifies itself as external. Header, skip link, navigation, footer, Privacy, Terms, provenance, version, and build coordinate are consistent across all routes.
- Fresh live Axe WCAG A/AA checks passed with zero violations on home, demo, Privacy, Terms, and 404 in light and dark schemes. Touch-target, keyboard, focus-return, reduced-motion, mobile-width, and no-console-error checks passed in the browser suite.
- The product does not resemble a generic SaaS template. The custom field-cartography system uses paper-map contours, serif field headings, monospaced evidence, square survey controls, and original documented art. It follows `.factory/design.md` and has no remote font or third-party-script dependency.

## Earlier finding reconciliation

Every previous finding was checked on the deployed site and corresponding implementation, rather than trusting its “fixed” label:

| Earlier finding set | Verification this round | Result |
| --- | --- | --- |
| Review 1 `F1`–`F11` | Cold first read, demo route/banner/CLI command, metadata, designed 404, focused route return, shared shell, copy and external-link crawl. | Fixed |
| Review 1 `UC-L01`–`UC-L46` | Live copy cross-check plus the 24 observable registered claim tests. | Fixed / registered |
| Review 1 `UC-R01`–`UC-R29` | README line-by-line audit, source-install/package/CLI tests, and privacy/read-only checks. | Fixed / registered |
| Review 2 `F-2-1`–`F-2-24` | Strict date/parity cases, full Axe run, touch/focus checks, claim mapping, first-screen facts, terminology, and legal/404 route checks. | Fixed |
| Review 3 `F-3-1` | Malformed timestamp browser/CLI parity fixture. | Fixed |
| Review 4 `F-4-1` | Optional dated-usage-report claim test. | Fixed |
| Review 5 `F-5-1` | One-to-one tag/registry integrity test. | Fixed |
| Review 6 `F-6-1` | Observable demo isolation, privacy-route interception, and denied-network/read-only CLI tests. | Fixed |
| Review 7 `F-7-1` | Fresh mobile landing click and direct query entry; completed result is in the first viewport. | Fixed |
| Polish-only `P-3-1` | Mobile install control was visible, keyboard-reachable, and within the 390 px viewport. | Fixed |

## Missed leverage

No missing AI capability is indicated. The core job is a conservative local evidence join, where optional AI would add data exposure and ambiguity without improving the decision rule. The product already provides the two obvious non-AI leverage points: provider/export input and Markdown/JSON output. No provider key is embedded.

## What would make this perfect

Maintain the existing claim tests when the provider formats, decision rule, or static routing change. No product change is required from this review.
