import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { inspectRoute } from "./inspect-bundle.mjs";
import { generatedCSS as transformCSS } from "./css-cycles.mjs";
import { generatedOpacityCSS } from "./css-opacity.mjs";
import { manifestPath, verifyMigrationCatalogue } from "./css-migration-catalogue.mjs";

export const migration = JSON.parse(readFileSync(manifestPath, "utf8"));
const generated = new Map([...transformCSS, ...generatedOpacityCSS]);
export function verifyCssMigration(output, log = console.log) {
  verifyMigrationCatalogue(migration);
  const cache = new Map();
  const routes = new Map();
  const loader = inspectRoute(output, "loader-circle-single/index.html", () => {}, cache);
  const arrow = inspectRoute(output, "single/index.html", () => {}, cache);
  for (const [name, icons] of Object.entries(migration.cases)) {
    const context = "css-migration/managed/" + name;
    const route = context + "/index.html";
    const actual = inspectRoute(output, route, () => {}, cache);
    routes.set(name, actual);
    const html = readFileSync(new URL(route, output), "utf8");
    const baseline = readFileSync(new URL("css-migration/baseline/" + name + "/index.html", output), "utf8");
    const drawings = source => [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]);
    assert.equal(drawings(html).length, icons.length, context + ": every selected drawing rendered");
    assert.deepEqual(drawings(html), drawings(baseline), context + ": initial SVG matches Motion reference");
    const selected = [...new Set(icons)];
    const sheets = selected.filter(id => generated.has(id));
    assert.deepEqual([...actual.styles].sort(), [...arrow.styles, ...sheets.map(id => generated.get(id))].sort(), context + ": exact generated CSS selection and deduplication");
    for (const id of sheets) {
      const marker = "data-grave-cycle-style";
      const matches = [...html.matchAll(/<style\b([^>]*)>/g)].filter(([, attributes]) => attributes.includes(marker + '="' + id + '"'));
      assert.equal(matches.length, 1, context + ": one active sheet marker for " + id);
    }
    assert.equal(actual.entries.length, selected.length, context + ": selective script entries");
    assert.equal(actual.inline.length, 0, context + ": no fixture scripts in consumer payload");
    const tags = new Set([...actual.source.matchAll(/["'`](grave-[a-z0-9]+(?:-[a-z0-9]+)*)["'`]/g)].map(match => match[1]));
    assert.deepEqual(tags, new Set(selected.map(id => "grave-" + id)), context + ": selective registrations");
    assert.ok(!/react(?:-dom)?|react\/jsx-runtime|reference-/.test(actual.source), context + ": fixture references excluded");
    if (selected.length && selected.every(id => generated.has(id))) assert.ok([...actual.chunks.values()].reduce((sum, chunk) => sum + chunk.bytes, 0) < 20000, context + ": CSS-only JS excludes Motion");
  }
  const singles = new Map([...migration.icons.map(icon => [icon.slug, routes.get(icon.slug)]), ["loader-circle", loader], ["arrow-left", arrow]]);
  for (const [name, icons] of Object.entries(migration.cases)) {
    const expected = new Set(icons.flatMap(id => [...singles.get(id).chunks.keys()]));
    assert.deepEqual(new Set(routes.get(name).chunks.keys()), expected, name + ": exact single-route chunk union");
  }
  for (const icon of migration.icons) {
    const html = readFileSync(new URL(icon.comparison + "/index.html", output), "utf8");
    assert.ok(html.includes('data-kind="' + icon.slug + '"'), icon.slug + ": comparison fixture coverage");
  }
  log(`Verified ${migration.icons.length} migrated recipes across ${routes.size} integrated compositions, including unused barrel imports and repeated mixed families.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) verifyCssMigration(new URL("../tests/fixtures/astro/dist/", import.meta.url));
