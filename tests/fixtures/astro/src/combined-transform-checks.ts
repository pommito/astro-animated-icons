import captured from "../../../../docs/history/2026-10-29-combined-motion-before.json";
import { installFiniteComparisonChecks } from "./finite-comparison-checks";

await installFiniteComparisonChecks(captured, {
  "key-square": { target: "svg", duration: 600, clearOrigin: true, linear: true },
  wallet: { target: "svg", duration: 550, returnDuration: 300, clearOrigin: true, linear: true },
  "key-circle": { target: "svg", duration: 900, clearOrigin: true, linear: true },
});
