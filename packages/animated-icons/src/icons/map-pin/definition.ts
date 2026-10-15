import { animate } from "motion/mini";

export const mapPinPath = "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0";

export function animateMapPin(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  const circle = drawing.querySelector("circle")!;
  const length = circle.getTotalLength();
  const fullCircle = `${length}px ${length}px`;
  let remaining = 4;
  const options = {
    duration: returning ? 0.12 : 0.5,
    ease: "easeInOut" as const,
    onComplete: () => {
      onComplete(--remaining === 0 && returning);
    },
  };
  const reveal = { ...options, delay: returning ? 0 : 0.3 };

  return [
    animate(drawing.ownerSVGElement!, {
      transform: returning ? "translateY(0px)" : [null, "translateY(-5px)", "translateY(-3px)"],
    }, returning ? options : { ...options, times: [0, 0.6, 1], ease: ["easeInOut", "easeInOut"] }),
    animate(circle, { opacity: returning ? 1 : [0, 1] }, { ...reveal, duration: returning ? 0.12 : 0.1 }),
    animate(circle, { strokeDasharray: returning ? fullCircle : [`0px ${length}px`, fullCircle] }, reveal),
    animate(circle, { strokeDashoffset: returning ? "0px" : [`${-length / 2}px`, "0px"] }, reveal),
  ];
}
