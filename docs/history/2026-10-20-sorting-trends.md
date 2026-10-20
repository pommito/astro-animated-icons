# Sorting and trend icons verification

The batch adds ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, SquareArrowDown, SquareArrowLeft, SquareArrowRight, SquareArrowUp, TrendingDown, and TrendingUp on base `b0d06056317e57c783780aa968f4b6872c4bfe4e`.

All ten drawings and recipes come from [Lucide Animated revision 4662fff2b60fdcf4751b32013606756caf7c4c26](https://github.com/pqoqubbw/icons/tree/4662fff2b60fdcf4751b32013606756caf7c4c26/icons). A safe tarfile read compared every copied reference with the pinned archive. All ten match after changing only the class utility import. No source recipe is corrected in the reference.

## Implementation and comparisons

Sorting glyphs share the SVG-parts transform sampler and the source spring with stiffness 240 and damping 24. Their arrows remain static. Square arrows keep their square static, translate their head, and morph the shaft's actual d attribute. SVG-parts now types string-array d targets and preserves the current attribute when a running morph replays. Existing scalar d targets retain their behavior.

TrendingDown and TrendingUp keep separate opacity, path-length, and path-offset tracks. Stop starts the declared normal opacity and path-length transitions while preserving the original pulse and path-offset timelines. The source omits normal targets for those properties. The adapter retains their remaining samples, including the original easing and delayed arrow head. Removal and reduced motion cancel everything immediately. Completed offsets retain completion through stop so a later replay starts at offsets 1 and 0.5.

The comparison route is `/sorting-trends-comparison/` on assigned port 45394. It executes all ten pinned React components at explicit sizes 14, 16, 24, and 28. The reference runner samples JavaScript d morphs and retains the entry clock for trend properties omitted from normal. The tests begin sampling before the 100 ms opacity track finishes, so they can pause and seek its native animation.

Five comparisons cover entry and captured returns at 50, 200, 350, and 700 ms. Samples include 0, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 800, and 1000 ms. The measured maximum geometry difference was 0.005981 screen pixels. The maximum normalized paint difference was 0.000299. Geometry tolerance remains 0.03 screen pixels and paint tolerance remains 0.005.

Captured returns reset reference spring velocity. These results do not establish parity of real interrupted spring velocity. Numerical evidence supports the user's manual visual review. Chrome was checked. Firefox and Safari were not checked.

## Focused verification

Every browser command uses `ICON_TEST_PORT=45394` and at most two workers. Playwright uses one worker when only this single test file runs.

- The first SquareArrowDown restoration test failed before the icon existed, then passed after implementation. It observes the changing d attribute, immediate stop continuity, return to the idle string, and absence of later writes.
- The first return comparisons exposed the trend properties that continue outside the normal variant. Preserving their original clocks fixed those comparisons without changing copied source recipes.
- A completed-reveal replay regression failed with offsets `[0, 0]`. Keeping completed-track state through stop restored the declared offsets `[-1, -0.5]`.
- `pnpm check` passed both Astro checks and TypeScript with zero errors, warnings, and hints after the reference runner cleanup.
- `ICON_TEST_PORT=45394 pnpm test tests/sorting-trends.spec.ts --workers=2` reported `121 passed (1.7m)` before the final reuse of SVG-parts for the square shafts. It covers no-JavaScript drawings and native links, hover, manual playback, phase-specific interruption, stop continuity, rapid replay, instance isolation, cleanup, reduced motion, and the five upstream comparisons.
- Dedicated shaft tests observe both d and requestAnimationFrame callbacks after stop, removal, and reduced motion during entry and return. They also check reconnection to another native control. A geometry check covers replay continuity during entry and return for each mechanism.

## Complete validation

After the SVG-parts reuse, the focused morph and replay command reported `96 passed (1.7m)`.

The first `ICON_TEST_PORT=45394 pnpm validate --workers=2` passed type checks, a fresh build, and inspection of 334 icons across 671 bundle cases. It stopped at the negative CSS-baseline test because the new single-icon routes preceded the existing `arrow-left: "single"` case. Restoring that case to the first position fixed the expected diagnostic. The assertions were unchanged. `pnpm test:bundle` then reported five passing checks. The Standards reviewer confirmed this correction.

The repeated `ICON_TEST_PORT=45394 pnpm validate --workers=2` completed all stages and the complete Chrome suite. It passed both Astro checks and TypeScript with zero errors, warnings, and hints. It rebuilt the fixture once, inspected all 671 bundle cases for 334 icons, passed all five inspector negative tests, and passed all three fixture cache tests. The browser run reused the fresh output and reported `2759 passed (30.9m)` and two failures. All 121 sorting and trend scenarios passed, including the five upstream comparisons with the same maximum differences listed above.

The two failures were the existing chevron and grip comparison tests. Both reached their unchanged 30000 ms test timeout at the final Play all click after their numerical entry and return assertions. No geometry or opacity assertion failed. Their files and comparison fixtures were unchanged in this batch.

`ICON_TEST_PORT=45394 pnpm test tests/chevrons.spec.ts tests/grips.spec.ts --workers=1 --grep "all chevrons match|all grips match"` reused matching output and reported `2 passed (33.7s)`. The chevron test took 17.7 seconds with a maximum geometry difference of 0.000015 screen pixels. The grip test took 11.5 seconds with a maximum geometry difference of 0.000061 screen pixels and zero opacity difference. No assertion, test timeout, or browser fixture changed for the rerun. The parallel run's timing failure remains unexplained. The complete suite was not repeated after this successful isolated rerun.

Adapter replay preserves an interrupted pose for transform, d, and offset tracks. The source copies retain their explicit arrays. The upstream comparisons establish initial entry and captured-return agreement; they do not establish interrupted-replay parity. The separate public-handle tests establish replay continuity for the adapter.

## Standards

The parallel Standards review found no documented violation or concrete code smell. It read the shared mechanisms, adapters, fixtures, tests, and current lifecycle helpers. The review was static.

## Spec

The independent Spec review found no concrete deviation. It read all ten pinned sources, checked reference-copy identity, and reviewed geometry, signs, springs, d morphs, delays, implicit returns, exports, bundles, attribution, and test limits. The review was static.

## Workspace

The managed worktree tool failed with `Git ref lookup failed` while the saved project still pointed to the removed singular `product` path. The fallback checkout is `/private/tmp/astro-sorting-trends-20261020`, on `feat/sorting-trends-icons`. It was created directly from the actual repository at `/Users/victor/Developer/products/astro-animated-icons`. Reviewed sandbox escalation allowed Git metadata writes, dependency installation, GitHub PR reading, and local Chrome serving. No symlink or saved app configuration changed. The shared main checkout was not edited. The worktree is retained for review.
