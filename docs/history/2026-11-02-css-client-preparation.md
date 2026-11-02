# CSS client preparation for issues #109 to #111

This preparation uses `90302b37876ba25f417b63ffd721fbab5e21f0aa`. It records source analysis and existing checks. It changes no production code, recipe, validation rule or dependency review record.

[Issue #109](https://github.com/pommito/astro-animated-icons/issues/109) separates simple transforms from combined sampling. [Issue #110](https://github.com/pommito/astro-animated-icons/issues/110) compares executable smaller-client designs. [Issue #111](https://github.com/pommito/astro-animated-icons/issues/111) integrates only the owner's approved design.

## Dependency gate

At this preparation checkpoint, [#108](https://github.com/pommito/astro-animated-icons/issues/108) is in progress. No delivered benchmark commit or proposed budget table has been inspected or incorporated. Runtime implementation must wait for that commit. There are no new budgets or claimed byte savings in this report.

Before changing runtime code, inspect and incorporate the #108 tooling, frozen case membership, module attribution, initial/eventual/recovery measurements and proposed budgets. Reproduce its baseline on this branch with locked dependencies. Preserve its rejected delivery experiments as evidence. Do not import their runtime into the package or rebuild their tooling here. If the identity changes separately, retain a naming-only control before attributing changes to runtime work.

The branch starts at the SHA above. That SHA is also the fixed point for the final Standards and Spec reviews. The isolated worktree is `/private/tmp/astro-icons-css-client`, on `perf/css-client`. The shared checkout and the recipe-delivery proof worktree are untouched.

## Current import paths

Paths in this section start at `packages/animated-icons/src/`.

| Layer | Current path and responsibility | Consequence for #109 |
| --- | --- | --- |
| Server wrapper | `CssIcon.astro` calls `cycleCSS`, serializes the complete cycle on each host, deduplicates styles with request-local state, and includes transform registration. | Separate rendered registration paths on the server. An unused or simple import must not retain the combined entry. |
| Discovery | `shared/register-css-cycle.ts` passes `createCSSCycleRecipe` to `shared/register-css.ts`. Discovery scans document hosts and nested inert templates, then repeats on `astro:page-load`. | Share discovery and `element.ts`. Each selected factory must receive only its supported records. |
| Playback | `shared/css-cycle.ts` imports `combinedDuration`, `combinedFrames` and `combinedPose` from `shared/combined-transform-cycle.ts`. | A single-property recipe still reaches the scalar sampler through its factory. |
| Recovery | `shared/css-cycle.ts` imports `ensureCycleCSS` from `shared/cycle-css.ts`, which imports `combinedKeyframes` from `shared/combined-transform-css.ts`. That compiler imports the sampler too. | Splitting playback alone leaves the second sampler path reachable. |
| Sheet storage | `shared/recipe-css.ts` finds active marked sheets in the owning document, removes duplicates, or generates a missing sheet. | Retain document scoping and late-sheet reconciliation in both entries. |
| Recipe types | `shared/finite-transform-cycle.ts` imports the combined type with `import type`. | Type-only references do not themselves deliver the sampler. |

The existing inventory confirms both combined modules in `runtimeSources` for Bell and UserRoundCog. KeyCircle has the same shared closure. This is source reachability evidence, not production module-byte attribution. The inventory excludes `element.ts` from its runtime import statistics and also starts at icon definitions, so it is not a substitute for #108's browser graph.

Opacity has an independent path through `register-css-opacity.ts`, `css-opacity.ts`, `opacity-css.ts`, `opacity-parts.ts` and `recipe-css.ts`. Its compiler performs Bezier subdivision for recovery, while playback captures per-target opacity and completion state. Paint reaches `paint-css.ts` through `css-paint.ts`. That module contains compilation as well as runtime geometry measurement, track naming and CSS-property mapping. Removing the paint compiler must retain those runtime operations without importing compilation back through them. `paint-data.ts` supplies the compact transport codec.

## Proposed #109 decomposition

Keep the public components, tags, drawing data and lifecycle. Introduce separate internal simple and combined registration/factory/compiler paths. Share only the transform mechanics that both paths need. Those shared mechanics must have no runtime import of the combined sampler or compiler.

The existing `CssIcon.astro` can remain the internal dispatcher for icon adapters. It must select its rendered internal wrapper from cycle data on the server. Prove the resulting Astro build selects scripts correctly; a source conditional alone does not establish that Astro excludes an entry. Keep combined retained-scalar capture in its specialized adapter. Keep simple current-pose capture and restart policies in the simple path. Avoid a runtime factory that imports both implementations and chooses one in the browser.

The split affects more than package modules:

- `scripts/registration-contract.mjs` currently counts entries by recipe attribute. Simple and combined records share one attribute today. Entry counting and selected-bootstrap checks must describe the new internal selection without weakening exact-record checks.
- `scripts/inventory-animations.mjs` recognizes `CssIcon` and assumes `register-css-cycle.ts`. It must follow the actual selected path before refreshing affected hashes in `scripts/animation-decisions.json`.
- `scripts/css-cycles.mjs` evaluates concatenated compiler sources. Keep one maintained compiler implementation and update this validation adapter if files move.
- `scripts/css-route-contract.mjs`, `scripts/inspect-bundle.mjs` and the family validators check script counts, CSS and exact chunk unions. Use the #108 graph checks for sampler exclusion instead of creating another graph tool.
- `CONTRIBUTING.md` and `docs/architecture.md` currently describe one transform registration entry. Update them with the implemented selection after validation.

Review affected call paths before renewing hashes. Do not change the common lifecycle, Motion helpers, public exports or package dependencies for this preparation. Coordinate any future shared validation-file edit with the Motion-import work before editing it.

## Contracts to preserve

| Contract | Existing mechanism and evidence to reuse |
| --- | --- |
| Immediate manual playback | `element.ts` exposes synchronous `startAnimation(): void` and `stopAnimation(): void`. Registration must finish preparing the recipe before `customElements.whenDefined` resolves. A first-use dynamic import cannot delay playback silently. |
| Initial rendering and selection | `Icon.astro`, unchanged drawings, recipe markers and serialized records. All SVG exists without JavaScript. No engine prop, alternate consumer component or new consumer setup. |
| Simple transforms | Preserve Bell's displayed-pose replay, UserRoundCog's positive 180-degree turn, chevron restart/restore policies, folder return timing, and the supported-six targets and origins. |
| Combined transforms | Preserve ordered channels, KeyCircle's independent offsets, Wallet's 300 ms return and fixed origin, retained scalar poses, first displayed-matrix bridge, cancellation guards and cleanup from ADR 0001. |
| Opacity and paint | Preserve independent targets, phase timing, replay state and cleanup. Paint still measures geometry only for dash/offset targets in the selected phase and applies overall effect easing. ADR 0002 remains binding. |
| Independent clones | Every clone must retain enough recovery information after source removal before registration. Active-sheet reuse, deleted sheets, late sheets, nested templates, reconnect and navigation remain required. |
| Lifecycle | Preserve parent hover, controlled mode, touch filtering, disabled controls, reduced motion, interruption, stale-callback protection and listener cleanup through `element.ts`. |

## Designs to prove in #110

These are study candidates, not executable proofs or an architecture decision. Both must use real Bell/UserRoundCog, KeyCircle/Wallet, CircleDashed/CalendarDays and EyeOff recipes with their maintained drawings. Include more paint replay policies in the final acceptance set, including UserRoundPlus's opacity-only return.

| Candidate | Concrete transport and recovery | Work that remains in the client | Main cost or failure to measure |
| --- | --- | --- | --- |
| Self-contained prepared host record | Server compilers derive a playback descriptor and exact recovery CSS. Each host carries the prepared record, including combined base/unit scalar samples needed to recover retained poses. The adapter restores CSS text directly when the marked sheet is absent. | Decode selected records, capture displayed poses, interpolate prepared samples at native current time, control tracks and measure paint geometry. No client CSS generation or Bezier sampler. | Repeated CSS and scalar samples can enlarge HTML and server serialization. Measure whole-page gzip, server allocation and preparation. Early source-removed clones must work from their own record. |
| Eager recipe modules with prepared data | A generated module for each rendered recipe exports the prepared descriptor, recovery CSS and combined sample data. The icon's internal Astro registration entry imports that module. Module evaluation registers the complete recipe before defining its tag. Generate these modules from maintained recipes during package preparation. | Shared playback adapters and recovery insertion, with prepared data imported eagerly for rendered recipes. No runtime compiler fetch. | Per-recipe entries, request count, asset resolution in installed Astro consumers, navigation reuse and code/data transfer. Every selected tag must load its module even if its source template disappears before registration. No catalogue registry or extra consumer integration. |

The second candidate moves derived data to module assets rather than repeating it on every host. Its feasibility depends on Astro's rendered-script selection and package asset inclusion. The first candidate keeps recovery self-contained but may fail complete-page or server budgets. Neither has measured advantages yet. Both must account for initial, first-playback, exceptional recovery and navigation costs separately. Prepared combined data must preserve arbitrary interruption poses; entry-only samples are insufficient.

Do not adopt eager slot rendering, per-instance byte accounting or module-bearing HTML reference wrappers from the rejected deduplication experiments. An asynchronous compiler fallback changes the immediate-playback contract and requires a separate owner decision. It does not qualify as compiler removal simply because the initial bundle is smaller.

## Existing validation to reuse

No new test has been written. The owner confirmed production-built Astro pages as the only boundary for new TDD tests, to check delivered modules and resources. Browser evidence will reuse existing controls and fixtures, including public playback after `whenDefined`, clones and recovery. Existing saved-pose checks remain the numerical reference. The compiled-page boundary does not establish browser execution or visual acceptance.

After #108 is incorporated, use its versioned commands for budgets and runtime campaigns. Existing commands remain applicable:

```sh
rtk pnpm check
rtk proxy node --test scripts/cycle-css.test.mjs scripts/register-css.test.mjs scripts/registration-contract.test.mjs
rtk mkdir -p .artifacts
rtk pnpm inventory:animations --check --summary --output .artifacts/css-client-inventory.json
rtk pnpm validate
rtk proxy node scripts/measure-page-loading.mjs
```

`cycle-css.test.mjs` checks combined data, independent offsets, original timing, scalar samples against saved Motion matrices, positive rotations and document-scoped sheet recovery. `register-css.test.mjs` checks nested discovery and simulated navigation. `registration-contract.test.mjs` rejects altered, missing and unused records or bootstraps. Existing compiler tests inspect internal boundaries; reuse them without treating them as the proposed public TDD boundaries.

Browser campaigns remain separate from routine validation. Reuse `/css-capabilities/`, `/combined-transforms/`, `/supported-six/`, their template pages, `/page-loading/templates/`, `/page-loading/navigation/a/` and `/css-migration/media/`. For #110, include `/path-paint/`; paint source-removed template coverage is on `/page-loading/templates/`. Existing references share maintained recipe data and drawings; they execute preceding local Motion helpers, not upstream React components. Independent saved-pose records under `docs/history/` cover combined transforms, UserRoundCog, the supported six and paint.

Keep sizes 14, 16, 24 and 28 px, the 0.005 matrix/translation tolerance, the 0.03-degree Bell tolerance and the 0.001 opacity tolerance. Record browser version, native versus synthetic input, sample times, maxima and failures. Report real ClientRouter navigation separately from synthetic `astro:page-load`. Owner visual acceptance remains separate.

## Checks performed at this checkpoint

Node is `v22.20.0`. `rtk pnpm install --frozen-lockfile --offline` failed because the local store lacked a Volar tarball. `rtk pnpm install --frozen-lockfile` then succeeded. No dependency manifest or lockfile changed.

The strict inventory command above, with output `.artifacts/css-preparation-inventory.json`, passed after creating the output directory. The first attempt failed because that directory did not exist. It reports 470 exports, 120 migrated CSS recipes, 107 capability candidates, 243 Motion retentions and zero unresolved reviews. The supported CSS set partitions into 27 simple cycles, three combined cycles, two opacity recipes and 88 paint recipes.

The focused Node command passed all 25 existing tests. This confirms the baseline compiler/data, simulated discovery and registration-validation checks. It does not establish production module sizes, browser execution or animation behavior. No browser, loading measurement, server timing campaign or full `pnpm validate` run was performed for this documentation-only preparation.

No issue in #109 to #111 is complete. The next dependency is a concrete #108 commit containing the reusable tooling and proposed budgets, followed by inspection and baseline reproduction. #110 then needs two runnable proofs and measured results. #111 remains blocked until the owner explicitly approves the resulting ADR.
