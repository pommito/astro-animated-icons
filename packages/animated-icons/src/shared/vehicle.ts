import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

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
        animateSvgTransform(group, returning, track, { y: body }, returning
          ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
          : { duration, ease: "easeInOut", repeat: Infinity });
      });
      drawing.querySelectorAll<SVGElement>("[data-wheel]").forEach(group => {
        animateSvgTransform(group, returning, track, wheel.targets, returning ? wheel.returnTransition : wheel.transition);
      });
      drawing.querySelectorAll<SVGElement>("[data-speed]").forEach((line, index) => {
        animateSvgTransform(line, returning, track, { x: [0, -4, -10, -16], scaleX: [0.2, 1, 0.8, 0.3] }, returning
          ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
          : { duration: speedDuration, delay: index * 0.08, times: [0, 0.2, 0.6, 1], ease: "easeOut", repeat: Infinity },
          returning ? { scaleX: { type: "spring", stiffness: 550, damping: 2 * Math.sqrt(550), restSpeed: 10 } } : {}, { scaleX: 0 });
        track(onComplete => animate(line, { opacity: returning ? 0 : [0, 0.7, 0.5, 0] }, returning
          ? { duration: 0.3, ease: [0.25, 0.1, 0.35, 1], onComplete }
          : { duration: speedDuration, delay: index * 0.08, times: [0, 0.2, 0.6, 1], ease: "easeOut", repeat: Infinity, onComplete }));
      });
    },
    clear(drawing) {
      drawing.querySelectorAll<SVGElement>("[data-body], [data-wheel], [data-speed]").forEach(clearSvgTransform);
    },
  };
}
