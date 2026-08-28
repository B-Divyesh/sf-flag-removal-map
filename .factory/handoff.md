# Flag Removal Map — review 3 handoff

- Work order: `flag-removal-map-review-3`
- Reviewer commit: this review's documentation commit (see Git history)
- Product code modified: no
- Verdict: **FAIL**

## What was done

- Performed cold live checks at 390 px and desktop.
- Exercised the live one-click demo, reset/exit isolation, storage sentinels, request interception, service-worker offline reload, metadata, route focus/back, link crawl, and Axe in light/dark themes.
- Ran all 23 `.factory/claims.json` commands from clean clone `/tmp/flag-removal-map-review3.97qcsZ`; all command exits passed.
- Ran local `npm test`; it passed. The clean-clone build-artifacts claim also passed and produced the release CLI and `dist/site/`.
- Read every prior review, polish note, verification note, and handoff. Wrote the full adversarial report in `.factory/review-3.md`.

## Blocking gap

The CLI treats `as_of: "2026-08-28garbageT00:00:00Z"` as valid and returns `remove`; live browser demo returns `Review evidence` for the same input. This contradicts the valid-date rule and the claimed browser/CLI parity. See `F-3-1` in the review.

## How to verify

```sh
npm ci
npm test
npm run build
```

For the defect, run the CLI with the bundled completed sample and an `as_of` timestamp whose first ten characters are a recent date and whose suffix is invalid, then enter the exact same JSON into `/demo/`. The outputs diverge as documented in the review.

## Next step

Strictly validate the complete observation timestamp in the CLI, add the malformed timestamp to the browser/CLI parity claim, and repeat the independent review.
