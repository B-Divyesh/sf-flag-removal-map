# Polish 3 — cumulative adversarial closure

- Reviewed source: `review-1.md`, `review-2.md`, `review-3.md`, `polish-1.md`, and `polish-2.md`.
- Candidate repaired: `3ef4c6c050b5e0727e50271ff317916b408a5e9c`.
- Final deployed commit: `3774bf683f0f3b17056f58289145b4d22844c47f`.
- Cold live verification: <https://flag-removal-map.sociobot.in/> reports build `3774bf6`.

## Final evidence shared by the rows below

- Clean clone `/tmp/flag-removal-map-polish3-final.DYoTa1`: all 23 `.factory/claims.json` commands passed verbatim, then `npm test`, `npm run check`, `npm run build`, and `cargo package --allow-dirty` passed.
- Live Playwright/Axe audit: 0 WCAG 2 A/AA violations on home, demo, privacy, terms, and 404 in light and dark themes; direct `?demo=1`, focus, offline reload, malformed-date review, and same-origin requests passed.
- Live screenshots: `.factory/evidence/polish-3-live-final/home-desktop.png`, `home-mobile.png`, `demo-desktop.png`, and `demo-mobile.png`.
- Live metadata/semantic check: `.factory/evidence/polish-3-live-final/verify.json`.

## Top-level findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F1 | Kept the plain audience sentence and sample-first primary action on the first screen. | `@claim:first-screen-facts`; final mobile home screenshot; live `/` |
| F2 | Kept the populated `/demo/` route, `?demo=1` redirect, isolated session marker, persistent banner, reset/exit controls, bundled CLI `demo`, and terminal recording. | `@claim:demo-one-click`, `@claim:demo-isolation`, `@claim:cli-demo`; final demo screenshots; live `/demo/` |
| F3 | Kept the 23-entry claim registry; strengthened the decision/parity entries with the malformed-suffix fixture. | all 23 clean-clone claim commands; `.factory/claims.json` |
| F4 | Kept the designed static 404 and response override with no broad home fallback. | `@claim:404-page`; live `/not-a-real-page-qa` returns 404 |
| F5 | Kept only the working source-install path. | `@claim:source-install`; README |
| F6 | Kept complete per-route canonical, social, icon, and route-specific metadata. | `@claim:route-metadata`; live `/demo/`, `/privacy/`, `/terms/`, `/404` |
| F7 | Kept direct-route and back-navigation H1 focus plus polite announcement. | `@claim:accessible-interactions`; live route audit |
| F8 | Kept the shared header/footer and build coordinate on every route, including 404. | `@claim:route-metadata`; final live route audit |
| F9 | Kept task-naming headings and short copy while preserving the cartographic visual language only as decoration. | `.factory/copy-audit.md`; final home screenshots |
| F10 | Kept result-naming control labels. | `@claim:accessible-interactions`; final demo screenshot |
| F11 | Kept visible and accessible external-link disclosure. | `@claim:route-metadata`; live footer |

## Review 2 findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Required a complete current date/timestamp before zero usage can remove; invalid, stale, undated, and malformed dates route to review. | `@claim:decision-rule`, `@claim:browser-cli-parity`; live malformed-date demo |
| F-2-2 | Kept the labelled, focusable horizontally scrollable example command. | `@claim:accessible-interactions`; live Axe |
| F-2-3 | Kept meaningful map caption text fully opaque during entry. | `@claim:accessible-interactions`; live Axe |
| F-2-4 | Replaced weak parity coverage with real browser-versus-CLI classification and reason comparison. | `@claim:browser-cli-parity` |
| F-2-5 | Kept unsupported “No accounts” out of the first-screen facts. | `@claim:first-screen-facts`; `.factory/copy-audit.md` |
| F-2-6 | Kept and asserts exactly three sample references. | `@claim:demo-one-click`; final demo screenshot |
| F-2-7 | Kept plan evidence and every published human check in generated Markdown. | `@claim:plan-checklist` |
| F-2-8 | Added full strict date/timestamp parity, including the malformed suffix missed in round 3. | `@claim:browser-cli-parity`; live `/demo/` malformed-date check |
| F-2-9 | Kept observable repeated `--flag` behavior. | `@claim:json-options` |
| F-2-10 | Kept observable repeated `--exclude` behavior. | `@claim:json-options` |
| F-2-11 | Kept the documented successful exit code fixture. | `@claim:exit-codes` |
| F-2-12 | Kept the incomplete-scan exit code fixture. | `@claim:exit-codes` |
| F-2-13 | Kept untestably broad test-scope wording out of public copy. | `.factory/copy-audit.md`; README |
| F-2-14 | Kept precise, tested local asset/network/privacy language. | `@claim:privacy-site`, `@claim:browser-no-egress` |
| F-2-15 | Kept H1 focus and live route announcement on home, routes, and restored pages. | `@claim:accessible-interactions`; live route audit |
| F-2-16 | Kept full legal/404 metadata, social cards, apple icon, and noindex 404. | `@claim:route-metadata` |
| F-2-17 | Kept shared 404 shell and final build coordinate. | `@claim:route-metadata`; live 404 |
| F-2-18 | Kept the three tested first-screen facts: offline after first visit, repository safety, and MIT price. | `@claim:first-screen-facts`; final home screenshot |
| F-2-19 | Kept the desktop Demo target at least 44 px. | `@claim:accessible-interactions`; live Axe |
| F-2-20 | Kept “dated usage report” and “evaluation count” as stable terms. | `.factory/copy-audit.md` |
| F-2-21 | Kept plain exit-four language. | `@claim:exit-codes`; README |
| F-2-22 | Kept demo copy that names the tab and session marker. | `@claim:demo-isolation`; `.factory/demo.md` |
| F-2-23 | Kept the decorative caption as “Repository map,” not an unexplained coordinate. | `@claim:accessible-interactions`; final home screenshot |
| F-2-24 | Kept `aria-busy` true until result/error content is present. | `@claim:accessible-interactions` |

