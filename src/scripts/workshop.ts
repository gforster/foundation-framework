import { progressStore, refreshProgress, type RecordEntry } from "./progress";
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
  function card(c: Challenge, review = false, choose = false) {
    const record = records[c.id];
    const article = node("article");
    article.className = "challenge-card board-card";
    article.dataset.boardChallenge = c.id;
    const label = node("span", c.pillar);
    label.className = "eyebrow";
    const icon = node("img");
    icon.src =
      import.meta.env.BASE_URL + "icons/" + c.pillar.toLowerCase() + ".svg";
    icon.alt = "";
    icon.width = 20;
    icon.height = 20;
    icon.className = "icon";
    label.prepend(icon);
    article.append(label);
    article.append(node("h3", c.title));
    const checked = c.checks.filter((_, i) =>
      record?.checks.includes(i),
    ).length;
    const bar = node("progress");
    bar.max = c.checks.length;
    bar.value = checked;
    bar.setAttribute("aria-label", c.title + " checklist progress");
    article.append(
      bar,
      node(
        "small",
        `${checked} of ${c.checks.length} checklist items complete`,
      ),
    );
    const next = c.checks.findIndex((_, i) => !record?.checks.includes(i));
    article.append(
      node(
        "p",
        choose
          ? c.checks[0]
          : review
            ? "Show your demonstration and ask for feedback."
            : next < 0
              ? "Your checklist is complete. Arrange adult review."
              : c.checks[next],
      ),
    );
    if (choose) {
      const button = node("button", "Start challenge");
      button.type = "button";
      button.addEventListener("click", () => {
        const latest = progressStore.read();
        latest[c.id] = {
          checks: latest[c.id]?.checks || [],
          status: "in-progress",
        };
        if (progressStore.write(latest)) {
          refreshProgress();
          document
            .querySelector<HTMLAnchorElement>(
              `[data-workbench] [data-board-challenge="${c.id}"] a`,
            )
            ?.focus();
        } else {
          const msg = document.querySelector("[data-storage-message]");
          if (msg)
            msg.textContent =
              "Browser storage is unavailable. Open a challenge to work without saving.";
        }
      });
      article.append(button);
    } else {
      const link = node(
        "a",
        review ? "See what to demonstrate" : "Continue challenge",
      );
      link.className = "button secondary workshop-continue";
      link.href =
        c.url + (next >= 0 && !review ? `#step-${next}` : "#demonstrate");
      article.append(link);
    }
    return article;
  }
  const suggestions = challenges
    .filter((c) => c.foundation7 && status(c, records[c.id]) === "not-started")
    .slice(0, 2);
  document
    .querySelector("[data-choose-next]")
    ?.replaceChildren(...suggestions.map((c) => card(c, false, true)));
  const chooseEmpty = document.querySelector<HTMLElement>(
    "[data-choose-empty]",
  );
  if (chooseEmpty) chooseEmpty.hidden = suggestions.length > 0;
  for (const [name, count] of [
    ["choose", suggestions.length],
    ["working", active.length],
    ["ready", ready.length],
  ] as const) {
    const el = document.querySelector(`[data-lane-count="${name}"]`);
    if (el) el.textContent = String(count);
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
      const progress = node("progress");
      progress.max = all.length;
      progress.value = count;
      progress.setAttribute("aria-label", pillar + " challenges explored");
      box.append(
        node("strong", pillar),
        progress,
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
