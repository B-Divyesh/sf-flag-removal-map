# Polish 6 — cumulative adversarial closure

- Reviewed candidate: `f45a9a1b6d5d9676c54d77cadb3ad28315fcb702`
- Review source: `85562cd5cac29d1422b9aa8dda9485db8fa25e9b` (`review-6.md`) plus every earlier review and polish record.
- Repair commits: `53408e6` (observable privacy/isolation proof) and `97e1ef0` (direct `?demo=1` proof).
- Deployed product revision: `97e1ef0` at <https://flag-removal-map.sociobot.in/>; Azure Static Web Apps deployment `2bac15ec-c97c-4ad2-8466-d31abf6c939c`.
- Result: **PASS — no finding remains open.**

## Evidence used by every row

- Final clean clone `/tmp/flag-removal-map-polish6-final-clean` at `97e1ef0`: `npm ci`, all 24 registry commands through `npm run test:claims`, `npm test`, `npm run check`, `npm run build`, and `cargo package --allow-dirty` passed.
- The live cold audit is [live-audit.json](evidence/polish-6-live/audit/live-audit.json). It checks home/demo/privacy/terms, the designed HTTP 404, deployed build ID, same-origin requests, cookies, local/session/IndexedDB storage, `?demo=1`, reset/discard isolation, H1 focus, 390 px width, offline demo reload, and console errors.
- Live captures and semantic verifier results: [home desktop](evidence/polish-6-live/home/screenshot-desktop.png), [home mobile](evidence/polish-6-live/home/screenshot-mobile.png), [demo desktop](evidence/polish-6-live/demo/screenshot-desktop.png), [demo mobile](evidence/polish-6-live/demo/screenshot-mobile.png), [home verify](evidence/polish-6-live/home/verify.json), and [demo verify](evidence/polish-6-live/demo/verify.json).
- Mobile Lighthouse is [100/100/100/100](evidence/polish-6-live/lighthouse-mobile.json): LCP 1.61 s and CLS 0. The clean browser suite runs Axe WCAG 2 A/AA checks.

## Review 1

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F1 | Kept the short job headline, named small engineering teams, and exposed the sample action on screen one. | `@claim:first-screen-facts`; live home captures. |
| F2 | Kept populated `/demo/`, verified direct `?demo=1`, isolated marker, reset/discard banner, bundled CLI demo, examples, and recording. | `@claim:demo-one-click`, `@claim:demo-isolation`, `@claim:cli-demo`; live audit and demo captures. |
| F3 | Kept the one-ID/one-tag registry and replaced the remaining source-only proof with behavioral tests. | `npm run test:claims`; registry-integrity test; final clean clone. |
| F4 | Kept the designed HTTP 404 and explicit Static Web Apps response override. | `@claim:404-route`; live audit unknown route = 404. |
| F5 | Kept only the tested source installation route. | `@claim:source-install`; README. |
| F6 | Kept full route titles, canonical URLs, social metadata, favicon, and apple-touch icon. | `@claim:route-metadata`; live route audit. |
| F7 | Kept destination-H1 focus and polite route announcement, including Start-for-real home return. | `@claim:accessible-interactions`; live audit focus = `H1`. |
| F8 | Kept the common shell, legal links, Factory credit, version, and deployed build coordinate on all routes. | `@claim:route-metadata`; live audit build `97e1ef0`. |
| F9 | Kept direct task wording; cartography remains visual treatment only. | `copy-audit.md`; live home captures. |
| F10 | Kept controls that name their result. | `@claim:accessible-interactions`; live demo capture. |
| F11 | Kept visible and accessible external-link disclosure. | `@claim:route-metadata`; live footer audit. |

