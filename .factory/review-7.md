# Adversarial first-read review 7 — FAIL

- Product: Flag Removal Map
- Live URL: <https://flag-removal-map.sociobot.in/>
- Candidate reviewed: `579c054bcea1b3308e92720047b8e95974332379`
- Reviewed: 2026-08-28 UTC
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean clone at `/tmp/flag-removal-map-review7-lpxy1d/repo`

## Verdict

**FAIL.** One blocking finding remains. The landing page is clear, the completed demo exists, all 24 registered claim commands pass, and no copy, claim, routing, accessibility, privacy, or identity finding remains. However, the completed demo result is 663 px below the first mobile viewport after the one-click action. A phone visitor sees inputs, not the promised removal plan, within the required first screen.

## Cold first screen

Recorded before scrolling in separate fresh contexts.

| Question | 390 × 844 | 1440 × 900 |
| --- | --- | --- |
| What does this do? | It combines flag status, recent usage, and code references into a removal plan for review. | Same. |
| For whom? | Small engineering teams retiring completed feature flags. | Same. |
| What should I click first? | **Try it with sample data** to see the product before installing it. | Same. |

This gate passes. The exact first-screen copy is “Review completed flags before removal.”, “For small engineering teams retiring completed flags, combine provider status, a dated usage report, and code references into one review plan.”, and “Try it with sample data”. The primary action and all three short facts are visible without scrolling at both widths. Mobile `scrollWidth` is 390 px. No console or page error occurred.

## Findings, ordered by severity

### BLOCKING F-7-1 — the completed demo result is below the first mobile screen

- Reopens: review-1 `F2` on the required 390 px first-screen path.
- Exact location: landing **Try it with sample data** → live `/demo/` at 390 × 844.
- Exact visible quote: “The completed result is ready.” The actual “Removal candidate” result begins at document y=`1507.27`; the viewport ends at y=`844` and remains at `scrollY=0`.
- Desktop comparison: at 1440 × 900, “Removal candidate” begins at y=`713.55` and is visible.
- Why a first-time phone visitor is lost: the one click shows a long editable form. The claimed completed plan is more than one screen below it, so the visitor must discover and scroll past the inputs before seeing the product's result. This fails the demo requirement that the first screen after clicking already show the product in use and its value.
- Claim-test gap: `@claim:demo-one-click` asserts that the result exists in the DOM and that the page has no horizontal overflow. It never asserts that the result intersects the initial 390 × 844 viewport.
- Concrete fix: on mobile, place the completed result summary before the editable inputs, directly below the demo heading. Keep the banner above it and place an **Edit sample inputs** action below the visible result. Extend `@claim:demo-one-click` to click the landing action in a 390 × 844 context and assert `Removal candidate` has `top < window.innerHeight` without scrolling. Apply the same assertion to `/?demo=1`.

## Copy audit

Method: whitespace-delimited words; hyphenated terms and URLs count as one word. Meaningful alt text and conditional offline text are included. No sentence exceeds 22 words. No banned marketing adjective, inconsistent core term, unclear heading, or non-result-naming action was found.

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

### Landing headings, facts, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Works offline after the first visit | 6 | Pass; registered claim |
| Does not edit repositories | 4 | Pass; registered claim |
| Free under the MIT License | 5 | Pass; registered claim |
| Try it with sample data | 5 | Pass; result-naming verb |
| See a completed removal plan | 5 | Pass; result-naming verb |
| Copy install command | 3 | Pass; names copied result |
| Run the bundled CLI demo | 5 | Pass; clear heading |
| Classification meanings | 2 | Pass out of context |
| What the CLI will not do | 6 | Pass out of context |

`FIELD NOTE 01 / FEATURE-FLAG CLEANUP`, `WHY MORE EVIDENCE IS NEEDED`, `INSTALL THE CLI`, and `PRODUCT BOUNDARIES` are secondary eyebrow labels. The semantic headings beneath them state the section purpose without relying on the cartography metaphor.

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

