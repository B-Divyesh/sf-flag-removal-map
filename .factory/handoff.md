# Flag Removal Map — polish 3 handoff

- Work order: `flag-removal-map-polish-3`
- Final commit: `3774bf683f0f3b17056f58289145b4d22844c47f`
- Repair commits: `03d7483`, `d38cc3d`, `3774bf6`
- Live URL: <https://flag-removal-map.sociobot.in/>
- Deployment: Azure Static Web Apps through `/opt/fleet/lib/deploy-static.sh flag-removal-map dist/site`; live footer reports build `3774bf6`.

## What changed

- The CLI now consumes the complete observation date: exactly `YYYY-MM-DD` or a strict RFC 3339 timestamp. A malformed suffix no longer becomes removal evidence.
- The browser uses the same parser and the parity test compares both classifications and evidence reasons across date, timestamp, undated, invalid, malformed, stale, and active fixtures.
- Mobile install layout now uses constrained tracks and a single-column command stack. The full “Copy install command” label remains visible at 390 px.
- The catalog description, claims sandbox wording, changelog, copy audit, and final evidence were updated.

## Verification

Final clean clone: `/tmp/flag-removal-map-polish3-final.DYoTa1` at `3774bf683f0f3b17056f58289145b4d22844c47f`.

- `npm ci`: passed, 0 vulnerabilities reported.
- Every one of the 23 commands in `.factory/claims.json`: passed verbatim from that clean clone.
- `npm test`: passed — 9 Rust unit tests, 9 CLI integration tests, 1 doctest, 7 site tests, and 6 Playwright tests.
- `npm run check`: passed — TypeScript, Rust formatting, and Clippy with warnings denied.
- `npm run build`: passed — release CLI and `dist/site/` produced. Final static assets: 8.04 kB JS (3.36 kB gzip) and 15.11 kB CSS (4.11 kB gzip).
- `cargo package --allow-dirty`: passed — Cargo verified the package (19 files, 111.8 KiB unpacked, 29.1 KiB compressed).
- Live cold check: `verify-url.sh` passed at build `3774bf6` (828 ms, no console errors, `lang=en`, one H1, main landmark, all images have alt text, all buttons are named). Evidence: `.factory/evidence/polish-3-live-final/verify.json`.
- Live browser audit: home, demo, privacy, terms, and designed 404 in light and dark themes each had zero Axe WCAG 2 A/AA violations. It also confirmed H1 focus, direct `?demo=1`, malformed-date review, offline demo reload, same-origin requests, and the 390 px command geometry. Screenshots: `.factory/evidence/polish-3-live-final/home-desktop.png`, `home-mobile.png`, `demo-desktop.png`, and `demo-mobile.png`.
- Lighthouse mobile, live home: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 888 ms, LCP 1,581 ms, CLS 0, TBT 0 ms, transfer 156,647 bytes. Evidence: `.factory/evidence/polish-3-live-final/lighthouse-mobile.json`.

## Known gaps

None. The product remains a local deterministic CLI with a self-hosted static documentation/demo site; no AI, provider connection, account, telemetry, or payment capability was added because it would conflict with the documented offline and no-provider-call scope.

## Run and deploy

```sh
npm ci
npm test
npm run check
npm run build
cargo package --allow-dirty
```

The factory deploy command is `BUILD_ID=<commit-short-sha> npm run build:site` followed by `/opt/fleet/lib/deploy-static.sh flag-removal-map dist/site`.
