import type { IconRecipe } from "../../element";
import { animateSequence } from "../../shared/sequence";
import { animateSvgPart, clearSvgPart, type SvgPart } from "../../shared/svg-parts";

const body: SvgPart = {
  selector: "g[data-motion]",
  variants: {
    normal: { scale: 1, y: 0 },
    animate: { scale: [1, 1.08, 1], y: [0, -1, 0], transition: { duration: 0.8, ease: "easeInOut" } },
  },
};
const hidden: SvgPart = {
  selector: "path[data-motion]",
  variants: { normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: 0, opacity: 0 } },
};
const rays: SvgPart = {
  selector: hidden.selector,
  variants: { normal: hidden.variants.normal, animate: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } } },
};

export const projectorRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgPart(drawing.querySelector<SVGElement>(body.selector)!, body, returning, track);
    const paths = [...drawing.querySelectorAll<SVGElement>(rays.selector)];
    if (returning) paths.forEach(path => animateSvgPart(path, rays, true, track));
    else {
      paths.forEach(path => { path.style.strokeDasharray ||= "1px 1px"; });
      animateSequence(track, [
        track => paths.forEach(path => animateSvgPart(path, hidden, false, track)),
        track => paths.forEach(path => animateSvgPart(path, rays, false, track)),
      ]);
    }
  },
  clear(drawing) {
    clearSvgPart(drawing.querySelector<SVGElement>(body.selector)!, body);
    drawing.querySelectorAll<SVGElement>(rays.selector).forEach(path => clearSvgPart(path, rays));
  },
};
