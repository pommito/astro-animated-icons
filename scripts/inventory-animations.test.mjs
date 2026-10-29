import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { readCatalog } from "./catalog.mjs";
import { inventoryAnimations, readModule } from "./inventory-animations.mjs";

test("reviewed family queue partitions the current catalogue without unresolved decisions", () => {
  const result = inventoryAnimations(undefined, { requireReviewed: true });
  assert.equal(result.reviewedCount, 470);
  assert.equal(result.icons.filter(icon => icon.migrationState === "needs-review").length, 0);
  const members = result.familyQueue.flatMap(family => family.icons);
  assert.equal(members.length, 470);
  assert.equal(new Set(members).size, 470);
  for (const icon of result.icons) {
    assert.ok(icon.classification.sourceHash);
    assert.ok(icon.classification.contract);
    assert.ok(icon.sources.includes(icon.adapter));
  }
});

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
  assert.equal(result.icons.find(icon => icon.slug === "arrow-left").classification.capability, "runtime-path-paint-and-transforms");
  const left = result.icons.find(icon => icon.slug === "chevron-left");
  assert.equal(left.classification.status, "supported");
  if (left.engine === "motion") assert.deepEqual(left.classification.requiredCapabilities, []);
  const first = result.icons.find(icon => icon.slug === "chevron-first");
  if (first.engine === "motion") {
    assert.ok(first.classification.requiredCapabilities.includes("independent-return-timing"));
    assert.equal(first.classification.resolvedPlayback.returnDuration, 0.3);
    assert.equal(first.classification.resolvedPlayback.returnEase, "easeOut");
  }
  for (const slug of ["bell", "chevron-right", "user-round-cog"]) {
    const icon = result.icons.find(icon => icon.slug === slug);
    assert.equal(icon.engine, "css");
    assert.equal(icon.classification.status, "supported");
    assert.ok(icon.sources.some(path => path.endsWith(`/${slug}/cycle.ts`)));
    assert.ok(icon.sources.some(path => path.endsWith("/css-cycle.ts")));
    assert.ok(icon.sources.some(path => path.endsWith("/register-css-cycle.ts")));
    assert.ok(!icon.runtimeSources.some(path => path.endsWith(`/icons/${slug}/element.ts`)));
    assert.ok(result.sources[`packages/animated-icons/src/icons/${slug}/cycle.ts`].constants.some(fact => fact.expression.includes("replay")));
  }
  const finiteChevrons = result.icons.filter(icon => icon.slug.includes("chevron") && icon.sources.some(path => path.endsWith("/cycle.ts")));
  assert.equal(finiteChevrons.length, 13);
  assert.ok(finiteChevrons.every(icon => icon.engine === "css" && icon.classification.status === "supported"));
  const springs = result.icons.filter(icon => icon.sources.some(path => path.endsWith("/chevron-spring.ts")));
  assert.equal(springs.length, 4);
  assert.ok(springs.every(icon => icon.engine === "motion" && icon.classification.capability === "inherited-velocity"));
  for (const slug of ["folder-down", "folder-up", "folder-input", "folder-output", "circle-help", "calendar-days", "circle-dashed"]) {
    const icon = result.icons.find(icon => icon.slug === slug);
    assert.equal(icon.engine, "css");
    assert.equal(icon.migrationState, "migrated");
    assert.equal(icon.classification.capability, ["calendar-days", "circle-dashed"].includes(slug) ? "timed-opacity-parts" : "finite-transform-cycle");
  }
  assert.equal(result.icons.find(icon => icon.slug === "user-round-cog").migrationState, "migrated");
  assert.equal(result.icons.find(icon => icon.slug === "wifi-sync").migrationState, "retained-on-motion");
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


