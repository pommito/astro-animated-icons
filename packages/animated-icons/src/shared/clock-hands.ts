import type { IconRecipe, IconTrack } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function animateClockHands(drawing: SVGGElement, returning: boolean, track: IconTrack, direction = 1) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { rotate: direction * 360 },
    { ease: [0.4, 0, 0.2, 1], duration: 0.6 },
  );
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="1"]')!,
    returning,
    track,
    { rotate: direction * 45 },
    { ease: "easeInOut", duration: 0.5 },
  );
}

export const clockHandsRecipe = {
  finish: "hold",
  animate: animateClockHands,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="1"]')!);
  },
} satisfies IconRecipe;
