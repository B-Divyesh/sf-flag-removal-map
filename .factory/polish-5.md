# Polish 5 — cumulative perfection-loop closure

- Base candidate: `d88e3ac1307f0aa93f6a0fb824f4b618db65464e`
- Review record read: `review-1.md` through `review-5.md`, and `polish-1.md` through `polish-4.md`
- Repairs: `eec98d3` (claim evidence contract) and `2353e81` (real build coordinate)
- Deployment: Azure Static Web Apps deployment `1f01e93e-c4b1-4f1a-aa2f-f1c4e37a202e`, production <https://flag-removal-map.sociobot.in/>
- Verdict: **PASS — no finding remains open.**

## Final evidence

- Clean clone: `/tmp/flag-removal-map-polish5-final-clean` at `2353e81`; `npm ci`, all 24 commands in `.factory/claims.json`, `npm test`, `npm run check`, and `npm run build` passed. Its built home contains `build 2353e81`; both `target/release/flag-removal-map` and `dist/site/index.html` exist.
- `npm test`: 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, 1 claim-registry integrity test, 4 tagged shell/package tests, and 6 Playwright/Axe tests passed.
- Live verifier: [verify.json](evidence/polish-5-live/verify.json) reports the live home title/lang/one-H1/main/alt/console baseline clean. [live-audit.json](evidence/polish-5-live/live-audit.json) records 200 home/demo/privacy/terms, 404 unknown route, H1 focus, no 390 px overflow, 0 live Axe violations on all five routes, direct `?demo=1`, three references, zero post-load demo requests, isolated-session discard, and offline reload.
- Live captures: [home desktop](evidence/polish-5-live/screenshot-desktop.png), [home mobile](evidence/polish-5-live/screenshot-mobile.png), [demo desktop](evidence/polish-5-live/demo-desktop.png), and [demo mobile](evidence/polish-5-live/demo-mobile.png).
- Mobile Lighthouse retry: [lighthouse-mobile-retry.json](evidence/polish-5-live/lighthouse-mobile-retry.json) — Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1.6 s, CLS 0. Built CSS is 4.11 KB gzip and JavaScript is 3.36 KB gzip.

`live-audit.json`, its screenshots, and the final live URL above are the live-check evidence cited as **live audit** below. Each claim tag is selected by its registry command and the registry-integrity test rejects missing, duplicate, orphaned, or unselectable tags.

