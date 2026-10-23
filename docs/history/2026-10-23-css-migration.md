# Integrated CSS migration verification

The integrated implementation passes browser-free validation for 404 public icons. The 21 CSS recipes have comparison coverage and 31 generated payload compositions. Chromium numerical probes passed. Visual acceptance of the 19 later migrations remains pending.

This stage starts from capability commit `e4fa797a5b11ad06e1609469f75088b4ad00f063`. Promotion `b620895`, inventory `d6daa02`, and chevrons `28dd4ef` are ancestors. The pilot patch was not reapplied. No animation implementation, public export, dependency, or drawing changed in this stage. LoaderCircle keeps Motion.

## Validation changes

[scripts/css-migration-catalogue.mjs](../../scripts/css-migration-catalogue.mjs) generates [the fixture manifest](../../tests/helpers/css-migration-cases.json) from the current export inventory and compiler data. It records each recipe's finish and replay policies. The opacity compiler discovery now reads exported definitions instead of a fixed two-icon list.

The new browser-free validator checks that the manifest matches current recipes and that each migrated icon appears in a comparison page. Its generated consumer pages render every single icon, the chevron, folder and opacity families, all 21 icons, three instances of each icon, and mixtures with ArrowLeft or LoaderCircle. A four-icon interface case uses Bell, ChevronRight, FolderDown and CalendarDays. An empty case imports the catalogue without rendering it.

For each route, validation checks the drawing count and exact initial SVG against the Motion reference. It checks generated CSS against the compiler, active stylesheet markers, stylesheet deduplication, registrations, script entries, absence of fixture references in consumer scripts, and exact unions of single-route chunks. The empty route has no scripts or recipe CSS. Astro still collects the common wrapper CSS, 124 raw bytes including its trailing newline.

Eight added Node tests include seven deliberate failures. They reject an incomplete manifest, missing transform or opacity sheet markers, a repeated opacity sheet among repeated mixed families, recipe CSS on the empty route, a missing selected drawing, and equal-content chunks served at different URLs in the combined route. Earlier negative tests still cover generated timing, drawing geometry, registrations, unused recipes, and fixture freshness.

## Commands and results

Commands ran in this stage's isolated worktree. Every shell command used the owner's RTK prefix.

```sh
rtk pnpm install --offline --frozen-lockfile
rtk node scripts/css-migration-catalogue.mjs --write
rtk node --test scripts/check-css-migration.test.mjs
rtk pnpm validate
rtk proxy env MIGRATION_RESULT=docs/history/2026-10-23-css-migration-payloads.json node scripts/measure-css-migration.mjs
rtk proxy env ICON_TEST_PORT=45334 pnpm fixture:serve
rtk git diff --check
```

The initial online install failed because DNS was unavailable in the sandbox. The frozen offline install succeeded. An initial validation run rejected an overly strict new empty-route expectation. The corrected expectation permits Astro's documented common CSS while rejecting generated recipe styles.

The final `pnpm validate` completed in 106.099 seconds. Both Astro diagnostic summaries had zero errors, warnings and hints. It verified 404 drawings, 811 production bundle cases, seven pilot routes, 16 chevron routes, 15 capability routes, and 31 integrated compositions. All 49 Node tests passed. This command launched no browser. The [validation excerpt](2026-10-23-css-migration-validation.txt) records the relevant output.

## Browser evidence

Separate production probes ran in Chromium 154 on this host. The [browser JSON](2026-10-23-css-migration-browser.json) preserves the results.

| Comparison | Assertions | Pose comparisons | Maximum measured error |
| --- | ---: | ---: | --- |
| Bell and ChevronRight pilot | 592 | 496 | Bell 0.0139843972 degrees, translation 0 |
| 13 finite chevrons | 4836 | 3276 | Translation 0 |
| Seven capability migrations | 4452 | 2108 | Matrix 0.00078, opacity 0 |

All 9880 assertions passed across 5880 pose comparisons at 14, 16, 24 and 28 px. The pilot allows Bell 0.03 degrees because its Motion reference samples easing while CSS evaluates it continuously. Translation and matrix tolerance is 0.005; opacity tolerance is 0.001.

The runners exercise entry, interrupted stop and replay, stop and replay during return, completed entry and return, queued old completion after replay, disconnect and reconnection. Opacity cases also replay while some delayed tracks have completed. The [chevron](2026-10-23-css-chevrons.md) and [capability](2026-10-23-css-capabilities.md) stage reports preserve their source transcription evidence. The references share the maintained recipe data and use the earlier Motion mechanisms. These probes compare engines; they cannot detect a wrong recipe value shared by both implementations.

The lifecycle controls passed 294 boolean checks using synthetic pointer events and a temporary matchMedia stub. They cover parent hover, touch filtering, disabled controls, controlled mode, void method returns, cleanup, changed containing controls, reconnection and clones. Independent template pages passed 105 checks across the pilot pair and capability migrations, including cloning before and after registration and mounting the first template late without duplicate active sheets.

