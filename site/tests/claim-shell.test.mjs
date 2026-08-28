import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(".");
const run = (command, args, options = {}) => execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: "pipe", ...options });

test("@claim:source-install installs the documented local source package", async () => {
  const installRoot = await mkdtemp(resolve(tmpdir(), "flag-removal-map-claim-install-"));
  run("cargo", ["install", "--path", ".", "--root", installRoot]);
  const executable = resolve(installRoot, "bin", process.platform === "win32" ? "flag-removal-map.exe" : "flag-removal-map");
  await access(executable);
  assert.match(run(executable, ["--help"]), /Usage: flag-removal-map/);
});

test("@claim:cargo-package verifies the release package", async () => {
  run("cargo", ["package", "--allow-dirty"]);
  await access(resolve(root, "target", "package", "flag-removal-map-0.1.0.crate"));
});

test("@claim:build-artifacts emits the documented CLI and static site", async () => {
  run("npm", ["run", "build"]);
  const binary = resolve(root, "target", "release", process.platform === "win32" ? "flag-removal-map.exe" : "flag-removal-map");
  const [binaryStat] = await Promise.all([stat(binary), access(resolve(root, "dist", "site", "index.html"))]);
  assert.ok(binaryStat.isFile());
});

test("@claim:license-file ships the MIT license text", async () => {
  const license = await readFile(resolve(root, "LICENSE"), "utf8");
  assert.match(license, /Permission is hereby granted/);
});