### Review-1 landing claim findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| UC-L01 | Narrowed to offline after the first visit. | `@claim:offline-reload`; live offline audit. |
| UC-L02 | Kept the named evidence combination. | `@claim:combined-evidence-plan`. |
| UC-L03 | Kept zero evidence as conservative review support. | `@claim:decision-rule`. |
| UC-L04 | Kept only the tested offline wording. | `@claim:offline-reload`. |
| UC-L05 | Reproved the non-edit promise across the full fixture tree. | `@claim:repository-read-only`. |
| UC-L06 | Reproved no browser egress and no CLI provider call. | `@claim:browser-no-egress`, `@claim:repository-read-only`; live audit. |
| UC-L07 | Kept documented provider-export JSON input. | `@claim:provider-shapes`. |
| UC-L08 | Kept provider, usage, and reference evidence in one plan. | `@claim:combined-evidence-plan`. |
| UC-L09 | Kept named Markdown output. | `@claim:combined-evidence-plan`. |
| UC-L10 | Removed the unsupported provider-dashboard generalization. | README/copy audit. |
| UC-L11 | Kept literal reference matching. | `@claim:reference-kinds`. |
| UC-L12 | Narrowed the broad conclusion to the tested decision rule. | `@claim:combined-evidence-plan`. |
| UC-L13 | Kept zero observations as review evidence, not safety proof. | `@claim:decision-rule`. |
| UC-L14 | Kept the explicit no-safety warning. | `@claim:decision-rule`, `@claim:plan-checklist`. |
| UC-L15 | Kept browser/CLI decision parity. | `@claim:browser-cli-parity`. |
| UC-L16 | Kept exact no post-load demo request behavior. | `@claim:browser-no-egress`; live audit. |
| UC-L17 | Kept browser pasted references separate from CLI directory scanning. | `@claim:reference-kinds`. |
| UC-L18 | Kept the completed sample and exactly three references. | `@claim:demo-one-click`; live audit. |
| UC-L19 | Kept one packaged CLI binary. | `@claim:cargo-package`, `@claim:source-install`. |
| UC-L20 | Kept local-input/no-provider-call behavior. | `@claim:repository-read-only`. |
| UC-L21 | Replaced vague output language with named plan sections. | `@claim:combined-evidence-plan`, `@claim:plan-checklist`. |
| UC-L22 | Kept only tested source installation. | `@claim:source-install`. |
| UC-L23 | Removed unavailable release-binary wording. | README/copy audit. |
| UC-L24 | Kept active/evaluated keep branches. | `@claim:decision-rule`. |
| UC-L25 | Kept completed plus bounded dated-zero candidate rule. | `@claim:decision-rule`. |
| UC-L26 | Kept missing/conflicting/incomplete review routes. | `@claim:decision-rule`, `@claim:exit-codes`. |
| UC-L27 | Reproved non-edit behavior for every fixture path and metadata. | `@claim:repository-read-only`. |
| UC-L28 | Denied network socket creation in the CLI claim process. | `@claim:repository-read-only`. |
| UC-L29 | Removed unsupported token wording. | README/copy audit. |
| UC-L30 | Kept no automatic safe result. | `@claim:decision-rule`. |
| UC-L31 | Kept plan evidence and human checks. | `@claim:plan-checklist`. |
| UC-L32 | Kept the MIT statement. | `@claim:license-file`. |
| UC-L33 | Replaced decorative count wording with tested sample references. | `@claim:demo-one-click`. |
| UC-L34 | Uses Removal candidate plus required review. | `@claim:decision-rule`. |
| UC-L35 | Uses documented JSON format rather than vague normalization. | `@claim:provider-shapes`. |
| UC-L36 | Requires a bounded, dated zero window. | `@claim:decision-rule`. |
| UC-L37 | Keeps human review in every candidate plan. | `@claim:plan-checklist`. |
| UC-L38 | Covers enabled/active provider behavior. | `@claim:browser-cli-parity`. |
| UC-L39 | Covers nonzero evaluation behavior. | `@claim:browser-cli-parity`. |
| UC-L40 | Covers completed provider behavior. | `@claim:browser-cli-parity`. |
| UC-L41 | Keeps dated zero as review support, not safety proof. | `@claim:decision-rule`. |
| UC-L42 | Routes absent date/state evidence to review. | `@claim:decision-rule`. |
| UC-L43 | Keeps missing or ambiguous evidence on review. | `@claim:decision-rule`. |
| UC-L44 | Keeps the no-match fallback. | `@claim:reference-kinds`. |
| UC-L45 | Keeps active provider/evaluation blocks. | `@claim:decision-rule`. |
| UC-L46 | Removed undefined representative-window wording. | copy audit. |

### Review-1 README claim findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| UC-R01 | Uses the concrete local CLI job description. | `@claim:combined-evidence-plan`, `@claim:repository-read-only`. |
| UC-R02 | Keeps exact provider/usage/reference plan behavior. | `@claim:combined-evidence-plan`. |
| UC-R03 | Splits non-edit, no-provider-call, and no-safety behavior. | `@claim:repository-read-only`, `@claim:decision-rule`. |
| UC-R04 | Removed the nonexistent download instruction. | `@claim:source-install`. |
| UC-R05 | Removed the untested Rust-version promise. | README/copy audit. |
| UC-R06 | Removed publishing-process copy; kept local package verification. | `@claim:cargo-package`. |
| UC-R07 | Uses documented shapes, not native-provider integration claims. | `@claim:provider-shapes`. |
| UC-R08 | Uses a concrete required JSON format. | `@claim:provider-shapes`. |
| UC-R09 | Keeps optional usage input and local behavior. | `@claim:optional-usage-report`, `@claim:repository-read-only`. |
| UC-R10 | Keeps multiple repository roots. | `@claim:plan-checklist`. |
| UC-R11 | Keeps JSON stdout without a plan file. | `@claim:json-options`. |
| UC-R12 | Tests repeated flags, excludes, and review exit. | `@claim:json-options`, `@claim:exit-codes`. |
| UC-R13 | Covers all four documented exit codes. | `@claim:exit-codes`. |
| UC-R14 | Covers enabled/evaluated keep branches. | `@claim:decision-rule`. |
| UC-R15 | Keeps the strict candidate rule and counterexamples. | `@claim:decision-rule`. |
| UC-R16 | Keeps explicit review causes. | `@claim:decision-rule`, `@claim:exit-codes`. |
| UC-R17 | Uses Removal candidate, never an automatic deletion claim. | `@claim:decision-rule`. |
| UC-R18 | Keeps every named human check. | `@claim:plan-checklist`. |
| UC-R19 | Keeps `flags`, `items`, and `features` collections. | `@claim:provider-shapes`. |
| UC-R20 | Keeps literal reference kinds and no rewrite. | `@claim:reference-kinds`, `@claim:repository-read-only`. |
| UC-R21 | Removed broad `npm test` scope copy. | README/copy audit. |
| UC-R22 | Keeps named release/site artifacts. | `@claim:build-artifacts`. |
| UC-R23 | Defines local analysis as supplied-path reads and no provider calls. | `@claim:repository-read-only`. |
| UC-R24 | Keeps precise site and CLI privacy boundaries. | `@claim:privacy-site`, `@claim:browser-no-egress`; live audit. |
| UC-R25 | Rewrote as non-guarantee guidance. | README/copy audit. |
| UC-R26 | Keeps the non-edit repository boundary. | `@claim:repository-read-only`. |
| UC-R27 | Uses the actual `?demo=1` entry. | `@claim:demo-one-click`; live audit entry URL. |
| UC-R28 | Removed broad contributor-command promise. | README/copy audit. |
| UC-R29 | Keeps the MIT license statement. | `@claim:license-file`. |

