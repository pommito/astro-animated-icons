import { easeOut, spring } from "motion";
import { animate } from "motion/mini";
import type { IconRecipe } from "../element";

const velocities = new WeakMap<SVGElement, number>();

interface SignalStep {
  child: number;
  delay: number;
}

export function createSignalRecipe(steps: SignalStep[], fadeDuration = 0.3, springReturn = false): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      for (const { child, delay } of steps) {
        const shape = drawing.children[child - 1] as SVGElement;
        const current = Number(getComputedStyle(shape).opacity);
        if (returning && !springReturn) {
          track(onComplete => animate(shape, { opacity: 1 }, {
            duration: 0.4, ease: "easeOut", onComplete,
          }));
          continue;
        }
        // Native opacity springs normalize to 100 and inherit the fade's 30 ms Motion-value velocity.
        const generator = spring({ keyframes: [0, 100], velocity: returning ? velocities.get(shape) ?? 0 : -current / 0.03, stiffness: 300, damping: 20 });
        let springDuration = 0;
        do { springDuration += 50; } while (!generator.next(springDuration).done && springDuration < 10000);
        const start = (returning ? 0 : fadeDuration) * 1000 + delay * 1000;
        const duration = start + springDuration;
        const sample = (time: number) => {
          if (time < start) return returning ? current : time < fadeDuration * 1000
            ? current * (1 - easeOut(time / (fadeDuration * 1000))) : 0;
          const progress = generator.next(time - start).value / 100;
          return returning ? current + (1 - current) * progress : progress;
        };
        const values = Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, index) =>
          sample(index * duration / Math.ceil(duration / 5)),
        );
        track(onComplete => {
          let active = true;
          const animation = animate(shape, { opacity: values }, {
            duration: duration / 1000, ease: "linear",
            onComplete() {
              if (active) velocities.delete(shape);
              active = false;
              onComplete();
            },
          });
          return {
            stop() {
              if (!active) return;
              active = false;
              const time = Math.min(duration, Math.max(0, animation.time * 1000));
              const interval = Math.min(time, 5);
              velocities.set(shape, interval ? (sample(time) - sample(time - interval)) * 1000 / interval : 0);
              animation.stop();
            },
            cancel() {
              active = false;
              animation.cancel();
            },
          };
        });
      }
    },
    clear(drawing) {
      for (const { child } of steps) {
        const shape = drawing.children[child - 1] as SVGElement;
        velocities.delete(shape);
        shape.style.removeProperty("opacity");
      }
    },
  };
}
