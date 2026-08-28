import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import test, { after, before } from "node:test";
import { chromium } from "playwright";

const root = resolve("dist/site");
const config = JSON.parse(await readFile("site/public/staticwebapp.config.json", "utf8"));
const axeSource = await readFile("node_modules/axe-core/axe.min.js", "utf8");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
};

let server;
let baseUrl;

function responseHeaders(pathname) {
  const headers = { ...config.globalHeaders };
  const route = config.routes.find(({ route }) =>
    route === pathname || (route.endsWith("*") && pathname.startsWith(route.slice(0, -1))),
  );
  return { ...headers, ...(route?.headers ?? {}) };
}

before(async () => {
  server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith("/")) pathname += "index.html";
      const file = resolve(root, `.${pathname}`);
      if (!file.startsWith(`${root}${sep}`)) throw new Error("outside site root");
      if ((await stat(file)).isDirectory()) throw new Error("directory requested without slash");
      response.writeHead(200, {
        "Content-Type": mimeTypes[extname(file)] ?? "application/octet-stream",
        ...responseHeaders(url.pathname),
      });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((done) => server.close(done));
});

function contrastRatio(foreground, background) {
  const luminance = (rgb) => {
    const channels = rgb.match(/\d+(?:\.\d+)?/g).slice(0, 3).map(Number).map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

async function assertAxe(page, label) {
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
  }));
  assert.deepEqual(results.violations, [], `${label}: ${results.violations.map((item) => item.id).join(", ")}`);
}

async function visit(browser, { colorScheme = "light", viewport = { width: 1366, height: 900 } } = {}) {
  const context = await browser.newContext({ colorScheme, viewport, bypassCSP: true });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  return { context, errors, page };
}

async function renderState(page, state) {
  if (state === "keep") {
    await page.locator("#evaluation-json").fill('{"count":1,"window_days":30}');
  } else if (state === "review") {
    await page.locator("#evaluation-json").fill("{}");
  } else if (state === "error") {
    await page.locator("#evaluation-json").fill('{"count":-1,"window_days":30}');
  }
  await page.getByRole("button", { name: /survey this flag/i }).click();
  await page.waitForFunction(() => document.querySelector("#result-panel")?.getAttribute("aria-busy") === "false" && !document.querySelector("#demo-result")?.hasAttribute("hidden"));
}

test("static routes pass WCAG A/AA checks in both color treatments", async () => {
  const browser = await chromium.launch();
  try {
    for (const colorScheme of ["light", "dark"]) {
      for (const route of ["/", "/privacy/", "/terms/"]) {
        const { context, errors, page } = await visit(browser, { colorScheme });
        await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
        await assertAxe(page, `${route} ${colorScheme}`);
        assert.deepEqual(errors, [], `${route} ${colorScheme} emitted console/page errors`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test("all interactive result states keep Axe clean and result labels above 4.5:1", async () => {
  const browser = await chromium.launch();
  try {
    for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
      for (const colorScheme of ["light", "dark"]) {
        for (const state of ["remove", "keep", "review", "error"]) {
          const { context, errors, page } = await visit(browser, { colorScheme, viewport });
          await renderState(page, state);
          const expected = {
            remove: "Removal candidate",
            keep: "Keep on the map",
            review: "Review evidence",
          }[state];
          if (expected) await assert.doesNotReject(page.getByRole("heading", { name: expected }).waitFor());
          else await assert.doesNotReject(page.getByRole("alert").waitFor());
          if (state !== "error") {
            const ratios = await page.locator(".result-panel h4").evaluateAll((labels) => labels.map((label) => ({
              foreground: getComputedStyle(label).color,
              background: getComputedStyle(label).backgroundColor,
            })));
            assert.ok(ratios.length > 0, `${state} rendered no evidence headings`);
            ratios.forEach(({ foreground, background }) => {
              const ratio = contrastRatio(foreground, background);
              assert.ok(ratio >= 4.5, `${state} ${colorScheme} ${viewport.width}px heading ratio ${ratio.toFixed(2)}`);
            });
          }
          await assertAxe(page, `${state} ${colorScheme} ${viewport.width}px`);
          if (viewport.width === 390) {
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, `${state} mobile overflow`);
          }
          assert.deepEqual(errors, [], `${state} ${colorScheme} emitted console/page errors`);
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
});

test("keyboard theme control and offline demo work without network access", async () => {
  const browser = await chromium.launch();
  try {
    const { context, errors, page } = await visit(browser, { viewport: { width: 390, height: 844 } });
    await page.getByRole("button", { name: /switch color theme/i }).focus();
    await page.keyboard.press("Space");
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await context.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: /survey every trace/i }).waitFor();
    await renderState(page, "remove");
    await page.getByRole("heading", { name: "Removal candidate" }).waitFor();
    assert.deepEqual(errors, [], "offline demo emitted console/page errors");
    await context.close();
  } finally {
    await browser.close();
  }
});

test("built response policy is present for HTML, immutable assets, and the updating worker", async () => {
  const [html, asset, worker] = await Promise.all([
    fetch(`${baseUrl}/`),
    fetch(`${baseUrl}/assets/${(await readFile("dist/site/index.html", "utf8")).match(/assets\/(main-[^"]+\.js)/)[1]}`),
    fetch(`${baseUrl}/sw.js`),
  ]);
  assert.match(html.headers.get("content-security-policy") ?? "", /default-src 'self'/);
  assert.match(html.headers.get("permissions-policy") ?? "", /geolocation=\(\)/);
  assert.equal(html.headers.get("cache-control"), "no-cache, must-revalidate");
  assert.equal(asset.headers.get("cache-control"), "public, max-age=31536000, immutable");
  assert.equal(worker.headers.get("cache-control"), "no-cache, no-store, must-revalidate");
});
