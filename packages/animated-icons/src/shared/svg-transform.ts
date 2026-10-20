import { cubicBezier, easeInOut, easeOut, interpolate, spring } from "motion";
import { animate } from "motion/mini";
import type { IconTrack } from "../element";

type Property = "x" | "translateX" | "y" | "rotate" | "rotateX" | "scale" | "scaleX" | "scaleY" | "opacity";
type Values = Partial<Record<Property, number | (number | null)[]>>;
interface Transition {
  type?: "spring";
  stiffness?: number;
  damping?: number;
  mass?: number;
  restSpeed?: number;
  duration?: number;
  delay?: number;
  ease?: "linear" | "easeOut" | "easeInOut" | [number, number, number, number];
  times?: number[];
  repeat?: number;
  repeatType?: "reverse";
}
interface Pose {
  values: Partial<Record<Property, number>>;
  velocities: Partial<Record<Property, number>>;
}
const poses = new WeakMap<SVGElement, Pose>();

export function clearSvgTransform(element: SVGElement) {
  poses.delete(element);
  element.style.removeProperty("transform");
  element.style.removeProperty("opacity");
}

export function animateSvgTransform(
  element: SVGElement,
  returning: boolean,
  track: IconTrack,
  targets: Values,
  options: Transition,
  propertyOptions: Partial<Record<Property, Transition>> = {},
  normal: Partial<Record<Property, number>> = {},
) {
  const previous = poses.get(element);
  const properties = Object.keys(targets) as Property[];
  let duration = options.type === "spring" ? 0 : (options.duration ?? 0.3) * 1000;
  const samplers = properties.map((property) => {
    const rest = normal[property] ?? (property === "scale" || property === "scaleX" || property === "scaleY" || property === "opacity" ? 1 : 0);
    const origin = previous?.values[property] ?? rest;
    const target = returning ? rest : targets[property]!;
    const values = Array.isArray(target) ? target.map((value) => value ?? origin) : [origin, target];
    const transition = { ...options, ...propertyOptions[property] };
    if (transition.type === "spring") {
      const generator = spring({ ...transition, keyframes: values, velocity: previous?.velocities[property] ?? 0 });
      let time = 0;
      // Mini normalizes spring distances; sample in the upstream property's units.
      do {
        time += 50;
      } while (!generator.next(time).done && time < 10000);
      duration = Math.max(duration, time);
      return (time: number) => time === 0 ? values[0] : generator.next(time).value;
    }
    const times = options.times?.length === values.length ? options.times : values.map((_, index) => index / (values.length - 1));
    const ease = Array.isArray(options.ease)
      ? cubicBezier(...options.ease)
      : options.ease === "linear"
        ? (progress: number) => progress
        : options.ease === "easeInOut"
        ? easeInOut
        : easeOut;
    return interpolate(
      times.map((time) => time * duration),
      values,
      { ease },
    );
  });
  const sample = (time: number) => {
    time = Math.min(duration, Math.max(0, time));
    return Object.fromEntries(properties.map((property, index) => [property, samplers[index](time)])) as Pose["values"];
  };
  const frames = Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, index) =>
    sample((index * duration) / Math.ceil(duration / 5)),
  );
  const transform = (values: Pose["values"]) =>
    [
      values.x === undefined ? "" : `translateX(${values.x}px)`,
      values.translateX === undefined ? "" : `translateX(${values.translateX}px)`,
      values.y === undefined ? "" : `translateY(${values.y}px)`,
      values.scale === undefined ? "" : `scale(${values.scale})`,
      values.scaleX === undefined ? "" : `scaleX(${values.scaleX})`,
      values.scaleY === undefined ? "" : `scaleY(${values.scaleY})`,
      values.rotateX === undefined ? "" : `rotateX(${values.rotateX}deg)`,
      values.rotate === undefined ? "" : `rotate(${values.rotate}deg)`,
    ]
      .filter(Boolean)
      .join(" ");
  const keyframes = {
    ...(properties.some((property) => property !== "opacity") ? { transform: frames.map(transform) } : {}),
    ...(properties.includes("opacity") ? { opacity: frames.map((frame) => frame.opacity!) } : {}),
  };
  for (const [property, values] of Object.entries(keyframes)) {
    track((onComplete) => {
      let completed = false;
      const animation = animate(
        element,
        { [property]: values },
        {
          duration: duration / 1000,
          delay: options.delay,
          ease: "linear",
          repeat: options.repeat,
          repeatType: options.repeatType,
          onComplete() {
            completed = true;
            poses.set(element, { values: frames.at(-1)!, velocities: {} });
            onComplete();
          },
        },
      );
      return {
        stop() {
          if (completed) return;
          const time = Math.max(0, animation.time * 1000 - (options.delay ?? 0) * 1000);
          const samplePlayback = (elapsed: number) => {
            if (options.repeat && elapsed < duration * (options.repeat + 1)) {
              const iteration = Math.floor(elapsed / duration);
              elapsed %= duration;
              if (options.repeatType === "reverse" && iteration % 2) elapsed = duration - elapsed;
            }
            return sample(elapsed);
          };
          const current = samplePlayback(time);
          const interval = Math.min(time, 5);
          const before = samplePlayback(Math.max(0, time - interval));
          poses.set(element, {
            values: current,
            velocities: Object.fromEntries(
              properties.map((property) => [
                property,
                interval ? ((current[property]! - before[property]!) * 1000) / interval : 0,
              ]),
            ),
          });
          animation.stop();
        },
        cancel() {
          animation.cancel();
        },
      };
    });
  }
}
