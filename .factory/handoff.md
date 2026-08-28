# Flag Removal Map — review 4 handoff

- Work order: `flag-removal-map-review-4`
- Reviewed candidate: `2b0c205260c51ea0260f47afa96839f157693c92`
- Live URL: <https://flag-removal-map.sociobot.in/>
- Deployment: Azure Static Web Apps through `/opt/fleet/lib/deploy-static.sh flag-removal-map dist/site`; live footer reports build `3774bf6`.

## What this review did

- No product code was modified. `.factory/review-4.md` records the independent live and clean-clone review.
- The review found one remaining high-severity issue: README claims a dated usage report is optional without a dedicated claim-registry entry and directly asserting test.

## Verification

Clean clone: `/tmp/flag-removal-map-review4.pH7k6i` at `2b0c205260c51ea0260f47afa96839f157693c92`.

- `npm ci`: passed, 0 vulnerabilities reported.
- All 23 commands in `.factory/claims.json` passed verbatim from that clean clone.
- `npm test` and `npm run build` passed.
- Fresh live Chromium at 390 px and desktop verified the first screen, one-click populated demo, tab-only marker/reset/discard, offline reload, no console errors, metadata, focus, designed HTTP 404, and link destinations.
- `flag-removal-map demo` ran from an empty temporary directory, emitted one removal candidate and three references, and wrote only to its own system temporary directory.

## Known gaps

Review status: **FAIL** until `A dated usage report is optional.` has an exact registry entry and tagged CLI test. See `F-4-1` in `.factory/review-4.md`.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

The factory deploy command is `BUILD_ID=<commit-short-sha> npm run build:site` followed by `/opt/fleet/lib/deploy-static.sh flag-removal-map dist/site`.
