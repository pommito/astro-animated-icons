import type { TransformCycle } from "./finite-transform-cycle";
import { cycleCSS as finiteCSS } from "./cycle-css";
import { combinedCycleCSS } from "./combined-cycle-css";

export function cycleCSS(cycle: TransformCycle) {
  return "tracks" in cycle ? combinedCycleCSS(cycle) : finiteCSS(cycle);
}
