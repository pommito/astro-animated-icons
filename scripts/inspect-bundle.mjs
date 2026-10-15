import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const output = new URL("../apps/playground/dist/", import.meta.url);
for (const route of ["plain/index.html", "single/index.html", "index.html"]) {
  const html = readFileSync(new URL(route, output), "utf8");
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  const modules = scripts.flatMap(([, attributes]) => [...attributes.matchAll(/\bsrc="([^"]+)"/g)].map((match) => match[1]));
  const chunks = [...new Set(modules)];
  const inline = scripts.filter(([, attributes]) => !/\bsrc=/.test(attributes)).map(([, , source]) => source);
  const bytes = chunks.reduce((sum, path) => sum + readFileSync(new URL(path.slice(1), output)).byteLength, 0);
  const gzip = chunks.reduce((sum, path) => sum + gzipSync(readFileSync(new URL(path.slice(1), output))).byteLength, 0);
  if (route.startsWith("plain/")) {
    assert.equal(chunks.length, 0);
    assert.equal(inline.length, 0);
  }
  if (route.startsWith("single/")) {
    assert.equal(chunks.length, 1);
    assert.equal(inline.length, 0);
  }
  console.log(`${route}: ${chunks.length} external JS chunks, ${bytes} bytes, ${gzip} bytes gzip; ${inline.length} inline scripts, ${inline.reduce((sum, source) => sum + Buffer.byteLength(source), 0)} bytes`);
  for (const chunk of chunks) console.log(`  ${chunk}`);
}
