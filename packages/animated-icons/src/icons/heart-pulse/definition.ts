import type { IconRecipe } from "../../element";
import { animateSequence } from "../../shared/sequence";
import { animateSvgPart, clearSvgPart, type SvgPart } from "../../shared/svg-parts";

const heart: SvgPart = {
  selector: "[data-part=heart]",
  variants: {
    normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3 } },
    animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.5, ease: "easeOut", opacity: { duration: 0.1 } } },
  },
};
const line: SvgPart = {
  selector: "[data-part=ecg]",
  variants: {
    normal: { pathLength: 1, pathOffset: 0, opacity: 1, transition: { duration: 0.3 } },
    animate: { pathLength: [0, 1], pathOffset: [1, 0], opacity: [0, 1], transition: { duration: 0.6, ease: "linear", opacity: { duration: 0.1 } } },
  },
};
const pulse: SvgPart = {
  selector: "[data-pulse]",
  variants: {
    normal: { scale: 1, transition: { duration: 0.3 } },
    animate: { scale: [1, 1.08, 1], transition: { duration: 0.9, repeat: 1, ease: "easeInOut" } },
  },
};

export const heartPulseRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const element = (part: SvgPart) => drawing.querySelector<SVGElement>(part.selector)!;
    if (returning) {
      for (const part of [heart, line, pulse]) animateSvgPart(element(part), part, true, track);
      return;
    }
    element(heart).style.opacity = "0";
    element(heart).style.strokeDasharray = "0px 1px";
    animateSequence(track, [
      track => animateSvgPart(element(line), line, false, track),
      track => animateSvgPart(element(heart), heart, false, track),
      track => animateSvgPart(element(pulse), pulse, false, track),
    ]);
  },
  clear(drawing) {
    for (const part of [heart, line, pulse]) clearSvgPart(drawing.querySelector<SVGElement>(part.selector)!, part);
  },
};
