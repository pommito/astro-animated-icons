# Food and plant icon verification

This batch adds Banana, Coffee, CookingPot, CupSoda, Soup, LeafyGreen, Leaf, TreeDeciduous, TreePine, and FishSymbol from Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

The isolated checkout is `/private/tmp/astro-food-plants-20261020-45404` on `feat/food-plants-icons`. Its base is `00a7f5189119251da6dc2621391b5dbb27b88fcd`. The repository moved to `/Users/victor/Developer/products/astro-animated-icons`. The app's managed worktree call failed with `Git ref lookup failed`, so this batch used a normal Git worktree from the actual repository path. The shared checkout was not edited.

## Implementation and comparison

Each icon has its own Astro adapter, recipe, Web Component registration, public component and handle exports, consumer fixture, and single-icon and combined bundle routes. Coffee and Soup share a steam recipe. Leaf and LeafyGreen share Feather's drift recipe. Existing SVG-parts handles separate transform and paint tracks, implicit spring returns, finite-track completion, and interrupted replay.

CupSoda's bubbles start hidden in server-rendered SVG and return to that state after cleanup. Its SVG retains viewport clipping through an internal `Icon.astro` option. That option does not change the public icon props. Existing consumer routes retain shared CSS.

The comparison route is `http://127.0.0.1:45404/food-plants-comparison/`. It executes the ten original pinned React components at 14, 16, 24, and 28 px with the existing reference runner. The source copies redirect their class utility import. Soup's fixed dimensions use the supplied size in the fixture. The adapter honors the package's size contract. CookingPot follows the fill-box centers Motion actually applies rather than the group origins declared in the source.

The browser suite compares entry and captured returns interrupted at 150, 700, and 1600 ms. Samples include steam delays, bubble delays, straw completion, wave motion, and either side of repeat boundaries. Separate assertions check full transparency at the exact steam and bubble repeat boundaries. The JavaScript reference and native adapter choose different transform endpoints at those fully transparent instants. Captured returns reset spring velocity. The measurements do not establish real interrupted spring velocity parity. Numerical evidence supports the user's manual visual review.

## Validation evidence

All browser commands use `ICON_TEST_PORT=45404` and at most two workers. Chrome is the checked browser. Safari and Firefox remain unverified.

The initial test-first Coffee scenario requested `/coffee/` before implementation. It failed with expected status 200 and observed status 404. After implementing Coffee, the same test passed. It checks the cup's four paths, six infinite native tracks, and delays of 0, 40, and 80 ms.

The first comparison found CookingPot's origin mismatch. Inspection of the executing React groups showed `transform-origin: 50% 50%` and `transform-box: fill-box`. The adapter now uses those actual origins. Separate measurements identified the fully transparent loop-boundary endpoint difference, which the comparison documents and tests through opacity at the boundary and geometry on either side.

The shell's pnpm launcher initially worked, then pointed to an incomplete global shim. Commands use the existing Homebrew pnpm 12.5.1 with Node 22.20.0 through a local `PATH` override. No global configuration was changed. Two fixture startups exceeded the existing 60000 ms server timeout under machine contention. A subsequent run found an abandoned lock. The recorded PID no longer existed, so the stale lock was removed before retrying with one worker. Separate preparation attempts made little progress under memory pressure. They were stopped using their recorded fixture processes and child builds. Later commands use local `NODE_OPTIONS=--max-old-space-size=1024` and `RAYON_NUM_THREADS=2` settings. A redundant typecheck was stopped to reduce competing memory use. Assertions and repository timeouts were not changed.

A read-only archive check verified all ten copied references byte-for-byte after the documented import and Soup dimension substitutions. Every adapter's path data matched the pinned source. The observed result was `10 pinned references and all adapter paths match the archive with documented compatibility changes only.`

Independent Standards and Spec agents reviewed `00a7f518...0309cc5`. Both reported no actionable findings. The Standards review checked the repository rules, documented module boundaries, actual reuse, and baseline code smells. The Spec review checked the assigned sources, transitions, fixtures, exports, and compatibility adjustments against the delegated requirements. Neither review ran tests.

The complete validation command was invoked with the assigned port and two workers:

```sh
rtk proxy env ICON_TEST_PORT=45404 PATH=/Users/victor/.nvm/versions/node/v22.20.0/bin:/opt/homebrew/bin:/usr/bin:/bin NODE_OPTIONS=--max-old-space-size=1024 RAYON_NUM_THREADS=2 pnpm validate --workers=2
```

