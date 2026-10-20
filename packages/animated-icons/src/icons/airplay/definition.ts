import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";
import { animateSequence } from "../../shared/sequence";

export const airplayRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    const [screen, triangle] = [...drawing.querySelectorAll("path")];
    const phase = (returning: boolean, track: Parameters<IconRecipe["animate"]>[2]) => {
      animatePathReveal(screen, returning, track, { duration: returning ? 0.3 : 0.6, ease: returning ? "easeOut" : "easeInOut", pathOffset: 1, opacityDuration: returning ? 0.3 : 0.6, preservePose: true });
      animateSvgTransform(triangle, returning, track, { scale: [triangle.style.transform ? null : 0.6, 1.1, 1], opacity: [0, 1] }, { duration: returning ? 0.3 : 0.6, ease: "easeOut" });
    };
    animateSequence(track, returning
      ? [track => phase(true, track)]
      : [track => phase(false, track), track => phase(true, track)]);
  },
  clear(drawing) { drawing.querySelectorAll("path").forEach(path => { clearPathReveal(path); clearSvgTransform(path); }); },
} satisfies IconRecipe;
