import { animate } from "motion/mini";
import type { IconAnimation, IconTrack } from "../element";

type TrackOptions = NonNullable<Parameters<typeof animate>[2]>;

interface ArrowMotion {
  axis: "X" | "Y";
  headTravel?: number;
  headAnimation?(head: SVGPathElement, returning: boolean, onComplete: () => void): IconAnimation;
  playback?: TrackOptions;
  headReturn?: TrackOptions;
  shaftReturn?: TrackOptions;
}

const shaftRetraction = 5;
const playbackDuration = 0.4;
const returnDuration = 0.12;

export function animateArrow(drawing: SVGGElement, returning: boolean, track: IconTrack, motion: ArrowMotion) {
  const { axis, headTravel = 3 } = motion;
  const [head, shaft] = drawing.querySelectorAll("path");
  const shaftLength = shaft.getTotalLength();
  const fullShaft = `${shaftLength}px ${shaftLength}px`;
  const retractedShaft = `${shaftLength - shaftRetraction}px ${shaftLength}px`;
  shaft.style.strokeDasharray ||= fullShaft;
  const options = {
    duration: returning ? returnDuration : playbackDuration,
    ease: "easeInOut" as const,
    ...(!returning && motion.playback),
  };
  track((onComplete) => motion.headAnimation
    ? motion.headAnimation(head, returning, onComplete)
    : animate(head, { transform: returning ? `translate${axis}(0px)` : [null, `translate${axis}(${headTravel}px)`, `translate${axis}(0px)`] }, { ...options, ...(returning && motion.headReturn), onComplete }));
  track((onComplete) => animate(shaft, { strokeDasharray: returning ? fullShaft : [null, retractedShaft, fullShaft] }, { ...options, ...(returning && motion.shaftReturn), onComplete }));
}

export function clearArrow(drawing: SVGGElement) {
  drawing.querySelectorAll("path").forEach((path) => {
    path.style.removeProperty("transform");
    path.style.removeProperty("stroke-dasharray");
  });
}
