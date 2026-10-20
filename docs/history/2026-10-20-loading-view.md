# Loading and viewport icon verification

This batch adds Loader, LoaderCircle, LoaderPinwheel, CircleDashed, Cog, RefreshCcwDot, RefreshCwOff, Maximize, Maximize2, and Minimize.

## Final verification

All checks below ran on the original feature source tree at `deee365` in `/private/tmp/astro-loading-view-01a15972`, on `feat/loading-view-icons`. Browser commands used `ICON_TEST_PORT=45402` and one worker. The later main integration is recorded separately below.

| Stage | Observed result |
| --- | --- |
| `pnpm check` | Both Astro checks and TypeScript passed. Astro reported zero errors, warnings, and hints across 1180 package files and 1573 fixture files. |
| Fixture build | 1177 pages built successfully. |
| Bundle inspection | 374 icons across 751 cases passed, including selective behavior loading and shared CSS checks. |
| Inspector regression tests | 5 passed, 0 failed, 0 skipped. |
| Fixture cache tests | 3 passed, 0 failed, 0 skipped. |
| Complete Chrome attempt | 3250 passed, 19 failed, 0 incomplete, 0 skipped in 2.7 hours. |
| Retry of exactly those 19 failures | 19 passed, 0 failed in 31.6 seconds. |

The complete command was `ICON_TEST_PORT=45402 pnpm validate --workers=1`. It exited with status 1 because of the 19 browser failures. The subsequent command, `ICON_TEST_PORT=45402 pnpm test --workers=1 --last-failed`, exited with status 0. No source, assertion, timeout, or browser configuration changed between them. All 3269 Chrome cases therefore have a passing result on the final source tree. The complete command did not pass in one uninterrupted attempt.

The failed cases concerned standalone hover, Archive, ArrowLeft, chart and connectivity comparisons, Clock cleanup, SquarePen hover, ten directional-arrow hover cases, the display comparison, and Download without JavaScript. Several exceeded their existing global timeout before reaching assertions. The chart and connectivity comparisons observed opacity differences at time zero. All 19 passed on retry. This supports an execution-condition explanation, but does not independently prove the cause of every initial failure.

During the slow portion, a process read showed about 170 MiB resident memory for the validation browser's main process and about 63 MiB free system memory. The human explicitly chose to continue the running suite. Later cases returned to subsecond execution. No machine or application settings were changed.

The complete attempt includes all 147 loading-view cases, with 147 passed and 0 failed. They cover full no-JavaScript drawings, native links, manual handles, hover isolation, interrupted stop and replay, cleanup after removal, reconnection, and reduced motion. Stop samples include 50, 250, 700, 950, 1750, and 2900 ms. Dedicated regressions cover exact and adjacent loop boundaries, late-cycle angles, completed stagger replay, Maximize's butt caps and miter joins, and exact FilePenLine matrices at 500 and 501 ms.

Local evidence logs are retained at:

- `/private/tmp/loading-view-exclusive-check.log`
- `/private/tmp/loading-view-exclusive-validate-final.log`
- `/private/tmp/loading-view-exclusive-rerun-failed.log`
- `/private/tmp/loading-view-selective-matrix-focused.log`

## Source and comparison

