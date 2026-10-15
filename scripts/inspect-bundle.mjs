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
assert.ok(!single.source.includes("grave-copy"), "ArrowLeft alone must not load Copy behavior");

const selective = inspectRoute("selective/index.html");
assert.deepEqual([...selective.chunks.keys()], [...single.chunks.keys()]);
assert.equal(selective.css, single.css);
assert.ok(!selective.source.includes("grave-bundle-probe"), "An unused icon must not register its element");

const probe = inspectRoute("probe/index.html");
assert.equal(probe.css, single.css, "Icons must share base styles without adding unused icon selectors");
assert.ok(!probe.source.includes("grave-arrow-left"), "The probe must not load ArrowLeft behavior");
assert.ok(!probe.css.includes("grave-arrow-left"), "The probe must not load ArrowLeft-specific CSS");
assert.ok(!probe.source.includes("grave-map-pin"), "The probe must not load MapPin behavior");
assert.ok(!probe.source.includes("grave-copy"), "The probe must not load Copy behavior");

const mapPin = inspectRoute("map-pin-single/index.html");
assert.equal(mapPin.entries.length, 1);
assert.equal(mapPin.inline.length, 0);
assert.equal(mapPin.css, single.css, "MapPin must reuse the same base CSS");
assert.ok(mapPin.source.includes("grave-map-pin"));
assert.ok(!mapPin.source.includes("grave-arrow-left"), "MapPin alone must not load ArrowLeft behavior");
assert.ok(!mapPin.source.includes("grave-bundle-probe"));
assert.ok(!mapPin.source.includes("grave-copy"), "MapPin alone must not load Copy behavior");

const both = inspectRoute("both/index.html");
assert.equal(both.css, single.css, "Multiple real icons must share the same base CSS");
assert.ok(both.source.includes("grave-map-pin"));
assert.ok(both.source.includes("grave-arrow-left"));
assert.ok(!both.source.includes("grave-copy"));

const copy = inspectRoute("copy-single/index.html");
assert.equal(copy.entries.length, 1);
assert.equal(copy.inline.length, 0);
assert.equal(copy.css, single.css, "Copy must reuse the same base CSS");
assert.ok(copy.source.includes("grave-copy"));
assert.ok(!copy.source.includes("grave-arrow-left"), "Copy alone must not load ArrowLeft behavior");
assert.ok(!copy.source.includes("grave-map-pin"), "Copy alone must not load MapPin behavior");
assert.ok(!copy.source.includes("grave-bundle-probe"));

const arrowCopy = inspectRoute("arrow-copy/index.html");
assert.equal(arrowCopy.entries.length, 2);
assert.equal(arrowCopy.inline.length, 0);
assert.equal(arrowCopy.css, single.css, "ArrowLeft and Copy must share the same base CSS");
assert.ok(arrowCopy.source.includes("grave-arrow-left"));
assert.ok(arrowCopy.source.includes("grave-copy"));
assert.ok(!arrowCopy.source.includes("grave-map-pin"));
const sharedChunks = [...single.chunks.keys()].filter((path) => copy.chunks.has(path));
assert.ok(sharedChunks.length > 0, "Copy and ArrowLeft must reuse their shared runtime");
assert.deepEqual(new Set(arrowCopy.chunks.keys()), new Set([...single.chunks.keys(), ...copy.chunks.keys()]));

for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy]) {
  assert.ok(!icon.source.includes("grave-check"), "Unused Check behavior must not load");
}

const check = inspectRoute("check-single/index.html");
assert.equal(check.entries.length, 1);
assert.equal(check.inline.length, 0);
assert.equal(check.css, single.css, "Check must reuse the same base CSS");
assert.ok(check.source.includes("grave-check"));
assert.ok(!/grave-(arrow-left|map-pin|copy|bundle-probe)/.test(check.source), "Check alone must exclude every unused icon");

