import type { IconRecipe, IconTrack } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

function animateFolderPlus(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!, returning, track, {
    ...(returning ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 } : { ease: "easeInOut", duration: 0.4, delay: 0.1 }),
    opacityDuration: 0.3,
    opacityDelay: returning ? 0 : 0.1,
    opacityEase: [0.25, 0.1, 0.35, 1],
  });
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="1"]')!, returning, track, {
    ...(returning ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 } : { ease: "easeInOut", duration: 0.4, delay: 0 }),
    opacityDuration: 0.3,
    opacityDelay: 0,
    opacityEase: [0.25, 0.1, 0.35, 1],
  });
}

export const folderPlusRecipe = {
  finish: "hold",
  animate: animateFolderPlus,
  clear(drawing) {
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!);
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="1"]')!);
  },
} satisfies IconRecipe;
