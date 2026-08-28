# Flag Removal Map — review 2 handoff

- Work order: `flag-removal-map-review-2`
- Candidate reviewed: `fa27e809a10d4e5f02831ce620a9465f154bafa2`
- Live URL: <https://flag-removal-map.sociobot.in>
- Verdict: **FAIL**
- Detailed report: `.factory/review-2.md`

## What was done

- Reviewed the live site cold at 390 × 844 and 1440 × 900.
- Audited every landing-page and README sentence, heading, label, and action.
- Exercised direct demo entry, edit/classify/reset/exit, storage isolation, offline reload, and the real CLI demo from a temporary directory.
- Ran every one of the 24 command strings in `.factory/claims.json` from fresh clone `/tmp/flag-review-2.aYGZ4S`.
- Rechecked review-1, polish-1, and the previous handoff against live behavior and current code.
- Crawled declared links/assets; checked titles, H1s, metadata, 404 behavior, focus, headers, responsive layout, touch targets, and live Axe states.
- Assessed missed AI/import/export/sync leverage. No additional feature is justified before correctness and verification are repaired.

## Verification summary

- All 24 registered command strings exited 0.
- The full `npm test` pipeline passed in the clean clone; `npm run build` passed through the registered build claim.
- One-click browser demo, reset, session isolation, same-origin behavior, offline reload, and CLI temp-directory demo passed.
- Internal routes/assets and the GitHub link returned 200; an unknown route returned the designed HTTP 404.
- Live first screen clearly answers what the product does, for whom, and what to click.
- Live home Axe failed on a keyboard-inaccessible scrollable command and on hero-caption contrast during the entry animation.
- The dated-evidence claim failed direct behavioral verification: browser and CLI accept undated zero usage as a removal candidate.

## Remaining work

The report contains 24 findings, including seven blockers. Highest priority:

1. Require and validate a real observation date in browser and CLI; add parity counterexamples.
2. Replace shallow/reused claim tests and register every retained public claim.
3. Fix the command scroll region, animated caption contrast, and home-route focus.
4. Complete legal/404 metadata, use the shared shell on 404, and inject the real build SHA.
5. Address the remaining first-screen, touch-target, copy, and async-state findings.

No product code was changed. Only the review and this handoff are included in the review commit.
