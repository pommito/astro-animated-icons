import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const chevronFirstCycle = {
  id: "chevron-first",
  target: "[data-chevron]",
  property: "translateX",
  values: [-2, 1, -1, 0],
  duration: 0.6,
  times: [0, 0.3, 0.7, 1],
  ease: "easeInOut",
  returnDuration: 0.3,
  returnEase: "easeOut",
  finish: "restore",
  replay: "restart",
} satisfies FiniteTransformCycle;
