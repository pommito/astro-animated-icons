import { animate } from "motion/mini";

export const atSignPath = "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8";

export function animateAtSign(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  const circle = drawing.querySelector("circle")!;
  const path = drawing.querySelector("path")!;
  const circleLength = circle.getTotalLength();
  const pathLength = path.getTotalLength();
  let remaining = 5;
  const options = {
    duration: returning ? 0.4 : 0.3,
    ease: "easeInOut" as const,
    onComplete: () => {
      onComplete(--remaining === 0 && returning);
    },
  };
  const outer = { ...options, delay: 0.3, duration: 0.3 };

  return [
    animate(circle, { opacity: returning ? 1 : [0, 1] }, { ...options, duration: 0.1 }),
    animate(circle, { strokeDasharray: returning ? `${circleLength}px ${circleLength}px` : [`0px ${circleLength}px`, `${circleLength}px ${circleLength}px`] }, options),
    animate(circle, { strokeDashoffset: returning ? "0px" : [`${-circleLength}px`, "0px"] }, options),
    animate(path, { opacity: returning ? 1 : [0, 1] }, { ...outer, duration: 0.1 }),
    animate(path, { strokeDasharray: returning ? `${pathLength}px ${pathLength}px` : [`0px ${pathLength}px`, `${pathLength}px ${pathLength}px`] }, outer),
  ];
}
