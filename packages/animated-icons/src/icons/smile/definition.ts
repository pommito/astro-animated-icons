import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const faceVariants: SvgVariants = {
  normal: {
    scale: 1,
    rotate: 0,
    strokeWidth: 2,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.15, 1.05, 1.1],
    rotate: [0, -3, 3, 0],
    strokeWidth: [2, 2.5, 2.5, 2.5],
    transition: {
      duration: 0.8,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const mouthVariants: SvgVariants = {
  normal: {
    d: "M8 14s1.5 2 4 2 4-2 4-2",
    pathLength: 1,
    pathOffset: 0,
    strokeWidth: 2,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    d: "M7 13.5s2.5 3.5 5 3.5 5-3.5 5-3.5",
    pathLength: [0.3, 1, 1],
    pathOffset: [0, 0, 0],
    strokeWidth: 2.5,
    transition: {
      d: { duration: 0.4, ease: "easeOut" },
      pathLength: {
        duration: 0.5,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
      delay: 0.1,
    },
  },
};

const eyeVariants: SvgVariants = {
  normal: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.5, 0.8, 1.2],
    opacity: [1, 1, 1, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

export const smileRecipe = createSvgPartsRecipe([
  { selector: "svg", variants: faceVariants },
  { selector: "[data-part=mouth]", variants: mouthVariants },
  { selector: "[data-part=left-eye]", variants: eyeVariants },
  { selector: "[data-part=right-eye]", variants: eyeVariants },
]);
