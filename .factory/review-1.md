# Adversarial first-read review 1 — FAIL

- Product: Flag Removal Map
- Live URL: <https://flag-removal-map.sociobot.in>
- Candidate: `67420075f28ba479dabb9ad97f547e670e87face`
- Reviewed: 2026-08-28 UTC
- Viewports: 390 × 844 and 1440 × 900, fresh Chromium contexts
- Review posture: first-time visitor, no account, no prior product context

## Verdict

**FAIL.** There are four blocking findings: the first screen does not identify the intended user, the demo is not a one-click sandbox and the CLI has no demo command, the required claim registry is absent, and unknown routes return the landing page instead of a designed 404. A PASS requires zero blocking findings and no more than three minor findings.

The underlying CLI and browser implementation are operational: clean-clone tests and build pass, the sample calculation works offline, no demo interaction request or browser persistence was observed, and Axe found no WCAG A/AA violations in the exercised states. Those results do not remove the first-read, demo-contract, claim-evidence, or routing failures below.

## Cold first screen

The following interpretation was recorded before scrolling.

| Question | 390 px | Desktop |
| --- | --- | --- |
| What does it do? | It combines a feature flag's provider status, recent evaluation evidence, and repository references into a cleanup plan for human review. | Same interpretation. |
| For whom? | **Cannot determine.** The screen says “your repositories” but never names a person, role, or team situation. | **Cannot determine.** The same copy is shown. |
| What should I click first? | The red primary action says “Install the CLI”; “Run the field demo” is secondary. | Same visual priority. |

### BLOCKING F1 — the first screen does not say who the product is for

- Quote: “Join provider state, bounded evaluation evidence, and literal references across your repositories.”
- Why this loses a first-time visitor: it names three inputs but not the intended user. “Your repositories” could refer to a platform team, an application developer, or a release manager. The README later says “lean engineering teams,” but that answer is not on the first screen.
- Concrete fix: replace the first supporting sentence with: “For small engineering teams retiring completed flags, combine provider status, recent usage, and code references into one review plan.” Keep it at or below 22 words.
- Also fix action priority: make “Try it with sample data” the primary action and put “See a completed removal plan” beside it. Keep “Install the CLI” secondary.

## Findings ordered by severity

### BLOCKING F2 — neither the site nor the CLI provides the required one-click demo

- Quotes: “Run the field demo”; “Evidence station ready”; CLI error: `unexpected argument '--demo' found`.
- Observed browser behavior: the first click changes the URL to `/#demo` and scrolls to a prefilled form. It does not show a classified flag or removal plan. The visitor must click “Survey this flag” a second time.
- Missing sandbox behavior: there is no persistent “Demo — sample data, nothing is saved” banner, no “Start for real” action, no separate demo namespace, and no explicit discard transition. `/?demo=1` and `/demo` both render the ordinary landing page with an empty result.
- CLI evidence: from an empty temporary directory, both `flag-removal-map --demo` and `flag-removal-map demo` exit `2`; no files are produced. There is no bundled `examples/` input or terminal recording of the real binary.
- What passed: the browser sample is realistic enough to exercise one flag and three references; “Reset sample” restores all three inputs, clears the result, and focuses the provider input. No localStorage, sessionStorage, or cookie value was created, and no network request occurred after the demo interaction began.
- Concrete fix: add `/demo` (and direct `?demo=1` compatibility) that immediately renders the completed sample result. Add the persistent banner, “Reset demo,” and “Start for real.” For this CLI product, also ship `examples/`, implement `flag-removal-map demo` using a temporary output directory, document it in `.factory/demo.md`, and use that real command for a self-hosted terminal recording.

### BLOCKING F3 — claim verification is absent, so every public claim is unlisted

- Quote/evidence: `.factory/claims.json` does not exist, and repository search finds zero `@claim:` tags.
- Why this misleads a visitor: statements such as “Offline,” “Read-only,” “No telemetry,” provider-shape support, exit codes, and “Nothing leaves this browser” are not tied to the required clean-sandbox tests. Passing general tests does not establish that every published promise remains verified.
- Concrete fix: create `.factory/claims.json`; give every claim below one stable ID, one exact tagged test, its public locations, and its clean sandbox. Delete or narrow any sentence that cannot be tested. At minimum, add browser/CLI parity, offline reload, no-egress, read-only filesystem, output-content, input-shape, option/exit-code, and build/install claim tests.

Every row in “Unlisted claims” below is a separate unlisted-claim finding caused by this missing registry.

### BLOCKING F4 — routing treats every unknown URL as a valid home page

- Quote/evidence: `/404` and `/not-a-real-page-qa` each return HTTP `200`, title “Flag Removal Map — survey before you delete,” and the home-page H1. `/demo` does the same.
- Why this loses a first-time visitor: copied or mistyped URLs appear valid while silently discarding the requested location. It also prevents a distinct demo route and makes crawlers index false pages.
- Concrete fix: add a designed topographic 404 page with a “Return home” link and return HTTP 404 for unknown routes. Add a real `/demo` page with title “Demo — Flag Removal Map,” include it in `sitemap.xml`, and restrict the fallback to genuine client-side routes.

### HIGH F5 — README advertises a release download that does not exist

