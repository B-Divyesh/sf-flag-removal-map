# Flag Removal Map — verification handoff

> **Independent verification status: PASS.** Candidate `e06d876b4faf398c91c57a8c716358962451a603` passed clean-checkout, consumer-package, and live-deployment QA on 2026-08-28. See `.factory/verification-2.md` for the complete evidence.

- Tested URL: <https://flag-removal-map.sociobot.in/>
- Product code changed during verification: none
- All quality gates passed: `npm test`, `npm run check`, `npm run build`, and `cargo package`.
- The live HTML, legal pages, fingerprinted assets, worker, and WebP assets byte-match the fresh candidate build.
- No release-blocking, high, medium, or low product defects found.

## Verified run and handoff

```sh
npm ci
npm test
npm run check
npm run build
cargo package
```

- Release binary: `target/release/flag-removal-map`
- Ready-to-publish crate: `target/package/flag-removal-map-0.1.0.crate`
- Registry publishing was not performed.

## Prior repair context

> **Release status: PASS.** This repair resolves the independent verifier's interactive WCAG AA failure and its required static-cache correction. The deployed artifact matches the local production build.

- Work order: `flag-removal-map-repair-1`
- Repair commit: `6f5aab7e` (`fix: repair interactive accessibility and cache policy`)
- Base verification report: `7581f2a908fde4ff875511c391426f55cae6ca68` for candidate `39451606e861400dffb41762e910e4f823180aaa`
- Deployment: Azure Static Web Apps, production deployment `f2dea322-8159-4923-8c97-ca51c0287857`
- Live URL: <https://flag-removal-map.sociobot.in/>

## Repairs made

- Dynamic evidence headings now render as deliberate ink-on-stock labels (`--background` on an explicit `--text` surface), replacing the low-contrast contour treatment. Their measured ratios are **14.19:1** in the light treatment and **15.65:1** in the dark treatment.
- Validation errors use the same high-contrast panel copy while retaining a danger-colored border and explicit error wording. This was found while completing the verifier's requested validation-error retest.
- Added `site/public/staticwebapp.config.json`: HTML gets short revalidation; fingerprinted JS/CSS and immutable WebP assets get `public, max-age=31536000, immutable`; `sw.js` gets `no-cache, no-store, must-revalidate`.
- Added restrictive CSP, Permissions-Policy, Referrer-Policy, and `nosniff` headers without adding any runtime dependency, analytics, cookies, or third-party request.
- Added strict TypeScript checking plus Playwright 1.58.2/Axe 4.11 regression coverage. These are development-only dependencies and do not affect the shipped JS bundle.

## Verification evidence

From a clean `npm ci` (19 packages, 0 vulnerabilities):

```sh
npm test
npm run check
npm run build
cargo package
```

All passed.

- `npm test`: 7 Rust unit, 3 CLI integration, 1 Rust doctest, 6 static-site contract, and 4 browser integration tests passed. Browser coverage runs Axe after `remove`, `keep`, `review`, and validation-error states in both light/dark treatments at 1366 px and 390 px; it also checks mobile overflow, keyboard theme control, PWA offline reload/demo, static legal routes, response policy, and console/page errors.
- `npm run check`: TypeScript strict check, `cargo fmt --check`, and Clippy with warnings denied passed.
- `npm run build`: release binary plus `dist/site/` passed. Output: 5.94 kB JS (2.57 kB gzip), 14.00 kB CSS (3.92 kB gzip), 33.76 kB mobile hero, 143.13 kB full hero.
- `cargo package`: passed, 14 files, 92.6 KiB unpacked / 25.2 KiB compressed. Consumer verification unpacked the crate and successfully ran `cargo install --path … --root …` followed by installed-binary `--help`.
- Local `verify-url.sh`: HTTP 200; title, `lang=en`, one `h1`, `main`, image alt text, labeled buttons, and zero console/page errors.
- Playwright Axe on the deployed removal-candidate result: 0 WCAG 2 A/AA violations in both themes at desktop and 390 px; all observed runtime requests were same-origin and there were no console/page errors.
- Lighthouse mobile (production build): Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, CLS 0, TBT 0 ms, total transfer 151 KiB.

## Live deployment verification

- `verify-url.sh https://flag-removal-map.sociobot.in/`: HTTPS 200, 808 ms network-idle load, zero console/page errors, title/lang/main/alt/button checks passed.
- Live headers: HTML has `Cache-Control: no-cache, must-revalidate`; hashed assets and WebP images have `public, max-age=31536000, immutable`; `sw.js` has `no-cache, no-store, must-revalidate`; CSP and Permissions-Policy are present. HSTS, Referrer-Policy, and `X-Content-Type-Options: nosniff` are present.
- Deployment identity: SHA-256 matched between `dist/site/` and live `/`, JS, CSS, `sw.js`, and both hero images.

## Run, package, and deploy

```sh
npm ci
npm test
npm run build
cargo package
/opt/fleet/lib/deploy-static.sh flag-removal-map dist/site
```

- Deploy root: `dist/site/`.
- Release binary: `target/release/flag-removal-map`.
- Ready-to-publish crate: `target/package/flag-removal-map-0.1.0.crate`. Registry publishing was intentionally not performed.

## Known boundaries

- The CLI remains intentionally conservative: literal matching only; incomplete scans, dynamic/generated keys, unsupported provider-export shapes, or missing evidence require review.
- Automatic source edits, provider deletion, provider API calls, analytics, and billing remain out of scope.
