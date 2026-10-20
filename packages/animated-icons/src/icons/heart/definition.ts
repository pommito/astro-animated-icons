import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const heart: SvgVariants = { normal: { scale: 1 }, animate: { scale: [1, 1.08, 1] } };

export const heartRecipe = createSvgPartsRecipe([
  { selector: "svg", variants: heart, transition: { duration: 0.45, repeat: 2 } },
]);
