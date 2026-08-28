# Flag Removal Map — polish 6 handoff

- Work order: `flag-removal-map-polish-6`
- Repaired candidate: `f45a9a1b6d5d9676c54d77cadb3ad28315fcb702`
- Review: `85562cd5cac29d1422b9aa8dda9485db8fa25e9b`
- Product repair commits: `53408e6` and `97e1ef0`
- Live URL: <https://flag-removal-map.sociobot.in/>
- Deployment: Azure Static Web Apps `2bac15ec-c97c-4ad2-8466-d31abf6c939c`
- Status: **deployed and verified; no known gaps.**

## What changed

- Replaced the last source-text-only claim checks with real sandbox proof. Demo isolation now starts with non-demo local/session sentinels, edits, resets, and exits before asserting that only `demo:flag-removal-map` was added and then discarded. Site privacy now visits every public route in fresh browsers and checks same-origin requests, no cookies, and no visitor storage beyond the documented demo marker. CLI repository safety now recursively fingerprints paths, contents, and modification metadata before and after a `--json` run whose child process is killed on `socket` or `connect` syscall attempts.
- Strengthened the one-click contract: `@claim:demo-one-click` now opens `?demo=1`, asserts the redirect to `/demo/`, the completed candidate, and exactly three references.
- Updated the catalog line to the verb-first sentence: “Review completed feature flags with local evidence before removal.”
- Preserved the field-cartography visual system and all established route, metadata, focus, responsive, offline, accessibility, and legal behavior.

## Exact verification

Final clean clone: `/tmp/flag-removal-map-polish6-final-clean` at `97e1ef0`.

```sh
npm ci
npm run test:claims
npm test
npm run check
npm run build
cargo package --allow-dirty
```

All 24 registry commands passed: `demo-one-click`, `demo-isolation`, `browser-no-egress`, `offline-reload`, `browser-cli-parity`, `decision-rule`, `optional-usage-report`, `route-metadata`, `404-route`, `accessible-interactions`, `first-screen-facts`, `privacy-site`, `cli-demo`, `combined-evidence-plan`, `plan-checklist`, `exit-codes`, `provider-shapes`, `reference-kinds`, `repository-read-only`, `json-options`, `source-install`, `cargo-package`, `build-artifacts`, and `license-file`.

The complete suite passed: 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, registry integrity, 4 shell/package tests, and 8 Playwright/Axe browser tests. The release build produced `target/release/flag-removal-map` and `dist/site`; every generated page reported `build 97e1ef0`. Initial JavaScript is 3.36 KB gzip and CSS is 4.11 KB gzip.

## Deployed evidence

- [Cold live audit](evidence/polish-6-live/audit/live-audit.json): home/demo/privacy/terms 200, unknown route 404, titles, H1/main, build coordinate, cookies/storage, same-origin route requests, query demo entry, isolated reset/exit, focus, mobile width, offline reload, and console checks.
- [Home verifier](evidence/polish-6-live/home/verify.json) and [demo verifier](evidence/polish-6-live/demo/verify.json): title, `lang`, one H1, main, image alts, labelled buttons, and no console errors.
- Screenshots: [home desktop](evidence/polish-6-live/home/screenshot-desktop.png), [home mobile](evidence/polish-6-live/home/screenshot-mobile.png), [demo desktop](evidence/polish-6-live/demo/screenshot-desktop.png), and [demo mobile](evidence/polish-6-live/demo/screenshot-mobile.png).
- [Mobile Lighthouse](evidence/polish-6-live/lighthouse-mobile.json): Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1.61 s, CLS 0.

## Release note

The ready-to-publish CLI package was checked with `cargo package --allow-dirty`. Do not publish it from this worker; rerun that command from a clean release checkout when the factory publishes. There are no product or verification follow-ups left for this work order.
