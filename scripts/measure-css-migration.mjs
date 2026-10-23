import { readFileSync, writeFileSync } from "node:fs";
import { arch, platform, release, cpus } from "node:os";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { inspectRoute } from "./inspect-bundle.mjs";
import { migration } from "./check-css-migration.mjs";

const output = new URL("../tests/fixtures/astro/dist/", import.meta.url);
const sizes = sources => ({ raw: sources.reduce((sum, source) => sum + Buffer.byteLength(source), 0), gzip: sources.reduce((sum, source) => sum + gzipSync(source).length, 0) });
export function measureMigration(mode) {
  const cache = new Map();
  return Object.fromEntries(Object.keys(migration.cases).map(name => {
    const route = `css-migration/${mode}/${name}/index.html`;
    const result = inspectRoute(output, route, () => {}, cache);
    const html = readFileSync(new URL(route, output), "utf8");
    const externalCSS = new Map([...html.matchAll(/<link\b([^>]*)>/g)].filter(([, attributes]) => /\brel="stylesheet"/.test(attributes)).map(([, attributes]) => {
      const href = attributes.match(/\bhref="([^"]+)"/)[1];
      return [href, readFileSync(new URL(href.slice(1), output), "utf8")];
    }));
    const javascript = sizes([...result.chunks.values()].map(chunk => chunk.source).concat(result.inline));
    const css = sizes(result.styles);
    const total = { raw: javascript.raw + css.raw, gzip: javascript.gzip + css.gzip };
    const page = sizes([html, ...result.chunks.values()].map(value => typeof value === "string" ? value : value.source).concat([...externalCSS.values()]));
    return [name, { javascript, css, total, html: sizes([html]), page, chunks: [...result.chunks.keys()], externalCSS: [...externalCSS.keys()] }];
  }));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const modes = Object.fromEntries(["baseline", "managed"].map(mode => [mode, measureMigration(mode)]));
  const savings = Object.fromEntries(Object.keys(migration.cases).map(name => [name, Object.fromEntries(["total", "page"].map(field => [field, { raw: modes.baseline[name][field].raw - modes.managed[name][field].raw, gzip: modes.baseline[name][field].gzip - modes.managed[name][field].gzip }]))]));
  const result = { environment: { node: process.version, platform: platform(), release: release(), arch: arch(), cpu: cpus()[0]?.model }, compression: "Node zlib defaults per resource. Reachable static/dynamic JS chunks and external CSS URLs count once per route, cold cache. total sums JS and CSS with each inline style compressed independently as a normalized estimate. page compresses actual HTML once, including all inline styles/scripts, plus each external JS/CSS resource once. No headers, latency, Brotli, warm cache, frame pacing, or preparation timing.", modes, savings };
  const json = JSON.stringify(result, null, 2) + "\n";
  if (process.env.MIGRATION_RESULT) writeFileSync(process.env.MIGRATION_RESULT, json);
  console.log(json);
}
