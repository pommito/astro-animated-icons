# Finite chevron CSS verification, 2026-10-23

All 13 finite chevrons now use CSS through their existing public imports, tags, props, and playback handles. This stage adds 12 conversions to the promoted ChevronRight. Bell remains on CSS. The four paired chevron springs and LoaderCircle keep their Motion recipes.

The work starts at inventory commit d6daa02cf55dcc9de266839b41b6ffb49f40f100, which already includes promotion commit 28d3e5dbea1f0ec4a8dca59ff1cf7ee5fcbd628e. It does not reapply the pilot patch. The original checkout and pilot worktree remain source context.

## Recipe preservation

The public finite-cycle type now accepts translateY, an optional returnDuration, and an optional returnEase. The CSS compiler uses those values on the return rule. Shared playback and lifecycle code remain unchanged. Every finite chevron targets its first data-chevron path. Circles, rectangles, and ChevronFirst's second path stay static.

The ordinary cycles retain values [0, 2, 0] or [0, -2, 0], offsets [0, 0.4, 1], a 500 ms duration, and easeOut. ChevronFirst retains values [-2, 1, -1, 0], offsets [0, 0.3, 0.7, 1], a 600 ms entry with easeInOut, and a 300 ms return with easeOut. Entry restarts at the first explicit value, including -2 for ChevronFirst. Return captures the current rendered pose. Completion restores the drawing.

Each production cycle.ts supplies both generated CSS and its fixture-only Motion reference. The reference runs the unchanged previous animateChevronCycle mechanism; it does not execute the upstream React component. The [transcription record](2026-10-23-css-chevrons-transcription.json) checks all 12 extracted cycles and their exact drawing markup against the prerequisite commit. Existing drawing baselines and public exports were not changed.

ChevronsDownUp, ChevronsLeftRight, ChevronsRightLeft, and ChevronsUpDown keep Motion. Their spring mechanism samples both interrupted position and velocity, then passes velocity into the next spring. Finite keyframes do not reproduce that contract. No other finite chevron is deferred.

## Commands and browser-free checks

Commands executed in the isolated css-chevrons worktree include:

```sh
rtk pnpm install --frozen-lockfile --offline
rtk pnpm check
rtk pnpm fixture:prepare
rtk proxy node scripts/inspect-bundle.mjs
rtk proxy node scripts/check-css-chevrons.mjs
rtk proxy node --test scripts/check-css-chevrons.test.mjs
rtk pnpm inventory:animations --summary --output .artifacts/animation-inventory.json
rtk proxy env CHEVRON_RESULT=docs/history/2026-10-23-css-chevrons-payload.json node scripts/measure-css-chevrons.mjs
rtk proxy env ICON_TEST_PORT=45332 pnpm fixture:serve
rtk pnpm validate
rtk git diff --check
```

The frozen offline installation passed with Node 22.20.0 and pnpm 12.5.1. Astro 7.3.8 and Motion 13.5.1 come from the lockfile. The standalone type check reported zero errors, warnings, and hints. The production build completed with 1318 pages. Existing React comparison sources still produce Vite warnings about their use client directives.

pnpm validate passed in 69.057 seconds. It verified types, 404 initial drawings, 811 catalogue bundle cases, seven pilot parity routes, 16 chevron compositions, and 30 Node tests. Routine validation launched no browser. Its full log is .artifacts/chevrons-validate.log in the isolated worktree.

The bundle inspector discovers cycle data through the exported catalogue instead of keeping a fixed Bell/ChevronRight list. It verifies selected generated styles on all existing routes. The new checker covers 13 single icons, all 13 together, 20 repeated ChevronDown instances, and the family with LoaderCircle. It compares complete initial SVG with the Motion fixtures and checks registrations, generated CSS agreement, style deduplication, absence of React, and exact single-route chunk unions. Five focused tests pass, including negative cases for vertical-axis drift, independent return-duration drift, unused CSS, and repeated styles. The inventory confirms 14 CSS recipes, four retained chevron springs, and the retained Motion LoaderCircle. Remaining review entries are outside this stage.

