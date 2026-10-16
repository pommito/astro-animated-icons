import { spring } from "motion";
import { animate } from "motion/mini";
import { animateArrow, clearArrow } from "../../shared/arrow";
import type { IconRecipe, IconTrack } from "../../element";

export const arrowDownPaths = ["m19 12-7 7-7-7", "M12 5v14"];

const velocities = new WeakMap<SVGPathElement, number>();

function animateArrowDown(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateArrow(drawing, returning, track, {
    axis: "Y",
    headAnimation(head, returning, onComplete) {
      let frames: (string | null)[] = [null, "translateY(-3px)", "translateY(0px)"];
      let duration = 0.4;
      if (returning) {
        const position = new DOMMatrix(getComputedStyle(head).transform).m42;
        const generator = spring({
          keyframes: [position, 0],
          velocity: velocities.get(head) ?? 0,
          stiffness: 500,
          damping: 25,
          restSpeed: 10,
          restDelta: 0.005,
        });
        frames = [];
        let time = 0;
        for (; time <= 2000; time += 5) {
          const state = generator.next(time);
          frames.push(`translateY(${state.value}px)`);
          if (state.done) break;
        }
        duration = time / 1000;
      }
      const control = animate(head, { transform: frames }, { duration, ease: returning ? "linear" : "easeInOut", onComplete });
      return {
        stop() {
          // Motion mini commits position on stop but does not retain velocity.
          const animation = head.getAnimations()[0];
          const time = Number(animation?.currentTime ?? 0);
          const interval = Math.min(10, time);
          let velocity = 0;
          if (animation && interval > 0) {
            const current = new DOMMatrix(getComputedStyle(head).transform).m42;
            animation.currentTime = time - interval;
            const previous = new DOMMatrix(getComputedStyle(head).transform).m42;
            animation.currentTime = time;
            velocity = (current - previous) * 1000 / interval;
          }
          velocities.set(head, velocity);
          control.stop();
        },
        cancel: () => control.cancel(),
      };
    },
    shaftReturn: { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] },
  });
}

export const arrowDownRecipe = {
  finish: "restore",
  animate: animateArrowDown,
  clear: clearArrow,
} satisfies IconRecipe;
