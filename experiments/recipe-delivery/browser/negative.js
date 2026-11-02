async () => {
  const original = new DOMParser().parseFromString(await (await fetch("/page-loading/cog-repeated/")).text(), "text/html");
  const reference = original.querySelector("[data-grave-cycle-src]");
  const good = reference.getAttribute("data-grave-cycle-src");
  const first = reference.cloneNode(true), second = reference.cloneNode(true);
  first.removeAttribute("data-grave-cycle-src");second.removeAttribute("data-grave-cycle-src");
  document.body.replaceChildren(first,second);
  const entries=[...original.querySelectorAll("script[src]")].map(script=>script.getAttribute("src"));
  await Promise.all(entries.map(url=>import(url)));
  const tableOnlyUnavailable=!customElements.get(first.localName);
  if(!tableOnlyUnavailable)throw Error("Table-only negative control unexpectedly registered");
  const nativeFetch=window.fetch, requests=[],errors=[];
  window.fetch=(...args)=>{requests.push(String(args[0]));return nativeFetch(...args);};
  console.error=(...args)=>errors.push(args.map(String).join(" "));
  first.setAttribute("data-grave-cycle-src","/missing-recipe.json");second.setAttribute("data-grave-cycle-src","/missing-recipe.json");
  document.dispatchEvent(new Event("astro:page-load"));
  await new Promise(resolve=>setTimeout(resolve,250));
  const failedFetchDidNotDefine=!customElements.get(first.localName);
  if(!failedFetchDidNotDefine||requests.length!==1||errors.length!==1)throw Error("Failed-fetch isolation or deduplication failed");
  first.setAttribute("data-grave-cycle-src",good);second.setAttribute("data-grave-cycle-src",good);
  document.dispatchEvent(new Event("astro:page-load"));
  await Promise.race([customElements.whenDefined(first.localName),new Promise((_,reject)=>setTimeout(()=>reject(Error("Retry timed out")),3000))]);
  first.startAnimation();first.stopAnimation();
  await new Promise(resolve=>setTimeout(resolve,500));
  const result={browser:navigator.userAgent,scenario:"Missing shared record, failed recovery and explicit retry",tableOnlyUnavailable,failedFetchDidNotDefine,expectedErrors:errors,requests:requests.length,retryDefined:Boolean(customElements.get(first.localName)),remainingAnimations:first.querySelector("svg").getAnimations({subtree:true}).length,syntheticPageLoad:true,failures:0};
  window.__deliveryResult=result;
  return result;
}
