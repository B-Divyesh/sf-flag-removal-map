import "./styles.css";

type Classification = "keep" | "remove" | "review";

const today = new Date().toISOString().slice(0, 10);
const examples = {
  provider: `{
  "key": "checkout-v2",
  "enabled": false,
  "status": "completed"
}`,
  evaluation: `{
  "count": 0,
  "window_days": 30,
  "as_of": "${today}T00:00:00Z"
}`,
  source: `src/checkout.ts: client.boolVariation("checkout-v2", false)
deploy/flags.yaml: checkout-v2: false
tests/checkout.test.ts: seedFlag("checkout-v2")`,
};

const names: Record<Classification, string> = { keep: "Keep", remove: "Removal candidate", review: "Review evidence" };

function daysInMonth(year: number, month: number): number {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
  if ([4, 6, 9, 11].includes(month)) return 30;
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return 0;
}

function daysFromCivil(year: number, month: number, day: number): number {
  const adjustedYear = year - (month <= 2 ? 1 : 0);
  const era = Math.floor(adjustedYear / 400);
  const yearOfEra = adjustedYear - era * 400;
  const dayOfYear = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  return era * 146097 + yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear - 719468;
}

/** Match the CLI: accept only a complete ISO date or complete RFC 3339 timestamp. */
function observationUtcDays(value: string): number | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2}))?$/.exec(value);
  if (!match) return undefined;
  const [year, month, day] = match.slice(1, 4).map(Number);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return undefined;
  const localDays = daysFromCivil(year, month, day);
  if (!match[4]) return localDays;
  const [hour, minute, second] = match.slice(4, 7).map(Number);
  if (hour > 23 || minute > 59 || second > 60) return undefined;
  const zone = match[7]!;
  let offset = 0;
  if (zone !== "Z") {
    const offsetHour = Number(zone.slice(1, 3)); const offsetMinute = Number(zone.slice(4, 6));
    if (offsetHour > 23 || offsetMinute > 59) return undefined;
    offset = (offsetHour * 3600 + offsetMinute * 60) * (zone[0] === "+" ? 1 : -1);
  }
  return Math.floor((localDays * 86400 + hour * 3600 + minute * 60 + second - offset) / 86400);
}

function isRecentObservation(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const days = observationUtcDays(value);
  const todayDays = Math.floor(Date.now() / 86_400_000);
  return days !== undefined && days >= todayDays - 90 && days <= todayDays + 1;
}

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
  const count = usage.count; const days = usage.window_days; const asOf = usage.as_of ?? usage.asOf;
  if (typeof count !== "number" || count < 0 || !Number.isInteger(count)) throw new Error("Evaluation count must be a non-negative integer.");
  if (typeof days !== "number" || days <= 0 || !Number.isInteger(days)) throw new Error("Usage report days must be a positive number.");
  const recentDate = isRecentObservation(asOf);
  const status = typeof provider.status === "string" ? provider.status.toLowerCase() : "";
  const active = provider.enabled === true || ["active", "live", "running", "enabled"].includes(status);
  const complete = provider.enabled === false || ["completed", "complete", "archived", "disabled", "off", "removed"].includes(status);
  const references = source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.includes(key));
  if (active) return { classification: "keep", key, references, reasons: ["Provider export marks the flag active or enabled."] };
  if (count > 0) return { classification: "keep", key, references, reasons: ["Evaluation activity exists in the supplied observation window."] };
  if (complete && count === 0 && recentDate) return { classification: "remove", key, references, reasons: ["Provider export marks the flag completed, archived, or disabled.", `The dated ${days}-day observation window ending ${asOf} reports zero evaluations; this supports review but does not prove safety.`] };
  const reasons = [provider.enabled === undefined && !status ? "Provider state is missing or unrecognized." : complete ? "Provider state suggests completion, but bounded zero-evaluation evidence is missing." : "Provider state does not explicitly establish completion."];
  if (count === 0 && !recentDate) reasons.push("Zero evaluations need a valid observation end date from the last 90 days.");
  else reasons.push("Missing or unclear evidence requires human review.");
  return { classification: "review", key, references, reasons };
}

function configureDemo(): void {
  const form = document.querySelector<HTMLFormElement>("#demo-form"); const result = document.querySelector<HTMLElement>("#demo-result");
  const reset = document.querySelector<HTMLButtonElement>("#reset-demo"); const panel = document.querySelector<HTMLElement>("#result-panel");
  if (!form || !result || !reset || !panel) return;
  const run = () => { try { const output = classify(); renderResult(result, output.classification, output.key, output.reasons, output.references); } catch (error) { const message = el("div", `The sample could not be classified. ${error instanceof Error ? error.message : "Check the JSON and try again."}`, "result-error"); message.setAttribute("role", "alert"); result.replaceChildren(message); result.hidden = false; } finally { panel.setAttribute("aria-busy", "false"); } };
  form.addEventListener("submit", (event) => { event.preventDefault(); panel.setAttribute("aria-busy", "true"); if (matchMedia("(prefers-reduced-motion: reduce)").matches) run(); else setTimeout(run, 160); });
  reset.addEventListener("click", () => { document.querySelector<HTMLTextAreaElement>("#provider-json")!.value = examples.provider; document.querySelector<HTMLTextAreaElement>("#evaluation-json")!.value = examples.evaluation; document.querySelector<HTMLTextAreaElement>("#source-snapshot")!.value = examples.source; run(); document.querySelector<HTMLTextAreaElement>("#provider-json")!.focus(); });
  document.querySelector<HTMLTextAreaElement>("#provider-json")!.value = examples.provider;
  document.querySelector<HTMLTextAreaElement>("#evaluation-json")!.value = examples.evaluation;
  document.querySelector<HTMLTextAreaElement>("#source-snapshot")!.value = examples.source;
  sessionStorage.setItem("demo:flag-removal-map", "active"); run();
  document.querySelector<HTMLAnchorElement>("#start-real")?.addEventListener("click", () => sessionStorage.removeItem("demo:flag-removal-map"));
}

function configureCopy(): void { const button = document.querySelector<HTMLButtonElement>("#copy-command"); const command = document.querySelector<HTMLElement>(".command code"); if (!button || !command) return; button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(command.textContent ?? ""); button.textContent = "Install command copied"; } catch { button.textContent = "Select install command"; } setTimeout(() => { button.textContent = "Copy install command"; }, 1800); }); }

if (location.pathname === "/" && new URLSearchParams(location.search).get("demo") === "1") location.replace("/demo/");
configureTheme(); configureOffline(); configureDemo(); configureCopy();
requestAnimationFrame(focusRoute);
addEventListener("pageshow", () => requestAnimationFrame(focusRoute));
if ("serviceWorker" in navigator && import.meta.env.PROD) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));
