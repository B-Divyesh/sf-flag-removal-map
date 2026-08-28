# Flag Removal Map — polish 1 handoff

- Work order: `flag-removal-map-polish-1`
- Base reviewed: `67420075f28ba479dabb9ad97f547e670e87face`
- Review findings source: `7cde0dd09bae32505b3e2084560d5828002ecc23`
- Repair commit: recorded after this handoff is written.

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

## Known gaps

No known product gaps. The post-push live URL check remains dependent on the factory deployment becoming available; perform it against `/`, `/demo/`, `/privacy/`, `/terms/`, and an unknown path before promoting the release.
