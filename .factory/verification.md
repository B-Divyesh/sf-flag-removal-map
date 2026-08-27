# Independent verification — FAIL

- Work order: `flag-removal-map-verify-1`
- Candidate commit: `39451606e861400dffb41762e910e4f823180aaa`
- Candidate repository: `https://github.com/B-Divyesh/sf-flag-removal-map.git`
- Live URL checked: `https://flag-removal-map.sociobot.in/`
- Date: 2026-08-27
- Scope: independent CLI, package, static-site/PWA, deployment, privacy, accessibility, performance, and response-policy QA. Product source was not modified.

## Verdict

**FAIL.** The real CLI job is functional and the deployment byte-matches the candidate, but the interactive result state has a serious WCAG AA color-contrast violation in both themes. This fails the accessibility acceptance gate.

## Reproduction environment

A fresh detached clone was made from the supplied checkout and checked out at the exact candidate SHA. It was clean before installation and test execution. `npm ci` installed 16 packages and reported 0 vulnerabilities.

Commands completed successfully in that clean clone:

```sh
npm ci
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test --doc
cargo package
```

- `npm test`: PASS — 7 Rust library tests, 3 CLI integration tests, and 4 site contract tests.
- `npm run build`: PASS — release binary plus `dist/site/`; Vite emitted 5.94 kB JS (2.57 kB gzip) and 13.92 kB CSS (3.90 kB gzip).
- `cargo fmt --check`, Clippy with warnings denied, and the documented Rust doctest: PASS. No repository lint/type-check script beyond Rust compilation/test exists.
- `cargo package`: PASS — 14 files, 89.9 KiB unpacked / 24.6 KiB compressed, and Cargo verified the package.

## CLI and package verification

The generated crate was unpacked into a new consumer directory and installed with:

```sh
cargo install --path flag-removal-map-0.1.0 --root ./install
```

The installed `flag-removal-map 0.1.0` binary had working `--help`, documented exit codes, `--json`, and no interactive prompt. A seeded repository contained four `alpha-flag` references (code, YAML configuration, test, and documentation) and one `beta-flag` code reference.

- Normal run: PASS — found all 5/5 known references with correct paths, line/column coordinates, and `code`/`config`/`test`/`documentation` kinds. It classified completed + bounded zero-evaluation flags as `remove`, an enabled flag as `keep`, wrote a Markdown checklist, and emitted schema-version 1 JSON.
- Invalid provider JSON: PASS — exit 2 with `flag export is not valid JSON`.
- Missing evaluation evidence plus `--fail-on-review`: PASS — exit 4.
- Boundary/incomplete scan: PASS — a 5 MiB + 1 byte file caused exit 3, `scan_complete: false`, a precise warning, and downgraded `alpha-flag` from `remove` to `review`.
- Privacy: PASS by code/dependency inspection and runtime behavior. The CLI has no HTTP client dependency or network code and operates only on supplied local paths.

## Browser, accessibility, and PWA verification

Local production output was served from `dist/site/` in Chromium; the live URL was separately exercised.

- `verify-url.sh`: PASS on the live URL — HTTPS 200, 804 ms network-idle load, no console/page errors, `lang=en`, one `h1`, a `main` landmark, no images missing `alt`, and no unlabeled buttons.
- Desktop normal case: PASS — the example produced `Removal candidate`, three mapped references, and the explicit warning that zero observations do not prove safety.
- Browser invalid/recovery paths: PASS — negative count gives an announced error; zero-day observation window gives an announced error; a subsequent count of 1 recovers to `Keep on the map`.
- Keyboard: PASS — Tab reaches “Skip to main content”; the focused theme control has a visible `rgb(184, 64, 42) solid 3px` outline with 3 px offset and operates by keyboard.
- Mobile (390 × 844): PASS — no horizontal overflow (`scrollWidth` 390); theme/reset controls are 44 px tall, submit is 52 px, and copy is 48 px.
- Reduced motion: PASS — the map animation is reduced to `0.01ms`; the demo produces the result within 100 ms.
- PWA offline reload: PASS — after service-worker control (`flag-removal-map-v2`), offline reload rendered the full page and the local demo produced `Removal candidate`. The worker has a versioned cache, `skipWaiting`, `clients.claim`, and old-cache deletion for update handling.
- Console/page errors and browser requests: PASS — none observed; all runtime requests remained same-origin. No analytics, cookies, third-party scripts, CDN fonts, or persisted demo inputs were observed.
- Axe Core 4.11 static routes (`/`, `/privacy/`, `/terms/`): PASS — no WCAG 2 A/AA violations before interaction.

### Release-blocking accessibility failure

After submitting the demo and rendering a result, Axe reports one **serious** `color-contrast` violation in each theme:

| Theme | Element | Foreground / background | Measured ratio | Required |
| --- | --- | --- | ---: | ---: |
| Light | `#demo h4` “Evidence readout” | `#C8C4B6` / `#FCFAF3` | 1.67:1 | 4.5:1 |
| Dark | `#demo h4` “Evidence readout” | `#34443D` / `#19231F` | 1.56:1 | 4.5:1 |

This is not present until the real interactive result is rendered, which is why a static-only scan misses it.

## Performance, headers, and deployment identity

- Lighthouse mobile production audit: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 1.0 s, LCP 2.0 s, CLS 0, TBT 100 ms, total transfer 170 KiB. Lighthouse produced its JSON report and then logged a browser-tab crash during teardown; the completed report values above were read from that JSON.
- Asset budgets: PASS — JS 5.94 kB (<200 kB), CSS 13.92 kB (<50 kB), mobile hero 33.76 kB (<300 kB), full hero 143.13 kB.
- Live response protections: HTTPS 200; HSTS (`max-age=10886400; includeSubDomains; preload`), `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff` are present. No CSP or Permissions-Policy header is sent.
- Deployment identity: PASS. SHA-256 values for live `/`, `/assets/main-DzD-wSTv.js`, `/assets/main-BeQkJ6Si.css`, `/sw.js`, `/topographic-route.webp`, and `/topographic-route-600.webp` exactly match the fresh candidate build.

## Defects by severity

### High — release blocking

1. Interactive evidence headings fail WCAG AA contrast in both light and dark themes (details above). Reproduce by opening `/`, submitting the included example, then running Axe. Correct the `h4`/result-label color token or styling and rerun Axe after all result classifications.

### Medium

1. The live CDN sends `Cache-Control: public, must-revalidate, max-age=30` for hash-named JS/CSS and immutable image assets as well as HTML and the service worker. This does not meet the stated long-lived immutable-cache policy for hashed static assets and unnecessarily revalidates every 30 seconds. Use long-lived `immutable` caching for fingerprinted assets while retaining short revalidation for HTML/service worker.

### Low / hardening observation

1. The live response has no Content-Security-Policy or Permissions-Policy header. This is not the cause of the FAIL and no unsafe/third-party runtime request was observed, but a restrictive static-site CSP would strengthen the privacy posture.

## Retest criteria

1. Make the result-panel heading colors meet at least 4.5:1 in both themes.
2. Run Axe after `remove`, `keep`, `review`, and validation-error states, at desktop and 390 px.
3. Configure immutable caching for fingerprinted assets, redeploy, and confirm the live candidate hashes and headers again.
