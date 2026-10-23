# Animation inventory

Run `pnpm inventory:animations --summary --output .artifacts/animation-inventory.json` from the repository root after installing dependencies. The command reads the current checkout without building the fixture or opening a browser. Without arguments it prints JSON. `--summary` prints capability groups and counts. Generated output belongs in `.artifacts/`, rather than a maintained catalogue table.

The inventory uses the public Astro exports as its membership list. It emits one entry per slug and rejects duplicate slugs or missing definitions. It follows runtime TypeScript imports and re-exports from each definition and registration, excluding the common lifecycle module. Shared sources appear once in the JSON, and each icon lists its source paths. Multiple mechanisms can appear in one entry.

## Data contract

`schemaVersion` is currently `1`. Output contains no timestamp or absolute checkout path. Icons, source paths and queue groups use stable ordering. Identical sources produce identical JSON.

Each icon records its export name, slug, tag, definition, Astro adapter, detected engine, mechanisms, source paths, classification, lifecycle contract and uncertainty. Engine detection checks the adapter and registration dependency graph for the CSS cycle adapter. It describes current wiring, not migration eligibility.

`sources` maps repository-relative paths to their SHA256, imports, resolved dependencies and evidence lists. Each evidence item contains a one-based source line and the original expression. Evidence includes target properties and selectors, timing, offsets, repetition, completion and replay settings, constants, calls, geometry measurements, spring/value calls and custom sequencing. Expressions such as `returning ? ...`, `Infinity`, computed delays and property overrides stay intact. The command never executes recipe code.

`sharedDefaults` explains the reviewed defaults for finite chevrons, SVG keyframes, SVG transforms and SVG parts. The source expressions remain the authority after later changes. For SVG parts, inspect the normal and animate poses independently. Pose transitions override part transitions. Property transitions can override them again. Scalar transforms can acquire spring settings without an icon-local `spring` declaration. SVG transforms retain interrupted velocity for a later spring. A shared source can contain branches a particular icon never calls, so its spring evidence alone cannot classify that icon.

`queue` partitions all icons by classification and capability. Its groups are proposed work batches, not approved migrations:

- `supported` means production already selects the CSS adapter, or a resolved finite chevron fits its current properties and timing. The separate `engine` field records whether migration has happened. Check the referenced cycle or resolved configuration for target, property, values, timing, offsets, finish and replay policies. An unmigrated supported recipe still needs interruption, cleanup and payload evidence.
- `candidate` means a resolved finite chevron needs a specific additional capability. A vertical chevron needs `translateY` support. An entry/return duration or easing difference needs `independent-return-timing`. Chevrons preserve explicit entry values and offsets. All candidates still need interruption, cleanup and payload evidence.
- `motion` records a concrete retention reason. LoaderCircle needs its interrupted angular velocity and spring return. Spring chevrons retain measured velocity. Archive combines a retained Motion value and path morphs.
- `review` keeps unresolved behavior explicit. Geometry-dependent recipes, SVG-part property transitions and custom recipes remain on their current engine until someone resolves their call paths. Single rotation keyframes need easing compatibility review and cycle extraction. Their source expressions record the work still needed.

The classifier deliberately covers a small set of resolved patterns. New helpers, computed arguments and complex sequencing fall back to review. A source word match for `spring` never grants or rejects CSS eligibility. For review entries, effective durations, replay, return and sequencing remain unresolved wherever the source expressions depend on runtime branches. Do not treat source-level evidence as a fully evaluated animation model.

`families` reports direct definition imports and transitive recipe dependencies for the four preliminary mechanism groups and the CSS adapter. These groups overlap. Their counts describe source reuse and do not certify eligibility.

## Checks and limits

Run `node --test scripts/inventory-animations.test.mjs` for export coverage, deterministic output, shared defaults, LoaderCircle retention, geometry detection and unresolved-expression checks. `pnpm validate` also discovers these tests through the existing test glob. The inventory command does not change the validation pipeline.

The inventory establishes source coverage and supplies a migration queue. It does not establish browser animation parity, runtime registration, cleanup or visual acceptance. Compare changed recipes through their fixtures and retain the owner's pending visual review.
