import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const tests = readdirSync(new URL("./", import.meta.url)).filter(file => file.endsWith(".test.mjs")).sort().map(file => `scripts/${file}`);
const stages = [
  ["Types", "pnpm", ["check"]],
  ["Fixture", process.execPath, ["scripts/fixture.mjs", "build"]],
  ["Bundles", process.execPath, ["scripts/inspect-bundle.mjs"]],
  ["CSS pilot", process.execPath, ["scripts/check-css-pilot.mjs"]],
  ["Drawings", process.execPath, ["scripts/check-drawings.mjs"]],
  ["Validator tests", process.execPath, ["--test", "--test-concurrency=1", ...tests]],
];

const start = performance.now();
for (const [name, command, args] of stages) {
  const stageStart = performance.now();
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  console.log(`${name}: ${((performance.now() - stageStart) / 1000).toFixed(3)} seconds`);
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    break;
  }
}
console.log(`Validation: ${((performance.now() - start) / 1000).toFixed(3)} seconds`);
