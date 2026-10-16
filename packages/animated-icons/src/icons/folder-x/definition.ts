import type { IconRecipe, IconTrack } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

function animateFolderX(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!, returning, track, {
    ease: [0.25, 0.1, 0.35, 1],
    duration: 0.3,
    opacityDuration: 0.3,
    opacityDelay: 0,
    opacityEase: [0.25, 0.1, 0.35, 1],
  });
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="1"]')!, returning, track, {
    ease: [0.25, 0.1, 0.35, 1],
    duration: 0.3,
    delay: 0.2,
    opacityDuration: 0.3,
    opacityDelay: 0.2,
    opacityEase: [0.25, 0.1, 0.35, 1],
  });
}

export const folderXRecipe = {
  finish: "hold",
  animate: animateFolderX,
  clear(drawing) {
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!);
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="1"]')!);
  },
} satisfies IconRecipe;
