import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const upvoteRecipe = createSvgPartsRecipe([{
  selector: "svg",
  origin: "50% 50%",
  variants: {
    normal: { x: 0, y: 0, rotate: 0 },
    animate: { x: -1, y: -2, rotate: -12 },
  },
  transition: { type: "spring", stiffness: 250, damping: 25 },
}]);
