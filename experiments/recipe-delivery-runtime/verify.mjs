import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {loadingCases} from "../../scripts/page-loading-cases.mjs";
const root=fileURLToPath(new URL("../../",import.meta.url));
const read=name=>JSON.parse(readFileSync(root+"/.artifacts/recipe-delivery-runtime/"+name,"utf8"));
const names=["paint-eye-off","repeated","all","repeated-all","path-paint-repeated"];
for(const run of[1,2]){
 const data=read(`server-run-${run}.json`);
 assert.deepEqual(Object.keys(data.scenarios),names);
 for(const name of names){
  const scenario=data.scenarios[name];assert.equal(scenario.samples.length,30);assert.equal(scenario.streams.length,15);
  for(const variant of["baseline","proof"]){
   assert.equal(scenario.controls[variant].icons,loadingCases[name].length);
   assert.equal(scenario.controls[variant].references,variant==="proof"&&name==="path-paint-repeated"?1423:0);
   for(const row of scenario.samples)for(const key of["wallMs","cpuMs"])assert.ok(Number.isFinite(row[variant][key])&&row[variant][key]>=0);
   for(const row of scenario.streams)assert.ok(row[variant].firstSvgMs>0&&row[variant].totalMs>=row[variant].firstSvgMs);
  }
 }
}
const browser=read("browser-run-1.json");assert.equal(browser.protocol.measuredPairs,20);assert.equal(browser.protocol.warmupPairs,3);
assert.deepEqual(Object.keys(browser.scenarios),names);
for(const name of names)for(const row of browser.scenarios[name].samples){
 assert.equal(browser.scenarios[name].samples.length,20);
 for(const variant of["baseline","proof"]){
  const result=row[variant];assert.equal(result.hosts,loadingCases[name].length);assert.equal(result.launched,Math.min(20,result.hosts));
  assert.equal(result.visibility,"visible");assert.equal(result.jsonRequests,0);assert.deepEqual(result.nonCachedResources,[]);
  assert.equal(result.definitions,new Set(loadingCases[name]).size);
  for(const key of["readyMs","startMs","defineMs"])assert.ok(Number.isFinite(result[key])&&result[key]>=0);
 }
 assert.deepEqual(row.baseline.launchTags,row.proof.launchTags);assert.equal(row.baseline.geometryReads,row.proof.geometryReads);
}
console.log("Verified 300 server batch pairs, 150 streaming pairs and 100 browser pairs; matched inputs, cache hits and launch targets.");
