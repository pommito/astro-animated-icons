import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const circleChevronRightCycle = {
  id: "circle-chevron-right",
  target: "[data-chevron]",
  property: "translateX",
  values: [0, 2, 0],
  duration: 0.5,
  times: [0, 0.4, 1],
  ease: "easeOut",
  finish: "restore",
  replay: "restart",
} satisfies FiniteTransformCycle;
