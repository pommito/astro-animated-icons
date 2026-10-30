import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { inspectRoute } from "./inspect-bundle.mjs";
import { generatedCSS as transformCSS } from "./css-cycles.mjs";
import { generatedOpacityCSS } from "./css-opacity.mjs";
import { generatedPaintCSS } from "./css-paint.mjs";
import { registrationEntries, verifyRegistrations } from "./registration-contract.mjs";

const generatedCSS = new Map([...transformCSS, ...generatedOpacityCSS, ...generatedPaintCSS]);

export function createCSSRouteVerifier(output, javascriptBudget) {
  const cache = new Map();
  const read = route => inspectRoute(output, route, () => {}, cache);
  const sharedStyles = read("single/index.html").styles;
  assert.ok(sharedStyles.join("\n").includes("[data-grave-icon]"), "single: shared wrapper CSS is missing");
  return {
    read,
    verify(route, baselineRoute, icons) {
      const context = route.replace(/\/index\.html$/, "");
      const actual = read(route);
      const html = readFileSync(new URL(route, output), "utf8");
      const baseline = readFileSync(new URL(baselineRoute, output), "utf8");
      const drawings = source => [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]);
      assert.equal(drawings(html).length, icons.length, context + ": every selected drawing rendered");
      assert.deepEqual(drawings(html), drawings(baseline), context + ": initial SVG matches Motion reference");
      const selected = [...new Set(icons)];
      const sheets = selected.filter(id => generatedCSS.has(id));
      assert.deepEqual([...actual.styles].sort(), [...sharedStyles, ...sheets.map(id => generatedCSS.get(id))].sort(), context + ": exact generated CSS selection and deduplication");
      for (const id of sheets) {
        const matches = [...html.matchAll(/<style\b([^>]*)>/g)].filter(([, attributes]) => attributes.includes('data-grave-cycle-style="' + id + '"'));
        assert.equal(matches.length, 1, context + ": one active sheet marker for " + id);
      }
      assert.equal(actual.entries.length, registrationEntries(selected), context + ": selective script entries");
      assert.equal(actual.inline.length, 0, context + ": no fixture scripts in consumer payload");
      verifyRegistrations(actual, html, selected, context);
      assert.ok(!/react(?:-dom)?|react\/jsx-runtime|reference-/.test(actual.source), context + ": fixture references excluded");
      if (selected.length && selected.every(id => generatedCSS.has(id))) {
        assert.ok([...actual.chunks.values()].reduce((sum, chunk) => sum + chunk.bytes, 0) < javascriptBudget, context + ": CSS-only JS budget excludes Motion");
      }
      return actual;
    },
  };
}

export function verifyChunkUnion(context, actual, individual) {
  const expected = new Set(individual.flatMap(route => [...route.chunks.keys()]));
  assert.deepEqual(new Set(actual.chunks.keys()), expected, context + ": exact single-route chunk union");
}
