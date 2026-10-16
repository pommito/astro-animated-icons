import type { IconRecipe, IconTrack } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

function animateFolderMinus(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!, returning, track, {
    ...(returning ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 } : { ease: "easeInOut", duration: 0.4 }),
    opacityDuration: returning ? 0.3 : 0.4,
    opacityDelay: 0,
    opacityEase: returning ? [0.25, 0.1, 0.35, 1] : "easeInOut",
  });
}

export const folderMinusRecipe = {
  finish: "hold",
  animate: animateFolderMinus,
  clear(drawing) {
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;
