import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
const base =
  (process.env.BASE_PATH || "/foundation-framework").replace(/\/$/, "") + "/";
function files(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(path, e.name)) : [join(path, e.name)],
  );
}
let checked = 0;
for (const file of files("dist").filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = match[1].split(/[?#]/)[0];
    if (!url.startsWith(base))
      throw new Error(`Incorrect base path in ${file}: ${url}`);
    let target = join("dist", decodeURIComponent(url.slice(base.length)));
    if (url.endsWith("/")) target = join(target, "index.html");
    if (!existsSync(target))
      throw new Error(`Missing target in ${file}: ${url}`);
    checked++;
  }
}
const challenges = files("src/content/challenges")
  .filter((f) => f.endsWith(".md"))
  .map((f) => JSON.parse(readFileSync(f, "utf8").split("---")[1]));
const guided = challenges.filter((c) => c.foundation7);
if (guided.length !== 7 || new Set(guided.map((c) => c.sequence)).size !== 7)
  throw new Error(
    "Foundation 7 must have seven challenges with distinct sequence values.",
  );
console.log(
  `PASS: ${checked} internal references; seven distinct Foundation 7 selections.`,
);