## Browser comparisons

The production /css-chevrons/ fixture ran in Chromium 154 on macOS through the Chrome DevTools connector. At 14, 16, 24, and 28 px, 4836 assertions passed across 3276 pose comparisons. Maximum matrix error was zero against a tolerance of 0.005 viewBox units. The runner checks both translation axes and the static frame and path transforms.

The runner pauses native animations at explicit times. It checks entry, interrupted stop, interrupted replay, stop during return, replay during return, entry and return completion, replay after completion, queued old completion, disconnect cleanup, and replay after reconnection. It also checks entry and return durations and verifies that completion removes animation state, retained inline transforms, and the captured-pose variable.

All 182 synthetic lifecycle probes passed across the 13 cycles. They cover parent triggering, touch filtering, disabled and controlled mode, void handle results, preference-change cleanup, reduced manual playback, reconnection to a new parent, and template clones. These probes dispatch events and temporarily replace matchMedia. They do not establish real touch or operating-system reduced-motion behavior. The [browser JSON](2026-10-23-css-chevrons-browser.json) records each result.

The existing /css-pilot/ comparison also passed after the compiler change. Its 592 assertions cover 496 Bell/ChevronRight pose comparisons. Bell rotation error remained 0.0139843972 degrees against the 0.03 degree tolerance; ChevronRight translation error remained zero.

## Whole-page payloads

All rows use the same production build. Baseline routes render fixture-only Motion references with distinct tags. Managed routes render the public exports. The measurement follows reachable static and dynamic JavaScript imports and counts each chunk once per route. It includes JavaScript and CSS. Node zlib defaults gzip each resource separately. HTML, headers, request latency, Brotli, and browser caches are excluded. Inline CSS gzip is a normalized estimate because deployment compresses it with HTML. Reference tag lengths and chunk boundaries affect the absolute byte counts.

| Route | Motion raw / gzip bytes | Public CSS raw / gzip bytes | Gzip bytes saved |
| --- | ---: | ---: | ---: |
| chevron-down | 11243 / 5302 | 3697 / 1805 | 3497 |
| chevron-first | 11294 / 5327 | 3790 / 1847 | 3480 |
| chevron-left | 11244 / 5304 | 3699 / 1805 | 3499 |
| chevron-right | 11246 / 5303 | 3707 / 1806 | 3497 |
| chevron-up | 11238 / 5301 | 3679 / 1800 | 3501 |
| circle-chevron-down | 11274 / 5314 | 3767 / 1818 | 3496 |
| circle-chevron-left | 11275 / 5313 | 3769 / 1816 | 3497 |
| circle-chevron-right | 11277 / 5312 | 3777 / 1818 | 3494 |
| circle-chevron-up | 11269 / 5308 | 3749 / 1811 | 3497 |
| square-chevron-down | 11274 / 5313 | 3767 / 1818 | 3495 |
| square-chevron-left | 11275 / 5314 | 3769 / 1821 | 3493 |
| square-chevron-right | 11277 / 5315 | 3777 / 1821 | 3494 |
| square-chevron-up | 11269 / 5312 | 3749 / 1816 | 3496 |
| family | 17335 / 9878 | 18300 / 9214 | 664 |
| repeated | 11243 / 5302 | 3697 / 1805 | 3497 |
| mixed | 78591 / 35392 | 88295 / 38590 | -3198 |

The [payload JSON](2026-10-23-css-chevrons-payload.json) records separate JavaScript and CSS totals and lists each chunk. A single ChevronDown saves 3497 gzip bytes. Repeating it 20 times leaves that resource cost unchanged. The full family saves 664 gzip bytes while adding 965 raw bytes. Adding LoaderCircle makes the CSS family cost 3198 more gzip bytes and 9704 more raw bytes than the Motion reference family. Per-icon savings do not add across a page, and payload changes do not establish smoother animation.

Safari, Firefox, real touch/hybrid hardware, operating-system reduced motion, frame pacing, and owner visual acceptance remain pending. No issue was closed and no branch was merged.
