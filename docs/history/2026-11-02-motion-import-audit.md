# Motion import audit before issue #112 implementation

## Status and scope

This is preparation for [issue #112](https://github.com/pommito/astro-animated-icons/issues/112). It does not complete that issue or establish an import reduction. Runtime implementation must wait for a verified commit from [issue #108](https://github.com/pommito/astro-animated-icons/issues/108) containing reproducible tools, measurements and proposed budgets. That commit was unavailable during this audit. Any applicable architecture approval remains a separate gate.

The later [implementation report](2026-11-02-motion-import-reduction.md) records the delivered prerequisite, runtime reduction, measurements and remaining merge gates. This audit preserves the preceding preparation state.

The starting revision and review reference are `90302b37876ba25f417b63ffd721fbab5e21f0aa`. Work is isolated on `perf/112-motion-imports`. This change adds only this report. It changes no recipe, lifecycle, import, dependency, compiler, adapter or test.

The owner selected reuse of existing validations only for #112. No new tests are authorized by that selection. Use existing consumer graph checks and fixture controls for subsequent implementation. If they cannot establish a required behavior, report the gap before adding a test.

## Evidence and limits

The numerical evidence below comes from the committed [production loading report](2026-10-30-production-paint-loading-after.json). These are historical observations, not new #108 measurements or proposed release ceilings. Its environment was Node 22.20.0, pnpm 12.5.1, Astro 7.3.8 and Motion 13.5.1 on an Apple M1 Pro running Darwin arm64.

The existing [loading measurement](../../scripts/measure-page-loading.mjs) records Rollup module attribution and uses [the bundle inspector](../../scripts/inspect-bundle.mjs) through [resource measurement](../../scripts/measure-resources.mjs). The inspector follows static and literal dynamic imports. Resources count once per URL. Gzip uses Node zlib defaults for each resource. Complete-page totals compress HTML with inline content once, then add external resources. These counts do not establish actual browser requests, first-playback behavior, frame pacing or preparation time. The minimal consumer uses package links, not an installed npm release.

The static audit uses [the strict inventory](../../scripts/inventory-animations.mjs), [reviewed recipe contracts](../../scripts/animation-decisions.json), [family contracts](../../scripts/animation-families.json), definitions and transitive helpers at the starting revision. Strict inventory reports 470/470 reviewed exports, 120 migrated recipes, 107 capability candidates, 243 Motion retentions and zero unresolved reviews. Of the 470 recipes, 129 reach `svg-parts.ts` and 288 reach `svg-transform.ts`. These counts describe dependencies, not eligibility for a new implementation.

## LoaderCircle cost attribution

The historical minimal consumer reaches 166 module records across 11 JavaScript resources. The final resources total 66,943 raw bytes and 27,112 gzip bytes. The full fixture reaches 171 module records across 15 resources, totaling 71,471 raw and 30,044 gzip bytes. Different consumers produce different chunk layouts.

| Minimal-consumer resource | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| LoaderCircle registration and definition | 390 | 278 |
| Shared lifecycle | 1,448 | 656 |
| SVG parts | 3,944 | 1,756 |
| Full animate dependency chunk | 37,314 | 13,869 |
| Spring generator chunk | 4,081 | 1,853 |
| Element resolution and native playback chunk | 6,357 | 2,566 |
| Interpolation chunk | 7,154 | 3,049 |
| Easing chunk | 416 | 307 |
| Mini animate-style chunk | 2,022 | 974 |
| SVG transform | 3,498 | 1,584 |
| Local sequence | 319 | 220 |

The largest individual module contributions include the spring generator at 9,475 `renderedLength` bytes, Motion's sequence creation at 7,638, `JSAnimation` at 7,530, local SVG parts at 7,373 and local SVG transform at 7,354. `renderedLength` precedes final minification. It cannot allocate gzip savings or be added to the resource table.

[LoaderCircle's definition](../../packages/animated-icons/src/icons/loader-circle/definition.ts) asks SVG parts for rotation only. Entry targets 360 degrees over 0.8 seconds, linearly and infinitely, with `preserveCycleEnd`. Return uses a spring with stiffness 50 and damping 10. [Loader](../../packages/animated-icons/src/icons/loader/definition.ts) has the same transition. [LoaderPinwheel](../../packages/animated-icons/src/icons/loader-pinwheel/definition.ts) uses a one-second entry.

[SVG parts](../../packages/animated-icons/src/shared/svg-parts.ts) statically imports full `animate` and `svgEffect` for its morph and native opacity-spring branches. Those branches do not execute for these three loaders. Their imports still reach the browser through the shared factory. Full `animate` in the locked dependency imports Motion's own sequence dispatch. That dependency is separate from the package's small [local sequence helper](../../packages/animated-icons/src/shared/sequence.ts), which loader replay needs.

The likely first reduction is to remove unused SVG-parts capabilities from the loaders' reachable graph. It is not safe to remove their spring generator, local sequence or retained property state. The current [SVG transform helper](../../packages/animated-icons/src/shared/svg-transform.ts) samples the existing Motion spring using retained velocity. Its time sampling, transform order, unwrapped rotation and interruption bridge are part of the preceding behavior.

## Capability decisions at real call sites

| Control | Required behavior | Import decision to investigate |
| --- | --- | --- |
| LoaderCircle, Loader, LoaderPinwheel | Rotation with unwrapped values; sampled retained-velocity spring return; interrupted infinite entry finishes a retained cycle before reset and restart; hold completion | First proof for transform-only parts. Preserve existing SVG transform and local sequence behavior. Remove access to unused morph and native opacity branches through composition at the factory level. |
| Cog | SVG rotation to 180 degrees with stiffness 50 and damping 10, in both directions; retained velocity and hold completion | Existing direct transform path provides a control that does not use SVG parts. A loader change must not increase its graph. |
| ChessBishop and UsersRound | Transform springs plus native opacity springs | Keep the native opacity path. `svgEffect.get`, `setWithVelocity` and `flush` repair the displayed opacity and its estimated velocity when stopped. Mini or a fixed sampled curve would not preserve this behavior. |
| SquareArrowLeft | Timed head translation; implicit scalar spring return; shaft `d` morph through SVG parts | Keep morph capability separate from transform-only callers. Preserve the restricted SVG-parts morph options. Do not replace them with the broader direct morph contract. |
| ArrowLeft | Measured shaft dash length; head translation; entry 0.4 seconds and return 0.12 seconds with easeInOut; restore completion | Already uses mini through `shared/arrow.ts`. No full animate call or spring callback executes. Keep it as a loading control and inspect actual chunk membership before claiming a further saving. |
| Archive | Lid MotionValue spring at stiffness 200 and damping 25; retained velocity; body and handle morphs over 0.3 seconds; hold completion | Retain the current implementation initially. The generic animate dispatcher may have a narrower public dependency entry, but this needs separate cost and completion evidence. No mini substitution or fixed spring. |
| Car and Truck | Body, wheel and speed tracks; interrupted entry queues a finite retained cycle before clear and infinite restart; velocity-dependent returns | Already use mini, SVG transform and local sequence without SVG parts. Keep those semantics. Truck's wheel rotation needs unwrapped angles and spring return. Car's wheel returns over 0.2 seconds, while its body and speed still need springs. |
| Connect and Rocket | Direct `attrD` morphs with complete options; parallel transform playback | Retain direct morph behavior. Connect passes spring settings. Rocket passes infinite repetition, explicit offsets and easing. SVG-parts morphs deliberately forward fewer options. |

Sources for the controls are [Cog](../../packages/animated-icons/src/icons/cog/definition.ts), [native opacity handling](../../packages/animated-icons/src/shared/svg-parts.ts), [square arrows](../../packages/animated-icons/src/shared/square-arrow.ts), [ArrowLeft](../../packages/animated-icons/src/icons/arrow-left/definition.ts), [arrow playback](../../packages/animated-icons/src/shared/arrow.ts), [Archive](../../packages/animated-icons/src/icons/archive/definition.ts), [direct morphs](../../packages/animated-icons/src/shared/path-morph.ts), [vehicle playback](../../packages/animated-icons/src/shared/vehicle.ts), [Car](../../packages/animated-icons/src/icons/car/definition.ts), [Truck](../../packages/animated-icons/src/icons/truck/definition.ts), [Connect](../../packages/animated-icons/src/icons/connect/definition.ts) and [Rocket](../../packages/animated-icons/src/icons/rocket/definition.ts).

These source decisions explain required capabilities. They do not yet provide a new measured reason for retaining every heavy resource on Archive or native opacity pages. Those per-route costs remain part of #112 implementation after #108.

## Mixed and repeated consumers

The archived minimal-consumer data demonstrates why savings must be compared per page.

| Composition | Icons | JS files | JS raw | JS gzip | Page raw | Page gzip |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| CircleDashed | 1 | 3 | 5,269 | 2,491 | 15,383 | 3,717 |
| CircleDashed repeated | 20 | 3 | 5,269 | 2,491 | 71,794 | 4,269 |
| Four CSS icons | 4 | 4 | 9,398 | 4,227 | 23,836 | 6,155 |
| Ten CSS icons | 10 | 4 | 9,398 | 4,227 | 42,078 | 7,226 |
| All CSS recipes | 120 | 5 | 13,954 | 6,160 | 616,086 | 48,865 |
| LoaderCircle | 1 | 11 | 66,943 | 27,112 | 67,724 | 27,610 |
| CircleDashed with LoaderCircle | 2 | 13 | 70,764 | 28,947 | 81,395 | 30,263 |
| Four CSS icons with LoaderCircle | 5 | 14 | 74,893 | 30,683 | 89,848 | 32,677 |
| All CSS recipes with LoaderCircle | 121 | 15 | 79,449 | 32,616 | 682,098 | 75,482 |
| Unused imports | 0 | 0 | 0 | 0 | 264 | 209 |

[The existing case definitions](../../scripts/page-loading-cases.mjs) specify membership. CSS pages use their own adapters and recovery code. Their costs belong to the page even when Motion is also present. Do not add isolated per-icon gzip values to predict a mixed page.

## Implementation plan after the prerequisite

1. Obtain the exact #108 commit. Review its diff and reproduce its graph and budget checks with locked dependencies. Record the selected budgets and any architecture decision. Preserve any controlled naming-only baseline from #107.
2. Capture preceding behavior and per-route module attribution for the loader trio, Cog, ChessBishop, UsersRound, ArrowLeft, Archive, Car, Truck and morph controls. Use existing inspectors, comparison data and controls. Extend measurement inputs only where existing tooling supports that input. Do not create another benchmark system. Keep timing campaigns coordinated with #108.
3. Extract transform-only SVG-parts behavior into a shared module used by both the general SVG-parts factory and the loaders. Keep playback bookkeeping, active-array replay, target discovery, origin handling, return guards and cleanup in one maintained implementation. The general factory composes the transform behavior with its existing paint, morph and opacity behavior. A transform-only caller must have no static or deferred path back to the full factory. Choose the final interface after checking the preceding captures; no new public engine option is needed.
4. Prove the loader graph excludes the unused full animate path while preserving the current spring, velocity and sequence behavior. Avoid a runtime switch inside a still-general factory, because its imports would remain reachable. Roll out only to additional callers whose effective contracts and comparison evidence establish compatibility. Shared helper changes require review of all affected inventory hashes.
5. Consider a narrower dispatcher for Archive or native SVG effects only if step 4 leaves a measured target worth pursuing. The locked `motion` package exposes its root and mini entries, but no public internal-file entry for a single-value or element-only dispatcher. `motion-dom` exposes `animateSingleValue`, `animateElement` and `svgEffect` at its public root. Importing it would require declaring it as a direct package dependency and verifying the installed artifact. Preserve MotionValue identity, effect cleanup and grouped completion ordering. This is a candidate, not a selected dependency or proven reduction.
6. Repeat comparable full and minimal page measurements. Include each selected control, twenty repeated instances, CSS mixtures and a mixture that still needs full Motion. Include initial, eventual and exceptional recovery paths. A delayed import cannot count as removal. Report raw/gzip JS, file counts, HTML/CSS and complete pages. Retain heavy paths with measured reasons when a narrower path cannot preserve behavior.
7. Reuse the existing graph, drawing, catalogue and fixture validations. Run strict inventory review and `rtk pnpm validate`. Compare entry, replay, return, stop during return, replay during return, completion, stale callbacks, disconnect/reconnect and reduced motion through existing controls. Keep the documented tolerances. Record gaps rather than inferring browser behavior from build output. Obtain required owner acceptance before merge.

No runtime change can turn `startAnimation()` into an asynchronous setup step. The public methods remain usable immediately after `customElements.whenDefined`, return `void` and preserve complete server-rendered SVG. Any selected dependency must install transitively with the one npm package. A separate consumer installation is not an option.

## Parallel work and shared files

The intended #112 production scope is `shared/svg-parts.ts`, a focused shared transform-parts module if the proof supports it, and selected Motion recipe imports. Keep `shared/svg-transform.ts`, `shared/sequence.ts` and `element.ts` unchanged unless evidence requires a separate scoped change.

The CSS work in #109 through #111 owns CSS adapters, compilers and recovery changes. #112 must not edit those files. Potential integration conflicts remain in `scripts/animation-decisions.json`, `scripts/animation-families.json`, `scripts/page-loading-cases.mjs`, the bundle inspector, dependency manifests and the lockfile. Resolve those against the delivered prerequisite instead of renewing unrelated hashes or changing shared measurements in parallel.

WindArrowDown and #105 remain outside this scope until selected through #113. No merge, push, npm publication or deployment occurs here.

## Validation performed for this preparation

- `rtk gh issue view 112 --repo pommito/astro-animated-icons --json number,title,body,labels,state`, and corresponding reads for #108 and #106, confirmed scope and dependencies. Network access required sandbox escalation.
- `rtk git worktree add /private/tmp/astro-icons-112 -b perf/112-motion-imports origin/main` created the isolated checkout. `rtk git rev-parse HEAD` returned the starting SHA above. The shared checkout and the proof worktree were not modified.
- `rtk pnpm install --offline --frozen-lockfile` failed because the local store lacked the tinyglobby tarball. `rtk pnpm install --frozen-lockfile` then succeeded with network access. No manifest or lockfile changed.
- `rtk pnpm inventory:animations --check --summary --output .artifacts/animation-inventory.json` passed with 470/470 source reviews and the counts above.
- `rtk proxy node --test scripts/inventory-animations.test.mjs` passed all 16 existing tests. They check catalogue partitioning, stale source/dependency reviews and the separate direct-morph contract. They do not execute playback.
- A read-only reference check resolved all 26 local Markdown links in this report. `rtk git diff --check` reported no whitespace errors.

No production build, new payload campaign, server timing campaign or browser campaign ran for this audit. `pnpm validate` is deferred to runtime implementation; the documentation-only rule requires checking references. No import saving, playback parity, installed npm behavior or new visual acceptance is claimed. #112 remains open, waiting for the #108 commit and its applicable gates before implementation.
