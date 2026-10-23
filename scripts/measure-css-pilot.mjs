import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { measureRoute } from "./measure-resources.mjs";
export { measureRoute } from "./measure-resources.mjs";

export const pilotCases = ["bell", "chevron", "loader", "pair", "three", "repeated", "mixed"];
export const output = new URL("../tests/fixtures/astro/dist/", import.meta.url);
export function measure(mode) {
  return Object.fromEntries(pilotCases.map(name => [name, measureRoute("css-pilot/" + mode + "/" + name + "/index.html")]));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const modes = process.argv.slice(2).filter(arg => !arg.startsWith("--"));
  const result = {node: process.version, compression: "Node zlib gzip defaults, each emitted JS chunk and style source separately; HTML excluded", modes: Object.fromEntries(modes.map(mode => [mode, measure(mode)]))};
  const json = JSON.stringify(result, null, 2) + "\n";
  if (process.env.PILOT_RESULT) writeFileSync(process.env.PILOT_RESULT, json);
  console.log(json);
}
