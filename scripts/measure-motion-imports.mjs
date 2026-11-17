import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readCatalog } from "./catalog.mjs";
import { build, captureLoadingContext } from "./measure-page-loading.mjs";
import { inspectRoute } from "./inspect-bundle.mjs";
import { measureRoute, resourceSizes } from "./measure-resources.mjs";
import { verifyRegistrations } from "./registration-contract.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixture = join(root, "tests/fixtures/astro");
const artifacts = join(root, ".artifacts/motion-imports");
const minimal = join(artifacts, "minimal");
const controls = ["loader-circle", "loader", "loader-pinwheel", "cog", "chess-bishop", "users-round", "square-arrow-left", "arrow-left", "archive", "car", "truck", "connect", "rocket"];
const css = ["bell", "circle-dashed", "user-round-cog"];
const cases = Object.fromEntries([
  ["unused", []], ["css", css],
  ...controls.flatMap(slug => [[slug, [slug]], [slug + "-repeated", Array(20).fill(slug)],
    [slug + "-css", [slug, ...css]], [slug + "-archive", [slug, "archive"]]]),
  ["loaders", controls.slice(0, 3)], ["loaders-repeated", Array.from({ length: 20 }, () => controls.slice(0, 3)).flat()],
]);
const names = Object.fromEntries(readCatalog().map(icon => [icon.slug, icon.name]));
const source = `---
import * as icons from "@grave/animated-icons/astro";
export function getStaticPaths() { return Object.entries(${JSON.stringify(cases)}).map(([sample, slugs]) => ({ params: { sample }, props: { slugs } })); }
const names = ${JSON.stringify(names)};
---
<html lang="en"><head><meta charset="utf-8" /><title>Motion import measurement</title></head><body>
{Astro.props.slugs.map((slug: string) => { const Icon = icons[names[slug as keyof typeof names] as keyof typeof icons]; return <Icon />; })}
</body></html>`;
const temporaryPage = join(fixture, "src/pages/motion-import-costs/[sample].astro");
assert.ok(!existsSync(temporaryPage), "Measurement route already exists");
mkdirSync(join(minimal, "src/pages/motion-import-costs"), { recursive: true });
writeFileSync(join(minimal, "package.json"), '{"private":true,"type":"module"}\n');
if (!existsSync(join(minimal, "node_modules"))) symlinkSync(join(fixture, "node_modules"), join(minimal, "node_modules"), "dir");
if (!existsSync(join(artifacts, "node_modules"))) symlinkSync(join(fixture, "node_modules"), join(artifacts, "node_modules"), "dir");
writeFileSync(join(minimal, "src/pages/motion-import-costs/[sample].astro"), source);
mkdirSync(join(fixture, "src/pages/motion-import-costs"), { recursive: true });
writeFileSync(temporaryPage, source);
const modes = {};
try {
  for (const [mode, directory] of Object.entries({ full: fixture, minimal })) {
    const modulesFile = join(artifacts, mode + "-modules.json");
    const output = join(artifacts, mode + "-dist");
    const config = join(artifacts, mode + ".config.mjs");
    writeFileSync(config, `import base from ${JSON.stringify(pathToFileURL(join(fixture, "astro.config.mjs")).href)};
import { captureClientModules } from ${JSON.stringify(new URL("measure-page-loading.mjs", import.meta.url).href)};
export default { ...base, root: ${JSON.stringify(directory)}, outDir: ${JSON.stringify(output)}, cacheDir: ${JSON.stringify(join(artifacts, mode + "-cache"))}, vite: { ...base.vite, plugins: [...(base.vite?.plugins ?? []), captureClientModules(${JSON.stringify(modulesFile)})] } };`);
    await build(directory, config);
    const metadata = JSON.parse(readFileSync(modulesFile, "utf8"));
    const outputURL = pathToFileURL(output + "/");
    const resources = {};
    const routes = Object.fromEntries(Object.entries(cases).map(([name, slugs]) => {
      const path = "motion-import-costs/" + name + "/index.html";
      const inspection = inspectRoute(outputURL, path, () => {}, new Map());
      const html = readFileSync(new URL(path, outputURL), "utf8");
      verifyRegistrations(inspection, html, slugs, name);
      assert.equal((html.match(/<svg\b/g) ?? []).length, slugs.length, name + ": SVG count");
      for (const [url, chunk] of inspection.chunks) {
        assert.equal(createHash("sha256").update(chunk.source).digest("hex"), metadata[url].sha256);
        assert.deepEqual(metadata[url].dynamicImports, [], name + ": this static-import comparison must include no deferred path");
        resources[url] = { ...resourceSizes([chunk.source]), ...metadata[url] };
      }
      const payload = measureRoute(path, { output: outputURL, includePage: true });
      return [name, { icons: slugs.length, javascriptFiles: inspection.chunks.size,
        initial: payload.javascript, eventual: payload.javascript, deferred: { raw: 0, gzip: 0 }, ...payload }];
    }));
    modes[mode] = { routes, resources };
  }
} finally {
  rmSync(temporaryPage);
}
const report = { cases, modes, ...captureLoadingContext(import.meta.url),
  assumptions: "Same locked full/minimal builds, static imports only, shared URLs counted once, Node gzip defaults per resource. Page compresses HTML including inline CSS once. No request, timing or installed-package measurement." };
writeFileSync(join(artifacts, "report.json"), JSON.stringify(report, null, 2) + "\n");
console.log("Saved .artifacts/motion-imports/report.json");
