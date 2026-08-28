import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(".");
const claimSources = ["src", "tests", "site/tests"];

async function filesBelow(directory) {
  const entries = await readdir(resolve(root, directory), { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => entry.isDirectory()
    ? filesBelow(`${directory}/${entry.name}`)
    : [`${directory}/${entry.name}`]));
  return files.flat();
}

test("claim registry has one tagged, selectable test for every public claim", async () => {
  const claims = JSON.parse(await readFile(resolve(root, ".factory", "claims.json"), "utf8"));
  const sources = (await Promise.all(claimSources.map(filesBelow))).flat();
  const tags = new Map();

  for (const source of sources) {
    const text = await readFile(resolve(root, source), "utf8");
    for (const match of text.matchAll(/@claim:([a-z0-9-]+)/g)) {
      const id = match[1];
      const nearbyFunction = text.slice(match.index, (match.index ?? 0) + 500).match(/\bfn\s+([a-zA-Z0-9_]+)/)?.[1];
      tags.set(id, [...(tags.get(id) ?? []), { source, functionName: nearbyFunction }]);
    }
  }

  const ids = claims.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length, "claim IDs must be unique");
  for (const claim of claims) {
    const matches = tags.get(claim.id) ?? [];
    assert.equal(matches.length, 1, `${claim.id} must have exactly one @claim tag`);
    const taggedSelector = `@claim:${claim.id}`;
    const functionName = matches[0].functionName;
    assert.ok(claim.test.includes(taggedSelector) || (functionName && claim.test.includes(functionName)), `${claim.id} must select its tagged test`);
  }
  for (const id of tags.keys()) assert.ok(ids.includes(id), `${id} is an orphaned @claim tag`);
});
