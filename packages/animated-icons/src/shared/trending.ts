import { easeOut } from "motion";
import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animateSvgPart, clearSvgPart, type SvgPart } from "./svg-parts";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createTrendingRecipe(direction: number): IconRecipe {
  const offsets = new WeakMap<SVGElement, { elapsed: number; origin: number }>();
  const parts: SvgPart[] = [false, true].map(head => ({
    selector: head ? "[data-part=head]" : "[data-part=line]",
    variants: {
      normal: { opacity: 1, pathLength: 1, transition: {
        duration: head ? 0.3 : 0.4, delay: head ? 0.3 : 0,
        opacity: { duration: 0.1, delay: head ? 0.3 : 0 },
      } },
      animate: { opacity: [0, 1], pathLength: [0, 1], transition: {
        duration: head ? 0.3 : 0.4, delay: head ? 0.3 : 0,
        opacity: { duration: 0.1, delay: head ? 0.3 : 0 },
      } },
    },
  }));
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      animateSvgTransform(drawing.ownerSVGElement!, returning, track,
        { x: 0, y: [0, direction, 0], translateX: [0, 2, 0] },
        { duration: 0.5, ease: "easeOut", preservePose: true },
        { x: { continueOnReturn: true }, y: { continueOnReturn: true }, translateX: { continueOnReturn: true } });
      for (const [index, part] of parts.entries()) {
        const shape = drawing.querySelector<SVGElement>(part.selector)!;
        animateSvgPart(shape, part, returning, track);
        const duration = index ? 0.3 : 0.4;
        const delay = index ? 0.3 : 0;
        const previous = offsets.get(shape);
        const elapsed = returning ? previous?.elapsed ?? 0 : 0;
        const initialOffset = index ? -0.5 : -1;
        const origin = returning ? previous?.origin ?? initialOffset
          : previous && previous.elapsed < delay + duration ? parseFloat(shape.style.strokeDashoffset) : initialOffset;
        const state = { elapsed, origin };
        offsets.set(shape, state);
        const remaining = Math.max(0, delay + duration - elapsed);
        const intervals = Math.max(1, Math.ceil(remaining * 200));
        const values = Array.from({ length: intervals + 1 }, (_, frame) => {
          const progress = Math.max(0, Math.min(1, (elapsed + frame * remaining / intervals - delay) / duration));
          return `${origin * (1 - easeOut(progress))}px`;
        });
        track(onComplete => {
          let completed = false;
          const animation = animate(shape, { strokeDashoffset: values }, {
            duration: remaining, ease: "linear", onComplete() { completed = true; state.elapsed = delay + duration; onComplete(); },
          });
          return {
            stop() {
              if (completed) return;
              state.elapsed = Math.min(delay + duration, elapsed + animation.time);
              animation.stop();
            },
            cancel() { animation.cancel(); },
          };
        });
      }
    },
    clear(drawing) {
      clearSvgTransform(drawing.ownerSVGElement!);
      for (const part of parts) {
        const shape = drawing.querySelector<SVGElement>(part.selector)!;
        offsets.delete(shape);
        clearSvgPart(shape, part);
      }
    },
  };
}
