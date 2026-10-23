export interface OpacityPart {
  selector: string;
  variants: {
    normal: { opacity: number; transition?: OpacityTiming };
    animate: { opacity: number[]; transition: OpacityTiming };
  };
}

interface OpacityTiming {
  duration?: number;
  delay?: number;
  times?: number[];
}

export function opacityTiming(part: OpacityPart, returning: boolean) {
  const pose = part.variants[returning ? "normal" : "animate"];
  const timing = pose.transition ?? {};
  const values = Array.isArray(pose.opacity) ? pose.opacity : [pose.opacity];
  return {
    values,
    duration: timing.duration ?? 0.3,
    delay: timing.delay ?? 0,
    times: timing.times ?? values.map((_, index) => index / (values.length - 1)),
    ease: pose.transition ? [0, 0, 0.58, 1] : [0.25, 0.1, 0.35, 1],
  };
}