- Quote: “Download a release binary, or build the single binary from source:”
- Evidence: the public repository returns an empty releases list, and `releases/latest` returns 404. The live install section instead says “Build from source today.”
- Why this misleads a first-time visitor: the first documented installation choice cannot be followed and conflicts with the site.
- Concrete fix: until a release asset exists, write “Build and install the CLI from source:” and show the working command. Add the release sentence only when a tested asset URL is published.

### HIGH F6 — route metadata is incomplete

- Quotes/evidence: all checked pages have no canonical link, Open Graph metadata, Twitter card metadata, or apple-touch icon. No 1200 × 630 social image is referenced. `/demo` has the home title rather than “Demo — Flag Removal Map.”
- Why this matters: shared links have no product-specific preview, duplicate route forms have no canonical target, and installed/mobile presentation lacks the required icon.
- Concrete fix: add per-route canonical, OG, and Twitter metadata; create and reference an original 1200 × 630 image based on the topographic art; add a 180 px apple-touch icon; and set the correct demo title/description.

### MEDIUM F7 — navigation does not move focus on route changes

- Quote/evidence: after selecting `#demo` or `#install`, and after browser Back returns to `#demo`, `document.activeElement` remains `BODY` rather than the destination heading. There is no route-announcement live region.
- Why this loses a keyboard or screen-reader visitor: the URL changes but reading position is not announced or moved to the new section.
- Concrete fix: use the real `/demo` route, focus its H1 after navigation, and announce the route title in an `aria-live="polite"` region. Apply the same behavior to any client-side navigation; preserve back/forward scroll state.

### MEDIUM F8 — the shared site skeleton is inconsistent across routes

- Quote/evidence: the home header contains “Field demo / Install / Source / Night map,” while Privacy and Terms contain only “← Flag Removal Map.” The home footer omits “Built by Param Factory”; legal footers contain only “Return to the map / MIT licensed.” Privacy is absent from the primary header.
- Why this loses a visitor: navigation and provenance disappear on legal routes, so the visitor cannot predict where standard controls and legal links live.
- Concrete fix: use one header and footer component on every route. Include wordmark, Demo, Install, Privacy, theme control, the product one-liner, Privacy, Terms, “Built by Param Factory,” version, and build ID.

### MEDIUM F9 — themed language obscures actions and headings

- Quotes: “THE TERRAIN,” “Plot one flag before touching code,” “Evidence station ready,” “PACK THE KIT,” “Map legend,” “Conservative by design,” and “A small, honest tool for the last mile of a rollout.”
- Why this slows a first read: these phrases depend on the cartography metaphor. Heard as a heading list, they do not identify the problem, demo state, installation section, result meanings, or product boundary.
- Concrete fix: use “Why flag age is not enough,” “Classify a sample flag,” “Sample ready to classify,” “Install the CLI,” “Classification meanings,” “What the CLI will not do,” and “A local CLI for reviewing completed feature flags.” Keep the cartographic treatment in the visual design and secondary labels.

### MEDIUM F10 — controls do not consistently name their result

- Quotes: “Run the field demo,” “Survey this flag,” “Copy,” and “Night map.”
- Why this slows a first-time visitor: the labels require interpretation and do not state the resulting state or copied value.
- Concrete fix: use “Try it with sample data,” “Classify sample flag,” “Copy install command,” and “Use dark theme” / “Use light theme.”

### LOW F11 — external links are not identified as external

- Quotes: “Source” and “GitHub.”
- Why this matters: both links leave the product origin without saying so.
- Concrete fix: label them “Source on GitHub (external)” and expose the same information in the accessible name.

## Demo and sandbox evidence

| Check | Result | Evidence |
| --- | --- | --- |
| One click shows the product in use | **FAIL — BLOCKING** | First click lands on a prefilled form and “Evidence station ready,” not a result. |
| Realistic sample | Partial | `checkout-v2`, completed/disabled, 30-day zero count, and three source/config/test references are prefilled. |
| Persistent demo banner | **FAIL** | No banner is present. |
| Reset | PASS | Restores all sample values, clears result, focuses `#provider-json`. |
| Start for real | **FAIL** | No such action or equivalent transition exists. |
| Direct demo URL | **FAIL** | `/?demo=1` and `/demo` render the ordinary landing page. |
| Separate demo storage | Not applicable in current implementation | The demo writes no browser storage at all; there is therefore no persisted real data to overwrite, but no explicit demo namespace or mode exists. |
| Demo network isolation | PASS for exercised browser flow | After initial same-origin assets loaded, click, edit, submit, and reset caused zero requests. |
| Offline sample | PASS | After service-worker control, offline reload rendered the site and produced “Removal candidate.” |
| CLI demo in temp directory | **FAIL — BLOCKING** | `--demo` and `demo` both exit 2 and write nothing. |

## Claim-test audit

The clean clone was `/tmp/flag-review-clean.C4zylJ` at the exact candidate SHA. `.factory/claims.json` was absent, so the number of declared claim tests run was **zero**. `npm test` and `npm run build` passed, but neither command contains any `@claim:<id>` test.

### Unlisted claims: live landing page

Each row is an unlisted-claim finding. “Required fix” names the minimum registry/test coverage; equivalent stable IDs are acceptable.

