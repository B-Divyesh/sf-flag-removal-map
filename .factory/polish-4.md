# Polish 4 — cumulative review closure

- Reviewed candidate: `2b0c205260c51ea0260f47afa96839f157693c92`
- Repair commit: `a33e84e3e79d7f59f948e3f0aea3e7e511653c7b`
- Deployed build: `4b444bc` at <https://flag-removal-map.sociobot.in/>

## Final evidence used below

- Clean clone: `/tmp/flag-removal-map-polish4-clean.elLGNg` at `a33e84e`. `npm ci` passed with 0 vulnerabilities; all 24 commands in `.factory/claims.json` passed verbatim; then `npm test`, `npm run check`, `npm run build`, and `cargo package --allow-dirty` passed. The suite contains 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, and 6 Playwright/Axe tests.
- Live route check: home, demo, privacy, terms, and unknown route had their expected titles, one H1, one main landmark, alt coverage, H1 focus, no application console errors, and mobile `scrollWidth` 390. The unknown route retained its address and returned 404.
- Live demo check: direct `?demo=1` became `/demo/`, immediately showed **Removal candidate** with three references, used only `sessionStorage["demo:flag-removal-map"]`, reset the populated sample, discarded the marker on **Start for real**, made zero requests during classify/reset, and reloaded offline at 390 px.
- Live captures: `.factory/evidence/polish-4-live/screenshot-desktop.png`, `screenshot-mobile.png`, `demo-desktop.png`, and `demo-mobile.png`; basic verifier output: `verify.json`.
- Mobile Lighthouse: `.factory/evidence/polish-4-live/lighthouse-mobile-retry.json` reports Performance 100, Accessibility 100, LCP 1.58 s, and CLS 0. Built CSS is 4.11 KB gzip; JavaScript is 3.36 KB gzip.

## Review 1

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F1 | Kept the plain 5-word job headline, named small engineering teams, and made sample data the primary action. | `@claim:first-screen-facts`; live `/`; home captures. |
| F2 | Kept direct populated `/demo/` and `?demo=1`, tab-only demo marker, reset/discard banner, bundled CLI `demo`, samples, and real terminal recording. | `@claim:demo-one-click`, `@claim:demo-isolation`, `@claim:cli-demo`; live `/demo/`; demo captures. |
| F3 | Retained the registry and executable evidence; added the missing `optional-usage-report` entry and tagged CLI test. | 24 clean-clone claim commands; `@claim:optional-usage-report`. |
| F4 | Kept the designed topographic 404 and explicit Static Web Apps 404 response override. | `@claim:404-page`; live `/not-a-real-page-qa` is HTTP 404. |
| F5 | Kept only the tested source-install instruction. | `@claim:source-install`; README. |
| F6 | Kept per-route title, description, canonical, OG/Twitter, favicon, and apple-touch metadata. | `@claim:route-metadata`; live `/demo/`, `/privacy/`, `/terms/`, and 404. |
| F7 | Kept H1 focus and polite route announcement for direct routes, navigation, and restored pages. | `@claim:accessible-interactions`; live route check. |
| F8 | Kept the shared header/footer, legal links, Param Factory credit, version, and build coordinate on all routes. | `@claim:route-metadata`; live route check. |
| F9 | Kept direct task headings and plain copy; cartography remains visual treatment only. | `.factory/copy-audit.md`; home captures. |
| F10 | Kept action controls that name their result. | `@claim:accessible-interactions`; live demo. |
| F11 | Kept visible and accessible external-link disclosure. | `@claim:route-metadata`; live footer. |

## Review 1 unlisted-claim findings

| Finding IDs | Change made | Evidence |
| --- | --- | --- |
| UC-L01, UC-L04 | Narrowed to offline after the first visit. | `@claim:offline-reload`; live offline `/demo/` reload. |
| UC-L02, UC-L08, UC-L12, UC-L15 | Kept only named local evidence combination and shared decision rule. | `@claim:combined-evidence-plan`, `@claim:browser-cli-parity`. |
| UC-L03, UC-L13, UC-L14, UC-L24, UC-L25, UC-L26, UC-L30, UC-L34, UC-L36, UC-L37, UC-L41, UC-L42, UC-L43, UC-L45, UC-L46 | Kept a conservative review rule and explicit human-review language rather than a safety promise. | `@claim:decision-rule`, `@claim:plan-checklist`; live demo. |
| UC-L05, UC-L27 | Kept the exact non-edit promise. | `@claim:repository-read-only`. |
| UC-L06, UC-L16, UC-L28 | Kept the precise no post-load browser egress/no provider-call promise. | `@claim:browser-no-egress`, `@claim:repository-read-only`; live classify/reset check. |
| UC-L07, UC-L19, UC-L20, UC-L21, UC-L22, UC-L31, UC-L32, UC-L35, UC-L38, UC-L39, UC-L40, UC-L44 | Narrowed to named input, output, package, and reference behavior. | `@claim:provider-shapes`, `@claim:reference-kinds`, `@claim:combined-evidence-plan`, `@claim:license-file`. |
| UC-L09, UC-L17, UC-L18, UC-L29 | Kept exact plan, repository scan, and reference behavior; removed unsupported token wording. | `@claim:combined-evidence-plan`, `@claim:plan-checklist`, `@claim:reference-kinds`. |
| UC-L10, UC-L23 | Removed unsupported provider-dashboard and release-binary claims. | Landing/README copy audit. |
| UC-L11 | Kept literal, exact reference matching. | `@claim:reference-kinds`. |
| UC-L33 | Replaced decorative numeric language with the tested three sample references. | `@claim:demo-one-click`; live demo capture. |
| UC-R01, UC-R02, UC-R03, UC-R08, UC-R09, UC-R10, UC-R11, UC-R14, UC-R15, UC-R16, UC-R17, UC-R18, UC-R19, UC-R20, UC-R23, UC-R24, UC-R25, UC-R26 | Rewrote README capabilities in concrete local terms and mapped each to local analysis, decision, privacy, output, or scan evidence. | Relevant 24 clean-clone claim commands; README audit. |
| UC-R04 | Removed unavailable release-download wording. | README; `@claim:source-install`. |
| UC-R05 | Removed the untested Rust-version support promise. | README audit. |
| UC-R06 | Removed publishing-process language; retained only tested package verification. | `@claim:cargo-package`. |
| UC-R07 | Documents the required input format rather than native provider integrations. | `@claim:provider-shapes`. |
| UC-R12, UC-R13 | Split options and exit codes into observable contracts. | `@claim:json-options`, `@claim:exit-codes`. |
| UC-R21, UC-R22, UC-R28 | Kept only verified contributor and build commands. | `@claim:build-artifacts`; clean-clone `npm test` and `npm run build`. |
| UC-R27 | Uses the real direct demo URL. | `@claim:demo-one-click`; live `?demo=1`. |
| UC-R29 | Kept the tested MIT statement. | `@claim:license-file`. |

