# Motion import refinement after the first loader reduction

## Result and remaining gates

The refinement starts at `13757780602994f376bcf81d86c93b29b76eabf7`. It removes the 380 to 387 gzip-byte regression on the selected general SVG-parts pages. Compared with the pre-implementation reference, ChessBishop and UsersRound now each save 1544 complete-page gzip bytes in the minimal consumer. SquareArrowLeft saves 1541. The three loaders retain their reduction. No dependency, physics, animation data, public API or CSS mechanism changes.

The candidate still requires a decision on one extra JavaScript resource on the general SVG-parts pages. The measured variants do not remove that resource. The frozen budget checker also still fails on thirteen warm transitions by one to three gzip bytes. Those remaining warm differences come from asset-name strings, as documented below. No ceiling was raised. These limits and owner visual acceptance keep the candidate from being ready to merge.

This report supersedes the byte-regression decision in [the first implementation report](2026-11-02-motion-import-reduction.md). The earlier evidence remains unchanged. The production baseline is `20216d1b1fbf39ad4226d3d4dcf3f58c9460d635`, which incorporates local prerequisite #108 while preserving its history. No work is claimed to be on main, and no push or merge to main occurred.

## Bounded variants

[The variant archive](2026-11-02-motion-import-variants.json) contains complete targeted reports for three variants, each with 56 compositions in both full and minimal consumers. It references the original before report and the preceding candidate.

1. Replace the eager transform-only factory initialization by an on-call constructor. This retains the extra resource and increases the measured byte costs. It is rejected, and the original initialization is restored.
2. Use Motion's public SVG element entry directly inside SVG parts. This saves about 1.4 kB gzip on the general controls, while retaining the extra resource. It demonstrates that the generic dispatcher is removable; it is superseded by shared adaptation.
3. Share the targeted element and retained-number bindings across all six former generic animate calls in five production modules. This is the selected variant. It lowers the general controls further and also reduces Archive, Connect and Rocket. It preserves the shared transform player and its single playback-state table.

The final graph still separates the common transform player from the general effects and native Motion support. That separation preserves selective loader loading, but the general pages retain one more resource than the original graph. The targeted native adapter removes dispatcher code without restoring the original resource count. This is the limit of the measured variants, not a claim that every other module arrangement is impossible. No duplicated player, delayed import, consumer configuration or bundler grouping rule was introduced. No sequence of unrelated source edits was used to search for a better-compressing hash.

## Public Motion entry points

The earlier export analysis was incomplete. The public `motion` root reexports `framer-motion/dom`, which reexports `motion-dom`. It already exposes animateElement, animateSingleValue, GroupAnimationWithThen and visualElementStore.

[The package export check](2026-11-02-motion-public-exports.json) records registry tarball URLs and SHA-256 values for version 13.4.4. These exports exist at the package's declared minimum as well as the locked 13.5.1 version used for measurements. This checks export availability; it is not an installed-package or browser qualification of the minimum version. The manifest and lockfile remain unchanged.

[The shared adapter](../../packages/animated-icons/src/shared/motion-effect.ts) applies the same concrete branches as Motion's full dispatcher. SVG calls pass one existing element, unchanged keyframes/options and the same visualElementStore lookup to animateElement. Archive passes its existing MotionValue and numeric target to animateSingleValue. Both branches construct the same GroupAnimationWithThen and attach onComplete to the group's finished promise. They do not replace keyframe resolvers, SVG effects, interpolation, spring generation, retained velocity or animation controls.

The former generic subject/sequence dispatch handles types these call sites never supply. Each affected call receives a concrete SVG element or Archive's retained numeric value. There is no subject selector, sequence, scope, stagger callback or default-options branch to reproduce at these call sites. Completion remains grouped, including multiple SVG attribute tracks. Stop/cancel policies remain at their original callers. Archive still stops the retained value itself.

General SVG parts, direct morphs, SVG attributes, Archive and Sparkles use this one adapter. The transform-only loaders have no import path to it. The following files remain byte-identical to the preceding candidate: svg-transform.ts, svg-transform-parts.ts, sequence.ts and element.ts. No new test was written. Existing local contracts and classifications are unchanged; 132 affected review records renew only their hashes. The direct-morph family contract names the new binding and its unchanged completion policy. The other 338 review records are unchanged.

## Payloads and resource counts

The locked environment is Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1 and TypeScript 6.0.3 on Darwin arm64, Apple M1 Pro. Both consumers import the public barrel and use package links. They are not installed npm artifacts. Shared resource URLs count once; Node zlib gzip defaults apply per resource. Complete pages compress HTML with inline content once and add external JS/CSS. Headers, latency, Brotli and cross-build cache reuse remain outside the byte model.

The selected variant's minimal-consumer costs are below. JS columns show raw/gzip bytes. Negative page deltas mean fewer bytes than the pre-implementation reference.

