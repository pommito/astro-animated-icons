import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const endpoint = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:45365";
const minimal = process.env.BENCHMARK_MINIMAL_URL ?? "http://127.0.0.1:45363";
const full = process.env.BENCHMARK_FULL_URL ?? "http://127.0.0.1:45364";
const probe = readFileSync(new URL("browser-requests.js", import.meta.url), "utf8");
const version = await (await fetch(endpoint + "/json/version")).json();
const browser = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { browser.addEventListener("open", resolve, { once: true }); browser.addEventListener("error", reject, { once: true }); });
let next = 0;
const pending = new Map();
const requests = [];
browser.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const task = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) task.reject(Error(JSON.stringify(message.error))); else task.resolve(message.result);
  } else if (message.method === "Network.requestWillBeSent") {
    requests.push({ session: message.sessionId, type: message.params.type, url: message.params.request.url });
  }
});
function call(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++next;
    pending.set(id, { resolve, reject });
    browser.send(JSON.stringify({ id, method, params, sessionId }));
  });
}
async function evaluate(session, expression) {
  const value = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, timeout: 30000 }, session);
  assert.ok(!value.exceptionDetails, JSON.stringify(value.exceptionDetails));
  return value.result.value;
}
async function page(url, run) {
  const { targetId } = await call("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
  try {
    await call("Target.activateTarget", { targetId });
    await call("Page.enable", {}, sessionId);
    await call("Network.enable", {}, sessionId);
    await call("Network.setCacheDisabled", { cacheDisabled: true }, sessionId);
    await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] }, sessionId);
    await call("Page.navigate", { url }, sessionId);
    await evaluate(sessionId, 'new Promise((resolve,reject)=>{const end=Date.now()+10000;const check=()=>{if(document.readyState==="complete")resolve();else if(Date.now()>end)reject(Error("Load timeout"));else setTimeout(check,20);};check();})');
    const result = await run(sessionId);
    return { ...result, network: requests.filter(row => row.session === sessionId).map(({ session, ...row }) => row) };
  } finally { await call("Target.closeTarget", { targetId }); }
}
const result = { browser: version.Browser, reference: "90302b37876ba25f417b63ffd721fbab5e21f0aa", protocol: "Fresh visible documents; HTTP cache disabled; request trace only. No timing campaign.", routes: {} };
try {
  for (const name of ["unused", "one", "cog", "paint-eye-off", "key-square", "four", "one-loader"]) {
    result.routes[name] = await page(minimal + "/page-loading/" + name + "/", session => evaluate(session, "(" + probe + ")()"));
    console.log("Recorded requests", name);
  }
  result.templates = await page(full + "/page-loading/templates/", async session => {
    return evaluate(session, `async function run(){
      await Promise.all([...document.querySelectorAll("[data-grave-icon]")].map(host=>customElements.whenDefined(host.localName)));
      await new Promise(resolve=>setTimeout(resolve,100));
      const resources=()=>performance.getEntriesByType("resource").map(row=>new URL(row.name).pathname);
      const initial=resources();document.querySelector("#check-loading").click();
      await new Promise(resolve=>setTimeout(resolve,1800));
      return {initial,eventual:resources(),check:JSON.parse(document.querySelector("#loading-result").textContent)};
    } run()`);
  });
  result.navigation = await page(full + "/page-loading/navigation/a/", async session => {
    return evaluate(session, `async function run(){
      const resources=()=>performance.getEntriesByType("resource").map(row=>new URL(row.name).pathname);
      const initial=resources();window.requestTraceDocument="same-document";document.querySelector("#next").click();
      await new Promise((resolve,reject)=>{const end=Date.now()+10000;const check=()=>{if(document.querySelector('main[data-page="b"]'))resolve();else if(Date.now()>end)reject(Error("Navigation timeout"));else setTimeout(check,20);};check();});
      const hosts=[...document.querySelectorAll("[data-grave-icon]")];await Promise.all(hosts.map(host=>customElements.whenDefined(host.localName)));
      for(const host of hosts){host.startAnimation();host.stopAnimation();}
      await new Promise(resolve=>setTimeout(resolve,1800));
      return {initial,eventual:resources(),sameDocument:window.requestTraceDocument==="same-document",tags:hosts.map(host=>host.localName),playbackReady:hosts.every(host=>typeof host.startAnimation==="function")};
    } run()`);
  });
  assert.deepEqual(result.templates.check.failures, []);
  assert.equal(result.navigation.sameDocument, true);
  const output = new URL("../.artifacts/page-loading/request-trace.json", import.meta.url);
  mkdirSync(new URL("./", output), { recursive: true });
  writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
  console.log("Saved .artifacts/page-loading/request-trace.json");
} finally { browser.close(); }
