import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, resolve, sep } from "node:path";
import { execFileSync } from "node:child_process";
import test, { after, before } from "node:test";
import { chromium } from "playwright";

const root = resolve("dist/site");
const axeSource = await readFile("node_modules/axe-core/axe.min.js", "utf8");
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json" };
let server; let base;
before(async () => { server = createServer(async (req, res) => { try { const url = new URL(req.url ?? "/", "http://localhost"); let path = decodeURIComponent(url.pathname); if (path.endsWith("/")) path += "index.html"; let file = resolve(root, `.${path}`); let status = 200; try { await stat(file); } catch { file = resolve(root, "404.html"); status = 404; } if (!file.startsWith(`${root}${sep}`)) throw new Error("outside"); res.writeHead(status, { "Content-Type": types[extname(file)] ?? "application/octet-stream" }); res.end(await readFile(file)); } catch { res.writeHead(404).end("Not found"); } }); await new Promise((done) => server.listen(0, "127.0.0.1", done)); base = `http://127.0.0.1:${server.address().port}`; });
after(async () => new Promise((done) => server.close(done)));
async function axe(page) { await page.addScriptTag({ content: axeSource }); const results = await page.evaluate(async () => axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } })); assert.deepEqual(results.violations, []); }
const today = new Date().toISOString().slice(0, 10);

test("@claim:demo-one-click landing and query entry show the completed result in the first mobile screen", async () => {
  const browser = await chromium.launch(); const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage();
  const assertFirstScreenResult = async (entry) => {
    const result = page.getByRole("heading", { name: "Removal candidate" }); await result.waitFor();
    const resultBox = await result.boundingBox(); const editBox = await page.getByRole("link", { name: "Edit sample inputs" }).boundingBox();
    assert.equal(await page.evaluate(() => scrollY), 0, `${entry} must open at the top`); assert.ok(resultBox && resultBox.y >= 0 && resultBox.y < 844, `${entry} result must intersect the first 390 × 844 viewport`); assert.ok(editBox && editBox.y > resultBox.y && editBox.y < 844, `${entry} edit action must follow the result in the first viewport`);
    assert.equal(await page.locator(".reference-list li").count(), 3); assert.match(await page.locator("#evaluation-json").inputValue(), /"as_of"/); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
  };
  await page.goto(`${base}/`, { waitUntil: "networkidle" }); await page.getByRole("link", { name: /Try it with sample data/i }).click(); await page.waitForURL(`${base}/demo/`); await assertFirstScreenResult("landing click");
  await page.goto(`${base}/?demo=1`, { waitUntil: "networkidle" }); assert.equal(page.url(), `${base}/demo/`); await assertFirstScreenResult("?demo=1");
  await context.close(); await browser.close();
});

test("@claim:demo-isolation demo editing and reset leave non-demo storage untouched, and Start for real discards its marker", async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage();
  const storage = () => page.evaluate(() => ({
    local: Object.keys(localStorage).sort().map((key) => [key, localStorage.getItem(key)]),
    session: Object.keys(sessionStorage).sort().map((key) => [key, sessionStorage.getItem(key)]),
  }));

  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.setItem("real:flag-removal-map", "local-sentinel");
    sessionStorage.setItem("real:flag-removal-map", "session-sentinel");
  });
  await page.goto(`${base}/demo/`, { waitUntil: "networkidle" });
  assert.deepEqual(await storage(), {
    local: [["real:flag-removal-map", "local-sentinel"]],
    session: [["demo:flag-removal-map", "active"], ["real:flag-removal-map", "session-sentinel"]],
  });

  await page.locator("#provider-json").fill('{"key":"checkout-v2","enabled":true,"status":"active"}');
  await page.getByRole("button", { name: /classify sample flag/i }).click();
  await page.getByRole("heading", { name: "Keep" }).waitFor();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.getByRole("heading", { name: "Removal candidate" }).waitFor();
  assert.match(await page.locator("#provider-json").inputValue(), /"completed"/);
  assert.deepEqual(await storage(), {
    local: [["real:flag-removal-map", "local-sentinel"]],
    session: [["demo:flag-removal-map", "active"], ["real:flag-removal-map", "session-sentinel"]],
  });

  await Promise.all([page.waitForURL(`${base}/`), page.getByRole("link", { name: "Start for real" }).click()]);
  assert.deepEqual(await storage(), {
    local: [["real:flag-removal-map", "local-sentinel"]],
    session: [["real:flag-removal-map", "session-sentinel"]],
  });
  await context.close(); await browser.close();
});