README headings (`Flag Removal Map`, `Install`, `Try the bundled sample`, `Usage`, `Exit codes`, `Decision rules`, `Develop and verify`, `Privacy and scope`, and `License`) make sense out of context. Terms remain consistent: **provider export**, **dated usage report**, **evaluation count**, **references**, and **removal plan**.

## Demo and sandbox verification

| Check | Result | Evidence |
| --- | --- | --- |
| Landing entry | Pass | One click opens `/demo/`; `/?demo=1` also opens it directly. |
| Completed result exists | Pass | `checkout-v2` is a Removal candidate with a current 30-day zero report and three source/config/test references. |
| First mobile screen shows the result | **FAIL — BLOCKING** | Result top y=`1507.27` at 390 × 844; F-7-1. |
| First desktop screen shows the result | Pass | Result top y=`713.55` at 1440 × 900. |
| Banner | Pass | Persistent “Demo — sample data stays in this tab.” with Reset demo and Start for real. |
| Reset | Pass | After changing the flag to active/Keep, Reset restores the completed sample and focuses Provider export. |
| Browser isolation | Pass | Seeded local/session `real:sentinel` values survive edit, reset, and exit; only `sessionStorage["demo:flag-removal-map"]` is added, then discarded. |
| Browser egress | Pass | Classify and Reset produce zero network requests after load. All route loads are same-origin. |
| Offline | Pass | After service-worker control and network interception, `/demo/` reloads offline and still renders Removal candidate. |
| CLI demo | Pass | From empty `/tmp/flag-removal-map-demo-cwd-62hcyn`, the binary creates a separate temporary sample and plan, reports one candidate and three references, and leaves the working directory empty. |

## Claims

`npm run test:claims` ran every entry in `.factory/claims.json` from the clean clone. All 24 commands exited 0.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `demo-one-click` | Pass, but incomplete for F-7-1 | Completed plan and exactly three references exist; test lacks initial-viewport assertion. |
| `demo-isolation` | Pass | Seeded real sentinels survive edit/reset/exit; demo marker is discarded. |
| `browser-no-egress` | Pass | No request after classify/reset. |
| `offline-reload` | Pass | Controlled demo reloads and classifies offline. |
| `browser-cli-parity` | Pass | Date, timestamp, undated, invalid, malformed-suffix, stale, and active cases agree. |
| `decision-rule` | Pass | CLI counterexamples enforce dated recent zero evidence. |
| `optional-usage-report` | Pass | Missing report completes and routes to review. |
| `route-metadata` | Pass | Home, demo, privacy, terms, and 404 metadata are complete. |
| `404-route` | Pass | Unknown path retains its URL and returns designed HTTP 404. |
| `accessible-interactions` | Pass | Axe, focus, touch size, command scrolling, and busy state pass. |
| `first-screen-facts` | Pass | Offline, repository safety, and MIT facts are present. |
| `privacy-site` | Pass | Public routes are same-origin, cookieless, and free of undocumented storage. |
| `cli-demo` | Pass | Demo writes its plan outside the empty working directory. |
| `combined-evidence-plan` | Pass | Provider, usage, and repository evidence produce the plan. |
| `plan-checklist` | Pass | Plan includes evidence and every named human check. |
| `exit-codes` | Pass | Exit 0, 2, 3, and 4 are observable. |
| `provider-shapes` | Pass | `flags`, `items`, and `features` collections parse. |
| `reference-kinds` | Pass | Exact code/config/test/documentation matches are labelled. |
| `repository-read-only` | Pass | Full fixture snapshot is unchanged under denied network syscalls. |
| `json-options` | Pass | JSON writes no plan; repeated flag/exclude options work. |
| `source-install` | Pass | Clean local source install succeeds. |
| `cargo-package` | Pass | Release package verifies. |
| `build-artifacts` | Pass | Release CLI and `dist/site/` are produced. |
| `license-file` | Pass | MIT license text ships. |

