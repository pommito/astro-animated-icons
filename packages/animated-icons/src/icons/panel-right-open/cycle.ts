import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const panelRightOpenCycle = {
  id: "panel-right-open",
  target: "[data-motion=\"0\"]",
  property: "translateX",
  values: [0, -1.5, 0],
  times: [0, 0.4, 1],
  duration: 0.5,
  ease: "easeOut",
  finish: "hold",
  replay: "current"
} satisfies FiniteTransformCycle;
