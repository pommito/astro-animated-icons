import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolderOpen(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { rotate: [0, -8, 6, -4, 0] },
    returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { ease: "easeOut", duration: 0.6 },
  );
}

export const folderOpenRecipe = {
  finish: "hold",
  animate: animateFolderOpen,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;