No listed command failed. The live landing, dynamic demo, README, Privacy, and Terms claims map to the registry; no unlisted claim was found. F-7-1 is a demo presentation requirement outside the current claim's observable viewport assertion.

The full clean-clone suite also passed: 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, registry integrity, 4 shell/package tests, and 8 Playwright/Axe browser tests. `npm run build` passed and emitted `target/release/flag-removal-map` plus `dist/site/`; JavaScript is 3.36 kB gzip and CSS is 4.11 kB gzip.

## Structure, accessibility, and identity

| Check | Result |
| --- | --- |
| Titles | Pass: route-specific titles follow the product/action or route/product pattern and stay under 60 characters. |
| Semantics | Pass: `lang=en`, one H1, one main, ordered headings, labelled controls, meaningful alt text, and shared landmarks. |
| Metadata | Pass: descriptions, canonicals, OG/Twitter card, 1200 × 630 social image, SVG favicon, apple-touch icon, and theme color are present. |
| Routing | Pass: home, demo, privacy, and terms return 200; unknown paths retain their URL and return designed HTTP 404. |
| History/focus | Pass: direct navigation, Demo → home, Start for real, and browser Back focus the destination H1 and update the polite announcement. |
| Links | Pass: all internal routes/assets, robots, sitemap, and labelled external GitHub link return 200; hash targets exist. |
| Header/footer | Pass: every route includes the same wordmark/nav and Privacy, Terms, Factory attribution, version, and build coordinate. |
| Accessibility | Pass except the demo-value placement in F-7-1: live verifier reports no console errors; Axe reports zero WCAG A/AA violations. |
| Visual identity | Pass: original topographic art, map-paper/night palette, square evidence markers, serif/monospace pairing, and contour rhythm are product-specific, not a generic SaaS template. |

## History reconciliation

Every earlier review, polish record, verification, and handoff was read. “Fixed” below means reconfirmed against the current live site and code in this round.

### Review 1 top-level findings

| ID | Current result |
| --- | --- |
| `F1` | Fixed: audience, job, and primary action are clear on both cold first screens. |
| `F2` | **Regressed on mobile; reopened by F-7-1:** result exists after one click but is below the initial 390 × 844 viewport. Banner/reset/exit, CLI demo, and isolation remain fixed. |
| `F3` | Fixed: one-ID/one-tag registry exists and all 24 observable commands pass. |
| `F4` | Fixed: unknown URLs return the designed HTTP 404. |
| `F5` | Fixed: README documents only the working source-install path. |
| `F6` | Fixed: complete route metadata and original social/icon assets are live. |
| `F7` | Fixed: direct, click, Back, and home returns focus/announce the H1. |
| `F8` | Fixed: shared shell, legal links, Factory credit, version, and build ID are present on every route. |
| `F9` | Fixed: functional headings use direct task language; cartography is secondary visual language. |
| `F10` | Fixed: actions name their result. |
| `F11` | Fixed: the GitHub link is visibly and accessibly labelled external. |

### Review 1 landing claim findings

