import type { CombinedTransformCycle } from "../../shared/combined-transform-cycle";

export const keyCircleCycle: CombinedTransformCycle = {
  id: "key-circle",
  target: "svg",
  tracks: [
    { property: "translateY", values: [0, -3, 0, -2, 0], times: [0, 0.25, 0.5, 0.75, 1], rest: 0 },
    { property: "rotate", values: [0, 3, -3, 0], times: [0, 1 / 3, 2 / 3, 1], rest: 0 },
  ],
  duration: 0.9,
  ease: "easeOut",
  returnDuration: 0.9,
  returnEase: "easeOut",
  origin: "50% 50%",
  finish: "hold",
  replay: "current",
};
