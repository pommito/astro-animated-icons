import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import { chunkRole, measureLoading } from "./measure-page-loading.mjs";
import { loadingCases, loadingIcons } from "./page-loading-cases.mjs";

function consumer(run) {
  const directory = mkdtempSync(join(tmpdir(), "icon-page-loading-"));
  const output = pathToFileURL(directory + "/");
  const metadata = {};
  try {
    mkdirSync(join(directory, "assets"));
    writeFileSync(join(directory, "assets/runtime.js"), "export const register = tag => customElements.define(tag, class extends HTMLElement {});");
    writeFileSync(join(directory, "assets/shared.css"), "[data-grave-icon]{display:inline-flex}");
    const evidence = path => ({ sha256: createHash("sha256").update(readFileSync(new URL(path.slice(1), output))).digest("hex"), modules: [] });
    metadata["/assets/runtime.js"] = { entry: false, ...evidence("/assets/runtime.js") };
    for (const icon of loadingIcons) {
      const url = "/assets/" + icon.slug + ".js";
      writeFileSync(new URL(url.slice(1), output), 'import {register} from "./runtime.js"; register("grave-' + icon.slug + '");');
      metadata[url] = { entry: true, ...evidence(url) };
    }
    for (const [name, icons] of Object.entries(loadingCases)) {
      mkdirSync(join(directory, "page-loading", name), { recursive: true });
      writeFileSync(join(directory, "page-loading", name, "index.html"),
        '<html><head><link rel="stylesheet" href="/assets/shared.css"></head><body>'
        + [...new Set(icons)].map(slug => '<script type="module" src="/assets/' + slug + '.js"></script>').join("")
        + icons.map(() => "<svg></svg>").join("") + "</body></html>");
    }
    return run(output, metadata);
  } finally { rmSync(directory, { recursive: true, force: true }); }
}

test("cold totals compress HTML once and count a shared dependency once", () => consumer((output, metadata) => {
  const { routes } = measureLoading(output, metadata);
  const route = routes.four;
  assert.equal(route.javascriptFiles, 5);
  const files = ["page-loading/four/index.html", ...route.chunks.map(url => url.slice(1)), "assets/shared.css"];
  const sources = files.map(file => readFileSync(new URL(file, output)));
  assert.equal(route.page.raw, sources.reduce((sum, source) => sum + source.length, 0));
  assert.equal(route.page.gzip, sources.reduce((sum, source) => sum + gzipSync(source).length, 0));
}));

test("warm transitions reuse URLs and still charge the second HTML document", () => consumer((output, metadata) => {
  const { routes, warm } = measureLoading(output, metadata);
  const repeated = warm.find(value => value.from === "one" && value.to === "repeated");
  assert.deepEqual(repeated.requested, []);
  assert.equal(repeated.javascriptFiles, 0);
  assert.deepEqual(repeated.page, routes.repeated.html);
  const adding = warm.find(value => value.from === "four" && value.to === "ten");
  assert.equal(adding.javascriptFiles, 6);
  assert.ok(adding.requested.every(url => !routes.four.chunks.includes(url)));
}));

test("measurement rejects unused registrations and missing module evidence", () => consumer((output, metadata) => {
  const entry = new URL("assets/circle-dashed.js", output);
  const source = readFileSync(entry, "utf8");
  writeFileSync(entry, source + '\nregister("grave-unused");');
  assert.throws(() => measureLoading(output, metadata), /one: exact registrations/);
  writeFileSync(entry, source);
  delete metadata["/assets/runtime.js"];
  assert.throws(() => measureLoading(output, metadata), /one: module evidence/);
}));

test("measurement rejects module evidence from a different build", () => consumer((output, metadata) => {
  const shared = new URL("assets/runtime.js", output);
  writeFileSync(shared, readFileSync(shared, "utf8") + "\n");
  assert.throws(() => measureLoading(output, metadata), /one: module evidence matches built chunk/);
}));

test("measurement rejects repeated stylesheet payloads", () => consumer((output, metadata) => {
  const page = new URL("page-loading/repeated/index.html", output);
  writeFileSync(page, readFileSync(page, "utf8").replace("</head>", '<link rel="stylesheet" href="/assets/shared.css"></head>'));
  assert.throws(() => measureLoading(output, metadata), /repeated icons must reuse generated CSS/);
}));

test("module evidence separates registration, recipe, lifecycle and CSS support", () => {
  assert.equal(chunkRole("/repo/packages/animated-icons/src/icons/bell/element.ts"), "registration");
  assert.equal(chunkRole("/repo/packages/animated-icons/src/icons/bell/cycle.ts"), "recipe");
  assert.equal(chunkRole("/repo/packages/animated-icons/src/element.ts"), "lifecycle");
  assert.equal(chunkRole("/repo/packages/animated-icons/src/shared/css-cycle.ts"), "css-adapter");
  assert.equal(chunkRole("/repo/packages/animated-icons/src/shared/cycle-css.ts"), "stylesheet-compiler-and-recovery");
  assert.equal(chunkRole("/repo/node_modules/motion/index.js"), "dependency");
});
