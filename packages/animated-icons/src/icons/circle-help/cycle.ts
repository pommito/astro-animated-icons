import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const circleHelpCycle = {
  id: "circle-help",
  target: 'g > g',
  property: "rotate",
  values: [0, -10, 10, -10, 0],
  duration: 0.5,
  times: [0, 0.25, 0.5, 0.75, 1],
  ease: "easeInOut",
  finish: "hold",
  replay: "current",
} satisfies FiniteTransformCycle;
