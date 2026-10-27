import assert from "node:assert/strict";
import { test } from "node:test";
import { clientRecipes, registrationEntries, verifyRegistrations } from "./registration-contract.mjs";
import { evaluateTypeScriptData } from "./typescript-data.mjs";
import { readFileSync } from "node:fs";

const { serializeRecipe } = await evaluateTypeScriptData(readFileSync(new URL("../packages/animated-icons/src/shared/recipe-data.ts", import.meta.url), "utf8"));
const record = (id, data = clientRecipes.get(id).data) => '<grave-' + id + ' data-grave-icon ' + clientRecipes.get(id).attribute
  + '="' + serializeRecipe(data).replaceAll('"', "&quot;") + '"></grave-' + id + '>';
const actual = { source: '"data-grave-cycle-recipe";"data-grave-opacity-recipe";"grave-loader-circle";' };
const html = record("bell") + record("circle-dashed") + record("bell");
const selected = ["bell", "circle-dashed", "loader-circle"];

test("CSS registration uses selected engine entries and exact per-instance source data", () => {
  verifyRegistrations(actual, html, selected, "mixed");
  assert.equal(registrationEntries(["bell", "chevron-right", "bell"]), 1);
  assert.equal(registrationEntries(selected), 3);
  assert.equal(registrationEntries([]), 0);
});

test("missing, changed and mismatched recipe records are rejected", () => {
  assert.throws(() => verifyRegistrations(actual, html.replace("data-grave-cycle-recipe=", "removed="), selected, "mixed"), /recipe record for bell/);
  const wrong = record("bell", { ...clientRecipes.get("bell").data, duration: 0.7 }) + record("circle-dashed");
  assert.throws(() => verifyRegistrations(actual, wrong, selected, "mixed"), /serialized recipe matches bell/);
  assert.throws(() => verifyRegistrations(actual, html.replace("data-grave-cycle-recipe=", "data-grave-opacity-recipe="), selected, "mixed"), /recipe record for bell/);
});

test("unused recipe data and missing engine bootstraps are rejected", () => {
  assert.throws(() => verifyRegistrations(actual, html + record("chevron-right"), selected, "mixed"), /unused recipe record grave-chevron-right/);
  assert.throws(() => verifyRegistrations({ source: actual.source.replace("data-grave-opacity-recipe", "missing") }, html, selected, "mixed"), /registration bootstrap for circle-dashed/);
  assert.throws(() => verifyRegistrations({ source: actual.source + '"grave-bell";' }, html, selected, "mixed"), /unused registration grave-bell/);
});

test("an unused CSS bootstrap or adapter cannot hide in a selected script graph", () => {
  const cycle = { source: '"data-grave-cycle-recipe";' };
  for (const marker of ["data-grave-opacity-recipe", "data-opacity-state"]) {
    assert.throws(() => verifyRegistrations({ source: cycle.source + '"' + marker + '";' }, record("bell"), ["bell"], "single"), /unused registration mechanism data-grave-opacity-recipe/);
  }
});

test("serialized recipe attributes preserve angle brackets and escaped selectors", () => {
  const data = { target: 'g > g[data-title="<test>"]' };
  const serialized = serializeRecipe(data);
  assert.ok(!/[<>]/.test(serialized));
  assert.deepEqual(JSON.parse(serialized), data);
  verifyRegistrations({ source: '"data-grave-cycle-recipe";' }, record("circle-help"), ["circle-help"], "group");
});
