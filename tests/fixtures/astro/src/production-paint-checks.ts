import scope from "../../../helpers/path-paint-scope.json";
import { capture } from "./path-paint-proof/capture.mjs";
import { compareSavedPaint } from "./path-paint-proof/compare-saved";
import { bindGlobalPlayback } from "./comparison-controls";
import type { IconHandle } from "../../../../packages/animated-icons/src/element";
const pathPaint=scope.filter(icon=>icon.slug!=="wind-arrow-down");

export async function compareProductionPaint(family?: string) {
  const families=family?[family]:[...new Set(pathPaint.map(icon=>icon.family))];
  const results=[];
  for(const selected of families) {
    const baseline=await (await fetch("/production-paint-evidence/"+selected+".json")).json();
    const representatives=pathPaint.filter(icon=>icon.family===selected).map(icon=>icon.slug);
    const production=compareSavedPaint(baseline,await capture({representatives,selector:"[data-production-holder] [data-sample]"}));
    const reference=compareSavedPaint(baseline,await capture({representatives,selector:"[data-reference-holder] [data-sample]"}));
    results.push({family:selected,production,reference});
  }
  return {userAgent:navigator.userAgent,method:"Public production CSS and fixture-only preceding Motion mechanisms against independent pre-extraction captures. Paused timelines and manual API; no upstream React execution or visual acceptance.",results};
}

export async function checkProductionPaintCleanup() {
  const checks:{pass:boolean;context:string}[]=[];
  const check=(pass:boolean,context:string)=>checks.push({pass,context});
  const clean=(icon:HTMLElement)=>!icon.getAnimations({subtree:true}).length&&!icon.hasAttribute("data-paint-state")&&[...icon.querySelectorAll<SVGElement>("*")].every(el=>![...el.style].some(key=>key.startsWith("--grave-paint-")||["opacity","stroke-dasharray","stroke-dashoffset"].includes(key)));
  for(const source of document.querySelectorAll<HTMLElement&IconHandle>("[data-production-holder] [data-sample]")) {
    const parent=source.parentElement!;
    const template=document.createElement("template");template.content.append(source.cloneNode(true));
    const clone=template.content.firstElementChild!.cloneNode(true) as HTMLElement&IconHandle;template.remove();
    const id=source.getAttribute("data-css-paint")!;
    document.querySelectorAll(`style[data-grave-cycle-style="${id}"]`).forEach(sheet=>sheet.remove());
    parent.append(clone);clone.startAnimation();check(clone.getAnimations({subtree:true}).length>0,id+" source-removed template and stylesheet recovery");
    clone.remove();check(clean(clone),id+" disconnect clears captured state");parent.append(clone);clone.startAnimation();check(clone.getAnimations({subtree:true}).length>0,id+" reconnect plays");clone.remove();
    const native=window.matchMedia;const preference=new EventTarget() as MediaQueryList;let reduced=false;Object.defineProperty(preference,"matches",{get:()=>reduced});
    try {
      window.matchMedia=query=>query==="(prefers-reduced-motion: reduce)"?preference:native.call(window,query);
      source.remove();parent.append(source);source.startAnimation();source.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=83;});
      reduced=true;preference.dispatchEvent(new Event("change"));check(clean(source),id+" synthetic reduced motion clears");source.startAnimation();check(!source.getAnimations({subtree:true}).length,id+" reduced playback stays static");
      reduced=false;source.startAnimation();check(source.getAnimations({subtree:true}).length>0,id+" preference restoration plays");
    } finally {window.matchMedia=native;source.remove();parent.append(source);}
  }
  return {method:"Synthetic template, lifecycle and preference probes; native media/input remain separate.",checks,failures:checks.filter(check=>!check.pass)};
}
Object.assign(window,{compareProductionPaint,checkProductionPaintCleanup});
bindGlobalPlayback();
for(const [id,run] of [["parity",()=>compareProductionPaint()],["runtime",checkProductionPaintCleanup]] as const) document.getElementById(id)!.addEventListener("click",async()=>{
  const button=document.getElementById(id) as HTMLButtonElement;button.disabled=true;
  try {document.getElementById(id+"-result")!.textContent=JSON.stringify(await run(),null,2);}finally{button.disabled=false;}
});
