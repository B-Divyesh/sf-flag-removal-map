# Adversarial first-read review 6 — FAIL

- Product: Flag Removal Map
- Live URL: <https://flag-removal-map.sociobot.in/>
- Candidate reviewed: `f45a9a1b6d5d9676c54d77cadb3ad28315fcb702`
- Reviewed: 2026-08-28 UTC
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean clone at `/tmp/flag-removal-map-review6-clean.r8TXZP`

## Verdict

**FAIL.** First read, live demo behavior, routes, accessibility, visual identity, and all 24 registered claim commands pass. One blocking finding remains: three privacy/isolation entries are source-text checks rather than observable sandbox tests. This reopens review-2 `F-2-4`; a green source-regex test does not prove the published behavior. A PASS requires zero findings and no untested claim.

## Cold first screen

Recorded before scrolling in separate fresh contexts.

| Question | 390 px | Desktop |
| --- | --- | --- |
| What does this do? | It helps a small engineering team decide whether completed feature flags need a human-reviewed removal plan. | Same. |
| For whom? | Small engineering teams retiring completed flags. | Same. |
| What should I click first? | **Try it with sample data** to see a completed removal plan. | Same. |

This gate passes. The exact visible evidence is “Review completed flags before removal.”, “For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan.”, and “Try it with sample data”. At 390 px the page had no horizontal overflow, the primary action was visible without scrolling, and no console error occurred.

## Findings, ordered by severity

### BLOCKING F-6-1 — three privacy/isolation claims have source checks, not observable sandbox proof

- Reopens: review-2 `F-2-4` and, for these affected claims, review-1 `F3`.
- Exact locations:
  - `.factory/claims.json` `demo-isolation` promises “Demo sample data is separate from real data and can be reset or discarded.” Its only tagged test, `site/tests/site.test.mjs` `@claim:demo-isolation`, matches HTML/TypeScript strings such as `sessionStorage.setItem` and `sessionStorage.removeItem`.
  - `.factory/claims.json` `repository-read-only` promises “The CLI does not edit repositories and makes no provider calls.” Its only tagged test, `tests/cli.rs` `@claim:repository-read-only`, compares one file (`repo/flag.ts`) before/after and confirms `Cargo.lock` does not contain `reqwest` or `hyper`. It does not snapshot the whole repository or deny/observe network connections.
  - `.factory/claims.json` `privacy-site` promises “The site has no accounts, analytics, advertising, cookies, or remote fonts.” Its only tagged test, `site/tests/site.test.mjs` `@claim:privacy-site`, scans source text for remote tags and fetch APIs; it does not exercise public routes in a browser or assert cookies, storage, and full-journey egress.
- Why this fails: the claim contract requires a clean-sandbox test of the observable outcome, not a test that the intended source text exists. Those tests can stay green if the demo fails to remove its marker, the CLI writes another repository path, or the CLI opens a standard-library network connection. Current manual behavior is correct, but it is not the registered reproducible proof required for future builds.
- Concrete fix:
  1. Replace `@claim:demo-isolation` with a fresh Playwright test that seeds non-demo local/session sentinels, opens `/demo/`, edits and resets, asserts sentinels remain unchanged, then clicks **Start for real** and verifies `demo:flag-removal-map` is gone.
  2. Make `@claim:repository-read-only` recursively hash fixture paths, contents, and metadata before/after a `--json` run; write output outside the fixture; deny egress or intercept network syscalls and fail on a connection attempt.
  3. Replace or split `@claim:privacy-site` with browser tests that visit every public route in a fresh context and assert same-origin-only requests, no cookies, and no persistent storage other than the documented demo marker.

## Copy audit

Method: whitespace-delimited words; URLs and hyphenated tokens count as one word. Meaningful alt text and the conditional offline text are included. No sentence exceeds 22 words, uses a banned marketing adjective, needs a jargon rewrite, or has inconsistent core terminology.

### Landing-page sentences

| Words | Exact copy | Result |
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

Headings and controls pass. `Demo`, `Install`, `Privacy`, `Classification meanings`, and `What the CLI will not do` make sense out of context. `FIELD NOTE 01 / FEATURE-FLAG CLEANUP` is decorative eyebrow text. Result-naming actions include `Try it with sample data`, `See a completed removal plan`, `Copy install command`, `Classify sample flag`, `Reset demo`, `Start for real`, and the theme controls.

### README sentences and copy units

| Words | Exact copy | Result |
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
| 14 | A zero count needs a valid `as_of` end timestamp from the last 90 days. | Pass |
| 8 | Create a plan across one or more repositories. | Pass |
| 10 | Print JSON in CI without writing a plan file. | Pass |
| 7 | Repeat `--flag KEY` to select flags. | Pass |
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
| 11 | The CLI reads only paths you provide and never edits repositories. | Current behavior passes; proof gap is F-6-1 |
| 5 | It makes no provider calls. | Current behavior passes; proof gap is F-6-1 |
| 15 | The browser demo stores only a demo session marker and clears it when you leave. | Current behavior passes; proof gap is F-6-1 |
| 1 | MIT. | Pass |
| 2 | See LICENSE. | Pass |

