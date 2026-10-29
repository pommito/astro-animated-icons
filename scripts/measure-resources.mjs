import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { inspectRoute } from "./inspect-bundle.mjs";

const fixtureOutput = new URL("../tests/fixtures/astro/dist/", import.meta.url);
export const resourceSizes = sources => ({
  raw: sources.reduce((sum, source) => sum + Buffer.byteLength(source), 0),
  gzip: sources.reduce((sum, source) => sum + gzipSync(source).length, 0),
});

export function measureRoute(route, { cache = new Map(), includePage = false, output = fixtureOutput } = {}) {
  const result = inspectRoute(output, route, () => {}, cache);
  const javascript = resourceSizes([...result.chunks.values()].map(chunk => chunk.source).concat(result.inline));
  const css = resourceSizes(result.styles);
  const measurement = { javascript, css, total: { raw: javascript.raw + css.raw, gzip: javascript.gzip + css.gzip }, chunks: [...result.chunks.keys()] };
  if (!includePage) return measurement;
  const html = readFileSync(new URL(route, output), "utf8");
  const externalCSS = new Map([...html.matchAll(/<link\b([^>]*)>/g)].filter(([, attributes]) => /\brel="stylesheet"/.test(attributes)).map(([, attributes]) => {
    const href = attributes.match(/\bhref="([^"]+)"/)[1];
    return [href, readFileSync(new URL(href.slice(1), output), "utf8")];
  }));
  return { ...measurement, html: resourceSizes([html]), page: resourceSizes([html, ...result.chunks.values()].map(value => typeof value === "string" ? value : value.source).concat([...externalCSS.values()])), externalCSS: [...externalCSS.keys()] };
}