| ID | Exact public claim | Required fix |
| --- | --- | --- |
| UC-L01 | “Offline field mode — this page and demo still work locally.” | Add `offline-reload`; install/control the worker, set the context offline, reload, and produce the sample result. |
| UC-L02 | “Join provider state, bounded evaluation evidence, and literal references across your repositories.” | Add `combined-evidence-plan`; assert all three inputs affect the generated plan. |
| UC-L03 | “Get a reviewable cleanup route—not a false promise that ‘zero’ means safe.” | Add `zero-is-review-evidence`; assert zero alone never produces an unconditional safety result. |
| UC-L04 | “Offline” | Cover with `offline-reload` for site and an isolated-network CLI run. |
| UC-L05 | “Read-only” | Add `repository-read-only`; snapshot the input tree before and after every CLI result state. |
| UC-L06 | “No telemetry” | Add `no-egress`; deny network and inspect all browser/CLI requests during the full flow. |
| UC-L07 | “Read provider export” | Add `provider-export-input`; run from the documented JSON fixture. |
| UC-L08 | “Join activity + references” | Add `combined-evidence-plan`; assert activity changes classification while references remain mapped. |
| UC-L09 | “Write the removal plan” | Add `markdown-plan`; assert the requested file and required sections. |
| UC-L10 | “Provider dashboards can tell you that a flag looks stale.” | Remove this generalization or cite a supported provider behavior outside the product-claim registry. |
| UC-L11 | “Repository search can tell you where a key appears.” | Add `literal-reference-scan`; assert known files, lines, and kinds. |
| UC-L12 | “Neither alone tells a small team whether the cleanup route is complete.” | Narrow to the product rule and cover with `combined-evidence-plan`. |
| UC-L13 | “‘No evaluations observed’ is a clue.” | Cover with `zero-is-review-evidence`. |
| UC-L14 | “It is never proof that a code path is dead.” | Cover with `zero-is-review-evidence`; assert the warning remains in JSON and Markdown output. |
| UC-L15 | “Change the offline sample inputs and see the same decision rule the CLI applies.” | Add `browser-cli-parity`; feed identical fixtures to both implementations and compare classifications/reasons. |
| UC-L16 | “Nothing leaves this browser.” | Add `browser-no-egress`; intercept the entire demo flow and permit no request after the shell loads. |
| UC-L17 | “Paste file-name and source lines for this browser demo; the CLI scans real directories.” | Add `directory-scan`; exercise nested directories and known reference coordinates. |
| UC-L18 | “Run the survey to classify the flag and map its visible references.” | Add `browser-sample-result`; assert classification, reasons, and all three references, not just control presence. |
| UC-L19 | “One binary.” | Add `single-binary-package`; install the packed crate in a clean consumer and run it. |
| UC-L20 | “Offline inputs.” | Add `cli-offline`; run the packaged binary with network denied. |
| UC-L21 | “Reviewable output.” | Replace “reviewable” with named output content, then test those exact sections. |
| UC-L22 | “Build from source today.” | Add `source-install`; run the displayed install path from a clean consumer. |
| UC-L23 | “Release binaries can be dropped into any CI job without a service account or network dependency.” | Delete until a release asset exists; then test the downloaded artifact in a clean, network-denied CI container. |
| UC-L24 | “Active provider state or observed evaluations.” | Add `keep-rule`; assert each condition independently returns `keep`. |
| UC-L25 | “Completed state plus bounded zero evidence.” | Add `remove-candidate-rule`; assert the exact state/window requirements and safety warning. |
| UC-L26 | “Missing, contradictory, or incomplete evidence.” | Add `review-rule`; cover all three causes and incomplete-scan exit behavior. |
| UC-L27 | “No automatic edits.” | Add `repository-read-only`; hash the entire fixture tree before and after. |
| UC-L28 | “No provider calls.” | Add `cli-no-egress`; deny network for all documented workflows. |
| UC-L29 | “Exports and tokens remain under your control.” | Remove “tokens” because the CLI does not accept them; test that only supplied file paths are read. |
| UC-L30 | “No ‘safe’ badge.” | Add `no-safety-claim`; assert every removal candidate retains human-review language. |
| UC-L31 | “The plan records evidence and the human checks still required.” | Add `plan-checklist`; assert evidence and every promised check in Markdown/JSON. |
| UC-L32 | “MIT” | Add `license-file`; assert the distributed source/package contains the declared MIT license. |
| UC-L33 | “3 evidence stations” | Add a UI contract test for the three named stages, or remove the numeric caption if it refers only to decorative art. |
| UC-L34 | “Route requires review” | Align this to “Removal requires review” and cover it with `no-safety-claim`. |
| UC-L35 | “One normalized flag object.” | Replace “normalized” with the required format and add a fixture-validation test. |
| UC-L36 | “Zero needs a bounded observation window.” | Add `remove-candidate-rule`; assert zero without a positive window returns review. |
| UC-L37 | “Still human-reviewed.” | Add `no-safety-claim`; assert removal output contains the manual checklist. |
| UC-L38 | “Provider export marks the flag active or enabled.” | Add a browser/CLI parity case that returns `keep`. |
| UC-L39 | “[count] evaluations are present in the supplied evidence.” | Add a browser/CLI parity case with a nonzero count. |
| UC-L40 | “Provider export explicitly suggests completion.” | Add a browser/CLI parity case for each supported completed state. |
| UC-L41 | “Zero evaluations were observed over [window] days; that supports review but does not prove safety.” | Add `zero-is-review-evidence`; assert the exact warning in browser, JSON, and Markdown output. |
| UC-L42 | “Provider completion and a bounded zero-evaluation window are not both established.” | Add a missing-window and missing-status parity test. |
| UC-L43 | “Missing or ambiguous evidence always routes to human review.” | Add `review-rule`; exercise missing and contradictory evidence. |
| UC-L44 | “No literal references in this snapshot.” | Add a zero-match sample case and assert the fallback checks. |
| UC-L45 | “Do not remove while the provider or evaluation evidence is active.” | Add `keep-rule`; assert active status and nonzero evaluations independently block removal. |
| UC-L46 | “Repeat the survey after a representative observation window.” | Replace “representative” with a defined condition or remove the untestable qualifier. |