| ID | Current result and evidence |
| --- | --- |
| `UC-L01` | Fixed; narrowed offline wording passes `offline-reload`. |
| `UC-L02` | Fixed; named evidence combination passes `combined-evidence-plan`. |
| `UC-L03` | Fixed; zero is review support under `decision-rule`. |
| `UC-L04` | Fixed; only tested offline wording remains. |
| `UC-L05` | Fixed; full fixture non-edit proof passes `repository-read-only`. |
| `UC-L06` | Fixed; browser and CLI egress boundaries pass. |
| `UC-L07` | Fixed; provider-export input passes `provider-shapes`. |
| `UC-L08` | Fixed; combined plan behavior passes. |
| `UC-L09` | Fixed; Markdown plan output passes. |
| `UC-L10` | Fixed; unsupported provider-dashboard generalization is absent. |
| `UC-L11` | Fixed; exact reference matching passes `reference-kinds`. |
| `UC-L12` | Fixed; broad conclusion is narrowed to the tested rule. |
| `UC-L13` | Fixed; zero remains evidence, not safety proof. |
| `UC-L14` | Fixed; no-safety warning remains in rule and plan. |
| `UC-L15` | Fixed; browser/CLI parity passes all registered fixtures. |
| `UC-L16` | Fixed; demo edits/reset make zero requests. |
| `UC-L17` | Fixed; browser pasted references and CLI directory scanning are distinguished. |
| `UC-L18` | Fixed; completed sample has exactly three references. |
| `UC-L19` | Fixed; packaged source install produces the CLI. |
| `UC-L20` | Fixed; local-input/no-provider-call behavior passes. |
| `UC-L21` | Fixed; vague output language was replaced with named plan sections. |
| `UC-L22` | Fixed; tested source install remains. |
| `UC-L23` | Fixed; unavailable release-binary wording is absent. |
| `UC-L24` | Fixed; active/evaluated keep branches pass. |
| `UC-L25` | Fixed; completed plus dated-zero candidate rule passes. |
| `UC-L26` | Fixed; missing/conflicting/incomplete evidence routes are covered. |
| `UC-L27` | Fixed; repository tree and metadata remain unchanged. |
| `UC-L28` | Fixed; CLI network socket creation is denied in the registered test. |
| `UC-L29` | Fixed; unsupported token wording is absent. |
| `UC-L30` | Fixed; no automatic safe result is claimed. |
| `UC-L31` | Fixed; plan evidence and human checks pass. |
| `UC-L32` | Fixed; MIT statement passes `license-file`. |
| `UC-L33` | Fixed; sample count is exactly tested. |
| `UC-L34` | Fixed; “Removal candidate” retains required review. |
| `UC-L35` | Fixed; documented JSON format replaces vague normalization. |
| `UC-L36` | Fixed; bounded dated zero is required. |
| `UC-L37` | Fixed; candidate plans retain human review. |
| `UC-L38` | Fixed; enabled/active provider behavior passes parity. |
| `UC-L39` | Fixed; nonzero evaluation behavior passes parity. |
| `UC-L40` | Fixed; completed provider behavior passes parity. |
| `UC-L41` | Fixed; dated zero supports review without proving safety. |
| `UC-L42` | Fixed; absent date/state evidence routes to review. |
| `UC-L43` | Fixed; missing or unclear evidence routes to review. |
| `UC-L44` | Fixed; no-match fallback is retained and tested. |
| `UC-L45` | Fixed; active provider/evaluation evidence blocks removal. |
| `UC-L46` | Fixed; undefined representative-window wording is absent. |

### Review 1 README claim findings

| ID | Current result and evidence |
| --- | --- |
| `UC-R01` | Fixed; concrete local CLI job is registered. |
| `UC-R02` | Fixed; provider/usage/reference plan behavior passes. |
| `UC-R03` | Fixed; non-edit, no-provider-call, and no-safety claims are split and tested. |
| `UC-R04` | Fixed; nonexistent download instruction is absent. |
| `UC-R05` | Fixed; untested Rust-version promise is absent. |
| `UC-R06` | Fixed; local package verification passes. |
| `UC-R07` | Fixed; provider shapes are claimed instead of native integrations. |
| `UC-R08` | Fixed; required JSON format is concrete and tested. |
| `UC-R09` | Fixed; optional usage report and local behavior pass. |
| `UC-R10` | Fixed; multiple repository roots pass. |
| `UC-R11` | Fixed; JSON stdout without plan file passes. |
| `UC-R12` | Fixed; repeated flag/exclude and review exit pass. |
| `UC-R13` | Fixed; all four exit codes pass. |
| `UC-R14` | Fixed; enabled/evaluated keep branches pass. |
| `UC-R15` | Fixed; strict candidate rule and counterexamples pass. |
| `UC-R16` | Fixed; review causes pass. |
| `UC-R17` | Fixed; Removal candidate is not an automatic deletion claim. |
| `UC-R18` | Fixed; every named human check passes. |
| `UC-R19` | Fixed; `flags`, `items`, and `features` pass. |
| `UC-R20` | Fixed; literal reference kinds and non-edit behavior pass. |
| `UC-R21` | Fixed; broad `npm test` scope copy is absent. |
| `UC-R22` | Fixed; named CLI/site artifacts pass. |
| `UC-R23` | Fixed; supplied-path reads and no provider calls pass. |
| `UC-R24` | Fixed; browser and CLI privacy boundaries pass observable tests. |
| `UC-R25` | Fixed; copy is non-guarantee guidance rather than a claim. |
| `UC-R26` | Fixed; repository non-edit boundary passes. |
| `UC-R27` | Fixed; actual one-click demo URL is documented and works. |
| `UC-R28` | Fixed; broad contributor-command promise is absent. |
| `UC-R29` | Fixed; MIT license claim passes. |

