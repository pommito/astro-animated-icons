import { animate, motionValue } from "motion";

export const archiveBody = "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8";
export const archiveHandle = "M10 12h4";
const lidValues = new WeakMap<SVGRectElement, ReturnType<typeof motionValue<number>>>();

const openBody = "M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11";
const openHandle = "M10 15h4";

export function animateArchive(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  const lid = drawing.querySelector("rect")!;
  const [body, handle] = drawing.querySelectorAll("path");
  let lidValue = lidValues.get(lid);
  if (!lidValue) {
    lidValue = motionValue(new DOMMatrix(getComputedStyle(lid).transform).m42);
    lidValues.set(lid, lidValue);
  }
  let remaining = 3;
  const complete = () => onComplete(--remaining === 0 && returning);
  const morph = (path: SVGPathElement, target: string) => {
    const value = motionValue(path.getAttribute("d")!);
    animate(value, target, {
      duration: 0.3,
      ease: [0.25, 0.1, 0.35, 1],
      onUpdate: (current) => path.setAttribute("d", current),
      onComplete: complete,
    });
    return value;
  };

  animate(lidValue, returning ? 0 : -1.5, {
    type: "spring",
    stiffness: 200,
    damping: 25,
    // Explicit physics override the source's declared 200 ms duration.
    onUpdate: (value) => { lid.style.transform = `translateY(${value}px)`; },
    onComplete: complete,
  });
  const values = [
    lidValue,
    morph(body, returning ? archiveBody : openBody),
    morph(handle, returning ? archiveHandle : openHandle),
  ];
  // Value-animation cancel rewinds onUpdate; stopping the value also detaches its old control.
  return values.map((value) => ({ stop: () => value.stop(), cancel: () => value.stop() }));
}

export function clearArchive(drawing: SVGGElement) {
  const lid = drawing.querySelector("rect")!;
  lidValues.delete(lid);
  lid.style.removeProperty("transform");
  const [body, handle] = drawing.querySelectorAll("path");
  body.setAttribute("d", archiveBody);
  handle.setAttribute("d", archiveHandle);
}
