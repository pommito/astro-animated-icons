import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { inventoryAnimations } from "./inventory-animations.mjs";
import { cycles } from "./css-cycles.mjs";
import { supportedSix } from "./page-loading-cases.mjs";
import { opacityParts } from "./css-opacity.mjs";
import { paintRecipes } from "./css-paint.mjs";

export const manifestPath = new URL("../tests/helpers/css-migration-cases.json", import.meta.url);
export function migrationCatalogue() {
  const icons = inventoryAnimations().icons.filter(icon => icon.engine === "css").map(icon => {
    const cycle = cycles.get(icon.slug);
    const parts = opacityParts.get(icon.slug);
    const paint = paintRecipes.get(icon.slug);
    assert.equal([cycle,parts,paint].filter(Boolean).length,1,icon.slug + ": exactly one compiler data source");
    if(paint)return {slug:icon.slug,name:icon.name,engine:"runtime-path-paint",finish:paint.finish,replay:paint.replay,comparison:"path-paint"};
    return { slug: icon.slug, name: icon.name, engine: cycle ? "finite-transform-cycle" : "timed-opacity-parts", finish: cycle?.finish ?? "hold", replay: cycle?.replay ?? "current-per-active-part", comparison: supportedSix.includes(icon.slug) ? "supported-six" : cycle?.tracks ? "combined-transforms" : icon.slug === "folder" ? "folder-css" : icon.slug === "bell" ? "css-pilot" : icon.slug.includes("chevron") ? "css-chevrons" : "css-capabilities" };
  });
  assert.deepEqual(new Set(icons.map(icon => icon.slug)), new Set([...cycles.keys(), ...opacityParts.keys(), ...paintRecipes.keys()]), "Compiler data matches migrated catalogue");
  const all = icons.map(icon => icon.slug);
  const selected = ["bell", "chevron-right", "folder-down", "calendar-days"];
  const cases = Object.fromEntries([
    ...all.map(slug => [slug, [slug]]),
    ["supported-six", supportedSix],
    ["path-paint",[...paintRecipes.keys()]],
    ["chevrons", all.filter(slug => slug.includes("chevron"))],
    ["folders", all.filter(slug => slug === "folder" || slug.startsWith("folder-"))],
    ["opacity", icons.filter(icon => icon.engine === "timed-opacity-parts").map(icon => icon.slug)],
    ["all", all], ["repeated", all.flatMap(slug => [slug, slug, slug])],
    ["mixed-loader", [...all, "loader-circle"]], ["mixed-arrow", [...all, "arrow-left"]],
    ["interface", selected], ["interface-loader", [...selected, "loader-circle"]], ["unused", []],
  ]);
  return { schemaVersion: 1, icons, cases };
}
export function verifyMigrationCatalogue(manifest = JSON.parse(readFileSync(manifestPath, "utf8"))) {
  assert.deepEqual(manifest, migrationCatalogue(), "Migration fixture catalogue must match current recipes; run node scripts/css-migration-catalogue.mjs --write");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--write")) writeFileSync(manifestPath, JSON.stringify(migrationCatalogue(), null, 2) + "\n");
  else verifyMigrationCatalogue();
}
