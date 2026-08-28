# Flag Removal Map — review 7 handoff

- Work order: `flag-removal-map-review-7`
- Candidate reviewed: `579c054bcea1b3308e92720047b8e95974332379`
- Live URL: <https://flag-removal-map.sociobot.in/>
- Result: **FAIL — one blocking mobile-demo finding.**

## What was done

- Wrote `.factory/review-7.md` after a cold live review at 390 × 844 and 1440 × 900.
- Audited every landing and README sentence, all registered/public claims, demo isolation and offline behavior, CLI demo behavior, routes, links, metadata, focus, accessibility, visual identity, and every earlier review/polish finding.
- Did not modify product code.

## Blocking result

`F-7-1` reopens review-1 `F2` on mobile. After **Try it with sample data**, the completed `Removal candidate` heading begins at y=`1507.27` while the initial 390 × 844 viewport ends at y=`844`. The user sees the editable inputs before the completed result. Put the result summary above the inputs on mobile and assert initial viewport visibility in `@claim:demo-one-click` for both the landing click and `/?demo=1`.

## Verification

Clean clone: `/tmp/flag-removal-map-review7-lpxy1d/repo`.

```sh
npm ci
npm run test:claims
npm test
npm run build
```

All commands passed. The claim runner executed all 24 registry commands. The full suite passed 9 Rust unit tests, 10 CLI integration tests, 1 doctest, 7 site tests, registry integrity, 4 shell/package tests, and 8 Playwright/Axe tests. The build emitted `target/release/flag-removal-map` and `dist/site/`.

Live checks confirmed one-click route entry, populated sample, Reset, Start for real, preserved non-demo storage sentinels, zero post-load classify/reset requests, offline reload, designed HTTP 404, route metadata, link health, H1 focus on Back, and zero Axe WCAG A/AA violations. The CLI demo ran from an empty temporary directory and left it unchanged.

## Known gap and next step

Only F-7-1 remains. Reorder the mobile demo so the completed result is visible without scrolling, extend the claim test with a 390 × 844 viewport intersection assertion, deploy, and rerun review 7.
