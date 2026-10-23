import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const bellCycle = {
  id: "bell",
  target: "svg",
  property: "rotate",
  values: [0, -10, 10, -10, 0],
  duration: 0.5,
  times: [0, 0.25, 0.5, 0.75, 1],
  ease: "easeInOut",
  finish: "hold",
  replay: "current",
  origin: "50% 50%",
} satisfies FiniteTransformCycle;
