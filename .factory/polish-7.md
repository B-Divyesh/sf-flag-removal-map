# Polish 7 — cumulative adversarial closure

- Candidate: `579c054bcea1b3308e92720047b8e95974332379`
- Review: `44144300fecdbb53aa8ab2d92cc58e5a81d7ac67`
- Repair commits: `705b2f0`, `69be684`, `e945f50`
- Deployed revision: `e945f50e7e9824dde34575a610f8524bee542513`
- Deployment: `7479e899-7089-414f-a38f-82a0874c8893`
- Result: **PASS — every recorded finding is fixed and reverified.**

## Shared evidence for every row

- Clean clone `/tmp/flag-removal-map-polish7-verified.VumMqO/repo`: all 24 commands in `.factory/claims.json`, `npm test`, `npm run build`, and `cargo package --allow-dirty` pass.
- [Live audit](evidence/polish-7-live/audit/live-audit.json): all routes, direct and clicked demo entry, storage isolation, no action egress, offline reload, focus, metadata, mobile bounds, and light/dark Axe.
- Cold live URL check: <https://flag-removal-map.sociobot.in/> and `/?demo=1` served build `e945f50`; the audit repeated each public and unknown route from fresh contexts.
- [Cold mobile proof](evidence/polish-7-live/demo-mobile-first-screen.png): result y=`641.89`, edit action y=`692.75`, form y=`1607.48`, 390 × 844 viewport, no scroll.
- [Home verifier](evidence/polish-7-live/home/verify.json), [demo verifier](evidence/polish-7-live/demo/verify.json), and [mobile Lighthouse](evidence/polish-7-live/lighthouse-mobile.json).

## Review 7

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-7-1 | Moved the completed result before inputs on mobile, added **Edit sample inputs**, constrained every grid child to the viewport, and refreshed the offline cache. | `@claim:demo-one-click`; cold screenshot and live audit coordinates above. |

## Review 1 top-level findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F1 | Kept the verb-first job headline, named small engineering teams, and kept the sample as the primary action. | `@claim:first-screen-facts`; live home verifier. |
| F2 | Kept the populated `/demo/` and `/?demo=1` sandbox, banner/reset/discard, CLI demo, examples, and recording; fixed first-screen mobile placement. | `@claim:demo-one-click`, `@claim:demo-isolation`, `@claim:cli-demo`; live audit. |
| F3 | Kept the 24-entry one-ID/one-tag registry and observable sandbox tests. | `npm run test:claims`; registry-integrity test. |
| F4 | Kept the designed HTTP 404 and explicit response override. | `@claim:404-route`; live audit status 404. |
| F5 | Kept only the verified source-install route. | `@claim:source-install`; README. |
| F6 | Kept per-route titles, canonicals, OG/Twitter metadata, icon, and original social card. | `@claim:route-metadata`; live audit. |
| F7 | Kept H1 focus and polite route announcements; made the asynchronous focus assertion deterministic. | `@claim:accessible-interactions`; live Start-for-real focus=`H1`. |
| F8 | Kept the shared header/footer, legal links, Factory credit, version, and build ID on every route. | `@claim:route-metadata`; live build `e945f50`. |
| F9 | Kept direct task headings while preserving cartography as the visual language. | `copy-audit.md`; live captures. |
| F10 | Kept result-naming controls and added **Edit sample inputs**. | `@claim:accessible-interactions`, `@claim:demo-one-click`. |
| F11 | Kept visible and accessible external-link disclosure. | `@claim:route-metadata`; live route audit. |

