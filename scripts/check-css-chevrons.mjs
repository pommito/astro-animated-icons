import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { inspectRoute } from "./inspect-bundle.mjs";
import { generatedCSS } from "./css-cycles.mjs";
import { chevronSlugs, chevronCases } from "./measure-css-chevrons.mjs";

export function verifyCssChevrons(output, log = console.log) {
  const routes = new Map();
  const read = (mode, name) => inspectRoute(output, `css-chevrons/${mode}/${name}/index.html`, () => {}, new Map());
  for (const name of chevronCases) {
    const actual = read("managed", name);
    routes.set(name, actual);
    const expected = name === "repeated" ? [chevronSlugs[0]] : ["family", "mixed"].includes(name) ? chevronSlugs : [name];
    const drawings = mode => [...readFileSync(new URL(`css-chevrons/${mode}/${name}/index.html`, output), "utf8").matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]);
    assert.deepEqual(drawings("managed"), drawings("baseline"), name + ": initial SVG matches Motion reference");
    assert.ok(actual.css.includes("[data-grave-icon]"), name + ": shared CSS");
    for (const [id, sheet] of generatedCSS) {
      assert.equal(actual.css.includes("@keyframes grave-cycle-" + id + "-entry"), expected.includes(id), name + ": selected CSS for " + id);
      if (expected.includes(id)) assert.ok(actual.styles.includes(sheet), name + ": CSS agrees with cycle " + id);
    }
    assert.equal(actual.styles.length, expected.length + 1, name + ": one sheet per rendered cycle");
    assert.equal(actual.entries.length, expected.length + (name === "mixed" ? 1 : 0), name + ": selective script entries");
    assert.equal(actual.inline.length, 0, name + ": no inline script");
    assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(actual.source), name + ": no React");
    const tags = new Set([...actual.source.matchAll(/["'`](grave-[a-z0-9]+(?:-[a-z0-9]+)*)["'`]/g)].map(match => match[1]));
    assert.deepEqual(tags, new Set([...expected.map(id => "grave-" + id), ...(name === "mixed" ? ["grave-loader-circle"] : [])]), name + ": selective registrations");
    if (name !== "mixed") assert.ok([...actual.chunks.values()].reduce((sum, chunk) => sum + chunk.bytes, 0) < 12000, name + ": CSS-only JS budget excludes Motion");
  }
  const single = routes.get(chevronSlugs[0]);
  assert.equal(routes.get("repeated").css, single.css, "repeated: CSS deduplication");
  assert.deepEqual(new Set(routes.get("repeated").chunks.keys()), new Set(single.chunks.keys()), "repeated: JS deduplication");
  const loader = inspectRoute(output, "loader-circle-single/index.html", () => {}, new Map());
  for (const name of ["family", "mixed"]) {
    const individual = chevronSlugs.map(slug => routes.get(slug)).concat(name === "mixed" ? [loader] : []);
    assert.deepEqual(new Set(routes.get(name).chunks.keys()), new Set(individual.flatMap(route => [...route.chunks.keys()])), name + ": exact single-route chunk union");
  }
  log(`Verified ${chevronCases.length} chevron routes: drawings, selected generated styles, registrations, deduplication, and chunk unions.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) verifyCssChevrons(new URL("../tests/fixtures/astro/dist/", import.meta.url));
