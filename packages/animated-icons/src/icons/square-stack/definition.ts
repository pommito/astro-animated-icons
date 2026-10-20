import { createShapeTransformRecipe } from "../../shared/shape-transform";

export const squareStackRecipe = createShapeTransformRecipe([
  { child: 0, targets: { scale: [null, 0.9, 1] }, transition: { delay: 0.3, duration: 0.4 } },
  { child: 1, targets: { scale: [null, 0.9, 1] }, transition: { delay: 0.2, duration: 0.2 } },
  { child: 2, targets: { scale: [null, 0.8, 1] }, transition: { duration: 0.4 }, returning: { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 } },
]);