| Composition | JS before, raw / gzip | JS after, raw / gzip | Files before / after | Page gzip delta |
| --- | ---: | ---: | ---: | ---: |
| loader-circle | 66943 / 27112 | 27713 / 12537 | 11 / 10 | -14574 |
| loader-circle-repeated | 66943 / 27112 | 27713 / 12537 | 11 / 10 | -14574 |
| loader-circle-css | 74893 / 30683 | 35663 / 16108 | 14 / 13 | -14574 |
| loader-circle-archive | 68143 / 27893 | 61368 / 25261 | 13 / 13 | -2632 |
| chess-bishop | 67063 / 27168 | 62554 / 25624 | 11 / 12 | -1544 |
| users-round | 66970 / 27104 | 62461 / 25559 | 11 / 12 | -1544 |
| square-arrow-left | 67150 / 27247 | 62641 / 25705 | 12 / 13 | -1541 |
| archive | 57970 / 23081 | 53109 / 21153 | 8 / 8 | -1930 |
| connect | 63316 / 25497 | 58449 / 23562 | 10 / 10 | -1933 |
| rocket | 63717 / 25605 | 58850 / 23669 | 10 / 10 | -1934 |
| car | 27147 / 12151 | 27145 / 12146 | 10 / 10 | -7 |
| truck | 27136 / 12154 | 27134 / 12150 | 10 / 10 | 0 |
| arrow-left | 10790 / 4823 | 10790 / 4823 | 5 / 5 | 0 |

In the full consumer, ChessBishop saves 1900 complete-page gzip bytes. UsersRound and SquareArrowLeft each save 1901. Their resource counts remain 16, 16 and 17, compared with 15, 15 and 16 originally. The corresponding minimal counts remain 12, 12 and 13, compared with 11, 11 and 12. The additional request is a real remaining cost; the byte saving does not measure its latency or headers.

LoaderCircle retains 27713 / 12537 raw/gzip JavaScript bytes in the minimal consumer and 28119 / 12875 in the full consumer. The original costs were 66943 / 27112 and 71471 / 30044. Repeated instances reuse the same code. CSS mixtures and Archive mixtures are included in the fixed targeted matrix. There is no reachable generic Motion subject/sequence dispatcher in the selected general graphs. The necessary native JSAnimation and effect machinery remains reachable. All targeted imports are static, so initial and eventual JS match and deferred JS is zero.

[The refined loading report](2026-11-02-motion-refined-loading.json) preserves all 549 frozen compositions and 104 warm transitions per consumer. Every frozen cold-page JS, file-count and complete-page ceiling still passes. CSS-only pages reach no Motion code. Unused imports reach zero JavaScript.

## Exact warm exceptions

The pre-implementation source files were temporarily restored from the exact reference in this same worktree for a separate build, then the candidate sources and output were restored in a finally block. No branch or additional worktree was created. That build reproduces all 549 compositions in both consumers with zero JS, page or file-count metric drift from the saved #108 report. Its actual HTML and resources support this comparison.

[The warm evidence](2026-11-02-motion-refined-warm.json) contains before/after URLs, full HTML bodies, requested resource bodies and hashes for every current exception. All thirteen have unchanged raw page bytes and request counts. All HTML bodies match after replacing only the eight-character asset hashes. In twelve cases, the requested resource bodies are byte-identical. In the remaining full `loader -> path-paint-loader` transition, WindArrowDown's entry imports the new svg-transform asset hash. Its body is otherwise identical after hash normalization. That resource adds two gzip bytes while the HTML saves one, leaving a one-byte page increase. WindArrowDown's source and recipe are unchanged and remain outside this work.

| Consumer | From | To | Page gzip increase |
| --- | --- | --- | ---: |
| full | loader | all-loader | 1 |
| full | loader | supported-six-loader | 2 |
| full | wind-path-reveal-css-loader | wind-path-reveal | 1 |
| full | loader | staggered-path-reveal-loader | 1 |
| full | loader | path-paint-loader | 1 |
| minimal | loader | key-square-loader | 1 |
| minimal | loader | wallet-loader | 1 |
| minimal | loader | tree-pine-loader | 1 |
| minimal | loader | supported-six-loader | 3 |
| minimal | loader | runtime-path-reveal-loader | 1 |
| minimal | loader | staggered-path-reveal-loader | 1 |
| minimal | loader | symbol-path-reveal-loader | 1 |
| minimal | loader | paint-eye-off-loader | 1 |

The checker rejects these cases. The eleven exceptions of the preceding candidate have changed membership and become thirteen after the import refinement. They are not new animation, recipe or recovery costs. Their string-compression residue remains unapproved. No hash-targeted source mutation or ceiling change followed this measurement.

## Preserved behavior and limits of existing controls

[The playback archive](2026-11-02-motion-refined-playback.json) preserves the captures through existing Play, Stop and Seek controls. The 560 loader/Cog records still match the preceding candidate exactly. All 140 ChessBishop and 140 SquareArrowLeft records match their reference. UsersRound matches all 84 entry, replay and first-return records.

