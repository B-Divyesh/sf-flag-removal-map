# Independent verification 2 — PASS

- Work order: `flag-removal-map-verify-2`
- Candidate commit: `e06d876b4faf398c91c57a8c716358962451a603`
- Candidate repository: `https://github.com/B-Divyesh/sf-flag-removal-map.git`
- Live URL: `https://flag-removal-map.sociobot.in/`
- Date: 2026-08-28
- Scope: clean-clone CLI/package, static site/PWA, deployed artifact, privacy, accessibility, performance, and response-policy verification. Product source was not modified.

## Verdict

**PASS.** The candidate meets the researched CLI job: it analyzes offline provider/evaluation exports, maps literal repository references, applies conservative keep/remove/review rules, and produces a reviewable plan without network access or automatic deletion. The live deployment byte-matches the candidate production output and the prior contrast/cache findings are resolved.

## Clean checkout and quality gates

A separate detached clone was made from the supplied clean checkout at the exact candidate SHA. `npm ci` installed 19 packages and reported 0 vulnerabilities. The checkout remained clean.

All commands below passed:

```sh
npm ci
npm test
npm run check
npm run build
cargo package
```

- `npm test`: PASS — 7 Rust library tests, 3 CLI integration tests, 1 Rust doctest, 6 static-site tests, and 4 Playwright browser tests. The browser suite includes all result states, both themes, 1366 px and 390 px, Axe checks, keyboard behavior, offline reload, and local response-policy assertions.
- `npm run check`: PASS — TypeScript strict check, `cargo fmt --check`, and Clippy with warnings denied.
- `npm run build`: PASS — release binary and `dist/site/` produced. Vite output was 5.94 kB JS (2.57 kB gzip) and 14.00 kB CSS (3.92 kB gzip).
- `cargo package`: PASS — crate verified by Cargo: 14 files, 92.6 KiB unpacked / 25.2 KiB compressed.

## CLI and consumer-package exercise

The generated `target/package/flag-removal-map-0.1.0.crate` was unpacked into an otherwise clean consumer directory and installed with:

```sh
cargo install --path flag-removal-map-0.1.0 --root ./install
```

The installed `flag-removal-map 0.1.0` binary provided the documented help, single binary, `--json`, non-interactive operation, and exit-code contract.

- Normal consumer run: PASS — a completed, disabled `checkout-v2` with a bounded 30-day zero-evaluation export classified as `remove`, emitted schema-version 1 JSON, found 13 literal references in the packed consumer source, and retained the explicit “does not prove safety” guardrail.
- Invalid provider JSON: PASS — exit `2`, with `flag export is not valid JSON`.
- Missing state/evidence with `--fail-on-review`: PASS — `review` result and exit `4`.
- Boundary/incomplete scan: PASS — an independently created 5 MiB + 1 byte file produced exit `3`, `scan_complete: false`, a precise skip warning, and downgraded the otherwise removal candidate to `review`.
- Source/dependency inspection and runtime behavior: PASS — the CLI has no HTTP client dependency or provider API path; it reads only the supplied local inputs and never changes repository files.

## Browser, accessibility, privacy, and PWA

Fresh Chromium checks ran directly against the live URL, rather than relying on the previous report.

- Desktop and 390 px mobile: PASS — the demo produced `Removal candidate`; negative evaluation count returned the announced validation error; changing it to one evaluation recovered to `Keep on the map`. Mobile `scrollWidth` was exactly 390 px and the theme control was 44 px high.
- Semantics: PASS — `lang=en`, title `Flag Removal Map — survey before you delete`, exactly one `h1`, a `main` landmark, and alt text on all images.
- Keyboard-only: PASS — Tab starts at the skip link and reaches the theme control and form controls. The theme control had the visible `rgb(184, 64, 42) solid 3px` focus outline with 3 px offset and toggled by Space.
- Reduced motion: PASS — the map animation duration became `0.01ms`; submitting the demo still produced the result.
- Axe Core 4.11: PASS — 0 serious/critical WCAG 2 A/AA findings on the initial page and rendered result at desktop and 390 px. The repair’s result-heading contrast held in both light and dark treatments across remove/keep/review/error states.
- Errors and outbound traffic: PASS — no console/page errors, cookies, or third-party runtime requests observed. Every observed request was same-origin; no CDN font/script or analytics request was present.
- PWA: PASS — the live service worker controlled the page; after setting the context offline, reload rendered the shell and ran the removal-candidate demo. The deployed worker is versioned (`flag-removal-map-v2`) and implements `skipWaiting`, `clients.claim`, and old-cache cleanup, providing the intended update behavior.

## Deployment identity, headers, and budgets

The fresh `dist/site/` matched the live deployment exactly by SHA-256 for `/`, `/privacy/`, `/terms/`, the fingerprinted JS/CSS, `sw.js`, and both WebP hero assets.

- Live HTML/legal pages: `Cache-Control: no-cache, must-revalidate`.
- Live fingerprinted JS/CSS and WebP: `Cache-Control: public, max-age=31536000, immutable`.
- Live worker: `Cache-Control: no-cache, no-store, must-revalidate`.
- Live responses include HSTS, CSP (`default-src 'self'` and restrictive directives), Permissions-Policy, Referrer-Policy, and `X-Content-Type-Options: nosniff`.
- Asset budgets: PASS — JS 5.94 kB (<200 kB), CSS 14.00 kB (<50 kB), mobile hero 33.76 kB (<300 kB), full hero 143.13 kB.
- Lighthouse mobile run: 97 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 1.8 s, LCP 2.3 s, CLS 0, TBT 20 ms, transfer 152 KiB. Lighthouse wrote a complete JSON report but returned nonzero after the Chromium tab crashed while collecting the final screenshot/BFCache artifact; the completed audit data was present and all product-specific Playwright checks passed independently.

## Defects by severity

No release-blocking, high, medium, or low product defects found.

## Verification commands

```sh
npm ci
npm test
npm run check
npm run build
cargo package
cargo install --path target/package/flag-removal-map-0.1.0 --root ./install
```