The new `/css-migration/media/` probe passed 168 boolean checks for all 21 recipes using native matchMedia and Chrome DevTools media emulation. It paused 33 native animation tracks at 125 ms before changing the preference. Reduced motion canceled every track and cleared retained poses and state. Manual playback stayed static. Restoring no preference allowed replay. This was browser media emulation, not an operating-system preference change.

To reproduce the browser checks, serve the production fixture on an unused port and open `/css-pilot/`, `/css-chevrons/`, and `/css-capabilities/`. Run each playback and lifecycle control and inspect its JSON output. Run `Check independent templates` on `/css-pilot/templates/` and `/css-capabilities/templates/`. On `/css-migration/media/`, disable reduced motion, select `Prepare paused entry`, enable reduced motion in DevTools, select `Check reduced motion`, disable reduced motion again, then select `Check restored playback`.

## Whole-page payloads

The [payload JSON](2026-10-23-css-migration-payloads.json) contains raw and gzip JavaScript, CSS, HTML and complete page totals for all 31 compositions. The production build used Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1 and TypeScript 6.0.3 on Darwin 27 arm64, Apple M1 Pro.

The baseline uses fixture-only Motion references with the same drawing and recipe data. Both sides use the integrated lifecycle. This isolates the engine choice; it is not a rebuild of the original baseline commit.

Each route counts reachable static and literal dynamic JavaScript imports once per chunk URL. External CSS URLs count once. Gzip uses Node zlib defaults per resource with a cold cache. The JavaScript plus CSS total compresses inline styles independently as a normalized estimate. The whole-page total compresses actual HTML once, with its inline styles and scripts, then adds external JavaScript and CSS resources. It does not count inline content twice. These figures exclude HTTP headers, latency, Brotli and warm caches.

All values below are bytes. Positive savings mean the public implementation is smaller. The `repeated` case renders 63 icons. The `all` case renders 21 icons.

| Composition | Motion JS+CSS raw / gzip | Public JS+CSS raw / gzip | JS+CSS gzip saved | Whole-page gzip Motion / public | Whole-page gzip saved |
| --- | ---: | ---: | ---: | ---: | ---: |
| bell | 26432 / 12139 | 5019 / 2515 | 9624 | 12521 / 2861 | 9660 |
| chevron-right | 11264 / 5308 | 5041 / 2500 | 2808 | 5659 / 2807 | 2852 |
| calendar-days | 71645 / 30224 | 12016 / 3659 | 26565 | 30722 / 4131 | 26591 |
| folders | 27875 / 13206 | 8533 / 4327 | 8879 | 13863 / 4245 | 9618 |
| chevrons | 17353 / 9856 | 19634 / 9876 | -20 | 10664 / 7797 | 2867 |
| opacity | 72074 / 30561 | 19160 / 4477 | 26084 | 31243 / 4945 | 26298 |
| all | 83083 / 38729 | 43028 / 16618 | 22111 | 40305 / 13663 | 26642 |
| repeated | 83083 / 38729 | 43028 / 16618 | 22111 | 40586 / 14094 | 26492 |
| mixed-loader | 83473 / 39006 | 113023 / 45993 | -6987 | 40645 / 43105 | -2460 |
| mixed-arrow | 84046 / 39353 | 52730 / 21104 | 18249 | 40979 / 18206 | 22773 |
| interface | 74150 / 32053 | 16581 / 5980 | 26073 | 32825 / 6153 | 26672 |
| interface-loader | 74540 / 32330 | 86576 / 35355 | -3025 | 33168 / 35596 | -2428 |

All 21 icons save 22111 normalized JavaScript plus CSS gzip bytes, or 26642 whole-page gzip bytes. Repeating each icon three times leaves the JavaScript and CSS totals unchanged. HTML grows, and whole-page compression changes slightly.

The chevron family costs 20 additional normalized gzip bytes in this integrated build, although whole-page compression saves 2867 bytes because the generated inline styles compress together. Adding LoaderCircle to all migrated icons costs 6987 normalized gzip bytes and 2460 whole-page gzip bytes. Adding LoaderCircle to the four-icon interface costs 3025 normalized gzip bytes and 2428 whole-page gzip bytes. Shared Motion resources make single-icon savings non-additive.

## Limits and acceptance

This stage did not run Safari, Firefox, physical pointer input, real touch or hybrid hardware, or an operating-system media preference change. It measured no animation preparation interval, frame pacing or compositor cost. Smaller payloads do not establish smoother frames.

The promotion result records the owner's earlier visual acceptance of Bell and ChevronRight. That acceptance does not extend to the 19 later migrations. This stage adds no visual approval, merge, issue closure or public release. The worktree and preview remain available for documentation integration and manual review. The acceptance index is `/css-migration/` on port 45334.
