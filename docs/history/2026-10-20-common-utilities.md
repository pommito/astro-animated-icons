# Common utility icons verification

The batch adds Accessibility, Activity, SquareActivity, CursorClick, CheckCheck, Link2, CalendarDays, CalendarCog, UsersRound, and BotMessageSquare. The implementation starts at `00a7f5189119251da6dc2621391b5dbb27b88fcd` and adapts Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

## Sources and behavior

Each source was read from the pinned archive. The ten React fixtures differ only in their `cn` import. The comparison route is `/common-utilities-comparison/` and uses the original React controls at explicit sizes 14, 16, 24, and 28 px. The reference runner also samples the adapter's Motion SVG `attrD` effect for Accessibility. These JavaScript attribute tracks do not appear in native animation counts.

Accessibility restores the real `initial` variant on manual stop and mouse leave. Upstream manual stop already uses `initial`; upstream mouse leave targets a nonexistent `normal`. The adapter corrects mouse leave to satisfy the package's idle contract. Dedicated tests observe the actual path string after interruption, removal, reconnection, and reduced motion, including a later check for stale writes.

CursorClick's `start("spread", { delay: 1.3 })` replaces the spring declared on its spread variant. Motion 13.5.1 resolves the four-frame translations and seven-frame opacity to 800 ms ease-out keyframes after that delay. The reference keeps that original call. There is no reference compatibility patch. The isolated spring declaration rejects more than two keyframes in development, but the original component's override prevents that declaration from executing as a spring. Tests exercise the original component and check the delayed spread and hidden opacity interval.

UsersRound keeps translation and opacity springs with stiffness 200 and damping 13 after a 100 ms entry delay. SVG parts uses Motion's opacity spring and its existing per-property completion tracking. Native stop resamples wall time. The adapter restores computed opacity after stopping and keeps Motion's estimated velocity. Interrupted replay retains computed opacity. Captured comparisons stop and reset the adapter's opacity value before the final return, matching the reference capture. Completed opacity restarts the source's first keyframe, even while translation remains active. The matching-array guard for keyframe offsets remains unchanged.

Activity and SquareActivity share their reveal recipe under `shared/activity.ts`. CalendarCog uses the existing cog recipe. The remaining variants, origins, keyframes, delays, and repetitions stay local to their recipes. BotMessageSquare retains its hidden idle dots and its infinite opacity tracks.

Captured returns reset velocity before measurement. The comparison checks geometry, computed opacity, and normalized stroke dashes. Real interrupted spring velocity parity remains unmeasured. Numerical evidence supports the user's manual visual acceptance.

## Environment and review

All browser runs use `ICON_TEST_PORT=45401` and at most two workers. Focused reruns use one worker. The managed worktree tool failed its ref lookup against the stale saved project path. A Git worktree was created from the actual repository at `/Users/victor/Developer/products/astro-animated-icons`, under `/private/tmp/astro-common-utilities-20261020-a1`, on `feat/common-utilities-icons`. The shared main checkout was not edited.

The first red test received HTTP 404 for the missing Accessibility route. Early comparison failures identified the CursorClick transition override and the need to capture actual SVG attributes and native spring opacity. A later fixture startup exceeded Playwright's existing 60-second server timeout under contention. The timeout was not changed. The stopped build's lock was removed after its PID no longer existed. Later cached fixture starts also exceeded that deadline. A temporary pnpm 12.5.1 runtime under `/private/tmp/astro-common-pnpm-runtime` avoids the shared launcher's incomplete native installation. Node 22.20.0 and a temporary Node compilation cache keep the repository configuration unchanged.

Independent Standards and Spec agents reviewed the diff and new files. Spec reported no confirmed discrepancy. Standards suggested removing repeated CalendarDays and CursorClick configurations. Local maps replaced those configurations. Both agents then reviewed the native opacity stop and capture corrections without a new finding. Standards also confirmed that restoring the inspector's canonical first case preserves every CSS assertion. The agents did not run competing browser suites.

## Validation results

`ICON_TEST_PORT=45401 pnpm validate --workers=2` ran once. Package checking covered 1,181 files and fixture checking covered 1,573 files, each with zero errors, warnings, or hints. TypeScript also passed. The forced production build generated 1,177 pages. Bundle inspection verified selective loading, shared CSS, and the absence of React from production across 374 icons and 751 cases.

The full command stopped at the bundle inspector's negative CSS test. The new single routes had displaced `arrow-left: "single"` as its canonical first case, changing which error the negative test observed. Restoring that order fixed the failure. `pnpm test:bundle` then passed all five tests with the assertions unchanged. `pnpm test:fixture` passed all three cache tests on the retained matching build. The remaining Chrome stage continued separately, without another forced build.

The focused batch run passed 145 of 147 tests. Both failures came from seeking UsersRound's native opacity track before Motion's asynchronous keyframe resolver created it. The tests now wait two animation frames and assert that exactly one opacity track exists before finishing it. The opacity assertions remain unchanged. Four additional tests check resolved opacity continuity on stop and replay at 150 and 350 ms. `pnpm test tests/common-utilities.spec.ts --grep UsersRound --workers=1` passed all 18 matching tests. `pnpm exec tsc --noEmit` also passed after these test changes.

The five source comparisons passed across all ten icons at 14, 16, 24, and 28 px. Entry and captured returns sample 22 times through 2,600 ms. The observed maximum differences were:

| Comparison | Geometry, px | Paint |
| --- | ---: | ---: |
| Entry | 0.000031 | 0.000275 |
| Captured return at 150 ms | 0.000732 | 0.000271 |
| Captured return at 450 ms | 0.002373 | 0.000121 |
| Captured return at 1,450 ms | 0.000031 | 0.000000 |
| Captured return at 1,800 ms | 0.000031 | 0.000000 |

The focused run also passed no-JavaScript drawings and native links, stop phases at 50, 250, 450, 950, 1,450, and 1,800 ms, independent hover, entry and return replay, removal, and reduced motion. Accessibility's 16 morph cancellation cases check the actual `d` attribute, later stale writes, and reconnection.

The complete Chrome continuation used `pnpm test --workers=2` and selected 3,273 tests. Its log recorded 166 passes and 11 failures before I interrupted it as failures and long test durations accumulated. Ten failures exceeded the existing 30-second test deadline. Bot's reduced-motion test instead observed `stroke-dasharray: none` while expecting the paused blink's `0px, 4px`. Another complete Chrome suite was running in a separate worktree. Contention is a plausible explanation, not an established cause.

I reran those exact 11 failed titles in `tests/audio-lines.spec.ts`, `tests/bookmarks-status.spec.ts`, `tests/bot.spec.ts`, and `tests/chart-icons.spec.ts`, using `--grep` and `--workers=1`. All 11 passed in 3.5 minutes. Code, assertions, and repository timeouts were unchanged between those runs. The interrupted suite's server was stopped after its PID and working directory were confirmed. The complete catalog remains unverified by this batch; neither the original `pnpm validate` command nor its Chrome continuation passed as a whole.

Chrome 154.0.8037.98 is the browser used by the repository configuration. Firefox and Safari are not checked by this batch. The shared playback API and dependency versions are unchanged. No pull request is published, and the worktree remains available for review.
