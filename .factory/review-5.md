# Adversarial first-read review 5 — FAIL

- Product: Flag Removal Map
- Live URL: <https://flag-removal-map.sociobot.in/>
- Candidate reviewed: `d88e3ac1307f0aa93f6a0fb824f4b618db65464e`
- Reviewed: 2026-08-28 UTC
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean clone at `/tmp/flag-removal-map-review5-clean.g2QaKo`

## Verdict

**FAIL.** The deployed product is clear, tryable, and behaviorally sound in this round, but its claim registry does not meet the required one-claim/one-`@claim:<id>` test mapping. This reopens review-1 `F3` and review-2 `F-2-4`: a reviewer cannot mechanically establish which tagged test proves several registered claims. All 24 listed command strings pass; that does not repair the tag-to-claim contract.

## Cold first screen

Recorded before scrolling in separate fresh contexts.

| Question | 390 px | Desktop |
| --- | --- | --- |
| What does this do? | It helps a team review whether a completed feature flag is ready for removal. | Same. |
| For whom? | Small engineering teams retiring completed flags. | Same. |
| What should I click first? | **Try it with sample data** to open a completed removal-plan example. | Same. |

The first-read gate passes. The visible evidence is: “Review completed flags before removal.”, “For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan.”, and “Try it with sample data”. At 390 px the page had `scrollWidth` 390, the primary action was visible without scrolling, and there were no console errors.

## Findings

### BLOCKING F-5-1 — claim IDs and tagged tests are not a one-to-one, executable mapping

- Reopens: review-1 `F3` and review-2 `F-2-4`.
- Exact locations:
  - `.factory/claims.json` declares `404-route`, but its listed test filters for `@claim:404-page`. The only `@claim:404-route` test is a different source-policy test in `site/tests/site.test.mjs` and is not the listed command.
  - `decision-rule` appears twice: in `tests/cli.rs` and `site/tests/site.test.mjs`.
  - `source-install`, `cargo-package`, `build-artifacts`, and `license-file` have no `@claim:<id>` tag in the test sources.
- Why this fails the contract: the claims requirement says every registry claim has exactly one tagged test. A green command can still prove behavior, as the 404 browser test does here, but a future reviewer cannot use the registry ID to select the single intended evidence. The duplicated decision-rule tag also makes the opposite mapping ambiguous.
- Concrete fix: make each registry ID select exactly one observable test. Rename the browser 404 test to `@claim:404-route` (or rename the registry ID), remove the unrelated `@claim:404-route` marker, and retain only one `@claim:decision-rule` marker. Add tagged wrapper tests for the shell-command claims, or replace those entries with uniquely named test commands that are themselves tagged. Then add a registry-integrity test that fails for missing, duplicated, orphaned, or mismatched `@claim:` IDs.

## Copy audit

Method: whitespace-delimited words; URLs and hyphenated tokens count as one word. Meaningful image alt text and conditional status text are included. No audited sentence exceeds 22 words, uses a banned marketing adjective, or needs a copy rewrite. Core terms are consistent: **provider export**, **dated usage report**, **evaluation count**, **references**, and **removal plan**.

### Landing sentences

| Words | Exact copy | Check |
| ---: | --- | --- |
| 5 | Review completed flags before removal. | Pass |
| 21 | For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan. | Pass |
| 14 | An abstract topographic repository map showing three evidence markers joined by a red route. | Pass; image alt |
| 7 | A flag’s age is not removal evidence. | Pass |
| 9 | A provider export and repository search answer different questions. | Pass |
| 7 | Compare both before changing a completed flag. | Pass |
| 7 | A zero evaluation count can support review. | Pass |
| 9 | It never proves a flag is safe to remove. | Pass |
| 5 | Build a local removal plan. | Pass |
| 7 | Build and install the CLI from source. | Pass |
| 16 | Terminal output from flag-removal-map demo showing one removal candidate, three references, and a temporary plan path. | Pass; image alt |
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

The non-sentence landing copy was also checked: navigation (`Demo`, `Install`, `Privacy`), primary and secondary actions, three facts, three how-it-works steps, headings, theme controls, and footer links all make sense in context. Buttons use result-naming verbs: `Try it with sample data`, `See a completed removal plan`, and `Copy install command`. The field-cartography art remains a distinct visual identity, not a generic SaaS template.

### README sentences and copy units