const copyCheck = inspectRoute("copy-check/index.html");
assert.equal(copyCheck.entries.length, 2);
assert.equal(copyCheck.inline.length, 0);
assert.equal(copyCheck.css, single.css, "Copy and Check must share the same base CSS");
assert.ok(copyCheck.source.includes("grave-check"));
assert.ok(copyCheck.source.includes("grave-copy"));
assert.ok(!/grave-(arrow-left|map-pin|bundle-probe)/.test(copyCheck.source));
assert.ok([...check.chunks.keys()].some((path) => copy.chunks.has(path)), "Check and Copy must reuse their shared runtime");
assert.deepEqual(new Set(copyCheck.chunks.keys()), new Set([...copy.chunks.keys(), ...check.chunks.keys()]));

for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck]) {
  assert.ok(!icon.source.includes("grave-at-sign"), "Unused AtSign behavior must not load");
}

const atSign = inspectRoute("at-sign-single/index.html");
assert.equal(atSign.entries.length, 1);
assert.equal(atSign.inline.length, 0);
assert.equal(atSign.css, single.css, "AtSign must reuse the same base CSS");
assert.ok(atSign.source.includes("grave-at-sign"));
assert.ok(!/grave-(arrow-left|map-pin|copy|check|bundle-probe)/.test(atSign.source), "AtSign alone must exclude every unused icon");

const arrowAtSign = inspectRoute("arrow-at-sign/index.html");
assert.equal(arrowAtSign.entries.length, 2);
assert.equal(arrowAtSign.inline.length, 0);
assert.equal(arrowAtSign.css, single.css, "ArrowLeft and AtSign must share the same base CSS");
assert.ok(arrowAtSign.source.includes("grave-at-sign"));
assert.ok(arrowAtSign.source.includes("grave-arrow-left"));
assert.ok(!/grave-(map-pin|copy|check|bundle-probe)/.test(arrowAtSign.source));
assert.ok([...atSign.chunks.keys()].some((path) => single.chunks.has(path)), "AtSign and ArrowLeft must reuse their shared runtime");
assert.deepEqual(new Set(arrowAtSign.chunks.keys()), new Set([...single.chunks.keys(), ...atSign.chunks.keys()]));

for (const icon of [single, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign]) {
  assert.ok(!/grave-(map-pin|arrow-left|copy|check|at-sign)/.test(icon.css), "No icon-specific CSS may leak through the barrel");
  assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(icon.source), "The browser bundle must not include React");
}
for (const icon of [single, selective, probe, mapPin, both, copy, arrowCopy, check, copyCheck, atSign, arrowAtSign]) {
  assert.ok(!icon.source.includes("grave-archive"), "Unused Archive behavior must not load");
}
const archive = inspectRoute("archive-single/index.html");
assert.equal(archive.entries.length, 1);
assert.equal(archive.inline.length, 0);
assert.equal(archive.css, single.css, "Archive must reuse shared CSS");
assert.ok(archive.source.includes("grave-archive"));
assert.ok(!/grave-(arrow-left|map-pin|copy|check|at-sign|bundle-probe)/.test(archive.source));
assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(archive.source));
assert.ok(!/grave-archive/.test(archive.css));
const arrowArchive = inspectRoute("arrow-archive/index.html");
assert.equal(arrowArchive.entries.length, 2);
assert.equal(arrowArchive.inline.length, 0);
assert.equal(arrowArchive.css, single.css);
assert.ok(arrowArchive.source.includes("grave-arrow-left"));
assert.ok(arrowArchive.source.includes("grave-archive"));
assert.ok(!/grave-(map-pin|copy|check|at-sign|bundle-probe)/.test(arrowArchive.source));
assert.deepEqual(new Set(arrowArchive.chunks.keys()), new Set([...single.chunks.keys(), ...archive.chunks.keys()]));

inspectRoute("index.html");
console.log("Selective loading verified: shared CSS only, unused icon behavior excluded.");
