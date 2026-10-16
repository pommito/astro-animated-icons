import type { IconRecipe, IconTrack } from "../../element";
import { spring } from "motion";
import { animate } from "motion/mini";

export const fileTextPaths = [
  "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
  "M14 2v4a2 2 0 0 0 2 2h4",
  "M10 9H8",
  "M16 13H8",
  "M16 17H8",
];

const velocities = new WeakMap<SVGGElement, number>();

export function clearFileText(drawing: SVGGElement) {
  velocities.delete(drawing);
  drawing.ownerSVGElement!.style.removeProperty("transform");
  drawing.querySelectorAll("path").forEach((path) => path.style.removeProperty("stroke-dasharray"));
}

export function animateFileText(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  const svg = drawing.ownerSVGElement!;
  const origin = new DOMMatrix(getComputedStyle(svg).transform).a;
  let frames: (string | null)[] = [null, "scale(1.05)"];
  let duration = 0.3;

  if (returning) {
    const generator = spring({ keyframes: [origin, 1], velocity: velocities.get(drawing) ?? 0, stiffness: 550, damping: 30, mass: 1, restSpeed: 10, restDelta: 0.005 });
    // Mini normalizes spring distances; sample scale units to retain the upstream rest threshold.
    const scales = [origin];
    let time = 0;
    let state;
    do {
      time += 5;
      state = generator.next(time);
      scales.push(state.value);
    } while (!state.done && time < 2000);
    frames = scales.map((scale) => `scale(${scale})`);
    duration = time / 1000;
  }

  track((onComplete) => {
    const zoom = animate(svg, { transform: frames }, { duration, ease: returning ? "linear" : "easeOut", onComplete });
    return {
      stop() {
        const time = zoom.time;
        if (time > 0) {
          const current = new DOMMatrix(getComputedStyle(svg).transform).a;
          zoom.time = Math.max(0, time - 0.005);
          const previous = new DOMMatrix(getComputedStyle(svg).transform).a;
          zoom.time = time;
          velocities.set(drawing, (current - previous) / Math.min(time, 0.005));
        }
        zoom.stop();
      },
      cancel() { zoom.cancel(); },
    };
  });
  [...drawing.querySelectorAll("path")].slice(2).forEach((path, index) => {
    const length = path.getTotalLength();
    const full = `${length}px ${length}px`;
    path.style.strokeDasharray ||= full;
    return track((onComplete) => animate(path, { strokeDasharray: returning ? full : [full, `0px ${length}px`, full] }, {
      duration: returning ? 0.3 : 0.7,
      delay: returning ? 0 : 0.3 + index * 0.2,
      ease: returning ? [0.25, 0.1, 0.35, 1] : ["easeOut", "easeOut"],
      onComplete,
    }));
  });
}

export const fileTextRecipe = {
  finish: "hold",
  animate: animateFileText,
  clear: clearFileText,
} satisfies IconRecipe;
