import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const botMessageSquareRecipe = createSvgPartsRecipe([
  {
    selector: "svg",
    variants: {
      normal: { rotate: 0, y: 0, scale: 1 },
      animate: {
        rotate: [0, -3, 3, 0, 0],
        y: [0, 1.5, -1.5, 0],
        scale: [1, 1.03, 1],
        transition: { duration: 1, ease: "easeInOut", repeat: 0 },
      },
    },
  },
  {
    selector: "[data-part='0']",
    variants: {
      normal: { scale: 1 },
      animate: { scale: [1, 1.04, 1], transition: { duration: 0.6, ease: "easeInOut", repeat: 1 } },
    },
  },
  {
    selector: "[data-part='1']",
    variants: {
      normal: { scaleY: 1 },
      animate: { scaleY: [1, 0.1, 1], transition: { duration: 0.4, ease: "easeInOut", delay: 0.1 } },
    },
  },
  {
    selector: "[data-part='2']",
    variants: {
      normal: { scaleY: 1 },
      animate: { scaleY: [1, 0.1, 1], transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 } },
    },
  },
  {
    selector: "[data-part='3']",
    variants: {
      normal: { opacity: 0 },
      animate: { opacity: [0.3, 1, 0.3], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.2, delay: 0 } },
    },
  },
  {
    selector: "[data-part='4']",
    variants: {
      normal: { opacity: 0 },
      animate: { opacity: [0.3, 1, 0.3], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.2, delay: 0.3 } },
    },
  },
  {
    selector: "[data-part='5']",
    variants: {
      normal: { opacity: 0 },
      animate: { opacity: [0.3, 1, 0.3], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.2, delay: 0.6 } },
    },
  },
]);
