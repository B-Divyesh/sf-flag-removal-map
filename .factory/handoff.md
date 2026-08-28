# Flag Removal Map — polish 4 handoff

- Work order: `flag-removal-map-polish-4`
- Reviewed candidate: `2b0c205260c51ea0260f47afa96839f157693c92`
- Repair commit: `a33e84e3e79d7f59f948e3f0aea3e7e511653c7b`
- Deployed build: `4b444bc` at <https://flag-removal-map.sociobot.in/>
- Deployment: Azure Static Web Apps through `/opt/fleet/lib/deploy-static.sh flag-removal-map dist/site`.

## What changed

- Registered the README’s optional dated-usage-report capability in `.factory/claims.json`.
- Added tagged CLI integration evidence: without `--evaluations`, analysis succeeds, classifies a completed flag as `review`, states that evaluation evidence is missing, and writes no plan in JSON mode.
- Refreshed the catalog description to the verb-first, 66-character line: “Review completed feature flags with local evidence before removal.”
- Recorded the closure of every finding from reviews 1–4 in `.factory/polish-4.md`.

## Verification

Clean clone: `/tmp/flag-removal-map-polish4-clean.elLGNg` at `a33e84e`.

- `npm ci`: passed, 0 vulnerabilities.
- Every one of the 24 commands in `.factory/claims.json` passed verbatim.
- `npm test`: passed (9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, and 6 Playwright/Axe browser tests).
- `npm run check`, `npm run build`, and `cargo package --allow-dirty`: passed. The build emits `target/release/flag-removal-map` and `dist/site/index.html`.
- Fresh live checks: home, demo, privacy, terms, and unknown route have the expected title, one H1, main landmark, image alt coverage, H1 focus, and no application console errors. The unknown route is HTTP 404.
- Live `?demo=1` redirects to `/demo/`, immediately renders the candidate and three references, isolates its tab marker, resets, discards on Start for real, performs no requests while classifying/resetting, and reloads offline at 390 px.
- `/opt/fleet/lib/verify-url.sh` output: `.factory/evidence/polish-4-live/verify.json`; screenshots: `screenshot-desktop.png`, `screenshot-mobile.png`, `demo-desktop.png`, and `demo-mobile.png` in that directory.
- Mobile Lighthouse: Performance 100, Accessibility 100, LCP 1.58 s, CLS 0 in `.factory/evidence/polish-4-live/lighthouse-mobile-retry.json`. Built CSS is 4.11 KB gzip and JavaScript is 3.36 KB gzip.

## Known gaps

None.

## Run and deploy

```sh
npm ci
npm test
npm run check
npm run build
cargo package --allow-dirty
BUILD_ID=$(git rev-parse --short HEAD) npm run build:site
/opt/fleet/lib/deploy-static.sh flag-removal-map dist/site
```
