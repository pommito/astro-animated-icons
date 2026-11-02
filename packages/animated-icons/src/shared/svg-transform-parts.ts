import type { IconRecipe, IconTrack } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";
import { animateSequence } from "./sequence";

type Transform = Parameters<typeof animateSvgTransform>[3];
type Transition = Parameters<typeof animateSvgTransform>[4];
type Paint = "pathLength" | "pathOffset" | "strokeWidth" | "strokeDashoffset";
type Pose = Transform & Partial<Record<Paint, string | number | number[]>> & { d?: string | string[]; transition?: PartTransition };
interface PartTransition extends Omit<Transition, "ease"> {
  ease?: Transition["ease"] | "linear";
  velocity?: number;
  d?: PartTransition;
  pathLength?: PartTransition;
  pathOffset?: PartTransition;
  strokeWidth?: PartTransition;
  strokeDashoffset?: PartTransition;
  opacity?: PartTransition;
}
export interface SvgVariants { normal: Pose; animate: Pose }
export interface SvgPart { selector: string; variants: SvgVariants; transition?: PartTransition; origin?: string; transformBox?: "fill-box" | "view-box" }

type BeginPlayback = (element: SVGElement, property: string, track: IconTrack) => { interrupted: boolean; track: IconTrack };
interface PartEffects {
  animate(element: SVGElement, pose: Pose, transition: PartTransition, returning: boolean, track: IconTrack, beginPlayback: BeginPlayback): void;
  clear(element: SVGElement, part: SvgPart): void;
}
type TransformPose = Omit<Transform, "opacity"> & { transition?: Transition };
interface SvgTransformPart extends Omit<SvgPart, "variants" | "transition"> {
  variants: { normal: TransformPose; animate: TransformPose };
  transition?: Transition;
}

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

export function createSvgPartsPlayer(effects?: PartEffects) {
  function animateSvgPart(element: SVGElement, part: SvgPart, returning: boolean, track: IconTrack) {
    if (part.origin) element.style.transformOrigin = part.origin;
    if (part.transformBox) element.style.transformBox = part.transformBox;
    const pose = part.variants[returning ? "normal" : "animate"];
    const transition = pose.transition ?? part.transition ?? {};
    if (!returning && transition.repeat === Infinity && [...(playbacks.get(element)?.values() ?? [])].some(playback => playback.active)) {
      const cycle = (repeat: number, delay = transition.delay) => ({
        ...part, variants: { ...part.variants, animate: { ...pose, transition: { ...transition, repeat, delay } } },
      });
      animateSequence(track, [
        track => animateSvgPart(element, cycle(0), false, track),
        track => { clearSvgPart(element, part); animateSvgPart(element, cycle(Infinity, 0), false, track); },
      ]);
      return;
    }
    const targets: Transform = {};
    const propertyOptions: Parameters<typeof animateSvgTransform>[5] = {};
    for (const [key, value] of Object.entries(pose)) {
      if (["transition", "d", "pathLength", "pathOffset", "strokeWidth", "strokeDashoffset", "opacity"].includes(key)) continue;
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
    effects?.animate(element, pose, transition, returning, track, beginPlayback);
  }

  function clearSvgPart(element: SVGElement, part: SvgPart) {
    playbacks.delete(element);
    clearSvgTransform(element);
    if (part.origin) element.style.removeProperty("transform-origin");
    if (part.transformBox) element.style.removeProperty("transform-box");
    effects?.clear(element, part);
  }

  function createSvgPartsRecipe(parts: SvgPart[]): IconRecipe {
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

  return { animateSvgPart, clearSvgPart, createSvgPartsRecipe };
}

export const createSvgTransformPartsRecipe: (parts: SvgTransformPart[]) => IconRecipe = createSvgPartsPlayer().createSvgPartsRecipe;