## Top-level findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F1 | Kept the plain job headline, named small engineering teams, and put sample data first. | `@claim:first-screen-facts`; home mobile capture; live audit. |
| F2 | Kept populated `/demo/` and `?demo=1`, banner, reset/discard, demo namespace, CLI `demo`, examples, and recording. | `@claim:demo-one-click`, `@claim:demo-isolation`, `@claim:cli-demo`; demo captures; live audit. |
| F3 | Made the registry mechanically one-ID/one-tag; added tagged wrappers and `claims.test.mjs`. | `npm run test:claims`; claim-registry integrity test; clean-clone 24/24 run. |
| F4 | Kept the designed HTTP 404 and explicit Static Web Apps response override. | `@claim:404-route`; live audit `notFound` = 404. |
| F5 | Kept only the tested source-install instruction. | `@claim:source-install`; clean-clone package install. |
| F6 | Kept route-specific canonical, OG/Twitter, icon, and social-card metadata. | `@claim:route-metadata`; live audit routes. |
| F7 | Kept H1 focus and polite announcement for direct, click, and restored routes. | `@claim:accessible-interactions`; live audit focus = H1. |
| F8 | Kept one shell on all routes, legal links, Factory attribution, and real revision coordinates. | `@claim:route-metadata`; built `build 2353e81`; live audit. |
| F9 | Kept direct task headings and plain words; cartography remains visual only. | `copy-audit.md`; home captures. |
| F10 | Kept action labels that state their result. | `@claim:accessible-interactions`; demo capture. |
| F11 | Kept visible and accessible external-link disclosure. | `@claim:route-metadata`; live audit. |
| F-2-1 | Requires a complete, valid, recent ISO/RFC 3339 observation date before zero usage supports a candidate. | `@claim:decision-rule`, `@claim:browser-cli-parity`. |
| F-2-2 | Kept the labelled, focusable scrollable install command. | `@claim:accessible-interactions`; live Axe. |
| F-2-3 | Kept meaningful map text fully opaque during motion. | `@claim:accessible-interactions`; live Axe. |
| F-2-4 | Replaced incidental checks with isolated tagged observable tests and integrity enforcement. | 24 clean-clone claim commands; claim-registry integrity test. |
| F-2-5 | Removed the unsupported first-screen account promise. | `@claim:first-screen-facts`; copy audit. |
| F-2-6 | Keeps and asserts exactly three realistic sample references. | `@claim:demo-one-click`; live audit and demo capture. |
| F-2-7 | Kept Markdown evidence and every published human check. | `@claim:plan-checklist`. |
| F-2-8 | Covers browser/CLI parity for valid, invalid, stale, undated, active, and malformed timestamps. | `@claim:browser-cli-parity`. |
| F-2-9 | Keeps observable repeated `--flag`, including a missing key. | `@claim:json-options`. |
| F-2-10 | Keeps observable repeated `--exclude`. | `@claim:json-options`. |
| F-2-11 | Keeps documented success exit code coverage. | `@claim:exit-codes`. |
| F-2-12 | Keeps incomplete-scan exit code coverage. | `@claim:exit-codes`. |
| F-2-13 | Removed the broad test-scope promise. | README/copy audit. |
| F-2-14 | Kept precise, separately tested local asset, storage, and network language. | `@claim:privacy-site`, `@claim:browser-no-egress`; live audit. |
| F-2-15 | Kept focus/announcement for home, non-home, Back, and BFCache. | `@claim:accessible-interactions`; live audit. |
| F-2-16 | Kept complete metadata and noindex 404. | `@claim:route-metadata`; live audit. |
| F-2-17 | Replaced environment-dependent `build local` with the checked-out revision fallback. | `@claim:route-metadata`; live footer `build 2353e81`. |
| F-2-18 | Kept tested offline, repository-safety, and MIT facts on screen one. | `@claim:first-screen-facts`; home mobile capture. |
| F-2-19 | Kept the Demo target at least 44 px. | `@claim:accessible-interactions`; live Axe. |
| F-2-20 | Kept “dated usage report” and “evaluation count” as the stable terms. | `copy-audit.md`. |
| F-2-21 | Kept the plain exit-four explanation. | `@claim:exit-codes`; README. |
| F-2-22 | Kept tab/session-marker demo wording. | `@claim:demo-isolation`; live audit. |
| F-2-23 | Kept “Repository map” as decorative, understandable art text. | Home capture; `@claim:accessible-interactions`. |
| F-2-24 | Keeps `aria-busy` true until result/error rendering ends. | `@claim:accessible-interactions`. |
| F-3-1 | Uses strict whole-value date parsing in browser and Rust. | `@claim:decision-rule`, `@claim:browser-cli-parity`. |
| P-3-1 | Keeps the mobile install grid and copy control within 390 px. | `@claim:accessible-interactions`; home mobile capture/live audit. |
| F-4-1 | Registered and directly tested optional usage reports. | `@claim:optional-usage-report`. |
| F-5-1 | Renamed the 404 browser tag, removed duplicate/orphan tags, added four tagged shell tests, and enforced the mapping. | `npm run test:claims`; `claims.test.mjs`; clean-clone 24/24 run. |

