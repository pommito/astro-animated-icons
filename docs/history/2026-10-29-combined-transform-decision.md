# Combined transform architecture evidence

This record preserves the preparation phase. The owner subsequently approved ADR 0001 on 2026-10-29 before implementation. The [implementation report](2026-10-29-combined-transforms.md) records the resulting migrations and pending visual acceptance.

This is the pre-implementation review package for [issue #95](https://github.com/pommito/astro-animated-icons/issues/95), titled "refactor(icons): specify combined CSS transforms for three finite recipes" when fetched on 2026-10-29. The [proposed architecture](../adr/0001-combined-finite-transforms.md) needs owner review. No production icon, recipe, drawing, lifecycle, or registration source has changed.

The fresh managed worktree starts at updated main `92523bd5c8f2a8daf58c57f507755b0678419bfb`, after merged #97 and closed #94. The earlier UserRoundCog acceptance does not approve combined transforms. The current [parent #81](https://github.com/pommito/astro-animated-icons/issues/81) assigns full-catalogue review to [#98](https://github.com/pommito/astro-animated-icons/issues/98) and compatible-family rollout to [#99](https://github.com/pommito/astro-animated-icons/issues/99). This branch does neither of those implementations.

## Source contracts before extraction

Read the three preceding definitions and their complete call paths:

- [KeySquare](../../packages/animated-icons/src/icons/key-square/definition.ts), [Wallet](../../packages/animated-icons/src/icons/wallet/definition.ts), and [KeyCircle](../../packages/animated-icons/src/icons/key-circle/definition.ts).
- [SVG keyframes](../../packages/animated-icons/src/shared/svg-keyframes.ts), [SVG transforms](../../packages/animated-icons/src/shared/svg-transform.ts), and [lifecycle](../../packages/animated-icons/src/element.ts).
- The current [single-property CSS compiler](../../packages/animated-icons/src/shared/cycle-css.ts), [adapter](../../packages/animated-icons/src/shared/css-cycle.ts), [wrapper](../../packages/animated-icons/src/CssIcon.astro), and [shared registration](../../packages/animated-icons/src/shared/register-css-cycle.ts).

The target is the outer SVG, obtained from the drawing's `ownerSVGElement`. There are no property-specific options, delays, repeats, geometry reads, springs, or queued phases in these three calls. All three use `finish: "hold"`.

| Recipe | Independent property values and entry offsets | Entry | Return | Origin and transform list |
| --- | --- | --- | --- | --- |
| KeySquare | rotate `[0,15,-15,0]`, scale `[1,1.05,1,1]`; both `[0,1/3,2/3,1]` | 600 ms easeOut | 600 ms easeOut | `50% 50%`; scale then rotate |
| Wallet | y `[0,-3,0]`, rotate `[0,-4,0]`; both `[0,.45,1]` | 550 ms easeInOut | 300 ms easeOut | `12px 12px`; translateY then rotate |
| KeyCircle | y `[0,-3,0,-2,0]` at `[0,.25,.5,.75,1]`; rotate `[0,3,-3,0]` at `[0,1/3,2/3,1]` | 900 ms easeOut | 900 ms easeOut | `50% 50%`; translateY then rotate |

`svg-keyframes` substitutes `null` for each first entry value when an inline transform exists. `svg-transform` fills each null from its retained property values. It evaluates easing inside each property interval, samples every 5 ms, composes full transform strings in its fixed order, then calls Motion mini with linear native easing. The native entry tracks have 121, 111, and 181 keyframes respectively. The easing curves are `[0,0,.58,1]` and `[.42,0,.58,1]`. Motion's cubic-Bezier evaluator stops after at most 12 subdivisions or error 0.0000001.

Return replaces every property array with `[retained, rest]`. Rest is 1 for scale and 0 for y or rotate. A `times` array applies only when its length matches the current values. Wallet's entry offsets therefore fall back to `[0,1]` on return. KeySquare and KeyCircle inherit their entry transition for return; Wallet overrides it. Durations remain full durations after interruption.

The helper retains scalar values separately from the rendered transform. On stop it interpolates the scalar samples at the native current time and captures the displayed matrix around Motion cancellation. It sometimes substitutes that matrix for the first native keyframe when the inline transform starts with `matrix` and the starting scalar values match. The saved contracts record actual first frames, so this detail is observable before extraction. Matrix decomposition alone would lose the distinction between those two pose representations.

The lifecycle stops and cancels previous tracks before starting another. Completed entry commits and holds its pose; stop after that completion still animates a return. Completed return removes transform, origin, and retained state. Playback identifiers protect newer playback and repair late writes after reset. Disconnect resets state and aborts listeners; reconnect attaches them again. Reduced motion blocks entry, and its change listener resets playback.

## Baseline capture and representation experiment

The [Motion capture function](2026-10-29-combined-motion-capture.js) ran against the public Motion components on `/combined-transforms/` before recipe extraction. Its [saved output](2026-10-29-combined-motion-before.json) contains 1644 matrices, computed origins, native keyframe lists, effective timings, and 288 passing checks. There were no failures. The browser reported Chrome 154 on macOS. These are preceding local Motion components, not upstream React components.

At 14, 16, 24, and 28 px the capture samples entry, stop and replay interrupted at 31, 83, 199, duration minus 1, and duration milliseconds. It also samples repeated stop and replay during return after a 199 ms entry and an 83 ms return. Each interruption includes 0, 1, 2.5, 4.9, and 5 ms to expose the first sampled interval, plus later and terminal samples. Entry also samples the independent property breakpoints. The checks cover held entry, stop after completion, completed return, idle stop, stale callbacks, disconnect, reconnect, independent template clones after registration, and a synthetic matchMedia preference change.

The [isolated representation probe](2026-10-29-combined-representation-probe.js) uses frozen expectations from the preceding definitions. It builds temporary CSS keyframes on SVG copies, with a scalar sampler independent of the production helper. It compares those copies with the unmodified public Motion icons. Its [output](2026-10-29-combined-representation-probe.json) records 5100 matrix comparisons, zero failures, and maximum component error 0.000010000000000065512 against the unchanged 0.005 threshold. Of these comparisons, 2448 exercise parameterized CSS expressions using captured channel values and a first-frame matrix variable. The other 2652 use absolute sampled values. The variables remain static during each animation. Both scripts include the independent KeyCircle y breakpoints at 225 and 675 ms as well as its rotation thirds.

The probe deliberately changes KeyCircle to a shared five-value timeline and measures error 0.05114726. It also reverses Wallet to `rotate(-4deg) translateY(-3px)` and measures error 0.209269. These experiments detect wrong offsets and transform order. KeySquare exercises rotation with uniform scale. Intermediate stop and replay cases preserve independent scalar values and the displayed matrix. This proof covers the sampled representations, not the future compiler, registration, stylesheet recovery, or adapter.

The synthetic preference checks pass for all 12 instances. A [separate native DevTools emulation attempt](2026-10-29-combined-native-media-attempt.json) updated `matchMedia.matches`, but no native `change` event was observed, including on an extra retained MediaQueryList listener after two animation frames. All 12 paused entries remained active. This attempt does not establish native preference-change cancellation. Its cause remains unresolved, and this preparatory branch changes no runtime to address it. Safari, Firefox, real touch/hybrid hardware, operating-system preference changes, frame pacing, and preparation timing remain unverified. Owner visual acceptance is pending.

## Fresh loading baseline

The [loading JSON](2026-10-29-combined-loading-before.json) preserves both production consumers, 38 compositions per consumer, warm transitions, reachable resources, module evidence, assumptions, and source hashes. Twenty new compositions cover each of these three icons and their family, each repeated 20 times, with Bell, CircleDashed, and UserRoundCog, with LoaderCircle, and with both groups. The repeated family has 60 instances. Existing measurement routes remain available as controls.

The package sources are identical to main `92523bd`. Measurement scaffolding adds routes to both consumers, and the full fixture adds the Motion capture page. This can change the production chunk graph relative to older reports. Use this same scaffolding for later before/after comparisons. The older #91 and #94 reports remain unchanged. No migration savings or mixed-Motion regression can be attributed yet because no CSS implementation exists.

The environment was Node v22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, TypeScript 6.0.3, macOS 27.0.1 build 26A434, arm64 on Apple M1 Pro. The minimal consumer uses installed package links, not a packed-package installation.

| Consumer | Composition | JS files | JS raw / gzip | CSS raw / gzip | Page raw / gzip |
| --- | --- | ---: | ---: | ---: | ---: |
| Full | KeySquare | 11 | 26044 / 11825 | 124 / 116 | 27040 / 12403 |
| Full | Wallet | 11 | 26084 / 11843 | 124 / 116 | 26915 / 12348 |
| Full | KeyCircle | 11 | 26039 / 11818 | 124 / 116 | 26949 / 12368 |
| Full | Family | 13 | 26589 / 12246 | 124 / 116 | 28798 / 12991 |
| Full | Family repeated | 13 | 26589 / 12246 | 124 / 116 | 59882 / 13293 |
| Full | Family + existing CSS | 18 | 32567 / 15097 | 8342 / 1161 | 48319 / 17265 |
| Full | Family + LoaderCircle | 19 | 72678 / 30965 | 124 / 116 | 75404 / 31798 |
| Full | Family + existing CSS + LoaderCircle | 24 | 78656 / 33816 | 8342 / 1161 | 94925 / 36052 |
| Minimal | KeySquare | 9 | 25666 / 11500 | 124 / 116 | 26662 / 12078 |
| Minimal | Wallet | 9 | 25706 / 11516 | 124 / 116 | 26537 / 12020 |
| Minimal | KeyCircle | 9 | 25661 / 11492 | 124 / 116 | 26571 / 12043 |
| Minimal | Family | 11 | 26211 / 11920 | 124 / 116 | 28420 / 12667 |
| Minimal | Family repeated | 11 | 26211 / 11920 | 124 / 116 | 59504 / 12968 |
| Minimal | Family + existing CSS | 14 | 32105 / 14647 | 8342 / 1161 | 47857 / 16822 |
| Minimal | Family + LoaderCircle | 15 | 68178 / 28043 | 124 / 116 | 70904 / 28875 |
| Minimal | Family + existing CSS + LoaderCircle | 18 | 74072 / 30770 | 8342 / 1161 | 90341 / 33007 |

All sizes are bytes. Cold totals count each reachable external URL once. Gzip uses Node zlib defaults per resource. CSS totals normalize inline styles separately; page totals compress HTML with inline content once and add external JavaScript and CSS, avoiding double counting. Warm transitions reuse same-build external URLs with no eviction or revalidation and fetch the second HTML again. They model cache reuse rather than observe network requests. Headers, latency, Brotli, HTTP cache policy, cross-build cache reuse, frame pacing, and preparation timing are excluded. The adjacent JSON contains all per-icon repeated and mixed compositions and raw/gzip warm totals.

After the fixture's type correction, a second measurement reproduced all 76 cold route totals and all 68 warm transitions exactly. The eight recorded source hashes match the final files.

## Commands and review gate

Commands below use the required shell prefix. Run from the isolated worktree.

```sh
rtk pnpm install --frozen-lockfile
rtk pnpm inventory:animations --summary --output .artifacts/animation-inventory.json
rtk proxy node --test scripts/measure-page-loading.test.mjs
rtk proxy node scripts/measure-page-loading.mjs
rtk pnpm validate
rtk proxy env ICON_TEST_PORT=45343 pnpm fixture:serve
```

The inventory regenerated all 470 exports with 23 migrated recipes, five capability candidates, 18 explicit Motion retentions, and 424 needing review. Import counts do not establish eligibility. The focused loading test first failed with `Missing expected exception` for duplicated CSS on the repeated combined family, then passed after the measurement contract was extended. All eight loading tests and all four focused inventory tests passed.

`pnpm validate` passed in 116.999 seconds. Both Astro checks reported zero errors, warnings, and hints. Validation verified 470 icons across 944 bundle cases, 470 initial drawings and native controls, 23 migrated recipes across 33 integrated compositions, the existing pilot, chevron and capability routes, and all 68 Node tests. Routine validation launched no browser. The first attempt found two fixture prop-inference errors; an explicit `Props` interface for `slugs` fixed them before the successful run. Local documentation links were checked against the worktree.

To repeat the numerical probes, serve the fixture, open `/combined-transforms/`, and evaluate each dated JavaScript file as an asynchronous browser function. Save the returned JSON. Keep reduced motion disabled for those captures. The probe page's buttons play the public Motion baseline for inspection. It contains no migrated CSS component and cannot grant migration acceptance.

The pending review is the representation and playback policy in ADR 0001. After explicit owner approval, implementation must still add fixture-only Motion references sharing the extracted data, production compiler and adapter tests, comparison manifests, inventory decisions, bundle and drawing checks, attribution updates, complete interruption and cleanup evidence, template and registration recovery checks, fresh before/after payloads, independent Standards and Spec reviews, and owner visual acceptance. Do not merge or close #95 on the basis of this preparatory evidence.
