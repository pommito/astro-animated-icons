import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";
import { verifyCssCapabilities } from "./check-css-capabilities.mjs";
const directory = mkdtempSync(join(tmpdir(), "css-capabilities-"));
const output = pathToFileURL(directory + "/");
cpSync(new URL("../tests/fixtures/astro/dist/", import.meta.url), directory, { recursive: true });
after(() => rmSync(directory, { recursive: true, force: true }));
function change(name, transform, expected) {
  const path = new URL(`css-capabilities/managed/${name}/index.html`, output);
  const original = readFileSync(path, "utf8");
  try { writeFileSync(path, transform(original)); assert.throws(() => verifyCssCapabilities(output, () => {}), expected); }
  finally { writeFileSync(path, original); }
}
test("capabilities preserve drawings, selected styles and exact chunk unions", () => verifyCssCapabilities(output, () => {}));
test("opacity delay drift is rejected", () => change("calendar-days", html => html.replace("animation-delay:0.1s", "animation-delay:0.2s"), /exact generated CSS selection/));
test("opacity return easing drift is rejected", () => change("circle-dashed", html => html.replaceAll("cubic-bezier(0.25,0.1,0.35,1)", "linear"), /exact generated CSS selection/));
test("group rotation drift is rejected", () => change("circle-help", html => html.replace("rotate(-10deg)", "rotate(-20deg)"), /exact generated CSS selection/));
test("an unmarked capability sheet is rejected", () => change("calendar-days", html => html.replace('data-grave-cycle-style="calendar-days"', ''), /one active sheet marker for calendar-days/));
