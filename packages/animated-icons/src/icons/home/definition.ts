import type { IconRecipe, IconTrack } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export function animateHome(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animatePathReveal(drawing.querySelector<SVGPathElement>("path:last-child")!, returning, track, {
    duration: 0.6,
    opacityDuration: 0.2,
    ease: "easeOut",
  });
}

export function clearHome(drawing: SVGGElement) {
  clearPathReveal(drawing.querySelector<SVGPathElement>("path:last-child")!);
}

export const homeRecipe = {
  finish: "hold",
  animate: animateHome,
  clear: clearHome,
} satisfies IconRecipe;
