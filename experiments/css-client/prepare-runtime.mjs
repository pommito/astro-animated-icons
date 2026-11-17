import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadingIcons } from "../../scripts/page-loading-cases.mjs";
import { prepareProof } from "./prepare.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const quote = JSON.stringify;
const scenarios = [
  { name: "one", batch: 32 }, { name: "cog", batch: 32 }, { name: "key-square", batch: 8 },
  { name: "paint-eye-off", batch: 32 }, { name: "four", batch: 8 }, { name: "ten", batch: 8 },
  { name: "repeated", batch: 8 }, { name: "all", batch: 1 }, { name: "repeated-all", batch: 1 },
  { name: "path-paint-repeated", batch: 1 },
];

for (const transport of ["attribute", "template"]) {
  const wrappers = prepareProof(transport);
  const artifacts = join(root, ".artifacts/css-client", transport, "runtime");
  const project = join(artifacts, "project");
  const generated = join(project, "src/generated");
  mkdirSync(generated, { recursive: true });
  mkdirSync(join(project, "src/pages"), { recursive: true });
  for (const directory of [artifacts, project]) if (!existsSync(join(directory, "node_modules"))) symlinkSync(join(root, "tests/fixtures/astro/node_modules"), join(directory, "node_modules"), "dir");
  writeFileSync(join(project, "package.json"), '{"private":true,"type":"module"}');
  const exports = [];
  for (const icon of loadingIcons) {
    const original = join(root, "packages/animated-icons/src/icons", icon.slug, icon.name + ".astro");
    const source = readFileSync(original, "utf8");
    if (!/\/Css(?:Opacity|Paint)?Icon\.astro/.test(source)) {
      exports.push(`export {default as ${icon.name}} from ${quote(original)};`);
      continue;
    }
    const replaced = source.replace(/(from\s*["'])(\.[^"']+)(["'])/g, (_, before, specifier, after) => {
      const file = resolve(dirname(original), specifier);
      return before + (/\/Css(?:Opacity|Paint)?Icon\.astro$/.test(file) ? join(wrappers, file.split("/").at(-1)) : file) + after;
    });
    writeFileSync(join(generated, icon.name + ".astro"), replaced);
    exports.push(`export {default as ${icon.name}} from "./${icon.name}.astro";`);
  }
  writeFileSync(join(generated, "icons.ts"), exports.join("\n"));
  writeFileSync(join(project, "src/Scene.astro"), `---\nimport * as baseline from "@grave/animated-icons/astro";\nimport * as proof from "./generated/icons";\nimport {loadingIcons} from ${quote(pathToFileURL(join(root, "scripts/page-loading-cases.mjs")).href)};\nconst {variant,slugs}=Astro.props;\nconst icons=variant==="baseline"?baseline:proof;\n---\n{slugs.map(slug=>{const icon=loadingIcons.find(icon=>icon.slug===slug);const Component=icons[icon.name];return <Component/>;})}`);
  let benchmark = readFileSync(join(root, "experiments/recipe-delivery-runtime/server-benchmark.mjs"), "utf8");
  assert.ok(benchmark.includes('const scenarios=[{name:"paint-eye-off"'));
  benchmark = benchmark.replace(/const scenarios=\[[^\n]+\];/, "const scenarios=" + JSON.stringify(scenarios) + ";")
    .replace('"../../scripts/page-loading-cases.mjs"', quote(pathToFileURL(join(root, "scripts/page-loading-cases.mjs")).href))
    .replace('root+"/.artifacts/recipe-delivery-runtime/server.json"', quote(join(artifacts, "server.json")))
    .replace('"recipe-delivery-v2"', quote("css-client/" + transport + "/minimal"))
    .replace('"/minimal-dist/page-loading/"', '"/dist/page-loading/"');
  const expected = 'root+"/.artifacts/"+(variant==="baseline"?"page-loading":"css-client/' + transport + '/minimal")+"/dist/page-loading/"';
  assert.ok(benchmark.includes(expected));
  benchmark = benchmark.replace(expected, 'root+"/.artifacts/"+(variant==="baseline"?"page-loading/minimal-dist":"css-client/' + transport + '/minimal/dist")+"/page-loading/"');
  writeFileSync(join(artifacts, "benchmark.mjs"), benchmark);
  writeFileSync(join(project, "src/pages/bench.astro"), `---\nimport { experimental_AstroContainer as AstroContainer } from "astro/container";\nimport Scene from "../Scene.astro";\nimport {runServerBenchmark} from ${quote(pathToFileURL(join(artifacts, "benchmark.mjs")).href)};\nawait runServerBenchmark(Scene,${quote(root)},AstroContainer);\n---\n<p>Benchmark completed.</p>`);
  writeFileSync(join(artifacts, "astro.config.mjs"), `export default { root: ${quote(project)}, outDir: ${quote(join(artifacts, "dist"))}, cacheDir: ${quote(join(artifacts, "cache"))} };`);
  console.log("Prepared paired server and streaming adapter", transport);
}
