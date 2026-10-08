import { progressStore, type RecordEntry } from "./progress";
type Challenge = {
  id: string;
  title: string;
  pillar: string;
  checks: string[];
  foundation7: boolean;
  url: string;
};
const data = document.querySelector<HTMLElement>("[data-workshop-data]");
const challenges: Challenge[] = JSON.parse(data?.dataset.workshopData || "[]");
function node<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  return element;
}
function status(c: Challenge, r?: RecordEntry) {
  return r?.status === "ready" && c.checks.every((_, i) => r.checks.includes(i))
    ? "ready"
    : r?.status === "in-progress"
      ? "in-progress"
      : "not-started";
}
function render() {
  const records = progressStore.read();
  const active = challenges.filter(
    (c) => status(c, records[c.id]) === "in-progress",
  );
  const ready = challenges.filter((c) => status(c, records[c.id]) === "ready");
  function card(c: Challenge, review = false) {
    const record = records[c.id];
    const article = node("article");
    article.className = "challenge-card";
    article.append(node("span", `${c.pillar} · Apprentice`));
    const heading = node("h3", c.title);
    article.append(heading);
    const checked = c.checks.filter((_, i) =>
      record?.checks.includes(i),
    ).length;
    article.append(
      node("p", `${checked} of ${c.checks.length} checklist items complete`),
    );
    const next = c.checks.findIndex((_, i) => !record?.checks.includes(i));
    const link = node(
      "a",
      review
        ? "Review the demonstration"
        : next < 0
          ? "Arrange adult review"
          : `Continue: ${c.checks[next]}`,
    );
    link.className = "workshop-continue";
    link.href =
      c.url + (next >= 0 && !review ? `#step-${next}` : "#demonstrate");
    article.append(link);
    return article;
  }
  for (const [selector, items, review] of [
    ["[data-workbench]", active, false],
    ["[data-review-list]", ready, true],
  ] as const) {
    const container = document.querySelector(selector);
    container?.replaceChildren(...items.map((c) => card(c, review)));
  }
  for (const [selector, empty] of [
    ["[data-workbench-empty]", active.length === 0],
    ["[data-review-empty]", ready.length === 0],
  ] as const) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) el.hidden = !empty;
  }
  const coverage = document.querySelector("[data-pillar-coverage]");
  coverage?.replaceChildren(
    ...["Identity", "Stewardship", "Service", "Dominion"].map((pillar) => {
      const all = challenges.filter((c) => c.pillar === pillar);
      const count = all.filter(
        (c) => status(c, records[c.id]) !== "not-started",
      ).length;
      const box = node("div");
      box.append(
        node("strong", pillar),
        node("span", `${count} of ${all.length} explored`),
      );
      return box;
    }),
  );
  const guided = challenges.filter((c) => c.foundation7);
  const underway = guided.find(
    (c) => status(c, records[c.id]) === "in-progress",
  );
  const next =
    underway || guided.find((c) => status(c, records[c.id]) === "not-started");
  document.querySelectorAll("[data-guided-next]").forEach((el) => {
    const count = guided.filter(
      (c) => status(c, records[c.id]) === "ready",
    ).length;
    el.replaceChildren(
      node("p", `${count} of ${guided.length} ready for adult review.`),
    );
    if (next) {
      const link = node("a", `${underway ? "Continue" : "Try"} ${next.title}`);
      link.href = next.url;
      el.append(
        link,
        node(
          "p",
          "A suggestion only. Choose any challenge or change the order.",
        ),
      );
    } else
      el.append(
        node(
          "p",
          "All seven are ready for review. Arrange a conversation with an appropriate adult, or explore the wider Apprentice catalog.",
        ),
      );
  });
  const printable = document.querySelector("[data-completion-record]");
  if (printable) {
    const table = node("table");
    const caption = node("caption", "Apprentice checklist and readiness");
    table.append(caption);
    const head = node("thead");
    const row = node("tr");
    for (const title of ["Challenge / pillar", "Checklist", "Local status"]) {
      const th = node("th", title);
      th.scope = "col";
      row.append(th);
    }
    head.append(row);
    table.append(head);
    const body = node("tbody");
    challenges.forEach((c) => {
      const row = node("tr");
      const label = node("th", `${c.title} · ${c.pillar}`);
      label.scope = "row";
      row.append(
        label,
        node(
          "td",
          `${c.checks.filter((_, i) => records[c.id]?.checks.includes(i)).length} / ${c.checks.length}`,
        ),
        node(
          "td",
          {
            ready: "Ready for review",
            "in-progress": "In progress",
            "not-started": "Not started",
          }[status(c, records[c.id])],
        ),
      );
      body.append(row);
    });
    table.append(body);
    printable.replaceChildren(table);
  }
}
render();
window.addEventListener("foundation-progress-change", render);
window.addEventListener("storage", render);
