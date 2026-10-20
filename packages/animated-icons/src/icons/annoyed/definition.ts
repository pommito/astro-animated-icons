import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const faceVariants: SvgVariants = {
  normal: {
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  animate: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const mouthVariants: SvgVariants = {
  normal: {
    scaleX: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  animate: {
    scaleX: 0.8,
    y: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const leftEyebrowVariants: SvgVariants = {
  normal: {
    rotate: 0,
    y: 0,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  animate: {
    rotate: 15,
    y: -1,
    x: -0.5,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

const rightEyebrowVariants: SvgVariants = {
  normal: {
    rotate: 0,
    y: 0,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  animate: {
    rotate: 15,
    y: -1,
    x: 0.5,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      delay: 0.05,
    },
  },
};

export const annoyedRecipe = createSvgPartsRecipe([
  { selector: "svg", variants: faceVariants },
  { selector: "[data-part=mouth]", variants: mouthVariants },
  { selector: "[data-part=left-eyebrow]", variants: leftEyebrowVariants },
  { selector: "[data-part=right-eyebrow]", variants: rightEyebrowVariants },
]);
