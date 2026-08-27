# Flag Removal Map — verification handoff

> **Verification status: FAIL (release blocking).** Independent QA of candidate `39451606e861400dffb41762e910e4f823180aaa` and `https://flag-removal-map.sociobot.in/` found a serious WCAG AA color-contrast failure after the interactive evidence result renders. The live deployment byte-matches the candidate, so this is not a deployment-only mismatch.

Verification evidence, exact commands, all passing checks, response headers, package-consumer test, and defects by severity are in [verification.md](verification.md). Product source was not changed during verification.

Required retest: correct the interactive result `h4` color in both themes (light 1.67:1; dark 1.56:1; required 4.5:1), then run Axe after `remove`, `keep`, `review`, and validation-error states. Also configure immutable caching for fingerprinted static assets; live assets currently use `Cache-Control: public, must-revalidate, max-age=30`.

---

## Superseded builder handoff

Work order: `flag-removal-map-build-1`

Version: `0.1.0`

Completed: 2026-08-27

## What shipped

- A Rust single-binary CLI that reads offline provider JSON, optional local evaluation counts, and one or more repository roots.
- Literal reference discovery with file/line/column/snippet coordinates and code, config, test, documentation, or other labels.
- Conservative `keep`, `remove`, and `review` decisions. A remove candidate requires explicit provider completion/disabled state plus zero observations in a bounded window. Any incomplete scan downgrades removal candidates to review.
- Human-readable Markdown cleanup plans and versioned `--json` output, with helpful exit codes and a `--fail-on-review` CI gate.
- Parsers for normalized and common array/keyed export shapes (`flags`, `items`, `features`, Flagsmith-style `feature_states`, ConfigCat-style keyed `f`).
- A Vite/vanilla TypeScript documentation site with a working local-only evidence demo, light/dark map treatments, responsive layouts, offline service worker, privacy and terms pages, and no analytics or third-party runtime assets.
- An original topographic hero generated through `/opt/fleet/lib/gen-image.sh` with the `factory-image` deployment. Final assets: `site/public/topographic-route.webp` (140 KB) and `site/public/topographic-route-600.webp` (33 KB). Prompt and provenance are recorded in `.factory/design.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo run -- --help
cargo package
```

- Static deploy root: `dist/site/` (contains `index.html`).
- Release CLI: `target/release/flag-removal-map`.
- Ready-to-publish crate: `target/package/flag-removal-map-0.1.0.crate`. Registry publishing was not performed.
- Local docs: `npm run dev`.

## Verification completed

- `npm test`: passed 10 Rust tests (7 library + 3 process-level CLI) and 4 site contract tests.
- `npm run build`: passed from `npm ci`; release binary compiled and Vite emitted `dist/site/`.
- `cargo package`: packaged and independently compiled the crate (89.9 KiB unpacked / 24.6 KiB compressed in the verification run).
- CLI smoke: normalized provider + 30-day evaluation export + sample repository produced one remove candidate, one keep decision, exact coordinates, valid Markdown, and valid versioned JSON.
- Playwright at 390 × 844: no horizontal overflow, one `h1`, `lang`, `main`, complete image alt text, successful interactive removal-candidate result, and no console/page errors.
- Playwright offline reload: the installed service worker restored the complete shell and the local evidence demo still produced a removal candidate with networking disabled.
- Axe Core 4.13 in Playwright Chromium: 0 violations on `/`, `/privacy/`, and `/terms/` in both light and dark treatments. The standalone axe CLI could not locate its own Chrome binary, so axe was injected into the available Playwright Chromium instead.
- Lighthouse mobile production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, CLS 0, TBT 0 ms, transferred size 152 KiB.
- Asset budgets: initial JS 5.94 KB, CSS 13.92 KB, mobile hero 33.76 KB, full hero 143.13 KB; all below contract limits.

## Known gaps and deliberate boundaries

- Matching is exact literal text. Dynamically assembled keys, encrypted/generated files, symlinked trees, ignored directories, files over 5 MiB, and repositories not passed to `--repo` need a separate review; the plan says so.
- Provider export formats change. The parser accepts the documented normalized shape and several common collection shapes, but intentionally does not use live provider APIs or read tokens.
- Evaluation inputs are JSON counts with an optional global/per-entry window. There is no inference from provider creation date and no claim that zero observations prove safety.
- Automatic source edits, flag serving, deployment, provider deletion, and billing are non-goals from the brief.

## Suggested next steps

- Publish signed platform binaries and the crate through the factory release workflow.
- Add fixture exports when teams encounter materially different provider schemas.
- Keep the provider deletion step after a healthy cleanup deployment in any future automation.
