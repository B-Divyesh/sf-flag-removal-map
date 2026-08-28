# Flag Removal Map — adversarial review handoff

- Work order: `flag-removal-map-review-1`
- Candidate reviewed: `67420075f28ba479dabb9ad97f547e670e87face`
- Live URL: <https://flag-removal-map.sociobot.in>
- Review date: 2026-08-28 UTC
- Verdict: **FAIL**
- Product source changed: none

## Delivered

- `.factory/review-1.md` contains the cold 390 px/desktop first-read record, ordered findings, complete landing/README sentence audit with word counts, unlisted-claim inventory, demo/privacy/offline evidence, structure crawl, accessibility results, and retest conditions.
- Four blockers were verified: no audience on the first screen; no one-click browser or CLI demo contract; no `.factory/claims.json` or tagged claim tests; and no real 404 because unknown paths return the home page with status 200.

## Verification performed

From a clean clone at the candidate SHA:

```sh
npm ci
npm test
npm run build
```

All three commands passed. The clean browser suite included Axe, both themes, 390 px/desktop states, keyboard operation, reduced motion, and offline reload. The production build emitted 5.94 kB JavaScript (2.57 kB gzip).

Additional live checks:

- `/opt/fleet/lib/verify-url.sh` passed HTTPS/status, title, language, H1, main, alt text, button labels, and console/page-error checks.
- Playwright plus Axe 4.11 reported zero WCAG A/AA violations on `/`, the rendered sample result, `/privacy/`, and `/terms/`, in light/dark at 390 × 844 and 1440 × 900.
- The browser demo sent no requests after initial same-origin assets loaded, created no localStorage/sessionStorage/cookie values, and produced the sample result after an offline reload.
- “Reset sample” restored the fixture and cleared the result.
- From an empty temporary directory, both `flag-removal-map --demo` and `flag-removal-map demo` failed with exit 2 and wrote no output.
- The declared-link crawl found no dead published links; the GitHub source link returned 200. The repository has no published releases despite the README download instruction.

## Known gaps and next step

No product repair was authorized or made. Address the four blockers and the high/medium copy, metadata, focus, and shared-shell findings in `.factory/review-1.md`, add claim-specific tests, then run the listed retest conditions before requesting another independent review.
