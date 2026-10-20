import type { IconRecipe } from "../../element";
import { animateSequence } from "../../shared/sequence";
import { animateSvgPart, clearSvgPart, type SvgPart } from "../../shared/svg-parts";

const lines: SvgPart[] = [0, 1, 2].map(index => ({
  selector: `[data-part='${index + 4}']`,
  variants: {
    normal: { pathLength: 1, opacity: 1 },
    animate: { pathLength: 0, opacity: 0, transition: { delay: index * 0.1, duration: 0.3 } },
  },
}));

export const scanTextRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    if (!returning) for (const part of lines) {
      const line = drawing.querySelector<SVGElement>(part.selector)!;
      if (!line.style.strokeDasharray) line.style.strokeDasharray = "1px 1px";
    }
    const play = (parts: SvgPart[], returning: boolean, phaseTrack: typeof track) => {
      for (const part of parts) animateSvgPart(drawing.querySelector<SVGElement>(part.selector)!, part, returning, phaseTrack);
    };
    if (returning) play(lines, true, track);
    else animateSequence(track, [
      track => play(lines, false, track),
      track => play(lines.map(part => ({ ...part, variants: { ...part.variants, animate: { ...part.variants.animate, pathLength: 1, opacity: 1 } } })), false, track),
    ]);
  },
  clear(drawing) {
    for (const part of lines) clearSvgPart(drawing.querySelector<SVGElement>(part.selector)!, part);
  },
};