test("@claim:browser-no-egress demo edits and reset make no network request after load", async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage(); await page.goto(`${base}/demo/`, { waitUntil: "networkidle" }); let requests = 0; page.on("request", () => requests++);
  await page.getByRole("button", { name: /classify sample flag/i }).click(); await page.getByRole("button", { name: /reset demo/i }).click(); assert.equal(requests, 0); await context.close(); await browser.close();
});

test("@claim:offline-reload controlled demo reloads and classifies offline", async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage(); await page.goto(`${base}/demo/`, { waitUntil: "networkidle" }); await page.evaluate(() => navigator.serviceWorker.ready); await page.waitForFunction(() => navigator.serviceWorker.controller !== null); await context.setOffline(true); await page.reload({ waitUntil: "domcontentloaded" }); await page.getByRole("heading", { name: "Removal candidate" }).waitFor(); await context.close(); await browser.close();
});

test("@claim:privacy-site every public route stays anonymous, local, and free of persistent visitor data", async () => {
  const browser = await chromium.launch();
  const routes = ["/", "/demo/", "/privacy/", "/terms/", "/not-a-real-page-privacy"];
  for (const path of routes) {
    const context = await browser.newContext(); const page = await context.newPage(); const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    assert.equal(response?.status(), path === "/not-a-real-page-privacy" ? 404 : 200, path);
    for (const request of requests) assert.equal(new URL(request).origin, new URL(base).origin, `${path} requested ${request}`);
    assert.deepEqual(await context.cookies(), [], `${path} must not set cookies`);
    const storage = await page.evaluate(async () => ({
      local: Object.keys(localStorage).sort().map((key) => [key, localStorage.getItem(key)]),
      session: Object.keys(sessionStorage).sort().map((key) => [key, sessionStorage.getItem(key)]),
      indexedDb: typeof indexedDB.databases === "function" ? (await indexedDB.databases()).map((database) => database.name) : [],
    }));
    assert.deepEqual(storage.local, [], `${path} must not use localStorage`);
    assert.deepEqual(storage.session, path === "/demo/" ? [["demo:flag-removal-map", "active"]] : [], `${path} session storage`);
    assert.deepEqual(storage.indexedDb, [], `${path} must not use IndexedDB`);
    await context.close();
  }
  await browser.close();
});

test("@claim:404-route unknown routes keep their URL and return the designed 404", async () => {
  const browser = await chromium.launch(); const page = await browser.newPage(); const response = await page.goto(`${base}/not-a-real-page-qa`); assert.equal(response.status(), 404); await page.getByRole("heading", { name: /does not exist/i }).waitFor(); assert.match(page.url(), /not-a-real-page-qa$/); await axe(page); await browser.close();
});

