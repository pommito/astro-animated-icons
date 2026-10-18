import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixture = join(root, "tests/fixtures/astro");
const fixtureRequire = createRequire(join(fixture, "package.json"));
const astroPackage = fixtureRequire.resolve("astro/package.json");
const astroCLI = resolve(dirname(astroPackage), JSON.parse(readFileSync(astroPackage, "utf8")).bin.astro);
const output = join(root, "tests/fixtures/astro/dist");
const stateFile = join(root, ".artifacts/fixture-build.json");
const lockFile = join(root, ".artifacts/fixture.lock");
const ignored = new Set(["node_modules", ".astro", "dist", ".git"]);

function digest(paths) {
  const hash = createHash("sha256");
  function visit(path) {
    if (!existsSync(join(root, path))) {
      hash.update(`missing:${path}\0`);
      return;
    }
    const entries = readdirSync(join(root, path), { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (ignored.has(entry.name)) continue;
      const child = join(path, entry.name);
      if (entry.isDirectory()) visit(child);
      else {
        const content = readFileSync(join(root, child));
        hash.update(`${child}\0${content.length}\0`).update(content);
      }
    }
  }
  for (const path of paths) visit(path);
  return hash.digest("hex");
}

function inputs() {
  const files = ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", "tsconfig.json", ".npmrc", "scripts/fixture.mjs", "node_modules/.pnpm/lock.yaml", "node_modules/.modules.yaml",
    ...readdirSync(root).filter((name) => name.startsWith(".env"))];
  const environment = Object.fromEntries(Object.entries(process.env).filter(([key]) => /^(ASTRO_|VITE_|NODE_OPTIONS$)/.test(key)).sort());
  const hash = createHash("sha256").update(JSON.stringify([root, process.version, environment]));
  for (const file of files) {
    hash.update(file).update(existsSync(join(root, file)) ? readFileSync(join(root, file)) : "missing");
  }
  return hash.update(digest(["packages/animated-icons", "tests/fixtures/astro", "tests/helpers"])).digest("hex");
}

function current(source) {
  try {
    const state = JSON.parse(readFileSync(stateFile, "utf8"));
    return state.inputs === source && existsSync(output) && state.output === digest(["tests/fixtures/astro/dist"]);
  } catch {
    return false;
  }
}

let child;
let stopping = false;
function run(args) {
  return new Promise((resolve, reject) => {
    child = spawn(process.execPath, [astroCLI, ...args], {
      cwd: fixture, stdio: "inherit", env: { ...process.env, NODE_ENV: "production" },
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      child = undefined;
      if (code === 0 || stopping) resolve();
      else reject(new Error(`Fixture process failed (${signal ?? code}).`));
    });
  });
}

async function main() {
  const command = process.argv[2];
  if (!["build", "serve", "check"].includes(command)) throw new Error("Usage: node scripts/fixture.mjs build [--fresh] | serve | check");
  if (command === "check") {
    if (!current(inputs())) throw new Error("Fixture output is missing, modified, or stale. Run pnpm test:prepare.");
    console.log("Fixture output matches current sources.");
    return;
  }
  mkdirSync(dirname(lockFile), { recursive: true });
  const lock = openSync(lockFile, "wx");
  writeFileSync(lock, String(process.pid));
  closeSync(lock);
  const unlock = () => rmSync(lockFile, { force: true });
  process.once("exit", unlock);
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      stopping = true;
      child?.kill(signal);
    });
  }
  try {
    const source = inputs();
    if (process.argv.includes("--fresh") || !current(source)) {
      rmSync(stateFile, { force: true });
      console.log("Building fixture from current sources.");
      await run(["build"]);
      if (stopping) return;
      if (source !== inputs()) throw new Error("Sources changed during the build. Run pnpm test:prepare again.");
      writeFileSync(stateFile, JSON.stringify({ inputs: source, output: digest(["tests/fixtures/astro/dist"]) }) + "\n");
    } else console.log("Reusing fixture: sources and output match.");
    if (command === "serve" && !stopping) {
      const port = process.env.ICON_TEST_PORT ?? "45321";
      if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new Error("ICON_TEST_PORT must be an integer between 1 and 65535.");
      await run(["preview", "--ignore-lock", "--host", "127.0.0.1", "--port", port]);
    }
  } finally {
    unlock();
    process.removeListener("exit", unlock);
  }
}

main().catch((error) => {
  console.error(error.code === "EEXIST" ? `Fixture is in use. Check the PID in ${lockFile}; remove the lock only if that process has stopped.` : error.message);
  process.exitCode = 1;
});
