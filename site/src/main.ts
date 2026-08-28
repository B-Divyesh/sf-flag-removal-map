import "./styles.css";

type Classification = "keep" | "remove" | "review";

const examples = {
  provider: `{
  "key": "checkout-v2",
  "enabled": false,
  "status": "completed"
}`,
  evaluation: `{
  "count": 0,
  "window_days": 30
}`,
  source: `src/checkout.ts: client.boolVariation("checkout-v2", false)
deploy/flags.yaml: checkout-v2: false
tests/checkout.test.ts: seedFlag("checkout-v2")`,
};

const names: Record<Classification, string> = { keep: "Keep", remove: "Removal candidate", review: "Review evidence" };

function focusRoute(): void {
  const h1 = document.querySelector<HTMLElement>("h1");
  const notice = document.querySelector<HTMLElement>("#route-announcement");
  if (h1) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
  if (notice) notice.textContent = document.title;
}

function configureTheme(): void {
  const button = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (!button) return;
  const label = button.querySelector<HTMLElement>(".theme-label");
  const media = matchMedia("(prefers-color-scheme: dark)");
  const dark = () => document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && media.matches);
  const update = () => {
    const value = dark();
    button.setAttribute("aria-pressed", String(value));
    button.setAttribute("aria-label", value ? "Use light theme" : "Use dark theme");
    if (label) label.textContent = value ? "Use light theme" : "Use dark theme";
  };
  button.addEventListener("click", () => { document.documentElement.dataset.theme = dark() ? "light" : "dark"; update(); });
  media.addEventListener("change", update); update();
}

function configureOffline(): void {
  const bar = document.querySelector<HTMLElement>("#offline-bar");
  const update = () => { if (bar) bar.hidden = navigator.onLine; };
  addEventListener("online", update); addEventListener("offline", update); update();
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node;
}

function renderResult(container: HTMLElement, classification: Classification, key: string, reasons: string[], references: string[]): void {
  container.replaceChildren(el("p", `FLAG / ${key}`, "result-kicker"));
  container.append(el("h2", names[classification], `result-status ${classification}`));
  container.append(el("h3", "Evidence"));
  const evidence = el("ul"); reasons.forEach((reason) => evidence.append(el("li", reason))); container.append(evidence);
  container.append(el("h3", `References / ${references.length}`));
  if (references.length) { const list = el("ol", undefined, "reference-list"); references.forEach((reference) => list.append(el("li", reference))); container.append(list); }
  else container.append(el("p", "No exact matches appear in this sample. Check other repositories, generated files, and runtime configuration."));
  container.append(el("h3", "Human checks"));
  const checks = el("ul");
  (classification === "keep" ? ["Do not remove the flag while its provider status is enabled or usage is recorded.", "Confirm whether the rollout is complete.", "Run this again after a usage period that includes normal traffic."] : ["Confirm owner and intended final variation.", "Record the rollback plan before removing references.", "Deploy and monitor before deleting the provider flag."]).forEach((step) => checks.append(el("li", step)));
  container.append(checks); container.hidden = false;
}

function classify(): { classification: Classification; key: string; reasons: string[]; references: string[] } {
  const provider = JSON.parse(document.querySelector<HTMLTextAreaElement>("#provider-json")!.value) as Record<string, unknown>;
  const usage = JSON.parse(document.querySelector<HTMLTextAreaElement>("#evaluation-json")!.value) as Record<string, unknown>;
  const source = document.querySelector<HTMLTextAreaElement>("#source-snapshot")!.value;
  const key = typeof provider.key === "string" ? provider.key.trim() : "";
  if (!key) throw new Error("Provider export needs a non-empty string key.");
  if (provider.enabled !== undefined && typeof provider.enabled !== "boolean") throw new Error("Provider enabled must be true or false.");
  const count = usage.count; const days = usage.window_days;
  if (typeof count !== "number" || count < 0 || !Number.isInteger(count)) throw new Error("Evaluation count must be a non-negative integer.");
  if (typeof days !== "number" || days <= 0 || !Number.isInteger(days)) throw new Error("Usage report days must be a positive number.");
  const status = typeof provider.status === "string" ? provider.status.toLowerCase() : "";
  const active = provider.enabled === true || ["active", "live", "running", "enabled"].includes(status);
  const complete = provider.enabled === false || ["completed", "complete", "archived", "disabled", "off", "removed"].includes(status);
  const references = source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.includes(key));
  if (active) return { classification: "keep", key, references, reasons: ["The provider marks this flag enabled."] };
  if (count > 0) return { classification: "keep", key, references, reasons: [`${count} evaluations appear in the dated usage report.`] };
  if (complete) return { classification: "remove", key, references, reasons: ["The provider marks this flag completed.", `Zero evaluations were observed over ${days} days; that supports review but does not prove safety.`] };
  return { classification: "review", key, references, reasons: ["The provider status is missing or unclear.", "Missing or unclear evidence requires human review."] };
}

function configureDemo(): void {
  const form = document.querySelector<HTMLFormElement>("#demo-form"); const result = document.querySelector<HTMLElement>("#demo-result");
  const reset = document.querySelector<HTMLButtonElement>("#reset-demo"); const panel = document.querySelector<HTMLElement>("#result-panel");
  if (!form || !result || !reset || !panel) return;
  const run = () => { try { const output = classify(); renderResult(result, output.classification, output.key, output.reasons, output.references); } catch (error) { result.replaceChildren(el("div", `The sample could not be classified. ${error instanceof Error ? error.message : "Check the JSON and try again."}`, "result-error")); result.hidden = false; } };
  form.addEventListener("submit", (event) => { event.preventDefault(); panel.setAttribute("aria-busy", "true"); if (matchMedia("(prefers-reduced-motion: reduce)").matches) run(); else setTimeout(run, 160); panel.setAttribute("aria-busy", "false"); });
  reset.addEventListener("click", () => { document.querySelector<HTMLTextAreaElement>("#provider-json")!.value = examples.provider; document.querySelector<HTMLTextAreaElement>("#evaluation-json")!.value = examples.evaluation; document.querySelector<HTMLTextAreaElement>("#source-snapshot")!.value = examples.source; run(); document.querySelector<HTMLTextAreaElement>("#provider-json")!.focus(); });
  sessionStorage.setItem("demo:flag-removal-map", "active"); run();
  document.querySelector<HTMLAnchorElement>("#start-real")?.addEventListener("click", () => sessionStorage.removeItem("demo:flag-removal-map"));
}

function configureCopy(): void { const button = document.querySelector<HTMLButtonElement>("#copy-command"); const command = document.querySelector<HTMLElement>(".command code"); if (!button || !command) return; button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(command.textContent ?? ""); button.textContent = "Install command copied"; } catch { button.textContent = "Select install command"; } setTimeout(() => { button.textContent = "Copy install command"; }, 1800); }); }

if (location.pathname === "/" && new URLSearchParams(location.search).get("demo") === "1") location.replace("/demo/");
configureTheme(); configureOffline(); configureDemo(); configureCopy();
if (location.pathname !== "/") requestAnimationFrame(focusRoute);
if ("serviceWorker" in navigator && import.meta.env.PROD) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));
