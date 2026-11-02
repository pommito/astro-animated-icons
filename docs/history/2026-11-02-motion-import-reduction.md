# Motion import reduction for three loaders

## Result and merge gates

Loader, LoaderCircle and LoaderPinwheel now use the shared transform-only SVG-parts player. Their browser graphs no longer include the general SVG-parts paint/morph effects or Motion's full animate dispatcher. They retain the existing Motion spring generator, SVG transform sampler and local sequence helper. No animation data, drawing, public import, tag, prop, synchronous handle, dependency or CSS mechanism changes.

This implements the first measured import reduction in [#112](https://github.com/pommito/astro-animated-icons/issues/112). It is not ready to merge without owner visual acceptance and an explicit decision on the payload tradeoffs below. The frozen budget checker still rejects eleven warm transitions by one to three gzip bytes. Its ceilings are unchanged. The newly measured general SVG-parts controls also add one resource and 380 to 387 complete-page gzip bytes in the minimal consumer. These costs require review, even though all frozen cold-page ceilings pass.

The prerequisite [#108](https://github.com/pommito/astro-animated-icons/issues/108) is local commit `c6008c9a003974b7a1626ce7817241a5cfb715b2`. It was merged into this branch with history preserved at `20216d1b1fbf39ad4226d3d4dcf3f58c9460d635`. Runtime comparisons start there. The reference recorded before resuming work is `77c99d7cdbce6c6fcb017cae6d2385622c3f47dd`. Remote main was verified at `90302b37876ba25f417b63ffd721fbab5e21f0aa` before implementation. Neither prerequisite nor candidate is claimed to be on main.

## Mechanism and preserved behavior

[The shared player](../../packages/animated-icons/src/shared/svg-transform-parts.ts) owns one playback-state table, pose selection, property defaults, target discovery, transforms, interrupted-loop sequencing and common cleanup. The [general factory](../../packages/animated-icons/src/shared/svg-parts.ts) composes that player with its preceding paint, morph and native opacity-spring callbacks. Both paths execute one maintained transform implementation. General callers keep their existing imports and factory interface. The three loader definitions select the narrower internal factory.

The moved statement bodies match the preceding source after TypeScript formatting, with comments excluded. This covers transform playback, beginPlayback bookkeeping, recipe construction, paint/morph/opacity playback, common cleanup and effect cleanup. The existing `svg-transform.ts`, `sequence.ts` and `element.ts` files are byte-identical to the reference. In particular, spring generation still receives retained property velocity, rotation remains unwrapped, replay retains the finite phase before restarting an interrupted infinite cycle, and stale completion handling remains in the common lifecycle.

Strict inventory renewed only the 129 affected source records. The other 341 records are unchanged. Their reviewed outcomes and local recipe data stay unchanged. The parts-springs family contract now names the extracted mechanism and explains the absence of paint/effect state on the three transform-only callers. An existing inventory assertion now follows the extracted dependency path; no new test was added.

## Payload evidence

The [before report](2026-11-02-motion-imports-before.json) and [after report](2026-11-02-motion-imports-after.json) record 56 fixed compositions per consumer, including the selected spring/morph/sequence controls, twenty repeated instances, CSS mixtures and mixtures retaining Archive. They include resource bytes, chunk hashes, source module IDs and renderedLength attribution. The [frozen matrix comparison](2026-11-02-motion-loading-comparison.json) preserves all 549 original cases and 104 warm transitions in each consumer.

Both builds use Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1 and TypeScript 6.0.3 on Darwin arm64, Apple M1 Pro. Package identity and the dependency lock remain unchanged. These are linked production consumers, not installed npm artifacts. Shared URLs count once. Gzip uses Node zlib defaults per resource. Page costs compress HTML with inline content once, then add external resources. HTML, CSS and recipe-data measurements remain in the JSON. Headers, network latency, Brotli, cache policy and cross-build URL reuse are excluded.

The minimal-consumer measurements below show raw/gzip JavaScript and the complete-page gzip change. Negative page deltas mean fewer bytes.

| Composition | JS before, raw / gzip | JS after, raw / gzip | Files before / after | Page gzip delta |
| --- | ---: | ---: | ---: | ---: |
| loader-circle | 66943 / 27112 | 27715 / 12541 | 11 / 10 | -14572 |
| loader | 66929 / 27106 | 27701 / 12535 | 11 / 10 | -14571 |
| loader-pinwheel | 66946 / 27113 | 27718 / 12542 | 11 / 10 | -14569 |
| loader-circle-repeated | 66943 / 27112 | 27715 / 12541 | 11 / 10 | -14572 |
| loaders | 67712 / 27663 | 28504 / 13104 | 13 / 12 | -14556 |
| loaders-repeated | 67712 / 27663 | 28504 / 13104 | 13 / 12 | -14556 |
| loader-circle-css | 74893 / 30683 | 35665 / 16112 | 14 / 13 | -14571 |
| loader-circle-archive | 68143 / 27893 | 66229 / 27191 | 13 / 13 | -700 |
| chess-bishop | 67063 / 27168 | 67421 / 27552 | 11 / 12 | 387 |
| users-round | 66970 / 27104 | 67328 / 27488 | 11 / 12 | 383 |
| square-arrow-left | 67150 / 27247 | 67508 / 27629 | 12 / 13 | 380 |
| cog | 25378 / 11333 | 25378 / 11333 | 9 / 9 | 0 |
| arrow-left | 10790 / 4823 | 10790 / 4823 | 5 / 5 | 0 |
| archive | 57970 / 23081 | 57970 / 23081 | 8 / 8 | 0 |
| car | 27147 / 12151 | 27147 / 12151 | 10 / 10 | 0 |
| truck | 27136 / 12154 | 27136 / 12154 | 10 / 10 | 0 |
| connect | 63316 / 25497 | 63316 / 25497 | 10 / 10 | 0 |
| rocket | 63717 / 25605 | 63717 / 25605 | 10 / 10 | 0 |

In the full fixture, LoaderCircle falls from 71471 / 30044 to 28121 / 12877 raw/gzip JavaScript bytes, with 15 resources reduced to 12. The minimal loader graph has 75 source module records instead of 166. The full graph has 75 instead of 171. The removed modules include Motion's generic sequence dispatch, JSAnimation, MotionValue/effect plumbing and SVG effects. No replacement code loads later. Initial and eventual JavaScript are equal; deferred JavaScript is zero throughout the targeted matrix.

The remaining loader graph still includes the spring generator at 9475 renderedLength bytes and the unchanged SVG transform helper at 7354. It also includes native WAAPI playback and Motion's generic interpolator. Those source lengths precede final minification and do not allocate gzip bytes. Replacing the retained spring or scalar/complex interpolation machinery would widen the proof to its other callers. This change does not replace physics, interpolation or native animation APIs.

## Measured retentions and regressions

Archive keeps 57970 / 23081 minimal JavaScript bytes for its retained MotionValue lid spring and two direct attribute morphs. Mini has no equivalent MotionValue/attrD interface in the locked package. The public root `motion` entry exposes the existing dispatcher; no supported narrower internal-file export supplies the same effects. No transitive package is imported as an undeclared dependency. The full report attributes the retained JSAnimation, keyframe resolvers, MotionValue and SVG effects to their actual modules. Future narrowing through another declared package would need its own completion, effect and installation proof.

ChessBishop and UsersRound retain native opacity springs. Their general path still uses `svgEffect.get`, `setWithVelocity` and `flush` to preserve the displayed opacity and estimated velocity on stop. SquareArrowLeft retains its SVG-parts morph and implicit transform spring return. These callers gain one shared resource after extraction. Minimal complete-page gzip increases are 387, 383 and 380 bytes respectively. Full-fixture increases are 382, 382 and 385 bytes. The cost comes from shared-module composition and separately compressed chunks. It is not hidden by the loader savings. Their morph and opacity statement bodies remain identical to the preceding implementation.

ArrowLeft already uses mini. Its measured 10790 / 4823 minimal JavaScript bytes stay unchanged. Car and Truck retain 27147 / 12151 and 27136 / 12154 bytes. Both need the local queue and velocity-dependent body/speed returns; Truck also needs an unwrapped wheel spring. They import no general SVG-parts effects. Cog stays at 25378 / 11333. Connect and Rocket retain their full-option direct morph path at 63316 / 25497 and 63717 / 25605. These sources and their corresponding page costs remain unchanged.

Every frozen cold route passes its existing raw/gzip JavaScript, resource-count and complete-page ceilings. CSS-only graphs still contain no Motion modules, and unused imports reach zero JavaScript. Eleven of the 208 frozen warm transitions exceed their gzip ceiling by one to three bytes. All eleven have exactly the same newly requested URLs, resource count and raw page bytes as before. Their entire increase equals the destination HTML gzip change caused by the new loader entry hash. The JSON lists every before/after transition. No ceiling or gzip tolerance was raised. Ratifying a budget exception remains a separate owner decision.

## Playback and loading verification

The [playback record](2026-11-02-motion-playback-preservation.json) stores preceding and candidate captures through the existing Play, Stop and Seek controls on `/loading-view-comparison/`. It covers LoaderCircle, Loader, LoaderPinwheel and Cog at 14, 16, 24 and 28 px. The 560 records per revision cover entry, replay from an interrupted entry, return, repeated stop and replay during return at 0, 40, 200, 799, 800, 801 and 1600 ms. All matrices, keyframe SHA-256 values and track timing records match exactly. No matrix or opacity tolerance changed. These captures compare with the preceding local implementation. They do not establish upstream interrupted-velocity parity, which the existing reference page explicitly leaves unverified.

Before each capture, disconnect and reconnect the adapter hosts to reset their playback, then select Play. Entry adds no operation. Interrupted replay selects Seek at 200 ms, then Play. Return selects Seek at 200 ms, then Stop. Repeated stop selects Seek at 200 ms, Stop, Seek at 60 ms, then Stop. Replay during return uses the same operations but ends with Play. Finally select Seek at the recorded sample time, wait two animation frames, and record computed transforms plus each native track's getKeyframes SHA-256 and getTiming result. These are observations through the existing controls; no test file or fixture control was added.

The manual pages' existing Play/Stop/Add/Remove controls were also observed in Chrome 154.0.8037.98. Each loader starts one track, completes return with zero tracks and an empty transform, starts a template clone, and cancels its track on removal. Native DevTools media emulation clears the active track and pose, blocks playback while reduced motion is enabled, and restores playback when disabled. [The lifecycle observations](2026-11-02-motion-lifecycle.json) distinguish those native media events from programmatic playback. Operating-system preference changes and trusted pointer input were not checked.

The unchanged #108 request runner records seven minimal pages, including the CSS/LoaderCircle mixture. Initial load, first playback, replay, missing styles and late clones/reconnection request the same resource sets. All observed start/stop return values are undefined, and no animations remain after returns. The existing source-removed template control reports 906 checks without failure. A real ClientRouter transition preserves its document and registers the destination tags. [The request trace](2026-11-02-motion-requests.json) records actual URLs separately from the static graph. It is not a timing campaign or owner visual acceptance.

No new automated test or tolerance was introduced. Numerical browser captures and manual-control observations are separate from routine browser-free validation. Safari, Firefox, real touch/hybrid input, frame pacing, preparation timings, installed-package behavior and owner visual acceptance remain unverified.

## Reproduction and validation

Use the reference commit and the candidate in turn, with locked dependencies. The targeted measurement script was added here, so copy that same script into the reference checkout before running its control matrix. It creates one temporary fixture page, refuses to overwrite an existing page, and removes that page after building. It delegates builds, module capture, import traversal, registrations and byte measurement to the existing tools. It adds no benchmark engine or CI timing threshold.

```sh
rtk pnpm check
rtk proxy node scripts/measure-page-loading.mjs
rtk proxy node scripts/measure-motion-imports.mjs
rtk proxy node scripts/check-loading-budgets.mjs
rtk pnpm inventory:animations --check --summary --output .artifacts/animation-inventory.json
rtk proxy node --test scripts/inventory-animations.test.mjs
rtk proxy node --test scripts/measure-page-loading.test.mjs
rtk pnpm validate
```

Save each reference report before rebuilding. Serve the full/minimal outputs with the existing `experiments/recipe-delivery/serve.mjs` on unused ports. Run `benchmarks/trace-requests.mjs` with CHROME_DEBUG_URL, BENCHMARK_FULL_URL and BENCHMARK_MINIMAL_URL pointing at the dedicated Chrome and servers. The trace runner's historical reference field is retained as runnerReference in the saved candidate trace; its source hashes identify this candidate.

Package/consumer type checks report zero errors, warnings or hints. Existing inventory tests pass 16/16, and loading measurement tests pass 14/14. Strict inventory reports 470/470 current source reviews, 120 CSS recipes, 107 capability candidates, 243 Motion retentions and zero unresolved reviews. The final browser-free validation passes 112 tests, 470 drawings and 944 bundle cases in 170.796 seconds. The saved #108 baseline still passes its checker. The candidate budget command fails on the explicit warm gzip exceptions above.

Only Motion recipe imports, the shared SVG-parts mechanism, targeted inventory records, an existing assertion, measurement tooling and documentation change. CSS adapters, compilers, recovery, public exports, package identity, manifests and the lockfile remain untouched. WindArrowDown/#105 stays outside the selected work. No merge to main, push, publication or deployment occurred.
