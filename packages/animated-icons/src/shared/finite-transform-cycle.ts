export interface FiniteTransformCycle {
  id: string;
  target: "svg" | "[data-chevron]" | '[data-motion="0"]';
  property: "rotate" | "translateX";
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
