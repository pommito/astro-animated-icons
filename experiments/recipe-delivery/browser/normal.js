async () => {
  const hosts=[...document.querySelectorAll("[data-grave-icon]")];
  await Promise.all(hosts.map(host=>customElements.whenDefined(host.localName)));
  const jsonRequests=performance.getEntriesByType("resource").filter(entry=>/\.json(?:$|\?)/.test(entry.name)).length;
  if(jsonRequests)throw Error("Normal document fetched recovery data");
  const beforeSheets=document.querySelectorAll("style[data-grave-cycle-style]").length;
  for(const sheet of document.querySelectorAll("style[data-grave-cycle-style]"))sheet.remove();
  for(const host of hosts)host.startAnimation();
  const active=hosts.filter(host=>host.querySelector("svg").getAnimations({subtree:true}).length>0).length;
  await new Promise(resolve=>setTimeout(resolve,31));
  for(const host of hosts)host.stopAnimation();
  await new Promise(resolve=>setTimeout(resolve,2000));
  const remaining=hosts.reduce((sum,host)=>sum+host.querySelector("svg").getAnimations({subtree:true}).length,0);
  if(active!==hosts.length||remaining)throw Error("Playback or return cleanup failed");
  const result={browser:navigator.userAgent,scenario:"Normal all-120 document; stylesheet deletion and recovery",hosts:hosts.length,jsonRequests,sheetsBefore:beforeSheets,recoveredSheets:document.querySelectorAll("style[data-grave-cycle-style]").length,activeHosts:active,remainingAnimations:remaining,failures:0};
  window.__deliveryResult=result;
  return result;
}
