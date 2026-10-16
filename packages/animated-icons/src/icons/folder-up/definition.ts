import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolderUp(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { y: [0, -2, 0] },
    { ease: "easeOut", duration: 0.5, times: [0, 0.4, 1] },
  );
}

export const folderUpRecipe = {
  finish: "hold",
  animate: animateFolderUp,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;