### Reviews 2–6 and polish findings

| ID | Current result |
| --- | --- |
| `F-2-1` | Fixed: strict complete recent date is required. |
| `F-2-2` | Fixed: install command region is labelled and keyboard-focusable. |
| `F-2-3` | Fixed: meaningful map caption remains contrast-safe through motion. |
| `F-2-4` | Fixed: observable isolated tests and registry integrity pass. |
| `F-2-5` | Fixed: unsupported account promise is absent. |
| `F-2-6` | Fixed: exactly three sample references are asserted. |
| `F-2-7` | Fixed: plan evidence and human checks are asserted. |
| `F-2-8` | Fixed: all date/parity cases pass. |
| `F-2-9` | Fixed: repeated `--flag` behavior passes. |
| `F-2-10` | Fixed: repeated `--exclude` behavior passes. |
| `F-2-11` | Fixed: exit 0 is covered. |
| `F-2-12` | Fixed: incomplete-scan exit 3 is covered. |
| `F-2-13` | Fixed: broad untestable test-scope copy is absent. |
| `F-2-14` | Fixed: all public routes pass live storage/network privacy checks. |
| `F-2-15` | Fixed: destination focus and announcement pass. |
| `F-2-16` | Fixed: legal and 404 metadata are complete. |
| `F-2-17` | Fixed: 404 uses the shared shell and build coordinate. |
| `F-2-18` | Fixed: offline, safety, and MIT facts are on screen one. |
| `F-2-19` | Fixed: Demo target is at least 44 px. |
| `F-2-20` | Fixed: dated usage report/evaluation count terms are consistent. |
| `F-2-21` | Fixed: exit-four explanation is plain. |
| `F-2-22` | Fixed: banner names the tab; marker behavior is documented and tested. |
| `F-2-23` | Fixed: Repository map caption is understandable. |
| `F-2-24` | Fixed: `aria-busy` remains true until result/error rendering. |
| `F-3-1` | Fixed: Rust and browser reject malformed date suffixes. |
| `P-3-1` | Fixed: mobile install controls remain inside 390 px. |
| `F-4-1` | Fixed: optional usage report has a direct claim test. |
| `F-5-1` | Fixed: each registry ID has exactly one selectable tag. |
| `F-6-1` | Fixed: demo isolation, route privacy, and CLI read-only/network behavior have observable sandbox tests. |

All polish documents describe closures for the IDs above; no additional polish-only defect ID exists beyond `P-3-1`.

## Missed leverage

No `.factory/brief.json` is present. The product contract, README, and actual CLI describe a local deterministic evidence-review tool. It already imports provider/usage JSON, scans multiple local repositories, and exports Markdown or JSON. AI would add nondeterminism and privacy/cost complexity to a safety decision that depends on exact evidence. Provider sync would conflict with the explicit no-provider-call boundary. No missing AI, sync, import, or export feature is raised.

## What would make this perfect

Make the completed result visible in the initial 390 × 844 demo viewport and add the viewport assertion described in F-7-1. Then rerun all 24 claim commands and this cold mobile path. Nothing else is indicated by this review.
