import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { readCatalog } from "./catalog.mjs";

const defaultRoot = fileURLToPath(new URL("../", import.meta.url));
const fields = {
  targets: new Set(["selector", "target", "axis", "property", "transform", "rotate", "rotateX", "x", "y", "translateX", "scale", "scaleX", "scaleY", "opacity", "d", "pathLength", "pathOffset", "strokeWidth", "strokeDasharray", "strokeDashoffset", "origin", "transformBox", "values", "normal", "animate"]),
  timing: new Set(["duration", "returnDuration", "delay", "times", "ease", "repeat", "repeatType", "type", "stiffness", "damping", "mass", "velocity", "restSpeed"]),
  policies: new Set(["finish", "replay", "preservePose", "preserveCycleEnd", "continueOnReturn"]),
};

function literal(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) return -Number(node.operand.text);
  if (ts.isArrayLiteralExpression(node)) {
    const values = node.elements.map(literal);
    return values.every(value => value !== undefined) ? values : undefined;
  }
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return literal(node.expression);
  if (ts.isObjectLiteralExpression(node)) {
    const entries = node.properties.map(property => ts.isPropertyAssignment(property) ? [property.name.getText().replaceAll('"', ""), literal(property.initializer)] : undefined);
    return entries.every(entry => entry && entry[1] !== undefined) ? Object.fromEntries(entries) : undefined;
  }
}

export function readModule(root, path) {
  const source = readFileSync(resolve(root, path), "utf8");
  const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const facts = { targets: [], timing: [], policies: [], selectors: [], measurements: [], velocity: [], sequencing: [], constants: [], calls: [] };
  const imports = [];
  const calls = [];
  const record = (group, node, expression = node.getText(ast)) => facts[group].push({ line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1, expression });
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const specifier = node.moduleSpecifier.text;
      const typeOnly = node.importClause?.isTypeOnly || node.isTypeOnly;
      if (!typeOnly) imports.push(specifier);
    }
    if (ts.isPropertyAssignment(node)) {
      const name = node.name.getText(ast).replaceAll('"', "");
      for (const [group, names] of Object.entries(fields)) if (names.has(name)) record(group, node);
    }
    if (ts.isVariableDeclaration(node) && node.initializer && !ts.isArrowFunction(node.initializer) && !ts.isFunctionExpression(node.initializer)) record("constants", node);
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const name = node.expression.getText(ast);
      calls.push({ name, arguments: [...(node.arguments ?? [])].map(literal) });
      record("calls", node);
      if (/querySelector/.test(name)) record("selectors", node);
      if (/getTotalLength|getBBox|getBoundingClientRect/.test(name)) record("measurements", node);
      if (/getVelocity|setWithVelocity|motionValue|spring/.test(name)) record("velocity", node);
      if (/Sequence|setTimeout|requestAnimationFrame/.test(name)) record("sequencing", node);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  const dependencies = imports.filter(specifier => specifier.startsWith(".")).map(specifier => {
    const base = resolve(root, dirname(path), specifier);
    return [base, `${base}.ts`].find(file => existsSync(file) && file.endsWith(".ts"));
  }).filter(Boolean).map(file => relative(root, file)).filter(file => !file.endsWith("/element.ts"));
  return { path, sha256: createHash("sha256").update(source).digest("hex"), imports, dependencies, facts, calls };
}

const reviewed = JSON.parse(readFileSync(new URL("./animation-decisions.json", import.meta.url), "utf8"));

