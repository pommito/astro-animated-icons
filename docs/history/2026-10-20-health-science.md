# Health and science icon verification

The batch adds Ambulance, Stethoscope, Syringe, Thermometer, Brain, Atom, Flask, Telescope, CircleGauge, and Gauge on `feat/health-science-icons`, based on `00a7f5189119251da6dc2621391b5dbb27b88fcd`.

Drawings and recipes use Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`. All ten original files were read from the pinned archive. The comparison runs their React components at 14, 16, 24, and 28 px. Copies redirect the class utility import. Telescope also initializes its declared 12px 13px origin and uses view-box coordinates, because Motion otherwise replaces the origin with the group center. Its angles and durations remain unchanged.

Syringe and Flask keep their filled 512-unit drawings through a local 512-unit viewport. Syringe keeps the source stroke width and moves the whole SVG in screen pixels. Flask suppresses the inherited stroke and retains source-space bubble translation and separate body rotation and spring scale. No common props, SVG defaults, or dependencies change.

Ambulance shares the vehicle mechanism with Truck and Car. Its cross blinks independently. Brain retains its 1400 ms scale, stroke-width, path-length, and path-offset cycles. Atom keeps its entry and return delays. Stethoscope keeps its element-specific reveal schedule.

## Replay and reference mechanisms

Interrupted infinite replays use the existing cancellable sequence. A finite cycle bridges the current pose, then the original infinite cycle resumes. The vehicle helper handles body, wheels, and speed lines. SVG-parts handles Brain, the cross, and the existing BicepsFlexed recipe. This prevents a captured first keyframe from changing every later loop. Stop, removal, and reduced motion invalidate the pending loop.

The comparison return capture is shared with the hands and gestures fixture through `captured-reference.ts`. It preserves the existing capture order and clamps paused JavaScript spring seeks to their actual completion time. Captured returns reset velocity. Actual interrupted spring velocity parity remains unmeasured.

Samples avoid exact Ambulance speed-line repeat boundaries. At those instants the native adapter starts its next iteration while the upstream JavaScript sampler reports its previous endpoint. Both versions have zero line opacity. Geometry and paint tolerances remain 0.03 screen pixels and 0.005. Paint measurements include normalized path length and offset, opacity, and stroke width in SVG units.

## Validation

All browser commands use `ICON_TEST_PORT=45403` and at most two workers. Focused reruns use one worker when the host is under contention. The original repository path had moved, so the managed worktree tool could not resolve the base. A normal Git worktree was created from the actual repository under `/private/tmp`. The shared main checkout was not edited.

The first Flask test failed against the missing route, then passed after the adapter and independent timelines were implemented. A subsequent focused comparison run reported `26 passed` and six failures. Those failures identified the vehicle replay reset, exact hidden speed-line repeat boundaries, and incorrect test expectations for the fixture's 16 px primary icon. The implementation and measurement corrections preserve the repository's assertions and timeouts.

After the shared replay changes, `pnpm check` passed. Astro reported 1180 package files and 1574 fixture files with zero errors, warnings, or hints. TypeScript also passed.

The production fixture build completed 1177 pages. Build times ranged from 13 seconds to 12 minutes 12 seconds under host contention. A server-start timeout left a stale fixture lock, which was removed only after its recorded process had stopped. The occupied-port check correctly rejected an orphaned server; only the identified server from this worktree was stopped.

`pnpm inspect:bundle` verified 374 icons across 751 bundle cases. All five negative inspector tests and all three fixture cache tests passed. The first complete validation attempt stopped at the negative inspector test because adding new routes before the baseline changed its first reported diagnostic. Restoring the baseline route order resolved the failure without changing the test or bundle rules.

The focused Health and science and Transport and routes run reported 276 passed and two timeouts across 278 tests. The timeouts occurred during Brain page navigation and a final wait after its cleanup assertion had passed. Two subsequent one-worker attempts stopped at the 60-second server startup timeout before running tests. Assertions, test timeouts, and Playwright configuration remain unchanged.

All ten reference comparisons passed at all four sizes. Entry samples measured maximum geometry error of 0.000122 px and paint error of 0.000355. Captured returns at 150, 450, 1700, and 3505 ms measured maximum geometry error of 0.001381 px and paint error of 0.000338. Existing Transport and routes comparisons also passed, with maximum geometry error of 0.024170 px.

Independent Standards and Spec reviews found a duplicated comparison runner, a missing explicit Telescope reference origin, and incomplete vehicle replay handling. The shared runner, origin compatibility, and finite replay cycle resolve those findings. Both final static reviews report no open findings. The strengthened cycle tests also require an active infinite animation and an evolving intermediate pose before checking original endpoints.

The final `ICON_TEST_PORT=45403 pnpm validate --workers=2` attempt passed both Astro checks, TypeScript, a fresh 1177-page build in 14.53 seconds, and all 751 positive bundle cases. The coordinator requested serialized validation after concurrent browser runs exhausted memory. This attempt received SIGINT during the negative inspector tests, before the fixture cache and browser stages. Its log remains at `/private/tmp/health-science-validate-final.log`. The validation session has stopped, the fixture lock is absent, and port 45403 has no listener. Complete validation awaits the coordinator's exclusive turn.

## Manual review

Run `ICON_TEST_PORT=45403 pnpm test:serve` and open `/health-science-comparison/`. Check all four sizes, hover and manual playback, and the individual fixture routes linked from the comparison. Numerical evidence supports manual visual review. Visual acceptance remains with the user. Chrome is the browser under test. Firefox and Safari are unverified.