### Unlisted claims: README

| ID | Exact public claim | Required fix |
| --- | --- | --- |
| UC-R01 | “Flag Removal Map is an offline-first CLI for lean engineering teams cleaning up completed feature flags.” | Add `cli-offline` and name the tested job without “offline-first.” |
| UC-R02 | “It joins a provider export, optional evaluation counts, and literal references across one or more repositories, then produces a conservative Markdown removal plan.” | Add `combined-evidence-plan` with one and multiple repositories. |
| UC-R03 | “It never changes code, contacts your provider, uploads repository contents, or treats zero observed evaluations as proof that removal is safe.” | Add `repository-read-only`, `cli-no-egress`, and `zero-is-review-evidence`; split the sentence. |
| UC-R04 | “Download a release binary, or build the single binary from source:” | Delete the download option until an asset exists; cover source installation with `source-install`. |
| UC-R05 | “Rust 1.78 or newer is supported.” | Add `rust-msrv`; build and test with 1.78 in CI. |
| UC-R06 | “Registry publishing is handled by the Param Factory; a release package can be checked locally with `cargo package`.” | Remove the internal publishing statement; add `cargo-package` for the package claim. |
| UC-R07 | “Export flags from LaunchDarkly, Flagsmith, Unleash, ConfigCat, or another provider into JSON.” | State whether these are native or normalized exports; add a fixture test for each named shape. |
| UC-R08 | “The normalized format is deliberately small:” | Replace “deliberately small” with “Use this JSON format”; validate the shown fixture. |
| UC-R09 | “Evaluation evidence is optional and remains local:” | Add `optional-evaluations` and `cli-no-egress`. |
| UC-R10 | “Create a plan across a monorepo:” | Add `multiple-repositories`; assert references from each supplied root. |
| UC-R11 | “Inspect machine-readable results in CI without writing a plan:” | Add `json-stdout-only`; assert schema and absence of the plan file. |
| UC-R12 | “Limit a run with repeated `--flag KEY`, add directory names to the built-in ignore list with repeated `--exclude NAME`, or use `--fail-on-review` to exit `4` when any flag still needs human review.” | Split it; add separate option tests for selection, exclusion, and exit 4. |
| UC-R13 | “Exit `0` means the analysis completed, `2` means an input or argument was invalid, `3` means a repository could not be scanned completely, and `4` means the optional review gate fired.” | Split into a list and add one tagged `exit-codes` test covering 0, 2, 3, and 4. |
| UC-R14 | “Keep: the provider says the flag is active/enabled, or the supplied window contains evaluations.” | Add `keep-rule`; test both branches. |
| UC-R15 | “Remove candidate: the provider explicitly says completed/archived/disabled, and a bounded observation window reports zero evaluations.” | Add `remove-candidate-rule`; test every named state and missing-window counterexample. |
| UC-R16 | “Review: evidence is missing, contradictory, or the repository scan was incomplete.” | Add `review-rule`; test each cause. |
| UC-R17 | “‘Remove’ is a workflow classification, not an automated safety claim.” | Align the term to “Removal candidate” and cover with `no-safety-claim`. |
| UC-R18 | “Every generated plan asks a human to confirm ownership, rollout state, rollback strategy, reference removal, deployment health, and only then provider deletion.” | Add `plan-checklist`; assert every listed step and order. |
| UC-R19 | “The parser accepts normalized exports plus common `flags`, `items`, and `features` collection shapes.” | Add `provider-shapes`; one fixture per promised collection shape. |
| UC-R20 | “Reference matching is literal and intentionally conservative; generated output labels code, config, test, documentation, and other references without trying to rewrite them.” | Split it; add `reference-kinds` and `repository-read-only`. |
| UC-R21 | “`npm test` runs Rust unit/integration/doc tests and the site tests.” | Add a documentation contract test or keep this synchronized in the build script. |
| UC-R22 | “`npm run build` compiles a release CLI and the static site into `dist/site/`.” | Add `build-artifacts`; assert both paths after a clean build. |
| UC-R23 | “All analysis is local.” | Add `cli-no-egress` and define which file reads/writes are permitted. |
| UC-R24 | “There is no telemetry, account, network request, token handling, or analytics in the CLI or site.” | Add whole-flow browser and CLI network interception plus storage/cookie assertions. |
| UC-R25 | “Provider read-only exports should be generated outside this tool and kept out of version control.” | Keep as guidance, but change “read-only exports” to “export files” and do not treat it as a product guarantee. |
| UC-R26 | “Flag Removal Map does not serve flags and never modifies repositories.” | Add `repository-read-only`; assert no file metadata/content change. |
| UC-R27 | “Live documentation and browser demo: <https://flag-removal-map.sociobot.in>” | Add `demo-entry`; assert the URL reaches an already-rendered sample result in one click. |
| UC-R28 | “Run `npm run dev` for the docs site and `npm run build:site` for only the site.” | Add a script-contract test or keep the commands verified in the build workflow. |
| UC-R29 | “MIT.” | Add `license-file`; assert the repository and packaged crate contain the declared license. |

