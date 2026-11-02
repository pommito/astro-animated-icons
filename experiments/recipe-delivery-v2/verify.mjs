import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../../",import.meta.url));
const file=process.argv[2]??root+"/.artifacts/recipe-delivery-v2/proof.json";
const result=JSON.parse(readFileSync(file,"utf8"));
const baseline=JSON.parse(readFileSync(root+"/.artifacts/page-loading/baseline.json","utf8"));
let checked=0,identical=0;
for(const [mode,data]of Object.entries(result.modes)){
 for(const [name,route]of Object.entries(data.routes)){
  assert.ok(route.deltaPageGzip<=0,`${mode}/${name}: page gzip regressed by ${route.deltaPageGzip} bytes`);
  checked++;
  if(route.references)continue;
  const path="/page-loading/"+name+"/index.html";
  assert.equal(readFileSync(root+"/.artifacts/recipe-delivery-v2/"+mode+"-dist"+path,"utf8"),readFileSync(root+"/.artifacts/page-loading/"+mode+"-dist"+path,"utf8"),`${mode}/${name}: non-reference HTML must remain byte-identical`);
  assert.deepEqual(route.chunks,baseline.modes[mode].routes[name].chunks,`${mode}/${name}: unchanged JavaScript URLs`);
  for(const url of route.chunks)assert.equal(readFileSync(root+"/.artifacts/recipe-delivery-v2/"+mode+"-dist"+url,"utf8"),readFileSync(root+"/.artifacts/page-loading/"+mode+"-dist"+url,"utf8"),`${mode}/${name}: unchanged JavaScript bodies`);
  identical++;
 }
}
console.log(`Verified ${checked} whole-page budgets; ${identical} pages retain byte-identical HTML and JavaScript.`);
