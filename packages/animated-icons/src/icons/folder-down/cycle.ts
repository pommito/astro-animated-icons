import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const folderDownCycle = {
  id: "folder-down",
  target: '[data-motion="0"]',
  property: "translateY",
  values: [0, 2, 0],
  duration: 0.5,
  times: [0, 0.4, 1],
  ease: "easeOut",
  finish: "hold",
  replay: "restart",
} satisfies FiniteTransformCycle;
