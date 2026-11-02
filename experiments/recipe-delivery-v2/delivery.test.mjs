import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {evaluateTypeScriptData} from "../../scripts/typescript-data.mjs";
const {chooseDelivery}=await evaluateTypeScriptData(readFileSync(new URL("./delivery.ts",import.meta.url),"utf8"));
const recipe={id:"a",values:Array(80).fill("long-channel")};
const choose=(locals,tag,wire=recipe,drawing="<path/>")=>chooseDelivery(locals,tag,wire,drawing,"/_astro/r.hash.json","/_astro/recovery.hash.js","paint");
test("adjacent repeated icons retain self-contained records even when their total exceeds one compression window",()=>{
 const locals={};for(let i=0;i<40;i++)assert.equal(choose(locals,"grave-a"),false);
});
test("intervening drawing bytes make a repeated long recipe eligible for recovery",()=>{
 const locals={};assert.equal(choose(locals,"grave-a"),false);choose(locals,"grave-b",{},"x".repeat(40000));assert.equal(choose(locals,"grave-a"),true);assert.equal(choose(locals,"grave-a"),false);
});
test("a short recipe remains inline across a large gap when its reference would be longer",()=>{
 const locals={};choose(locals,"grave-a",{});choose(locals,"grave-b",{},"x".repeat(40000));assert.equal(choose(locals,"grave-a",{}),false);
});
test("request-local state prevents a previous page from suppressing the first complete record",()=>{
 const first={};choose(first,"grave-a");choose(first,"grave-b",{},"x".repeat(40000));assert.equal(choose(first,"grave-a"),true);assert.equal(choose({},"grave-a"),false);
});
