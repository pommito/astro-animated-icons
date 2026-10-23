import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { readCatalog } from "./catalog.mjs";
import { inventoryAnimations, readModule } from "./inventory-animations.mjs";

test("inventory covers each export once and retains shared defaults and mixed mechanisms", () => {
  const result = inventoryAnimations();
  assert.equal(result.count, readCatalog().length);
  assert.equal(new Set(result.icons.map(icon => icon.slug)).size, result.count);
  assert.equal(result.queue.flatMap(group => group.icons).length, result.count);
  const loader = result.icons.find(icon => icon.slug === "loader-circle");
  assert.equal(loader.engine, "motion");
  assert.equal(loader.classification.status, "motion");
  assert.ok(loader.sources.some(path => path.endsWith("shared/svg-parts.ts")));
  assert.ok(loader.sources.some(path => path.endsWith("shared/svg-transform.ts")));
  assert.ok(result.sources["packages/animated-icons/src/shared/svg-parts.ts"].constants.some(fact => fact.expression.includes("defaultEase")));
  assert.ok(result.sources["packages/animated-icons/src/shared/svg-transform.ts"].calls.some(fact => fact.expression.includes("previous?.velocities")));
  assert.ok(result.icons.find(icon => icon.slug === "arrow-left").classification.capability === "runtime-geometry");
  const left = result.icons.find(icon => icon.slug === "chevron-left");
  assert.equal(left.classification.status, "supported");
  if (left.engine === "motion") assert.deepEqual(left.classification.requiredCapabilities, []);
  const first = result.icons.find(icon => icon.slug === "chevron-first");
  if (first.engine === "motion") {
    assert.ok(first.classification.requiredCapabilities.includes("independent-return-timing"));
    assert.equal(first.classification.resolvedPlayback.returnDuration, 0.3);
    assert.equal(first.classification.resolvedPlayback.returnEase, "easeOut");
  }
  for (const slug of ["bell", "chevron-right"]) {
    const icon = result.icons.find(icon => icon.slug === slug);
    assert.equal(icon.engine, "css");
    assert.equal(icon.classification.status, "supported");
    assert.ok(icon.sources.some(path => path.endsWith(`/${slug}/cycle.ts`)));
    assert.ok(icon.sources.some(path => path.endsWith("/css-cycle.ts")));
    assert.ok(result.sources[`packages/animated-icons/src/icons/${slug}/cycle.ts`].constants.some(fact => fact.expression.includes("replay")));
  }
  assert.deepEqual(result, inventoryAnimations());
});

test("unresolved settings stay expressions with source lines", () => {
  const root = mkdtempSync(join(tmpdir(), "animation-evidence-"));
  try {
    writeFileSync(join(root, "sample.ts"), 'const settings = { duration: chooseDuration(), repeat: Infinity };\nconst length = path.getTotalLength();\n');
    const module = readModule(root, "sample.ts");
    assert.deepEqual(module.facts.timing, [{ line: 1, expression: "duration: chooseDuration()" }, { line: 1, expression: "repeat: Infinity" }]);
    assert.deepEqual(module.facts.measurements, [{ line: 2, expression: "path.getTotalLength()" }]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("a spring word does not classify a recipe and unknown calls require review", () => {
  const root = mkdtempSync(join(tmpdir(), "animation-unknown-"));
  try {
    const src = join(root, "packages/animated-icons/src");
    mkdirSync(join(src, "icons/example"), { recursive: true });
    writeFileSync(join(src, "astro.ts"), 'export { default as Example } from "./icons/example/Example.astro";');
    writeFileSync(join(src, "icons/example/Example.astro"), "<svg />");
    writeFileSync(join(src, "icons/example/definition.ts"), 'const spring = "a label"; export const recipe = customRecipe({ duration: unknown });');
    const icon = inventoryAnimations(root).icons[0];
    assert.equal(icon.classification.status, "review");
    assert.ok(icon.uncertainty.some(text => text.includes("not evaluated")));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
