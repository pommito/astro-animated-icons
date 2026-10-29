import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const treePineCycle = {
  id: "tree-pine",
  target: "svg",
  property: "rotate",
  values: [0, -10, 10, -10, 0],
  times: [0, 0.25, 0.5, 0.75, 1],
  duration: 0.5,
  ease: "easeInOut",
  finish: "hold",
  replay: "current"
} satisfies FiniteTransformCycle;
