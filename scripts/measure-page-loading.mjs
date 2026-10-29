import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, symlinkSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { arch, cpus, platform } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inspectRoute } from "./inspect-bundle.mjs";
import { measureRoute, resourceSizes } from "./measure-resources.mjs";
import { loadingCases } from "./page-loading-cases.mjs";
import { registrationEntries, verifyRegistrations } from "./registration-contract.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixture = join(root, "tests/fixtures/astro");
const artifacts = join(root, ".artifacts/page-loading");
const minimal = join(artifacts, "minimal");
const fixtureRequire = createRequire(join(fixture, "package.json"));
const astroPackage = fixtureRequire.resolve("astro/package.json");
const astroCLI = join(dirname(astroPackage), JSON.parse(readFileSync(astroPackage, "utf8")).bin.astro);

function build(cwd, config) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [astroCLI, "build", "--config", relative(cwd, config)], {
      cwd, stdio: "inherit", env: { ...process.env, NODE_ENV: "production" },
    });
    child.once("error", reject);
    child.once("exit", code => code === 0 ? resolve() : reject(new Error("Astro build failed: " + code)));
  });
}

export function chunkRole(id) {
  if (/\/src\/shared\/register-css/.test(id) || /\/src\/Css(?:Opacity)?Icon\.astro\?astro&type=script/.test(id)) return "registration";
  if (/\/src\/icons\/[^/]+\/(?:element\.ts$|[^/]+\.astro\?astro&type=script)/.test(id)) return "registration";
  if (/\/src\/icons\//.test(id)) return "recipe";
  if (/\/src\/element\.ts$/.test(id)) return "lifecycle";
  if (/\/src\/shared\/(?:cycle-css|opacity-css|recipe-css)\.ts$/.test(id)) return "stylesheet-compiler-and-recovery";
  if (/\/src\/shared\/css-(?:cycle|opacity)\.ts$/.test(id)) return "css-adapter";
  if (/\/node_modules\//.test(id)) return "dependency";
  return "other-shared";
}

export function captureClientModules(file) {
  return {
    name: "page-loading-module-evidence",
    enforce: "post",
    applyToEnvironment(environment) { return environment.name === "client"; },
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter(value => value.type === "chunk");
      writeFileSync(file, JSON.stringify(Object.fromEntries(chunks.map(chunk => ["/" + chunk.fileName, {
        entry: chunk.isEntry,
        sha256: createHash("sha256").update(chunk.code).digest("hex"),
        modules: Object.entries(chunk.modules).map(([id, module]) => ({
          id: id.startsWith(root) ? id.slice(root.length) : id.includes("node_modules/") ? id.slice(id.indexOf("node_modules/")) : id,
          role: chunkRole(id),
          renderedLength: module.renderedLength,
        })),
      }])), null, 2) + "\n");
    },
  };
}

export function measureLoading(output, metadata) {
  const cache = new Map();
  const resources = {};
  const routes = Object.fromEntries(Object.entries(loadingCases).map(([name, slugs]) => {
    const route = "page-loading/" + name + "/index.html";
    const inspection = inspectRoute(output, route, () => {}, cache);
    const payload = measureRoute(route, { output, cache, includePage: true });
    const html = readFileSync(new URL(route, output), "utf8");
    verifyRegistrations(inspection, html, slugs, name);
    assert.equal(inspection.entries.length, registrationEntries(slugs), name + ": entry deduplication");
    assert.equal(inspection.inline.length, 0, name + ": no inline reference scripts");
    assert.ok(!/react(?:-dom)?|reference-/.test(inspection.source), name + ": no comparison implementations");
    assert.equal((html.match(/<svg\b/g) ?? []).length, slugs.length, name + ": SVG count");
    if (!slugs.length) assert.equal(inspection.chunks.size, 0, "unused: JavaScript must not load");
    for (const [url, chunk] of inspection.chunks) {
      assert.ok(metadata[url], name + ": module evidence for " + url);
      assert.equal(createHash("sha256").update(chunk.source).digest("hex"), metadata[url].sha256, name + ": module evidence matches built chunk " + url);
      resources[url] = { ...resourceSizes([chunk.source]), ...metadata[url] };
    }
    for (const url of payload.externalCSS) resources[url] = { ...resourceSizes([readFileSync(new URL(url.slice(1), output), "utf8")]), kind: "stylesheet" };
    return [name, { icons: slugs.length, distinctIcons: new Set(slugs).size, entries: inspection.entries.length,
      javascriptFiles: inspection.chunks.size, inlineScripts: inspection.inline.length, registrations: new Set(slugs).size,
      recipeData: resourceSizes([...html.matchAll(/data-grave-(?:cycle|opacity)-recipe="([^"]*)"/g)].map(match => match[0])), ...payload }];
  }));
  const transitions = [["one", "four"], ["four", "ten"], ["ten", "all"], ["all", "one"], ["all", "all-loader"],
    ["loader", "all-loader"], ["all-loader", "four"], ["one", "repeated"], ["all", "repeated-all"],
    ["cog", "cog-repeated"], ["cog", "cog-css"], ["cog-css", "cog-css-loader"],
    ["loader", "cog-loader"], ["cog-css-loader", "cog"],
    ...["key-square", "wallet", "key-circle", "combined"].flatMap(name => [
      [name, name + "-repeated"], [name, name + "-css"], [name + "-css", name + "-css-loader"],
      ["loader", name + "-loader"], [name + "-css-loader", name],
    ])];
  const warm = transitions.map(([from, to]) => {
    const cached = new Set([...routes[from].chunks, ...routes[from].externalCSS]);
    const requested = [...routes[to].chunks, ...routes[to].externalCSS].filter(url => !cached.has(url));
    return { from, to, requested, javascriptFiles: requested.filter(url => routes[to].chunks.includes(url)).length,
      page: { raw: routes[to].html.raw + requested.reduce((sum, url) => sum + resources[url].raw, 0),
        gzip: routes[to].html.gzip + requested.reduce((sum, url) => sum + resources[url].gzip, 0) } };
  });
  assert.deepEqual(routes.one.chunks, routes.repeated.chunks, "repeated icons must reuse JavaScript");
  assert.deepEqual(routes.all.chunks, routes["repeated-all"].chunks, "repeated families must reuse JavaScript");
  assert.deepEqual(routes.one.css, routes.repeated.css, "repeated icons must reuse generated CSS");
  assert.deepEqual(routes.all.css, routes["repeated-all"].css, "repeated families must reuse generated CSS");
  assert.deepEqual(routes.cog.chunks, routes["cog-repeated"].chunks, "repeated UserRoundCog must reuse JavaScript");
  assert.deepEqual(routes.cog.css, routes["cog-repeated"].css, "repeated UserRoundCog must reuse generated CSS");
  for (const name of ["key-square", "wallet", "key-circle", "combined"]) {
    assert.deepEqual(routes[name].chunks, routes[name + "-repeated"].chunks, name + ": repeated instances must reuse JavaScript");
    assert.deepEqual(routes[name].css, routes[name + "-repeated"].css, name + ": repeated instances must reuse generated CSS");
  }
  return { routes, warm, resources };
}

async function main() {
  mkdirSync(join(minimal, "src/pages/page-loading"), { recursive: true });
  writeFileSync(join(minimal, "package.json"), JSON.stringify({ private: true, type: "module" }) + "\n");
  if (!existsSync(join(artifacts, "node_modules"))) symlinkSync(join(fixture, "node_modules"), join(artifacts, "node_modules"), "dir");
  if (!existsSync(join(minimal, "node_modules"))) symlinkSync(join(fixture, "node_modules"), join(minimal, "node_modules"), "dir");
  const source = readFileSync(join(fixture, "src/pages/page-loading/[sample].astro"), "utf8")
    .replace("../../../../../../scripts/page-loading-cases.mjs", pathToFileURL(join(root, "scripts/page-loading-cases.mjs")).href);
  writeFileSync(join(minimal, "src/pages/page-loading/[sample].astro"), source);
  const projects = { full: fixture, minimal };
  const modes = {};
  for (const [name, directory] of Object.entries(projects)) {
    const evidence = join(artifacts, name + "-modules.json");
    const config = join(artifacts, name + ".config.mjs");
    const output = join(artifacts, name + "-dist");
    writeFileSync(config, 'import base from ' + JSON.stringify(pathToFileURL(join(fixture, "astro.config.mjs")).href)
      + ';\nimport { captureClientModules } from ' + JSON.stringify(import.meta.url)
      + ';\nexport default { ...base, root: ' + JSON.stringify(directory) + ', outDir: ' + JSON.stringify(output)
      + ', cacheDir: ' + JSON.stringify(join(artifacts, name + "-cache"))
      + ', vite: { ...base.vite, plugins: [...(base.vite?.plugins ?? []), captureClientModules(' + JSON.stringify(evidence) + ')] } };\n');
    await build(directory, config);
    modes[name] = measureLoading(pathToFileURL(output + "/"), JSON.parse(readFileSync(evidence, "utf8")));
  }
  const result = {
    environment: { node: process.version, packageManager: JSON.parse(readFileSync(join(root, "package.json"), "utf8")).packageManager,
      astro: JSON.parse(readFileSync(astroPackage, "utf8")).version,
      motion: JSON.parse(readFileSync(fixtureRequire.resolve("motion/package.json"), "utf8")).version,
      platform: platform(), arch: arch(), cpu: cpus()[0]?.model },
    assumptions: {
      cold: "Reachable static and literal dynamic imports count once per URL. These are resource counts, not observed browser requests.",
      compression: "Node zlib gzip defaults per external resource. total compresses inline styles/scripts separately. page compresses HTML with inline content once plus external JS/CSS.",
      warm: "A second document navigation in the same build reuses every external URL reached by the first route, with no eviction or revalidation. HTML is fetched again. This is a cache model, not a browser measurement.",
      modules: "Rollup renderedLength identifies source contributions before final minification. It is not an additive allocation of final raw or gzip bytes. Mixed chunks may contain several roles.",
      minimal: "The isolated project contains only the measurement routes, uses the same public barrel imports and installed package links, and has no reference implementation. It is not a packed-package installation.",
      excluded: "Headers, latency, Brotli, HTTP cache policy, cross-build cache reuse, frame pacing, preparation timing and browser behavior.",
    }, cases: loadingCases, modes,
  };
  writeFileSync(join(artifacts, "baseline.json"), JSON.stringify(result, null, 2) + "\n");
  console.table(Object.entries(modes).flatMap(([project, mode]) => Object.entries(mode.routes).map(([name, route]) => ({
    project, name, entries: route.entries, files: route.javascriptFiles, jsGzip: route.javascript.gzip,
    cssGzip: route.css.gzip, pageGzip: route.page.gzip,
  }))));
  console.log("Saved .artifacts/page-loading/baseline.json");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error); process.exitCode = 1; });
