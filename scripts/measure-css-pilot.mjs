import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { inspectRoute } from "./inspect-bundle.mjs";

export const pilotCases = ["bell", "chevron", "loader", "pair", "three", "repeated", "mixed"];
export const output = new URL("../tests/fixtures/astro/dist/", import.meta.url);
export function measureRoute(route) {
  const result = inspectRoute(output, route, () => {}, new Map());
  const js = [...result.chunks.values()].map(chunk => chunk.source).concat(result.inline);
  const sum = (sources, size) => sources.reduce((total, source) => total + size(source), 0);
  const sizes = sources => ({raw: sum(sources, Buffer.byteLength), gzip: sum(sources, source => gzipSync(source).length)});
  const javascript = sizes(js);
  const css = sizes(result.styles);
  return {javascript, css, total: {raw: javascript.raw + css.raw, gzip: javascript.gzip + css.gzip}, chunks: [...result.chunks.keys()]};
}
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
