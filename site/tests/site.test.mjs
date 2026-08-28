import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [home, demo, privacy, terms, script, css, config, sitemap] = await Promise.all([
  read("../index.html"), read("../demo/index.html"), read("../privacy/index.html"), read("../terms/index.html"), read("../src/main.ts"), read("../src/styles.css"), read("../public/staticwebapp.config.json"), read("../public/sitemap.xml"),
]);

test("@claim:route-metadata every published route has a title, canonical metadata, shell, and legal links", () => {
  for (const html of [home, demo, privacy, terms]) {
    assert.match(html, /<html lang="en">/); assert.match(html, /<title>[^<]+<\/title>/); assert.match(html, /rel="canonical"/);
    assert.match(html, /<main id="main"/); assert.match(html, /href="\/privacy\//); assert.match(html, /href="\/terms\//);
  }
  assert.match(demo, /<title>Demo — Flag Removal Map<\/title>/); assert.match(sitemap, /\/demo\//);
});

test("@claim:demo-isolation demo has direct entry, banner, reset, real start, and separate session namespace", () => {
  assert.match(home, /Try it with sample data/); assert.match(home, /href="\/demo\//);
  assert.match(demo, /Demo — sample data, nothing is saved to your real data/); assert.match(demo, /Reset demo/); assert.match(demo, /Start for real/);
  assert.match(script, /demo:flag-removal-map/); assert.match(script, /location\.replace\("\/demo\/"\)/);
});

test("@claim:privacy-no-egress page assets are local and demo does not call a remote endpoint", () => {
  assert.doesNotMatch(home, /<(?:script|img)[^>]+src="https?:\/\//); assert.doesNotMatch(home, /fonts\.googleapis|googletagmanager|segment|plausible/i);
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|WebSocket/); assert.match(config, /default-src 'self'/);
});

test("@claim:decision-rule the browser requires completed status and dated zero usage for a removal candidate", () => {
  assert.match(script, /if \(complete\) return \{ classification: "remove"/); assert.match(script, /days <= 0/); assert.match(script, /does not prove safety/);
});

test("@claim:accessibility-site the route model has focus, announcements, visible focus, and reduced motion", () => {
  assert.match(script, /h1\.focus/); assert.match(script, /route-announcement/); assert.match(css, /:focus-visible/); assert.match(css, /prefers-reduced-motion: reduce/);
});

test("@claim:404-route static deployment returns the designed 404 document instead of a home fallback", () => {
  const policy = JSON.parse(config); assert.equal(policy.responseOverrides["404"].rewrite, "/404.html"); assert.equal(policy.responseOverrides["404"].statusCode, 404); assert.equal(policy.navigationFallback, undefined);
});
