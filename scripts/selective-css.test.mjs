import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { build } from "./measure-page-loading.mjs";
import { inspectRoute } from "./inspect-bundle.mjs";
import { cycles } from "./css-cycles.mjs";
import { loadingIcons } from "./page-loading-cases.mjs";

const directory = realpathSync(mkdtempSync(join(tmpdir(), "icons-selective-css-")));
const output = new URL("file://" + directory + "/dist/");
let metadata;
const simple = [...cycles].filter(([, cycle]) => !("tracks" in cycle)).map(([id]) => loadingIcons.find(icon => icon.slug === id));
before(async () => {
  mkdirSync(join(directory, "src/pages"), { recursive: true });
  symlinkSync(fileURLToPath(new URL("../tests/fixtures/astro/node_modules", import.meta.url)), join(directory, "node_modules"), "dir");
  writeFileSync(join(directory, "package.json"), '{"private":true,"type":"module"}');
  for (const { slug, name } of simple) {
    writeFileSync(join(directory, "src/pages", slug + ".astro"), '---\nimport { ' + name + ' } from "@grave/animated-icons/astro";\n---\n<' + name + ' />');
  }
  writeFileSync(join(directory, "astro.config.mjs"), 'import { captureClientModules } from ' + JSON.stringify(import.meta.url.replace("selective-css.test.mjs", "measure-page-loading.mjs"))
    + '; export default { root: ' + JSON.stringify(directory) + ', vite: { plugins: [captureClientModules(' + JSON.stringify(join(directory, "modules.json")) + ')] } };');
  await build(directory, join(directory, "astro.config.mjs"));
  metadata = JSON.parse(readFileSync(join(directory, "modules.json"), "utf8"));
});
after(() => rmSync(directory, { recursive: true, force: true }));

test("public simple-transform pages deliver no combined transform sampler or compiler", () => {
  const cache = new Map();
  for (const { slug } of simple) {
    const route = inspectRoute(output, slug + "/index.html", () => {}, cache);
    const modules = [...route.chunks.keys()].flatMap(url => metadata[url].modules.map(module => module.id));
    assert.ok(!modules.some(id => /combined-transform-(?:cycle|css)\.ts$/.test(id)), slug + "\n" + modules.join("\n"));
  }
});
