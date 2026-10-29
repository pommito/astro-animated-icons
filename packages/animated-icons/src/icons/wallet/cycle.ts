import type { CombinedTransformCycle } from "../../shared/combined-transform-cycle";

export const walletCycle: CombinedTransformCycle = {
  id: "wallet",
  target: "svg",
  tracks: [
    { property: "translateY", values: [0, -3, 0], times: [0, 0.45, 1], rest: 0 },
    { property: "rotate", values: [0, -4, 0], times: [0, 0.45, 1], rest: 0 },
  ],
  duration: 0.55,
  ease: "easeInOut",
  returnDuration: 0.3,
  returnEase: "easeOut",
  origin: "12px 12px",
  finish: "hold",
  replay: "current",
};