## Copy audit

Word-count method: whitespace-delimited tokens after removing Markdown emphasis/link destinations; hyphenated terms count as one token. The hard cap is 22 words. Landing-page sentence average is 7.5 words; README copy-unit average is 11.2 words. The averages pass, but three README sentences exceed the cap and several shorter units use unexplained product jargon or map metaphors.

### Landing-page sentences

| # | Words | Exact sentence | Flag and proposed rewrite |
| ---: | ---: | --- | --- |
| 1 | 11 | “Offline field mode — this page and demo still work locally.” | Jargon/metaphor. Rewrite: “You are offline. This page and the sample still work.” |
| 2 | 8 | “Survey every trace before you remove the flag.” | Metaphor. Rewrite: “Find every flag reference before removal.” |
| 3 | 12 | “Join provider state, bounded evaluation evidence, and literal references across your repositories.” | Jargon and missing audience; see F1. Use the F1 rewrite. |
| 4 | 12 | “Get a reviewable cleanup route—not a false promise that ‘zero’ means safe.” | “Reviewable” and “route” are vague. Rewrite: “Get a removal plan for human review. Zero recent uses do not prove a flag is safe.” |
| 5 | 15 | “An abstract topographic repository map with three evidence markers joined by a red survey route.” | No copy flag; the alt text describes the image purpose/style. |
| 6 | 6 | “Creation date is not removal evidence.” | No copy flag. |
| 7 | 10 | “Provider dashboards can tell you that a flag looks stale.” | No copy flag for the technical audience; claim is unlisted. |
| 8 | 9 | “Repository search can tell you where a key appears.” | No copy flag; claim is unlisted. |
| 9 | 12 | “Neither alone tells a small team whether the cleanup route is complete.” | Map metaphor. Rewrite: “Neither tells a small team whether it found every reference needed for cleanup.” |
| 10 | 6 | “‘No evaluations observed’ is a clue.” | No copy flag; claim is unlisted. |
| 11 | 10 | “It is never proof that a code path is dead.” | No copy flag; claim is unlisted. |
| 12 | 6 | “Plot one flag before touching code.” | Metaphor. Rewrite: “Classify a sample flag before editing code.” |
| 13 | 14 | “Change the offline sample inputs and see the same decision rule the CLI applies.” | Jargon and parity claim. Rewrite: “Edit the sample and see how the CLI classifies the flag.” |
| 14 | 4 | “Nothing leaves this browser.” | Plain, but an unlisted privacy claim. |
| 15 | 4 | “One normalized flag object.” | Jargon. Rewrite: “One flag record in the required format.” |
| 16 | 6 | “Zero needs a bounded observation window.” | Jargon. Rewrite: “A zero count needs a start and end date.” |
| 17 | 14 | “Paste file-name and source lines for this browser demo; the CLI scans real directories.” | Two ideas. Rewrite: “Paste file names and source lines here. The CLI scans folders you choose.” |
| 18 | 12 | “Run the survey to classify the flag and map its visible references.” | Metaphor and inconsistent “visible references.” Rewrite: “Classify the sample flag and list its matching lines.” |
| 19 | 2 | “One binary.” | Sentence fragment, but clear in the grouped heading. Claim is unlisted. |
| 20 | 2 | “Offline inputs.” | Sentence fragment and unclear. Rewrite: “Use local input files.” |
| 21 | 2 | “Reviewable output.” | Marketing adjective. Rewrite: “Get a Markdown plan with evidence and review steps.” |
| 22 | 4 | “Build from source today.” | Clear, but an unlisted availability claim. |
| 23 | 16 | “Release binaries can be dropped into any CI job without a service account or network dependency.” | Jargon and unsupported release path. Rewrite after a release exists: “Run the release binary in CI without credentials or internet access.” |
| 24 | 6 | “Active provider state or observed evaluations.” | Fragment/jargon. Rewrite: “Keep when the provider says enabled or the usage report records evaluations.” |
| 25 | 6 | “Completed state plus bounded zero evidence.” | Fragment/jargon. Rewrite: “Consider removal when the provider says complete and a dated usage report shows zero evaluations.” |
| 26 | 2 | “Still human-reviewed.” | Fragment. Rewrite: “A person must still review this result.” |
| 27 | 5 | “Missing, contradictory, or incomplete evidence.” | Fragment. Rewrite: “Review when evidence is missing, conflicts, or the scan is incomplete.” |
| 28 | 3 | “Conservative by design.” | Vague heading. Rewrite: “What the CLI will not do.” |
| 29 | 3 | “No automatic edits.” | No copy flag; claim is unlisted. |
| 30 | 6 | “You decide what each reference means.” | No copy flag. |
| 31 | 3 | “No provider calls.” | No copy flag; claim is unlisted. |
| 32 | 7 | “Exports and tokens remain under your control.” | Vague and introduces “tokens,” which the CLI does not accept. Rewrite: “The CLI reads only the export files you provide.” |
| 33 | 3 | “No ‘safe’ badge.” | No copy flag; claim is unlisted. |
| 34 | 10 | “The plan records evidence and the human checks still required.” | No copy flag; claim is unlisted. |
| 35 | 11 | “A small, honest tool for the last mile of a rollout.” | Marketing adjective and metaphor. Rewrite: “A local CLI for reviewing completed feature flags.” |

