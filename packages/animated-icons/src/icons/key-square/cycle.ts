import type { CombinedTransformCycle } from "../../shared/combined-transform-cycle";

export const keySquareCycle: CombinedTransformCycle = {
  id: "key-square",
  target: "svg",
  tracks: [
    { property: "scale", values: [1, 1.05, 1, 1], times: [0, 1 / 3, 2 / 3, 1], rest: 1 },
    { property: "rotate", values: [0, 15, -15, 0], times: [0, 1 / 3, 2 / 3, 1], rest: 0 },
  ],
  duration: 0.6,
  ease: "easeOut",
  returnDuration: 0.6,
  returnEase: "easeOut",
  origin: "50% 50%",
  finish: "hold",
  replay: "current",
};
