import { animate } from "motion/mini";

export const arrowLeftPaths = ["m12 19-7-7 7-7", "M19 12H5"];

const headTravel = 3;
const shaftRetraction = 5;
const playbackDuration = 0.4;
const returnDuration = 0.12;

export function animateArrowLeft(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  const paths = drawing.querySelectorAll("path");
  const [head, shaft] = paths;
  const shaftLength = shaft.getTotalLength();
  const fullShaft = `${shaftLength}px ${shaftLength}px`;
  const retractedShaft = `${shaftLength - shaftRetraction}px ${shaftLength}px`;
  shaft.style.strokeDasharray ||= fullShaft;
  let remaining = paths.length;
  const options = {
    duration: returning ? returnDuration : playbackDuration,
    ease: "easeInOut" as const,
    onComplete: () => {
      onComplete(--remaining === 0);
    },
  };
  return [
    animate(head, { transform: returning ? "translateX(0px)" : [null, `translateX(${headTravel}px)`, "translateX(0px)"] }, options),
    animate(shaft, { strokeDasharray: returning ? fullShaft : [null, retractedShaft, fullShaft] }, options),
  ];
}
