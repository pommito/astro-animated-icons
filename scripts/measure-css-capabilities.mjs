import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { measureRoute } from "./measure-resources.mjs";


export const capabilitySlugs = ["folder-down", "folder-up", "folder-input", "folder-output", "circle-help", "calendar-days", "circle-dashed", "user-round-cog"];
export const capabilityCases = [...capabilitySlugs, "family", "folders", "opacity", "group", "repeated", "mixed", "folders-mixed", "opacity-mixed"];
export const selectedSlugs = name => name === "repeated" ? [capabilitySlugs[0]] : ["family", "mixed"].includes(name) ? capabilitySlugs : name.startsWith("folders") ? capabilitySlugs.slice(0, 4) : name.startsWith("opacity") ? capabilitySlugs.filter(slug => ["calendar-days", "circle-dashed"].includes(slug)) : name === "group" ? ["circle-help"] : [name];
export const output = new URL("../tests/fixtures/astro/dist/", import.meta.url);
export function measureCapabilities(mode) {
  return Object.fromEntries(capabilityCases.map(name => [name, measureRoute(`css-capabilities/${mode}/${name}/index.html`)]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const modes = Object.fromEntries(["baseline", "managed"].map(mode => [mode, measureCapabilities(mode)]));
  const savings = Object.fromEntries(capabilityCases.map(name => [name, { raw: modes.baseline[name].total.raw - modes.managed[name].total.raw, gzip: modes.baseline[name].total.gzip - modes.managed[name].total.gzip }]));
  const result = { node: process.version, compression: "Node zlib gzip defaults per emitted JS chunk and style source; chunks counted once per route; HTML, headers, latency, Brotli, and browser caches excluded; inline CSS compression is a normalized estimate", modes, savings };
  const json = JSON.stringify(result, null, 2) + "\n";
  if (process.env.CAPABILITY_RESULT) writeFileSync(process.env.CAPABILITY_RESULT, json);
  console.log(json);
}
