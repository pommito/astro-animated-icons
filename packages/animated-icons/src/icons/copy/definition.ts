import { spring } from "motion";
import { animate } from "motion/mini";

export const copyPath = "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2";

export function animateCopy(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  let remaining = 2;
  const options = {
    type: spring,
    stiffness: 160,
    damping: 17,
    mass: 1,
    onComplete: () => {
      onComplete(--remaining === 0 && returning);
    },
  };
  return [
    animate(drawing.querySelector("rect")!, { transform: returning ? "translate(0px, 0px)" : "translate(-3px, -3px)" }, options),
    animate(drawing.querySelector("path")!, { transform: returning ? "translate(0px, 0px)" : "translate(3px, 3px)" }, options),
  ];
}
