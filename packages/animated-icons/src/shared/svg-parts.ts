import { animate, interpolate, svgEffect } from "motion";
import { animate as animateMini } from "motion/mini";
import { resolveSvgEasing } from "./svg-transform";
import { createSvgPartsPlayer } from "./svg-transform-parts";
export type { SvgPart, SvgVariants } from "./svg-transform-parts";

const defaultEase: [number, number, number, number] = [0.25, 0.1, 0.35, 1];

export const { animateSvgPart, clearSvgPart, createSvgPartsRecipe } = createSvgPartsPlayer({
  animate(element, pose, transition, returning, track, beginPlayback) {
    for (const property of ["d", "pathLength", "pathOffset", "strokeWidth", "strokeDashoffset", "opacity"] as const) {
      const target = pose[property];
      if (target === undefined) continue;
      const playback = beginPlayback(element, property, track);
      const options = transition[property] ?? transition;
      const { d: _d, pathLength: _length, pathOffset: _offset, strokeWidth: _width, strokeDashoffset: _dash, opacity: _opacity, ...settings } = options;
      const duration = settings.duration ?? (Array.isArray(target) && target.length > 2 ? 0.8 : 0.3);
      const ease = settings.ease ?? (Object.keys(options).some(key => !["delay", "repeat", "repeatType"].includes(key)) ? "easeOut" : defaultEase);
      const delay = settings.delay;
      if (property === "opacity" && settings.type === "spring") {
        playback.track(onComplete => {
          const values = !returning && playback.interrupted && Array.isArray(target)
            ? [Number(getComputedStyle(element).opacity), ...target.slice(1)] : target;
          const animation = animate(element, { opacity: values as number | number[] }, { ...settings, onComplete });
          const stop = () => {
            const current = Number(getComputedStyle(element).opacity);
            animation.stop();
            const value = svgEffect.get(element, "opacity");
            if (value) {
              // Native spring stop samples wall time; retain the displayed pose and its estimated velocity.
              value.setWithVelocity(current - value.getVelocity() / 100, current, 10);
              svgEffect.flush(element);
            } else element.style.opacity = String(current);
          };
          return { stop, cancel: stop };
        });
      } else if (property === "d") {
        playback.track(onComplete => {
          const values = !returning && playback.interrupted && Array.isArray(target)
            ? [element.getAttribute("d")!, ...target.slice(1)] : target as string | string[];
          const animation = animate(element, { attrD: values }, { duration, ease, delay, onComplete });
          return { stop: () => animation.stop(), cancel: () => animation.stop() };
        });
      } else {
        const css = property === "pathLength" ? "strokeDasharray" : property === "pathOffset" || property === "strokeDashoffset" ? "strokeDashoffset" : property === "opacity" ? "opacity" : "strokeWidth";
        let values = (Array.isArray(target) ? target : [target]).map(value => property === "pathLength" ? `${value}px 1px` : property === "pathOffset" ? `${-Number(value)}px` : Number(value));
        const current = element.style[css];
        if (!returning && playback.interrupted && values.length > 1 && current) values[0] = current;
        const sampled = Array.isArray(target) && values.length > 2 && property !== "opacity";
        if (sampled) {
          const offsets = settings.times?.length === values.length ? settings.times : values.map((_, index) => index / (values.length - 1));
          const easing = resolveSvgEasing(ease);
          const sample = interpolate(offsets, values, { ease: easing });
          const intervals = Math.max(1, Math.ceil(duration * 200));
          const first = values[0];
          values = Array.from({ length: intervals + 1 }, (_, index) => index === 0 ? first : sample(index / intervals));
        }
        playback.track(onComplete => animateMini(element, { [css]: Array.isArray(target) ? values : values[0] }, {
          duration, ease: sampled ? "linear" : ease,
          delay, times: !sampled && Array.isArray(target) && settings.times?.length === values.length ? settings.times : undefined,
          repeat: settings.repeat, onComplete,
        }));
      }
    }
  },
  clear(element, part) {
    svgEffect.state(element)?.release();
    const d = part.variants.normal.d;
    if (typeof d === "string") element.setAttribute("d", d);
    for (const property of ["stroke-dasharray", "stroke-dashoffset", "stroke-width"]) element.style.removeProperty(property);
  },
});
