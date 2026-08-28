import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const base = "https://flag-removal-map.sociobot.in";
const expectedBuild = "e945f50";
const axeSource = await readFile(new URL("../../../../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const report = { base, build: expectedBuild, routes: [], demo: {}, offline: {}, errors: [] };
const browser = await chromium.launch();

async function axe(page, route, theme) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } }));
  assert.deepEqual(result.violations, [], `${route} ${theme} Axe violations`);
  return result.violations.length;
}

try {
  for (const [path, expectedStatus, expectedTitle] of [
    ["/", 200, "Flag Removal Map — review completed flags"],
    ["/demo/", 200, "Demo — Flag Removal Map"],
    ["/privacy/", 200, "Privacy — Flag Removal Map"],
    ["/terms/", 200, "Terms — Flag Removal Map"],
    ["/not-a-real-page-polish-7", 404, "Page not found — Flag Removal Map"],
  ]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, bypassCSP: true });
    const page = await context.newPage(); const requests = []; const errors = [];
    page.on("request", (request) => requests.push(request.url()));
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (message) => { if (message.type() === "error" && !(expectedStatus === 404 && /status of 404/.test(message.text()))) errors.push(message.text()); });
    const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    const details = await page.evaluate(async () => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1: document.querySelectorAll("h1").length,
      main: document.querySelectorAll("main").length,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      socialFields: document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').length,
      appleTouch: !!document.querySelector('link[rel="apple-touch-icon"]'),
      build: document.body.innerText.match(/build ([a-f0-9]{7})/)?.[1] ?? null,
      width: document.documentElement.scrollWidth,
      viewport: innerWidth,
      local: Object.entries(localStorage),
      session: Object.entries(sessionStorage),
      indexedDb: typeof indexedDB.databases === "function" ? (await indexedDB.databases()).map((database) => database.name) : [],
    }));
    assert.equal(response?.status(), expectedStatus, path); assert.equal(details.title, expectedTitle, path); assert.equal(details.lang, "en", path); assert.equal(details.h1, 1, path); assert.equal(details.main, 1, path); assert.ok(details.canonical, `${path} canonical`); assert.equal(details.socialFields, 8, `${path} social metadata`); assert.ok(details.appleTouch, `${path} apple touch icon`); assert.equal(details.build, expectedBuild, path); assert.ok(details.width <= details.viewport, `${path} mobile overflow`); assert.deepEqual(await context.cookies(), [], `${path} cookies`); assert.deepEqual(details.local, [], `${path} local storage`); assert.deepEqual(details.session, path === "/demo/" ? [["demo:flag-removal-map", "active"]] : [], `${path} session storage`); assert.deepEqual(details.indexedDb, [], `${path} IndexedDB`); for (const request of requests) assert.equal(new URL(request).origin, new URL(base).origin, `${path} external request`); assert.equal(errors.length, 0, `${path} console errors`);
    const lightAxe = await axe(page, path, "light"); await page.getByRole("button", { name: "Use dark theme" }).click(); const darkAxe = await axe(page, path, "dark");
    report.routes.push({ path, status: response?.status(), ...details, requests: requests.length, errors, axe: { light: lightAxe, dark: darkAxe } }); await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage(); const demoRequests = []; const errors = [];
  page.on("request", (request) => demoRequests.push(request.url())); page.on("pageerror", (error) => errors.push(String(error))); page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/`, { waitUntil: "networkidle" }); await page.evaluate(() => { localStorage.setItem("real:sentinel", "local"); sessionStorage.setItem("real:sentinel", "session"); });
  await page.getByRole("link", { name: /Try it with sample data/i }).click(); await page.waitForURL(`${base}/demo/`); await page.getByRole("heading", { name: "Removal candidate" }).waitFor();
  const clickLayout = await page.evaluate(() => ({ scrollY, width: document.documentElement.scrollWidth, result: document.querySelector(".result-status")?.getBoundingClientRect().toJSON(), edit: document.querySelector(".edit-sample-link")?.getBoundingClientRect().toJSON(), form: document.querySelector("#demo-form")?.getBoundingClientRect().toJSON() }));
  assert.equal(clickLayout.scrollY, 0); assert.ok(clickLayout.result && clickLayout.result.y >= 0 && clickLayout.result.y < 844); assert.ok(clickLayout.edit && clickLayout.edit.y > clickLayout.result.y && clickLayout.edit.y < 844); assert.ok(clickLayout.form && clickLayout.form.y > clickLayout.result.y); await page.screenshot({ path: fileURLToPath(new URL("../demo-mobile-first-screen.png", import.meta.url)), fullPage: false });
  await page.goto(`${base}/?demo=1`, { waitUntil: "networkidle" }); assert.equal(page.url(), `${base}/demo/`); await page.getByRole("heading", { name: "Removal candidate" }).waitFor();
  const queryLayout = await page.evaluate(() => ({ scrollY, resultTop: document.querySelector(".result-status")?.getBoundingClientRect().top, editTop: document.querySelector(".edit-sample-link")?.getBoundingClientRect().top, references: document.querySelectorAll(".reference-list li").length })); assert.equal(queryLayout.scrollY, 0); assert.ok(queryLayout.resultTop >= 0 && queryLayout.resultTop < 844); assert.ok(queryLayout.editTop > queryLayout.resultTop && queryLayout.editTop < 844); assert.equal(queryLayout.references, 3);
  const storageBefore = await page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage).sort() })); assert.deepEqual(storageBefore.local, [["real:sentinel", "local"]]); assert.deepEqual(storageBefore.session, [["demo:flag-removal-map", "active"], ["real:sentinel", "session"]]);
  const requestCountAfterLoad = demoRequests.length; await page.locator("#provider-json").fill('{"key":"checkout-v2","enabled":true,"status":"active"}'); await page.getByRole("button", { name: "Classify sample flag" }).click(); await page.getByRole("heading", { name: "Keep" }).waitFor(); await page.getByRole("button", { name: "Reset demo" }).click(); await page.getByRole("heading", { name: "Removal candidate" }).waitFor(); assert.equal(demoRequests.length, requestCountAfterLoad, "classify and reset must not request the network"); const classifyAndResetRequests = demoRequests.length - requestCountAfterLoad;
  await Promise.all([page.waitForURL(`${base}/`), page.getByRole("link", { name: "Start for real" }).click()]); await page.waitForFunction(() => document.activeElement?.tagName === "H1"); const storageAfter = await page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage), focus: document.activeElement?.tagName })); assert.deepEqual(storageAfter.local, [["real:sentinel", "local"]]); assert.deepEqual(storageAfter.session, [["real:sentinel", "session"]]); assert.equal(errors.length, 0);
  report.demo = { landingClick: clickLayout, queryEntry: queryLayout, storageBefore, storageAfter, classifyAndResetRequests, errors }; await context.close();

  const offlineContext = await browser.newContext(); const offlinePage = await offlineContext.newPage(); await offlinePage.goto(`${base}/demo/`, { waitUntil: "networkidle" }); await offlinePage.evaluate(() => navigator.serviceWorker.ready); await offlinePage.waitForFunction(() => navigator.serviceWorker.controller !== null); await offlineContext.setOffline(true); await offlinePage.reload({ waitUntil: "domcontentloaded" }); await offlinePage.getByRole("heading", { name: "Removal candidate" }).waitFor(); report.offline = { reload: "Removal candidate", url: offlinePage.url() }; await offlineContext.close();
} finally {
  await browser.close();
}

await writeFile(new URL("live-audit.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
