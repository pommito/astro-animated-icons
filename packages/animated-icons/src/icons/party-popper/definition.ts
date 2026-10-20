import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const LINES_VARIANTS: SvgVariants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    translateX: 0,
    y: 0,
  },
  animate: {
    opacity: [0, 1],
    scale: [0.3, 0.8, 1, 1.1, 1],
    pathLength: [0, 0.5, 1],
    translateX: [-5, 0],
    y: [5, 0],
    transition: {
      duration: 0.7,
      velocity: 0.3,
    },
  },
};

const DOTS_VARIANTS: SvgVariants = {
  normal: { opacity: 1, scale: 1, translateX: 0, y: 0 },
  animate: {
    opacity: [0, 1],
    translateX: [-5, 0],
    y: [5, 0],
    scale: [0.5, 0.8, 1, 1.1, 1],
    transition: {
      duration: 0.7,
    },
  },
};

const POPPER_VARIANTS: SvgVariants = {
  normal: { translateX: 0, y: 0 },
  animate: {
    translateX: [-1.5, 0],
    y: [1.5, 0],
    transition: {
      velocity: 0.3,
    },
  },
};

export const partyPopperRecipe = createSvgPartsRecipe([
  { selector: "[data-part=cone]", variants: POPPER_VARIANTS },
  { selector: "[data-part=dot]", variants: DOTS_VARIANTS },
  { selector: "[data-part=confetti]", variants: LINES_VARIANTS },
]);
