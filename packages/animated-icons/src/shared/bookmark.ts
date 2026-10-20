import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

const markPlaybacks = new WeakMap<SVGElement, { active: boolean }>();

export function createBookmarkRecipe(fadeMark = false): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      animateSvgTransform(drawing.children[0] as SVGElement, returning, track,
        { scaleX: [null, 0.9, 1.1, 0.95, 1], scaleY: [null, 1.3, 0.9, 1.05, 1] },
        returning ? { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 } : { duration: 0.6, ease: "easeOut" });
      [...drawing.children].slice(1).forEach((element, index) => {
        const mark = element as SVGElement;
        const interrupted = markPlaybacks.get(mark)?.active;
        const playback = { active: true };
        markPlaybacks.set(mark, playback);
        track(onComplete => animate(mark, { strokeDashoffset: returning ? 0 : [interrupted ? mark.style.strokeDashoffset || 1 : 1, 0] },
          { duration: 0.3, delay: returning ? 0 : index * 0.1, ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut", onComplete() { playback.active = false; onComplete(); } }));
        if (fadeMark) track(onComplete => animate(mark, { opacity: returning ? 1 : [interrupted ? mark.style.opacity || 0 : 0, 1] },
          { duration: 0.3, ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut", onComplete }));
      });
    },
    clear(drawing) {
      clearSvgTransform(drawing.children[0] as SVGElement);
      [...drawing.children].slice(1).forEach(element => {
        markPlaybacks.delete(element as SVGElement);
        (element as SVGElement).style.removeProperty("stroke-dashoffset");
        (element as SVGElement).style.removeProperty("opacity");
      });
    },
  };
}
