import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolderKey(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { rotate: [0, -15, 8, -5, 0], x: [0, 0.5, 0] },
    returning
      ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
      : { ease: "easeInOut", duration: 0.9, repeat: Infinity },
  );
}

export const folderKeyRecipe = {
  finish: "hold",
  animate: animateFolderKey,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;
