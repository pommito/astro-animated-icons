(() => {
  const define=customElements.define.bind(customElements);
  let defineMs=0,definitions=0,geometryReads=0;
  customElements.define=(...args)=>{const start=performance.now();try{return define(...args);}finally{defineMs+=performance.now()-start;definitions++;}};
  const length=SVGGeometryElement.prototype.getTotalLength;
  SVGGeometryElement.prototype.getTotalLength=function(){geometryReads++;return length.call(this);};
  addEventListener("load",async()=>{
    try{
      const hosts=[...document.querySelectorAll("[data-grave-icon]")];
      await Promise.all(hosts.map(host=>customElements.whenDefined(host.localName)));
      const layoutStart=performance.now();
      document.body.getBoundingClientRect();
      const initialLayoutMs=performance.now()-layoutStart;
      const readyMs=performance.now();
      await new Promise(resolve=>requestAnimationFrame(resolve));
      const groups=new Map();for(const host of hosts){if(!groups.has(host.localName))groups.set(host.localName,[]);groups.get(host.localName).push(host);}
      const count=Math.min(20,hosts.length),distinct=[...groups.keys()];
      const chosen=distinct.length>=count?Array.from({length:count},(_,index)=>{const group=groups.get(distinct[Math.round(index*(distinct.length-1)/Math.max(1,count-1))]);return group[index%2?group.length-1:0];}):Array.from({length:count},(_,index)=>hosts[Math.round(index*(hosts.length-1)/Math.max(1,count-1))]);
      const start=performance.now();
      for(const host of chosen)host.startAnimation();
      const startMs=performance.now()-start;
      const resources=performance.getEntriesByType("resource");
      const nav=performance.getEntriesByType("navigation")[0];
      parent.postMessage({kind:"recipe-preparation",result:{hosts:hosts.length,visibility:document.visibilityState,launched:chosen.length,launchTags:chosen.map(host=>host.localName),definitions,defineMs,initialLayoutMs,readyMs,startMs,geometryReads,domInteractiveMs:nav.domInteractive,domContentLoadedMs:nav.domContentLoadedEventEnd,loadMs:nav.loadEventEnd,jsonRequests:resources.filter(r=>/\.json$/.test(r.name)).length,resourceRequests:resources.length,nonCachedResources:resources.filter(r=>r.transferSize>0).map(r=>({name:r.name,bytes:r.transferSize}))}},"*");
    }catch(error){parent.postMessage({kind:"recipe-preparation",error:String(error.stack??error)},"*");}
  },{once:true});
})();