Every drawing and recipe was read from the read-only archive of [Lucide Animated revision 4662fff2b60fdcf4751b32013606756caf7c4c26](https://github.com/pqoqubbw/icons/tree/4662fff2b60fdcf4751b32013606756caf7c4c26/icons). A byte comparison verified all ten copied React sources against the archive after replacing only `@/lib/utils` with `../utils`. Source links and license notices are retained in [the package notices](../../packages/animated-icons/THIRD_PARTY_NOTICES.md).

[The comparison page](../../tests/fixtures/astro/src/pages/loading-view-comparison.astro) runs the ten original React components at 14, 16, 24, and 28 px. Fourteen cases compare entry and captured returns, including 800, 801, 1000, 1001, 1600, 1601, 2000, and 2001 ms. Each case samples 24 times through 2900 ms. The final run's maximum geometry difference is 0.000488 screen pixels; maximum normalized paint difference is 0.000000. Existing tolerances remain 0.03 pixels and 0.005 respectively.

For manual review, run `ICON_TEST_PORT=45402 pnpm test:serve` in the worktree and open `http://127.0.0.1:45402/loading-view-comparison/`. The comparison uses the existing reference runner and measurement helpers.

## Mechanisms and review fixes

Recipes reuse SVG parts for looping rotations and staggered opacity, whole-SVG rotation for Cog, SVG keyframes for RefreshCwOff, and resize tracks for the viewport corners. Origins, geometry, targets, and transitions remain local to each icon. Maximize overrides inherited round caps and joins on its drawing group to preserve upstream defaults. Public props, lifecycle, and dependencies remain unchanged.

The Spec review found an incorrect velocity sample across a rotation loop boundary. Subtracting 357.75 degrees from a normalized zero produced -71550 degrees per second and excessive reverse turns. An internal `preserveCycleEnd` option lets only the three loaders retain the previous cycle's endpoint at exact boundaries and measure velocity within the current cycle immediately afterward. Other recipes keep their existing boundary convention. Numeric poses retain full rotation angles.

A strict FilePenLine test at 501 ms exposed a second gap. The interrupted pose used an analytic easing sample while native animation interpolates between sampled keyframes. The helper now interpolates those same frames. Native `commitStyles()` still rounded the displayed x translation of -0.00017242 px to -0.0001724 px, a difference of 0.00000002 px. It rounded y from 0.00034486 px to 0.0003448 px, the maximum remaining difference of 0.00000006 px. The helper captures the displayed matrix before stop and restores it only when stop changes that matrix. Continuous first frames reuse a restored inline matrix when their numeric pose matches.

The first broad validation attempt exposed three BadgePercent regressions in that correction. A matrix first frame mixed with subsequent `rotate()` frames introduced a CSS decomposition residual at exactly 180 degrees, changing zero to `1.22465e-16`. Restricting matrix substitution to restored inline matrices preserves exact native rotations. The focused BadgePercent tests at 50, 200, 450, and 750 ms and FilePenLine tests at 500 and 501 ms reported `6 passed (45.3s)`. All also passed in the final complete attempt. Existing `continueOnReturn` handling and the matching-keyframe-offset guard in SVG parts are unchanged.

Before implementation, the focused Loader no-JavaScript test failed because its route had no SVG. The complete final run passes that same scenario. Temporary debug instrumentation was removed. Independent Standards and Spec reviews approved the final corrections with no remaining finding. Both reviews were static and ran no browser or build.

## Checkout and limits

The branch starts at `00a7f5189119251da6dc2621391b5dbb27b88fcd`. The managed worktree tool returned `Git ref lookup failed` after the repository moved to `/Users/victor/Developer/products/astro-animated-icons`. A normal Git worktree was created from that repository with reviewed access to its Git metadata. During the original validation, the shared main checkout was not edited, no other batch was integrated, and no PR or push was created.

Chrome is the tested browser. Safari and Firefox remain unverified. Captured reference returns reset velocity on both versions; actual interrupted spring velocity equality remains unmeasured. The numerical and continuity checks support the user's manual visual review. Visual acceptance remains with the user.

After validation, process inspection found no heavy process with this worktree's working directory. Port 45402 had no listener, and `.artifacts/fixture.lock` was absent. The worktree is retained for review.

## Main integration for PR 70

The human subsequently requested publication and merge. [PR 70](https://github.com/pommito/astro-animated-icons/pull/70) was opened from `deee365`. While it was being opened, [PR 69](https://github.com/pommito/astro-animated-icons/pull/69) added the food and plant batch to main through `c85e940a0193d4c4d54462468a386f9b3765f63b`.

The integration preserves both blocks in the two conflicting files, `astro.ts` and `THIRD_PARTY_NOTICES.md`. Bundle cases merged automatically and retain `arrow-left: single` as the first baseline. Independent Standards and Spec reviews found no issue in the resolution. Static comparison confirms 384 components and 384 handles, with all icon files preserved from their respective parents. The transform sampler remains byte-identical to `deee365`. Incoming rendering and Feather drift changes remain byte-identical to main.

`git diff --cached --check` and `node --check scripts/inspect-bundle.mjs` pass. Combined runtime validation is pending an available serialized validation slot. The earlier complete-suite results apply to the original feature tree, rather than this integrated tree.
