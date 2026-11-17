import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { after, test } from "node:test";
import { buildProof } from "../experiments/css-client/build.mjs";
import { verifyPreparedRecords } from "../experiments/css-client/records.mjs";
import { inspectRoute } from "./inspect-bundle.mjs";

const directory = realpathSync(mkdtempSync(join(tmpdir(), "icons-prepared-css-")));
mkdirSync(join(directory, "src/pages"), { recursive: true });
symlinkSync(fileURLToPath(new URL("../tests/fixtures/astro/node_modules", import.meta.url)), join(directory, "node_modules"), "dir");
writeFileSync(join(directory, "package.json"), '{"private":true,"type":"module"}');
writeFileSync(join(directory, "src/pages/index.astro"), '---\nimport { Bell, KeyCircle, CircleDashed, EyeOff } from "@grave/animated-icons/astro";\n---\n<Bell /><KeyCircle /><CircleDashed /><EyeOff />');
after(() => rmSync(directory, { recursive: true, force: true }));

for (const transport of ["attribute", "template"]) {
  test(transport + " proof delivers prepared CSS without browser compilers or Bezier sampling", async () => {
    const output = join(directory, transport + "-dist");
    const evidence = await buildProof(directory, transport, output);
    const metadata = JSON.parse(readFileSync(evidence, "utf8"));
    const route = inspectRoute(pathToFileURL(output + "/"), "index.html", () => {}, new Map());
    const modules = [...route.chunks.keys()].flatMap(url => metadata[url].modules.map(module => module.id));
    assert.ok(!modules.some(id => /\/(?:cycle-css|combined-cycle-css|transform-css|combined-transform-(?:cycle|css)|opacity-css|paint-css)\.ts$/.test(id)), modules.join("\n"));
    const html = readFileSync(join(output, "index.html"), "utf8");
    assert.equal((html.match(/<svg\b/g) ?? []).length, 4);
    verifyPreparedRecords(transport, route, html, ["bell", "key-circle", "circle-dashed", "eye-off"], transport + " proof");
  });
}
