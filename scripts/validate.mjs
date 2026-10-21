import { spawnSync } from "node:child_process";
import { readCatalog } from "./catalog.mjs";

const suites = {
  triggers: ["api", "accessibility", "lifecycle"],
  morph: ["archive", "common-utilities", "sorting-trends", "transport-routes"],
  tracks: ["common-utilities", "loading-view", "health-science", "food-plants", "text-formatting"],
  sequence: ["design-tools", "media-icons", "security-icons"],
  attributes: ["commands", "text-formatting"],
};
const regressions = {
  archive: ["archive"],
  "arrow-left": ["arrow-left"],
  "sliders-horizontal": ["commands"],
  accessibility: ["common-utilities"],
  "square-activity": ["common-utilities"],
  "cursor-click": ["common-utilities"],
  "users-round": ["common-utilities"],
  "bot-message-square": ["common-utilities"],
  "square-arrow-right": ["sorting-trends"],
  "arrow-down-a-z": ["sorting-trends"],
  "trending-up": ["sorting-trends"],
  rocket: ["transport-routes"],
  volume: ["media-icons"],
  airplay: ["media-icons"],
  "scan-text": ["design-tools"],
  "scan-face": ["security-icons"],
  ambulance: ["health-science"],
  brain: ["health-science"],
  "biceps-flexed": ["health-science"],
  loader: ["loading-view"],
  "circle-dashed": ["loading-view"],
  "file-pen-line": ["loading-view"],
  coffee: ["food-plants"],
  "cup-soda": ["food-plants"],
  bold: ["text-formatting"],
  check: ["check"],
  "wifi-low": ["connectivity-question"],
  keyboard: ["devices"],
};

function run(...args) {
  console.log(`\n> pnpm ${args.join(" ")}`);
  const start = performance.now();
  const result = spawnSync("pnpm", args, { stdio: "inherit", env: process.env });
  console.log(`Step took ${((performance.now() - start) / 1000).toFixed(2)} s.`);
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const [mode = "all", ...args] = process.argv.slice(2);
const workers = args.filter(arg => arg.startsWith("--workers="));
const subjects = args.filter(arg => !arg.startsWith("--workers="));
if (workers.length > 1 || subjects.some(arg => arg.startsWith("--"))) throw new Error("Use --workers=N for browser concurrency.");
let selected;
if (mode === "icon") {
  if (!subjects.length) throw new Error("Usage: pnpm validate:icon <icon-slug> [more-slugs] [--workers=N]");
  const known = new Set(readCatalog().map(icon => icon.slug));
  for (const slug of subjects) if (!known.has(slug)) throw new Error(`Unknown icon ${slug}`);
  selected = ["catalog", ...subjects.flatMap(slug => regressions[slug] ?? [])];
} else if (mode === "shared") {
  if (!subjects.length) throw new Error(`Usage: pnpm validate:shared <${Object.keys(suites).join("|")}|lifecycle> [more-mechanisms] [--workers=N]`);
  for (const mechanism of subjects) if (mechanism !== "lifecycle" && !Object.hasOwn(suites, mechanism)) throw new Error(`Unknown mechanism ${mechanism}`);
  selected = subjects.includes("lifecycle") ? undefined : ["catalog", ...subjects.flatMap(mechanism => suites[mechanism])];
} else if (["all", "distribution"].includes(mode) && !subjects.length) {
  selected = mode === "distribution" ? ["catalog", "api"] : undefined;
} else throw new Error("Use validate:icon, validate:shared, validate:distribution, or validate.");

if (mode === "icon" || (mode === "shared" && !subjects.some(subject => ["triggers", "lifecycle"].includes(subject)))) {
  run("--filter", "@grave/animated-icons", "check");
  run("exec", "tsc", "--noEmit");
} else run("check");
run("test:prepare");
run("inspect:bundle");
run("test:drawings");
if (mode === "distribution" || mode === "all") {
  run("test:bundle");
  run("test:fixture");
  run("test:drawing-checker");
}
run("test", ...(selected ? [...new Set(selected)].map(name => `tests/${name}.spec.ts`) : []), ...(workers.length ? workers : ["--workers=2"]));