## Review 3 and final live findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Replaced prefix-only Rust parsing with full strict ISO/RFC 3339 parsing, aligned the browser parser and messages, and included a malformed suffix in both CLI and browser parity fixtures. | `observation_dates_require_a_complete_strict_value`, `@claim:decision-rule`, `@claim:browser-cli-parity`; live `/demo/` returns “Review evidence” for the malformed timestamp |
| P-3-1 (final mobile audit) | Constrained the install grid and explicitly stacked the copy control so its full label remains within 390 px. | `@claim:accessible-interactions`; `.factory/evidence/polish-3-live-final/home-mobile.png`; live `/` geometry: command right 370 px, page width 390 px |

## Review 1 unlisted-claim findings

Each retained public capability below has one registry entry and executable clean-sandbox test; unsupported or broad wording was removed rather than claimed.

| Finding IDs | Change made | Evidence |
| --- | --- | --- |
| UC-L01, UC-L04 | Narrowed to offline after the first visit. | `@claim:offline-reload` |
| UC-L02, UC-L08, UC-L12, UC-L15 | Kept the named local evidence combination and parity rule. | `@claim:combined-evidence-plan`, `@claim:browser-cli-parity` |
| UC-L03, UC-L13, UC-L14, UC-L24–UC-L26, UC-L30, UC-L34–UC-L37, UC-L41–UC-L43, UC-L45–UC-L46 | Kept only the conservative review rule and human-review warning. | `@claim:decision-rule`, `@claim:plan-checklist` |
| UC-L05, UC-L27 | Kept the exact non-edit promise. | `@claim:repository-read-only` |
| UC-L06, UC-L16, UC-L28 | Kept no post-load browser egress and no provider-call behavior. | `@claim:browser-no-egress`, `@claim:privacy-site`, `@claim:repository-read-only` |
| UC-L07, UC-L19–UC-L22, UC-L31–UC-L32, UC-L35, UC-L38–UC-L40, UC-L44 | Narrowed to named input, output, format, reference, package, and license behavior. | `@claim:provider-shapes`, `@claim:reference-kinds`, `@claim:combined-evidence-plan`, `@claim:license-file` |
| UC-L09, UC-L17–UC-L18, UC-L29 | Kept precise plan and reference behavior; removed unsupported token wording. | `@claim:combined-evidence-plan`, `@claim:plan-checklist` |
| UC-L10 | Removed the unsupported provider-dashboard generalization. | `.factory/copy-audit.md` |
| UC-L11 | Kept exact literal-reference scanning. | `@claim:reference-kinds` |
| UC-L23 | Removed release-binary availability wording. | README; `@claim:source-install` |
| UC-L33 | Replaced decorative station wording with the tested three sample references. | `@claim:demo-one-click` |

| Finding IDs | Change made | Evidence |
| --- | --- | --- |
| UC-R01–UC-R03, UC-R08–UC-R11, UC-R14–UC-R20, UC-R23–UC-R26 | Rewrote to concrete local analysis, decision, privacy, and output terms. | `.factory/copy-audit.md`; relevant 23 claim commands |
| UC-R04 | Removed unavailable release download. | README; `@claim:source-install` |
| UC-R05 | Removed the untested Rust-version support promise. | README copy audit |
| UC-R06 | Removed internal publishing wording; retained only package verification. | `@claim:cargo-package` |
| UC-R07 | Documents the required JSON shape instead of native provider support. | `@claim:provider-shapes` |
| UC-R12–UC-R13 | Splits options and exit codes into observable contracts. | `@claim:json-options`, `@claim:exit-codes` |
| UC-R21–UC-R22, UC-R28 | Keeps only verified contributor/build commands. | `@claim:build-artifacts`; clean-clone `npm test` and `npm run build` |
| UC-R27 | Uses the actual direct demo URL. | `@claim:demo-one-click` |
| UC-R29 | Keeps the tested MIT statement. | `@claim:license-file` |

No review finding remains open.
