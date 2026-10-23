import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const circleChevronUpCycle = {
  id: "circle-chevron-up",
  target: "[data-chevron]",
  property: "translateY",
  values: [0, -2, 0],
  duration: 0.5,
  times: [0, 0.4, 1],
  ease: "easeOut",
  finish: "restore",
  replay: "restart",
} satisfies FiniteTransformCycle;
