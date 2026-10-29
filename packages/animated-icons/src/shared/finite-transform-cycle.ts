export interface FiniteTransformCycle {
  id: string;
  target: "svg" | "[data-cog]" | "[data-chevron]" | '[data-motion="0"]' | "g > g";
  property: "rotate" | "translateX" | "translateY";
  values: number[];
  duration: number;
  times: number[];
  ease: "easeInOut" | "easeOut";
  returnDuration?: number;
  returnEase?: "easeInOut" | "easeOut";
  finish: "hold" | "restore";
  replay: "current" | "restart";
  origin?: string;
}