function decision(modules, engine, slug) {
  const names = modules.map(module => module.path);
  const localCalls = modules.filter(module => /\/icons\//.test(module.path)).flatMap(module => module.calls);
  const cycle = localCalls.find(call => call.name === "animateChevronCycle")?.arguments[3];
  if (engine === "css") return { status: "supported", capability: names.some(name => name.endsWith("/css-opacity.ts")) ? "timed-opacity-parts" : "finite-transform-cycle", reason: "Production adapter selects CSS; recipe data and engine wiring are included as evidence." };
  if (reviewed[slug]) {
    const sourceHash = createHash("sha256").update(JSON.stringify(modules.map(module => [module.path, module.sha256]))).digest("hex");
    return sourceHash === reviewed[slug].sourceHash ? reviewed[slug] : { status: "review", capability: "changed-reviewed-source", reason: "Recipe or shared dependencies changed after the recorded review; resolve the effective settings again.", previousDecision: reviewed[slug] };
  }
  if (cycle && ["X", "Y"].includes(cycle.axis) && Array.isArray(cycle.values) && cycle.values.every(value => typeof value === "number") && typeof cycle.duration === "number") {
    const requiredCapabilities = [
      ...(cycle.axis === "Y" ? ["translateY"] : []),
      ...((cycle.returnDuration ?? cycle.duration) !== cycle.duration || cycle.ease !== "easeOut" ? ["independent-return-timing"] : []),
    ];
    return { status: requiredCapabilities.length ? "candidate" : "supported", capability: requiredCapabilities.length ? `finite-transform-cycle+${requiredCapabilities.join("+")}` : "finite-transform-cycle", requiredCapabilities, reason: "Resolved finite chevron cycle. Preserve its explicit offsets, restart entry, restore completion, and return duration. Engine records whether migration has happened; parity still needs fixture evidence.", resolvedCycle: cycle,
      resolvedPlayback: { target: "[data-chevron]", property: `translate${cycle.axis}`, repeat: 0, replay: "restart", finish: "restore", returnDuration: cycle.returnDuration ?? cycle.duration, returnEase: "easeOut" } };
  }
  if (names.some(name => name.endsWith("/chevron-spring.ts"))) return { status: "motion", capability: "inherited-velocity", reason: "Chevron spring samples interrupted position and velocity and passes that velocity into the next spring." };
  if (names.some(name => name.endsWith("/loader-circle/definition.ts"))) return { status: "motion", capability: "inherited-velocity", reason: "LoaderCircle loops rotation, preserves the cycle end, and returns through svg-parts' spring using svg-transform's retained angular velocity." };
  if (names.some(name => name.endsWith("/archive/definition.ts"))) return { status: "motion", capability: "motion-value-and-morph", reason: "Archive retains a Motion value for the lid spring and morphs body and handle paths." };
  const keyframes = localCalls.find(call => call.name === "createSvgKeyframesRecipe");
  if (keyframes && keyframes.arguments.slice(0, 2).every(Boolean) && Object.keys(keyframes.arguments[0]).length === 1 && Array.isArray(keyframes.arguments[0].rotate) && keyframes.arguments[1].duration && !keyframes.arguments[1].type && !keyframes.arguments[1].repeat && keyframes.arguments.length <= 3) {
    return { status: "review", capability: "finite-rotation-cycle", reason: "Resolved single rotation keyframes with finite timing. Review easing compatibility and extract cycle data before choosing CSS; current-pose replay and return need parity evidence.", resolvedTargets: keyframes.arguments[0], resolvedTransition: keyframes.arguments[1] };
  }
  const measurement = modules.some(module => module.facts.measurements.length);
  const parts = names.some(name => name.endsWith("/svg-parts.ts"));
  return { status: "review", capability: measurement ? "runtime-geometry" : parts ? "svg-parts-property-transitions" : "custom-recipe", reason: measurement ? "Runtime geometry feeds playback; review measurement use and interrupted return before choosing an engine." : parts ? "Resolve each part's normal/animate transition and property overrides. Scalar transforms can inherit spring defaults even without a local spring setting." : "Static evidence records local and shared expressions; branch-dependent playback and return behavior need recipe review." };
}

export function inventoryAnimations(root = defaultRoot) {
  const catalog = readCatalog(readFileSync(resolve(root, "packages/animated-icons/src/astro.ts"), "utf8")).sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  assert.equal(new Set(catalog.map(icon => icon.slug)).size, catalog.length, "Duplicate exported slug");
  const cache = new Map();
  function load(path) {
    if (!cache.has(path)) cache.set(path, readModule(root, path));
    return cache.get(path);
  }
  function closure(path, seen = new Set()) {
    if (seen.has(path)) return seen;
    seen.add(path);
    for (const dependency of load(path).dependencies) closure(dependency, seen);
    return seen;
  }
  const icons = catalog.map(icon => {
    const directory = `packages/animated-icons/src/icons/${icon.slug}`;
    const definition = `${directory}/definition.ts`;
    assert.ok(existsSync(resolve(root, definition)), `${icon.slug}: missing definition`);
    const recipeFiles = closure(definition);
    const adapterPath = `${directory}/${icon.name}.astro`;
    const adapter = existsSync(resolve(root, adapterPath)) ? adapterPath : undefined;
    const adapterSource = adapter ? readFileSync(resolve(root, adapter), "utf8") : "";
    const registration = adapterSource.includes("CssOpacityIcon")
      ? "packages/animated-icons/src/shared/register-css-opacity.ts"
      : adapterSource.includes("CssIcon") ? "packages/animated-icons/src/shared/register-css-cycle.ts" : `${directory}/element.ts`;
    if (existsSync(resolve(root, registration))) closure(registration, recipeFiles);
    const files = [...recipeFiles].sort();
    const engine = /css-cycle|CssIcon|cycle-css|CssOpacityIcon/.test(adapterSource) || files.some(file => /\/css-(?:cycle|opacity)\.ts$/.test(file)) ? "css" : "motion";
    const modules = files.map(load);
    const classification = decision(modules, engine, icon.slug);
    const migrationState = engine === "css" ? "migrated" : classification.status === "supported" ? "supported-but-deferred" : classification.status === "motion" ? "retained-on-motion" : classification.status === "candidate" ? "capability-needed" : "needs-review";
    return { ...icon, definition, adapter: adapter ?? null, registration, engine, mechanisms: files.filter(file => file.includes("/shared/") || file.includes("/css-")), sources: files, classification, migrationState,
      uncertainty: ["Static source analysis does not establish browser parity or visual acceptance.", ...(classification.status === "review" ? ["Expressions are traceable evidence, not evaluated effective settings. Review the referenced call paths and defaults."] : []), ...(!adapter ? ["Adapter filename did not match the component export; engine requires review."] : [])],
      lifecycle: { source: "packages/animated-icons/src/element.ts", completion: "Completed return clears; entry follows recipe finish policy.", interruption: "Lifecycle stops and cancels old tracks; recipe chooses retained pose and velocity.", replay: "See cycle replay or local and shared animate expressions.", return: "See local returning branches and shared defaults in sources." } };
  });
  const queue = ["supported", "candidate", "motion", "review"].flatMap(status => [...new Set(icons.filter(icon => icon.classification.status === status).map(icon => icon.classification.capability))].sort().map(capability => ({ status, capability, icons: icons.filter(icon => icon.classification.status === status && icon.classification.capability === capability).map(icon => icon.slug) })));
  const sources = Object.fromEntries([...cache].sort(([a], [b]) => a.localeCompare(b, "en")).map(([path, module]) => [path, { sha256: module.sha256, imports: module.imports, dependencies: module.dependencies, ...module.facts }]));
  const sharedDefaults = {
    "shared/chevron": "Entry uses values/times/ease; return uses returnDuration ?? duration, [0,1], easeOut. Entry restarts at the first explicit value. Recipe finish is local.",
    "shared/svg-keyframes": "finish hold; origin 50% 50%; return transition defaults to entry transition. Replay replaces first keyframe with current pose when an inline transform exists.",
    "shared/svg-transform": "duration defaults to 0.3 s; ease defaults to easeOut. Rest is 1 for scale/opacity, otherwise 0 unless normal overrides it. Springs use previous velocity. Property overrides, repeat, preservePose and continueOnReturn affect interruption.",
    "shared/svg-parts": "finish hold. Pose transition overrides part transition. Scalar transforms without duration/type spring get spring defaults: scale stiffness 550/damping 30, other transforms 500/25, restSpeed 10. Timed transforms default to 0.8 s for >2 keyframes, otherwise 0.3 s. Paint properties use property transition overrides. Review normal and animate independently.",
  };
  const families = ["chevron", "svg-keyframes", "svg-parts", "svg-transform", "css-cycle", "css-opacity"].map(name => {
    const path = `packages/animated-icons/src/shared/${name}.ts`;
    return { mechanism: path, directDefinitions: icons.filter(icon => load(icon.definition).dependencies.includes(path)).length, transitiveRecipes: icons.filter(icon => icon.sources.includes(path)).length };
  });
  return { schemaVersion: 1, scope: "Exported Astro icons. Shared-source evidence may contain branches unused by a particular caller; it is not an eligibility certificate.", count: icons.length, sharedDefaults, families, queue, icons, sources };
}

export function summarizeInventory(inventory) {
  return [`Animation inventory: ${inventory.count} exported icons`, ...inventory.families.map(family => `${family.mechanism}: ${family.directDefinitions} direct, ${family.transitiveRecipes} transitive`), ...inventory.queue.map(group => `${group.status} / ${group.capability}: ${group.icons.length}`), "Visual acceptance: pending"].join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  assert.ok(args.every((arg, index) => arg === "--summary" || arg === "--output" || args[index - 1] === "--output"), "Usage: inventory-animations.mjs [--summary] [--output FILE]");
  const inventory = inventoryAnimations();
  const outputIndex = args.indexOf("--output");
  if (outputIndex >= 0) {
    assert.ok(args[outputIndex + 1], "--output needs a path");
    writeFileSync(args[outputIndex + 1], `${JSON.stringify(inventory, null, 2)}\n`);
  }
  if (args.includes("--summary")) console.log(summarizeInventory(inventory));
  else if (outputIndex < 0) console.log(JSON.stringify(inventory, null, 2));
}