## Reviews 2–6 and mobile polish

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Requires a complete, valid, recent ISO/RFC 3339 date before zero usage supports removal review. | `@claim:decision-rule`, `@claim:browser-cli-parity`. |
| F-2-2 | Kept labelled, keyboard-focusable install command scrolling. | `@claim:accessible-interactions`; Axe. |
| F-2-3 | Kept meaningful map captions fully opaque through motion. | `@claim:accessible-interactions`; Axe. |
| F-2-4 | Replaced incidental source checks with isolated observable claim tests and integrity enforcement. | all 24 clean-clone commands; `claims.test.mjs`; F-6-1 tests. |
| F-2-5 | Removed unsupported first-screen account promise. | `@claim:first-screen-facts`; copy audit. |
| F-2-6 | Asserts exactly three sample references. | `@claim:demo-one-click`; live audit. |
| F-2-7 | Asserts plan evidence and every named human check. | `@claim:plan-checklist`. |
| F-2-8 | Covers dated, undated, invalid, stale, active, and malformed date parity. | `@claim:browser-cli-parity`. |
| F-2-9 | Tests repeated `--flag`, including a missing key. | `@claim:json-options`. |
| F-2-10 | Tests repeated `--exclude`. | `@claim:json-options`. |
| F-2-11 | Covers documented exit 0. | `@claim:exit-codes`. |
| F-2-12 | Covers incomplete-scan exit 3. | `@claim:exit-codes`. |
| F-2-13 | Removed broad untestable test-scope copy. | README/copy audit. |
| F-2-14 | Reproved local route privacy in fresh browsers, not by source scan. | `@claim:privacy-site`; live audit storage/network checks. |
| F-2-15 | Keeps focus/announcement for direct, click, Back, and home returns. | `@claim:accessible-interactions`; live audit. |
| F-2-16 | Keeps complete legal and 404 metadata and noindex 404. | `@claim:route-metadata`; live audit. |
| F-2-17 | Keeps shared 404 shell and checked-out build coordinate. | `@claim:route-metadata`; live audit. |
| F-2-18 | Keeps tested offline, safety, and MIT facts on screen one. | `@claim:first-screen-facts`; home captures. |
| F-2-19 | Keeps Demo target at least 44 px. | `@claim:accessible-interactions`; Axe. |
| F-2-20 | Uses dated usage report and evaluation count consistently. | `copy-audit.md`. |
| F-2-21 | Keeps plain exit-four explanation. | `@claim:exit-codes`; README. |
| F-2-22 | Names the tab and demo session marker instead of undefined real data. | `@claim:demo-isolation`; live audit. |
| F-2-23 | Uses understandable decorative Repository map caption. | home capture; `@claim:accessible-interactions`. |
| F-2-24 | Keeps `aria-busy` until result or error is rendered. | `@claim:accessible-interactions`. |
| F-3-1 | Uses whole-value strict date parsing in Rust and browser. | `@claim:decision-rule`, `@claim:browser-cli-parity`. |
| P-3-1 | Keeps mobile install controls within 390 px. | `@claim:accessible-interactions`; home mobile capture. |
| F-4-1 | Registers and directly tests optional usage reports. | `@claim:optional-usage-report`. |
| F-5-1 | Keeps exactly one tag and selectable test per registry ID. | `npm run test:claims`; registry integrity test. |
| F-6-1 | Replaced all three source-only proofs: demo protects sentinels through edit/reset/exit; privacy visits all public routes; CLI snapshots its entire fixture tree under a seccomp network deny-list. | `@claim:demo-isolation`, `@claim:privacy-site`, `@claim:repository-read-only`; live audit. |

## Release check

The live audit confirms deployed `97e1ef0` on home, demo, privacy, terms, and the designed 404. `?demo=1` entered `/demo/` with a completed sample and three references; classify/reset made zero network requests; the only demo marker was discarded on Start for real without touching sentinels; and the service-worker-controlled demo reloaded offline. No finding of any severity remains.
