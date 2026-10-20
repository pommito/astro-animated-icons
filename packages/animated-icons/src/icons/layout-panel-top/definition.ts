import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { createShapeTransformRecipe } from "../../shared/shape-transform";

const spring = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } as const;
const transforms = createShapeTransformRecipe([
  { child: 0, targets: { y: [-5, 0] }, transition: { duration: 0.5 }, returning: spring },
  { child: 1, targets: { translateX: [-10, 0] }, transition: { ...spring, delay: 0.3 }, returning: spring },
  { child: 2, targets: { translateX: [10, 0] }, transition: { ...spring, delay: 0.4 }, returning: spring },
]);

export const layoutPanelTopRecipe = {
  ...transforms,
  animate(drawing, returning, track) {
    transforms.animate(drawing, returning, track);
    [...drawing.children].forEach((shape, index) => {
      track(onComplete => animate(shape, { opacity: returning ? 1 : [0, 1] }, {
        duration: returning ? 0.3 : [0.5, 0.7, 0.8][index],
        times: returning ? undefined : [index === 0 ? 0.2 : 0.5, 1],
        ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
        onComplete,
      }));
    });
  },
} satisfies IconRecipe;