### Dynamic landing-page sentences

These strings appear after demo interaction and therefore are landing-page copy.

| # | Words | Exact sentence | Flag and proposed rewrite |
| ---: | ---: | --- | --- |
| 1 | 5 | “The survey could not run.” | Metaphor. Rewrite: “The sample could not be classified.” |
| 2 | 7 | “Provider export needs a non-empty string key.” | No copy flag. |
| 3 | 7 | “Provider enabled must be true or false.” | No copy flag. |
| 4 | 7 | “Evaluation count must be a non-negative integer.” | No copy flag. |
| 5 | 9 | “Observation window must be a positive number of days.” | No copy flag. |
| 6 | 4 | “The input is invalid.” | Vague fallback. Rewrite: “The sample could not be read.” Keep the next-action sentence. |
| 7 | 6 | “Check the JSON and try again.” | No copy flag. |
| 8 | 8 | “Provider export marks the flag active or enabled.” | No copy flag; claim is unlisted. |
| 9 | 8 | “[count] evaluations are present in the supplied evidence.” | No copy flag; claim is unlisted. |
| 10 | 5 | “Provider export explicitly suggests completion.” | Vague. Rewrite: “The provider marks this flag completed.” |
| 11 | 15 | “Zero evaluations were observed over [window] days; that supports review but does not prove safety.” | No copy flag; claim is unlisted. |
| 12 | 11 | “Provider completion and a bounded zero-evaluation window are not both established.” | Jargon. Rewrite: “The provider status or dated zero-usage report is missing.” |
| 13 | 9 | “Missing or ambiguous evidence always routes to human review.” | Metaphor. Rewrite: “Missing or unclear evidence requires human review.” |
| 14 | 6 | “No literal references in this snapshot.” | Jargon. Rewrite: “No exact matches appear in this sample.” |
| 15 | 8 | “Check other repositories, generated files, and runtime configuration.” | No copy flag. |
| 16 | 11 | “Do not remove while the provider or evaluation evidence is active.” | Jargon. Rewrite: “Do not remove the flag while its provider status is enabled or usage is recorded.” |
| 17 | 7 | “Confirm whether the rollout is actually complete.” | No copy flag. |
| 18 | 8 | “Repeat the survey after a representative observation window.” | Jargon. Rewrite: “Run this again after a usage period that includes normal traffic.” |
| 19 | 6 | “Confirm owner and intended final variation.” | Technical but appropriate for the intended audience. |
| 20 | 5 | “Record rollback before simplifying references.” | Unclear object. Rewrite: “Record the rollback plan before removing references.” |
| 21 | 8 | “Deploy and monitor before deleting the provider flag.” | No copy flag. |

### Landing headings, labels, and controls

These are fragments rather than sentences, so they are listed separately as required by the heading/control rules.

| Exact copy | Finding | Proposed rewrite |
| --- | --- | --- |
| “Night map” / “Day map” | Theme button is not a verb. | “Use dark theme” / “Use light theme” |
| “Run the field demo” | Does not say sample data or the result; see F2. | “Try it with sample data” |
| “THE TERRAIN” | Makes no sense outside the visual metaphor. | “WHY MORE EVIDENCE IS NEEDED” |
| “FIELD DEMO / LOCAL ONLY” | Does not disclose sample/no-save state. | “SAMPLE FLAG DEMO — NOTHING IS SAVED” |
| “Survey this flag” | Does not name the result. | “Classify sample flag” |
| “Evidence station ready” | Metaphor hides the empty state. | “Sample ready to classify” |
| “PACK THE KIT” | Does not name the section. | “INSTALL THE CLI” |
| “Copy” | Does not name what is copied. | “Copy install command” |
| “Map legend” | Metaphor hides the content. | “Classification meanings” |
| “Source” / “GitHub” | External destination is undisclosed. | “Source on GitHub (external)” |

Other labels—“Install the CLI,” “Reset sample,” “Provider export,” “Evaluation evidence,” “Repository snapshot,” “Privacy,” and “Terms”—are short and understandable for the intended technical audience.

### README sentences and headings

