import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, symlinkSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build, captureClientModules } from "../../scripts/measure-page-loading.mjs";
import { measureRoute, resourceSizes } from "../../scripts/measure-resources.mjs";
import { inspectRoute } from "../../scripts/inspect-bundle.mjs";
import { clientRecipes, registrationEntries } from "../../scripts/registration-contract.mjs";
import { loadingCases } from "../../scripts/page-loading-cases.mjs";
import { htmlElements, decodeAttribute } from "../../scripts/html.mjs";
const experiment = dirname(fileURLToPath(import.meta.url));
const root = resolve(experiment, "../..");
const artifacts = join(root, ".artifacts/recipe-delivery");
if (!existsSync(join(artifacts, "node_modules"))) symlinkSync(join(root, "tests/fixtures/astro/node_modules"), join(artifacts, "node_modules"), "dir");
const reference = JSON.parse(readFileSync(join(root, ".artifacts/page-loading/baseline.json")));
const modes = {};
const records = {};
for (const mode of ["full", "minimal"]) {
  const project = mode === "full" ? join(root, "tests/fixtures/astro") : join(artifacts, "minimal");
  mkdirSync(join(project, "src/pages/page-loading"), { recursive: true });
  if (mode === "minimal") {
    writeFileSync(join(project, "package.json"), '{"type":"module","private":true}\n');
    if (!existsSync(join(project, "node_modules"))) symlinkSync(join(root, "tests/fixtures/astro/node_modules"), join(project, "node_modules"), "dir");
    writeFileSync(join(project, "src/pages/page-loading/[sample].astro"), readFileSync(join(root, "tests/fixtures/astro/src/pages/page-loading/[sample].astro"), "utf8").replace("../../../../../../scripts/page-loading-cases.mjs", pathToFileURL(join(root, "scripts/page-loading-cases.mjs")).href));
  }
  const config = join(artifacts, mode + ".config.mjs");
  const evidence = join(artifacts, mode + "-modules.json");
  const output = join(artifacts, mode + "-dist");
  const wrappers = ["CssIcon", "CssOpacityIcon", "CssPaintIcon"];
  writeFileSync(config, `import base from ${JSON.stringify(pathToFileURL(join(root, "tests/fixtures/astro/astro.config.mjs")).href)};
import { captureClientModules } from ${JSON.stringify(pathToFileURL(join(root, "scripts/measure-page-loading.mjs")).href)};
import { resolve, dirname } from "node:path";
const replacements = new Map(${JSON.stringify(wrappers.map(name => [join(root, "packages/animated-icons/src/" + name + ".astro"), join(experiment, name + ".astro")]))});
const override = {name:"recipe-delivery-proof",enforce:"pre",resolveId(id,importer){ if(importer && id.endsWith(".astro")){const selected=replacements.get(id.startsWith(".") ? resolve(dirname(importer.split("?")[0]),id) : id);if(selected)return selected;} }};
export default {...base, root:${JSON.stringify(project)},outDir:${JSON.stringify(output)},cacheDir:${JSON.stringify(join(artifacts, mode + "-cache"))},vite:{...base.vite,plugins:[override,captureClientModules(${JSON.stringify(evidence)})]}};
`);
  await build(project, config);
  const outURL = pathToFileURL(output + "/");
  const cache = new Map();
  const baselineCache = new Map();
  const routes = {};
  for (const [name, slugs] of Object.entries(loadingCases)) {
    const route = "page-loading/" + name + "/index.html";
    const html = readFileSync(join(output, route), "utf8");
    const hosts = htmlElements(html).filter(node => node.name?.startsWith("grave-") && "data-grave-icon" in (node.attributes ?? {}));
    const expected = new Set(slugs.filter(id => clientRecipes.has(id)));
    const full = new Set();
    const urls = new Set();
    let references = 0;
    for (const host of hosts) {
      const id = host.name.slice(6), recipe = clientRecipes.get(id);
      if (!recipe) continue;
      const source = recipe.attribute.replace(/-recipe$/, "-src");
      const attrs = host.attributes;
      assert.notEqual(recipe.attribute in attrs, source in attrs, `${name}: exactly one delivery form for ${id}`);
      if (recipe.attribute in attrs) {
        assert.ok(!full.has(id), `${name}: single full record for ${id}`);
        full.add(id);
        assert.deepEqual(JSON.parse(decodeAttribute(attrs[recipe.attribute])), recipe.data);
      } else {
        const url = decodeAttribute(attrs[source]);
        urls.add(url);
        references++;
        const body = readFileSync(join(output, url.replace(/^\//, "")), "utf8");
        assert.deepEqual(JSON.parse(body), recipe.data, `${name}: recovery asset equals original wire`);
        records[id] = { url, ...resourceSizes([body]) };
      }
    }
    assert.equal(hosts.length, slugs.length);
    assert.deepEqual(full, expected, name + ": complete inline records");
    const inspection = inspectRoute(outURL, route, () => {}, cache);
    assert.equal(inspection.entries.length, registrationEntries(slugs), name + ": same selected registration entries");
    assert.equal(inspection.inline.length, 0, name + ": no inline bootstrap");
    const measurement = measureRoute(route, { output: outURL, cache, includePage: true });
    if (!slugs.length) assert.equal(inspection.chunks.size, 0);
    const baselineHTML = readFileSync(join(root, ".artifacts/page-loading/" + mode + "-dist", route), "utf8");
    assert.deepEqual([...html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(m => m[0]), [...baselineHTML.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(m => m[0]), name + ": exact initial SVG");
    assert.deepEqual(inspection.styles, inspectRoute(pathToFileURL(join(root, ".artifacts/page-loading/" + mode + "-dist/") ), route, () => {}, baselineCache).styles, name + ": unchanged CSS");
    routes[name] = { ...measurement, javascriptFiles: inspection.chunks.size, fullRecords: full.size, references, recoveryAssets: [...urls], deltaPageGzip: measurement.page.gzip - reference.modes[mode].routes[name].page.gzip };
  }
  const warm = reference.modes[mode].warm.map(({from,to}) => {
    const cached = new Set([...routes[from].chunks, ...routes[from].externalCSS]);
    const requested = [...routes[to].chunks, ...routes[to].externalCSS].filter(url=>!cached.has(url));
    const sizes = resourceSizes(requested.map(url=>readFileSync(join(output,url.slice(1)),"utf8")));
    return {from,to,requested,javascriptFiles:requested.filter(url=>routes[to].chunks.includes(url)).length,page:{raw:routes[to].html.raw+sizes.raw,gzip:routes[to].html.gzip+sizes.gzip}};
  });
  modes[mode] = { routes, warm };
}
const result = { reference: "90302b37876ba25f417b63ffd721fbab5e21f0aa", environment: reference.environment, assumptions: { ...reference.assumptions, recovery: "Normal pages use one complete inline wire per selected tag. Only source-removed, not-yet-registered reference clones fetch JSON. Those transfers are measured separately, not included in normal page costs.", proof: "Vite aliases replace only the three wrappers. Production recipes, compilers, drawings, adapters and lifecycle are unchanged. A server-only proof map supplies generated asset URLs; package release generation and per-icon URL imports are proposed, not integrated." }, modes, records };
writeFileSync(join(artifacts,"proof.json"), JSON.stringify(result,null,2)+"\n");
console.table(Object.entries(modes).flatMap(([mode,data])=>["paint-eye-off","path-paint","path-paint-repeated","all","repeated-all","one","repeated","path-paint-loader","unused"].map(name=>({mode,name,files:data.routes[name].javascriptFiles,pageGzip:data.routes[name].page.gzip,delta:data.routes[name].deltaPageGzip,records:data.routes[name].fullRecords,references:data.routes[name].references}))));
