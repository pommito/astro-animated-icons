import assert from "node:assert/strict";
import { test } from "node:test";
import { paintDelta, poseCoverage } from "../tests/fixtures/astro/src/path-paint-proof/comparison.mjs";

test("paint comparison preserves units, list length, none and signed offsets", () => {
  assert.equal(paintDelta("dash","20px, 20px","20% 20%"),Infinity);
  assert.equal(paintDelta("dash","20px","20px 20px"),Infinity);
  assert.equal(paintDelta("dash","none","0px 20px"),Infinity);
  assert.equal(paintDelta("dash","20px, 20px","20px 20px"),0);
  assert.equal(paintDelta("offset","-20px","20px"),40);
});

test("comparison rejects omitted poses and unexpected duplicates", () => {
  const pose={slug:"wind",size:24,scenario:"entry",time:83};
  assert.equal(poseCoverage([], [pose]).failures.length,1);
  assert.equal(poseCoverage([pose,pose], [pose]).failures.length,1);
  assert.equal(poseCoverage([pose], [pose,pose]).failures.length,1);
  assert.equal(poseCoverage([pose,pose], [pose,pose]).failures.length,0);
  assert.deepEqual(poseCoverage([pose], [pose]).counts,{expected:1,actual:1,expectedUnique:1,actualUnique:1});
});
