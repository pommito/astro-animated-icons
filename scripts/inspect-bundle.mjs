import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

function inspectRoute(output, route, log) {
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
  log(`${route}: ${entries.length} external entries, ${chunks.size} JS chunks, ${bytes} bytes, ${gzip} bytes gzip; ${inline.length} inline scripts, ${inline.reduce((sum, source) => sum + Buffer.byteLength(source), 0)} bytes; ${Buffer.byteLength(css)} bytes CSS`);
  for (const [path, source] of chunks) {
    log(`  ${path}: ${Buffer.byteLength(source)} bytes, ${gzipSync(source).byteLength} bytes gzip`);
  }
  return { entries, chunks, inline, css, source: [...chunks.values(), ...inline].join("\n") };
}


const singleRoutes = {
  "arrow-left": "single",
  "map-pin": "map-pin-single",
  copy: "copy-single",
  check: "check-single",
  archive: "archive-single",
  "arrow-down": "arrow-down-single",
  "at-sign": "at-sign-single",
  "arrow-right": "arrow-right-single",
  "arrow-up": "arrow-up-single",
  "arrow-up-left": "arrow-up-left-single",
  "file-text": "file-text-single",
  bot: "bot-single",
  "arrow-up-right": "arrow-up-right-single",
  "attach-file": "attach-file-single",
  "audio-lines": "audio-lines-single",
  home: "home-single",
};

const combinations = [
  ["both", "arrow-left", "map-pin"],
  ["arrow-copy", "arrow-left", "copy"],
  ["copy-check", "copy", "check"],
  ["arrow-at-sign", "arrow-left", "at-sign"],
  ["arrow-left-right", "arrow-left", "arrow-right"],
  ["arrows", "arrow-left", "arrow-up"],
  ["arrow-down-left", "arrow-left", "arrow-down"],
  ["arrow-left-up-right", "arrow-left", "arrow-up-right"],
  ["arrow-left-up-left", "arrow-left", "arrow-up-left"],
  ["arrow-archive", "arrow-left", "archive"],
  ["arrow-bot", "arrow-left", "bot"],
  ["arrow-attach-file", "arrow-left", "attach-file"],
  ["arrow-audio-lines", "arrow-left", "audio-lines"],
  ["arrow-file-text", "arrow-left", "file-text"],
  ["arrow-home", "arrow-left", "home"],
];

export function verifyBundles(output, log = console.log) {
  const source = new URL("../packages/animated-icons/src/", import.meta.url);
  const exported = [...readFileSync(new URL("astro.ts", source), "utf8").matchAll(/from "\.\/icons\/([^/]+)\/[^"]+\.astro"/g)].map((match) => match[1]);
  const directories = readdirSync(new URL("icons/", source), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  assert.deepEqual(new Set(Object.keys(singleRoutes)), new Set(exported), "Every exported icon must have a single-icon bundle case");
  assert.deepEqual(new Set(exported), new Set(directories), "Every icon directory must have an Astro export");

  const cases = [
    { route: "plain", icons: [], entries: 0, inline: 0 },
    ...Object.entries(singleRoutes).map(([icon, route]) => ({ route, icons: [icon], entries: 1, inline: 0 })),
    ...combinations.map(([route, ...icons]) => ({ route, icons, entries: icons.length, inline: 0 })),
    { route: "selective", icons: ["arrow-left"], entries: 1, inline: 0 },
    { route: "probe", icons: ["bundle-probe"], entries: 0, inline: 1 },
    { route: "", icons: ["arrow-left"], entries: 2, inline: 1 },
  ];
  const routes = new Map();
  for (const expected of cases) {
    const route = expected.route ? `${expected.route}/index.html` : "index.html";
    routes.set(expected.route, inspectRoute(output, route, log));
  }
  const sharedCSS = routes.get("single").css;
  assert.ok(sharedCSS.includes("[data-grave-icon]"), "single: shared wrapper CSS is missing");
  for (const expected of cases) {
    const actual = routes.get(expected.route);
    const context = expected.route || "index";
    const expectedTags = new Set(expected.icons.map((icon) => `grave-${icon}`));
    const actualTags = new Set([...actual.source.matchAll(/["'`](grave-[a-z0-9-]+)["'`]/g)].map((match) => match[1]));
    for (const tag of actualTags) {
      assert.ok(expectedTags.has(tag), `${context}: unused registration ${tag} must not load`);
    }
    for (const tag of expectedTags) {
      assert.ok(actualTags.has(tag), `${context}: expected registration ${tag} is missing`);
    }
    assert.equal(actual.entries.length, expected.entries, `${context}: external entry count`);
    assert.equal(actual.inline.length, expected.inline, `${context}: inline script count`);
    assert.equal(actual.css, expected.icons.length ? sharedCSS : "", `${context}: shared CSS`);
    for (const icon of [...exported, "bundle-probe"]) {
      assert.ok(!actual.css.includes(`grave-${icon}`), `${context}: icon-specific CSS for ${icon} must not load`);
    }
    assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(actual.source), `${context}: React must not load`);
  }
  assert.equal(routes.get("plain").chunks.size, 0, "plain: no imported JavaScript");
  assert.deepEqual(new Set(routes.get("selective").chunks.keys()), new Set(routes.get("single").chunks.keys()), "selective: unused barrel exports must not add chunks");
  for (const [route, ...icons] of combinations) {
    const individual = icons.map((icon) => routes.get(singleRoutes[icon]));
    assert.ok([...individual[0].chunks.keys()].some((chunk) => individual[1].chunks.has(chunk)), `${route}: icons must share runtime chunks`);
    const expected = new Set(individual.flatMap((icon) => [...icon.chunks.keys()]));
    assert.deepEqual(new Set(routes.get(route).chunks.keys()), expected, `${route}: combined chunks must equal the union of individual chunks`);
  }
  log(`Verified ${exported.length} icons across ${cases.length} bundle cases.`);
  log("Selective loading verified: shared CSS only, unused icon behavior excluded.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  verifyBundles(new URL("../tests/fixtures/astro/dist/", import.meta.url));
}
