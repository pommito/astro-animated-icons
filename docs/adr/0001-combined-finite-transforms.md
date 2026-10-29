---
status: accepted
---

# Preserve independent property poses in combined finite transforms

[Issue #95](https://github.com/pommito/astro-animated-icons/issues/95) needs one finite CSS transform track for KeySquare, Wallet, and KeyCircle. Use ordered property channels with independent offsets, compiled onto the preceding Motion helper's 5 ms grid. Preserve both the displayed matrix and the retained property pose when playback changes. The owner approved this representation in this implementation chat on 2026-10-29, before shared-engine implementation.

The [source review and experiments](../history/2026-10-29-combined-transform-decision.md) capture unmodified production behavior at `92523bd`, before any recipe extraction. An isolated CSS experiment passed 5100 matrix comparisons at 14, 16, 24, and 28 px with maximum error 0.000010000000000065512 against the existing 0.005 threshold. These experiments establish feasibility for the sampled poses. They do not validate a production compiler or adapter.

## Representation

Keep `FiniteTransformCycle` for existing single-property recipes. Add a narrow internal `CombinedTransformCycle` and use their union at the existing CSS transform wrapper, compiler, adapter, and registration boundary. The ordered `tracks` array defines the transform list, rather than object insertion order. Each track owns `values`, `times`, and `rest`. The cycle owns target, timing, origin, replay, and completion.

KeyCircle declares:

```ts
{
  id: "key-circle",
  target: "svg",
  tracks: [
    { property: "translateY", values: [0, -3, 0, -2, 0], times: [0, .25, .5, .75, 1], rest: 0 },
    { property: "rotate", values: [0, 3, -3, 0], times: [0, 1 / 3, 2 / 3, 1], rest: 0 },
  ],
  duration: .9,
  ease: "easeOut",
  returnDuration: .9,
  returnEase: "easeOut",
  origin: "50% 50%",
  replay: "current",
  finish: "hold",
}
```

The initial capability supports only SVG targets, finite translateY, uniform scale, and rotation channels with shared entry timing and shared return timing. Values remain in CSS pixels, degrees, or unitless scale. Springs, repeats, delayed channels, opacity, runtime geometry, and arbitrary transform functions require separate source review and capability work.

The production cycle is the single maintained recipe definition. A fixture-only adapter passes its ordered channel data back to `createSvgKeyframesRecipe` and `animateSvgTransform`, including per-property entry offsets. The existing drawing remains shared with that reference. The dated experiment's frozen source expectations are evidence snapshots, not another maintained production recipe.

## Compilation and playback

1. Resolve each channel independently. Entry uses its own offsets and the existing per-interval easing. Return uses two values, retained value and rest, at offsets `[0, 1]`. Wallet's three entry offsets therefore do not apply to its return.
2. Sample at `duration * index / ceil(duration / 5ms)`, including both endpoints. Preserve Motion's easing evaluation at these sample times, including its finite cubic-Bezier subdivision precision. Emit one full transform string per grid point and use linear native interpolation between samples.
3. Emit transforms in channel order. KeySquare is `scale(...) rotate(...)`. Wallet and KeyCircle are `translateY(...) rotate(...)`. CSS applies the rightmost function first. Keep the original SVG and origin. Wallet's `12px 12px` stays fixed at every icon size.
4. Compile reusable CSS with each sampled channel expressed as `base + coefficient * capturedValue`. This works because only the first entry value depends on the retained pose, and return interpolates retained value toward rest. Set the captured variables before starting playback. The variables themselves do not animate. Emit one sheet per recipe per document through the existing recovery helper.
5. Keep the retained property pose in per-instance state. At interruption, linearly interpolate the two surrounding property samples at the native animation's current time, matching `sampleFrame` in the preceding helper. Do not recover the next recipe's independent values by decomposing a rounded computed matrix.
6. Capture the displayed matrix before cancellation and use it as the first keyframe of interrupted playback. Later frames use the retained property pose. The experiment always uses this matrix bridge and stays within 0.00001 of the preceding helper, which conditionally substitutes its first frame. The first 5 ms interval needs explicit production coverage.
7. Replay replaces only each property's first entry value. It retains later declared values and the full entry duration. A second stop captures the return's current property values and starts a new full-duration return. Replay during return captures that return, then starts the full entry. There is no inherited spring velocity in these recipes.
8. Entry holds completion. A subsequent stop still starts a full return, even when the final values equal rest. Completed return, disconnect, and reduced-motion reset clear transforms, origins, state attributes, captured variables, and retained property values. The unchanged lifecycle guards stale callbacks. The adapter must also guard any retained-pose write with its active playback identity.

## Delivery and alternatives

Reuse `CssIcon.astro`, the existing transform registration entry, serialized recipe attributes, request-local sheet deduplication, stylesheet recovery, and `createIconElement`. Broaden only the internal transform recipe union. Do not add icon-local processed scripts, a catalogue registry, or consumer configuration. The extra compiler and adapter code can increase existing single-property CSS pages because they share this mechanism. Measure those control pages and all mixed-Motion compositions before claiming a saving.

The sampled representation emits 776 keyframes across the three entry and three return sheets before minification. This favors compatibility and native transform playback at the cost of more generated CSS than sparse keyframes. Repeated instances share those sheets. The implementation stores captured deviations from rest in the variables and rounds serialized CSS numbers to six decimal places, while retaining full scalar sampling precision. [Measured raw/gzip costs](../history/2026-10-29-combined-transforms.md) show unit-page savings, family and mixed-Motion regressions, and extra shared runtime cost on existing CSS pages.

Sparse full-transform keyframes with a common offset list cannot describe KeyCircle's independent breakpoints without another interpolation mechanism. Padding its rotation values onto the translation offsets produced matrix error 0.05114726. Reversing Wallet's transform order produced error 0.209269. Both exceed the unchanged threshold.

Animating individual CSS transform properties or registered custom properties would allow separate channel timelines, but would change composition, pose capture, or browser requirements. Nested SVG wrappers would change the initial drawing and origin behavior. These alternatives add contracts the three recipes do not need. Continuous analytic curves would also replace the existing sampled behavior. Keep the sampled combined transform until another approach has independent evidence and an explicit decision.

## Approval and implementation gate

The owner approved this representation on 2026-10-29 and authorized implementation for these three recipes. Implementation still requires compiler and loading tests, production comparisons against the saved capture, lifecycle and template checks, full validation, and fresh payload comparisons. Architecture approval grants no visual acceptance and approves no other catalogue recipes.

Keep Motion for any recipe whose production implementation fails the unchanged tolerances or playback contract. [#98](https://github.com/pommito/astro-animated-icons/issues/98) owns full-catalogue classification. [#99](https://github.com/pommito/astro-animated-icons/issues/99) owns later migration of complete compatible families. This decision supplies reusable compatibility criteria, without imposing a two- or three-icon limit on that later work.
