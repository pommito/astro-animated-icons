import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
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
  const facts = { targets: [], timing: [], policies: [], selectors: [], measurements: [], velocity: [], sequencing: [], constants: [], calls: [], drawing: [] };
  if (path.endsWith(".astro")) source.split("\n").forEach((expression, index) => {
    if (/transform-origin|transform-box|svgStyle|data-(?:part|motion|spin|rotation|cog|chevron)/.test(expression)) facts.drawing.push({ line: index + 1, expression });
  });
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

const reviewDirectory = fileURLToPath(new URL("./", import.meta.url));
const reviewContext = ["packages/animated-icons/src/element.ts", "packages/animated-icons/src/Icon.astro", "packages/animated-icons/src/icon.css", "packages/animated-icons/src/shared/finite-transform-cycle.ts", "packages/animated-icons/src/shared/opacity-parts.ts", "pnpm-lock.yaml"];

function cssDelivery(source) {
  const mechanism = source.includes("CssPaintIcon") ? "paint" : source.includes("CssOpacityIcon") ? "opacity" : source.includes("CssIcon") ? "cycle" : undefined;
  if (!mechanism) return undefined;
  return {
    wrapper: `packages/animated-icons/src/${mechanism === "paint" ? "CssPaintIcon" : mechanism === "opacity" ? "CssOpacityIcon" : "CssIcon"}.astro`,
    registration: `packages/animated-icons/src/shared/register-css-${mechanism}.ts`,
  };
}

function decision(modules, slug, reviewed, families) {
  const record = reviewed[slug];
  if (!record) return { status: "review", capability: "unreviewed-source", reason: "No maintained source review exists. Review the complete recipe and add a pinned decision.", followUp: "#98: review this export before adding it to a rollout family." };
  assert.ok(Object.keys(record).every(key => ["family", "contract", "sourceHash", "familyHash"].includes(key)), `${slug}: unexpected decision field`);
  const family = families[record.family];
  assert.ok(family, `${slug}: unknown reviewed family ${record.family}`);
  assert.ok(["supported", "candidate", "motion"].includes(family.status), `${slug}: invalid reviewed outcome`);
  assert.ok(family.capability && family.reason && family.followUp && family.contract?.playback, `${slug}: incomplete family review`);
  assert.ok(record.contract && (record.contract.review || record.contract.construction?.length || record.contract.effectiveParts?.length), `${slug}: missing recipe contract`);
  const sourceHash = createHash("sha256").update(JSON.stringify(modules.map(module => [module.path, module.sha256]))).digest("hex");
  const familyHash = createHash("sha256").update(JSON.stringify(family)).digest("hex");
  if (sourceHash !== record.sourceHash || familyHash !== record.familyHash) return {
    status: "review", capability: "changed-reviewed-source", reason: "Recipe, drawing, delivery, lifecycle, dependency lock or family contract changed after review. Recheck the affected call paths before renewing the decision.",
    followUp: "#98: resolve source drift and update the reviewed contract and hashes.", observedSourceHash: sourceHash, observedFamilyHash: familyHash, previousDecision: record,
  };
  return { ...family, ...record, reviewed: true };
}

