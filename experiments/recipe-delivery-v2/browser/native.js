async () => {
  const ready=await Promise.race([window.proofReady,new Promise((_,reject)=>setTimeout(()=>reject(Error("Registration timed out: "+JSON.stringify(window.proofErrors))),10000))]);
  const hosts=window.proofClones;
  for(const host of hosts)host.startAnimation();
  const active=hosts.filter(host=>host.querySelector("svg").getAnimations({subtree:true}).length).length;
  await new Promise(resolve=>setTimeout(resolve,31));
  for(const host of hosts)host.stopAnimation();
  await new Promise(resolve=>setTimeout(resolve,2000));
  const remaining=hosts.reduce((sum,host)=>sum+host.querySelector("svg").getAnimations({subtree:true}).length,0);
  const referenced=hosts.find(host=>host.hasAttribute("data-grave-paint-src"));
  const requests=window.proofFetches.length;
  document.querySelector('style[data-grave-cycle-style="'+referenced.localName.slice(6)+'"]').remove();
  const late=referenced.cloneNode(true);
  document.body.append(late);
  late.startAnimation();late.remove();document.body.append(late);late.startAnimation();late.stopAnimation();
  await new Promise(resolve=>setTimeout(resolve,2000));
  const lateCloneRecovered=typeof late.startAnimation==="function"&&window.proofFetches.length===requests&&late.querySelector("svg").getAnimations({subtree:true}).length===0;
  const result={...ready,browser:navigator.userAgent,clones:hosts.length,jsonFetches:window.proofFetches.filter(url=>/\.json$/.test(url)).length,distinctFetches:new Set(window.proofFetches).size,active,remainingAnimations:remaining,lateCloneRecovered,sheets:document.querySelectorAll("style[data-grave-cycle-style]").length,errors:window.proofErrors};
  if(active!==ready.recipes*2||remaining||!lateCloneRecovered||result.errors.length||result.jsonFetches!==ready.referenceRecipes)throw Error(JSON.stringify(result));
  window.__deliveryV2Result=result;
  return result;
}
