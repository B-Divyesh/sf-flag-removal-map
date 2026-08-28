import { spawnSync } from "node:child_process";

const kind = process.argv[2];
if (!['site', 'browser'].includes(kind)) throw new Error('Expected site or browser test kind.');
const file = `site/tests/${kind}.test.mjs`;
const result = spawnSync(process.execPath, ['--test', ...process.argv.slice(3), file], { stdio: 'inherit' });
process.exit(result.status ?? 1);
