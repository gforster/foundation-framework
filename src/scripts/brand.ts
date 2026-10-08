const template = document.querySelector<HTMLTemplateElement>("#base-logo");
const preview = document.querySelector<HTMLElement>("#church-preview");
const churchName = document.querySelector<HTMLInputElement>("#church-name");
const color = document.querySelector<HTMLSelectElement>("#artwork-color");
function update() {
  if (!template || !preview || !churchName || !color) return;
  const svg = template.content
    .querySelector("svg")!
    .cloneNode(true) as SVGSVGElement;
  svg.setAttribute("viewBox", "0 0 720 220");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const fill = color.value === "white" ? "#ffffff" : "#000000";
  svg.querySelectorAll("g").forEach((g) => g.setAttribute("fill", fill));
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", "144");
  text.setAttribute("y", "186");
  text.setAttribute("fill", fill);
  text.setAttribute("font-family", "Arial, Helvetica, sans-serif");
  text.setAttribute("font-size", "23");
  text.textContent = churchName.value.trim();
  svg.append(text);
  preview.replaceChildren(svg);
  preview.classList.toggle("artwork-dark", color.value === "white");
  const width = text.getComputedTextLength();
  if (width > 540) text.setAttribute("font-size", String((23 * 540) / width));
}
churchName?.addEventListener("input", update);
color?.addEventListener("change", update);
update();
document
  .querySelector("#download-church-logo")
  ?.addEventListener("click", () => {
    const svg = preview?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "foundation-framework-church.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    const status = document.querySelector("#artwork-status");
    if (status) status.textContent = "Church artwork downloaded.";
  });
