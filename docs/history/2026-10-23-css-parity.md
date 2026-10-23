# CSS playback parity follow-up

This continues the [initial CSS pilot](2026-10-23-css-pilot.md). Bell and ChevronRight now use shared recipe data in the Motion reference and generated CSS. LoaderCircle keeps its existing Motion recipe. The public barrel still exports the Motion adapters. The CSS versions remain experimental imports under src/experimental/css-pilot/astro.ts.

## Result and recommendation

Continue with an opt-in CSS implementation for finite transform cycles. Bell and ChevronRight together use 2403 bytes gzip of JavaScript and CSS, compared with 12801 bytes for the Motion reference in the same production build. The saving is 10398 bytes, about 81 percent. Keeping the public input and interruption behavior requires a small client adapter.

Page composition determines the result. With LoaderCircle on the same page, the CSS pair adds 258 bytes gzip to the all-Motion baseline. LoaderCircle already loads the full transform machinery that Bell would otherwise require. Replacing Bell then saves little shared runtime and adds generated CSS and a second playback mechanism. On the ArrowLeft mixed page, which loads a smaller Motion mechanism, replacing Bell still saves 6458 bytes gzip. Avoid a blanket catalogue migration based on single-icon figures.

## One recipe definition

[Bell's cycle](../../packages/animated-icons/src/icons/bell/cycle.ts) and [ChevronRight's cycle](../../packages/animated-icons/src/icons/chevron-right/cycle.ts) own the values, duration, offsets, easing, target, completion policy, and replay policy. The production Motion definitions consume those values. The server-only [CSS generator](../../packages/animated-icons/src/experimental/css-pilot/cycle-css.ts) consumes the same definitions. There are no separate handwritten keyframe values or durations.

The [CSS recipe adapter](../../packages/animated-icons/src/experimental/css-pilot/css-cycle.ts) implements the existing track protocol and reuses element.ts. On interruption it captures the rendered transform before cancellation. It feeds that transform to a CSS custom property, removes the old animation name, resolves styles, and starts the next named animation. Bell uses that pose for its first entry frame. ChevronRight's first entry frame remains zero, matching the current recipe. Both return from their current rendered pose to rest over 500 ms with their original easing.

Bell keeps its completed rest pose until stop or replay. ChevronRight clears its animation on completion. A completed return clears the transform, custom property, state attribute, and Bell's temporary SVG origin. Playback identifiers and the existing lifecycle protect new playback from queued old completion events. The fixture checks replay after completion, replay during return, repeated stop during return, and queued completion after a new start.

Mouse and touch filtering, the nearest parent control, disabled checks, controlled mode, void handle methods, reduced-motion filtering, disconnect cleanup, and reconnection remain in the unchanged lifecycle. The CSS has no hover selectors or primary-pointer restrictions. It runs only after that lifecycle starts a recipe. The simplified zero-JavaScript experiments and CSS LoaderCircle implementation have been removed from the active pilot.

CSS evaluates Bell's easing continuously. The Motion reference samples that easing every 5 ms before native playback. The browser comparison therefore accepts at most 0.03 degrees of rotation error. The measured maximum is 0.0139844 degrees. ChevronRight uses native easing in the reference; measured translation error is zero. This preserves playback semantics with a small, measured curve-sampling difference for Bell.

The server emits generated CSS through one shared component with a dynamic inline style. A request-local Set emits each kind once. Only rendered kinds produce styles, even when imported through the experimental barrel. This avoids unused Astro style collection and adds no stylesheet request. The repeated-instance route verifies deduplication. The public routes retain their original shared-CSS-only contract.

## Production measurements

Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, frozen lockfile. All rows use the same full production fixture build. The measurement follows static and dynamic imports, counts each reachable JS chunk once, and counts each style source. It uses Node zlib defaults to gzip resources separately. HTML, headers, latency, Brotli, and warm browser caches are excluded. Inline CSS gzip sizes are normalized payload estimates because deployment compresses them with the surrounding HTML.

Cells give raw / gzip bytes for JavaScript plus CSS. Positive savings mean the CSS route is smaller.

| Page | Motion reference | CSS Bell and ChevronRight, Motion loader | Gzip bytes saved |
| --- | ---: | ---: | ---: |
| Bell | 26398 / 12127 | 3605 / 1807 | 10320 |
| ChevronRight | 11230 / 5299 | 3629 / 1795 | 3504 |
| LoaderCircle | 71549 / 30139 | 71549 / 30139 | 0 |
| Bell + ChevronRight | 27335 / 12801 | 4701 / 2403 | 10398 |
| Bell + ChevronRight + LoaderCircle | 73424 / 31521 | 74696 / 31779 | -258 |
| 20 Bell instances | 26398 / 12127 | 3605 / 1807 | 10320 |
| Bell + unchanged ArrowLeft | 27361 / 12754 | 13307 / 6296 | 6458 |

The [after JSON](2026-10-23-css-parity-after.json) retains resource totals and chunk paths. The [before JSON](2026-10-23-css-parity-before.json) records the preceding build before shared cycle definitions and the new pair route were added. Those imports change bundler chunk boundaries and add metadata to the reference too, so the same-build comparison above is the primary evidence. The initial pilot's all-CSS loader figures do not describe this follow-up.