| # | Words | Exact copy | Flag and proposed rewrite |
| ---: | ---: | --- | --- |
| 1 | 3 | “Flag Removal Map” | Product-title heading; no copy flag. |
| 2 | 16 | “Flag Removal Map is an offline-first CLI for lean engineering teams cleaning up completed feature flags.” | “Offline-first” and “lean” are vague. Rewrite: “Flag Removal Map is a local CLI for engineering teams removing completed feature flags.” |
| 3 | 23 | “It joins a provider export, optional evaluation counts, and literal references across one or more repositories, then produces a conservative Markdown removal plan.” | **Over 22 words** and jargon. Rewrite: “It combines a provider export, usage counts, and exact code matches. It writes a Markdown removal plan for review.” |
| 4 | 21 | “It never changes code, contacts your provider, uploads repository contents, or treats zero observed evaluations as proof that removal is safe.” | Dense four-part claim. Rewrite as two sentences: “It never changes code or contacts your provider. Zero observed evaluations never prove that removal is safe.” |
| 5 | 6 | “Live documentation and browser demo: <https://flag-removal-map.sociobot.in>” | “Demo” overstates the current path; fix F2, then write “Open the sample-data demo and documentation: …” |
| 6 | 1 | “Install” | Clear heading. |
| 7 | 11 | “Download a release binary, or build the single binary from source:” | Unsupported choice; see F5. Rewrite: “Build and install the CLI from source:” |
| 8 | 6 | “Rust 1.78 or newer is supported.” | Clear, but an unlisted claim. |
| 9 | 18 | “Registry publishing is handled by the Param Factory; a release package can be checked locally with `cargo package`.” | Internal process detail and jargon. Rewrite: “Check the release package locally with `cargo package`.” |
| 10 | 1 | “Usage” | Clear heading. |
| 11 | 12 | “Export flags from LaunchDarkly, Flagsmith, Unleash, ConfigCat, or another provider into JSON.” | Could imply native support. Rewrite: “Convert your provider export to the JSON format below.” List tested native shapes separately. |
| 12 | 6 | “The normalized format is deliberately small:” | Jargon/marketing adjective. Rewrite: “Use this JSON format:” |
| 13 | 7 | “Evaluation evidence is optional and remains local:” | Jargon. Rewrite: “Usage counts are optional and stay on your computer:” |
| 14 | 6 | “Create a plan across a monorepo:” | Clear. |
| 15 | 9 | “Inspect machine-readable results in CI without writing a plan:” | Jargon. Rewrite: “Print JSON in CI without writing a plan file:” |
| 16 | 32 | “Limit a run with repeated `--flag KEY`, add directory names to the built-in ignore list with repeated `--exclude NAME`, or use `--fail-on-review` to exit `4` when any flag still needs human review.” | **Over 22 words** and three ideas. Rewrite as three bullets, one per option. |
| 17 | 31 | “Exit `0` means the analysis completed, `2` means an input or argument was invalid, `3` means a repository could not be scanned completely, and `4` means the optional review gate fired.” | **Over 22 words** and dense. Rewrite as an “Exit codes” list with one code per line. |
| 18 | 2 | “Decision rules” | Clear heading. |
| 19 | 14 | “Keep: the provider says the flag is active/enabled, or the supplied window contains evaluations.” | Slash term and “window” jargon. Rewrite: “Keep: the provider says enabled, or the dated usage report records evaluations.” |
| 20 | 15 | “Remove candidate: the provider explicitly says completed/archived/disabled, and a bounded observation window reports zero evaluations.” | Slash terms and jargon. Rewrite: “Removal candidate: the provider says complete and a dated usage report records zero evaluations.” |
| 21 | 11 | “Review: evidence is missing, contradictory, or the repository scan was incomplete.” | Clear. |
| 22 | 10 | “‘Remove’ is a workflow classification, not an automated safety claim.” | Inconsistent with “Remove candidate” / “Removal candidate”; “workflow classification” is jargon. Rewrite: “‘Removal candidate’ means review the flag; it does not prove deletion is safe.” |
| 23 | 22 | “Every generated plan asks a human to confirm ownership, rollout state, rollback strategy, reference removal, deployment health, and only then provider deletion.” | At the cap but dense. Rewrite as a checklist matching the generated plan. |
| 24 | 13 | “The parser accepts normalized exports plus common `flags`, `items`, and `features` collection shapes.” | Jargon. Rewrite: “The CLI accepts the format above and JSON collections named `flags`, `items`, or `features`.” |
| 25 | 22 | “Reference matching is literal and intentionally conservative; generated output labels code, config, test, documentation, and other references without trying to rewrite them.” | At the cap, two ideas, and jargon. Rewrite: “The CLI finds exact flag-key matches. It labels each match as code, configuration, test, documentation, or other.” |
| 26 | 3 | “Develop and verify” | Clear heading. |
| 27 | 10 | “`npm test` runs Rust unit/integration/doc tests and the site tests.” | Technical but appropriate; unlisted build claim. |
| 28 | 13 | “`npm run build` compiles a release CLI and the static site into `dist/site/`.” | Technical but appropriate; unlisted build claim. |
| 29 | 16 | “Run `npm run dev` for the docs site and `npm run build:site` for only the site.” | Clear for contributors. |
| 30 | 3 | “Privacy and scope” | Clear heading. |
| 31 | 4 | “All analysis is local.” | Plain, but an unlisted privacy claim. |
| 32 | 16 | “There is no telemetry, account, network request, token handling, or analytics in the CLI or site.” | Dense but plain; unlisted privacy claim. |
| 33 | 15 | “Provider read-only exports should be generated outside this tool and kept out of version control.” | “Read-only exports” is unclear. Rewrite: “Create provider export files outside this tool and keep them out of version control.” |
| 34 | 11 | “Flag Removal Map does not serve flags and never modifies repositories.” | Plain, but an unlisted claim. |
| 35 | 1 | “License” | Clear heading. |
| 36 | 1 | “MIT.” | Clear. |
| 37 | 2 | “See LICENSE.” | Clear. |

