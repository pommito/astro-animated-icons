import { svgEffect } from "motion";
import type { IconRecipe } from "../../element";
import { animateSequence } from "../../shared/sequence";
import { animateSvgPart, clearSvgPart, createSvgPartsRecipe, type SvgPart } from "../../shared/svg-parts";

const movement = createSvgPartsRecipe([{
  selector: "svg",
  variants: {
    normal: { y: 0, rotate: 0 },
    animate: { y: [0, 1, 2, 0], rotate: [0, -15, 0], transition: { duration: 1.5, ease: "easeInOut" } },
  },
}]);
const signals: SvgPart[] = [1, 2].map(custom => ({
  selector: `[data-part='${custom + 1}']`,
  variants: {
    normal: { opacity: 1, transition: { duration: 1.1 } },
    animate: { opacity: 0, transition: { duration: 1.1 } },
  },
}));
const reveal = signals.map((part, index): SvgPart => ({
  ...part,
  variants: {
    ...part.variants,
    animate: { opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20, delay: (index + 1) * 0.1 } },
  },
}));

export const satelliteDishRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    // A previous reveal must not seed the next spring with opacity from before the native fade.
    for (const part of signals) svgEffect.state(drawing.querySelector<SVGElement>(part.selector)!)?.release();
    movement.animate(drawing, returning, track);
    const play = (parts: SvgPart[], returning: boolean, phaseTrack: typeof track) => {
      for (const part of parts) animateSvgPart(drawing.querySelector<SVGElement>(part.selector)!, part, returning, phaseTrack);
    };
    if (returning) play(signals, true, track);
    else animateSequence(track, [
      track => play(signals, false, track),
      track => play(reveal, false, track),
    ]);
  },
  clear(drawing) {
    movement.clear(drawing);
    for (const part of signals) clearSvgPart(drawing.querySelector<SVGElement>(part.selector)!, part);
  },
};
