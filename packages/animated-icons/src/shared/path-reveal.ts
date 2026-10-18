import { animate } from "motion/mini";
import type { IconTrack } from "../element";

type RevealOptions = NonNullable<Parameters<typeof animate>[2]> & {
  opacityDuration?: number;
  opacityDelay?: number;
  opacityEase?: NonNullable<Parameters<typeof animate>[2]>["ease"];
  reverseOffset?: boolean;
  preservePose?: boolean;
};

const playbacks = new WeakMap<SVGGeometryElement, { active: boolean }>();

export function animatePathReveal(path: SVGGeometryElement, returning: boolean, track: IconTrack, options: RevealOptions) {
  const length = path.getTotalLength();
  const fullPath = `${length}px ${length}px`;
  const { opacityDuration, opacityDelay = options.delay, opacityEase = options.ease, reverseOffset, preservePose, ...transition } = options;
  const interrupted = preservePose && playbacks.get(path)?.active;
  const playback = { active: true };
  if (preservePose) playbacks.set(path, playback);

  if (opacityDuration !== undefined) track((onComplete) => animate(path, { opacity: returning ? 1 : [interrupted && path.style.opacity ? path.style.opacity : 0, 1] }, { ...transition, duration: opacityDuration, delay: opacityDelay, ease: opacityEase, onComplete }));
  track((onComplete) => animate(path, { strokeDasharray: returning ? fullPath : [interrupted && path.style.strokeDasharray ? path.style.strokeDasharray : `0px ${length}px`, fullPath] }, { ...transition, onComplete() {
    playback.active = false;
    onComplete();
  } }));
  if (reverseOffset) {
    track((onComplete) => animate(path, { strokeDashoffset: returning ? "0px" : [`${-length}px`, "0px"] }, { ...transition, onComplete }));
  }
}

export function clearPathReveal(path: SVGGeometryElement) {
  playbacks.delete(path);
  path.style.removeProperty("opacity");
  path.style.removeProperty("stroke-dasharray");
  path.style.removeProperty("stroke-dashoffset");
}
