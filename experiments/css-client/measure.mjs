import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildProof } from "./build.mjs";
import { captureLoadingContext, measureLoading } from "../../scripts/measure-page-loading.mjs";
import { verifyPreparedRecords } from "./records.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const artifacts = join(root, ".artifacts/css-client");
const fixture = join(root, "tests/fixtures/astro");
const reference = JSON.parse(readFileSync(join(root, "docs/history/2026-11-02-selective-transforms-loading.json")));
export async function measureProofs() {
for (const transport of ["attribute", "template"]) {
  const modes = {};
  for (const mode of ["full", "minimal"]) {
    const directory = join(artifacts, transport, mode);
    mkdirSync(directory, { recursive: true });
    const project = mode === "full" ? fixture : join(directory, "project");
    if (mode === "minimal") {
      mkdirSync(join(project, "src/pages/page-loading"), { recursive: true });
      writeFileSync(join(project, "package.json"), '{"type":"module","private":true}');
      if (!existsSync(join(project, "node_modules"))) symlinkSync(join(fixture, "node_modules"), join(project, "node_modules"), "dir");
      writeFileSync(join(project, "src/pages/page-loading/[sample].astro"), readFileSync(join(fixture, "src/pages/page-loading/[sample].astro"), "utf8").replace("../../../../../../scripts/page-loading-cases.mjs", pathToFileURL(join(root, "scripts/page-loading-cases.mjs")).href));
    }
    const output = join(directory, "dist");
    const evidence = await buildProof(project, transport, output);
    modes[mode] = measureLoading(pathToFileURL(output + "/"), JSON.parse(readFileSync(evidence)), {
      recordVerifier: (actual, html, icons, context) => verifyPreparedRecords(transport, actual, html, icons, context),
      checkStyleReuse: transport !== "template",
    });
    for (const name of Object.keys(reference.cases)) {
      const relative = "page-loading/" + name + "/index.html";
      const before = readFileSync(join(root, ".artifacts/page-loading", mode + "-dist", relative), "utf8");
      const after = readFileSync(join(output, relative), "utf8");
      const drawings = source => [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]);
      assert.deepEqual(drawings(after), drawings(before), name + ": exact complete initial SVG");
      const modules = modes[mode].routes[name].chunks.flatMap(url => modes[mode].resources[url].modules);
      assert.ok(!modules.some(module => /\/(?:cycle-css|combined-cycle-css|transform-css|combined-transform-(?:cycle|css)|opacity-css|paint-css)\.ts$/.test(module.id)), name + ": no client compiler or Bezier sampler");
    }
    console.log("Measured", transport, mode);
  }
  const report = { transport, reference: "9a5a81f", ...captureLoadingContext(import.meta.url),
    assumptions: { ...reference.assumptions, proof: "Isolated wrapper and registration aliases only; production mechanisms unchanged. Complete prepared record on every host. Template recovery CSS is transferred as inert style text and included in CSS diagnostics; attribute recovery CSS is included in recipeData/HTML. JSON attributes are not independent requests.", reuse: "Template proof permits repeated inert recovery CSS, while external scripts, active sheets and initial SVG remain checked. No production budget or production style-reuse rule is changed." }, cases: reference.cases, modes };
  writeFileSync(join(artifacts, transport, "loading.json"), JSON.stringify(report, null, 2) + "\n");
}

}
if (process.argv[1] === fileURLToPath(import.meta.url)) await measureProofs();
