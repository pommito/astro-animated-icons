import {readFileSync,writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {compare} from "./stats.mjs";
const root=fileURLToPath(new URL("../../",import.meta.url));
const read=name=>JSON.parse(readFileSync(root+"/.artifacts/recipe-delivery-runtime/"+name,"utf8"));
const servers=[read("server-run-1.json"),read("server-run-2.json")],browser=read("browser-run-1.json");
const summary={reference:"90302b37876ba25f417b63ffd721fbab5e21f0aa",environment:JSON.parse(readFileSync(root+"/.artifacts/page-loading/baseline.json")).environment,browserEnvironment:read("browser-environment.json"),statistic:{center:"Median per-render time for server batches; median per-document time for browser",interval:"5000 deterministic paired bootstrap resamples; 95% percentile interval for difference of medians",server:"Two independent production Node builds; 30 paired batches each and 15 streaming pairs each per scenario",browser:"20 paired fresh-frame trials per scenario after three warmup pairs",limits:"Intervals describe these campaigns, not other hardware or browsers; no outliers discarded"},server:{},browser:{}};
for(const name of Object.keys(servers[0].scenarios)){
 const samples=servers.flatMap((run,index)=>run.scenarios[name].samples.map(row=>({...row,campaign:index+1}))),streams=servers.flatMap((run,index)=>run.scenarios[name].streams.map(row=>({...row,campaign:index+1})));
 summary.server[name]={batch:servers[0].scenarios[name].batch,controls:servers[0].scenarios[name].controls,wall:compare(samples,"wallMs"),cpu:compare(samples,"cpuMs"),firstSvg:compare(streams,"firstSvgMs"),streamTotal:compare(streams,"totalMs"),campaigns:servers.map(run=>({wall:compare(run.scenarios[name].samples,"wallMs"),firstSvg:compare(run.scenarios[name].streams,"firstSvgMs")}))};
 summary.browser[name]={ready:compare(browser.scenarios[name].samples,"readyMs"),define:compare(browser.scenarios[name].samples,"defineMs"),layout:compare(browser.scenarios[name].samples,"initialLayoutMs"),start:compare(browser.scenarios[name].samples,"startMs"),launched:browser.scenarios[name].samples[0].baseline.launched,hosts:browser.scenarios[name].samples[0].baseline.hosts,geometryReads:browser.scenarios[name].samples[0].baseline.geometryReads};
}
const files=["experiments/recipe-delivery-v2/delivery.ts","experiments/recipe-delivery-v2/CssIcon.astro","experiments/recipe-delivery-v2/CssPaintIcon.astro","experiments/recipe-delivery-v2/CssOpacityIcon.astro","experiments/recipe-delivery-runtime/server-benchmark.mjs","experiments/recipe-delivery-runtime/browser-probe.js","experiments/recipe-delivery-runtime/browser-controller.js","pnpm-lock.yaml"];
summary.sourceHashes=Object.fromEntries(files.map(file=>[file,createHash("sha256").update(readFileSync(root+"/"+file)).digest("hex")]));
writeFileSync(root+"/.artifacts/recipe-delivery-runtime/summary.json",JSON.stringify(summary,null,2)+"\n");
console.table(Object.entries(summary.server).map(([name,s])=>({name,reference:s.wall.baseline.median,proof:s.wall.proof.median,delta:s.wall.medianDifference,percent:100*(s.wall.medianRatio-1),firstSvgDelta:s.firstSvg.medianDifference})));
console.table(Object.entries(summary.browser).map(([name,s])=>({name,readyReference:s.ready.baseline.median,readyProof:s.ready.proof.median,readyCI:s.ready.medianDifferenceCI95,launchReference:s.start.baseline.median,launchProof:s.start.proof.median,launchCI:s.start.medianDifferenceCI95})));
