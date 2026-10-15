import { animate } from "motion/mini";

export const arrowLeftPaths = ["m12 19-7-7 7-7", "M19 12H5"];

export function animateArrowLeft(drawing: SVGGElement, returning: boolean, onComplete: () => void) {
  const [head, shaft] = drawing.querySelectorAll("path");
  let remaining = 2;
  const options = {
    duration: returning ? 0.12 : 0.4,
    ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
    onComplete: () => {
      if (--remaining === 0) onComplete();
    },
  };
  return [
    animate(head, { transform: returning ? "translateX(0px)" : [null, "translateX(3px)", "translateX(0px)"] }, options),
    animate(shaft, { transform: returning ? "scaleX(1)" : [null, `scaleX(${9 / 14})`, "scaleX(1)"] }, options),
  ];
}
