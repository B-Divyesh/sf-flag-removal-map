# Flag Removal Map — polish 5 handoff

- Work order: `flag-removal-map-polish-5`
- Reviewed base: `d88e3ac1307f0aa93f6a0fb824f4b618db65464e`
- Repair commits: `eec98d3` (claim mapping) and `2353e81` (revision coordinates)
- Live URL: <https://flag-removal-map.sociobot.in/>
- Status: **accepted — no known gaps**

## What changed

- Repaired the reopened claims-contract blocker from review 5. Every one of the 24 registry IDs now has exactly one `@claim:<id>` test tag, no orphan tags, and a registry-integrity test that rejects a missing, duplicate, orphaned, or unselectable mapping.
- Renamed the browser 404 evidence to `@claim:404-route`, removed duplicate `decision-rule` and unrelated route tags, and added genuine tagged tests for source installation, `cargo package`, build artifacts, and the MIT license.
- Added `npm run test:claims` to run every registry command in sequence, and made `npm test` include the registry audit and shell/package claim tests.
- Replaced the static-site `build local` fallback with the checked-out short Git revision. The production footer now reports `build 2353e81` on home, demo, legal, and 404 routes.
- Updated the catalog description to: “Review completed feature flags using local evidence before removal.” It is verb-first, 67 characters, and has no marketing language.

## Exact verification evidence

Final clean clone: `/tmp/flag-removal-map-polish5-final-clean` at `2353e81`.

```sh
npm ci
npm run test:claims  # all 24 registry commands passed
npm test             # 9 unit, 10 CLI integration, 1 doctest, 7 site, 1 registry, 4 shell, 6 browser/Axe tests passed
npm run check        # TypeScript, rustfmt, Clippy passed
npm run build        # release CLI and dist/site passed
```

The clean build contained `target/release/flag-removal-map`, `dist/site/index.html`, and `build 2353e81` in the generated footer. The full logs remain in that clean-clone directory: `claim-tests.log`, `npm-test.log`, `check.log`, and `build.log`.

Production deployment used the work-order static configuration (`npm ci && npm run build:site`, `dist/site`) through `/opt/fleet/lib/deploy-static.sh`. Azure deployment ID: `1f01e93e-c4b1-4f1a-aa2f-f1c4e37a202e`; the managed host reported success before the custom domain returned 200.

- [`verify-url.sh` output](evidence/polish-5-live/verify.json): title/lang/one H1/main/alt/console clean.
- [Live audit](evidence/polish-5-live/live-audit.json): home/demo/privacy/terms 200, unknown URL 404, route H1 focus, zero mobile overflow, direct `?demo=1`, three references, demo marker discard, zero post-load demo requests, offline reload, and zero Axe WCAG A/AA violations on all checked routes.
- Screenshots: [home desktop](evidence/polish-5-live/screenshot-desktop.png), [home mobile](evidence/polish-5-live/screenshot-mobile.png), [demo desktop](evidence/polish-5-live/demo-desktop.png), [demo mobile](evidence/polish-5-live/demo-mobile.png).
- [Mobile Lighthouse retry](evidence/polish-5-live/lighthouse-mobile-retry.json): Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1.6 s, CLS 0. Initial JS is 3.36 KB gzip; CSS is 4.11 KB gzip.

## Release handoff

The ready-to-publish CLI package was verified by the `@claim:cargo-package` clean-sandbox test. Re-run `cargo package --allow-dirty` if a release artifact is needed; do not publish from this worker. The landing site and CLI remain local-first, deterministic, and free of provider/API/AI dependencies. No next step is required.