test("reviewed source drift cannot retain its recorded classification", () => {
  const root = mkdtempSync(join(tmpdir(), "animation-reviewed-drift-"));
  try {
    const src = join(root, "packages/animated-icons/src");
    mkdirSync(join(src, "icons/wifi-sync"), { recursive: true });
    writeFileSync(join(src, "astro.ts"), 'export { default as WifiSync } from "./icons/wifi-sync/WifiSync.astro";');
    writeFileSync(join(src, "icons/wifi-sync/WifiSync.astro"), "<svg />");
    writeFileSync(join(src, "icons/wifi-sync/definition.ts"), 'export const recipe = changedRecipe({ duration: unknown });');
    const icon = inventoryAnimations(root).icons[0];
    assert.equal(icon.classification.status, "review");
    assert.equal(icon.classification.capability, "changed-reviewed-source");
    assert.equal(icon.migrationState, "needs-review");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

function withReviewedCopy(run) {
  const root = mkdtempSync(join(tmpdir(), "animation-reviewed-"));
  try {
    cpSync(new URL("../packages/animated-icons/src", import.meta.url), join(root, "packages/animated-icons/src"), { recursive: true });
    mkdirSync(join(root, "scripts"));
    for (const file of ["animation-decisions.json", "animation-families.json"]) cpSync(new URL(file, import.meta.url), join(root, "scripts", file));
    cpSync(new URL("../pnpm-lock.yaml", import.meta.url), join(root, "pnpm-lock.yaml"));
    run(root);
  } finally { rmSync(root, { recursive: true, force: true }); }
}

test("adapter, lifecycle, lock and family drift invalidate reviewed CSS as well as Motion", () => {
  withReviewedCopy(root => {
    for (const file of [
      "packages/animated-icons/src/icons/bell/Bell.astro",
      "packages/animated-icons/src/icons/bell/Drawing.astro",
      "packages/animated-icons/src/shared/combined-transform-cycle.ts",
      "packages/animated-icons/src/element.ts",
      "pnpm-lock.yaml",
    ]) {
      const path = join(root, file);
      const before = readFileSync(path, "utf8");
      writeFileSync(path, before + "\n");
      assert.equal(inventoryAnimations(root).icons.find(icon => icon.slug === "bell").migrationState, "needs-review", file);
      assert.throws(() => inventoryAnimations(root, { requireReviewed: true }), /stale source reviews/);
      writeFileSync(path, before);
    }
    const path = join(root, "scripts/animation-families.json");
    const families = JSON.parse(readFileSync(path, "utf8"));
    families["css-finite-cycle"].contract.playback = "Changed replay contract";
    writeFileSync(path, JSON.stringify(families));
    assert.equal(inventoryAnimations(root).icons.find(icon => icon.slug === "bell").classification.capability, "changed-reviewed-source");
  });
});

test("strict review rejects missing exports, orphan records and incomplete contracts", () => {
  withReviewedCopy(root => {
    const path = join(root, "scripts/animation-decisions.json");
    const original = readFileSync(path, "utf8");
    const records = JSON.parse(original);
    delete records.bell;
    writeFileSync(path, JSON.stringify(records));
    assert.throws(() => inventoryAnimations(root, { requireReviewed: true }), /stale source reviews.*bell/);
    const orphan = JSON.parse(original);
    orphan.removed = orphan.bell;
    writeFileSync(path, JSON.stringify(orphan));
    assert.throws(() => inventoryAnimations(root, { requireReviewed: true }), /Orphan reviewed export: removed/);
    const incomplete = JSON.parse(original);
    incomplete.bell.contract = { review: "" };
    writeFileSync(path, JSON.stringify(incomplete));
    assert.throws(() => inventoryAnimations(root, { requireReviewed: true }), /bell: missing recipe contract/);
    const unknown = JSON.parse(original);
    unknown.bell.family = "missing-family";
    writeFileSync(path, JSON.stringify(unknown));
    assert.throws(() => inventoryAnimations(root), /bell: unknown reviewed family/);
    const overridden = JSON.parse(original);
    overridden["loader-circle"].status = "supported";
    writeFileSync(path, JSON.stringify(overridden));
    assert.throws(() => inventoryAnimations(root), /loader-circle: unexpected decision field/);
    writeFileSync(path, original);
    const familyPath = join(root, "scripts/animation-families.json");
    const families = JSON.parse(readFileSync(familyPath, "utf8"));
    families["css-finite-cycle"].contract = {};
    writeFileSync(familyPath, JSON.stringify(families));
    assert.throws(() => inventoryAnimations(root), /incomplete family review/);
  });
});

test("a migrated finite group loses review when its CSS mechanism changes", () => {
  withReviewedCopy(root => {
    const path = join(root, "packages/animated-icons/src/shared/css-cycle.ts");
    writeFileSync(path, readFileSync(path, "utf8") + "\n");
    const icon = inventoryAnimations(root).icons.find(icon => icon.slug === "disc-3");
    assert.equal(icon.engine, "css");
    assert.equal(icon.migrationState, "needs-review");
  });
});

test("CSS wiring cannot upgrade a reviewed capability requirement", () => {
  withReviewedCopy(root => {
    const path = join(root, "scripts/animation-decisions.json");
    const records = JSON.parse(readFileSync(path, "utf8"));
    const families = JSON.parse(readFileSync(join(root, "scripts/animation-families.json"), "utf8"));
    records.bell.family = "parts-finite-paint";
    records.bell.familyHash = createHash("sha256").update(JSON.stringify(families["parts-finite-paint"])).digest("hex");
    writeFileSync(path, JSON.stringify(records));
    const icon = inventoryAnimations(root).icons.find(icon => icon.slug === "bell");
    assert.equal(icon.engine, "css");
    assert.equal(icon.migrationState, "capability-needed");
  });
});

test("unused geometry does not place ChartScatter in the measured-paint family", () => {
  const icon = inventoryAnimations().icons.find(icon => icon.slug === "chart-scatter");
  assert.equal(icon.classification.capability, "opacity-restart-easing-and-completion");
  assert.equal(icon.migrationState, "capability-needed");
  assert.ok(icon.sources.some(path => path.endsWith("/staggered-cycle.ts")));
});

test("direct morphs keep their full-options family apart from SVG-part morphs", () => {
  const result = inventoryAnimations();
  const family = result.familyQueue.find(group => group.family === "direct-path-morph");
  assert.deepEqual(family.icons, ["connect", "rocket"]);
  assert.deepEqual(result.familyQueue.find(group => group.family === "parts-morph").icons, ["accessibility", "frown", "smile"]);
});

test("the complete supported six-icon batch has current migrated decisions", () => {
  const inventory = inventoryAnimations(undefined, { requireReviewed: true });
  for (const slug of ["disc-3", "panel-left-close", "panel-left-open", "panel-right-open", "briefcase-business", "tree-pine"]) {
    const icon = inventory.icons.find(icon => icon.slug === slug);
    assert.equal(icon.engine, "css");
    assert.equal(icon.migrationState, "migrated");
    assert.ok(icon.runtimeSources.some(path => path.endsWith("/register-css-cycle.ts")));
    assert.ok(!icon.runtimeSources.some(path => path.endsWith("/svg-parts.ts") || path.endsWith("/group-transform.ts")));
  }
});
