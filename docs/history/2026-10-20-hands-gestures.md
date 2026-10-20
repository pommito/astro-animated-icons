# Hands and gestures validation

The batch adds Hand, HandCoins, HandFist, HandGrab, HandHeart, HandHelping, HandMetal, HeartHandshake, BicepsFlexed, and Clap from Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

The worktree starts at `b0d06056317e57c783780aa968f4b6872c4bfe4e`. Its path is `/private/tmp/astro-icons-hands-gestures-20261020-b0d0605`, on branch `feat/hands-gestures-icons`. The managed worktree tool failed to resolve the base after the repository moved to `/Users/victor/Developer/products/astro-animated-icons`. Git created this isolated worktree from that actual repository. The shared main checkout was not edited. Dependencies use the existing lockfile.

## Implementation and source checks

The recipes reuse SVG-parts, native Motion tracks, and the existing Web Component lifecycle. The shared helper adds optional transform origins, used by Hand and HandMetal. HandHeart separates its delayed spring translation and immediate scale onto nested elements. No public API or dependencies change.

The comparison route `/hands-gestures-comparison/` executes all ten pinned original React components at 14, 16, 24, and 28 px. Reference copies redirect the class utility import. Clap also initializes its two groups with `initial="normal"`, so its declared pivots apply on the first entry. The adapter uses those pivots throughout. Notices and the comparison page explain this compatibility adjustment.

Finite return seeks stop at each original property's actual duration. Without that bound, paused JavaScript spring samples can move again after playback would have finished. Numerical return samples start at 25 ms. For tiny scale displacements, the original spring can snap to rest at time zero, while the adapter preserves the interrupted pose for stop continuity. Public handle tests check that first pose separately.

Entry measurements include BicepsFlexed's later loops. Captured returns cover 50, 150, 350, and 2600 ms entry interruptions. They reset reference velocity before stopping. Real interrupted spring velocity parity remains unmeasured.

## Focused evidence

All browser commands use `ICON_TEST_PORT=45393` and at most two workers.

- The first Hand test failed because its public export was absent. After implementation, its seven scenarios passed.
- The first ten-icon run passed 83 of 85 scenarios. Entry geometry differed by at most 0.000061 screen pixels. The two return failures exposed paused reference samples beyond spring completion and the tiny-scale first-pose distinction described above.
- After correcting comparison sampling, all five comparison scenarios passed. Maximum geometry difference was 0.000122 screen pixels. Maximum paint difference was 0.000000 at six displayed decimal places.
- The next run passed 105 of 108 scenarios. Three new replay assertions sampled a keyframe segment that was identical before and after replay. Sampling at 50 ms after replay observes the changed first segment while retaining the strict first-pose continuity assertion.

- The corrected five comparisons and all entry/return replay and completed-track scenarios passed in a focused rerun, `28 passed (24.4s)`. A subsequent `pnpm check` passed both Astro checks with zero errors, warnings, and hints, plus TypeScript.
- The two independent row-control scenarios passed, `2 passed (8.0s)`.

The recipe suite checks complete drawings and native links without JavaScript, hover, interruptions at 50, 250, 650, and 2600 ms, stop continuity, rapid replay, removal, independent instances, and reduced motion. Additional scenarios check replay during entry and return, plus completed coin opacity, heart scale, and inner-clap tracks while another track is still active.

## Review

### Standards

The review found no documented-standard violation in the staged implementation. A follow-up review found that a global comparison playback flag did not follow independent row returns. The reference runner now reports each actual playback through an optional callback. The hands comparison records returning rows in a WeakSet. This covers pointerleave, row replay, and a single hovered row while other rows return. Two focused tests compare those cases on separate pages. The follow-up review found no remaining issue.

### Spec

The review checked all ten archived sources, adapter drawings, transitions, exports, fixtures, and coverage. It found no missing requirement or unjustified scope change. Clap's initialized pivots and the limits of captured spring comparisons remain documented.

The first complete-validation command stopped during its forced build to include this review fix. It had not reached Chrome. After confirming its build PID had stopped, the stale fixture lock was removed before the next focused run.

A later validation attempt stopped before the build because the new row-control test needed a literal TypeScript annotation for its SVG origin. That annotation does not change browser behavior.

## Complete validation

`ICON_TEST_PORT=45393 pnpm validate --workers=2` completed its full Chrome pass with exit code 1.

- Both Astro checks reported zero errors, warnings, and hints. TypeScript passed.
- The forced production build completed.
- Bundle inspection reported `Verified 334 icons across 671 bundle cases.` It checked shared CSS, registration counts, exact combined chunk unions, unused exports, and absence of React in consumer bundles.
- All five inspector tests passed, including the negative cases. The first `single` route remains first in the inspector so its baseline-CSS diagnostic runs before comparisons with other routes. An earlier negative test caught the changed ordering; restoring the order fixed it without changing assertions.
- All three fixture cache tests passed. Later steps reused the same output.
- Chrome reported `2748 passed (29.8m)` and two failures. All 110 hands-and-gestures scenarios passed. The five comparisons measured at most 0.000122 screen pixels of geometry difference and 0.000000 paint difference at six displayed decimals.

The two failures were existing comparison tests in `tests/chevrons.spec.ts:121` and `tests/grips.spec.ts:138`. Both exceeded the unchanged 30000 ms test timeout on their final reduced-motion Play all click, after their numerical comparisons. The full suite was not restarted. A focused rerun uses the same output and one worker.

```sh
ICON_TEST_PORT=45393 pnpm test tests/chevrons.spec.ts tests/grips.spec.ts -g "all chevrons match|all grips match" --workers=1
```

The focused rerun reported `2 passed (20.9s)` with exit code 0. The chevron comparison took 10.8 seconds and measured at most 0.000015 screen pixels of geometry difference. The grip comparison took 6.8 seconds and measured at most 0.000061 screen pixels of geometry difference and 0.000000 opacity difference. Assertions and timeouts remain unchanged. Every scenario has a passing result, but the complete two-worker command retains the two timeout failures recorded above.

Chrome is the browser under test. Firefox and Safari remain unverified. Numerical checks support manual visual review. Visual acceptance remains with the user.
