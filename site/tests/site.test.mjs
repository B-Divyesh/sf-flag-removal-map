import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
const script = await readFile(new URL("../src/main.ts", import.meta.url), "utf8");

test("landing page has the required semantic landmarks", () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<main id="main">/);
  assert.match(html, /<img[^>]+alt="[^"]+"/);
  assert.match(html, /class="skip-link"/);
});

test("interaction and motion accessibility are explicit", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(html, /aria-live="polite"/);
  assert.match(script, /prefers-reduced-motion: reduce/);
});

test("site has no third-party runtime resources", () => {
  assert.doesNotMatch(html, /<(?:script|img)[^>]+src="https?:\/\//);
  assert.doesNotMatch(html, /<link[^>]+href="https?:\/\//);
  assert.doesNotMatch(html, /fonts\.googleapis|googletagmanager|segment|plausible/i);
});

test("privacy-safe demo keeps the conservative zero-evaluation rule", () => {
  assert.match(script, /completed && count === 0 && typeof windowDays === "number"/);
  assert.match(script, /does not prove safety/);
});
