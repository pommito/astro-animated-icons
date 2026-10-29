import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const briefcaseBusinessCycle = {
  id: "briefcase-business",
  target: "svg",
  property: "rotate",
  values: [0, 4, -3, 2, 0],
  times: [0, 0.25, 0.5, 0.75, 1],
  duration: 0.9,
  ease: "easeInOut",
  returnDuration: 0.3,
  returnEase: "easeOut",
  origin: "12px 4px",
  finish: "hold",
  replay: "current"
} satisfies FiniteTransformCycle;
