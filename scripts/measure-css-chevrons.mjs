import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { measureRoute } from "./measure-resources.mjs";
import { cycles } from "./css-cycles.mjs";

export const chevronSlugs = [...cycles.keys()].filter(id => id.includes("chevron")).sort();
export const chevronCases = [...chevronSlugs, "family", "repeated", "mixed"];
export const output = new URL("../tests/fixtures/astro/dist/", import.meta.url);
export function measureChevrons(mode) {
  return Object.fromEntries(chevronCases.map(name => [name, measureRoute(`css-chevrons/${mode}/${name}/index.html`)]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const modes = Object.fromEntries(["baseline", "managed"].map(mode => [mode, measureChevrons(mode)]));
  const savings = Object.fromEntries(chevronCases.map(name => [name, { raw: modes.baseline[name].total.raw - modes.managed[name].total.raw, gzip: modes.baseline[name].total.gzip - modes.managed[name].total.gzip }]));
  const result = { node: process.version, compression: "Node zlib gzip defaults per emitted JS chunk and style source; chunks counted once per route; HTML, headers, latency, Brotli, and browser caches excluded; inline CSS compression is a normalized estimate", modes, savings };
  const json = JSON.stringify(result, null, 2) + "\n";
  if (process.env.CHEVRON_RESULT) writeFileSync(process.env.CHEVRON_RESULT, json);
  console.log(json);
}
