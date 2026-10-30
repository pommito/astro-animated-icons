---
status: proposed
---

# Preserve measured stroke playback with native CSS paint tracks

[Issue #103](https://github.com/pommito/astro-animated-icons/issues/103) asks for a measured path-paint capability before complete-family rollout. I propose a narrow paint recipe with measured target lengths, independent native CSS property tracks and explicit replay policies. Use compact serialized data for clone recovery. Keep WindArrowDown on Motion until its retained translation has a separately proved composition adapter.

The [runnable proof](../../tests/fixtures/astro/src/pages/path-paint-proof.astro), [source mapping](../history/2026-10-30-path-paint-mapping.md) and [evidence](../history/2026-10-30-path-paint-decision.md) accompany this proposal. No production package source or engine selection changes. Architecture approval is pending.

## Interface and scope

The experiment exposes `paintCSS(plan)`, `measureTargets(plan, drawing)`, `encodePaint(plan)`, `decodePaint(wire)` and `createPaintProof(plan)`. These are the compiler, geometry, delivery and track-adapter seams tested in Phase 1. They live entirely in the fixture. They do not define a new public icon API.

The proposed production authoring data stays readable and local to each icon. Each affected target owns its selector, optional measured dash values, signed offset values and opacity values. A phase owns duration, delay, effect easing, optional offsets and optional interval easing for each property. Missing return properties remain untouched until whole-playback cleanup. The recipe declares hold or restore completion. Replay is explicit and evaluated per target.

The supported paint properties are `stroke-dasharray`, `stroke-dashoffset` and opacity. Dash values are coefficients of the measured length. The gap equals one measured length in the reviewed calls. EyeOff's dash reaches twice that length and its offset reaches negative twice that length. Preserve that sign and magnitude. Multi-value paint is necessary for Fingerprint, BluetoothConnected and ReceiptText. This is finite SVG paint with measured geometry, without transforms, springs, repeats, morphs or queued sequences.

The experiment's JSON plans are frozen native-effect transcripts. They cover 88 paint candidates and are not final production definitions. They deliberately preserve channel-level detail for inspection. Production extraction must still compare each local recipe against the saved source and Motion poses. Shared local references never substitute for those independent snapshots. The proof does not execute upstream React components.

## Geometry and initial drawing

Keep the original SVG, shapes, attributes, origins and public wrapper. Initial rendering needs neither geometry measurement nor JavaScript. Do not add `pathLength`, normalize existing drawings, insert wrappers, change caps or pad a gap to conceal rounded caps.

At each playback, measure `getTotalLength()` once per distinct target that actually animates dash or offset. Share that length between its property tracks. Opacity-only targets perform no geometry read. Store the result as a static target-local `--pp-length` value in CSS pixels, matching the existing helper's strings. Do not animate the variable. The proof measures again for entry, replay and return, rather than caching across changes or reconnects. It performs no connection-time geometry work.

[SVGGeometryElement](https://svgwg.org/svg2-draft/types.html#InterfaceSVGGeometryElement) defines the native length method. [SVG dashing](https://svgwg.org/svg2-draft/painting.html#StrokeDashing) defines dash and gap lists, offset direction and user units. Both engines use the same browser's geometry method. Comparing their computed dash values therefore checks the representation without introducing a second curve-length approximation. Cross-browser geometric precision remains a separate check.

The prototype rejects missing geometry and non-finite or non-positive measured lengths. All reviewed animated geometry has positive lengths. Before production, either preserve the preceding behavior for zero-length geometry or document a narrower internal invariant with a focused test. This guard is an experiment limit, not an approved public behavior change.

## Compilation and native timing

Generate sparse CSS keyframes for each property, with source offsets and interval easing. Length-dependent values use `calc(var(--pp-length) * coefficient)`. Captured first values use target-local custom properties. Every replay clears the host phase, flushes the removed animation names, writes its first values and starts fresh native CSS animations.

Motion mini applies a scalar easing to the whole native effect. CSS animation timing normally eases individual keyframe intervals. The proposal keeps interval easing in keyframes and sets the native effect's overall easing through `animation.effect.updateTiming({ easing })`. The [Web Animations interface](https://www.w3.org/TR/web-animations-1/#dom-animationeffect-updatetiming) defines this update. It preserves Motion mini's division between effect and interval timing, including Fingerprint's interval easeOut and its separate opacity curve. It avoids a sampled approximation and leaves existing transform and opacity compilers unchanged.

The proof passes its sampled Chrome comparisons, including ReceiptText's explicit plateaus and BluetoothConnected's opacity waveform. Safari and Firefox behavior still needs verification before claiming browser parity for this timing choice. If another browser fails, keep the affected recipe on Motion while investigating. Do not expand an existing threshold.

## Replay, return and cleanup

Use the existing `IconRecipe` track protocol and `createIconElement` lifecycle. Track factories report completion individually. The shared lifecycle continues to own whole-playback completion, stop/cancel ordering, playback identifiers, input listeners, controlled mode, disconnection and reduced motion.

Replay policies preserve the source mechanisms:

| Policy | First entry values |
| --- | --- |
| Restart | Use declared first values, even during active playback. |
| Active | Use the captured target pose while its primary track is active; use declared first values after primary completion. |
| Until clear | Continue using captured values after that target completes, until whole-playback clear. |
| Current dash | ReceiptText starts from its current dash, initializing to full when no dash style exists. |
| Incomplete dash | Fingerprint resumes only when the computed first dash divided by measured length is finite and below one. Its opacity uses that same condition. |

The primary completion signal is the dash track when present, otherwise opacity. Opacity can finish earlier without ending dash replay state. Wind's early completed strokes must retain their state while later delayed strokes continue. Return starts from the displayed paint pose, preserves each property's full source duration and delay, and restores its declared endpoint. A second stop starts another full return. Replay during return follows the same declared entry policy. UserRoundPlus has opacity-only return and leaves its dash pose intact until cleanup.

On stop, commit each property's computed pose before cancellation. On hold completion, commit that property's endpoint, cancel its native effect and preserve the recipe's held state. Guard completion writes against cancellation. A stale callback cannot commit over a newer playback. Completed return, restore completion, disconnect and reduced motion remove the phase, captured variables, length variables, paint styles and retained target state. Repeated stop after cleanup remains idle.

## Delivery and recovery

For production, reuse the package's wrapper contract, shared registration/discovery, serialized recipe delivery and `ensureRecipeCSS` recovery. Add one shared paint registration entry. Every rendered host carries its complete selected recipe, including template clones whose source and styles disappear before registration. Repeated instances share their compiler/runtime and recipe sheet. No icon-local CSS script, consumer setup, catalogue engine registry or second consumer component is needed.

The experiment's standalone delivery wrapper obtains its SVG by server-rendering the unchanged public component and retaining only the SVG output. It emits its own serialized paint plan, selected stylesheet and shared proof registration entry. Module evidence confirms that paint-only consumer routes reach no Motion module. This wrapper is measurement code, not a proposed production dependency on `astro/container`. Production should extract and reuse each existing drawing as earlier migrations do.

The compact wire format is an internal tuple encoding of the same readable plan. Property, easing and replay codes are fixed to this paint capability. Default uniform offsets and linear interval easing can be omitted. The decoder reconstructs every one of the 88 experiment plans exactly. Encoding rejects non-unit gaps rather than discarding them. The verbose format remains available only for experiment cost comparison with `PATH_PAINT_VERBOSE=1`.

## Comparison criteria and evidence

Keep matrix-component and translation tolerance at 0.005 and opacity tolerance at 0.001. Compare 14, 16, 24 and 28 px drawings. Add an absolute 0.005 SVG user-unit tolerance for every dash-list component and signed offset. Require equal list lengths, equivalent numeric units, exact `none` state and unchanged initial geometry. Do not reduce offsets modulo a dash period, because that could conceal a sign or source-value error.

I chose 0.005 user units to bound stroke-end displacement directly. At the largest reviewed 28 px drawing with its 24-unit viewBox, that is about 0.00583 rendered CSS px. The [SVG stroke model](https://svgwg.org/svg2-draft/painting.html#StrokeDashing) supplies the units and pattern semantics; it supplies no acceptance tolerance. This proposed tolerance is our comparison criterion, not a standard or visual acceptance rule. The measured maximum is zero at the saved points, so the proof does not depend on exhausting that budget.

The independent baseline contains native contracts for all 89 candidates and 7816 poses for 23 representatives before extraction. The compact proof compares 40096 shapes across those poses with zero failures and zero maximum error for the measured properties. WindArrowDown contributes a retained Motion control. The other 22 representatives use isolated CSS paint. The source mapping identifies all unmeasured members and exceptions. No candidate has a migrated inventory outcome yet.

The proof covers delayed tracks, entry, interruptions, restart/current replay, early completed until-clear targets, repeated stop, replay during return, completion, stop after hold, stale callbacks, reconnects, independent/source-removed templates and stylesheet recovery. Synthetic preference tests and native Chrome media emulation have separate records. Owner visual acceptance remains separate.

## Payload decision and limits

Fresh production measurements cover singles, all five families, all 89 candidates, twenty repetitions, existing CSS mixtures and LoaderCircle mixtures in full and minimal consumers. The standalone proof migrates 88 experiment hosts and retains WindArrowDown on Motion. It is a forecast of this representation, not a production migration result.

The verbose encoding adds about 2.8 kB page gzip for all candidates and about 140 kB for the repeated group. Compact data changes the all-candidate result to about 1.4 kB saved. The twenty-repeat composition still adds about 60 kB. Its recipe attributes repeat, and long documents exceed gzip's useful back-reference distances. Family and mixed-Motion results differ; the dated evidence reports the exact counts and regressions. Do not add individual savings to predict family costs.

I recommend approving the narrow geometry and native-effect model only if these delivery costs are acceptable for the first selected family. Start rollout with a complete compatible family and measure its final production representation again. The compact experiment does not justify a blanket 88-icon rollout, and WindArrowDown needs a separate composition decision. Further delivery factoring may reduce repeated HTML, but it must preserve source-removed clones and requires its own evidence.

Byte counts and CSS wiring establish no smoother frames. The instrumented geometry run checks calls and records coarse preparation times, without warmup or an advantage claim. Safari, Firefox, real touch/hybrid devices, operating-system preference changes, frame pacing, browser geometry differences and packed-package installation remain unverified.

## Approval gate

Issue #103 states, "This approval is required before extending production mechanisms or changing production engine selection."

The owner has not approved this representation. Phase 1 supplies a runnable experiment, source review, measurements and this decision. Wait for an explicit owner decision before production implementation. Architecture approval grants no visual acceptance. Every later migrated set needs its own numerical evidence, full validation, independent review, payload report and owner visual acceptance before merge. Keep #103 and parent #81 open while scoped outcomes remain incomplete.