## Review 1 landing claims

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| UC-L01 | Limited offline wording to operation after the first visit. | `@claim:offline-reload`; live offline reload. |
| UC-L02 | Kept the named provider, usage, and repository evidence combination. | `@claim:combined-evidence-plan`. |
| UC-L03 | Kept zero usage as review support, never safety proof. | `@claim:decision-rule`. |
| UC-L04 | Kept only tested browser/CLI offline behavior. | `@claim:offline-reload`, `@claim:repository-read-only`. |
| UC-L05 | Kept full repository non-edit behavior. | `@claim:repository-read-only`. |
| UC-L06 | Kept browser and CLI egress boundaries. | `@claim:browser-no-egress`, `@claim:repository-read-only`; live audit. |
| UC-L07 | Kept documented provider-export input. | `@claim:provider-shapes`. |
| UC-L08 | Kept joined status, usage, and reference evidence. | `@claim:combined-evidence-plan`. |
| UC-L09 | Kept named Markdown plan output. | `@claim:combined-evidence-plan`. |
| UC-L10 | Removed the unsupported provider-dashboard generalization. | `copy-audit.md`; public-copy scan. |
| UC-L11 | Kept exact reference scanning. | `@claim:reference-kinds`. |
| UC-L12 | Narrowed the conclusion to the tested decision rule. | `@claim:combined-evidence-plan`. |
| UC-L13 | Kept zero observations as evidence only. | `@claim:decision-rule`. |
| UC-L14 | Kept the explicit no-safety warning. | `@claim:decision-rule`, `@claim:plan-checklist`. |
| UC-L15 | Kept browser/CLI parity for all date and activity fixtures. | `@claim:browser-cli-parity`. |
| UC-L16 | Kept zero post-load demo requests. | `@claim:browser-no-egress`; live audit. |
| UC-L17 | Kept pasted browser references distinct from CLI folder scans. | `@claim:reference-kinds`. |
| UC-L18 | Kept a completed sample with exactly three references and made its result first-screen visible. | `@claim:demo-one-click`; live mobile proof. |
| UC-L19 | Kept a verified single CLI package. | `@claim:source-install`, `@claim:cargo-package`. |
| UC-L20 | Kept local-input operation without provider calls. | `@claim:repository-read-only`. |
| UC-L21 | Replaced vague output wording with named plan content. | `@claim:combined-evidence-plan`, `@claim:plan-checklist`. |
| UC-L22 | Kept tested source installation. | `@claim:source-install`. |
| UC-L23 | Removed unavailable release-binary wording. | README/copy audit. |
| UC-L24 | Kept active-status and evaluation-count keep branches. | `@claim:decision-rule`. |
| UC-L25 | Kept completed plus recent dated-zero candidate criteria. | `@claim:decision-rule`. |
| UC-L26 | Kept missing, conflicting, and incomplete evidence review routes. | `@claim:decision-rule`, `@claim:exit-codes`. |
| UC-L27 | Kept the repository tree unchanged. | `@claim:repository-read-only`. |
| UC-L28 | Kept the no-provider-call boundary under denied network syscalls. | `@claim:repository-read-only`. |
| UC-L29 | Removed unsupported token wording. | README/copy audit. |
| UC-L30 | Kept removal candidates explicitly subject to human review. | `@claim:decision-rule`. |
| UC-L31 | Kept plan evidence and human checks. | `@claim:plan-checklist`. |
| UC-L32 | Kept the MIT statement. | `@claim:license-file`. |
| UC-L33 | Replaced the decorative station count with the tested reference count. | `@claim:demo-one-click`. |
| UC-L34 | Uses “Removal candidate” and states that review is required. | `@claim:decision-rule`. |
| UC-L35 | Uses the documented JSON format instead of vague normalization. | `@claim:provider-shapes`. |
| UC-L36 | Requires a positive window and recent end date. | `@claim:decision-rule`. |
| UC-L37 | Keeps human review in every candidate plan. | `@claim:plan-checklist`. |
| UC-L38 | Keeps enabled/active provider behavior. | `@claim:browser-cli-parity`. |
| UC-L39 | Keeps nonzero evaluation behavior. | `@claim:browser-cli-parity`. |
| UC-L40 | Keeps completed provider-state behavior. | `@claim:browser-cli-parity`. |
| UC-L41 | Keeps dated zero as review support, not safety proof. | `@claim:decision-rule`. |
| UC-L42 | Routes absent date or state evidence to review. | `@claim:decision-rule`. |
| UC-L43 | Routes missing or ambiguous evidence to review. | `@claim:decision-rule`. |
| UC-L44 | Keeps the zero-match fallback. | `@claim:reference-kinds`. |
| UC-L45 | Keeps active provider/evaluation evidence as a removal block. | `@claim:decision-rule`. |
| UC-L46 | Removed undefined “representative” wording. | `copy-audit.md`. |

## Review 1 README claims

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| UC-R01 | Uses the concrete local CLI job. | `@claim:combined-evidence-plan`, `@claim:repository-read-only`. |
| UC-R02 | Keeps exact provider/usage/reference Markdown behavior. | `@claim:combined-evidence-plan`. |
| UC-R03 | Splits and proves non-edit, no-provider-call, and no-safety behavior. | `@claim:repository-read-only`, `@claim:decision-rule`. |
| UC-R04 | Removed the nonexistent release download. | `@claim:source-install`. |
| UC-R05 | Removed the untested Rust-version promise. | README/copy audit. |
| UC-R06 | Keeps verified local package preparation only. | `@claim:cargo-package`. |
| UC-R07 | Claims documented JSON shapes, not native provider integrations. | `@claim:provider-shapes`. |
| UC-R08 | Uses a concrete required JSON format. | `@claim:provider-shapes`. |
| UC-R09 | Keeps optional usage input and local behavior. | `@claim:optional-usage-report`, `@claim:repository-read-only`. |
| UC-R10 | Keeps multiple repository roots. | `@claim:plan-checklist`. |
| UC-R11 | Keeps JSON stdout without a plan file. | `@claim:json-options`. |
| UC-R12 | Splits and proves repeated flags, excludes, and the review gate. | `@claim:json-options`, `@claim:exit-codes`. |
| UC-R13 | Keeps all four exit codes. | `@claim:exit-codes`. |
| UC-R14 | Keeps enabled/evaluated keep branches. | `@claim:decision-rule`. |
| UC-R15 | Keeps the strict candidate rule and counterexamples. | `@claim:decision-rule`. |
| UC-R16 | Keeps explicit review causes. | `@claim:decision-rule`, `@claim:exit-codes`. |
| UC-R17 | Uses “Removal candidate,” never automatic deletion. | `@claim:decision-rule`. |
| UC-R18 | Keeps every named human check. | `@claim:plan-checklist`. |
| UC-R19 | Keeps `flags`, `items`, and `features` input collections. | `@claim:provider-shapes`. |
| UC-R20 | Keeps literal reference kinds and no rewrites. | `@claim:reference-kinds`, `@claim:repository-read-only`. |
| UC-R21 | Removed the broad `npm test` scope claim. | README/copy audit. |
| UC-R22 | Keeps named CLI and site build artifacts. | `@claim:build-artifacts`. |
| UC-R23 | Defines local analysis as supplied-path reads without provider calls. | `@claim:repository-read-only`. |
| UC-R24 | Keeps precise browser and CLI privacy boundaries. | `@claim:privacy-site`, `@claim:browser-no-egress`; live audit. |
| UC-R25 | Rewrote the statement as non-guarantee guidance. | README/copy audit. |
| UC-R26 | Keeps the non-edit repository boundary. | `@claim:repository-read-only`. |
| UC-R27 | Keeps a real one-click browser demo URL. | `@claim:demo-one-click`; live audit. |
| UC-R28 | Removed the broad contributor-command promise. | README/copy audit. |
| UC-R29 | Keeps the MIT license statement. | `@claim:license-file`. |

