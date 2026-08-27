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

const statusNames: Record<Classification, string> = {
  keep: "Keep on the map",
  remove: "Removal candidate",
  review: "Review evidence",
};

function configureTheme(): void {
  const button = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (!button) return;
  const label = button.querySelector<HTMLElement>(".theme-label");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  const isDark = (): boolean =>
    document.documentElement.dataset.theme === "dark" ||
    (!document.documentElement.dataset.theme && systemDark.matches);

  const update = (): void => {
    const dark = isDark();
    button.setAttribute("aria-pressed", String(dark));
    if (label) label.textContent = dark ? "Day map" : "Night map";
  };

  button.addEventListener("click", () => {
    document.documentElement.dataset.theme = isDark() ? "light" : "dark";
    update();
  });
  systemDark.addEventListener("change", update);
  update();
}

function configureOfflineState(): void {
  const bar = document.querySelector<HTMLElement>("#offline-bar");
  if (!bar) return;
  const update = (): void => {
    bar.hidden = navigator.onLine;
  };
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function renderError(container: HTMLElement, message: string): void {
  container.replaceChildren();
  const error = element("div", undefined, "result-error");
  error.setAttribute("role", "alert");
  error.append(
    element("strong", "The survey could not run."),
    element("p", `${message} Check the JSON and try again.`),
  );
  container.append(error);
  container.hidden = false;
}

function renderResult(
  container: HTMLElement,
  classification: Classification,
  key: string,
  reasons: string[],
  references: string[],
): void {
  container.replaceChildren();
  container.append(element("p", `FLAG / ${key}`, "result-kicker"));
  const status = element("h3", statusNames[classification], `result-status ${classification}`);
  container.append(status);

  container.append(element("h4", "Evidence readout"));
  const evidenceList = element("ul");
  reasons.forEach((reason) => evidenceList.append(element("li", reason)));
  container.append(evidenceList);

  container.append(element("h4", `Mapped references / ${references.length}`));
  if (references.length) {
    const referenceList = element("ol", undefined, "reference-list");
    references.forEach((reference) => {
      const item = element("li");
      item.append(element("code", reference));
      referenceList.append(item);
    });
    container.append(referenceList);
  } else {
    container.append(element("p", "No literal references in this snapshot. Check other repositories, generated files, and runtime configuration."));
  }

  container.append(element("h4", "Next field checks"));
  const checks = element("ul");
  const steps = classification === "keep"
    ? ["Do not remove while the provider or evaluation evidence is active.", "Confirm whether the rollout is actually complete.", "Repeat the survey after a representative observation window."]
    : ["Confirm owner and intended final variation.", "Record rollback before simplifying references.", "Deploy and monitor before deleting the provider flag."];
  steps.forEach((step) => checks.append(element("li", step)));
  container.append(checks);
  container.hidden = false;
}

function configureDemo(): void {
  const form = document.querySelector<HTMLFormElement>("#demo-form");
  const providerInput = document.querySelector<HTMLTextAreaElement>("#provider-json");
  const evaluationInput = document.querySelector<HTMLTextAreaElement>("#evaluation-json");
  const sourceInput = document.querySelector<HTMLTextAreaElement>("#source-snapshot");
  const panel = document.querySelector<HTMLElement>("#result-panel");
  const result = document.querySelector<HTMLElement>("#demo-result");
  const empty = document.querySelector<HTMLElement>("#empty-result");
  const reset = document.querySelector<HTMLButtonElement>("#reset-demo");
  if (!form || !providerInput || !evaluationInput || !sourceInput || !panel || !result || !empty || !reset) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    panel.setAttribute("aria-busy", "true");
    empty.hidden = true;
    result.hidden = true;

    const run = (): void => {
      try {
        const provider = JSON.parse(providerInput.value) as Record<string, unknown>;
        const evaluation = evaluationInput.value.trim()
          ? JSON.parse(evaluationInput.value) as Record<string, unknown>
          : {};
        const key = typeof provider.key === "string" ? provider.key.trim() : "";
        if (!key) throw new Error("Provider export needs a non-empty string key.");
        if (provider.enabled !== undefined && typeof provider.enabled !== "boolean") {
          throw new Error("Provider enabled must be true or false.");
        }
        const count = evaluation.count;
        const windowDays = evaluation.window_days;
        if (count !== undefined && (typeof count !== "number" || count < 0 || !Number.isInteger(count))) {
          throw new Error("Evaluation count must be a non-negative integer.");
        }
        if (windowDays !== undefined && (typeof windowDays !== "number" || windowDays <= 0)) {
          throw new Error("Observation window must be a positive number of days.");
        }

        const status = typeof provider.status === "string" ? provider.status.toLowerCase() : "";
        const active = provider.enabled === true || ["active", "live", "running", "enabled"].includes(status);
        const completed = provider.enabled === false || ["completed", "complete", "archived", "disabled", "off", "removed"].includes(status);
        let classification: Classification = "review";
        const reasons: string[] = [];

        if (active) {
          classification = "keep";
          reasons.push("Provider export marks the flag active or enabled.");
        } else if (typeof count === "number" && count > 0) {
          classification = "keep";
          reasons.push(`${count} evaluations are present in the supplied evidence.`);
        } else if (completed && count === 0 && typeof windowDays === "number") {
          classification = "remove";
          reasons.push("Provider export explicitly suggests completion.");
          reasons.push(`Zero evaluations were observed over ${windowDays} days; that supports review but does not prove safety.`);
        } else {
          reasons.push("Provider completion and a bounded zero-evaluation window are not both established.");
          reasons.push("Missing or ambiguous evidence always routes to human review.");
        }

        const references = sourceInput.value
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.includes(key));
        renderResult(result, classification, key, reasons, references);
      } catch (error) {
        renderError(result, error instanceof Error ? error.message : "The input is invalid.");
      } finally {
        panel.setAttribute("aria-busy", "false");
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) run();
    else window.setTimeout(run, 180);
  });

  reset.addEventListener("click", () => {
    providerInput.value = examples.provider;
    evaluationInput.value = examples.evaluation;
    sourceInput.value = examples.source;
    result.hidden = true;
    result.replaceChildren();
    empty.hidden = false;
    providerInput.focus();
  });
}

function configureCopy(): void {
  const button = document.querySelector<HTMLButtonElement>("#copy-command");
  const command = document.querySelector<HTMLElement>(".command code");
  if (!button || !command) return;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(command.textContent ?? "");
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select text";
    }
    window.setTimeout(() => { button.textContent = "Copy"; }, 1800);
  });
}

configureTheme();
configureOfflineState();
configureDemo();
configureCopy();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));
}
