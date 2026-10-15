import { animate } from "motion/mini";

type TrackOptions = NonNullable<Parameters<typeof animate>[2]>;

interface ArrowMotion {
  axis: "X" | "Y";
  playback?: TrackOptions;
  headReturn?: TrackOptions;
  shaftReturn?: TrackOptions;
}

const headTravel = 3;
const shaftRetraction = 5;
const playbackDuration = 0.4;
const returnDuration = 0.12;

export function animateArrow(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void, motion: ArrowMotion) {
  const { axis } = motion;
  const paths = drawing.querySelectorAll("path");
  const [head, shaft] = paths;
  const shaftLength = shaft.getTotalLength();
  const fullShaft = `${shaftLength}px ${shaftLength}px`;
  const retractedShaft = `${shaftLength - shaftRetraction}px ${shaftLength}px`;
  shaft.style.strokeDasharray ||= fullShaft;
  let remaining = paths.length;
  const onFinish = () => onComplete(--remaining === 0);
  const options = {
    duration: returning ? returnDuration : playbackDuration,
    ease: "easeInOut" as const,
    ...(!returning && motion.playback),
    onComplete: onFinish,
  };
  return [
    animate(head, { transform: returning ? `translate${axis}(0px)` : [null, `translate${axis}(${headTravel}px)`, `translate${axis}(0px)`] }, { ...options, ...(returning && motion.headReturn), onComplete: onFinish }),
    animate(shaft, { strokeDasharray: returning ? fullShaft : [null, retractedShaft, fullShaft] }, { ...options, ...(returning && motion.shaftReturn), onComplete: onFinish }),
  ];
}

export function clearArrow(drawing: SVGGElement) {
  drawing.querySelectorAll("path").forEach((path) => {
    path.style.removeProperty("transform");
    path.style.removeProperty("stroke-dasharray");
  });
}
