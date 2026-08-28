import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import test, { after, before } from "node:test";
import { chromium } from "playwright";

const root = resolve("dist/site");
const axeSource = await readFile("node_modules/axe-core/axe.min.js", "utf8");
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json" };
let server; let base;
before(async () => { server = createServer(async (req, res) => { try { const url = new URL(req.url ?? "/", "http://localhost"); let path = decodeURIComponent(url.pathname); if (path.endsWith("/")) path += "index.html"; let file = resolve(root, `.${path}`); let status = 200; try { await stat(file); } catch { file = resolve(root, "404.html"); status = 404; } if (!file.startsWith(`${root}${sep}`)) throw new Error("outside"); res.writeHead(status, { "Content-Type": types[extname(file)] ?? "application/octet-stream" }); res.end(await readFile(file)); } catch { res.writeHead(404).end("Not found"); } }); await new Promise((done) => server.listen(0, "127.0.0.1", done)); base = `http://127.0.0.1:${server.address().port}`; });
after(async () => new Promise((done) => server.close(done)));
async function axe(page) { await page.addScriptTag({ content: axeSource }); const results = await page.evaluate(async () => axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } })); assert.deepEqual(results.violations, []); }

test("@claim:demo-one-click direct demo renders a completed plan, isolation banner, and sample namespace", async () => {
  const browser = await chromium.launch(); const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage();
  await page.goto(`${base}/demo/`, { waitUntil: "networkidle" }); await page.getByRole("heading", { name: "Removal candidate" }).waitFor();
  await assert.doesNotReject(page.getByText(/Demo — sample data/).waitFor()); assert.equal(await page.evaluate(() => sessionStorage.getItem("demo:flag-removal-map")), "active");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390); await axe(page); await context.close(); await browser.close();
});

test("@claim:browser-no-egress demo changes do not make a network request after the shell loads", async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage(); await page.goto(`${base}/demo/`, { waitUntil: "networkidle" }); let requests = 0; page.on("request", () => requests++);
  await page.getByRole("button", { name: /classify sample flag/i }).click(); await page.getByRole("button", { name: /reset demo/i }).click(); assert.equal(requests, 0); await context.close(); await browser.close();
});

test("@claim:offline-reload the controlled demo reloads and classifies the bundled sample offline", async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage();
  await page.goto(`${base}/demo/`, { waitUntil: "networkidle" }); await page.evaluate(() => navigator.serviceWorker.ready); await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true); await page.reload({ waitUntil: "domcontentloaded" }); await page.getByRole("heading", { name: "Removal candidate" }).waitFor(); await context.close(); await browser.close();
});

test("@claim:404-page unknown routes retain their URL and return the designed page with 404", async () => {
  const browser = await chromium.launch(); const page = await browser.newPage(); const response = await page.goto(`${base}/not-a-real-page-qa`); assert.equal(response.status(), 404); await page.getByRole("heading", { name: /does not exist/i }).waitFor(); await axe(page); await browser.close();
});
