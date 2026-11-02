import {test} from "node:test";
import assert from "node:assert/strict";
import {quantile,compare} from "./stats.mjs";
test("quantiles interpolate a small known sample without dropping tails",()=>{assert.equal(quantile([1,3,2,4],.5),2.5);assert.ok(Math.abs(quantile([1,3,2,4],.95)-3.85)<1e-12);assert.throws(()=>quantile([],.5));});
test("paired deltas preserve a known constant regression despite baseline variation",()=>{const rows=[1,3,20,4,9].map(value=>({baseline:{ms:value},proof:{ms:value+2}}));const result=compare(rows,"ms");assert.deepEqual(result.pairedDeltaCI95,[2,2]);assert.deepEqual(result.medianDifferenceCI95,[2,2]);assert.equal(result.pairedDelta.median,2);});
