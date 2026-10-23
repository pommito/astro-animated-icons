import { createSvgPartsRecipe, type SvgPart } from "../../shared/svg-parts";

const strips: SvgPart[] = [
  { part: 2, delay: 0.04 },
  { part: 3, delay: 0.08 },
  { part: 4, delay: 0.12 },
  { part: 6, delay: 0 },
].map(({ part, delay }) => ({
  selector: `[data-part='${part}']`,
  variants: {
    normal: { y: 0, opacity: 1 },
    animate: { y: 3, opacity: [0, 1, 0], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut", delay } },
  },
}));

export const shredderRecipe = createSvgPartsRecipe([
  {
    selector: "[data-paper]",
    variants: {
      normal: { x: 0 },
      animate: { x: [0, 1.5, -1.5, 1, -1, 0.5, -0.5, 0], transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity } },
    },
  },
  ...strips,
]);
