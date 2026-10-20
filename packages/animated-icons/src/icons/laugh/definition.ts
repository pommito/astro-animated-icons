import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const faceVariants: SvgVariants = {
  normal: {
    scale: 1,
    rotate: 0,
    strokeWidth: 2,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    scale: [1, 1.15, 1, 1.1, 1.05],
    rotate: [0, 3, -2, 3, 0],
    strokeWidth: [2, 2.5, 2.5, 2.5, 2],
    transition: {
      duration: 1.2,
      times: [0, 0.2, 0.4, 0.6, 1],
      ease: "easeInOut",
      repeat: 0,
      repeatType: "reverse",
    },
  },
};

const mouthVariants: SvgVariants = {
  normal: {
    d: "M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z",
    pathLength: 1,
    strokeWidth: 2,
    scaleY: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    d: "M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z",
    pathLength: [0.7, 1, 1],
    strokeWidth: 2.5,
    scaleY: [1, 1.2, 1.1],
    y: [0, 0.5, 0.3],
    transition: {
      duration: 0.6,
      times: [0, 0.5, 1],
      ease: "easeInOut",
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
    scale: [1, 1.3, 1, 1.7],
    opacity: [1, 1, 1, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

export const laughRecipe = createSvgPartsRecipe([
  { selector: "svg", variants: faceVariants },
  { selector: "[data-part=mouth]", variants: mouthVariants },
  { selector: "[data-part=left-eye]", variants: eyeVariants },
  { selector: "[data-part=right-eye]", variants: eyeVariants },
]);
