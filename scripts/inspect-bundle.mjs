import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const output = new URL("../tests/fixtures/astro/dist/", import.meta.url);

function inspectRoute(route) {
  const html = readFileSync(new URL(route, output), "utf8");
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  const entries = scripts.flatMap(([, attributes]) => [...attributes.matchAll(/\bsrc="([^"]+)"/g)].map((match) => match[1]));
  const inline = scripts.filter(([, attributes]) => !/\bsrc=/.test(attributes)).map(([, , source]) => source);
  const chunks = new Map();

  function collectImports(source, path) {
    for (const [, specifier] of source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g)) {
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        collectChunk(new URL(specifier, new URL(path, "https://fixture.invalid")).pathname);
      }
    }
  }

  function collectChunk(path) {
    if (chunks.has(path)) return;
    const source = readFileSync(new URL(path.slice(1), output), "utf8");
    chunks.set(path, source);
    collectImports(source, path);
  }

  entries.forEach(collectChunk);
  inline.forEach((source) => collectImports(source, `/${route}`));

  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(([, source]) => source);
  for (const [, attributes] of html.matchAll(/<link\b([^>]*)>/g)) {
    const href = attributes.match(/\bhref="([^"]+)"/)?.[1];
    if (href && /\brel="stylesheet"/.test(attributes)) {
      styles.push(readFileSync(new URL(href.slice(1), output), "utf8"));
    }
  }
  const css = styles.join("\n").trim();
  const bytes = [...chunks.values()].reduce((sum, source) => sum + Buffer.byteLength(source), 0);
  const gzip = [...chunks.values()].reduce((sum, source) => sum + gzipSync(source).byteLength, 0);
  console.log(`${route}: ${entries.length} external entries, ${chunks.size} JS chunks, ${bytes} bytes, ${gzip} bytes gzip; ${inline.length} inline scripts, ${inline.reduce((sum, source) => sum + Buffer.byteLength(source), 0)} bytes; ${Buffer.byteLength(css)} bytes CSS`);
  for (const [path, source] of chunks) {
    console.log(`  ${path}: ${Buffer.byteLength(source)} bytes, ${gzipSync(source).byteLength} bytes gzip`);
  }
  return { entries, chunks, inline, css, source: [...chunks.values(), ...inline].join("\n") };
}

const plain = inspectRoute("plain/index.html");
assert.equal(plain.chunks.size, 0);
assert.equal(plain.inline.length, 0);
assert.equal(plain.css, "");

const single = inspectRoute("single/index.html");
assert.equal(single.entries.length, 1);
assert.equal(single.inline.length, 0);
assert.ok(!single.source.includes("grave-map-pin"), "ArrowLeft alone must not load MapPin behavior");

const selective = inspectRoute("selective/index.html");
assert.deepEqual([...selective.chunks.keys()], [...single.chunks.keys()]);
assert.equal(selective.css, single.css);
assert.ok(!selective.source.includes("grave-bundle-probe"), "An unused icon must not register its element");

const probe = inspectRoute("probe/index.html");
assert.equal(probe.css, single.css, "Icons must share base styles without adding unused icon selectors");
assert.ok(!probe.source.includes("grave-arrow-left"), "The probe must not load ArrowLeft behavior");
assert.ok(!probe.css.includes("grave-arrow-left"), "The probe must not load ArrowLeft-specific CSS");
assert.ok(!probe.source.includes("grave-map-pin"), "The probe must not load MapPin behavior");

const mapPin = inspectRoute("map-pin-single/index.html");
assert.equal(mapPin.entries.length, 1);
assert.equal(mapPin.inline.length, 0);
assert.equal(mapPin.css, single.css, "MapPin must reuse the same base CSS");
assert.ok(mapPin.source.includes("grave-map-pin"));
assert.ok(!mapPin.source.includes("grave-arrow-left"), "MapPin alone must not load ArrowLeft behavior");
assert.ok(!mapPin.source.includes("grave-bundle-probe"));

const both = inspectRoute("both/index.html");
assert.equal(both.css, single.css, "Multiple real icons must share the same base CSS");
assert.ok(both.source.includes("grave-map-pin"));
assert.ok(both.source.includes("grave-arrow-left"));
for (const icon of [single, mapPin, both]) {
  assert.ok(!/grave-(map-pin|arrow-left)/.test(icon.css), "No icon-specific CSS may leak through the barrel");
  assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(icon.source), "The browser bundle must not include React");
}
inspectRoute("index.html");
console.log("Selective loading verified: shared CSS only, unused icon behavior excluded.");
