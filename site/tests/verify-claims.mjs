import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const claims = JSON.parse(await readFile(".factory/claims.json", "utf8"));
for (const claim of claims) {
  process.stdout.write(`\n[claim:${claim.id}] ${claim.test}\n`);
  execFileSync("bash", ["-lc", claim.test], { stdio: "inherit" });
}
