export type RecordEntry = {
  checks: number[];
  status: "not-started" | "in-progress" | "ready";
};
type Records = Record<string, RecordEntry>;
const key = "foundation-framework:progress:v1";
// Replace this adapter with authenticated persistence later; UI knows only read/write/reset.
export const progressStore = {
  read(): Records {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      if (!value || typeof value !== "object" || Array.isArray(value))
        return {};
      const clean: Records = {};
      for (const [id, r] of Object.entries(value)) {
        const x = r as RecordEntry;
        if (
          x &&
          Array.isArray(x.checks) &&
          ["not-started", "in-progress", "ready"].includes(x.status)
        )
          clean[id] = {
            checks: x.checks.filter((n) => Number.isInteger(n) && n >= 0),
            status: x.status,
          };
      }
      return clean;
    } catch {
      return {};
    }
  },
  write(records: Records) {
    try {
      localStorage.setItem(key, JSON.stringify(records));
      return true;
    } catch {
      return false;
    }
  },
  reset() {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
const challengeIds: string[] = JSON.parse(
  document.querySelector<HTMLElement>("[data-challenge-ids]")?.dataset
    .challengeIds || "[]",
);
const labels = {
  "not-started": "Not started",
  "in-progress": "In progress",
  ready: "Ready for sign-off",
};
function refresh() {
  const records = progressStore.read();
  const active = challengeIds
    .map((id) => records[id])
    .filter((r): r is RecordEntry => Boolean(r))
    .filter((r) => r.status === "in-progress").length;
  const ready = challengeIds
    .map((id) => records[id])
    .filter((r): r is RecordEntry => Boolean(r))
    .filter((r) => r.status === "ready").length;
  document
    .querySelectorAll<HTMLElement>("[data-status-id]")
    .forEach(
      (el) =>
        (el.textContent =
          labels[records[el.dataset.statusId!]?.status || "not-started"]),
    );
  document
    .querySelectorAll<HTMLElement>("[data-progress-summary]")
    .forEach(
      (el) =>
        (el.textContent = `${ready} of ${challengeIds.length} ready for sign-off · ${active} in progress`),
    );
  document
    .querySelectorAll<HTMLProgressElement>("[data-overall]")
    .forEach((el) => (el.value = ready));
  window.dispatchEvent(new Event("foundation-progress-change"));
}
refresh();
const sheet = document.querySelector<HTMLElement>("[data-challenge]");
if (sheet) {
  const id = sheet.dataset.challenge!;
  const checks = [...sheet.querySelectorAll<HTMLInputElement>("[data-check]")];
  const select = sheet.querySelector<HTMLSelectElement>(
    "[data-challenge-status]",
  )!;
  const record = progressStore.read()[id] || {
    checks: [],
    status: "not-started",
  };
  checks.forEach(
    (c) => (c.checked = record.checks.includes(Number(c.dataset.check))),
  );
  select.value = record.status;
  function update(save = false) {
    const checked = checks
      .filter((c) => c.checked)
      .map((c) => Number(c.dataset.check));
    const ready = select.querySelector<HTMLOptionElement>(
      'option[value="ready"]',
    )!;
    ready.disabled = checked.length !== checks.length;
    if (select.value === "ready" && ready.disabled)
      select.value = "in-progress";
    const summary = sheet!.querySelector("[data-check-summary]");
    if (summary)
      summary.textContent = `${checked.length} of ${checks.length} checklist items completed`;
    const nextAction = sheet!.querySelector("[data-next-action]");
    const next = checks.find((c) => !c.checked);
    if (nextAction)
      nextAction.textContent =
        next?.closest("label")?.textContent?.trim() ||
        "Your checklist is complete. Arrange your final demonstration and adult review.";
    if (save) {
      const records = progressStore.read();
      records[id] = {
        checks: checked,
        status: select.value as RecordEntry["status"],
      };
      const ok = progressStore.write(records);
      const msg = sheet!.querySelector("[data-storage-message]");
      if (msg)
        msg.textContent = ok
          ? "Saved on this device."
          : "Browser storage is unavailable. Changes cannot be saved.";
      refresh();
    }
  }
  checks.forEach((c) =>
    c.addEventListener("change", () => {
      if (select.value === "not-started" && checks.some((c) => c.checked))
        select.value = "in-progress";
      update(true);
    }),
  );
  select.addEventListener("change", () => update(true));
  update();
}
document
  .querySelector("[data-reset-progress]")
  ?.addEventListener("click", () => {
    if (
      window.confirm("Reset all Foundation Framework progress on this device?")
    ) {
      const ok = progressStore.reset();
      refresh();
      const msg = document.querySelector("[data-storage-message]");
      if (msg)
        msg.textContent = ok
          ? "Prototype progress reset."
          : "Browser storage is unavailable.";
    }
  });
