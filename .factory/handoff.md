# Flag Removal Map — review 5 handoff

- Work order: `flag-removal-map-review-5`
- Reviewed candidate: `d88e3ac1307f0aa93f6a0fb824f4b618db65464e`
- Live URL: <https://flag-removal-map.sociobot.in/>
- Review status: **FAIL** — one blocking claims-registry integrity finding in `.factory/review-5.md`.

## What was done

- Performed a fresh, read-only 390 px and desktop review of the live site.
- Verified the populated one-click browser demo, storage isolation, reset/discard behavior, no post-load demo egress, offline reload, and the CLI demo from an empty temporary directory.
- Ran every command in `.factory/claims.json` from clean clone `/tmp/flag-removal-map-review5-clean.g2QaKo`, then ran `npm test` and `npm run build`.
- Checked routes, metadata, 404, links, focus/Back behavior, console errors, accessibility baseline, headers, visual system, prior review history, and current source.

## Verification

- All 24 listed claim commands passed.
- `npm test` passed: 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, and 6 browser/Axe tests.
- `npm run build` passed and emitted the release CLI and `dist/site/index.html`.
- `/opt/fleet/lib/verify-url.sh` passed on the home page: title, `lang`, one H1, main landmark, image alt coverage, and no console errors.
- Live home, demo, privacy, and terms returned 200; an unknown route returned the designed HTTP 404.

## Known gap / next step

The registry does not provide exactly one `@claim:<id>` tag for every claim: `404-route` points at `@claim:404-page`, `decision-rule` is duplicated, and four shell-command claims have no tag. Repair the tag mapping and add a registry-integrity test before declaring the product accepted. No product code was modified by this review.