The type checks passed with zero errors, warnings, and hints in both Astro checks, followed by TypeScript. The forced production build passed. Bundle inspection reported `Verified 374 icons across 751 bundle cases.` This checks shared CSS, unused registrations, absence of React, and exact combined chunk unions.

The inspector's negative suite initially reported four passes and one failure. Its CSS-baseline test expected `single: icon-specific CSS for check must not load`, but observed `banana-single: shared CSS`. The new routes had preceded the established `single` baseline in the case list. Keeping `arrow-left: single` first restores the intended assertion order. Negative assertions remain unchanged. Validation resumes at that failed phase using the same built output.

After correcting the baseline order, `pnpm test:bundle` reported five passes and zero failures. `pnpm test:fixture` reported three passes and zero failures. Its output confirmed `Reusing fixture: sources and output match.` The checks preserve rejection of changed inputs, altered output, extra registrations, missing registrations, and incorrect CSS.

The first focused browser retry reused the build but exceeded the unchanged 60000 ms server-start deadline before running any scenarios. A standalone server then loaded successfully with `NODE_COMPILE_CACHE=/private/tmp/food-plants-node-cache`. It used port 45404 and the same production output. After the measurements below, it stopped cleanly so Playwright could start its own server.

Direct Chrome measurements used the existing `sampleUpstreamPoses` and `compareUpstreamPoses` helpers on the running comparison route. All four entry and captured-return assertions passed:

| Playback | Maximum geometry difference in screen pixels | Maximum normalized paint difference |
| --- | --- | --- |
| Entry | 0.000015259 | 0.000338 |
| Captured return from 150 ms | 0.005981445 | 0.000338 |
| Captured return from 700 ms | 0.007202148 | 0 |
| Captured return from 1600 ms | 0.009887695 | 0 |

The unchanged comparison tolerances are 0.03 pixels for geometry and 0.005 for normalized paint. Samples cover all ten components at all four sizes.

A second Standards and Spec review checked the incremental baseline-order fix, detached opacity assertion, and formatting changes. Both reported no actionable findings.

The focused suite reported 132 passes and one failure in 2.0 minutes. The failure came from an exact-zero assumption in the new repeat-boundary test. At 2200 ms, Chrome computes opacity `9.83709e-31` for CupSoda's third bubble in both the original component and the adapter. The test now requires exact equality between the two renderers and closeness to zero at 12 decimal places. A focused rerun reported `1 passed (6.8s)`. This preserves the invisibility check and adds exact source parity. Both Standards and Spec reviews approved that adjustment. No production behavior or existing shared assertions changed.

The 133 focused scenarios therefore have passing results across the initial run and that corrected-case rerun. They cover complete no-JavaScript drawings and native links, hover and instance isolation, six interruption phases, stop continuity, entry and return replay, removal and reduced-motion cleanup, loop reconnection, finite-track replay alongside loops, delayed bubble visibility, and all four pinned comparisons. A final `pnpm exec tsc --noEmit` passed after the test adjustment.

The complete Chrome suite was started once with `pnpm test --workers=2`, the assigned port, the same Node and build settings, and the local Node compile cache. It selected 3255 scenarios and reused the existing output.

After 15.3 minutes, 236 scenarios had passed and 12 had exceeded the unchanged 30000 ms deadline. Error traces showed timeouts during hover, element lookup, and browser waits on existing icons. I interrupted that run to reduce concurrent browser work. Two scenarios were interrupted and 3005 had not run. Playwright saved 3017 failed or unstarted cases, which resumed with `pnpm test --last-failed --workers=1`. The two interrupted scenarios require a separate targeted run because Playwright excludes them from its saved list.

The coordinator then requested a queue for final validation across all four batches. I stopped only this batch's runner with SIGINT. The one-worker run ended after 14.2 minutes with 131 passes, two failures, one interrupted scenario, and 2883 unstarted scenarios.

One failure was a 30000 ms navigation timeout on CircleChevronDown. The other was the existing chart comparison, which observed an opacity difference of 1 at 0 ms for ChartBarDecreasing at 14 px. Neither has been classified as a code regression or a transient failure yet.

The saved resume list now contains 2885 cases. Three interrupted scenarios need separate targeted runs: Ban at 50 ms, ChartNoAxesColumnIncreasing at 100 ms, and CircleChevronUp stop cleanup. Across the two runs, 367 distinct scenarios passed. No batch browser, build, or fixture-server process remains, and the fixture lock is gone. Logs and both resume lists remain under `/private/tmp/food-plants-*`. Full validation remains pending until the coordinator grants this batch its exclusive turn. No further browser, build, or server command will start before that grant.
