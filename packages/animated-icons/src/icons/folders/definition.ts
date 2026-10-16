import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolders(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { x: -2, y: 2 },
    { type: "spring", stiffness: 250, damping: 25 },
  );
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="1"]')!,
    returning,
    track,
    { x: 2, y: -2, scale: 0.9, opacity: 0 },
    { type: "spring", stiffness: 250, damping: 25 },
  );
}

export const foldersRecipe = {
  finish: "hold",
  animate: animateFolders,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="1"]')!);
  },
} satisfies IconRecipe;
