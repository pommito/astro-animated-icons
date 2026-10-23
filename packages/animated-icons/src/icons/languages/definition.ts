import { spring } from "motion";
import type { IconRecipe } from "../../element";
import { animateSvgPart, clearSvgPart, type SvgPart } from "../../shared/svg-parts";

const revealSpring = spring({ keyframes: [0, 1], duration: 500, bounce: 0 });
const pathLengths = Array.from({ length: 101 }, (_, index) => revealSpring.next(index * 5).value);

const parts: SvgPart[] = [3, 2, 1, 0, 3, 3].map((custom, index) => ({
  selector: `[data-part='${index}']`,
  variants: {
    normal: { opacity: 1, pathLength: 1, pathOffset: 0 },
    animate: {
      opacity: [0, 1], pathLength: pathLengths, pathOffset: [1, 0],
      transition: {
        opacity: { duration: 0.01, delay: custom * 0.1 },
        pathLength: { duration: 0.5, ease: "linear", delay: custom * 0.1 },
        pathOffset: { duration: 0.3, ease: "easeOut" },
      },
    },
  },
}));

export const languagesRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    for (const part of parts) {
      const path = drawing.querySelector<SVGElement>(part.selector)!;
      const currentLength = parseFloat(path.style.strokeDasharray);
      const interrupted = !returning && currentLength > 0 && currentLength < 1;
      const variants = interrupted ? {
        ...part.variants,
        animate: { ...part.variants.animate, pathLength: pathLengths.map(value => currentLength + (1 - currentLength) * value) },
      } : part.variants;
      animateSvgPart(path, { ...part, variants }, returning, track);
    }
  },
  clear(drawing) {
    for (const part of parts) clearSvgPart(drawing.querySelector(part.selector)!, part);
  },
} satisfies IconRecipe;
