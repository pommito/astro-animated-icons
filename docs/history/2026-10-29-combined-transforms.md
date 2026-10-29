# Combined finite transform implementation

The owner approved [ADR 0001](../adr/0001-combined-finite-transforms.md) in this chat on 2026-10-29 before shared-engine implementation. KeySquare, Wallet, and KeyCircle now use its ordered combined CSS cycle. The owner subsequently [visually accepted all three recipes](2026-10-29-combined-transform-acceptance.md) on 2026-10-29 at `df1ad33` in [PR #100](https://github.com/pommito/astro-animated-icons/pull/100) for [issue #95](https://github.com/pommito/astro-animated-icons/issues/95). This acceptance implements no work from #98 or #99.

## Preserved behavior

The cycle files are the single maintained recipe definitions. Production and fixture-only previous local Motion references use the same cycle data and extracted drawings. The references execute the existing SVG keyframe and transform helpers, not upstream React components. The [1644-pose Motion capture](2026-10-29-combined-motion-before.json) predates extraction and protects against a shared wrong value. The [preparation report](2026-10-29-combined-transform-decision.md) records the complete preceding source paths.

KeySquare keeps scale before rotation, 600 ms easeOut entry and return, and the SVG center origin. Wallet keeps translateY before rotation, offsets [0, .45, 1], 550 ms easeInOut entry, 300 ms easeOut return, and the fixed 12px 12px origin. KeyCircle keeps translateY before rotation, five translation values with quarter offsets, four rotation values with thirds, and 900 ms easeOut entry and return. All three hold completion and replay from independent retained property values.

The compiler emits 776 keyframes across entry and return. Native transform interpolation stays linear between the preceding helper's 5 ms samples. CSS numbers are serialized to six decimal places; the scalar sampler retains full precision and Motion's subdivision behavior. Captured CSS variables carry deviations from rest, which reduces repeated expressions while preserving independent values. The first displayed matrix bridges interruption. Completion writes are guarded against cancelled or replaced playback. The wrapper, registration entry, recipe attributes, sheet recovery, lifecycle, public handles, tags, props, void methods, and complete initial SVG remain compatible.

## Numerical and lifecycle evidence

Chrome 154 ran the production comparison at 14, 16, 24, and 28 px. [Browser results](2026-10-29-combined-transforms-browser.json) record 8796 passing assertions, 2688 live-reference comparisons, and 1644 saved-pose comparisons. Both maximum matrix-component errors were 0.000010000000000065512 against the unchanged 0.005 threshold. The grids include KeyCircle's 225 and 675 ms translation breakpoints, rotation thirds, Wallet's nonuniform breakpoint, and the first 0, 1, 2.5, 4.9, and 5 ms after interruption.

The comparison covers entry, stop, repeated stop, replay, replay during return, held completion, stop after held completion, completed return, idle stop, explicit synthetic stale completion after replay and disconnect, reconnection, and removal of transforms, origins, state attributes, and captured variables. Its 42 synthetic lifecycle flags pass. They cover parent hover, touch filtering, disabled and controlled mode, void methods, preference stubs, changed controls, and template clones.

Independent combined templates pass 36 flags. The existing capability templates still pass 91. Source-removed registration passes 60 flags, including early and late clones of all three combined icons, sheet recovery, reconnection, and a synthetic astro:page-load event for nested inert templates. These checks remain separate from a real Astro navigation.

The native media probe passes 234 flags for all 26 CSS recipes with the page selected and brought to front. DevTools emulation produces native MediaQueryList events [true, false], clears paused playback and captured variables under reduced motion, blocks manual playback, and restores playback afterward. The earlier [preparation attempt](2026-10-29-combined-native-media-attempt.json) observed no native event and remains preserved. This later run adds focused-tab DevTools coverage, not operating-system preference coverage.

The existing Bell/ChevronRight comparison passes 592 assertions across 496 comparisons, with Bell angle error 0.013984397194736431 below its unchanged 0.03-degree threshold. Finite chevrons pass 4836 assertions across 3276 comparisons with zero translation error. Capability recipes pass 5348 assertions across 2440 live comparisons plus 324 saved cog poses; maximum matrix error is 0.000885 and saved cog error is 0.0007956, below 0.005. No comparison reported a failure.

The owner visually accepted the three migrated recipes on 2026-10-29. Safari, Firefox, real touch or hybrid hardware, operating-system preference changes, frame pacing, and preparation timing remain unverified.

## Production payloads

The fresh [before baseline](2026-10-29-combined-loading-before.json) starts at main 92523bd after #94 and #97. The [after data](2026-10-29-combined-loading-after.json) includes both consumers, all reachable resources, module evidence, source hashes, cold and warm totals, and the twenty unchanged combined compositions per consumer. Node v22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, TypeScript 6.0.3, and macOS 27.0.1 build 26A434 on Apple M1 Pro arm64 match the baseline. The minimal consumer uses installed package links rather than a packed package.

Unit pages save gzip bytes. The complete three-icon family regresses despite fewer JavaScript files, because sampled styles exceed the shared Motion code removed. Repeated instances share scripts and styles, but repeat recipe attributes in HTML. LoaderCircle mixtures retain Motion and add CSS support and sampled styles, producing larger regressions. Raw whole-page bytes grow in 38 of the 40 matched compositions. Wallet with existing CSS is the exception, saving 2372 raw bytes in the full fixture and 1994 in the minimal consumer. These measurements establish payload costs, not smoother frames.

All sizes below are bytes. Positive saved values mean the CSS implementation is smaller. Repeated means twenty instances of each named icon, so combined-repeated has sixty instances. The css suffix adds Bell, CircleDashed, and UserRoundCog; loader adds LoaderCircle.

| Consumer | Composition | JS files before / after | JS before raw / gzip | JS after raw / gzip | CSS before raw / gzip | CSS after raw / gzip | Page before raw / gzip | Page after raw / gzip | Page gzip saved |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| full | key-square | 11 / 4 | 26044 / 11825 | 6281 / 2855 | 124 / 116 | 25182 / 3432 | 27040 / 12403 | 33093 / 7041 | 5362 |
| full | key-square-repeated | 11 / 4 | 26044 / 11825 | 6281 / 2855 | 124 / 116 | 25182 / 3432 | 38972 / 12500 | 58496 / 7283 | 5217 |
| full | key-square-css | 16 / 6 | 32022 / 14676 | 9482 / 4351 | 8342 / 1161 | 33400 / 4477 | 46561 / 16693 | 49735 / 9707 | 6986 |
| full | key-square-loader | 17 / 18 | 72133 / 30544 | 76276 / 32230 | 124 / 116 | 25182 / 3432 | 73646 / 31217 | 103605 / 36515 | -5298 |
| full | key-square-css-loader | 22 / 20 | 78111 / 33395 | 79477 / 33726 | 8342 / 1161 | 33400 / 4477 | 93167 / 35483 | 120247 / 39154 | -3671 |
| full | wallet | 11 / 4 | 26084 / 11843 | 6281 / 2855 | 124 / 116 | 19749 / 2940 | 26915 / 12348 | 27422 / 6459 | 5889 |
| full | wallet-repeated | 11 / 4 | 26084 / 11843 | 6281 / 2855 | 124 / 116 | 19749 / 2940 | 35769 / 12422 | 48379 / 6664 | 5758 |
| full | wallet-css | 16 / 6 | 32062 / 14694 | 9482 / 4351 | 8342 / 1161 | 27967 / 3985 | 46436 / 16643 | 44064 / 9124 | 7519 |
| full | wallet-loader | 17 / 18 | 72173 / 30562 | 76276 / 32230 | 124 / 116 | 19749 / 2940 | 73521 / 31167 | 97934 / 35933 | -4766 |
| full | wallet-css-loader | 22 / 20 | 78151 / 33413 | 79477 / 33726 | 8342 / 1161 | 27967 / 3985 | 93042 / 35433 | 114576 / 38572 | -3139 |
| full | key-circle | 11 / 4 | 26039 / 11818 | 6281 / 2855 | 124 / 116 | 39707 / 5252 | 26949 / 12368 | 47512 / 8890 | 3478 |
| full | key-circle-repeated | 11 / 4 | 26039 / 11818 | 6281 / 2855 | 124 / 116 | 39707 / 5252 | 37247 / 12454 | 70901 / 9114 | 3340 |
| full | key-circle-css | 16 / 6 | 32017 / 14669 | 9482 / 4351 | 8342 / 1161 | 47925 / 6297 | 46470 / 16655 | 64154 / 11561 | 5094 |
| full | key-circle-loader | 17 / 18 | 72128 / 30537 | 76276 / 32230 | 124 / 116 | 39707 / 5252 | 73555 / 31180 | 118024 / 38365 | -7185 |
| full | key-circle-css-loader | 22 / 20 | 78106 / 33388 | 79477 / 33726 | 8342 / 1161 | 47925 / 6297 | 93076 / 35441 | 134666 / 41008 | -5567 |
| full | combined | 13 / 4 | 26589 / 12246 | 6281 / 2855 | 124 / 116 | 84390 / 11392 | 28798 / 12991 | 94733 / 15258 | -2267 |
| full | combined-repeated | 13 / 4 | 26589 / 12246 | 6281 / 2855 | 124 / 116 | 84390 / 11392 | 59882 / 13293 | 164482 / 16269 | -2976 |
| full | combined-css | 18 / 6 | 32567 / 15097 | 9482 / 4351 | 8342 / 1161 | 92608 / 12437 | 48319 / 17265 | 111375 / 17992 | -727 |
| full | combined-loader | 19 / 18 | 72678 / 30965 | 76276 / 32230 | 124 / 116 | 84390 / 11392 | 75404 / 31798 | 165245 / 44788 | -12990 |
| full | combined-css-loader | 24 / 20 | 78656 / 33816 | 79477 / 33726 | 8342 / 1161 | 92608 / 12437 | 94925 / 36052 | 181887 / 47442 | -11390 |
| minimal | key-square | 9 / 3 | 25666 / 11500 | 6240 / 2794 | 124 / 116 | 25182 / 3432 | 26662 / 12078 | 33052 / 6979 | 5099 |
| minimal | key-square-repeated | 9 / 3 | 25666 / 11500 | 6240 / 2794 | 124 / 116 | 25182 / 3432 | 38594 / 12174 | 58455 / 7220 | 4954 |
| minimal | key-square-css | 12 / 4 | 31560 / 14227 | 9398 / 4227 | 8342 / 1161 | 33400 / 4477 | 46099 / 16245 | 49651 / 9583 | 6662 |
| minimal | key-square-loader | 13 / 13 | 67633 / 27623 | 71735 / 29250 | 124 / 116 | 25182 / 3432 | 69146 / 28294 | 99064 / 33532 | -5238 |
| minimal | key-square-css-loader | 16 / 14 | 73527 / 30350 | 74893 / 30683 | 8342 / 1161 | 33400 / 4477 | 88583 / 32435 | 115663 / 36108 | -3673 |
| minimal | wallet | 9 / 3 | 25706 / 11516 | 6240 / 2794 | 124 / 116 | 19749 / 2940 | 26537 / 12020 | 27381 / 6396 | 5624 |
| minimal | wallet-repeated | 9 / 3 | 25706 / 11516 | 6240 / 2794 | 124 / 116 | 19749 / 2940 | 35391 / 12093 | 48338 / 6601 | 5492 |
| minimal | wallet-css | 12 / 4 | 31600 / 14243 | 9398 / 4227 | 8342 / 1161 | 27967 / 3985 | 45974 / 16193 | 43980 / 9002 | 7191 |
| minimal | wallet-loader | 13 / 13 | 67673 / 27639 | 71735 / 29250 | 124 / 116 | 19749 / 2940 | 69021 / 28241 | 93393 / 32950 | -4709 |
| minimal | wallet-css-loader | 16 / 14 | 73567 / 30366 | 74893 / 30683 | 8342 / 1161 | 27967 / 3985 | 88458 / 32383 | 109992 / 35526 | -3143 |
| minimal | key-circle | 9 / 3 | 25661 / 11492 | 6240 / 2794 | 124 / 116 | 39707 / 5252 | 26571 / 12043 | 47471 / 8829 | 3214 |
| minimal | key-circle-repeated | 9 / 3 | 25661 / 11492 | 6240 / 2794 | 124 / 116 | 39707 / 5252 | 36869 / 12130 | 70860 / 9053 | 3077 |
| minimal | key-circle-css | 12 / 4 | 31555 / 14219 | 9398 / 4227 | 8342 / 1161 | 47925 / 6297 | 46008 / 16210 | 64070 / 11438 | 4772 |
| minimal | key-circle-loader | 13 / 13 | 67628 / 27615 | 71735 / 29250 | 124 / 116 | 39707 / 5252 | 69055 / 28257 | 113483 / 35383 | -7126 |
| minimal | key-circle-css-loader | 16 / 14 | 73522 / 30342 | 74893 / 30683 | 8342 / 1161 | 47925 / 6297 | 88492 / 32396 | 130082 / 37964 | -5568 |
| minimal | combined | 11 / 3 | 26211 / 11920 | 6240 / 2794 | 124 / 116 | 84390 / 11392 | 28420 / 12667 | 94692 / 15196 | -2529 |
| minimal | combined-repeated | 11 / 3 | 26211 / 11920 | 6240 / 2794 | 124 / 116 | 84390 / 11392 | 59504 / 12968 | 164441 / 16207 | -3239 |
| minimal | combined-css | 14 / 4 | 32105 / 14647 | 9398 / 4227 | 8342 / 1161 | 92608 / 12437 | 47857 / 16822 | 111291 / 17869 | -1047 |
| minimal | combined-loader | 15 / 13 | 68178 / 28043 | 71735 / 29250 | 124 / 116 | 84390 / 11392 | 70904 / 28875 | 160704 / 41806 | -12931 |
| minimal | combined-css-loader | 18 / 14 | 74072 / 30770 | 74893 / 30683 | 8342 / 1161 | 92608 / 12437 | 90341 / 33007 | 177303 / 44397 | -11390 |

Cold totals count every reachable external URL once. JavaScript totals include reachable static and literal dynamic imports. CSS totals compress inline sheets separately as a normalized estimate. Page totals compress HTML with inline sheets and recipe attributes once, then add external JavaScript and CSS. Gzip uses Node zlib defaults per resource. Headers, latency, Brotli, HTTP cache policy, cross-build cache reuse, frame pacing, and preparation timing are excluded.

### Existing CSS controls

The shared transform registration also loads the new sampler and compiler on existing single-property pages. The table compares identical icon sets. The after legacy-23 control corresponds to the before all route. The after all route contains 26 recipes and must not be subtracted from the earlier 23-recipe all route. Legacy-21 explicitly excludes the new family to preserve its original membership.

| Consumer | Before case to after case | JS files before / after | JS before raw / gzip | JS after raw / gzip | Page before raw / gzip | Page after raw / gzip |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| full | one to one | 4 / 4 | 5312 / 2554 | 5312 / 2554 | 15426 / 3778 | 15426 / 3778 |
| full | cog to cog | 4 / 4 | 4225 / 2011 | 6281 / 2855 | 6589 / 2989 | 8645 / 3834 |
| full | legacy-21 to legacy-21 | 6 / 6 | 7426 / 3507 | 9482 / 4351 | 58257 / 7450 | 60313 / 8296 |
| full | all to legacy-23 | 6 / 6 | 7426 / 3507 | 9482 / 4351 | 62061 / 7804 | 64117 / 8650 |
| minimal | one to one | 3 / 3 | 5269 / 2491 | 5269 / 2491 | 15383 / 3717 | 15383 / 3717 |
| minimal | cog to cog | 3 / 3 | 4184 / 1950 | 6240 / 2794 | 6548 / 2926 | 8604 / 3772 |
| minimal | legacy-21 to legacy-21 | 4 / 4 | 7342 / 3383 | 9398 / 4227 | 58173 / 7328 | 60229 / 8173 |
| minimal | all to legacy-23 | 4 / 4 | 7342 / 3383 | 9398 / 4227 | 61977 / 7682 | 64033 / 8527 |

### Warm transitions

Warm totals model same-build reuse of every external URL from the first page, with no eviction or revalidation. The second HTML document is always fetched again, including its inline sheets. This is a resource/cache model, not an observed network trace. Before/after builds have separate caches. The complete JSON also preserves other transitions, whose icon membership must be checked before subtracting them.

| Consumer | Transition | New JS files before / after | Page transfer before raw / gzip | Page transfer after raw / gzip |
| --- | --- | ---: | ---: | ---: |
| full | combined to combined-repeated | 0 / 0 | 33293 / 1047 | 158201 / 13414 |
| full | combined to combined-css | 5 / 2 | 21730 / 5019 | 105094 / 15137 |
| full | combined-css to combined-css-loader | 6 / 14 | 62358 / 20955 | 172405 / 43091 |
| full | loader to combined-loader | 4 / 3 | 3961 / 1767 | 93802 / 14757 |
| full | combined-css-loader to combined | 0 / 0 | 2209 / 745 | 88452 / 12403 |
| minimal | combined to combined-repeated | 0 / 0 | 33293 / 1048 | 158201 / 13413 |
| minimal | combined to combined-css | 3 / 1 | 21646 / 4902 | 105051 / 15075 |
| minimal | combined-css to combined-css-loader | 4 / 10 | 58236 / 18360 | 167905 / 40170 |
| minimal | loader to combined-loader | 4 / 2 | 3961 / 1763 | 93761 / 14694 |
| minimal | combined-css-loader to combined | 0 / 0 | 2209 / 747 | 88452 / 12402 |

## Commands and validation

The cycle/compiler TDD slices first failed for the absent KeySquare, Wallet, and KeyCircle cycles, then passed with their source-backed contracts. A loading-role check first failed for the missing combined compiler classification, then passed. Eleven focused compiler/recovery tests pass, including 51 entry matrices from the frozen pre-extraction capture. Eight loading tests pass. Eight bundle-inspector tests pass, including rejection of a serialized independent offset changed from .25 to .2. Drawing expectations were preserved.

The regenerated inventory accounts for 470 exports with 26 migrated recipes, two capability candidates, 18 explicit Motion retentions, and 424 needing source review. The three reviewed decisions pin the new dependency hashes. Import counts still do not establish migration eligibility. The generated comparison manifest includes the three recipes and their comparison route.

Commands run use the required rtk prefix:

```sh
rtk pnpm check
rtk proxy node --test scripts/cycle-css.test.mjs
rtk proxy node --test scripts/measure-page-loading.test.mjs
rtk proxy node --test scripts/inspect-bundle.test.mjs
rtk proxy node scripts/css-migration-catalogue.mjs --write
rtk pnpm inventory:animations --summary --output .artifacts/animation-inventory.json
rtk proxy node scripts/measure-page-loading.mjs
rtk pnpm validate
rtk proxy env ICON_TEST_PORT=45343 pnpm fixture:serve
```

`pnpm validate` passed in 111.531 seconds with zero Astro errors, warnings, or hints. It verified 470 initial drawings and native controls, 944 bundle cases, 26 migrated recipes across 36 integrated compositions, the existing pilot, chevron and capability routes, and all 73 Node tests. Routine validation stayed browser-free and added no Playwright dependency. Local documentation paths and all after-measurement source hashes were verified against this worktree. Owner review uses `/combined-transforms/` with play/stop controls and synchronized row hover. The owner acceptance is recorded separately at the reviewed implementation commit. PR integration and issue closure remain separate repository actions.
