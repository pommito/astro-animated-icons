async () => {
  const hosts=[...document.querySelectorAll("[data-grave-icon]")];
  await Promise.all(hosts.map(host=>customElements.whenDefined(host.localName)));
  const references=hosts.filter(host=>[...host.attributes].some(attribute=>/data-grave-(cycle|opacity|paint)-src/.test(attribute.name)));
  const urls=new Set(references.flatMap(host=>[...host.querySelectorAll("script[src]")].map(script=>new URL(script.getAttribute("src"),location.href).href)));
  const resources=performance.getEntriesByType("resource");
  const result={browser:navigator.userAgent,hosts:hosts.length,referenceHosts:references.length,recoveryModuleURLs:urls.size,recoveryModuleRequests:resources.filter(resource=>urls.has(resource.name)).length,jsonRequests:resources.filter(resource=>/\.json$/.test(resource.name)).length,registered:hosts.filter(host=>customElements.get(host.localName)).length};
  if(result.jsonRequests||result.registered!==hosts.length||result.recoveryModuleRequests!==urls.size)throw Error(JSON.stringify(result));
  window.__deliveryV2Result=result;
  return result;
}
