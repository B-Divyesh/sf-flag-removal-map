# Flag Removal Map — polish 7 handoff

- Work order: `flag-removal-map-polish-7`
- Reviewed candidate: `579c054bcea1b3308e92720047b8e95974332379`
- Review source: `44144300fecdbb53aa8ab2d92cc58e5a81d7ac67`
- Deployed repair: `e945f50e7e9824dde34575a610f8524bee542513`
- Live URL: <https://flag-removal-map.sociobot.in/>
- Azure Static Web Apps deployment: `7479e899-7089-414f-a38f-82a0874c8893`
- Result: **PASS — no known finding remains.**

## What changed

- Put the completed demo result before the editable inputs on phones. “Removal candidate” and **Edit sample inputs** now appear in the initial 390 × 844 viewport.
- Extended `@claim:demo-one-click` to exercise both the landing action and `/?demo=1`, require `scrollY = 0`, check first-screen coordinates, check all mobile grid bounds, and retain the three-reference assertion.
- Constrained demo grid children and long references to the mobile content width. Bumped the offline cache to `v4` so existing visitors receive the repair.
- Updated the claim registry, demo contract, copy audit, and the verb-first 71-character catalog description.

The established first-screen wording, isolated demo marker/reset/discard flow, CLI demo, claims, route titles/metadata, designed HTTP 404, focus handling, shared legal shell, and topographic identity remain intact.

## Clean-clone verification

Clean clone: `/tmp/flag-removal-map-polish7-verified.VumMqO/repo` at `e945f50e7e9824dde34575a610f8524bee542513`.

```sh
npm ci
npm run test:claims
npm test
npm run build
cargo package --allow-dirty
```

All 24 registered claim commands passed. The full suite passed 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, 1 registry-integrity test, 4 shell/package tests, and 8 Playwright/Axe tests. TypeScript, rustfmt, and Clippy passed. The package verified at 118.3 KiB uncompressed and 30.6 KiB compressed. The build emitted `target/release/flag-removal-map` and `dist/site/`; initial JavaScript is 3.42 kB gzip and CSS is 4.17 kB gzip.

## Live verification

- [`live-audit.json`](evidence/polish-7-live/audit/live-audit.json): build `e945f50` on home, demo, privacy, terms, and the designed 404; exact route titles/canonicals/social metadata; one H1 and main; no console errors; no cross-origin requests, cookies, local storage, or IndexedDB; only the documented demo session marker.
- [`demo-mobile-first-screen.png`](evidence/polish-7-live/demo-mobile-first-screen.png): cold 390 × 844 landing click. Result y=`641.89`; edit action y=`692.75`; form starts y=`1607.48`; grid, result, and form right edge=`369`; `scrollY=0`.
- The live audit repeated direct `/?demo=1`, Reset demo, Start for real, sentinel preservation, H1 focus, zero classify/reset requests, and service-worker-controlled offline reload.
- Axe reported 0 WCAG A/AA violations on all five checked route states in both light and dark treatments.
- [`home verify`](evidence/polish-7-live/home/verify.json) and [`demo verify`](evidence/polish-7-live/demo/verify.json): HTTPS 200, title/lang/main/alt/control checks, and zero console errors.
- [`lighthouse-mobile.json`](evidence/polish-7-live/lighthouse-mobile.json): Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.584 s, CLS 0, TBT 13.5 ms.

## Known gaps and next steps

None. `.factory/brief.json` is absent from the repository, as it was in review 7; scope was reconciled against the full review/polish history, design thesis, README, and working CLI.
