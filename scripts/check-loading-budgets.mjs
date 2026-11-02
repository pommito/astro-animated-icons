import { readFileSync } from "node:fs";
import { checkLoadingBudgets } from "./loading-budgets.mjs";

const args = process.argv.slice(2);
const file = args.find(arg => !arg.startsWith("--")) ?? ".artifacts/page-loading/baseline.json";
checkLoadingBudgets(JSON.parse(readFileSync(file, "utf8")), { proposed: args.includes("--proposed") });
console.log("Verified full/minimal loading budgets, frozen compositions and structural JavaScript checks"
  + (args.includes("--proposed") ? "; proposed #110 targets also met." : "; #110 targets remain proposed."));
