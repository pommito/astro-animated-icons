import { animate } from "motion/mini";
import type { IconRecipe, IconTrack } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";
import { animateSequence } from "../../shared/sequence";

const idle = '<line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>';
const active = '<path data-wave d="M16 9a5 5 0 0 1 0 6"/><path data-wave d="M19.364 18.364a9 9 0 0 0 0-12.728"/>';

function replaceBranch(drawing: SVGGElement, returning: boolean) {
  [...drawing.children].slice(1).forEach(shape => shape.remove());
  drawing.insertAdjacentHTML("beforeend", returning ? idle : active);
}

function restoreCross(shape: Element, track: IconTrack) {
  const path = shape as SVGGeometryElement;
  const opacity = Number(getComputedStyle(path).opacity);
  const dash = parseFloat(getComputedStyle(path).strokeDasharray);
  const partial = !Number.isNaN(dash) && dash < path.getTotalLength();
  if (partial || opacity !== 1) animatePathReveal(path, true, track,
    { duration: 0.3, opacityDuration: 0.3, ease: [0.25, 0.1, 0.35, 1] });
  else track(onComplete => animate(shape, { opacity: 1 }, { duration: 0, onComplete }));
}

export const volumeRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const waves = !!drawing.querySelector("[data-wave]");
    const incoming = (phaseTrack: Parameters<IconRecipe["animate"]>[2]) => {
      [...drawing.children].slice(1).forEach((shape, index) => {
        if (returning) animatePathReveal(shape as SVGGeometryElement, false, phaseTrack,
          { duration: 0.3, delay: (index + 1) * 0.1, opacityDuration: 0.3, ease: [0.25, 0.1, 0.35, 1], preservePose: true });
        else phaseTrack(onComplete => animate(shape, { opacity: [0, 1] }, { duration: 0.3, delay: (index + 1) * 0.1, ease: [0.25, 0.1, 0.35, 1], onComplete }));
      });
    };
    if (waves === !returning) {
      [...drawing.children].slice(1).forEach(shape => {
        if (returning) restoreCross(shape, track);
        else track(onComplete => animate(shape, { opacity: 1 }, { duration: 0.3, ease: [0.25, 0.1, 0.35, 1], onComplete }));
      });
      return;
    }
    animateSequence(track, [phaseTrack => {
      [...drawing.children].slice(1).forEach(shape => {
        const opacity = Number(getComputedStyle(shape).opacity);
        if (returning) {
          phaseTrack(onComplete => animate(shape, { opacity: 0 }, { duration: opacity === 0 ? 0 : 0.3, ease: [0.25, 0.1, 0.35, 1], onComplete }));
        } else {
          restoreCross(shape, phaseTrack);
        }
      });
    }, phaseTrack => {
      replaceBranch(drawing, returning);
      incoming(phaseTrack);
    }]);
  },
  clear(drawing) {
    replaceBranch(drawing, true);
    drawing.querySelectorAll("line").forEach(clearPathReveal);
  },
} satisfies IconRecipe;
