# Polish 1 — review finding closure

Candidate repaired from `67420075f28ba479dabb9ad97f547e670e87face`; review source `7cde0dd09bae32505b3e2084560d5828002ecc23`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F1 | Rewrote the first screen for small engineering teams; made **Try it with sample data** primary. | `@claim:route-metadata`; `.factory/evidence/home-desktop.png` |
| F2 | Added direct `/demo/` and `?demo=1` redirect, immediate result, banner/reset/start-real, session namespace, bundled CLI demo, examples, and terminal recording. | `@claim:demo-one-click`, `@claim:demo-isolation`, `cli_demo_creates_a_temporary_plan_without_reading_the_working_directory`; `.factory/evidence/demo-mobile.png` |
| F3 | Added claims registry and executable claim suite. | `.factory/claims.json`; `npm run test:claims` |
| F4 | Added `404.html`, an HTTP-404 response override, and no broad navigation fallback. | `@claim:404-page`, `@claim:404-route` |
| F5 | Removed non-existent release-download instruction. | README install section; `source-install` claim |
| F6 | Added per-route canonical, OG/Twitter data, 1200×630 original-art social card, apple icon, and demo metadata. | `@claim:route-metadata`; built `dist/site/` |
| F7 | Direct routes focus their H1 and populate the polite route announcement. | `@claim:accessibility-site` |
| F8 | Replaced legal-route chrome with the shared header/footer and legal links. | `@claim:route-metadata` |
| F9 | Replaced map-metaphor headings and action prose with direct task language. | `.factory/copy-audit.md`; screenshots |
| F10 | Renamed action controls for their result. | browser claim suite |
| F11 | Labels source links as external in visible and accessible names. | `@claim:route-metadata` |

## Unlisted-claim closure

Every prior unlisted claim was either removed/narrowed from public copy or mapped to the listed registry claim and test below. The IDs in each row are intentionally exhaustive.

| Earlier IDs | Resolution | Evidence |
| --- | --- | --- |
| UC-L01, UC-L04 | Retained as the precise offline-after-first-visit promise. | `offline-reload` / `@claim:offline-reload` |
| UC-L02, UC-L08, UC-L12, UC-L15 | Retained as local evidence combination; browser/CLI copy now names inputs plainly. | `combined-evidence-plan`, `decision-rule` |
| UC-L03, UC-L13, UC-L14, UC-L24–UC-L26, UC-L30, UC-L34–UC-L37, UC-L41–UC-L43, UC-L45–UC-L46 | Retained only as the conservative decision rule and human-review warning. | `decision-rule`, Rust unit tests |
| UC-L05, UC-L27 | Retained as “does not edit repositories.” | `repository-read-only`; CLI integration flow |
| UC-L06, UC-L16, UC-L28 | Retained as no browser egress/no provider-call behavior. | `browser-no-egress`, `privacy-no-egress`, `cli-no-egress` |
| UC-L07, UC-L19–UC-L22, UC-L31–UC-L32, UC-L35, UC-L38–UC-L40, UC-L44 | Narrowed to named local input, output, format, and reference behavior. | `provider-shapes`, `reference-kinds`, `combined-evidence-plan`, `license-file` |
| UC-L09, UC-L17–UC-L18, UC-L29 | Retained as exact plan/reference behavior; removed unsupported token wording. | `combined-evidence-plan`, `reference-kinds` |
| UC-L10 | Removed. | landing copy audit |
| UC-L11 | Retained as exact-match references. | `reference-kinds` |
| UC-L23 | Removed. | README and landing install copy |
| UC-L33 | Replaced decorative “stations” claim with the factual three sample references. | `demo-one-click` |
| UC-R01–UC-R03, UC-R08–UC-R11, UC-R14–UC-R20, UC-R23–UC-R26 | Rewritten in short, concrete language and mapped to local analysis/decision/privacy claims above. | README; `npm run test:claims` |
| UC-R04 | Removed unavailable release download. | README; `source-install` |
| UC-R05 | Retained and registered. | `rust-msrv` |
| UC-R06 | Removed factory publishing statement; retained package check. | `cargo-package` |
| UC-R07 | Rewritten to require the documented JSON format. | `provider-shapes` |
| UC-R12–UC-R13 | Kept as explicit options/exit-code lists. | `exit-codes`; CLI integration tests |
| UC-R21–UC-R22, UC-R28 | Kept only as verifiable contributor commands. | `build-artifacts`; `npm test`; `npm run build` |
| UC-R27 | Replaced with the actual `/demo/` link. | `demo-one-click` |
| UC-R29 | Retained and registered. | `license-file` |

## Live check

Deployed through Azure Static Web Apps on 2026-08-28. Cold checks passed:

- `https://flag-removal-map.sociobot.in/` → 200, title `Flag Removal Map — review completed flags`.
- `https://flag-removal-map.sociobot.in/demo/` → 200, title `Demo — Flag Removal Map`, immediate removal candidate, banner, and zero Axe A/AA violations at 390 px.
- `/privacy/` and `/terms/` → 200 with their route-specific H1s.
- `https://flag-removal-map.sociobot.in/not-a-real-page-qa` → designed page with HTTP 404.
- `/opt/fleet/lib/verify-url.sh` output and screenshots: `.factory/evidence/live/verify.json`, `screenshot-desktop.png`, and `screenshot-mobile.png`.