## Review-1 landing claim findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| UC-L01 | Retained the exact offline-after-first-visit promise. | `@claim:offline-reload`; live audit offline reload. |
| UC-L02 | Kept the named local evidence combination. | `@claim:combined-evidence-plan`. |
| UC-L03 | Kept the conservative zero-is-not-safety rule. | `@claim:decision-rule`. |
| UC-L04 | Narrowed offline wording to the tested browser behavior. | `@claim:offline-reload`. |
| UC-L05 | Kept the no-edit repository promise. | `@claim:repository-read-only`. |
| UC-L06 | Kept no telemetry as no post-load demo egress/no provider calls. | `@claim:browser-no-egress`, `@claim:repository-read-only`; live audit. |
| UC-L07 | Documents and accepts the provider-export JSON input. | `@claim:provider-shapes`. |
| UC-L08 | Keeps provider, usage, and reference evidence together. | `@claim:combined-evidence-plan`. |
| UC-L09 | Keeps the named Markdown plan output. | `@claim:combined-evidence-plan`. |
| UC-L10 | Removed the unsupported provider-dashboard generalization. | Copy audit. |
| UC-L11 | Keeps exact literal reference matching. | `@claim:reference-kinds`. |
| UC-L12 | Narrowed the broad conclusion to the product decision rule. | `@claim:combined-evidence-plan`. |
| UC-L13 | Keeps zero observations as review evidence, not proof. | `@claim:decision-rule`. |
| UC-L14 | Keeps the explicit no-safety warning. | `@claim:decision-rule`, `@claim:plan-checklist`. |
| UC-L15 | Keeps browser/CLI decision parity. | `@claim:browser-cli-parity`. |
| UC-L16 | Keeps the exact no post-load browser request promise. | `@claim:browser-no-egress`; live audit. |
| UC-L17 | Separates pasted browser references from CLI directory scanning. | `@claim:reference-kinds`. |
| UC-L18 | Keeps completed sample classification and three mapped references. | `@claim:demo-one-click`; demo capture/live audit. |
| UC-L19 | Keeps the package as one CLI binary. | `@claim:cargo-package`, `@claim:source-install`. |
| UC-L20 | Keeps local-input/no-provider-call behavior. | `@claim:repository-read-only`. |
| UC-L21 | Replaced vague “reviewable” with named Markdown output. | `@claim:combined-evidence-plan`, `@claim:plan-checklist`. |
| UC-L22 | Keeps only tested source installation. | `@claim:source-install`. |
| UC-L23 | Removed unavailable release-binary wording. | README/copy audit. |
| UC-L24 | Keeps active-status/evaluation keep branches. | `@claim:decision-rule`. |
| UC-L25 | Keeps completed + bounded dated zero candidate rule. | `@claim:decision-rule`. |
| UC-L26 | Keeps missing/conflicting/incomplete review routes. | `@claim:decision-rule`, `@claim:exit-codes`. |
| UC-L27 | Keeps full repository non-edit behavior. | `@claim:repository-read-only`. |
| UC-L28 | Keeps no provider-call behavior. | `@claim:repository-read-only`. |
| UC-L29 | Removed unsupported token wording. | Copy audit. |
| UC-L30 | Keeps no automatic “safe” result. | `@claim:decision-rule`. |
| UC-L31 | Keeps plan evidence and human checks. | `@claim:plan-checklist`. |
| UC-L32 | Keeps the MIT statement. | `@claim:license-file`. |
| UC-L33 | Replaced decorative station count with tested three references. | `@claim:demo-one-click`. |
| UC-L34 | Uses “Removal candidate” plus required review. | `@claim:decision-rule`. |
| UC-L35 | Replaced “normalized” with the documented JSON format. | `@claim:provider-shapes`. |
| UC-L36 | Requires a bounded dated zero window. | `@claim:decision-rule`. |
| UC-L37 | Keeps human review in every candidate plan. | `@claim:plan-checklist`. |
| UC-L38 | Covers enabled/active provider parity. | `@claim:browser-cli-parity`. |
| UC-L39 | Covers nonzero evaluation parity. | `@claim:browser-cli-parity`. |
| UC-L40 | Covers completed provider state parity. | `@claim:browser-cli-parity`. |
| UC-L41 | Keeps dated zero evidence as review support, not safety proof. | `@claim:decision-rule`. |
| UC-L42 | Routes missing date/status evidence to review. | `@claim:decision-rule`. |
| UC-L43 | Keeps missing/ambiguous evidence on the review route. | `@claim:decision-rule`. |
| UC-L44 | Keeps the no-match fallback and exact scan behavior. | `@claim:reference-kinds`. |
| UC-L45 | Keeps active provider/evaluation keep behavior. | `@claim:decision-rule`. |
| UC-L46 | Removed undefined “representative” wording. | Copy audit. |

