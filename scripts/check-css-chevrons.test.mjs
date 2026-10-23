import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";
import { verifyCssChevrons } from "./check-css-chevrons.mjs";

const directory = mkdtempSync(join(tmpdir(), "css-chevrons-"));
const output = pathToFileURL(directory + "/");
cpSync(new URL("../tests/fixtures/astro/dist/", import.meta.url), directory, { recursive: true });
after(() => rmSync(directory, { recursive: true, force: true }));
function change(name, transform, expected) {
  const path = new URL(`css-chevrons/managed/${name}/index.html`, output);
  const original = readFileSync(path, "utf8");
  try { writeFileSync(path, transform(original)); assert.throws(() => verifyCssChevrons(output, () => {}), expected); }
  finally { writeFileSync(path, original); }
}
test("finite chevrons satisfy drawing and loading contracts", () => verifyCssChevrons(output, () => {}));
test("vertical transform drift is rejected", () => change("chevron-up", html => html.replace("translateY(-2px)", "translateX(-2px)"), /exact generated CSS selection/));
test("independent return duration drift is rejected", () => change("chevron-first", html => html.replace("animation-duration:0.3s", "animation-duration:0.6s"), /exact generated CSS selection/));
test("unrendered chevron CSS is rejected", () => change("chevron-left", html => html + '<style>@keyframes grave-cycle-chevron-up-entry{to{transform:none}}</style>', /exact generated CSS selection/));
test("repeated cycle styles are rejected", () => change("repeated", html => html + html.match(/<style[^>]*>@keyframes grave-cycle[\s\S]*?<\/style>/)[0], /exact generated CSS selection and deduplication/));
test("an unmarked chevron sheet is rejected", () => change("chevron-down", html => html.replace('data-grave-cycle-style="chevron-down"', ''), /one active sheet marker for chevron-down/));
