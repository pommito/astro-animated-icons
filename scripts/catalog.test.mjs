import assert from "node:assert/strict";
import { test } from "node:test";
import { readCatalog } from "./catalog.mjs";

test("catalogue membership survives multiline exports and quote changes", () => {
  const source = `export {
    default as Example
  } from './icons/example/Example.astro';
  export type { ExampleIconHandle } from "./icons/example/element";
  export { default as Other } from "./Other.astro";`;
  assert.deepEqual(readCatalog(source), [{ name: "Example", slug: "example", tag: "grave-example" }]);
});
