import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const playbacks = new WeakMap<SVGGElement, { active: boolean }>();
const ease: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const timerRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const [button, hand] = drawing.querySelectorAll("line");
    const interrupted = playbacks.get(drawing)?.active;
    const playback = { active: true };
    playbacks.set(drawing, playback);
    animateSvgTransform(hand, returning, (start) => track((onComplete) => start(() => {
      playback.active = false;
      onComplete();
    })), { rotate: 300 },
      { duration: 0.6, delay: returning ? 0 : 0.1, ease });
    animateSvgTransform(button, returning, track, {
      scale: [interrupted ? null : 0.9, 1], y: [null, 1, 0],
    }, returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { duration: 0.3, ease },
    returning ? { scale: { stiffness: 550, damping: 30 } } : {});
  },
  clear(drawing) {
    playbacks.delete(drawing);
    drawing.querySelectorAll("line").forEach(clearSvgTransform);
  },
} satisfies IconRecipe;
