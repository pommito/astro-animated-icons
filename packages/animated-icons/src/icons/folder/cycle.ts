import type { FiniteTransformCycle } from "../../shared/finite-transform-cycle";

export const folderCycle = {
  id: "folder",
  target: '[data-motion="0"]',
  property: "rotate",
  values: [0, -4, 3, -2, 0],
  duration: 0.4,
  times: [0, 0.25, 0.5, 0.75, 1],
  ease: "easeOut",
  returnDuration: 0.2,
  returnEase: "easeOut",
  finish: "hold",
  replay: "current",
} satisfies FiniteTransformCycle;
