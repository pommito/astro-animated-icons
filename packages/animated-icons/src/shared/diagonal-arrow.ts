import type { IconTrack } from "../element";
import { spring } from "motion";
import { animate } from "motion/mini";

const velocities = new WeakMap<SVGGElement, number[]>();
const identity = "translate(0px, 0px) scale(1)";

function pose(drawing: SVGGElement) {
  const matrix = new DOMMatrix(getComputedStyle(drawing).transform);
  return [matrix.m41, matrix.m42, matrix.a];
}

function transform([x, y, scale]: number[]) {
  return `translate(${x}px, ${y}px) scale(${scale})`;
}

export function clearDiagonalArrow(drawing: SVGGElement) {
  velocities.delete(drawing);
  drawing.style.removeProperty("transform");
}

export function animateDiagonalArrow(drawing: SVGGElement, returning: boolean, track: IconTrack, direction: -1 | 1) {
  let frames = [identity, `translate(${direction * 4}px, 4px) scale(0.85)`, identity];
  let duration = 0.5;
  if (returning) {
    const origin = pose(drawing);
    const velocity = velocities.get(drawing) ?? [0, 0, 0];
    const targets = [0, 0, 1];
    const generators = origin.map((value, index) => spring({
      keyframes: [value, targets[index]],
      velocity: velocity[index],
      stiffness: index === 2 ? 550 : 500,
      damping: index === 2 ? 30 : 25,
      mass: 1,
      restSpeed: 10,
      restDelta: 0.005,
    }));
    const finished = [false, false, false];
    frames = [transform(origin)];
    let time = 0;
    // Mini normalizes spring distances; sample each upstream spring in SVG units.
    do {
      time += 5;
      frames.push(transform(generators.map((generator, index) => {
        if (finished[index]) return targets[index];
        const state = generator.next(time);
        finished[index] = state.done;
        return state.value;
      })));
    } while (!finished.every(Boolean) && time < 2000);
    duration = time / 1000;
  }

  track((onComplete) => {
    const animation = animate(drawing, { transform: frames }, {
      duration,
      ease: returning ? "linear" : ["easeInOut", "easeInOut"],
      onComplete,
    });
    return {
      stop() {
        const time = animation.time;
        const current = pose(drawing);
        let velocity = [0, 0, 0];
        if (time > 0) {
          const interval = Math.min(time, 0.005);
          animation.time = time - interval;
          const previous = pose(drawing);
          animation.time = time;
          velocity = current.map((value, index) => (value - previous[index]) / interval);
        }
        velocities.set(drawing, velocity);
        animation.stop();
      },
      cancel() { animation.cancel(); },
    };
  });
}
