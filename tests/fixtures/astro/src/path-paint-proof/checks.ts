import { capture } from "./capture.mjs";
import { createPaintProof, type PaintProofPlan } from "./runtime";
import { decodePaint } from "./codec.mjs";
import { paintDelta, poseCoverage } from "./comparison.mjs";
import { createIconElement, type IconHandle } from "../../../../../packages/animated-icons/src/element";

type Handle = HTMLElement & IconHandle;
const tracks = (icon: HTMLElement) => icon.getAnimations({ subtree: true });
const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const reset = (icon: HTMLElement) => { const parent = icon.parentElement!; icon.remove(); parent.append(icon); };

export async function comparePaintProof() {
  const baseline = await (await fetch("/path-paint-evidence.json")).json();
  const actual = await capture();
  const expected = new Map(baseline.poses.map((pose: any) => [[pose.slug,pose.size,pose.scenario,pose.time].join("/"),pose]));
  const coverage=poseCoverage(actual.poses,baseline.poses);
  const failures: unknown[] = [...actual.failures,...coverage.failures];
  const maximum = { dash: 0, offset: 0, opacity: 0, matrix: 0 };
  let compared = 0;
  for (const pose of actual.poses) {
    const key = [pose.slug,pose.size,pose.scenario,pose.time].join("/");
    const saved: any = expected.get(key);
    if (!saved || saved.shapes.length !== pose.shapes.length) { failures.push({ key, reason: "missing pose or shape" }); continue; }
    pose.shapes.forEach((shape: any, index: number) => {
      const previous = saved.shapes[index];
      for (const [property, category, tolerance] of [["dash","dash",.005],["offset","offset",.005],["opacity","opacity",.001],["matrix","matrix",.005]] as const) {
        const error = paintDelta(property,shape[property],previous[property]);
        maximum[category] = Math.max(maximum[category],error);
        if (error > tolerance) failures.push({ key,index,property,error,actual:shape[property],expected:previous[property] });
      }
      if (shape.origin !== previous.origin) failures.push({key,index,property:"origin",actual:shape.origin,expected:previous.origin});
      compared++;
    });
  }
  return { userAgent: navigator.userAgent, method: "Isolated CSS paint against independent saved public Motion poses; manual API, native timeline seeking and synthetic lifecycle. WindArrowDown is a retained Motion control, not a paint migration.",
    tolerances: { dash:.005,offset:.005,opacity:.001,matrix:.005 }, coverage:coverage.counts, poses:actual.poses.length, shapes:compared, maximum, checks:actual.checks, failureCount:failures.length, failures:failures.slice(0,100) };
}

export async function checkPaintCleanup() {
  const checks: { pass: boolean; context: string }[] = [];
  const check = (pass: boolean, context: string) => checks.push({pass,context});
  const clean = (icon: HTMLElement) => !tracks(icon).length && !icon.hasAttribute("data-pp-state") && [...icon.querySelectorAll<SVGElement>("*")].every(el => ![...el.style].some(name => name.startsWith("--pp-") || ["stroke-dasharray","stroke-dashoffset","opacity"].includes(name)));
  for (const source of document.querySelectorAll<Handle>("[data-pp-id]")) {
    const plan = decodePaint(JSON.parse(source.dataset.ppRecipe!)) as PaintProofPlan;
    const parent = source.parentElement!;
    const template = document.createElement("template");
    template.content.append(source.cloneNode(true));
    const clone = template.content.firstElementChild!.cloneNode(true) as Handle;
    template.remove();
    document.querySelectorAll(`style[data-grave-cycle-style="proof-paint-${plan.id}"]`).forEach(sheet=>sheet.remove());
    parent.append(clone);
    check(document.querySelectorAll(`style[data-grave-cycle-style="proof-paint-${plan.id}"]`).length===1,plan.id+" stylesheet recovery");
    clone.startAnimation(); check(tracks(clone).length>0,plan.id+" independent template clone plays");
    clone.remove(); check(clean(clone),plan.id+" disconnect clears variables and paint");
    parent.append(clone); clone.startAnimation(); check(tracks(clone).length>0,plan.id+" reconnect plays");
    clone.remove();
    const tag = "proof-before-"+plan.id;
    if(!customElements.get(tag)) {
      const inert = document.createElement("template");
      const pending = document.createElement(tag) as Handle;
      for(const {name,value} of source.attributes) pending.setAttribute(name,value);
      pending.innerHTML=source.innerHTML;
      inert.content.append(pending);
      const before=inert.content.firstElementChild!.cloneNode(true) as Handle;
      inert.remove(); parent.append(before);
      customElements.define(tag,createIconElement(createPaintProof(plan)));
      before.startAnimation(); check(tracks(before).length>0,plan.id+" source-removed clone before registration plays"); before.remove();
    }
    const sheet = document.querySelector(`style[data-grave-cycle-style="proof-paint-${plan.id}"]`)!;
    document.head.append(sheet.cloneNode(true));
    reset(source); check(document.querySelectorAll(`style[data-grave-cycle-style="proof-paint-${plan.id}"]`).length===1,plan.id+" late sheets reconcile");
    const native=window.matchMedia;
    const preference=new EventTarget() as MediaQueryList;
    let reduced=false;
    Object.defineProperty(preference,"matches",{get:()=>reduced});
    try {
      window.matchMedia=query=>query==="(prefers-reduced-motion: reduce)"?preference:native.call(window,query);
      reset(source); source.startAnimation(); tracks(source).forEach(a=>{a.pause();a.currentTime=83;});
      reduced=true; preference.dispatchEvent(new Event("change")); check(clean(source),plan.id+" synthetic reduced motion cleans");
      source.startAnimation(); check(!tracks(source).length,plan.id+" reduced playback stays static");
      reduced=false; preference.dispatchEvent(new Event("change")); source.startAnimation(); check(tracks(source).length>0,plan.id+" restored playback");
    } finally { window.matchMedia=native; reset(source); }
  }
  await settle();
  return {userAgent:navigator.userAgent,method:"Synthetic template, lifecycle and matchMedia probes, not native input or OS preferences.",checks,failures:checks.filter(x=>!x.pass)};
}

Object.assign(window,{comparePaintProof,checkPaintCleanup});
for(const [buttonId,run] of [["parity",comparePaintProof],["runtime",checkPaintCleanup]] as const) {
  document.getElementById(buttonId)!.addEventListener("click",async()=>{
    const button=document.getElementById(buttonId) as HTMLButtonElement;
    button.disabled=true;
    try { document.getElementById(buttonId+"-result")!.textContent=JSON.stringify(await run(),null,2); }
    finally {button.disabled=false;}
  });
}
