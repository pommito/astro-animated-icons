import type { IconRecipe, IconTrack } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

function animateFolderTree(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!, returning, track, {
    ease: "easeOut",
    duration: 0.35,
    delay: 0.1,
    opacityDuration: 0.3,
    opacityDelay: 0.1,
    opacityEase: [0.25, 0.1, 0.35, 1],
  });
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="1"]')!, returning, track, {
    ease: "easeOut",
    duration: 0.35,
    delay: 0.7999999999999999,
    opacityDuration: 0.3,
    opacityDelay: 0.8,
    opacityEase: [0.25, 0.1, 0.35, 1],
  });
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="2"]')!, returning, track, {
    ease: "easeOut",
    duration: 0.35,
    delay: 0.44999999999999996,
    opacityDuration: 0.3,
    opacityDelay: 0.45,
    opacityEase: [0.25, 0.1, 0.35, 1],
    pathOffset: true,
  });
  animatePathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="3"]')!, returning, track, {
    ease: "easeOut",
    duration: 0.35,
    delay: 1.15,
    opacityDuration: 0.3,
    opacityDelay: 1.15,
    opacityEase: [0.25, 0.1, 0.35, 1],
    pathOffset: true,
  });
}

export const folderTreeRecipe = {
  finish: "hold",
  animate: animateFolderTree,
  clear(drawing) {
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="0"]')!);
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="1"]')!);
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="2"]')!);
    clearPathReveal(drawing.querySelector<SVGGeometryElement>('[data-motion="3"]')!);
  },
} satisfies IconRecipe;
