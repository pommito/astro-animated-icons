# Production measured paint rollout

The owner approved ADR 0002 in the implementation chat on 2026-10-30 at proof revision `df7a852a1f83351ad81795da76ec20407bb89ea0`. The same instruction authorized every compatible family and retained WindArrowDown on Motion. Implementation starts at `00b9c89`. Production visual acceptance remains pending. Keep PR #104 in draft and #103 open.

## Scope and implementation

The rollout migrates all 30 runtime-path-reveal, 23 staggered-path-reveal, 21 currency-path-reveal, 12 symbol-path-reveal and two compatible wind-path-reveal recipes. The [immutable original scope](../../tests/helpers/path-paint-scope.json) names every candidate. WindArrowDown remains entirely on Motion with its retained sampled Y/opacity and delayed measured strokes. [Follow-up #105](https://github.com/pommito/astro-animated-icons/issues/105) is a native child of #103.

Each icon has one local readable `paint.ts` and an unchanged drawing. CssPaintIcon renders its complete initial SVG, generated CSS and compact self-contained recipe record. One shared registration entry uses existing discovery, lifecycle and stylesheet recovery. Consumers keep their exports, tags, props, handles and void methods. There is no new dependency or consumer setup.

The adapter captures computed paint before cancellation and preserves independent effect and interval easing. Lengths are static target-local variables, measured once per actual stroke target in the current phase. Zero-length geometry preserves the preceding behavior. Opacity-only return performs no geometry reads. Restart, active, until-clear, incomplete-dash and current-dash policies preserve local exceptions. Missing return properties remain held until cleanup.

The strict inventory reports 470 exports across 39 families, with 120 migrated, zero deferred, 107 capability candidates, 243 Motion retentions and zero unresolved reviews. The extra family records the WindArrowDown exception. All 381 records outside the original scope, including their hashes, are byte-equivalent JSON objects to `df7a852`. Negative tests invalidate migrated and deferred paint reviews after recipe, drawing, type, compiler, codec or registration drift.

## Independent behavior evidence

The frozen [source baseline](2026-10-30-path-paint-source-before.json) predates extraction. The [production source trace](2026-10-30-production-paint-source-trace.json) records actual native keyframes from all 88 original public Motion components before rewiring. Its [capture](2026-10-30-production-paint-source-trace.js) intercepts Element.animate before native rounding. Extraction matched those normalized traces against the independent Phase 1 plans. Drawing validation retains the original expectations.

Five `production-*-motion-before.json` files contain independent captures from the original production Motion components. [The capture script](2026-10-30-production-paint-capture.js) records native timelines and computed paint at 14, 16, 24 and 28 px. It samples 0, 1, 5, 31, 83, 199, 299, 399 and 501 ms plus midpoint and phase endpoints. Interrupted entry at 31, 199 and end-minus-one covers stop/replay. Further scenarios cover repeated stop, replay during return, completion, replay after completion, stop after held completion, stale callbacks and reconnect. Each JSON retains exact per-scenario times, including delays and source duplicate endpoints.

Chrome 154.0.0.0 on macOS compares both production CSS and fixture-only preceding Motion mechanisms with these captures. References share production data and drawings and do not execute upstream React. Missing or excess samples fail. The unchanged matrix/translation tolerance is 0.005 and opacity tolerance is 0.001. ADR 0002 adds 0.005 SVG user units per dash-list component and signed offset, requiring equal lists, equivalent units and exact none states.

| Family | Icons | Saved pose records | Compared shapes per engine | Cleanup checks per engine | Maximum error | Failures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [symbol-path-reveal](2026-10-30-production-symbol-path-reveal-browser.json) | 12 | 4048 | 15520 | 240 | 0 | 0 |
| [runtime-path-reveal](2026-10-30-production-runtime-path-reveal-browser.json) | 30 | 10164 | 46080 | 600 | 0 | 0 |
| [staggered-path-reveal](2026-10-30-production-staggered-path-reveal-browser.json) | 23 | 7820 | 42160 | 460 | 0 | 0 |
| [currency-path-reveal](2026-10-30-production-currency-path-reveal-browser.json) | 21 | 7140 | 31280 | 420 | 0 | 0 |
| [wind-path-reveal](2026-10-30-production-wind-path-reveal-browser.json) | 2 | 680 | 2380 | 40 | 0 | 0 |

The totals are 29852 pose records and 137420 shape comparisons per engine, plus 1760 passing cleanup checks per engine. Zero error applies only to the saved points and properties.

- [Geometry probes](2026-10-30-production-paint-geometry-browser.json) pass 1408 checks across all 352 production instances. Connection performs zero measurements; entry, replay and return measure each affected stroke target once. UserRoundPlus return and opacity-only recipes measure none. These are instrumented synthetic API calls, not frame timing.
- [Synthetic cleanup](2026-10-30-production-paint-cleanup-browser.json) passes 2112 checks across those instances, including independent clones after template/source removal, deleted-sheet recovery, disconnect/reconnect and matchMedia stubs.
- [Source-removed templates](2026-10-30-production-paint-template-browser.json) pass 906 checks for all 88 paint recipes and twelve existing CSS controls. Early and late clones play and return, reconnect, and reconcile one active stylesheet per recipe. A nested unknown tag registers through a synthetic astro:page-load event. This is not a real ClientRouter transition.
- [Native media](2026-10-30-production-paint-native-media-browser.json) checks all 120 CSS recipes through paused entry, Chrome reduced-motion emulation, cancellation, captured paint cleanup, blocked manual replay and restoration. It uses native matchMedia and trusted toolbar clicks, without a preference stub or operating-system change.
- [Native input](2026-10-30-production-paint-native-input-browser.json) records trusted mouse entry/leave on the EyeOff containing link, with three entry and return tracks. Trusted global toolbar events start and stop all 352 production samples. DevTools reported an interaction-stability timeout after toolbar dispatch; the event records confirm both operations reached every sample. No visual judgement follows from these records.

## Production payloads

The fresh [before](2026-10-30-production-paint-loading-before.json) and [after](2026-10-30-production-paint-loading-after.json) measurements each cover 549 compositions in full and minimal production consumers. Fixed path-paint compositions keep the original 89 members, including retained WindArrowDown. Dynamic all changes membership from 32 to 120 and is not used as a before/after savings claim. Fixed legacy-21/23 controls remain unchanged.

Both runs use Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1 and TypeScript 6.0.3 on darwin arm64, Apple M1 Pro. Reachable shared resources count once per URL. Cold gzip uses Node zlib defaults per external resource. CSS is a normalized separately compressed figure; actual page totals compress HTML including inline CSS once and add external resources. Never add CSS or recipeData to page again. RecipeData gzip sums separately compressed attributes and is diagnostic, not the compressed HTML contribution.

The minimal project has only measurement routes and public imports, using installed workspace links. It contains no comparison implementation and is not a packed-package installation. Module metadata identifies selected registration, lifecycle, compiler/recovery, adapter and codec contributions before final minification. Paint-only family routes reach no Motion module. Wind and LoaderCircle mixtures retain their necessary Motion graph.

| Consumer and fixed composition | JS files before / after | JS raw / gzip after | CSS raw / gzip after | HTML raw / gzip after | Page raw before / after | Page gzip before / after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| full, paint-phone-off | 7 / 5 | 6749 / 3158 | 1159 / 402 | 2204 / 901 | 12526 / 8953 | 5871 / 4059 |
| full, paint-eye-off | 7 / 5 | 6749 / 3158 | 2052 / 480 | 3147 / 991 | 12804 / 9896 | 5995 / 4149 |
| full, path-paint | 105 / 15 | 32375 / 14715 | 365701 / 39188 | 449188 / 23790 | 114028 / 481563 | 39790 / 38505 |
| full, path-paint-repeated | 105 / 15 | 32375 / 14715 | 365701 / 39188 | 1939396 / 172582 | 998611 / 1971771 | 127309 / 187297 |
| full, path-paint-css | 111 / 19 | 39822 / 18044 | 373919 / 40233 | 462731 / 25135 | 135684 / 502553 | 45051 / 43179 |
| full, path-paint-loader | 111 / 21 | 78464 / 33433 | 365701 / 39188 | 449705 / 23951 | 160634 / 528169 | 58602 / 57384 |
| full, path-paint-css-loader | 117 / 25 | 85911 / 36762 | 373919 / 40233 | 463248 / 25211 | 182290 / 549159 | 63838 / 61973 |
| minimal, paint-phone-off | 5 / 3 | 6667 / 2991 | 1159 / 402 | 2204 / 899 | 12166 / 8871 | 5551 / 3890 |
| minimal, paint-eye-off | 5 / 3 | 6667 / 2991 | 2052 / 480 | 3147 / 988 | 12444 / 9814 | 5673 / 3979 |
| minimal, path-paint | 103 / 11 | 31887 / 14213 | 365701 / 39188 | 449188 / 23790 | 113650 / 481075 | 39399 / 38003 |
| minimal, path-paint-repeated | 103 / 11 | 31887 / 14213 | 365701 / 39188 | 1939396 / 172581 | 998233 / 1971283 | 126918 / 186794 |
| minimal, path-paint-css | 106 / 13 | 39174 / 17382 | 373919 / 40233 | 462731 / 25135 | 135143 / 501905 | 44405 / 42517 |
| minimal, path-paint-loader | 107 / 15 | 73854 / 30336 | 365701 / 39188 | 449705 / 23950 | 156134 / 523559 | 55613 / 54286 |
| minimal, path-paint-css-loader | 110 / 17 | 81141 / 33505 | 373919 / 40233 | 463248 / 25209 | 177627 / 544389 | 60594 / 58714 |

All 88 migrated single-icon pages save page gzip. Full-consumer savings range from 1313 bytes for AtSign to 2197 for ChartLine; minimal savings range from 1163 to 2045 bytes for the same icons. The raw/gzip fields for every single, family and mixture are in the linked JSON. Do not sum single-icon savings.

The following deltas are after minus before page gzip bytes. Positive values are regressions. Each cell gives full / minimal consumers. Wind retains the original three-member measurement composition, with two migrated icons and WindArrowDown on Motion.

| Fixed family | Single family | Twenty repetitions | Existing CSS mixture | LoaderCircle mixture | CSS plus LoaderCircle |
| --- | ---: | ---: | ---: | ---: | ---: |
| symbol-path-reveal | -2893 / -2747 | -2462 / -2316 | -3529 / -3292 | 990 / 803 | 346 / 248 |
| runtime-path-reveal | -4994 / -4881 | 51 / 167 | -5585 / -5382 | -1060 / -1279 | -1710 / -1839 |
| staggered-path-reveal | -1132 / -915 | 3350 / 3569 | -1704 / -1396 | 2809 / 2690 | 2173 / 2144 |
| currency-path-reveal | -1514 / -1309 | 1232 / 1436 | -2068 / -1774 | 2425 / 2296 | 1809 / 1767 |
| wind-path-reveal | 2850 / 2665 | 2996 / 2812 | 2219 / 2121 | 2852 / 2668 | 2217 / 2119 |

The complete original scope saves 1285 / 1396 page gzip bytes, but twenty repetitions add 59988 / 59876 bytes. Repeated attributes and long-document compression cause that cost; runtime and generated sheets still deduplicate. The mixed-Motion regressions above remain part of the rollout decision. The dated #95 and #102 evidence remains unchanged.

Warm figures model a same-build second document with every external URL from the first route cached, without eviction or revalidation. HTML is fetched again. Moving from path-paint to twenty repetitions needs no new external resource, but HTML gzip rises from 94451 / 94453 before to 172582 / 172581 after. Moving from LoaderCircle to path-paint plus LoaderCircle falls from 96 new external files in both consumers to six / four, and modeled page gzip falls from 28571 / 28501 to 27340 / 27174. These are cache calculations, not observed network timings.

Headers, latency, Brotli, cache policy and cross-build reuse are excluded. Byte counts and CSS wiring establish no preparation or frame-pacing advantage.

## Validation and review

Focused red-to-green tests cover compiler and signed offset, current-phase geometry, compact wire data, comparison coverage, inventory/hash invalidation and loading. Additional negative cases reject wrong compact timing, missing/unused registration, an unsigned offset and missing stylesheet markers.

Executed commands and relevant output:

```text
rtk pnpm check
Package and fixture: 0 errors, 0 warnings, 0 hints; shared fixture tsc passes.
rtk pnpm fixture:prepare
2862 pages built.
rtk pnpm inventory:animations --check --summary --output .artifacts/production-paint-inventory.json
470/470 source reviews; 120 migrated, 0 deferred, 107 capability-needed,
243 retained-on-motion, 0 needs-review.
rtk proxy node scripts/measure-page-loading.mjs
549 compositions in each full/minimal consumer, with verified registrations,
module evidence, repeated CSS/runtime reuse and no comparison implementations.
rtk pnpm validate
Verified 470 icons across 944 bundle cases.
Verified 120 migrated recipes across 132 integrated compositions.
Verified 470 production drawings and native controls.
108 tests passed, 0 failed. Validation: 143.403 seconds.
rtk git diff --check
No whitespace errors.
```

These automated checks run without a browser. The browser evidence above comes from separate Chrome executions. Source and dependency records establish preservation and selective delivery; their scope does not establish cross-browser rendering.

### Standards

Independent review of `df7a852...00b9c89` reports zero actionable findings. It checked repository rules, shared lifecycle/discovery/recovery reuse and local recipe boundaries. All 88 production plans match the frozen Phase 1 plans and round-trip through the codec. Its 27 focused compiler, geometry, codec, registration, catalogue and inventory tests pass. The reviewer inspected saved browser summaries without rerunning browser interactions or full validation.

### Spec

Independent review of the same diff against #103 and the explicit owner approval reports zero actionable findings. It checked all channels of the 88 recipes against independent source traces, the unchanged 381 outside-scope records, all four sizes, coverage multiplicities and full/minimal measurements. Its 21 focused compiler, codec, manifest and inventory tests pass. The reviewer found no missing requirement, scope creep or incorrect behavior, and left production visual acceptance pending. A follow-up documentation review corrected the phrase "88 channels" to "all channels of the 88 recipes"; there are 513 entry and 511 return channels. All report tables and totals match the saved JSON.

Safari, Firefox, real touch/hybrid hardware, operating-system preference changes, cross-browser geometry, frame pacing and packed-package installation remain unverified. The owner must visually accept the explicit complete 88-icon production set on `/path-paint/` before merge. The isolated proof approval and architecture approval do not grant that acceptance.