## Reviews 2–6 and polish-only finding

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Requires a complete, valid, recent ISO/RFC 3339 date. | `@claim:decision-rule`, `@claim:browser-cli-parity`. |
| F-2-2 | Keeps the example command keyboard focusable and scrollable. | `@claim:accessible-interactions`; Axe. |
| F-2-3 | Keeps meaningful map text opaque through motion. | `@claim:accessible-interactions`; light/dark live Axe. |
| F-2-4 | Keeps isolated observable tests and one-to-one registry integrity. | All 24 claim commands; registry-integrity test. |
| F-2-5 | Removed the unsupported account promise from screen one. | `@claim:first-screen-facts`; copy audit. |
| F-2-6 | Proves exactly three sample references. | `@claim:demo-one-click`. |
| F-2-7 | Proves plan evidence and every human check. | `@claim:plan-checklist`. |
| F-2-8 | Proves browser/CLI parity for valid and counterexample dates. | `@claim:browser-cli-parity`. |
| F-2-9 | Proves repeated `--flag`. | `@claim:json-options`. |
| F-2-10 | Proves repeated `--exclude`. | `@claim:json-options`. |
| F-2-11 | Proves exit 0. | `@claim:exit-codes`. |
| F-2-12 | Proves incomplete-scan exit 3. | `@claim:exit-codes`. |
| F-2-13 | Removed the broad test-scope claim. | README/copy audit. |
| F-2-14 | Proves privacy across every public route in fresh contexts. | `@claim:privacy-site`; live audit. |
| F-2-15 | Keeps H1 focus and announcements on route returns. | `@claim:accessible-interactions`; live focus=`H1`. |
| F-2-16 | Keeps complete legal and 404 metadata. | `@claim:route-metadata`; live audit. |
| F-2-17 | Keeps the shared 404 shell and real build coordinate. | `@claim:route-metadata`; live 404/build audit. |
| F-2-18 | Keeps offline, repository-safety, and MIT facts on screen one. | `@claim:first-screen-facts`. |
| F-2-19 | Keeps navigation targets at least 44 px. | `@claim:accessible-interactions`. |
| F-2-20 | Uses “dated usage report” and “evaluation count” consistently. | `copy-audit.md`. |
| F-2-21 | Uses the plain exit-four explanation. | `@claim:exit-codes`; README. |
| F-2-22 | Defines the demo tab and session marker precisely. | `@claim:demo-isolation`; live sentinel audit. |
| F-2-23 | Uses the understandable “Repository map” caption. | live home capture; copy audit. |
| F-2-24 | Keeps `aria-busy` true through result/error rendering. | `@claim:accessible-interactions`. |
| F-3-1 | Keeps strict whole-value date parsing in Rust and the browser. | `@claim:decision-rule`, `@claim:browser-cli-parity`. |
| P-3-1 | Keeps mobile install controls within 390 px. | `@claim:accessible-interactions`; live home capture. |
| F-4-1 | Keeps the optional usage report individually registered and tested. | `@claim:optional-usage-report`. |
| F-5-1 | Keeps exactly one selectable tagged test per registry ID. | `npm run test:claims`; registry-integrity test. |
| F-6-1 | Keeps behavioral demo isolation, route privacy, repository snapshots, and denied CLI network syscalls. | `@claim:demo-isolation`, `@claim:privacy-site`, `@claim:repository-read-only`; live audit. |

No additional issue appeared in the final clean-clone or cold deployed audit. The product remains a Rust CLI with its static Vite documentation/demo site and the original topographic field-map visual system.
