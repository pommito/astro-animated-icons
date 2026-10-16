import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolderCog(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { rotate: 180 },
    { type: "spring", stiffness: 50, damping: 10 },
  );
}

export const folderCogRecipe = {
  finish: "hold",
  animate: animateFolderCog,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
  },
} satisfies IconRecipe;
