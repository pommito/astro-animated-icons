import { animate, cubicBezier, easeInOut, easeOut, interpolate, svgEffect } from "motion";
import { animate as animateMini } from "motion/mini";
import type { IconRecipe, IconTrack } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

type Transform = Parameters<typeof animateSvgTransform>[3];
type Transition = Parameters<typeof animateSvgTransform>[4];
type Paint = "d" | "pathLength" | "pathOffset" | "strokeWidth";
type Pose = Transform & Partial<Record<Paint, string | number | number[]>> & { transition?: PartTransition };
interface PartTransition extends Omit<Transition, "ease"> {
  ease?: Transition["ease"] | "linear";
  velocity?: number;
  d?: PartTransition;
  pathLength?: PartTransition;
  pathOffset?: PartTransition;
  strokeWidth?: PartTransition;
  opacity?: PartTransition;
}
export interface SvgVariants { normal: Pose; animate: Pose }
export interface SvgPart { selector: string; variants: SvgVariants; transition?: PartTransition }

const defaultEase: [number, number, number, number] = [0.25, 0.1, 0.35, 1];

const playbacks = new WeakMap<SVGElement, Map<string, { active: boolean }>>();

function beginPlayback(element: SVGElement, property: string, track: IconTrack) {
  let properties = playbacks.get(element);
  if (!properties) {
    properties = new Map();
    playbacks.set(element, properties);
  }
  const interrupted = properties.get(property)?.active ?? false;
  const playback = { active: true };
  properties.set(property, playback);
  const playbackTrack: IconTrack = start => track(onComplete => start(() => {
    playback.active = false;
    onComplete();
  }));
  return { interrupted, track: playbackTrack };
}

export function animateSvgPart(element: SVGElement, part: SvgPart, returning: boolean, track: IconTrack) {
  const pose = part.variants[returning ? "normal" : "animate"];
  const transition = pose.transition ?? part.transition ?? {};
  const targets: Transform = {};
  const propertyOptions: Parameters<typeof animateSvgTransform>[5] = {};
  for (const [key, value] of Object.entries(pose)) {
    if (["transition", "d", "pathLength", "pathOffset", "strokeWidth", "opacity"].includes(key)) continue;
    const property = key as keyof Transform;
    targets[property] = value as Transform[typeof property];
    propertyOptions[property] = transition.duration === undefined && transition.type !== "spring" && !Array.isArray(value)
      ? { type: "spring", stiffness: property.startsWith("scale") ? 550 : 500, damping: property.startsWith("scale") ? 30 : 25, restSpeed: 10 }
      : {};
  }
  if (Object.keys(targets).length && (!returning || element.style.transform)) {
    const playback = beginPlayback(element, "transform", track);
    if (!returning && playback.interrupted) for (const property of Object.keys(targets) as (keyof Transform)[]) {
      const values = targets[property];
      if (Array.isArray(values)) targets[property] = [null, ...values.slice(1)];
    }
    const springOnly = Object.values(propertyOptions).every(option => option.type === "spring");
    const multipleKeyframes = Object.values(targets).some(value => Array.isArray(value) && value.length > 2);
    animateSvgTransform(element, returning, playback.track, targets, {
      ...transition,
      ...(springOnly ? { type: "spring" as const } : {}),
      duration: transition.duration ?? (multipleKeyframes ? 0.8 : 0.3),
      ease: transition.ease === "linear" ? [0, 0, 1, 1] : transition.ease,
    }, propertyOptions);
  }
  for (const property of ["d", "pathLength", "pathOffset", "strokeWidth", "opacity"] as const) {
    const target = pose[property];
    if (target === undefined) continue;
    const playback = beginPlayback(element, property, track);
    const options = transition[property] ?? transition;
    const { d: _d, pathLength: _length, pathOffset: _offset, strokeWidth: _width, opacity: _opacity, ...settings } = options;
    const duration = settings.duration ?? (Array.isArray(target) && target.length > 2 ? 0.8 : 0.3);
    const ease = settings.ease ?? (Object.keys(options).some(key => !["delay", "repeat", "repeatType"].includes(key)) ? "easeOut" : defaultEase);
    const delay = settings.delay;
    if (property === "d") {
      playback.track(onComplete => {
        const animation = animate(element, { attrD: target as string }, { duration, ease, delay, onComplete });
        return { stop: () => animation.stop(), cancel: () => animation.stop() };
      });
    } else {
      const css = property === "pathLength" ? "strokeDasharray" : property === "pathOffset" ? "strokeDashoffset" : property === "opacity" ? "opacity" : "strokeWidth";
      let values = (Array.isArray(target) ? target : [target]).map(value => property === "pathLength" ? `${value}px 1px` : property === "pathOffset" ? `${-Number(value)}px` : Number(value));
      const current = element.style[css];
      if (!returning && playback.interrupted && values.length > 1 && current) values[0] = current;
      const sampled = Array.isArray(target) && values.length > 2 && property !== "opacity";
      if (sampled) {
        const offsets = settings.times?.length === values.length ? settings.times : values.map((_, index) => index / (values.length - 1));
        const easing = Array.isArray(ease) ? cubicBezier(...ease) : ease === "easeInOut" ? easeInOut : ease === "linear" ? (value: number) => value : easeOut;
        const sample = interpolate(offsets, values, { ease: easing });
        const intervals = Math.max(1, Math.ceil(duration * 200));
        values = Array.from({ length: intervals + 1 }, (_, index) => sample(index / intervals));
      }
      playback.track(onComplete => animateMini(element, { [css]: Array.isArray(target) ? values : values[0] }, {
        duration, ease: sampled ? "linear" : ease,
        delay, repeat: settings.repeat, onComplete,
      }));
    }
  }
}

export function clearSvgPart(element: SVGElement, part: SvgPart) {
  playbacks.delete(element);
  clearSvgTransform(element);
  svgEffect.state(element)?.release();
  const d = part.variants.normal.d;
  if (typeof d === "string") element.setAttribute("d", d);
  for (const property of ["stroke-dasharray", "stroke-dashoffset", "stroke-width"]) element.style.removeProperty(property);
}

export function createSvgPartsRecipe(parts: SvgPart[]): IconRecipe {
  const elements = (drawing: SVGGElement, part: SvgPart) => part.selector === "svg"
    ? [drawing.ownerSVGElement!] : [...drawing.querySelectorAll<SVGElement>(part.selector)];
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      for (const part of parts) for (const element of elements(drawing, part)) animateSvgPart(element, part, returning, track);
    },
    clear(drawing) {
      for (const part of parts) for (const element of elements(drawing, part)) clearSvgPart(element, part);
    },
  };
}
