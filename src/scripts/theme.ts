const buttons = document.querySelectorAll<HTMLButtonElement>(
  "[data-theme-choice]",
);
const system = window.matchMedia("(prefers-color-scheme: dark)");
let chosen: string | null = null;
try {
  chosen = localStorage.getItem("foundation-framework:theme");
} catch {}
function apply(theme: string) {
  document.documentElement.dataset.theme = theme;
  buttons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.themeChoice === theme),
    ),
  );
}
apply(
  document.documentElement.dataset.theme || (system.matches ? "dark" : "light"),
);
buttons.forEach((button) =>
  button.addEventListener("click", () => {
    chosen = button.dataset.themeChoice!;
    apply(chosen);
    try {
      localStorage.setItem("foundation-framework:theme", chosen);
    } catch {}
  }),
);
system.addEventListener("change", (event) => {
  if (chosen !== "light" && chosen !== "dark")
    apply(event.matches ? "dark" : "light");
});
