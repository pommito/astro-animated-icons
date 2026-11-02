import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {performance} from "node:perf_hooks";
import {loadingCases} from "../../scripts/page-loading-cases.mjs";
const scenarios=[{name:"paint-eye-off",batch:32},{name:"repeated",batch:8},{name:"all",batch:1},{name:"repeated-all",batch:1},{name:"path-paint-repeated",batch:1}];
const variants=["baseline","proof"];
const shapes=html=>[...html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(m=>m[0]);
const refs=html=>(html.match(/ data-grave-(?:paint|cycle|opacity)-src=/g)??[]).length;
export async function runServerBenchmark(Scene,root,AstroContainer){
 const result={environment:{node:process.version},protocol:{warmupPairs:5,measuredPairs:30,streamingPairs:15,order:"AB on even pairs, BA on odd pairs",compiled:"Astro production build and container API",gc:"Natural GC; no forced collection",excluded:"Build, module initialization, container creation, HTTP adapter and network"},scenarios:{}};
 const path=root+"/.artifacts/recipe-delivery-runtime/server.json";
 const container=await AstroContainer.create();
 const streaming=await AstroContainer.create({streaming:true});
 const render=(variant,name,target=container)=>target.renderToString(Scene,{props:{variant,slugs:loadingCases[name]},locals:{},request:new Request("http://benchmark.invalid/"+name+"/")});
 for(const {name,batch}of scenarios){
  const controls={};
  for(const variant of variants){
   const html=await render(variant,name);
   const output=root+"/.artifacts/"+(variant==="baseline"?"page-loading":"recipe-delivery-v2")+"/minimal-dist/page-loading/"+name+"/index.html";
   const expected=readFileSync(output,"utf8");
   assert.deepEqual(shapes(html),shapes(expected),variant+" "+name+": exact initial SVG");
   assert.equal(refs(html),refs(expected),variant+" "+name+": reference selection");
   controls[variant]={bytes:Buffer.byteLength(html),icons:shapes(html).length,references:refs(html)};
  }
  const samples=[];
  for(let pair=-5;pair<30;pair++){
   const order=Math.abs(pair)%2?variants.toReversed():variants;
   const row={pair,order:[...order]};
   for(const variant of order){
    const cpu=process.cpuUsage(),start=performance.now();
    for(let i=0;i<batch;i++)await render(variant,name);
    const elapsed=performance.now()-start,used=process.cpuUsage(cpu);
    row[variant]={wallMs:elapsed/batch,cpuMs:(used.user+used.system)/1000/batch};
   }
   if(pair>=0)samples.push(row);
  }
  const streams=[];
  for(let pair=-3;pair<15;pair++){
   const order=Math.abs(pair)%2?variants.toReversed():variants,row={pair,order:[...order]};
   for(const variant of order){
    const start=performance.now();
    const response=await streaming.renderToResponse(Scene,{props:{variant,slugs:loadingCases[name]},locals:{},request:new Request("http://benchmark.invalid/"+name+"/")});
    const reader=response.body.getReader(),decoder=new TextDecoder();let text="",firstSvgMs=null,chunks=0;
    while(true){const {value,done}=await reader.read();if(done)break;chunks++;text+=decoder.decode(value,{stream:true});if(firstSvgMs===null&&text.includes("</svg>"))firstSvgMs=performance.now()-start;}
    const totalMs=performance.now()-start;
    assert.equal(shapes(text).length,loadingCases[name].length);
    assert.equal(refs(text),controls[variant].references);
    row[variant]={firstSvgMs,totalMs,chunks};
   }
   if(pair>=0)streams.push(row);
  }
  result.scenarios[name]={batch,controls,samples,streams};
  writeFileSync(path,JSON.stringify(result,null,2)+"\n");
  console.log("SSR benchmark completed",name);
 }
}
