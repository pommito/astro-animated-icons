import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { inspectRoute } from "./inspect-bundle.mjs";
import { pilotCases } from "./measure-css-pilot.mjs";
import { evaluateTypeScriptData } from "./typescript-data.mjs";

const source = new URL("../packages/animated-icons/src/", import.meta.url);
const load = path => evaluateTypeScriptData(readFileSync(new URL(path, source), "utf8"));
const [{ cycleCSS }, { bellCycle }, { chevronRightCycle }] = await Promise.all([
  load("shared/cycle-css.ts"), load("icons/bell/cycle.ts"), load("icons/chevron-right/cycle.ts"),
]);
const generated = new Map([bellCycle, chevronRightCycle].map(cycle => [cycle.id, cycleCSS(cycle)]));

const expected = {
  bell: ["bell"], chevron: ["chevron-right"], loader: [],
  pair: ["bell", "chevron-right"], three: ["bell", "chevron-right"],
  repeated: ["bell"], mixed: ["bell"],
};

export function verifyCssPilot(output, log = console.log) {
  const read = (mode, name) => inspectRoute(output, "css-pilot/" + mode + "/" + name + "/index.html", () => {}, new Map());
  const routes = new Map();
  for (const name of pilotCases) {
    const route = read("managed", name);
    const original = read("baseline", name);
    const context = "managed/" + name;
    routes.set(name, route);
    const html = mode => readFileSync(new URL("css-pilot/" + mode + "/" + name + "/index.html", output), "utf8");
    const drawings = source => [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]);
    assert.deepEqual(drawings(html("managed")), drawings(html("baseline")), context + ": initial SVG matches the current implementation");
    assert.ok(route.css.includes("[data-grave-icon]"), context + ": shared CSS");
    for (const kind of ["bell", "chevron-right", "loader"]) {
      assert.equal(route.css.includes("@keyframes grave-cycle-" + kind), expected[name].includes(kind), context + ": only rendered icon CSS, " + kind);
    }
    for (const kind of expected[name]) assert.ok(route.css.includes(generated.get(kind)), context + ": CSS matches the shared recipe, " + kind);
    assert.equal(route.styles.length, 1 + expected[name].length, context + ": styles emitted once per rendered kind");
    assert.equal(route.inline.length, 0, context + ": no inline scripts");
    assert.equal(route.entries.length, name === "repeated" ? 1 : name === "three" ? 3 : ["pair", "mixed"].includes(name) ? 2 : 1, context + ": script entries");
    for (const kind of expected[name]) assert.ok(route.source.includes("grave-" + kind), context + ": CSS registration for " + kind);
    if (["bell", "chevron", "pair", "repeated"].includes(name)) {
      assert.ok([...route.chunks.values()].reduce((sum, chunk) => sum + chunk.bytes, 0) < 8000, context + ": managed JS budget excludes Motion");
    }
    assert.ok(!/react(?:-dom)?|react\/jsx-runtime/.test(route.source), context + ": no React");
    if (name === "loader") {
      assert.deepEqual(new Set(route.chunks.keys()), new Set(original.chunks.keys()), context + ": LoaderCircle stays on Motion");
      assert.equal(route.css, original.css, context + ": LoaderCircle has no experimental CSS");
    }
  }
  const bell = routes.get("bell");
  const repeated = routes.get("repeated");
  assert.equal(repeated.css, bell.css, "repeated: styles are deduplicated");
  assert.deepEqual(new Set(repeated.chunks.keys()), new Set(bell.chunks.keys()), "repeated: scripts are deduplicated");
  const arrow = inspectRoute(output, "single/index.html", () => {}, new Map());
  for (const [name, individual] of [["pair", [bell, routes.get("chevron")]], ["three", [bell, routes.get("chevron"), routes.get("loader")]], ["mixed", [bell, arrow]]]) {
    const union = new Set(individual.flatMap(route => [...route.chunks.keys()]));
    assert.deepEqual(new Set(routes.get(name).chunks.keys()), union, name + ": combined chunks equal the single-route union");
  }
  log("Verified 7 CSS parity routes: SVG parity, selective generated CSS, resource reuse, combined chunk unions, managed budget, and unchanged Motion loader.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) verifyCssPilot(new URL("../tests/fixtures/astro/dist/", import.meta.url));
