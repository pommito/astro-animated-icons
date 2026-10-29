import assert from "node:assert/strict";
import { cycles } from "./css-cycles.mjs";
import { opacityParts } from "./css-opacity.mjs";
import { decodeAttribute, htmlElements } from "./html.mjs";

export const clientRecipes = new Map([
  ...[...cycles].map(([id, data]) => [id, { attribute: "data-grave-cycle-recipe", data }]),
  ...[...opacityParts].map(([id, parts]) => [id, { attribute: "data-grave-opacity-recipe", data: { id, parts } }]),
]);
const recipeAttributes = [...new Set([...clientRecipes.values()].map(recipe => recipe.attribute))];

export function registrationEntries(icons) {
  return new Set(icons.map(id => clientRecipes.get(id)?.attribute ?? id)).size;
}

export function verifyRegistrations(actual, html, icons, context) {
  const selected = new Set(icons);
  const literal = value => new RegExp('["\'`]' + value + '["\'`]').test(actual.source);
  const selectedAttributes = new Set([...selected].flatMap(id => clientRecipes.has(id) ? [clientRecipes.get(id).attribute] : []));
  for (const attribute of recipeAttributes) {
    const state = attribute === "data-grave-cycle-recipe" ? "data-cycle-state" : "data-opacity-state";
    if (literal(attribute) || literal(state)) assert.ok(selectedAttributes.has(attribute), context + ": unused registration mechanism " + attribute);
  }
  const staticTags = new Set([...actual.source.matchAll(/["'`](grave-[a-z0-9]+(?:-[a-z0-9]+)*)["'`]/g)].map(match => match[1]));
  const expectedStatic = new Set([...selected].filter(id => !clientRecipes.has(id)).map(id => "grave-" + id));
  for (const tag of staticTags) assert.ok(expectedStatic.has(tag), context + ": unused registration " + tag + " must not load");
  for (const tag of expectedStatic) assert.ok(staticTags.has(tag), context + ": expected registration " + tag + " is missing");
  const records = new Set();
  for (const node of htmlElements(html)) {
    const attributes = node.attributes ?? {};
    const id = node.name?.startsWith("grave-") ? node.name.slice(6) : undefined;
    const present = recipeAttributes.filter(attribute => attribute in attributes);
    if (clientRecipes.has(id) && "data-grave-icon" in attributes) {
      assert.deepEqual(present, [clientRecipes.get(id).attribute], context + ": recipe record for " + id);
    }
    for (const attribute of present) {
      assert.ok(selected.has(id) && clientRecipes.get(id)?.attribute === attribute, context + ": unused recipe record " + node.name);
      const expected = clientRecipes.get(id);
      const data = JSON.parse(decodeAttribute(attributes[attribute]));
      assert.deepEqual(data, expected.data, context + ": serialized recipe matches " + id);
      assert.ok(literal(attribute), context + ": registration bootstrap for " + id);
      records.add(id);
    }
  }
  assert.deepEqual(records, new Set([...selected].filter(id => clientRecipes.has(id))), context + ": selected recipe records");
}
