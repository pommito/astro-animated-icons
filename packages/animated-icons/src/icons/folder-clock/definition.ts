import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolderClock(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { rotate: 360 },
    { ease: [0.4, 0, 0.2, 1], duration: 0.6 },
  );
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="1"]')!,
    returning,
    track,
    { rotate: 45 },
    { ease: "easeInOut", duration: 0.5 },
  );
}

export const folderClockRecipe = {
  finish: "hold",
  animate: animateFolderClock,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="1"]')!);
  },
} satisfies IconRecipe;
