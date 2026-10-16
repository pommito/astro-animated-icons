import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolderLock(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { y: [0, -1.6, 0], rotate: [0, -3, 2, 0] },
    returning
      ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
      : { ease: "easeInOut", duration: 0.7, repeat: Infinity },
  );
}

export const folderLockRecipe = {
  finish: "hold",
  animate: animateFolderLock,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;
