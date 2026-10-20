import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const VARIANTS: SvgVariants = {
  normal: {
    rotate: 0,
  },
  animate: {
    rotate: [-10, -10, 0],
    transition: {
      duration: 0.8,
      times: [0, 0.5, 1],
      ease: "easeInOut",
    },
  },
};

const CLAP_VARIANTS: SvgVariants = {
  normal: {
    rotate: 0,
  },
  animate: {
    rotate: [0, -10, 16, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

export const clapRecipe = createSvgPartsRecipe([
  { selector: "[data-part=outer]", variants: VARIANTS },
  { selector: "[data-part=inner]", variants: CLAP_VARIANTS },
]);
