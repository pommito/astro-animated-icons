import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { gzipSync, deflateRawSync } from "node:zlib";
const root = process.argv[2] ?? fileURLToPath(new URL("../../", import.meta.url));
const baseline = JSON.parse(readFileSync(root + "/.artifacts/page-loading/baseline.json"));
const before = JSON.parse(readFileSync(root + "/docs/history/2026-10-30-production-paint-loading-before.json"));
const results = [];
for (const name of ["paint-eye-off", "path-paint", "path-paint-repeated", "all", "repeated-all", "one", "repeated"]) {
  const html = readFileSync(root + "/.artifacts/page-loading/minimal-dist/page-loading/" + name + "/index.html", "utf8");
  const attrs = [...html.matchAll(/ data-grave-(cycle|opacity|paint)-recipe="([^"]*)"/g)];
  const strip = html.replace(/ data-grave-(?:cycle|opacity|paint)-recipe="[^"]*"/g, "");
  const seen = new Set();
  const tableOnly = html.replace(/ data-grave-(?:cycle|opacity|paint)-recipe="[^"]*"/g, value => {if(seen.has(value))return "";seen.add(value);return value;});
  const noCSS = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "");
  const packed = html.replace(/ data-grave-(cycle|opacity|paint)-recipe="([^"]*)"/g, (_, kind, value) => ' data-grave-' + kind + '-recipe="' + deflateRawSync(value).toString("base64") + '"');
  const row = { name, hosts: attrs.length, uniqueRecords: new Set(attrs.map(m => m[0])).size, htmlRaw: Buffer.byteLength(html), htmlGzip: gzipSync(html).length, withoutRecordsGzip: gzipSync(strip).length, tableOnlyGzip: gzipSync(tableOnly).length, withoutStylesGzip: gzipSync(noCSS).length, deflatedRecordsGzip: gzipSync(packed).length, rawRecords: attrs.reduce((s,m)=>s+Buffer.byteLength(m[0]),0), currentPageGzip: baseline.modes.minimal.routes[name].page.gzip, precedingMotionPageGzip: name.includes("all") ? null : before.modes.minimal.routes[name]?.page.gzip };
  results.push(row);
}
const repeated = results.find(r => r.name === "path-paint-repeated");
assert.equal(repeated.currentPageGzip - repeated.precedingMotionPageGzip, 59876, "Reproduce the original repeated-page regression");
console.table(results);
mkdirSync(root + "/.artifacts/recipe-delivery", {recursive:true});
writeFileSync(root + "/.artifacts/recipe-delivery/diagnosis.json", JSON.stringify(results, null, 2) + "\n");
