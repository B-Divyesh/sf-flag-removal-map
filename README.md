# Flag Removal Map

Flag Removal Map is a local CLI for engineering teams removing completed feature flags. It combines a provider export, a dated usage report, and exact repository references. It writes a Markdown removal plan for human review.

Try the one-click sample at <https://flag-removal-map.sociobot.in/demo/>.

## Install

Build and install the CLI from source:

```sh
cargo install --path .
flag-removal-map --help
```

Check the release package locally with `cargo package`.

## Try the bundled sample

```sh
flag-removal-map demo
```

The command copies `examples/` to a new temporary directory and prints the generated plan path. It does not read your current directory.

## Usage

Convert your provider export to this JSON format:

```json
{ "provider": "example", "flags": [{ "key": "checkout-v2", "enabled": false, "status": "completed" }] }
```

A dated usage report is optional. A zero count needs a valid `as_of` end timestamp from the last 90 days:

```json
{ "as_of": "2026-08-28T00:00:00Z", "window_days": 30, "evaluations": { "checkout-v2": 0 } }
```

Create a plan across one or more repositories:

```sh
flag-removal-map --flags ./flags.json --evaluations ./evaluations.json \
  --repo ./apps --repo ./packages --out ./removal-plan.md
```

Print JSON in CI without writing a plan file:

```sh
flag-removal-map --flags ./flags.json --repo . --json
```

- Repeat `--flag KEY` to select flags.
- Repeat `--exclude NAME` to skip a directory name.
- Add `--fail-on-review` to exit 4 when a flag needs human review.

### Exit codes

- `0`: analysis completed.
- `2`: an input or argument was invalid.
- `3`: a repository could not be scanned completely.
- `4`: `--fail-on-review` found at least one flag needing review.

### Decision rules

- **Keep**: the provider says enabled, or the dated usage report records evaluations.
- **Removal candidate**: the provider says complete and a recent dated usage report records zero evaluations.
- **Review**: evidence is missing, stale, conflicts, or the repository scan was incomplete.

“Removal candidate” means review the flag; it does not prove deletion is safe. Every generated plan asks a human to check ownership, rollout state, rollback, references, deployment health, and provider deletion order.

The CLI accepts JSON collections named `flags`, `items`, or `features`. It finds exact flag-key matches and labels code, configuration, test, documentation, and other references.

## Develop and verify

```sh
npm ci
npm test
npm run build
npm run test:claims
```

`npm run build` compiles the release CLI and the static site into `dist/site/`.

## Privacy and scope

The CLI reads only paths you provide and never edits repositories. It makes no provider calls. The browser demo stores only a demo session marker and clears it when you leave.

## License

MIT. See [LICENSE](LICENSE).
