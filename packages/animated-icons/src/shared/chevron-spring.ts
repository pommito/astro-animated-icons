import { spring } from "motion";
import { animate } from "motion/mini";
import type { IconTrack } from "../element";
import { clearChevron } from "./chevron";

const velocities = new WeakMap<SVGPathElement, number>();

export function clearChevronSpring(drawing: SVGGElement) {
  drawing.querySelectorAll<SVGPathElement>("[data-chevron]").forEach((path) => velocities.delete(path));
  clearChevron(drawing);
}

export function animateChevronSpring(drawing: SVGGElement, returning: boolean, track: IconTrack, axis: "X" | "Y", targets: number[]) {
  drawing.querySelectorAll<SVGPathElement>("[data-chevron]").forEach((path, index) => {
    const position = () => {
      const matrix = new DOMMatrix(getComputedStyle(path).transform);
      return axis === "X" ? matrix.m41 : matrix.m42;
    };
    const origin = position();
    const generator = spring({ keyframes: [origin, returning ? 0 : targets[index]], velocity: velocities.get(path) ?? 0, stiffness: 250, damping: 25 });
    const frames = [`translate${axis}(${origin}px)`];
    let time = 0;
    let state;
    // Mini normalizes spring distances; sample the upstream spring in SVG units.
    do {
      time += 5;
      state = generator.next(time);
      frames.push(`translate${axis}(${state.value}px)`);
    } while (!state.done && time < 2000);
    track((onComplete) => {
      const animation = animate(path, { transform: frames }, { duration: time / 1000, ease: "linear", onComplete });
      return {
        stop() {
          const time = animation.time;
          let velocity = 0;
          if (time > 0) {
            const current = position();
            const interval = Math.min(time, 0.005);
            animation.time = time - interval;
            velocity = (current - position()) / interval;
            animation.time = time;
          }
          velocities.set(path, velocity);
          animation.stop();
        },
        cancel() { animation.cancel(); },
      };
    });
  });
}
