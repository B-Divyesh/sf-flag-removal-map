# Flag Removal Map

Flag Removal Map is an offline-first CLI for lean engineering teams cleaning up completed feature flags. It joins a provider export, optional evaluation counts, and literal references across one or more repositories, then produces a conservative Markdown removal plan. It never changes code, contacts your provider, uploads repository contents, or treats zero observed evaluations as proof that removal is safe.

Live documentation and browser demo: <https://flag-removal-map.sociobot.in>

## Install

Download a release binary, or build the single binary from source:

```sh
cargo install --path .
flag-removal-map --help
```

Rust 1.78 or newer is supported. Registry publishing is handled by the Param Factory; a release package can be checked locally with `cargo package`.

## Usage

Export flags from LaunchDarkly, Flagsmith, Unleash, ConfigCat, or another provider into JSON. The normalized format is deliberately small:

```json
{
  "provider": "example",
  "exported_at": "2026-08-27T00:00:00Z",
  "flags": [
    { "key": "checkout-v2", "enabled": false, "status": "completed" }
  ]
}
```

Evaluation evidence is optional and remains local:

```json
{
  "as_of": "2026-08-27T00:00:00Z",
  "window_days": 30,
  "evaluations": { "checkout-v2": 0 }
}
```

Create a plan across a monorepo:

```sh
flag-removal-map \
  --flags ./flags.json \
  --evaluations ./evaluations.json \
  --repo ./apps --repo ./packages \
  --out ./flag-removal-plan.md
```

Inspect machine-readable results in CI without writing a plan:

```sh
flag-removal-map --flags ./flags.json --repo . --json
```

Limit a run with repeated `--flag KEY`, add directory names to the built-in ignore list with repeated `--exclude NAME`, or use `--fail-on-review` to exit `4` when any flag still needs human review. Exit `0` means the analysis completed, `2` means an input or argument was invalid, `3` means a repository could not be scanned completely, and `4` means the optional review gate fired.

### Decision rules

- **Keep**: the provider says the flag is active/enabled, or the supplied window contains evaluations.
- **Remove candidate**: the provider explicitly says completed/archived/disabled, and a bounded observation window reports zero evaluations.
- **Review**: evidence is missing, contradictory, or the repository scan was incomplete.

“Remove” is a workflow classification, not an automated safety claim. Every generated plan asks a human to confirm ownership, rollout state, rollback strategy, reference removal, deployment health, and only then provider deletion.

The parser accepts normalized exports plus common `flags`, `items`, and `features` collection shapes. Reference matching is literal and intentionally conservative; generated output labels code, config, test, documentation, and other references without trying to rewrite them.

## Develop and verify

```sh
npm install
npm test
npm run build
```

`npm test` runs Rust unit/integration/doc tests and the site tests. `npm run build` compiles a release CLI and the static site into `dist/site/`. Run `npm run dev` for the docs site and `npm run build:site` for only the site.

## Privacy and scope

All analysis is local. There is no telemetry, account, network request, token handling, or analytics in the CLI or site. Provider read-only exports should be generated outside this tool and kept out of version control. Flag Removal Map does not serve flags and never modifies repositories.

## License

MIT. See [LICENSE](LICENSE).
