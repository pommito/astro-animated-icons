import { createSvgPartsRecipe, type SvgPart } from "../../shared/svg-parts";

const transition = { duration: 1.4, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" as const };
const paths: SvgPart[] = [
  { indices: [0], length: 0.4, offset: 0.25 },
  { indices: [1], length: 0.5, offset: 0.25 },
  { indices: [2, 3], length: 0.8, offset: 0.07 },
  { indices: [5, 7], length: 0.8, offset: 0.14 },
].map(({ indices, length, offset }) => ({
  selector: indices.map(index => `[data-part='${index}']`).join(", "),
  variants: {
    normal: { pathLength: 1, pathOffset: 0 },
    animate: { pathLength: [1, length, 1], pathOffset: [0, offset, 0], transition },
  },
}));

export const brainRecipe = createSvgPartsRecipe([
  {
    selector: "svg",
    variants: {
      normal: { scale: 1, strokeWidth: 2 },
      animate: { scale: [1, 1.08, 1], strokeWidth: [2, 2.25, 2], transition },
    },
  },
  ...paths,
]);
