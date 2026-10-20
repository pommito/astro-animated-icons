import type { IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";
import { animateSequence } from "../../shared/sequence";

const transition = { type: "spring", stiffness: 100, damping: 14, mass: 1 } as const;

export const layersRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const phase = (returning: boolean, phaseTrack: IconTrack) => {
      [-9, -5].forEach((y, index) => animateSvgTransform(drawing.children[index + 1] as SVGElement,
        returning, phaseTrack, { y }, transition));
    };
    if (returning) phase(true, track);
    else animateSequence(track, [phaseTrack => phase(false, phaseTrack), phaseTrack => phase(true, phaseTrack)]);
  },
  clear(drawing) {
    [...drawing.children].slice(1).forEach(shape => clearSvgTransform(shape as SVGElement));
  },
} satisfies IconRecipe;
