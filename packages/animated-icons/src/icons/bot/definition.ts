import type { IconRecipe, IconTrack } from "../../element";
import { animate } from "motion/mini";

export function animateBot(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  const eyes = [...drawing.querySelectorAll("line")];
  const options: NonNullable<Parameters<typeof animate>[2]> = {
    duration: returning ? 0.3 : 0.5,
    delay: returning ? 0 : 0.2,
    ease: returning ? [0.25, 0.1, 0.35, 1] : ["easeInOut", "easeInOut"],
  };

  eyes.forEach((eye) => {
    // A centered zero-length dash retains the round cap at the closed-eye midpoint.
    track((onComplete) => animate(eye, { strokeDasharray: returning ? "2px 4px" : ["2px 4px", "0px 4px", "2px 4px"] }, { ...options, onComplete }));
    track((onComplete) => animate(eye, { strokeDashoffset: returning ? "0px" : ["0px", "-1px", "0px"] }, { ...options, onComplete }));
  });
}

export function clearBot(drawing: SVGGElement) {
  for (const eye of drawing.querySelectorAll("line")) {
    eye.style.removeProperty("stroke-dasharray");
    eye.style.removeProperty("stroke-dashoffset");
  }
}

export const botRecipe = {
  finish: "restore",
  animate: animateBot,
  clear: clearBot,
} satisfies IconRecipe;
