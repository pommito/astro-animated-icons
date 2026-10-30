import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const disc3Cycle = {
  id: "disc-3",
  target: "[data-motion=\"0\"]",
  property: "rotate",
  values: [0, 90],
  times: [0, 1],
  duration: 0.4,
  ease: "easeInOut",
  finish: "hold",
  replay: "current"
} satisfies FiniteTransformCycle;
