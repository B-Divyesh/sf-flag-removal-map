# Polish 2 — adversarial finding closure

Repair source: review 1, polish 1, and `review-2.md` at `8a180f77c7ad34f1c645db116abab1b9e13610e0`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Required a valid `as_of` end date within 90 days for zero-use removal evidence in Rust and browser code; the demo now seeds today’s date. | `dated_evidence_rule_has_cli_counterexamples`; `@claim:browser-cli-parity` |
| F-2-2 | Made the horizontally scrollable command focusable with a labelled `pre`. | `@claim:accessible-interactions` Axe and keyboard assertion |
| F-2-3 | Removed opacity from the map entrance; meaningful captions stay fully opaque. | `@claim:accessible-interactions` live Axe on home |
| F-2-4 | Replaced reused claim labels with uniquely filtered, observable claim tests and added missing CLI fixtures. | every command in `.factory/claims.json`; clean-clone run recorded in handoff |
| F-2-5 | Removed the unsupported first-screen “No accounts” fact; privacy page claim is now explicitly tested. | `@claim:privacy-site` |
| F-2-6 | Registered and asserted the exact three sample references. | `@claim:demo-one-click` |
| F-2-7 | Added a Markdown-plan test for evidence and every listed human check. | `markdown_plan_lists_evidence_and_every_human_check_across_repositories` |
| F-2-8 | Added dated/undated/invalid/stale/active browser–CLI parity coverage. | `@claim:browser-cli-parity` |
| F-2-9 / F-2-10 | Added observable repeated `--flag` and `--exclude` coverage, including a missing key. | `documented_options_and_output_contracts_are_observable` |
| F-2-11 / F-2-12 | Added all documented 0/2/3/4 exit-code fixtures. | `all_documented_exit_codes_are_observable` |
| F-2-13 | Removed the untestably broad `npm test` scope sentence. | README copy audit |
| F-2-14 | Split the privacy statement and test local assets, no remote APIs, and the local policy. | `@claim:privacy-site` |
| F-2-15 | Focuses and announces every route, including home and BFCache `pageshow`. | `@claim:accessible-interactions`; `@claim:accessibility-routing` |
| F-2-16 | Added full OG/Twitter/apple metadata to privacy, terms, and 404; 404 is `noindex`. | `@claim:route-metadata` |
| F-2-17 | Gave 404 the shared header/footer and build-time `%BUILD_ID%` coordinate injection. | `@claim:route-metadata` |
| F-2-18 | Replaced facts with offline, repository-safety, and MIT-price facts. | `@claim:first-screen-facts` |
| F-2-19 | Gave navigation links a 44 px minimum width. | `@claim:accessible-interactions` |
| F-2-20 | Standardized input language on “dated usage report” and “evaluation count.” | `.factory/copy-audit.md` |
| F-2-21 | Rewrote the exit-four explanation in plain language. | README / `all_documented_exit_codes_are_observable` |
| F-2-22 | Rewrote demo persistence copy to name the tab and session marker. | `@claim:demo-isolation` |
| F-2-23 | Replaced “47° CODE” with decorative “Repository map.” | `@claim:accessible-interactions` |
| F-2-24 | Keeps `aria-busy` true through render or error insertion. | `@claim:accessible-interactions` |
| Review-1 F1/F2/F5/F9/F10/F11 | Preserved the already-correct audience, isolated demo, source install, direct copy, and external labels. | browser/site claim suites |
| Review-1 F3/F4/F6/F7/F8 | Completed claims, designed 404, metadata, home focus, and shared error shell. | `@claim:route-metadata`, `@claim:404-page`, `@claim:accessible-interactions` |

Screenshots from the final cold local build are stored at `.factory/evidence/polish-2-home.png` and `.factory/evidence/polish-2-demo.png`. Live checks at `https://flag-removal-map.sociobot.in/` passed on build `f501beb`: home/demo/privacy/terms 200, unknown route 404, and live Axe 0 violations on every route.
