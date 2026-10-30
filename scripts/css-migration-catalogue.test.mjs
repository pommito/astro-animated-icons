import assert from "node:assert/strict";
import test from "node:test";
import { migrationCatalogue } from "./css-migration-catalogue.mjs";

test("the six supported finite recipes have one complete comparison family", () => {
  const catalogue = migrationCatalogue();
  const slugs = ["disc-3", "panel-left-close", "panel-left-open", "panel-right-open", "briefcase-business", "tree-pine"];
  assert.deepEqual(catalogue.cases["supported-six"], slugs);
  for (const slug of slugs) {
    const icon = catalogue.icons.find(icon => icon.slug === slug);
    assert.equal(icon.comparison, "supported-six");
    assert.equal(icon.finish, "hold");
    assert.equal(icon.replay, "current");
  }
});

test("production paint recipes have complete comparison coverage", () => {
  const catalogue=migrationCatalogue();
  const paint=catalogue.icons.filter(icon=>icon.engine==="runtime-path-paint");
  assert.equal(paint.length,88);
  assert.ok(paint.every(icon=>icon.comparison==="path-paint"));
  assert.equal(catalogue.icons.some(icon=>icon.slug==="wind-arrow-down"),false);
});