| Mode | Page | JavaScript raw / gzip | CSS raw / gzip |
| --- | --- | ---: | ---: |
| baseline | Bell | 26274 / 12011 | 124 / 116 |
| baseline | ChevronRight | 11106 / 5183 | 124 / 116 |
| baseline | LoaderCircle | 71425 / 30023 | 124 / 116 |
| baseline | Bell + ChevronRight | 27211 / 12685 | 124 / 116 |
| baseline | Bell + ChevronRight + LoaderCircle | 73300 / 31405 | 124 / 116 |
| baseline | 20 Bell instances | 26274 / 12011 | 124 / 116 |
| baseline | Bell + unchanged ArrowLeft | 27237 / 12638 | 124 / 116 |
| managed | Bell | 2804 / 1408 | 801 / 399 |
| managed | ChevronRight | 2813 / 1404 | 816 / 391 |
| managed | LoaderCircle | 71425 / 30023 | 124 / 116 |
| managed | Bell + ChevronRight | 3208 / 1729 | 1493 / 674 |
| managed | Bell + ChevronRight + LoaderCircle | 73203 / 31105 | 1493 / 674 |
| managed | 20 Bell instances | 2804 / 1408 | 801 / 399 |
| managed | Bell + unchanged ArrowLeft | 12506 / 5897 | 801 / 399 |

Combined routes are checked against the exact union of their individual chunk sets. Twenty Bell instances load the same JS and CSS as one. LoaderCircle's route has exactly the same chunks and CSS as its Motion baseline. Savings cannot be added per instance or per icon.

## Browser evidence

The production comparison runs at /css-pilot/ in the ChatGPT in-app Chromium 155 browser. It compares the current Motion implementation with generated CSS at 14, 16, 24, and 28 pixels. The reference still uses Motion's existing playback code. Geometry is shared through Drawing.astro, and the existing drawing expectations remain unchanged.

The playback button executed 592 assertions across 496 pose comparisons with no failures. Scenarios include normal entry, stops and replays at 31, 83, 199, and 371 ms, stops and replays during return, completion cleanup, replay after completion, and queued old completion after replay. Each new playback was sampled at several times. The maximum angular error was 0.013984397194736431 degrees. Maximum translation error was zero.

All 14 lifecycle checks passed. They cover synthetic touch filtering, parent mouse entry, disconnect, disabled and controlled filtering, void methods, manual start, preference-change reset, suppressed reduced-motion start, replay after a preference change, moving between controls, and template cloning. Preference checks use an isolated matchMedia stub and restore the native function and listeners afterward. They do not establish operating-system media-query behavior. A real mouse click on Bell's standalone SVG also set the entry playback state. The page reported no captured console errors.

The preparation benchmark used 20 controlled Bell instances, five warmup batches, and 30 measured batches per mode in alternating order. It times synchronous startAnimation() work and excludes cleanup. Motion's median was 3.5 ms and p95 6.4 ms. CSS's median was 3.4 ms and p95 4.7 ms. This single exploratory run establishes no reliable preparation or frame-pacing advantage. No smoother-animation claim follows from it.

[Browser evidence](2026-10-23-css-parity-browser.json) records these results. Visual acceptance remains with the user. Safari, Firefox, real touch and hybrid hardware, native reduced-motion emulation, and operating-system preference changes remain unverified. The Chrome DevTools connector was unavailable because its browser profile was in use. A comparable merged PR could not be read through gh because api.github.com was unreachable.

## Validation and reproduction

The seven experimental loading cases check SVG parity, selected generated CSS, script counts, chunk unions, a managed JS budget, and the unchanged Motion loader. Generated CSS must exactly match the current shared recipe output. Negative tests inject an inline script, unused keyframes, changed geometry, loader CSS, and changed animation timing. The drawing checker and CSS checker share the existing TypeScript-data evaluation mechanism through a focused helper.

Commands executed include the following. Shell commands use the required RTK prefix.

```sh
rtk proxy pnpm check
rtk proxy pnpm fixture:prepare
rtk proxy node scripts/check-css-pilot.mjs
rtk proxy node scripts/measure-css-pilot.mjs baseline managed
rtk proxy node --test --test-concurrency=1 scripts/check-css-pilot.test.mjs scripts/check-drawings.test.mjs
rtk proxy pnpm validate
rtk proxy env ICON_TEST_PORT=45322 pnpm fixture:serve
rtk proxy git diff --check
```

The targeted validation tests passed all 11 checks. The final pnpm validate passed in 280.404 seconds. Both Astro checks reported zero errors and zero warnings. It reused the current fixture, verified 404 icons across 811 production bundle cases, checked all 404 drawings and seven CSS parity routes, and passed all 20 Node tests. git diff --check passed. The preview is served on port 45322 for manual review. Stop it before rebuilding in the same worktree because the fixture lock protects served output.

Relevant final output follows.

```text
Verified 404 icons across 811 bundle cases.
Selective loading verified: shared CSS only, unused icon behavior excluded.
Verified 7 CSS parity routes: SVG parity, selective generated CSS, resource reuse, combined chunk unions, managed budget, and unchanged Motion loader.
Verified 404 production drawings and native controls; 404 public exports have recorded drawing baselines.
# tests 20
# pass 20
# fail 0
Validation: 280.404 seconds
```
