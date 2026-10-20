import { createShapeTransformRecipe } from "../../shared/shape-transform";

const transition = { duration: 0.8, ease: "easeInOut", times: [0, 0.4, 0.6, 1] } as const;
const returning = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } as const;

export const layoutGridRecipe = createShapeTransformRecipe([
  { child: 0, targets: { translateX: [null, 11, 11, 0] }, transition: { ...transition, times: [...transition.times] }, returning },
  { child: 1, targets: { y: [null, 11, 11, 0] }, transition: { ...transition, times: [...transition.times] }, returning },
  { child: 2, targets: { translateX: [null, -11, -11, 0] }, transition: { ...transition, times: [...transition.times] }, returning },
  { child: 3, targets: { y: [null, -11, -11, 0] }, transition: { ...transition, times: [...transition.times] }, returning },
]);
