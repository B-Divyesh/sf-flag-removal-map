# Flag Removal Map — polish 1 handoff

- Work order: `flag-removal-map-polish-1`
- Base reviewed: `67420075f28ba479dabb9ad97f547e670e87face`
- Review findings source: `7cde0dd09bae32505b3e2084560d5828002ecc23`
- Repair commit: `99b0b13ba7f67a4e98bdbd437dfa138653e38e1e` (amended below after final handoff metadata).

## Delivered

- Direct demo route (`/demo/`, plus `?demo=1` compatibility) with an immediate realistic result, persistent isolated-demo banner, reset, start-real discard, and offline support.
- Real `flag-removal-map demo` / `--demo`, bundled examples, temporary output, and a self-hosted terminal recording.
- Designed HTTP 404 route; consistent header/footer and legal links; route-specific titles and social metadata.
- Original derived social card and apple-touch asset, documented in the visual thesis.
- Rewritten first-screen, dynamic, install, README, and catalog copy; a copy audit; claims registry and tagged browser claim tests.

## Verification evidence

Executed from this checkout after `npm ci`:

```sh
npm run check
npm test
npm run test:claims
npm run build
cargo package --allow-dirty
target/release/flag-removal-map demo
```

All passed. The final build emitted 6.37 kB JavaScript (2.60 kB gzip) and 14.98 kB CSS (4.08 kB gzip). Playwright/Axe passed at 390 px and on the designed 404, including the rendered sample result; offline reload and no-egress flows are covered in the browser suite. CLI integration tests cover the temporary bundled demo, JSON workflow, and exit codes.

All 25 exact commands listed in `.factory/claims.json` were then run from this final tree and passed.

Visual evidence:

- `.factory/evidence/home-desktop.png`
- `.factory/evidence/demo-mobile.png`

## Run and deploy

```sh
npm ci
npm test
npm run build
target/release/flag-removal-map demo
```

The static deployment artifact is `dist/site/`. `staticwebapp.config.json` returns the designed `/404.html` with HTTP 404 and configures cache/security headers. Deployment is the factory’s static work-order pipeline triggered by the pushed `main` repair commit.

## Deployment and live verification

Deployed through Azure Static Web Apps (`sf-flag-removal-map`, production). Cold live checks passed for `/`, `/demo/`, `/privacy/`, `/terms/`, and `/not-a-real-page-qa`; the latter returned HTTP 404 with the designed page. `verify-url.sh` passed on the live home route (606 ms load, no console errors, title/lang/main/one H1/alt/button checks). Live Playwright + Axe on `/demo/` at 390 px reported zero WCAG A/AA violations and the required demo banner and completed result.

No known gaps remain.
