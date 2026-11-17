const scenarios=["paint-eye-off","repeated","all","repeated-all","path-paint-repeated"];
const variants=["baseline","proof"];
const origins={baseline:"http://127.0.0.1:45343",proof:"http://127.0.0.1:45344"};
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
window.runPreparation=async({warmups=3,pairs=20}={})=>{
 const probe=await(await fetch("/probe.js")).text();
 const source={};
 for(const name of scenarios){source[name]={};for(const variant of variants)source[name][variant]=await(await fetch(origins[variant]+"/page-loading/"+name+"/")).text();}
 const results={environment:{browser:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency,deviceMemory:navigator.deviceMemory},protocol:{warmupPairs:warmups,measuredPairs:pairs,order:"AB on even pairs, BA on odd pairs",html:"srcdoc from production HTML fetched once outside measurements",assets:"HTTP assets warmed by navigation warmups; fresh iframe/registry each trial",launch:"At most 20 hosts, spread over distinct tags and alternating first/last occurrences; all hosts when fewer than 20",viewport:{width:1100,height:800},excluded:"HTML transfer, server render, network throttling, frame pacing, simultaneous launch of every host on large pages"},scenarios:{}};
 const trial=(variant,name)=>new Promise((resolve,reject)=>{
  const frame=document.createElement("iframe");frame.width="1100";frame.height="800";frame.style.pointerEvents="none";
  const timeout=setTimeout(()=>{frame.remove();window.removeEventListener("message",receive);reject(Error("Preparation timeout: "+variant+"/"+name));},60000);
  const receive=event=>{
   if(event.source!==frame.contentWindow||event.data?.kind!=="recipe-preparation")return;
   clearTimeout(timeout);window.removeEventListener("message",receive);frame.remove();
   if(event.data.error)reject(Error(event.data.error));else resolve(event.data.result);
  };
  window.addEventListener("message",receive);
  frame.srcdoc=source[name][variant].replace("<head>",'<head><base href="'+origins[variant]+'/">'+'<script>'+probe+'</'+'script>');
  document.body.append(frame);
 });
 for(const name of scenarios){
  const samples=[];
  for(let pair=-warmups;pair<pairs;pair++){
   const order=Math.abs(pair)%2?variants.toReversed():variants,row={pair,order:[...order]};
   for(const variant of order){
    window.benchmarkProgress={name,pair,variant};
    row[variant]=await trial(variant,name);
    if(row[variant].jsonRequests)throw Error("Unexpected recipe JSON fetch on normal page");
    if(row[variant].visibility!=="visible")throw Error("Hidden document invalidates the preparation measurement");
    await pause(20);
   }
   if(JSON.stringify(row.baseline.launchTags)!==JSON.stringify(row.proof.launchTags)||row.baseline.geometryReads!==row.proof.geometryReads)throw Error("Launch targets or geometry reads differ between variants");
   if(pair>=0)samples.push(row);
  }
  results.scenarios[name]={samples};window.browserResults=results;
  await fetch("/results",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(results)});
 }
 window.benchmarkProgress={complete:true};
 return results;
};
