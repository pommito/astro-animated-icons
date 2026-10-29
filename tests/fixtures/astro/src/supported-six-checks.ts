import captured from "../../../../docs/history/2026-10-29-supported-six-motion-before.json";
import { installFiniteComparisonChecks } from "./finite-comparison-checks";

await installFiniteComparisonChecks(captured, {
  "disc-3": { target: '[data-motion="0"]', duration: 400 },
  "panel-left-close": { target: '[data-motion="0"]', duration: 500 },
  "panel-left-open": { target: '[data-motion="0"]', duration: 500 },
  "panel-right-open": { target: '[data-motion="0"]', duration: 500 },
  "briefcase-business": { target: "svg", duration: 900, returnDuration: 300, clearOrigin: true },
  "tree-pine": { target: "svg", duration: 500 },
});
