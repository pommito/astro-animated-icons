import assert from "node:assert/strict";
import { test } from "node:test";
import { paintDelta } from "../tests/fixtures/astro/src/path-paint-proof/comparison.mjs";

test("paint comparison preserves units, list length, none and signed offsets", () => {
  assert.equal(paintDelta("dash","20px, 20px","20% 20%"),Infinity);
  assert.equal(paintDelta("dash","20px","20px 20px"),Infinity);
  assert.equal(paintDelta("dash","none","0px 20px"),Infinity);
  assert.equal(paintDelta("dash","20px, 20px","20px 20px"),0);
  assert.equal(paintDelta("offset","-20px","20px"),40);
});