### Terminology consistency

| Concept | Terms currently used | Use one term |
| --- | --- | --- |
| Provider input | provider state, provider export, provider dashboard | `provider export` for the file; `status` only for its field |
| Usage input | evaluation evidence, evaluation counts, activity, bounded zero evidence, observation window | `dated usage report`; `evaluation count` only when naming the field |
| Code matches | literal references, visible references, mapped references, source lines, repository snapshot | `references` |
| Output | cleanup route, removal plan, report, reviewable output, map | `removal plan` |
| Action | survey, plot, route, analyze, classify | `classify` for the sample; `analyze` for a CLI run |
| Candidate state | Remove, remove candidate, Removal candidate | `Removal candidate` |

## Structure, link, accessibility, and identity checks

| Check | Result | Evidence |
| --- | --- | --- |
| Title pattern | PASS on `/`, `/privacy/`, `/terms/`; FAIL on `/demo` | Home: “Flag Removal Map — survey before you delete”; legal titles use the required prefix; demo reuses home. |
| One H1 and heading order | PASS on declared pages | One H1 per page; no heading-level skips in exercised static/result states. |
| `lang`, `<main>`, skip link, alt text | PASS | `verify-url.sh` and direct DOM checks pass. |
| Meta description | PASS on declared pages | Present and under 155 characters. |
| Canonical / OG / Twitter / apple-touch | FAIL | All absent. |
| Favicon | Partial | SVG favicon exists; required 180 px apple-touch icon does not. |
| 404 | **FAIL — BLOCKING** | Unknown paths return the landing page with status 200. |
| Deep links | Partial | `/privacy/` and `/terms/` work; `/demo` does not represent demo state. |
| Back button and focus | FAIL | Hash history returns, but focus remains on `BODY`; no announcement. |
| Declared-link crawl | PASS | Home, Privacy, Terms, assets, robots, sitemap, and GitHub return 200; fragment targets exist. |
| External-link disclosure | FAIL | “Source” and “GitHub” do not say they leave the site. |
| Header/footer consistency | FAIL | Legal routes use reduced, different chrome; factory credit is absent. |
| Privacy/Terms links | Partial | Present in the home footer, absent from legal footers/header. |
| Robots/sitemap | Partial | Both exist; sitemap omits required demo and 404 handling is invalid. |
| Visual identity | PASS | The field-cartography palette, contour art, square survey marks, serif/monospace pairing, and no-gradient layout are visibly product-specific rather than a generic SaaS hero/card template. |
| 390 px layout | PASS | `scrollWidth` equals 390; controls and content remain usable. |
| Keyboard/focus style | PASS for controls | Existing browser test covers the theme control and visible focus. Route-change focus fails separately. |
| Reduced motion | PASS | Browser suite confirms the reduced-motion path and prompt result rendering. |
| Axe WCAG A/AA | PASS in exercised states | Zero violations on `/`, rendered removal result, `/privacy/`, and `/terms/`, in light/dark at 390 and 1440 px. |
| Console/page errors | PASS | None on live first load or exercised demo/offline flows. |
| JavaScript budget | PASS | Production JS is 5.94 kB raw / 2.57 kB gzip. |

## Commands and observed results

```text
# Clean clone at 67420075f28ba479dabb9ad97f547e670e87face
npm ci                         PASS (19 packages, 0 vulnerabilities)
npm test                       PASS (7 Rust unit, 3 CLI integration, 1 doc,
                               6 site, 4 browser tests)
npm run build                  PASS (release CLI and dist/site)

# Required claim evidence
test -f .factory/claims.json   FAIL (file absent)
rg '@claim:'                   0 matches

# Required CLI demo, from /tmp/flag-cli-demo.UlaDet
flag-removal-map --demo        FAIL, exit 2
flag-removal-map demo          FAIL, exit 2

# Live baseline
verify-url.sh <live-url>       PASS: 200, title/lang/main/H1/alt/buttons,
                               no console or page errors
Playwright + Axe 4.11          PASS: 0 WCAG A/AA violations in tested routes,
                               themes, widths, and rendered sample result
```

## Retest conditions

1. Put an audience sentence and “Try it with sample data” primary action on the first screen.
2. Make `/demo` immediately show a completed sample result with the required banner, reset, real-start transition, and isolated storage semantics.
3. Add and document a real CLI demo command with bundled examples and temporary output.
4. Add `.factory/claims.json` and one tagged, clean-sandbox test for every retained claim listed above.
5. Serve a designed 404 with status 404; verify `/demo` has its own title, H1, focus behavior, and sitemap entry.
6. Correct the metadata, shared header/footer, copy flags, terminology drift, and unsupported release instruction.

Until all four blocking findings are removed, the verdict remains **FAIL**.
