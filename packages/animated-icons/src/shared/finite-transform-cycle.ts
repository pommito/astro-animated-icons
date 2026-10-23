export interface FiniteTransformCycle {
  id: string;
  target: "svg" | "[data-chevron]";
  property: "rotate" | "translateX";
  values: number[];
  duration: number;
  times: number[];
  ease: "easeInOut" | "easeOut";
  finish: "hold" | "restore";
  replay: "current" | "restart";
  origin?: string;
}
