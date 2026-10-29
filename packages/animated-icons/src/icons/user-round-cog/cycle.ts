import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const userRoundCogCycle = {
  id: "user-round-cog",
  target: "[data-cog]",
  property: "rotate",
  values: [0, 180],
  duration: 0.3,
  times: [0, 1],
  ease: "easeOut",
  finish: "hold",
  replay: "current",
} satisfies FiniteTransformCycle;
