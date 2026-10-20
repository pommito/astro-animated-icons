import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const faceVariants: SvgVariants = {
  normal: {
    scale: 1,
    rotate: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.05, 0.98, 1.02],
    rotate: [0, 1, -1, 0],
    transition: {
      duration: 0.7,
      times: [0, 0.4, 0.7, 1],
      ease: "easeInOut",
    },
  },
};

const mouthVariants: SvgVariants = {
  normal: {
    scaleX: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scaleX: [1, 1.2, 0.9, 1.1],
    y: [0, 0.5, -0.5, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
      delay: 0.1,
    },
  },
};

const leftEyeVariants: SvgVariants = {
  normal: {
    scale: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.3, 1, 1.2],
    x: [0, -0.3, 0.3, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const rightEyeVariants: SvgVariants = {
  normal: {
    scale: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.3, 1, 1.2],
    x: [0, 0.3, -0.3, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

export const mehRecipe = createSvgPartsRecipe([
  { selector: "svg", variants: faceVariants },
  { selector: "[data-part=mouth]", variants: mouthVariants },
  { selector: "[data-part=left-eye]", variants: leftEyeVariants },
  { selector: "[data-part=right-eye]", variants: rightEyeVariants },
]);