The remaining 56 UsersRound records cover repeated stop and replay during return. Their existing control sequence is not deterministic for native opacity velocity. Repeating the same reference build changes all 56 timing/keyframe records and eight paint samples across those phases, while transforms stay identical. The candidate also varies in those phases. This is not reported as a numerical parity pass, and no tolerance was relaxed. The source proof preserves the identical MotionValue/effect entry and grouped completion; interrupted native-opacity numerical parity still has the limitation of the existing controls. No new test or timing override was added to remove that limitation.

[Manual-control observations](2026-11-02-motion-refined-lifecycle.json) cover ChessBishop, UsersRound, SquareArrowLeft, Archive, Sparkles, SlidersHorizontal, Connect and Rocket. Return and native reduced-motion changes restore their initial drawing observations. Clone removal leaves no native tracks. Native track counts do not include JavaScript-driven Motion animations; Archive and SlidersHorizontal additionally record their changed entry poses and restored return poses. The common lifecycle's reduced-motion guard is unchanged. These observations use programmatic buttons/public methods and native DevTools media emulation, not trusted pointer input or operating-system preference changes.

[The reused #108 request trace](2026-11-02-motion-refined-requests.json) covers first playback, replay, missing sheets, late clones/reconnection, 906 source-removed template checks and a real ClientRouter transition. It records no extra first-use resources on its seven selected pages. This is request observation, not a timing campaign. Native generalized effects have no dynamic import path in the targeted graph. Owner visual acceptance, Safari, Firefox, installed-package qualification, frame pacing and preparation timings remain unverified.

## Validation and merge verdict

The following existing commands were reused:

```sh
rtk pnpm check
rtk proxy node scripts/measure-motion-imports.mjs
rtk proxy node scripts/measure-page-loading.mjs
rtk proxy node scripts/check-loading-budgets.mjs
rtk pnpm inventory:animations --check --summary --output .artifacts/animation-inventory.json
rtk proxy node --test scripts/inventory-animations.test.mjs
rtk proxy node --test scripts/measure-page-loading.test.mjs
rtk pnpm validate
```

Type diagnostics report zero errors, warnings or hints. The 16 inventory and 14 loading tests pass. Strict inventory covers all 470 exports with 120 CSS recipes, 107 capability candidates, 243 Motion retentions and zero unresolved reviews. Final pnpm validate passes 112 tests, 470 drawings and 944 bundle cases in 151.203 seconds. The rebuilt reference passes its frozen budget checker. The candidate checker fails on the thirteen named warm exceptions. No budget is raised.

The code and measured byte reductions are prepared for review. Merge remains gated by the extra resource on general pages, the asset-name budget exceptions and owner visual acceptance. The existing UsersRound numerical limitation is explicit. No additional owner decision has been interpreted as approval of these costs. CSS adapters/compilers/recovery, public exports, dependency manifests, lockfile, naming and WindArrowDown source remain untouched. No merge to main, push, npm publication or deployment occurred.

## November 17 verification

The measurement script now captures the versions, platform and source of its own run. It completed on a fresh installation without an earlier `.artifacts/page-loading/baseline.json` and measured 56 compositions in both consumers on Node 22.20.0, pnpm 12.5.1, Astro 7.3.8 and Motion 13.5.1 on an Apple M1 Pro.

The [isolated UsersRound probe](../../benchmarks/users-round-spring.astro) uses the rendered public component. It sets the same wall time and native playback time before each interruption. The stop path still samples Motion's native opacity spring and passes the resulting velocity into the next playback. For each size of 14, 16, 24 and 28 px, it captures four entry times and samples entry, return, repeated stop and replay during return. The [paired archive](2026-11-17-users-round-spring.json) contains 64 samples per build, including 12 nonzero inherited velocities. At `7e43eca` and `bbe4a3e`, Chrome 156 reported zero difference in computed opacity, matrix components and inherited velocity. A second capture matched on each build. The earlier uncontrolled samples remain in their original archive.

Run `node benchmarks/build-users-round-spring.mjs` in each checkout. For the reference checkout, copy that script and `benchmarks/users-round-spring.astro` from the candidate first. Serve the resulting directory with `node experiments/recipe-delivery/serve.mjs .artifacts/users-round-spring/dist` and select **Capture interrupted spring poses**. Compare the `samples` arrays in the two JSON results. This probe uses a controlled clock and programmatic playback.

On 2026-11-17, the owner reviewed the rendered comparisons at `befdf99`, accepted the animation behavior and measured loading costs, and authorized merging [PR #121](https://github.com/pommito/astro-animated-icons/pull/121). This includes one additional JavaScript request on the general SVG parts pages and the 13 warm transitions that add 1 to 3 gzip bytes. The #108 checker still reports deviations from its frozen baseline.
