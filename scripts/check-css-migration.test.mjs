import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";
import { migration, verifyCssMigration } from "./check-css-migration.mjs";
import { verifyMigrationCatalogue } from "./css-migration-catalogue.mjs";
const directory = mkdtempSync(join(tmpdir(), "css-migration-"));
const output = pathToFileURL(directory + "/");
cpSync(new URL("../tests/fixtures/astro/dist/", import.meta.url), directory, { recursive: true });
after(() => rmSync(directory, { recursive: true, force: true }));
function change(name, transform, expected) {
  const path = new URL(`css-migration/managed/${name}/index.html`, output);
  const original = readFileSync(path, "utf8");
  try { writeFileSync(path, transform(original)); assert.throws(() => verifyCssMigration(output, () => {}), expected); }
  finally { writeFileSync(path, original); }
}
test("integrated migration matches current recipes and exact resource unions", () => verifyCssMigration(output, () => {}));
test("a migrated recipe omitted from fixtures is rejected", () => {
  const incomplete = structuredClone(migration);
  incomplete.icons.pop();
  assert.throws(() => verifyMigrationCatalogue(incomplete), /Migration fixture catalogue must match/);
});
test("an unmarked transform sheet is rejected", () => change("bell", html => html.replace('data-grave-cycle-style="bell"', ''), /one active sheet marker for bell/));
test("an unmarked opacity sheet is rejected", () => change("calendar-days", html => html.replace('data-grave-cycle-style="calendar-days"', ''), /one active sheet marker for calendar-days/));
test("a paint sheet cannot change the signed offset or lose its marker", () => {
  change("eye-off", html => html.replace('data-grave-cycle-style="eye-off"', ''), /one active sheet marker for eye-off/);
  change("eye-off", html => html.replace('var(--grave-paint-length) * -2', 'var(--grave-paint-length) * 2'), /exact generated CSS selection/);
});
test("a repeated cross-family stylesheet is rejected", () => change("repeated", html => html + html.match(/<style[^>]*data-grave-cycle-style="calendar-days"[^>]*>[\s\S]*?<\/style>/)[0], /exact generated CSS selection and deduplication/));
test("an unused barrel import cannot emit styles", () => change("unused", html => html + '<style>@keyframes grave-cycle-bell-entry{to{transform:none}}</style>', /exact generated CSS selection/));
test("an empty route cannot hide a missing selected drawing", () => change("folder-down", html => html.replace(/<svg\b[\s\S]*?<\/svg>/, ''), /every selected drawing rendered/));
test("equal-content chunks at different URLs violate the combined union", () => {
  const path = new URL("css-migration/managed/all/index.html", output);
  const html = readFileSync(path, "utf8");
  const entry = html.match(/<script[^>]*src="([^"]+)"/)[1];
  const alias = new URL("migration-alias.js", new URL(entry.slice(1), output));
  writeFileSync(alias, readFileSync(new URL(entry.slice(1), output)));
  try { change("all", source => source.replace(entry, new URL(alias).pathname.split(directory)[1]), /all: exact single-route chunk union/); }
  finally { rmSync(alias); }
});
