import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolderCode(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { x: [0, -2, 0], rotate: [0, 8, 0] },
    returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { ease: "easeInOut", duration: 0.5 },
  );
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="1"]')!,
    returning,
    track,
    { x: [0, 2, 0], rotate: [0, -8, 0] },
    returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { ease: "easeInOut", duration: 0.5 },
  );
}

export const folderCodeRecipe = {
  finish: "hold",
  animate: animateFolderCode,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="1"]')!);
  },
} satisfies IconRecipe;
