import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = "https://flag-removal-map.sociobot.in";
const report = { base, build: "97e1ef0", routes: [], demo: {}, offline: {}, errors: [] };
const browser = await chromium.launch();

try {
  for (const [path, expectedStatus] of [["/", 200], ["/demo/", 200], ["/privacy/", 200], ["/terms/", 200], ["/not-a-real-page-polish-6", 404]]) {
    const context = await browser.newContext(); const page = await context.newPage(); const requests = []; const errors = [];
    page.on("request", (request) => requests.push(request.url())); page.on("pageerror", (error) => errors.push(String(error))); page.on("console", (message) => { if (message.type() === "error" && !(expectedStatus === 404 && /status of 404/.test(message.text()))) errors.push(message.text()); });
    const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    const details = await page.evaluate(async () => ({ title: document.title, h1: document.querySelectorAll("h1").length, main: !!document.querySelector("main"), build: document.body.innerText.match(/build ([a-f0-9]{7})/)?.[1] ?? null, width: document.documentElement.scrollWidth, viewport: innerWidth, local: Object.entries(localStorage), session: Object.entries(sessionStorage), indexedDb: typeof indexedDB.databases === "function" ? (await indexedDB.databases()).map((database) => database.name) : [] }));
    assert.equal(response?.status(), expectedStatus, path); assert.equal(details.h1, 1, path); assert.ok(details.main, path); assert.equal(details.build, "97e1ef0", path); assert.deepEqual(await context.cookies(), [], `${path} cookies`); assert.deepEqual(details.local, [], `${path} local storage`); assert.deepEqual(details.session, path === "/demo/" ? [["demo:flag-removal-map", "active"]] : [], `${path} session storage`); assert.deepEqual(details.indexedDb, [], `${path} IndexedDB`); for (const request of requests) assert.equal(new URL(request).origin, new URL(base).origin, `${path} external request`); assert.equal(errors.length, 0, `${path} console errors`);
    report.routes.push({ path, status: response?.status(), ...details, requests: requests.length, errors }); await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage(); const demoRequests = []; const errors = [];
  page.on("request", (request) => demoRequests.push(request.url())); page.on("pageerror", (error) => errors.push(String(error))); page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => { localStorage.setItem("real:sentinel", "local"); sessionStorage.setItem("real:sentinel", "session"); });
  await page.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
  const demoEntryUrl = page.url(); assert.equal(demoEntryUrl, `${base}/demo/`); await page.getByRole("heading", { name: "Removal candidate" }).waitFor(); assert.equal(await page.locator(".reference-list li").count(), 3); assert.ok(await page.getByText("Demo — sample data stays in this tab.").count());
  const demoStorage = await page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage), width: document.documentElement.scrollWidth, viewport: innerWidth }));
  assert.deepEqual(demoStorage.local, [["real:sentinel", "local"]]); assert.deepEqual(demoStorage.session.sort(), [["demo:flag-removal-map", "active"], ["real:sentinel", "session"]]); assert.ok(demoStorage.width <= demoStorage.viewport);
  const requestCountAfterLoad = demoRequests.length; await page.locator("#provider-json").fill('{"key":"checkout-v2","enabled":true,"status":"active"}'); await page.getByRole("button", { name: "Classify sample flag" }).click(); await page.getByRole("heading", { name: "Keep" }).waitFor(); await page.getByRole("button", { name: "Reset demo" }).click(); await page.getByRole("heading", { name: "Removal candidate" }).waitFor(); const requestsAfterReset = demoRequests.length; assert.equal(requestsAfterReset, requestCountAfterLoad, "demo actions must not request the network");
  await Promise.all([page.waitForURL(`${base}/`), page.getByRole("link", { name: "Start for real" }).click()]); await page.getByRole("heading", { name: "Review completed flags before removal" }).waitFor();
  const afterExit = await page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage), focus: document.activeElement?.tagName })); assert.deepEqual(afterExit.local, [["real:sentinel", "local"]]); assert.deepEqual(afterExit.session, [["real:sentinel", "session"]]); assert.equal(afterExit.focus, "H1"); assert.equal(errors.length, 0, "demo console errors");
  report.demo = { entryUrl: demoEntryUrl, exitUrl: page.url(), references: 3, requestCountAfterLoad, classifyAndResetRequests: requestsAfterReset - requestCountAfterLoad, exitNavigationRequests: demoRequests.length - requestsAfterReset, storageBeforeExit: demoStorage, storageAfterExit: afterExit, errors }; await context.close();

  const offlineContext = await browser.newContext(); const offlinePage = await offlineContext.newPage(); await offlinePage.goto(`${base}/demo/`, { waitUntil: "networkidle" }); await offlinePage.evaluate(() => navigator.serviceWorker.ready); await offlinePage.waitForFunction(() => navigator.serviceWorker.controller !== null); await offlineContext.setOffline(true); await offlinePage.reload({ waitUntil: "domcontentloaded" }); await offlinePage.getByRole("heading", { name: "Removal candidate" }).waitFor(); report.offline = { reload: "Removal candidate" }; await offlineContext.close();
} finally {
  await browser.close();
}

await writeFile(new URL("live-audit.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
