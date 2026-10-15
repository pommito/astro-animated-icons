import { animate } from "motion/mini";

export const checkPath = "M4 12 9 17L20 6";

export function animateCheck(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  const path = drawing.querySelector("path")!;
  const length = path.getTotalLength();
  const fullPath = `${length}px ${length}px`;
  let remaining = 3;
  const options = {
    duration: returning ? 0.3 : 0.4,
    ease: "easeInOut" as const,
    onComplete: () => {
      onComplete(--remaining === 0 && returning);
    },
  };

  return [
    animate(path, { opacity: returning ? 1 : [0, 1] }, { ...options, duration: 0.1 }),
    animate(path, { strokeDasharray: returning ? fullPath : [`0px ${length}px`, fullPath] }, options),
    animate(path, { transform: returning ? "scale(1)" : ["scale(0.5)", "scale(1)"] }, options),
  ];
}
