# Flag Removal Map — polish 2 handoff

- Work order: `flag-removal-map-polish-2`
- Repair commit: `e0dcc3a126ba46dd2d45c4aff38f8ed16332be3a`
- Base reviewed: `fa27e809a10d4e5f02831ce620a9465f154bafa2`
- Review source: `8a180f77c7ad34f1c645db116abab1b9e13610e0`
- Live URL: <https://flag-removal-map.sociobot.in>

## Delivered

- Enforced recent, valid date-bound zero-use evidence in both CLI and browser; stale, invalid, and undated reports are review evidence.
- Preserved the one-click isolated `/demo/` and `?demo=1` paths, with a tab-only banner, reset, discard, and today-dated sample.
- Completed route metadata, 404 shell, build coordinate injection, home-route focus/announcement, keyboard command scrolling, 44 px navigation targets, animation-safe caption contrast, and accurate async busy state.
- Rewrote remaining terminology and first-screen facts; catalog description is verb-first and 72 characters.
- Replaced broad claim labels with 23 individually runnable observable claim commands in `.factory/claims.json`.

## Verification

Fresh clone: `/tmp/flag-removal-map-polish2-clean` at `e0dcc3a`.

- `npm ci`: pass, 19 packages, 0 reported vulnerabilities.
- Every one of the 23 exact commands in `.factory/claims.json`: pass individually, with Node name filters selecting exactly one named browser/site test.
- `npm test`: pass — 8 Rust library tests, 9 CLI integration tests, 1 doctest, 7 site tests, and 6 Playwright/Axe tests.
- `npm run test:claims`: pass.
- `npm run check`: pass — strict TypeScript, Rust formatting, Clippy warnings denied.
- `npm run build`: pass — release CLI and `dist/site/` built; JS 7.07 kB raw / 2.86 kB gzip and CSS 15.06 kB raw / 4.10 kB gzip.
- `cargo package --allow-dirty` and `cargo install --path . --root /tmp/flag-removal-map-claim-install-polish2`: pass.
- Playwright checks cover desktop and 390 px, direct demo, offline service-worker reload, no post-load demo egress, 404 status, route focus, 44 px targets, `aria-busy`, browser/CLI parity, and Axe WCAG 2 A/AA.
- Local cold-build screenshots: `.factory/evidence/polish-2-home.png`, `.factory/evidence/polish-2-demo.png`.

## Deployment follow-up

Push this commit to `main`; the static work-order deployment is expected to build `dist/site/`. After it is live, cold-check `/`, `/demo/`, `/privacy/`, `/terms/`, and an unknown path; validate the live revision coordinate, direct demo result, 404 status, and Axe scan. Record the deployment result below before final handoff.

## Known gaps

None in the checked source/build. Live deployment verification remains the final work-order step.
