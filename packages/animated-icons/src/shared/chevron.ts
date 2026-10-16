import { animate } from "motion/mini";
import type { IconTrack } from "../element";

interface ChevronCycle {
  axis: "X" | "Y";
  values: number[];
  duration: number;
  times: number[];
  ease: "easeOut" | "easeInOut";
  returnDuration?: number;
}

export function clearChevron(drawing: SVGGElement) {
  drawing.querySelectorAll<SVGPathElement>("[data-chevron]").forEach((path) => {
    path.style.removeProperty("transform");
  });
}

export function animateChevronCycle(drawing: SVGGElement, returning: boolean, track: IconTrack, motion: ChevronCycle) {
  const path = drawing.querySelector<SVGPathElement>("[data-chevron]")!;
  track((onComplete) => animate(path, {
    transform: returning ? `translate${motion.axis}(0px)` : motion.values.map((value) => `translate${motion.axis}(${value}px)`),
  }, {
    duration: returning ? motion.returnDuration ?? motion.duration : motion.duration,
    times: returning ? [0, 1] : motion.times,
    ease: returning ? "easeOut" : motion.values.slice(1).map(() => motion.ease),
    onComplete,
  }));
}
