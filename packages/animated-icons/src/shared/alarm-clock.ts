import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

const played = new WeakSet<SVGGElement>();
const spring = { type: "spring" as const, stiffness: 200, damping: 25 };

export const alarmClockRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    for (const shake of drawing.querySelectorAll<SVGGElement>("[data-shake]")) {
      const amplitude = Number(shake.dataset.shake);
      const lift = shake.querySelector<SVGGElement>("[data-lift]")!;
      animateSvgTransform(shake, returning, track, {
        x: [played.has(drawing) ? null : -amplitude, amplitude, -amplitude, amplitude, -amplitude, 0],
      }, returning ? spring : { duration: 0.3, ease: [0, 0, 1, 1], repeat: Infinity });
      animateSvgTransform(lift, returning, track, { y: amplitude === 1 ? -1.5 : -2.5 }, spring);
    }
    played.add(drawing);
  },
  clear(drawing) {
    played.delete(drawing);
    drawing.querySelectorAll<SVGGElement>("[data-shake], [data-lift]").forEach(clearSvgTransform);
  },
} satisfies IconRecipe;
