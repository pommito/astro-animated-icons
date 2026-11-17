import { writeFileSync } from "node:fs";
import { connect } from "./cdp.mjs";
const browser = await connect();
const { version, call, evaluate } = browser;
const results = { browser: version.Browser, scope: "Existing comparison controls, programmatic activation, no timing or visual acceptance", pages: {} };
try {
  for (const [path, controls] of [
    ["css-capabilities/", [["parity", "parity-result"], ["runtime", "runtime-result"]]],
    ["combined-transforms/", [["parity", "parity-result"], ["runtime", "runtime-result"]]],
    ["supported-six/", [["parity", "parity-result"], ["runtime", "runtime-result"]]],
    ["path-paint/", [["parity", "parity-result"], ["runtime", "runtime-result"]]],
    ...["css-capabilities/templates/", "combined-transforms/templates/", "supported-six/templates/"].map(path => [path, [["check-templates", "template-result"]]]),
  ]) {
    const { targetId } = await call("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
    try {
      await call("Target.activateTarget", { targetId });
      await call("Page.enable", {}, sessionId);
      await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] }, sessionId);
      await call("Page.navigate", { url: (process.env.FUNCTIONAL_BASE_URL ?? "http://127.0.0.1:45384") + "/" + path }, sessionId);
      await evaluate(sessionId, 'new Promise((resolve,reject)=>{const until=Date.now()+10000;const poll=()=>document.readyState==="complete"?resolve():Date.now()>until?reject(Error("Load timeout")):setTimeout(poll,20);poll();})');
      results.pages[path] = {};
      for (const [button, output] of controls) {
        results.pages[path][button] = await evaluate(sessionId, `async function run(){
          await Promise.all([...document.querySelectorAll("[data-grave-icon]")].map(host=>customElements.whenDefined(host.localName)));
          await new Promise(resolve=>setTimeout(resolve,100));
          document.getElementById(${JSON.stringify(button)}).click();
          return new Promise((resolve,reject)=>{const until=Date.now()+290000;const poll=()=>{const text=document.getElementById(${JSON.stringify(output)}).textContent;if(text){try{resolve(JSON.parse(text));}catch{reject(Error(text));}}else if(Date.now()>until)reject(Error("Control timeout"));else setTimeout(poll,20);};poll();});
        } run()`);
        console.log(path, button, JSON.stringify(results.pages[path][button]));
      }
    } finally { await call("Target.closeTarget", { targetId }); }
  }
  writeFileSync(process.env.FUNCTIONAL_RESULT ?? ".artifacts/css-109-functional.json", JSON.stringify(results, null, 2) + "\n");
} finally { browser.close(); }