test("@claim:accessible-interactions pass Axe, focus home, expose command scrolling, targets, and accurate busy state", async () => {
  const browser = await chromium.launch(); const context = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" }); await axe(page); const demoLink = page.getByRole("link", { name: "Demo" }); const box = await demoLink.boundingBox(); assert.ok(box.width >= 44 && box.height >= 44); await page.locator("pre[aria-label]").focus(); assert.equal(await page.evaluate(() => document.activeElement?.tagName), "PRE");
  await page.setViewportSize({ width: 390, height: 844 }); const copyButton = page.getByRole("button", { name: "Copy install command" }); const copySize = await copyButton.evaluate((button) => { const command = button.closest(".command")?.getBoundingClientRect(); return { clientWidth: button.clientWidth, scrollWidth: button.scrollWidth, clientHeight: button.clientHeight, commandRight: command?.right ?? Infinity }; }); assert.ok(copySize.clientWidth >= 44 && copySize.clientHeight >= 44); assert.ok(copySize.scrollWidth <= copySize.clientWidth, "mobile copy label must not be clipped"); assert.ok(copySize.commandRight <= 390, "mobile install command must stay inside the viewport");
  await page.setViewportSize({ width: 1440, height: 900 });
  await demoLink.click(); await page.getByRole("heading", { name: "Classify a sample flag" }).waitFor(); await page.getByRole("link", { name: "Flag Removal Map home" }).click(); await page.getByRole("heading", { name: "Review completed flags before removal" }).waitFor(); assert.equal(await page.evaluate(() => document.activeElement?.tagName), "H1");
  await page.goto(`${base}/demo/`, { waitUntil: "networkidle" }); await page.locator("#evaluation-json").fill('not json'); const submit = page.getByRole("button", { name: /classify sample flag/i }); await submit.click(); assert.equal(await page.locator("#result-panel").getAttribute("aria-busy"), "true"); await page.getByRole("alert").waitFor(); assert.equal(await page.locator("#result-panel").getAttribute("aria-busy"), "false"); await axe(page); await context.close(); await browser.close();
});

test("@claim:browser-cli-parity browser and CLI agree on dated, undated, invalid, malformed, stale, and active usage", async () => {
  const browser = await chromium.launch(); const page = await browser.newPage(); await page.goto(`${base}/demo/`, { waitUntil: "networkidle" });
  const cases = [
    ["dated-date", `{ "count": 0, "window_days": 30, "as_of": "${today}" }`, "Removal candidate"],
    ["dated-timestamp", `{ "count": 0, "window_days": 30, "as_of": "${today}T12:30:00.25+02:30" }`, "Removal candidate"],
    ["undated", '{ "count": 0, "window_days": 30 }', "Review evidence"],
    ["invalid", '{ "count": 0, "window_days": 30, "as_of": "bad" }', "Review evidence"],
    ["malformed-suffix", `{ "count": 0, "window_days": 30, "as_of": "${today}garbageT00:00:00Z" }`, "Review evidence"],
    ["stale", '{ "count": 0, "window_days": 30, "as_of": "2000-01-01" }', "Review evidence"],
    ["active", `{ "count": 2, "window_days": 30, "as_of": "${today}" }`, "Keep"],
  ];
  const directory = await mkdtemp(resolve(tmpdir(), "flag-parity-")); const flags = `${directory}/flags.json`; const usagePath = `${directory}/usage.json`; await writeFile(flags, '{"flags":[{"key":"checkout-v2","enabled":false,"status":"completed"}]}');
  for (const [name, usage, expected] of cases) {
    const parsedUsage = JSON.parse(usage); await writeFile(usagePath, JSON.stringify({ as_of: parsedUsage.as_of, window_days: parsedUsage.window_days, evaluations: { "checkout-v2": parsedUsage.count } }));
    const output = execFileSync("cargo", ["run", "--quiet", "--", "--flags", flags, "--evaluations", usagePath, "--repo", directory, "--json"], { encoding: "utf8" }); const cliFlag = JSON.parse(output).flags[0];
    await page.locator("#evaluation-json").fill(usage); await page.getByRole("button", { name: /classify sample flag/i }).click(); assert.equal(await page.locator("#result-panel").getAttribute("aria-busy"), "true", name); await page.waitForFunction(() => document.querySelector("#result-panel")?.getAttribute("aria-busy") === "false"); await page.getByRole("heading", { name: expected }).waitFor();
    const browserReasons = await page.locator("#demo-result h3:first-of-type + ul li").allTextContents();
    assert.equal(cliFlag.classification, expected === "Removal candidate" ? "remove" : expected === "Keep" ? "keep" : "review", name); assert.deepEqual(browserReasons, cliFlag.reasons, name);
  }
  await browser.close();
});
