import { cubicBezier, easeInOut, easeOut, interpolate, spring } from "motion";
import { animate } from "motion/mini";
import type { IconTrack } from "../element";

type Property = "x" | "translateX" | "y" | "rotate" | "rotateX" | "scale" | "scaleX" | "scaleY" | "opacity";
type Values = Partial<Record<Property, number | (number | null)[]>>;
interface Transition {
  preservePose?: boolean | "until-clear";
  preserveCycleEnd?: boolean;
  type?: "spring";
  stiffness?: number;
  damping?: number;
  mass?: number;
  restSpeed?: number;
  duration?: number;
  delay?: number;
  ease?: Easing | Easing[];
  times?: number[];
  repeat?: number;
  repeatType?: "reverse";
  continueOnReturn?: boolean;
}
type Easing = "linear" | "easeOut" | "easeInOut" | [number, number, number, number];
interface Pose {
  values: Partial<Record<Property, number>>;
  velocities: Partial<Record<Property, number>>;
  samplers?: Partial<Record<Property, (time: number) => number>>;
  time?: number;
  duration?: number;
}
const poses = new WeakMap<SVGElement, Pose>();

export function resolveSvgEasing(ease?: Transition["ease"]) {
  const resolve = (ease: Easing | undefined): (progress: number) => number => Array.isArray(ease)
    ? cubicBezier(...ease)
    : ease === "linear" ? (progress: number) => progress : ease === "easeInOut" ? easeInOut : easeOut;
  return Array.isArray(ease) && typeof ease[0] !== "number"
    ? (ease as Easing[]).map(resolve)
    : resolve(ease as Easing | undefined);
}

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
  const interrupted = options.preservePose && previous && (options.preservePose === "until-clear" || Object.keys(previous.velocities).length > 0);
  let duration = options.type === "spring" ? 0 : (options.duration ?? 0.3) * 1000;
  const samplers = properties.map((property) => {
    if (returning && propertyOptions[property]?.continueOnReturn && previous?.samplers?.[property]) {
      const elapsed = previous.time ?? 0;
      duration = Math.max(duration, (previous.duration ?? 0) - elapsed);
      return (time: number) => previous.samplers![property]!(elapsed + time);
    }
    const rest = normal[property] ?? (property === "scale" || property === "scaleX" || property === "scaleY" || property === "opacity" ? 1 : 0);
    const origin = previous?.values[property] ?? rest;
    const target = returning ? rest : targets[property]!;
    const values = Array.isArray(target) ? target.map((value, index) => index === 0 && interrupted ? origin : value ?? origin) : [origin, target];
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
    const propertyDuration = (transition.duration ?? 0.3) * 1000;
    const propertyDelay = (propertyOptions[property]?.delay ?? 0) * 1000;
    const repeats = propertyOptions[property]?.repeat ?? 0;
    duration = Math.max(duration, propertyDelay + propertyDuration * (repeats + 1));
    const times = transition.times?.length === values.length ? transition.times : values.map((_, index) => index / (values.length - 1));
    const ease = resolveSvgEasing(transition.ease);
    const interpolateValue = interpolate(times.map((time) => time * propertyDuration), values, { ease });
    return (time: number) => {
      time = Math.max(0, time - propertyDelay);
      if (repeats && time < propertyDuration * (repeats + 1)) {
        const iteration = Math.floor(time / propertyDuration);
        time %= propertyDuration;
        if (transition.repeatType === "reverse" && iteration % 2) time = propertyDuration - time;
      }
      return interpolateValue(time);
    };
  });
  const retainedSamplers = Object.fromEntries(properties.map((property, index) => [property, samplers[index]]));
  const sample = (time: number) => {
    time = Math.min(duration, Math.max(0, time));
    return Object.fromEntries(properties.map((property, index) => [property, samplers[index](time)])) as Pose["values"];
  };
  const frames = Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, index) =>
    sample((index * duration) / Math.ceil(duration / 5)),
  );
  const sampleFrame = (time: number) => {
    const position = Math.min(frames.length - 1, Math.max(0, time / duration * (frames.length - 1)));
    const index = Math.min(frames.length - 2, Math.floor(position));
    const progress = position - index;
    return Object.fromEntries(properties.map(property => [property,
      frames[index][property]! + (frames[index + 1][property]! - frames[index][property]!) * progress,
    ])) as Pose["values"];
  };
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
  const startsAtPrevious = previous && properties.filter(property => property !== "opacity")
    .every(property => frames[0][property] === previous.values[property]);
  if (keyframes.transform && (startsAtPrevious && element.style.transform.startsWith("matrix") || returning && Object.values(propertyOptions).some(option => option?.continueOnReturn))) {
    keyframes.transform[0] = getComputedStyle(element).transform;
  }
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
            poses.set(element, { values: frames.at(-1)!, velocities: {}, samplers: retainedSamplers, time: duration, duration });
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
              const phase = elapsed % duration;
              const completedIteration = !!options.preserveCycleEnd && phase === 0 && iteration > 0;
              elapsed = completedIteration ? duration : phase;
              if (options.repeatType === "reverse" && (iteration - Number(completedIteration)) % 2) elapsed = duration - elapsed;
            }
            return sampleFrame(elapsed);
          };
          const current = samplePlayback(time);
          const repeating = options.preserveCycleEnd && options.repeat && time < duration * (options.repeat + 1);
          const phase = repeating && time > 0 ? time % duration || duration : time;
          const interval = Math.min(phase, 5);
          const before = repeating && phase <= 5
            ? sampleFrame(options.repeatType === "reverse" && Math.floor(time / duration) % 2 ? duration : 0)
            : samplePlayback(Math.max(0, time - interval));
          poses.set(element, {
            values: current,
            samplers: retainedSamplers,
            time,
            duration,
            velocities: Object.fromEntries(
              properties.map((property) => [
                property,
                interval ? ((current[property]! - before[property]!) * 1000) / interval : 0,
              ]),
            ),
          });
          const renderedTransform = property === "transform" ? getComputedStyle(element).transform : undefined;
          animation.stop();
          if (renderedTransform && getComputedStyle(element).transform !== renderedTransform) element.style.transform = renderedTransform;
        },
        cancel() {
          animation.cancel();
        },
      };
    });
  }
}