| Words | Exact copy | Check |
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
| 6 | A dated usage report is optional. | Pass; `optional-usage-report` exists and passes |
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

README headings—`Flag Removal Map`, `Install`, `Try the bundled sample`, `Usage`, `Exit codes`, `Decision rules`, `Develop and verify`, `Privacy and scope`, and `License`—are clear out of context.

## Demo and sandbox verification

| Check | Result | Evidence |
| --- | --- | --- |
| One-click entry | Pass | The primary landing action and `?demo=1` lead to `/demo/`, whose first state is **Removal candidate**. |
| Realistic sample | Pass | `checkout-v2`, completed/disabled status, a current 30-day zero-evaluation report, and three code/config/test references. |
| Banner and reset | Pass | Persistent “Demo — sample data stays in this tab.” banner includes **Reset demo** and **Start for real**. Reset restores the candidate and focuses Provider export. |
| Isolation | Pass | Demo created only `sessionStorage["demo:flag-removal-map"]`; local storage and cookies remained empty. **Start for real** removed the marker. |
| Privacy | Pass | Request interception observed zero requests during edit, classify, and reset after initial load. |
| Offline | Pass | After service-worker control, a 390 px offline `/demo/` reload rendered **Removal candidate**. |
| CLI demo | Pass | `flag-removal-map demo` from an empty temporary directory wrote a plan under a new system temporary directory and left the caller directory empty. |

## Claims and quality gates

After `npm ci` in the clean clone, every one of the 24 command strings in `.factory/claims.json` exited 0: `demo-one-click`, `demo-isolation`, `browser-no-egress`, `offline-reload`, `browser-cli-parity`, `decision-rule`, `optional-usage-report`, `route-metadata`, `404-route`, `accessible-interactions`, `first-screen-facts`, `privacy-site`, `cli-demo`, `combined-evidence-plan`, `plan-checklist`, `exit-codes`, `provider-shapes`, `reference-kinds`, `repository-read-only`, `json-options`, `source-install`, `cargo-package`, `build-artifacts`, and `license-file`.

`npm test` also passed: 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, and 6 browser/Axe tests. `npm run build` passed and emitted the release CLI plus `dist/site/index.html`.

All public capability, privacy, quantitative, license, and decision-rule statements on the landing page and README have a registry entry. There is no separate unlisted-copy claim finding; F-5-1 is the registry-integrity failure.

## Structure, accessibility, history, and leverage

| Check | Result |
| --- | --- |
| Routes | Home, demo, privacy, terms returned 200; an unknown route returned the designed 404 with HTTP 404 and retained its URL. |
| Metadata | Each checked route had a route-specific title, one H1, description, canonical, OG/Twitter metadata, SVG favicon, and 180 × 180 apple-touch icon. |
| Navigation | Direct routes, `?demo=1`, click navigation, and Back focused the destination H1 and updated the polite announcement. |
| Link crawl | Internal destinations and the labelled external GitHub link returned 200; hash targets exist. |
| Shared shell | Header and footer are consistent, including Privacy, Terms, Param Factory attribution, version, and build coordinate. |
| Accessibility | `verify-url.sh` found title/lang/main/alt/console checks clean; the clean browser suite reported no Axe WCAG A/AA violations. |
| Visual identity | The original topographic art, paper/night palette, square markers, and serif/monospace pairing match `.factory/design.md` and remain distinct. |

Earlier findings were checked against live behavior and current code, rather than their closure notes. Review-1 `F1`, `F2`, `F4`–`F11`; review-2 `F-2-1`–`F-2-3`, `F-2-5`–`F-2-24`; review-3 `F-3-1`; review-4 `F-4-1`; and polish `P-3-1` are fixed. Review-1 `F3` and review-2 `F-2-4` are reopened by F-5-1. The earlier `UC-L01`–`UC-L46` and `UC-R01`–`UC-R29` families remain removed, narrowed, or covered by current behavioral claim commands; the tag mapping still needs the fix above.

No `.factory/brief.json` is present. The contract and README imply a local, deterministic evidence-review CLI, not an AI assistant, remote provider connection, or sync product. Markdown/JSON output and provider-export input already cover the expected import/export work. Adding AI would add nondeterminism and conflict with the offline/no-provider-call boundary, so no missed-leverage feature finding is raised.

## What would make this perfect

Repair the one-to-one claim-tag mapping, add the registry-integrity test, then rerun every registered command from a fresh clone and this full cold live review. A PASS requires no findings.
