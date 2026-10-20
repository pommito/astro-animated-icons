import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const variants: SvgVariants = {
normal: { scale: 1, rotate: 0 },
animate: {
  scale: [1, 0.9, 1, 1, 1, 1, 1],
  rotate: [0, 0, 0, -7, 7, -3, 0],
  transition: {
    duration: 0.7,

    times: [0, 0.15, 0.3, 0.4, 0.55, 0.75, 1],
    ease: "easeInOut",
  },
},
        };

export const heartHandshakeRecipe = createSvgPartsRecipe([
  { selector: "svg", variants },
]);
