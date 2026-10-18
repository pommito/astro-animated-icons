import { spring } from "motion";
import { animate } from "motion/mini";
import type { IconAnimation, IconRecipe, IconTrack } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const scanFaceRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    track((onComplete) => {
      let active = true;
      let controls: IconAnimation[] = [];
      function phase(hidden: boolean) {
        controls = [];
        let remaining = 0;
        let ready = false;
        const complete = () => {
          if (!active || !ready || remaining !== 0) return;
          if (hidden) phase(false);
          else onComplete();
        };
        const phaseTrack: IconTrack = (start) => {
          remaining++;
          const control = start(() => {
            if (!active) { onComplete(); return; }
            remaining--;
            complete();
          });
          controls.push(control);
          return control;
        };
        const svg = drawing.ownerSVGElement!;
        svg.style.transformOrigin = "50% 50%";
        animateSvgTransform(svg, !hidden, phaseTrack, { scale: 0.9 }, hidden
          ? { type: "spring", stiffness: 200, damping: 20 }
          : { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 });
        const paths = [...drawing.querySelectorAll("path")];
        for (const path of paths.slice(0, 4)) {
          animateSvgTransform(path, !hidden, phaseTrack, { scale: 1.2, rotate: 45 }, hidden
            ? { type: "spring", stiffness: 200, damping: 20 }
            : { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
          hidden ? {} : { rotate: { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } });
          phaseTrack((onComplete) => animate(path, { opacity: hidden ? 0 : 1 }, {
            ...(hidden ? { type: spring, stiffness: 200, damping: 20 } : { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] as [number, number, number, number] }),
            onComplete,
          }));
        }
        const mouth = paths[4];
        animateSvgTransform(mouth, !hidden, phaseTrack, { scale: 0.8 }, hidden
          ? { duration: 0.3, delay: 0.1, ease: "easeOut" }
          : { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 });
        phaseTrack((onComplete) => animate(mouth, { opacity: hidden ? 0 : 1 }, {
          duration: 0.3, delay: hidden ? 0.1 : 0,
          ease: hidden ? "easeOut" : [0.25, 0.1, 0.35, 1], onComplete,
        }));
        ready = true;
        complete();
      }
      phase(!returning);
      return {
        stop() { active = false; controls.forEach((control) => control.stop()); },
        cancel() { active = false; controls.forEach((control) => control.cancel()); },
      };
    });
  },
  clear(drawing) {
    clearSvgTransform(drawing.ownerSVGElement!);
    drawing.ownerSVGElement!.style.removeProperty("transform-origin");
    drawing.querySelectorAll("path").forEach(clearSvgTransform);
  },
} satisfies IconRecipe;
