# Animation inventory

Generate the current source review without building the fixture or opening a browser:

```sh
mkdir -p .artifacts
pnpm inventory:animations --check --summary --output .artifacts/animation-inventory.json
```

`--check` fails for a missing review, changed dependency, changed family contract or orphan decision. Without it, the inventory keeps missing and stale reviews visible as `needs-review`. Unknown recipes never acquire eligibility from an import, a `spring` word or CSS wiring alone. Generated output belongs in `.artifacts/`.

## Reviewed queue

The public Astro exports define membership. Each export occurs once in `icons` and once in `familyQueue`. The latter partitions the catalogue into complete reviewed families, with their capability, playback policy, follow-up and slug membership. `queue` provides a second view grouped by outcome and capability. `families` retains the earlier overlapping import statistics; those statistics do not establish eligibility.

[animation-decisions.json](../scripts/animation-decisions.json) stores each export's reviewed family, local contract, source hash and family hash. [animation-families.json](../scripts/animation-families.json) stores the shared playback contracts and concrete compatibility decisions. Read both contracts together. They are review records, not production recipe definitions or a client registry. Production never imports them.

The review starts at merged main `1bbd0e272043b4c6150828deeb3c0ff8c15f394a`, after #95. It accounts for all 470 exports: 26 migrated, six supported but deferred, 196 needing specified capabilities, and 242 retained on Motion. No entry remains generically unreviewed. The [migration plan](css-migration-plan.md) identifies the six compatible recipes and the remaining families. The [review record](history/2026-10-29-catalogue-source-review.md) explains the scope and evidence.

`migrationState` has these meanings:

| State | Meaning |
| --- | --- |
| `migrated` | Current production wiring uses CSS and its source review is current. |
| `supported-but-deferred` | The complete recipe fits a proven mechanism. #99 still needs preceding-behavior capture, comparison, payload evidence and owner acceptance before migration. |
| `capability-needed` | The contract identifies a specific missing capability. It is not an eligible rollout entry. |
| `retained-on-motion` | A concrete behavior requires the existing Motion implementation. Retention is not a claim that no future replacement is possible. |
| `needs-review` | No review exists, or a pinned dependency or contract changed. `--check` rejects this state, including for currently wired CSS icons. |

## Evidence and hashes

Schema version `2` adds `reviewedCount`, `familyQueue`, `runtimeSources` and `provenMechanismSources`. Output has no timestamp or absolute checkout path. Stable sorting makes identical sources and review records produce identical JSON.

Each icon records its export, slug, tag, definition, adapter, registration, current engine, review outcome and source paths. `engine` describes wiring. Eligibility comes from its pinned decision. `runtimeSources` follows runtime TypeScript imports and re-exports from the definition and selected registration. It excludes the common lifecycle from import statistics. The review's broader `sources` also includes every local TypeScript/Astro file, local drawing, common wrapper, lifecycle, stylesheet, relevant recipe types and dependency lock. Unused icon-local registration files are review dependencies, even when the CSS wrapper owns production registration. A deferred supported recipe additionally pins the CSS wrapper and registration dependency graph that proves its compatibility. Adding these proof dependencies does not change its detected engine.

`sources` maps relative paths to SHA256, imports, dependencies and evidence with one-based lines and original expressions. Evidence covers selectors, drawing origins, property values, offsets, timing, repeats, completion, velocity, geometry, calls and sequencing. The generator reads source; it does not execute recipes. Shared evidence can contain unused branches. The maintained local contract identifies which branches a recipe actually uses.

The source hash is SHA256 of the compact JSON array of sorted `[path, sha256]` pairs from that icon's `sources`. The family hash is SHA256 of the compact JSON encoding of its maintained family record. A family edit invalidates all its members. A source edit invalidates each affected export. CSS wiring cannot bypass either check. Stale decisions expose `observedSourceHash`, `observedFamilyHash` and `previousDecision` so the reviewer can inspect the change. Review the changed call paths and update the contract before copying the observed hashes. Do not renew hashes solely to make `--check` pass.

## Reading effective contracts

Construction records preserve resolved factory arguments, including mapped child lists, computed delays, variant objects and callback formulas. SVG-part records resolve the normal and animate poses separately in `effectiveParts`. Values, offsets, selected timing, targets and origins stay local. Family contracts describe transform order, sampling, playback branches, retained state and cleanup. Local review notes cover custom sequences and exceptions. The source expressions remain available to check every record.

For SVG parts, a pose transition replaces the part transition. A paint property's transition replaces the pose transition again. A scalar transform without a duration or explicit spring gets the helper's spring defaults, even when no local `spring` appears. Normal transform values describe return to rest from the retained pose. Paint values retain their own normal targets. Active entry can resume while a completed entry restarts; interrupted infinite entry can finish one cycle before clearing and looping. These policies are distinct from those of direct `animateSvgTransform` calls and the CSS adapters.

The review distinguishes fixed sampled spring data from inherited velocity. Languages needs sampled paint support but has no inherited spring velocity. Signals use a current-opacity spring on entry even when their return is timed. Sun's opacity-only branch never measures geometry, despite sharing a helper with stroke reveals. ArrowLeft supplies no spring callback, although its helper supports one. Full-turn group rotations retain unwrapped angles that a computed matrix loses. None of these decisions follows from shared-module membership alone.

## Checks and limits

```sh
node --test scripts/inventory-animations.test.mjs
pnpm validate
```

Tests cover complete membership, deterministic output, missing/orphan decisions, incomplete contracts, unknown families, attempted outcome overrides, source drift and proof-dependency drift. Drawing, adapter, lifecycle, lock and family changes invalidate CSS decisions as well as Motion decisions. `pnpm validate` discovers the strict catalogue check through the existing test glob.

This review establishes source compatibility and a work queue. It adds no browser parity, runtime cleanup, rendering, payload or hardware evidence for future migrations. Existing dated measurements and scoped owner approvals remain separate. Preserve the existing numerical tolerances, including the 0.005 matrix-component threshold, when #99 captures and migrates a family.
