import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { connect } from "./cdp.mjs";

const transport = process.argv[2];
assert.ok(["attribute", "template"].includes(transport));
const browser = await connect();
const { targetId } = await browser.call("Target.createTarget", { url: "about:blank" });
const { sessionId } = await browser.call("Target.attachToTarget", { targetId, flatten: true });
try {
  await browser.call("Target.activateTarget", { targetId });
  await browser.call("Page.enable", {}, sessionId);
  await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] }, sessionId);
  await browser.call("Page.navigate", { url: `http://127.0.0.1:${Number(process.env.CSS_BENCHMARK_PORT ?? 45390) + 3}/${transport}/` }, sessionId);
  await browser.evaluate(sessionId, 'new Promise((resolve,reject)=>{const end=Date.now()+10000;const poll=()=>typeof runPreparation==="function"?resolve():Date.now()>end?reject(Error("Controller unavailable")):setTimeout(poll,20);poll();})');
  const result = await browser.evaluate(sessionId, "runPreparation({warmups:3,pairs:20})");
  writeFileSync(`.artifacts/css-client/${transport}/runtime/browser-environment.json`, JSON.stringify({ version: browser.version, ...result.environment, motion: "native browser media emulation, no-preference", competingWork: "Motion #112 idle; own builds, validation, functional probes and server campaigns stopped", visibility: "Every measured iframe checked visible by the existing controller" }, null, 2));
  console.log("Saved paired browser campaign", transport);
} finally { await browser.call("Target.closeTarget", { targetId }); browser.close(); }