README headings (`Flag Removal Map`, `Install`, `Try the bundled sample`, `Usage`, `Exit codes`, `Decision rules`, `Develop and verify`, `Privacy and scope`, and `License`) are clear out of context. Terms remain consistent: **provider export**, **dated usage report**, **evaluation count**, **references**, and **removal plan**.

## Demo and sandbox verification

| Check | Result | Evidence |
| --- | --- | --- |
| One-click entry | Pass | Landing primary action opened `/demo/`; the first state was **Removal candidate**. |
| Realistic first result | Pass | Completed/disabled `checkout-v2`, a current 30-day zero-evaluation report, and exactly three code/config/test references. |
| Banner and reset | Pass | Persistent “Demo — sample data stays in this tab.” banner included Reset demo and Start for real. Reset restored the candidate and focused Provider export. |
| Isolation in this run | Pass, but registered proof inadequate | Only `sessionStorage["demo:flag-removal-map"]` was added; local storage and cookies remained empty; Start for real removed the marker. See F-6-1. |
| Post-load demo egress | Pass | Classify and Reset made zero requests. Later requests were expected same-origin navigation/assets after Start for real. |
| Offline | Pass | After service-worker control, an offline 390 px `/demo/` reload rendered **Removal candidate**. |
| CLI demo | Pass | The clean-clone CLI test ran `flag-removal-map demo` in an empty temporary directory and verified its external temporary plan path. |

## Claims and quality gates

From the clean clone, `node site/tests/verify-claims.mjs` ran all 24 commands in `.factory/claims.json`; all exited 0:

`demo-one-click`, `demo-isolation`, `browser-no-egress`, `offline-reload`, `browser-cli-parity`, `decision-rule`, `optional-usage-report`, `route-metadata`, `404-route`, `accessible-interactions`, `first-screen-facts`, `privacy-site`, `cli-demo`, `combined-evidence-plan`, `plan-checklist`, `exit-codes`, `provider-shapes`, `reference-kinds`, `repository-read-only`, `json-options`, `source-install`, `cargo-package`, `build-artifacts`, and `license-file`.

`npm test` passed: 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, the registry-integrity test, 4 shell/package tests, and 6 browser/Axe tests. `npm run build` passed and emitted `target/release/flag-removal-map` plus `dist/site/index.html`. No listed command failed. F-6-1 is a test-quality failure: the three claims named there lack observable clean-sandbox proof.

The live landing page and README were cross-checked against `.factory/claims.json`. No additional unlisted claim was found; every public behavior maps to a registry entry, but the three entries in F-6-1 need stronger proof.

## Structure, accessibility, history, and leverage

| Check | Result |
| --- | --- |
| Routes and metadata | Home, demo, privacy, and terms returned 200; an unknown URL returned the designed HTTP 404. Each had expected route title, one H1, description, canonical, OG/Twitter metadata, and favicon. |
| Links and shell | Crawled internal hash targets and the labelled external GitHub link; all returned 200. Header/footer are consistent with Privacy, Terms, Param Factory, version, and build coordinate. |
| Route focus | Demo → home and browser Back both focused the destination H1 and updated the polite announcement. |
| Accessibility and mobile | Clean browser/Axe suite passed. Manual 390 px route checks found no horizontal overflow or console errors. |
| Identity | Original topographic art, map-paper/night palette, square evidence markers, and serif/monospace pairing match `.factory/design.md` and are distinct from a generic SaaS template. |

All earlier findings were checked against current code and live behavior. Review-1 `F1`, `F2`, and `F4`–`F11`; review-2 `F-2-1`–`F-2-3`, `F-2-5`–`F-2-24`; review-3 `F-3-1`; review-4 `F-4-1`; review-5 `F-5-1`; and polish `P-3-1` are fixed in behavior/current code. Review-2 `F-2-4` is only half-fixed and is reopened by F-6-1 because affected claims still rely on source assertions.

`.factory/brief.json` is absent. The contract and README describe a local deterministic evidence-review CLI; it already imports local provider/usage files and exports Markdown/JSON. AI, provider sync, or embedded keys would add nondeterminism or conflict with the documented offline/no-provider-call boundary, so no missed-leverage finding is raised.

## What would make this perfect

Replace the three source-text claim tests identified in F-6-1 with the concrete browser and CLI sandbox tests above, retain one-ID/one-tag integrity enforcement, then rerun all 24 claim commands from a fresh clone and this full live review. No interface change is otherwise indicated.
