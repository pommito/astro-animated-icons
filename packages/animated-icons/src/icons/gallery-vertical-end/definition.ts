import { createShapeTransformRecipe } from "../../shared/shape-transform";

export const galleryVerticalEndRecipe = createShapeTransformRecipe([
  { child: 0, targets: { y: [2, 0], opacity: [0, 1] }, transition: { duration: 0.3, delay: 0.25 }, returning: { duration: 0.3 } },
  { child: 1, targets: { y: [4, 0], opacity: [0, 1] }, transition: { duration: 0.3 }, returning: { duration: 0.3 } },
]);