export function inventoryAnimations(root = defaultRoot, { requireReviewed = false } = {}) {
  const catalog = readCatalog(readFileSync(resolve(root, "packages/animated-icons/src/astro.ts"), "utf8")).sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  assert.equal(new Set(catalog.map(icon => icon.slug)).size, catalog.length, "Duplicate exported slug");
  const recordsPath = resolve(root, "scripts/animation-decisions.json");
  const familiesPath = resolve(root, "scripts/animation-families.json");
  const reviewed = JSON.parse(readFileSync(existsSync(recordsPath) ? recordsPath : resolve(reviewDirectory, "animation-decisions.json"), "utf8"));
  const reviewedFamilies = JSON.parse(readFileSync(existsSync(familiesPath) ? familiesPath : resolve(reviewDirectory, "animation-families.json"), "utf8"));
  if (requireReviewed) for (const slug of Object.keys(reviewed)) assert.ok(catalog.some(icon => icon.slug === slug), `Orphan reviewed export: ${slug}`);
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
    const delivery = cssDelivery(adapterSource);
    const registration = delivery?.registration ?? `${directory}/element.ts`;
    if (existsSync(resolve(root, registration))) closure(registration, recipeFiles);
    const runtimeSources = [...recipeFiles].sort();
    const engine = delivery || runtimeSources.some(file => /\/css-(?:cycle|opacity|paint)\.ts$/.test(file)) ? "css" : "motion";
    const proofMechanism = reviewedFamilies[reviewed[icon.slug]?.family]?.capability === "runtime-path-paint" ? "paint" : "cycle";
    const provenMechanismSources = engine === "motion" && reviewedFamilies[reviewed[icon.slug]?.family]?.status === "supported"
      ? [...closure(`packages/animated-icons/src/shared/register-css-${proofMechanism}.ts`), `packages/animated-icons/src/${proofMechanism === "paint" ? "CssPaintIcon" : "CssIcon"}.astro`].sort() : [];
    for (const path of provenMechanismSources) recipeFiles.add(path);
    if (adapter) recipeFiles.add(adapter);
    for (const file of readdirSync(resolve(root, directory))) {
      if (/\.(ts|astro)$/.test(file)) {
        const path = `${directory}/${file}`;
        recipeFiles.add(path);
        if (file.endsWith(".ts")) for (const dependency of closure(path)) recipeFiles.add(dependency);
      }
    }
    for (const path of reviewContext) if (existsSync(resolve(root, path))) recipeFiles.add(path);
    if (delivery) recipeFiles.add(delivery.wrapper);
    if (delivery?.registration.endsWith("register-css-paint.ts") || provenMechanismSources.some(path => path.endsWith("register-css-paint.ts"))) recipeFiles.add("packages/animated-icons/src/shared/paint-recipe.ts");
    const files = [...recipeFiles].sort();
    const modules = files.map(load);
    const classification = decision(modules, icon.slug, reviewed, reviewedFamilies);
    const migrationState = classification.status === "supported" ? engine === "css" ? "migrated" : "supported-but-deferred" : classification.status === "motion" ? "retained-on-motion" : classification.status === "candidate" ? "capability-needed" : "needs-review";
    return { ...icon, definition, adapter: adapter ?? null, registration, engine, mechanisms: runtimeSources.filter(file => file.includes("/shared/") || file.includes("/css-")), runtimeSources, provenMechanismSources, sources: files, classification, migrationState,
      uncertainty: ["Static source analysis does not establish browser parity or visual acceptance.", ...(classification.status === "review" ? ["Expressions are traceable evidence, not evaluated effective settings. Review the referenced call paths and defaults."] : []), ...(!adapter ? ["Adapter filename did not match the component export; engine requires review."] : [])],
      lifecycle: { source: "packages/animated-icons/src/element.ts", completion: "Completed return clears; entry follows recipe finish policy.", interruption: "Lifecycle stops and cancels old tracks; recipe chooses retained pose and velocity.", replay: "See cycle replay or local and shared animate expressions.", return: "See local returning branches and shared defaults in sources." } };
  });
  if (requireReviewed) assert.ok(icons.every(icon => icon.classification.reviewed), "Catalogue contains missing or stale source reviews: " + icons.filter(icon => !icon.classification.reviewed).map(icon => icon.slug).join(", "));
  const familyQueue = [...new Set(icons.map(icon => icon.classification.family ?? "unreviewed"))].sort().map(family => ({
    family, ...(reviewedFamilies[family] ?? {}), icons: icons.filter(icon => (icon.classification.family ?? "unreviewed") === family).map(icon => icon.slug),
  }));
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
    return { mechanism: path, directDefinitions: icons.filter(icon => load(icon.definition).dependencies.includes(path)).length, transitiveRecipes: icons.filter(icon => icon.runtimeSources.includes(path)).length };
  });
  return { schemaVersion: 2, reviewedCount: icons.filter(icon => icon.classification.reviewed).length, familyQueue, scope: "Exported Astro icons. Shared-source evidence may contain branches unused by a particular caller; it is not an eligibility certificate.", count: icons.length, sharedDefaults, families, queue, icons, sources };
}

export function summarizeInventory(inventory) {
  const states = ["migrated", "supported-but-deferred", "capability-needed", "retained-on-motion", "needs-review"];
  return [`Animation inventory: ${inventory.count} exported icons`, ...states.map(state => `${state}: ${inventory.icons.filter(icon => icon.migrationState === state).length}`), ...inventory.families.map(family => `${family.mechanism}: ${family.directDefinitions} direct, ${family.transitiveRecipes} transitive`), ...inventory.queue.map(group => `${group.status} / ${group.capability}: ${group.icons.length}`), "Source reviews: " + inventory.reviewedCount + "/" + inventory.count, "Visual acceptance: see separately scoped owner records in docs/css-migration-plan.md"].join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  assert.ok(args.every((arg, index) => arg === "--check" || arg === "--summary" || arg === "--output" || args[index - 1] === "--output"), "Usage: inventory-animations.mjs [--check] [--summary] [--output FILE]");
  const inventory = inventoryAnimations(defaultRoot, { requireReviewed: args.includes("--check") });
  const outputIndex = args.indexOf("--output");
  if (outputIndex >= 0) {
    assert.ok(args[outputIndex + 1], "--output needs a path");
    writeFileSync(args[outputIndex + 1], `${JSON.stringify(inventory, null, 2)}\n`);
  }
  if (args.includes("--summary")) console.log(summarizeInventory(inventory));
  else if (outputIndex < 0) console.log(JSON.stringify(inventory, null, 2));
}
