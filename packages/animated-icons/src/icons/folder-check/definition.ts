import type { IconRecipe, IconTrack } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

function animateFolderCheck(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!, returning, track, {
    ...(returning ? { ease: "easeOut", duration: 0.3 } : { ease: "easeInOut", duration: 0.4 }),
    opacityDuration: returning ? 0.3 : 0.4,
    opacityDelay: 0,
    opacityEase: returning ? "easeOut" : "easeInOut",
  });
}

export const folderCheckRecipe = {
  finish: "hold",
  animate: animateFolderCheck,
  clear(drawing) {
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;
