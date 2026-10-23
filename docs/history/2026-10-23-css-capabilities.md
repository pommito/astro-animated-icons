# CSS capability migration evidence

This stage extends the integrated finite-chevron implementation at `28dd4ef839954136095d403f880f9bfc4d01b25d`. It addresses [issue #85](https://github.com/pommito/astro-animated-icons/issues/85) under [parent #81](https://github.com/pommito/astro-animated-icons/issues/81). Seven more public icons use CSS, with their existing tags, props and void playback methods. LoaderCircle stays on Motion. Owner visual acceptance of these seven migrations is pending. The branch also integrates promotion correction `b620895ea40923a435845f729e24726b77ca83bb`, published while this stage was running. It fixes CSS availability for independent template clones.

## Candidate queue and decisions

The queue came from the generated inventory and review of the local recipes, their shared implementations and callers. The inventory's direct-import counts describe reuse rather than eligibility.

| Examined family | Decision and reason |
| --- | --- |
| FolderDown, FolderUp, FolderInput, FolderOutput | Migrated through the existing finite transform cycle. Their inner groups have one fixed translation property, explicit offsets, 500 ms entry and return, restart entry and hold completion. |
| CircleHelp | Migrated through the same cycle. The inner group rotates with current-pose replay, 500 ms entry and return, and hold completion. The CSS selector targets only the nested group. |
| CalendarDays and CircleDashed opacity parts | Migrated through a shared opacity adapter and CSS generator. Six rectangles and eight paths retain per-part delays, effective easing, active-track replay and return timing. |
| UserRoundCog | Supported by the finite cycle mechanism but deferred. Its 180-degree group turn needs decomposition, interrupted-return and payload evidence before conversion. |
| KeySquare, Wallet, KeyCircle | Need combined transforms, including independent property offsets for unequal keyframe arrays. They remain on Motion. |
| Eye and Cpu | Need opacity combined with axis-specific scale. Cpu also repeats both tracks. Opacity support alone does not prove these recipes. |
| Snowflake, Key, RefreshCwOff, Phone, PhoneCall, PhoneForwarded, BadgeAlert | Retain Motion because interrupted returns use retained velocity and spring settings. PhoneCall also combines signal tracks. |
| Cart | Retains Motion because its return continues the interrupted y sampler while scale returns independently. |
| WifiSync | Retains Motion because a computed transform matrix loses complete turns. Its -360-degree entry needs an unwrapped return angle. |
| CursorClick | Retains Motion because scalar normal x/y poses inherit spring return defaults from svg-parts. |
| Keyboard and Airplay | Retain Motion. Keyboard samples random delays on each playback; Airplay queues a reveal/transform phase and a return phase. |
| Fixed stroke reveals and other SVG parts | Deferred for source review. Existing reveal mechanisms include live path lengths, sampled stroke properties, property overrides and queued phases. This stage adds no stroke capability without a complete recipe and interruption proof. |

The reviewed decisions are in `scripts/animation-decisions.json`. Each decision pins its complete recipe dependency hash. A changed source moves the entry back to review. The generated inventory currently records 21 migrated recipes, one supported but deferred recipe, five recipes needing another capability, 18 explicit Motion retentions and 359 entries requiring further review. These counts cover all 404 exports. They do not claim that the remaining catalogue has been fully evaluated.

## Mechanisms and references

Each migrated icon keeps one drawing and one maintained recipe data source. The folder and CircleHelp data are in `cycle.ts`. CalendarDays and CircleDashed preserve their previous part expressions in `parts.ts`. Production adapters select CSS through explicit imports. No consumer registry imports the catalogue or both engines.

Fixture-only Motion references use those data and drawings with the previous shared mechanisms. They compare this refactor with the preceding local implementation. They do not execute upstream React components. The [transcription audit](2026-10-23-css-capabilities-transcription.json) records the prior definition hashes and data checks. Initial SVG remains covered by the existing drawing baselines.

Opacity tracks preserve each displayed value before cancellation. Cancellation leaves other targets' animations intact until their own track is stopped. Completion is tracked per target, including immediate replay before queued finish events. Both CSS mechanisms share active-stylesheet reconciliation on connection and before playback. Server sheets have recipe markers. Missing sheets are regenerated from the same data; late server sheets are deduplicated. The existing lifecycle still owns input, controlled mode, reduced motion, playback identifiers, completion ordering, disconnect and reconnection.

Motion mini applies easing to the whole opacity effect. CSS normally applies easing separately between keyframes. The CSS generator splits the cubic Bezier at the original offsets and emits equivalent interval offsets and easing. It runs during server rendering and when a missing stylesheet must be recovered for a template clone. Playback performs no curve sampling. CalendarDays exercises the multi-keyframe case; CircleDashed exercises the default return curve.

## Browser evidence

The [independent-template page](../../tests/fixtures/astro/src/pages/css-capabilities/templates.astro) checks clones of a second template while the first template stays inert, before and after registration. It then mounts the first template and checks deduplication. All 80 checks passed in Chromium 154 after integration.

The [comparison page](../../tests/fixtures/astro/src/pages/css-capabilities/index.astro) was served at `http://127.0.0.1:45333/css-capabilities/` from this isolated worktree. Its controls expose playback comparisons and synthetic lifecycle checks separately from routine validation.

Chromium 154 passed 4,452 assertions across 2,108 pose comparisons and 28 rows at 14, 16, 24 and 28 px. Maximum matrix-component error was 0.0007800000000000029 against a 0.005 tolerance. Opacity error was zero against a 0.001 tolerance. The prior helper samples every 5 ms, while CSS evaluates its easing continuously. The [browser report](2026-10-23-css-capabilities-browser.json) contains the full result.

The probes cover entry, durations and delays, stop, replay, return interruption, completed entry, completed return, queued finish events, one finished opacity track among active tracks, disconnect and reconnection. Another 98 synthetic lifecycle checks passed across all seven icons, including parent mouse input, touch filtering, disabled controls, controlled mode, void methods, preference-change cleanup, template clones and control reassociation.

The report supersedes the pre-template-correction measurements in commit `7f76bea`. CSS generators now reach the browser for missing-sheet recovery, so their delivery cost is included.

These checks establish numerical behavior in this Chromium run. Safari, Firefox, real touch/hybrid hardware, operating-system reduced motion and owner visual review remain unverified. Frame pacing and preparation performance were not measured.

## Page payloads

The [payload report](2026-10-23-css-capabilities-payload.json) measures a production Astro build with Node 22.20.0, pnpm 12.5.1, Astro 7.3.8 and Motion 13.5.1. Each page follows reachable static and dynamic JavaScript imports and counts each chunk once, including CSS. Gzip uses Node zlib defaults per resource. HTML, headers, latency, Brotli and browser caches are excluded. Inline CSS compression is a normalized estimate because deployment compresses it with HTML. Baselines use the fixture-only Motion references; their tags and chunk layout can affect absolute totals.

All values below are bytes. `repeated` renders 20 FolderDown instances. `mixed` adds unchanged LoaderCircle to all seven icons. The family-specific mixed rows add LoaderCircle only to that family. Positive savings reduce payload; negative savings increase it.

| Composition | Motion raw / gzip | CSS raw / gzip | Gzip saved |
| --- | ---: | ---: | ---: |
| folder-down | 26076 / 11872 | 5030 / 2503 | 9369 |
| folder-up | 26071 / 11871 | 5012 / 2500 | 9371 |
| folder-input | 26079 / 11872 | 5040 / 2503 | 9369 |
| folder-output | 26083 / 11875 | 5052 / 2509 | 9366 |
| circle-help | 26094 / 11885 | 5074 / 2516 | 9369 |
| calendar-days | 71645 / 30224 | 12016 / 3659 | 26565 |
| circle-dashed | 71606 / 30207 | 13053 / 3644 | 26563 |
| family | 75087 / 32796 | 26109 / 8019 | 24777 |
| folders | 27875 / 13206 | 8533 / 4327 | 8879 |
| opacity | 72074 / 30561 | 19160 / 4477 | 26084 |
| group | 26094 / 11885 | 5074 / 2516 | 9369 |
| repeated | 26076 / 11872 | 5030 / 2503 | 9369 |
| mixed | 75477 / 33073 | 96104 / 37394 | -4321 |
| folders-mixed | 73964 / 31925 | 78528 / 33702 | -1777 |
| opacity-mixed | 72464 / 30838 | 89155 / 33852 | -3014 |

The complete seven-icon page saves 24,777 gzip bytes in this build. Adding LoaderCircle makes the same CSS page larger than its Motion reference. Savings depend on page composition and cannot be summed across single-icon rows.

## Commands and limits

All shell commands used the required `rtk` prefix. Dependency installation used `rtk pnpm install --frozen-lockfile`. Types were checked with `rtk pnpm check`. Full validation used `rtk proxy sh -c 'pnpm validate > .artifacts/capabilities-validate.log 2>&1'`.

The final `pnpm validate` passed in 91.081 seconds with zero type diagnostics. Its relevant output was:

```text
Verified 404 icons across 811 bundle cases.
Verified 7 CSS parity routes: SVG parity, selective generated CSS, resource reuse, combined chunk unions, managed budget, and unchanged Motion loader.
Verified 16 chevron routes: drawings, selected generated styles, registrations, deduplication, and chunk unions.
Verified 15 capability routes: drawings, selected generated styles, registrations, deduplication, and chunk unions.
Verified 404 production drawings and native controls; 404 public exports have recorded drawing baselines.
tests 41
pass 41
fail 0
Validation: 91.081 seconds
```

The lines above retain the counts from the full log in `.artifacts/capabilities-validate.log`. `git diff --check` also passed. Validation remains browser-free. It checks Astro/TypeScript, all initial drawings and production bundle cases, the existing pilot and chevron routes, fifteen capability compositions and the Node validator tests. New negative tests reject opacity delay drift, return-easing drift, group rotation drift and changed reviewed sources. The existing bundle inspector also checks the new generated opacity sheets. The shared stylesheet tests cover recovery in separate documents, removed sheets and late duplicates.

The inventory was regenerated with `rtk pnpm inventory:animations --summary --output .artifacts/animation-inventory.json`. Payloads were measured with `CAPABILITY_RESULT=docs/history/2026-10-23-css-capabilities-payload.json node scripts/measure-css-capabilities.mjs` through `rtk proxy sh -c`. Browser probes ran only through the comparison page's controls. This stage closed no issue and merged no pull request. Its local branch integrates the already approved promotion correction.
