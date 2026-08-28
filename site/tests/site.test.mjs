import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [home, demo, privacy, terms, notFound, script, css, config, sitemap] = await Promise.all([
  read("../index.html"), read("../demo/index.html"), read("../privacy/index.html"), read("../terms/index.html"), read("../404.html"), read("../src/main.ts"), read("../src/styles.css"), read("../public/staticwebapp.config.json"), read("../public/sitemap.xml"),
]);
const routes = [home, demo, privacy, terms, notFound];

test("@claim:route-metadata every route has complete title, canonical, social, icon, and shell metadata", () => {
  for (const html of routes) {
    assert.match(html, /<html lang="en">/); assert.match(html, /<title>[^<]{1,60}<\/title>/); assert.match(html, /name="description"/); assert.match(html, /rel="canonical"/);
    for (const name of ["og:type", "og:title", "og:description", "og:image", "twitter:card", "twitter:title", "twitter:description", "twitter:image"]) assert.match(html, new RegExp(`(?:property|name)="${name}"`));
    assert.match(html, /apple-touch-icon/); assert.match(html, /<main id="main"/); assert.match(html, /href="\/privacy\//); assert.match(html, /href="\/terms\//); assert.match(html, /Source on GitHub \(external\)/); assert.match(html, /build %BUILD_ID%/);
  }
  assert.match(demo, /<title>Demo — Flag Removal Map<\/title>/); assert.match(notFound, /name="robots" content="noindex"/); assert.match(sitemap, /\/demo\//);
});

test("@claim:demo-isolation demo uses its own marker and gives reset and discard controls", () => {
  assert.match(home, /Try it with sample data/); assert.match(home, /href="\/demo\//); assert.match(demo, /Demo — sample data stays in this tab\./); assert.match(demo, /Reset demo/); assert.match(demo, /Start for real/);
  assert.match(script, /sessionStorage\.setItem\("demo:flag-removal-map"/); assert.match(script, /sessionStorage\.removeItem\("demo:flag-removal-map"/); assert.match(script, /location\.replace\("\/demo\/"\)/);
});

test("@claim:privacy-site local assets, storage, and network policy match the privacy statement", () => {
  for (const html of routes) assert.doesNotMatch(html, /<(?:script|img)[^>]+(?:src|href)="https?:\/\//);
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|WebSocket/); assert.match(privacy, /no accounts, analytics, advertising, cookies, or remote fonts/); assert.match(config, /default-src 'self'/);
});

test("@claim:decision-rule browser code requires a recent valid observation date for zero usage", () => {
  assert.match(script, /observationUtcDays/); assert.match(script, /complete && count === 0 && recentDate/); assert.match(script, /valid observation end date from the last 90 days/);
});

test("@claim:accessibility-routing every route focuses and announces its destination", () => {
  assert.match(script, /h1\.focus/); assert.match(script, /route-announcement/); assert.match(script, /addEventListener\("pageshow"/); assert.match(css, /:focus-visible/); assert.match(css, /prefers-reduced-motion: reduce/); assert.match(home, /<pre tabindex="0" aria-label="Example command">/);
});

test("@claim:404-route static deployment serves the designed 404 without a home fallback", () => {
  const policy = JSON.parse(config); assert.equal(policy.responseOverrides["404"].rewrite, "/404.html"); assert.equal(policy.responseOverrides["404"].statusCode, 404); assert.equal(policy.navigationFallback, undefined); assert.match(notFound, /This map page does not exist/);
});

test("@claim:first-screen-facts the landing page states offline, local safety, and free license facts", () => {
  assert.match(home, /Works offline after the first visit/); assert.match(home, /Does not edit repositories/); assert.match(home, /Free under the MIT License/); assert.match(home, /dated usage report/);
});
