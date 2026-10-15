import { spring } from "motion";
import { animate } from "motion/mini";
import { animateArrow, clearArrow } from "../arrow";

export const arrowDownPaths = ["m19 12-7 7-7-7", "M12 5v14"];

const velocities = new WeakMap<SVGPathElement, number>();
const recipe = {
  clear: clearArrow,
  animate(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
    return animateArrow(drawing, returning, onComplete, {
      axis: "Y",
      headTravel: -3,
      headReturnAnimation(head, onComplete) {
        const position = new DOMMatrix(getComputedStyle(head).transform).m42;
        const generator = spring({
          keyframes: [position, 0],
          velocity: velocities.get(head) ?? 0,
          stiffness: 500,
          damping: 25,
          restSpeed: 10,
          restDelta: 0.005,
        });
        const frames: string[] = [];
        let duration = 0;
        for (; duration <= 2000; duration += 5) {
          const state = generator.next(duration);
          frames.push(`translateY(${state.value}px)`);
          if (state.done) break;
        }
        return animate(head, { transform: frames }, { duration: duration / 1000, ease: "linear", onComplete });
      },
      shaftReturn: { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] },
    });
  },
};

export const arrowDownRecipe = {
  ...recipe,
  animate(...args: Parameters<typeof recipe.animate>) {
    const controls: { stop(): void; cancel(): void }[] = recipe.animate(...args);
    const head = args[0].querySelector("path")!;
    const headControl = controls[0];
    controls[0] = {
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
        headControl.stop();
      },
      cancel: () => headControl.cancel(),
    };
    return controls;
  },
};
