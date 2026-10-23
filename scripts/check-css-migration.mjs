import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { createCSSRouteVerifier, verifyChunkUnion } from "./css-route-contract.mjs";
import { manifestPath, verifyMigrationCatalogue } from "./css-migration-catalogue.mjs";

export const migration = JSON.parse(readFileSync(manifestPath, "utf8"));
export function verifyCssMigration(output, log = console.log) {
  verifyMigrationCatalogue(migration);
  const verifier = createCSSRouteVerifier(output, 20000);
  const routes = new Map();
  const loader = verifier.read("loader-circle-single/index.html");
  const arrow = verifier.read("single/index.html");
  for (const [name, icons] of Object.entries(migration.cases)) {
    routes.set(name, verifier.verify(`css-migration/managed/${name}/index.html`, `css-migration/baseline/${name}/index.html`, icons));
  }
  const singles = new Map([...migration.icons.map(icon => [icon.slug, routes.get(icon.slug)]), ["loader-circle", loader], ["arrow-left", arrow]]);
  for (const [name, icons] of Object.entries(migration.cases)) {
    verifyChunkUnion(name, routes.get(name), icons.map(id => singles.get(id)));
  }
  for (const icon of migration.icons) {
    const html = readFileSync(new URL(icon.comparison + "/index.html", output), "utf8");
    assert.ok(html.includes('data-kind="' + icon.slug + '"'), icon.slug + ": comparison fixture coverage");
  }
  log(`Verified ${migration.icons.length} migrated recipes across ${routes.size} integrated compositions, including unused barrel imports and repeated mixed families.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) verifyCssMigration(new URL("../tests/fixtures/astro/dist/", import.meta.url));