## Review-1 README claim findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| UC-R01 | Uses the concrete local CLI job description. | `@claim:combined-evidence-plan`, `@claim:repository-read-only`. |
| UC-R02 | Keeps exact provider/usage/reference Markdown behavior. | `@claim:combined-evidence-plan`. |
| UC-R03 | Splits non-edit, no-provider-call, and no-safety statements. | `@claim:repository-read-only`, `@claim:decision-rule`. |
| UC-R04 | Removed release download; kept source install. | `@claim:source-install`. |
| UC-R05 | Removed the untested Rust-version support promise. | README/copy audit. |
| UC-R06 | Removed internal publishing language; kept package verification. | `@claim:cargo-package`. |
| UC-R07 | Requires the documented JSON shapes, not native integrations. | `@claim:provider-shapes`. |
| UC-R08 | Uses a concrete required JSON format. | `@claim:provider-shapes`. |
| UC-R09 | Keeps optional usage input and local behavior. | `@claim:optional-usage-report`, `@claim:repository-read-only`. |
| UC-R10 | Keeps multiple repository roots in the plan. | `@claim:plan-checklist`. |
| UC-R11 | Keeps JSON stdout with no plan file. | `@claim:json-options`. |
| UC-R12 | Splits and tests repeated flags, excludes, and review exit. | `@claim:json-options`, `@claim:exit-codes`. |
| UC-R13 | Keeps all four documented exit-code outcomes. | `@claim:exit-codes`. |
| UC-R14 | Keeps enabled/evaluated keep branches. | `@claim:decision-rule`. |
| UC-R15 | Keeps the strict candidate rule and counterexamples. | `@claim:decision-rule`. |
| UC-R16 | Keeps the explicit review causes. | `@claim:decision-rule`, `@claim:exit-codes`. |
| UC-R17 | Uses “Removal candidate,” never an automatic deletion claim. | `@claim:decision-rule`. |
| UC-R18 | Keeps every named human check in the plan. | `@claim:plan-checklist`. |
| UC-R19 | Keeps `flags`, `items`, and `features` collections. | `@claim:provider-shapes`. |
| UC-R20 | Keeps literal reference kinds and no rewrite. | `@claim:reference-kinds`, `@claim:repository-read-only`. |
| UC-R21 | Removed the broad `npm test` scope sentence. | README/copy audit. |
| UC-R22 | Keeps named release/site build artifacts. | `@claim:build-artifacts`. |
| UC-R23 | Defines local analysis as supplied-path reads and no provider calls. | `@claim:repository-read-only`. |
| UC-R24 | Keeps precise site privacy and CLI network boundaries. | `@claim:privacy-site`, `@claim:browser-no-egress`, live audit. |
| UC-R25 | Rewrote this as non-guarantee user guidance. | README/copy audit. |
| UC-R26 | Keeps the non-edit repository boundary. | `@claim:repository-read-only`. |
| UC-R27 | Keeps the real direct browser demo URL. | `@claim:demo-one-click`; live audit. |
| UC-R28 | Removed broad contributor-command promise. | README/copy audit. |
| UC-R29 | Keeps the MIT license statement. | `@claim:license-file`. |

## Round-5 implementation detail

`site/tests/claims.test.mjs` reads the registry and all Rust/Node test sources. It fails if a claim ID is duplicated, missing, orphaned, or cannot select its exact tagged test. `site/tests/claim-shell.test.mjs` turns source installation, package verification, artifact build, and MIT license proof into real, unique tagged tests. The 404 browser test is now `@claim:404-route`; unrelated static-policy and browser-source assertions no longer impersonate public claim IDs. The catalog line is verb-first, 67 characters, and reads: “Review completed feature flags using local evidence before removal.”
