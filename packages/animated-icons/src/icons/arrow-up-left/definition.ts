import { spring } from "motion";
import { animate } from "motion/mini";

export const arrowUpLeftPaths = ["M7 7H17", "M7 7V17", "M17 17L7 7"];

const velocities = new WeakMap<SVGGElement, { translation: number; scale: number }>();
const rest = "translate(0px, 0px) scale(1)";

export function clearArrowUpLeft(drawing: SVGGElement) {
  velocities.delete(drawing);
  drawing.style.removeProperty("transform");
}

export function animateArrowUpLeft(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  let frames = [rest, "translate(4px, 4px) scale(0.85)", rest];
  let duration = 0.5;

  if (returning) {
    const pose = new DOMMatrix(getComputedStyle(drawing).transform);
    const velocity = velocities.get(drawing);
    const translation = spring({ keyframes: [pose.m41, 0], velocity: velocity?.translation, stiffness: 500, damping: 25, restSpeed: 10 });
    const scale = spring({ keyframes: [pose.a, 1], velocity: velocity?.scale, stiffness: 550, damping: 30, restSpeed: 10 });
    frames = [];
    let time = 0;
    let done = false;
    let position = { value: pose.m41, done: false };
    let size = { value: pose.a, done: false };
    // Sample in SVG units because mini normalizes spring distances before resolving them.
    do {
      if (!position.done) position = { ...translation.next(time) };
      if (!size.done) size = { ...scale.next(time) };
      frames.push(`translate(${position.value}px, ${position.value}px) scale(${size.value})`);
      done = position.done && size.done;
      if (!done) time += 5;
    } while (!done && time < 2000);
    duration = Math.max(time, 5) / 1000;
  }

  const animation = animate(drawing, { transform: frames }, {
    duration,
    ease: returning ? "linear" : ["easeInOut", "easeInOut"],
    onComplete: () => onComplete(true),
  });

  return [{
    stop() {
      const time = animation.time;
      const current = new DOMMatrix(getComputedStyle(drawing).transform);
      const interval = Math.min(time, 0.005);
      if (interval > 0) {
        animation.time = time - interval;
        const previous = new DOMMatrix(getComputedStyle(drawing).transform);
        animation.time = time;
        velocities.set(drawing, {
          translation: (current.m41 - previous.m41) / interval,
          scale: (current.a - previous.a) / interval,
        });
      } else {
        velocities.delete(drawing);
      }
      animation.stop();
    },
    cancel() { animation.cancel(); },
  }];
}
