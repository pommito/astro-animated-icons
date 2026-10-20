import { animate } from "motion/mini";
import type { IconRecipe, IconTrack } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";
import { animateSequence } from "./sequence";

interface LoopPhase { repeat: number; preservePose?: "until-clear"; restart?: boolean }

function animateVehicleLoop(element: SVGElement, returning: boolean, track: IconTrack, play: (track: IconTrack, phase: LoopPhase) => void) {
  if (!returning && element.style.transform) {
    animateSequence(track, [
      track => play(track, { repeat: 0, preservePose: "until-clear" }),
      track => { clearSvgTransform(element); play(track, { repeat: Infinity, restart: true }); },
    ]);
  } else play(track, { repeat: Infinity });
}

export function createVehicleRecipe({ body, duration, speedDuration, wheel }: {
  body: number[]; duration: number; speedDuration: number;
  wheel: {
    targets: Parameters<typeof animateSvgTransform>[3];
    transition: Parameters<typeof animateSvgTransform>[4];
    returnTransition: Parameters<typeof animateSvgTransform>[4];
  };
}): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      drawing.querySelectorAll<SVGElement>("[data-body]").forEach(group => {
        animateVehicleLoop(group, returning, track, (track, phase) => {
          animateSvgTransform(group, returning, track, { y: body }, returning
            ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
            : { duration, ease: "easeInOut", repeat: phase.repeat, preservePose: phase.preservePose });
        });
      });
      drawing.querySelectorAll<SVGElement>("[data-wheel]").forEach(group => {
        animateVehicleLoop(group, returning, track, (track, phase) => {
          animateSvgTransform(group, returning, track, wheel.targets, returning ? wheel.returnTransition
            : { ...wheel.transition, repeat: phase.repeat, preservePose: phase.preservePose });
        });
      });
      drawing.querySelectorAll<SVGElement>("[data-speed]").forEach((line, index) => {
        animateVehicleLoop(line, returning, track, (track, phase) => {
          const delay = phase.restart ? 0 : index * 0.08;
          animateSvgTransform(line, returning, track, { x: [0, -4, -10, -16], scaleX: [0.2, 1, 0.8, 0.3] }, returning
            ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
            : { duration: speedDuration, delay, times: [0, 0.2, 0.6, 1], ease: "easeOut", repeat: phase.repeat, preservePose: phase.preservePose },
            returning ? { scaleX: { type: "spring", stiffness: 550, damping: 2 * Math.sqrt(550), restSpeed: 10 } } : {}, { scaleX: 0 });
          track(onComplete => animate(line, { opacity: returning ? 0 : [phase.preservePose ? Number(line.style.opacity || 0) : 0, 0.7, 0.5, 0] }, returning
            ? { duration: 0.3, ease: [0.25, 0.1, 0.35, 1], onComplete }
            : { duration: speedDuration, delay, times: [0, 0.2, 0.6, 1], ease: "easeOut", repeat: phase.repeat, onComplete }));
        });
      });
    },
    clear(drawing) {
      drawing.querySelectorAll<SVGElement>("[data-body], [data-wheel], [data-speed]").forEach(clearSvgTransform);
    },
  };
}
