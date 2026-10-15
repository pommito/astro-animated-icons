import { animate } from "motion/mini";

export function animateBot(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  const eyes = [...drawing.querySelectorAll("line")];
  let remaining = eyes.length * 2;
  const options: NonNullable<Parameters<typeof animate>[2]> = {
    duration: returning ? 0.3 : 0.5,
    delay: returning ? 0 : 0.2,
    ease: returning ? [0.25, 0.1, 0.35, 1] : ["easeInOut", "easeInOut"],
    onComplete: () => onComplete(--remaining === 0),
  };

  return eyes.flatMap((eye) => [
    // A centered zero-length dash retains the round cap at the closed-eye midpoint.
    animate(eye, { strokeDasharray: returning ? "2px 4px" : ["2px 4px", "0px 4px", "2px 4px"] }, options),
    animate(eye, { strokeDashoffset: returning ? "0px" : ["0px", "-1px", "0px"] }, options),
  ]);
}