## Review 2

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Required a complete current ISO/RFC 3339 observation date before zero usage becomes removal evidence. | `@claim:decision-rule`; `@claim:browser-cli-parity`. |
| F-2-2 | Made the scrollable install command focusable and labelled. | `@claim:accessible-interactions`; Axe. |
| F-2-3 | Removed low-contrast opacity from meaningful hero text. | `@claim:accessible-interactions`; Axe. |
| F-2-4 | Replaced incidental checks with observable claim tests, including browser/CLI parity. | All 24 clean-clone claim commands. |
| F-2-5 | Removed the unsupported first-screen no-account fact and retained tested privacy wording. | `@claim:privacy-site`; copy audit. |
| F-2-6 | Asserted exactly three sample references. | `@claim:demo-one-click`; live demo. |
| F-2-7 | Asserted evidence plus every published human check in Markdown output. | `@claim:plan-checklist`. |
| F-2-8 | Covered dated, undated, invalid, stale, active, and malformed timestamp browser/CLI parity. | `@claim:browser-cli-parity`. |
| F-2-9 | Asserted repeated `--flag`, including a missing key. | `@claim:json-options`. |
| F-2-10 | Asserted repeated `--exclude`. | `@claim:json-options`. |
| F-2-11 | Asserted documented successful exit code 0. | `@claim:exit-codes`. |
| F-2-12 | Asserted incomplete-scan exit code 3. | `@claim:exit-codes`. |
| F-2-13 | Removed the broad untestable `npm test` scope claim. | README audit. |
| F-2-14 | Split and tested local asset, remote-request, storage, and privacy wording. | `@claim:privacy-site`, `@claim:browser-no-egress`. |
| F-2-15 | Focuses and announces direct, click, Back, and BFCache route changes. | `@claim:accessible-interactions`; live route check. |
| F-2-16 | Added complete legal and 404 metadata, social card, apple icon, and 404 noindex. | `@claim:route-metadata`. |
| F-2-17 | Added the shared shell and build coordinate to 404. | `@claim:route-metadata`; live 404. |
| F-2-18 | Shows tested offline, repository-safety, and MIT facts on the first screen. | `@claim:first-screen-facts`; home captures. |
| F-2-19 | Increased the desktop Demo navigation target to at least 44 px. | `@claim:accessible-interactions`. |
| F-2-20 | Standardized on “dated usage report” and “evaluation count.” | `.factory/copy-audit.md`. |
| F-2-21 | Rewrote the exit-four explanation in plain language. | `@claim:exit-codes`; README. |
| F-2-22 | Replaced undefined “real data” language with the tab and session marker. | `@claim:demo-isolation`; live discard check. |
| F-2-23 | Replaced the unexplained coordinate with decorative “Repository map.” | `@claim:accessible-interactions`; home capture. |
| F-2-24 | Keeps `aria-busy` true until the result or error has rendered. | `@claim:accessible-interactions`. |

## Reviews 3 and 4

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Replaced prefix-only date parsing with strict whole-value ISO/RFC 3339 parsing and added the malformed-suffix parity fixture. | `observation_dates_require_a_complete_strict_value`; `@claim:browser-cli-parity`. |
| P-3-1 | Constrained the mobile install grid and stacked its copy control. | `@claim:accessible-interactions`; live home mobile capture. |
| F-4-1 | Added `optional-usage-report` to `.factory/claims.json` and a uniquely tagged integration test that runs without `--evaluations`, asserts success, `review`, the missing-evidence reason, and no JSON-mode plan file. | `@claim:optional-usage-report`; clean clone `/tmp/flag-removal-map-polish4-clean.elLGNg`. |

No review finding remains open.
