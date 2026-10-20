import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const faceVariants: SvgVariants = {
  normal: {
    scale: 1,
    rotate: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.15, 1.05, 1.08],
    rotate: [0, -2, 2, 0],
    transition: {
      duration: 0.8,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const mouthVariants: SvgVariants = {
  normal: {
    d: "M16 16s-1.5-2-4-2-4 2-4 2",
    pathLength: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    d: "M16 17s-1.5-2.5-4-2.5-4 2.5-4 2.5",
    pathLength: [0.3, 1, 1],
    transition: {
      d: { duration: 0.5, ease: "easeOut" },
      pathLength: {
        duration: 0.5,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
      delay: 0.1,
    },
  },
};

const leftEyeVariants: SvgVariants = {
  normal: {
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.3, 0.9, 1.1],
    y: [0, -0.5, 0.3, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const rightEyeVariants: SvgVariants = {
  normal: {
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 0.9, 1.3, 1.1],
    y: [0, -0.5, 0.3, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

export const frownRecipe = createSvgPartsRecipe([
  { selector: "svg", variants: faceVariants },
  { selector: "[data-part=mouth]", variants: mouthVariants },
  { selector: "[data-part=left-eye]", variants: leftEyeVariants },
  { selector: "[data-part=right-eye]", variants: rightEyeVariants },
]);
