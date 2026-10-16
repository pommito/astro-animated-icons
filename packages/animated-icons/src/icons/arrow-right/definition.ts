import type { IconRecipe, IconTrack } from "../../element";
import { spring } from "motion";
import { animate } from "motion/mini";

export const arrowRightPaths = ["M5 12h14", "m12 5 7 7-7 7"];

const velocities = new WeakMap<SVGGElement, number>();

export function clearArrowRight(drawing: SVGGElement) {
  velocities.delete(drawing);
  drawing.querySelectorAll("path").forEach((path) => {
    path.style.removeProperty("transform");
    path.style.removeProperty("stroke-dasharray");
  });
}

export function animateArrowRight(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  const [shaft, head] = drawing.querySelectorAll("path");
  const length = shaft.getTotalLength();
  const fullShaft = `${length}px ${length}px`;
  shaft.style.strokeDasharray ||= fullShaft;
  const origin = new DOMMatrix(getComputedStyle(head).transform).m41;
  let headFrames: (string | null)[] = [null, "translateX(-3px)", "translateX(0px)"];
  let duration = 0.4;

  if (returning) {
    const generator = spring({ keyframes: [origin, 0], velocity: velocities.get(drawing) ?? 0, stiffness: 500, damping: 25, mass: 1, restSpeed: 10, restDelta: 0.005 });
    // Mini normalizes spring distances; sample in SVG units to preserve interruption velocity.
    const positions = [origin];
    let time = 0;
    let state;
    do {
      time += 5;
      state = generator.next(time);
      positions.push(state.value);
    } while (!state.done && time < 2000);
    duration = time / 1000;
    headFrames = positions.map((position) => `translateX(${position}px)`);
  }

  track((onComplete) => {
    const headAnimation = animate(head, { transform: headFrames }, {
      duration,
      ease: returning ? "linear" : ["easeOut", "easeOut"],
      onComplete,
    });
    return {
      stop() {
        const time = headAnimation.time;
        if (time > 0) {
          const current = new DOMMatrix(getComputedStyle(head).transform).m41;
          headAnimation.time = Math.max(0, time - 0.005);
          const previous = new DOMMatrix(getComputedStyle(head).transform).m41;
          headAnimation.time = time;
          velocities.set(drawing, (current - previous) / Math.min(time, 0.005));
        }
        headAnimation.stop();
      },
      cancel() { headAnimation.cancel(); },
    };
  });
  track((onComplete) => animate(shaft, { strokeDasharray: returning ? fullShaft : [null, `${length - 5}px ${length}px`, fullShaft] }, {
    duration: returning ? 0.3 : 0.4,
    ease: returning ? [0.25, 0.1, 0.35, 1] : ["easeOut", "easeOut"],
    onComplete,
  }));
}

export const arrowRightRecipe = {
  finish: "restore",
  animate: animateArrowRight,
  clear: clearArrowRight,
} satisfies IconRecipe;
