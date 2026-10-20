import { animate, motionValue } from "motion";
import { animatePathMorph, clearPathMorph } from "../../shared/path-morph";
import type { IconRecipe, IconTrack } from "../../element";

export const archiveBody = "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8";
export const archiveHandle = "M10 12h4";
const lidValues = new WeakMap<SVGRectElement, ReturnType<typeof motionValue<number>>>();

const openBody = "M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11";
const openHandle = "M10 15h4";

export function animateArchive(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  const lid = drawing.querySelector("rect")!;
  const [body, handle] = drawing.querySelectorAll("path");
  let lidValue = lidValues.get(lid);
  if (!lidValue) {
    lidValue = motionValue(new DOMMatrix(getComputedStyle(lid).transform).m42);
    lidValues.set(lid, lidValue);
  }
  const value = lidValue;
  track((onComplete) => {
    animate(value, returning ? 0 : -1.5, {
      type: "spring",
      stiffness: 200,
      damping: 25,
      // Explicit physics override the source's declared 200 ms duration.
      onUpdate: (current) => { lid.style.transform = `translateY(${current}px)`; },
      onComplete,
    });
    return { stop: () => value.stop(), cancel: () => value.stop() };
  });
  for (const [path, target] of [[body, returning ? archiveBody : openBody], [handle, returning ? archiveHandle : openHandle]] as const) {
    animatePathMorph(path, target, track, { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] });
  }
}

export function clearArchive(drawing: SVGGElement) {
  const lid = drawing.querySelector("rect")!;
  lidValues.delete(lid);
  lid.style.removeProperty("transform");
  const [body, handle] = drawing.querySelectorAll("path");
  clearPathMorph(body, archiveBody);
  clearPathMorph(handle, archiveHandle);
}

export const archiveRecipe = {
  finish: "hold",
  animate: animateArchive,
  clear: clearArchive,
} satisfies IconRecipe;
