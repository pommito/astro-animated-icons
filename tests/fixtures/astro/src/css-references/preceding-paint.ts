import { animate } from "motion/mini";
import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import type { PaintRecipe } from "../../../../../packages/animated-icons/src/shared/paint-recipe";
import { animatePathReveal, clearPathReveal } from "../../../../../packages/animated-icons/src/shared/path-reveal";
import { createStaggeredRevealRecipe } from "../../../../../packages/animated-icons/src/shared/staggered-reveal";

type Ease = "linear" | "easeOut" | "easeInOut" | [number,number,number,number];
function motionEase(value: string): Ease {
  if (value === "linear") return "linear";
  if (value === "ease-out") return "easeOut";
  if (value === "ease-in-out") return "easeInOut";
  return value.match(/-?\d*\.?\d+/g)!.map(Number) as [number,number,number,number];
}
const same = (a: unknown,b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function precedingPaintRecipe(plan: PaintRecipe): IconRecipe {
  const targets=[...new Set(plan.entry.map(channel=>channel.target))];
  const states=new WeakMap<SVGElement,{active:boolean}>();
  if(plan.entry.every(channel=>channel.property === "opacity" && channel.values.length===2 && channel.duration===300)) {
    return createStaggeredRevealRecipe(plan.entry.map(channel=>({child:channel.target,delay:channel.delay/1000,opacityOnly:true,
      opacityEase:motionEase(channel.ease),preservePose:plan.replay==="active",returnDelay:plan.returning.find(back=>back.target===channel.target)!.delay/1000})),plan.finish);
  }
  return {
    finish:plan.finish,
    animate(drawing,returning,track) {
      for(const index of targets) {
        const target=drawing.children[index-1] as SVGGeometryElement;
        const entry=plan.entry.filter(channel=>channel.target===index);
        const back=plan.returning.filter(channel=>channel.target===index);
        const dash=entry.find(channel=>channel.property==="strokeDasharray");
        const offset=entry.find(channel=>channel.property==="strokeDashoffset");
        const opacity=entry.find(channel=>channel.property==="opacity");
        const simple=dash && same(dash.values,[[0,1],[1,1]]) && (!opacity||same(opacity.values,[0,1]))
          && back.some(channel=>channel.property==="strokeDasharray") && plan.replay!=="current" && plan.replay!=="dash-incomplete";
        if(simple) {
          const selected=returning?back:entry;
          const main=selected.find(channel=>channel.property==="strokeDasharray")!;
          const paint=selected.find(channel=>channel.property==="opacity");
          animatePathReveal(target,returning,track,{duration:main.duration/1000,delay:main.delay/1000,ease:motionEase(main.ease),
            opacityDuration:paint?paint.duration/1000:undefined,opacityDelay:paint?paint.delay/1000:undefined,opacityEase:paint?motionEase(paint.ease):undefined,
            pathOffset:offset?-(offset.values[0] as number[])[0] as 1|-1:undefined,preservePose:plan.replay==="active"?true:plan.replay==="until-clear"?"until-clear":undefined});
          continue;
        }
        animateDirect(target,index,returning,track);
      }
    },
    clear(drawing) { for(const index of targets) { const target=drawing.children[index-1] as SVGGeometryElement;states.delete(target);clearPathReveal(target); } },
  };

  function animateDirect(target: SVGGeometryElement,index: number,returning: boolean,track: IconTrack) {
    const phase=(returning?plan.returning:plan.entry).filter(channel=>channel.target===index);
    const length=phase.some(channel=>channel.property!=="opacity")||plan.replay==="dash-incomplete"?target.getTotalLength():0;
    const style=getComputedStyle(target);
    const ratio=parseFloat(style.strokeDasharray)/length;
    const resume=returning||plan.replay==="current"||(plan.replay==="active"||plan.replay==="until-clear")&&states.get(target)?.active||plan.replay==="dash-incomplete"&&Number.isFinite(ratio)&&ratio<1;
    const playback={active:true};states.set(target,playback);
    const primary=phase.some(channel=>channel.property==="strokeDasharray")?"strokeDasharray":"opacity";
    const current={opacity:style.opacity,strokeDasharray:style.strokeDasharray,strokeDashoffset:style.strokeDashoffset};
    for(const channel of phase) {
      const values=channel.values.map((value,i)=>{
        if(i===0&&resume) return current[channel.property]==="none"?`${length}px ${length}px`:current[channel.property];
        return channel.property==="opacity"?value as number:(value as number[]).map(coefficient=>coefficient*length+"px").join(" ");
      });
      const interval=channel.intervalEase.some(ease=>ease!=="linear");
      track(onComplete=>animate(target,{[channel.property]:values},{duration:channel.duration/1000,delay:channel.delay/1000,times:channel.offsets,
        ease:interval?channel.intervalEase.slice(0,-1).map(motionEase):motionEase(channel.ease),
        onComplete(){if(channel.property===primary&&plan.replay!=="until-clear")playback.active=false;onComplete();}}));
    }
  }
}
