# Validation coverage

The suite tests the consumer contract at several boundaries. Add an icon to its recipe suite and bundle cases. Add a shared representative only when the icon introduces a mechanism the existing representatives do not exercise.

## Shared behavior

`tests/api.spec.ts` checks HTML props, scoped styles, accessible labels, size, and manual controls. Its rendering cases are ArrowLeft, Archive, SlidersHorizontal, and Bluetooth. They pass props through adapters for native tracks, path morphing, attribute animation, and a drawing with custom line caps and joins. Every other adapter still has its complete initial drawing and playback checked by its recipe suite.

`tests/accessibility.spec.ts` and `tests/lifecycle.spec.ts` use the cases in `tests/helpers/shared-cases.ts`. Their assertions are unchanged. They check keyboard activation, touch suppression, mouse input on touch-primary devices, reduced-motion changes, independent instances, template upgrades, removal, and reconnection to a new control.

| Representative | Mechanism or failure mode |
| --- | --- |
| ArrowLeft | Native path tracks, completed entry restores the drawing |
| MapPin | Delayed reveal, several tracks, held pose |
| Check | Completed reveal and queued finish events |
| FolderHeart | Infinite opacity track |
| AlarmClock | Spring tracks alongside repeating oscillations |
| BatteryFull | Fade-out followed by staggered fill |
| ScanFace | Hidden and visible phases with cancellable callbacks |

Archive and SlidersHorizontal keep their dedicated lifecycle and reduced-motion tests in `tests/archive.spec.ts` and `tests/commands.spec.ts`. Those tests observe paths, spring motion, or SVG attributes directly. Counting native animations cannot establish that their JavaScript-driven work has stopped.

Volume keeps its template-upgrade and reconnection coverage in `tests/media-icons.spec.ts`. Its native track count changes with the visible branch and partial stroke state. Those tests observe the actual branches, partial-stroke continuity, cancellation during removal, independent instances, and listener rebinding. Its reduced-motion tests also check that queued replacements cannot recreate the active branch. The common suites keep their existing assertions.

The shared suites previously expanded the same scenarios across nearly the entire catalog. Removing those repetitions does not remove recipe tests. HTML props fixtures now exist only for the four rendering cases. Single-icon and combined routes remain because each protects a distinct consumer bundle.

AlignLeft and AlignRight use the same SVG attribute mechanism as SlidersHorizontal. Their dedicated checks in `tests/text-formatting.spec.ts` observe moving endpoints, stop continuity, cancellation after removal, reduced motion, and instance isolation. Bold checks its held stroke width and cleanup directly because native track counts cannot prove that the visible width returned to two. The text formatting comparison includes stroke width and endpoint geometry in entry and captured-return measurements. Existing shared representatives remain unchanged.

## Every icon

The icon suites retain their existing no-JavaScript scenarios. They check initial SVG geometry and native links. They also retain manual playback, stop continuity, replay, cleanup, instance isolation, and reduced-motion checks where recipes can differ. The helper `testIconBehavior` continues to apply these checks to each member of its recipe family.

Animation assertions and timeouts remain unchanged. The interruption samples protect distinct phases within each family:

| Suite | Existing interruption samples and purpose |
| --- | --- |
| Energy and Bluetooth | 100, 300, 650, 1600 ms cover filling, delayed slash reveal, staggered bars, and later loops |
| Connectivity | 100, 300, 650, 1600 ms cover fades, staggered springs, rotations, and repeating searches. WifiLow also samples its timed hide at 1750 ms; its text has dedicated show, hold, and hide interruption checks. |
| Clock and calendar | 50, 300, 950, 1600 ms cover entry, reveal boundaries, and oscillations after the initial spring |
| Charts | 100, 300, 650, 1000 ms cover fade-out, the hidden interval, staggered redraw, and held sectors |
| Messages | 100, 300, 650, 1600 ms cover delayed strokes, blinking dots, springs, and held poses |
| Security | 100, 300, 650 ms cover partial reveals, interrupted springs, and ScanFace phase changes |
| Map and compass | 100, 300, 350, 650, 1000 ms cover the initial lift, first reveal boundary, partially revealed symbols, delayed second stroke, held pin and compass spring; polygons participate in the family geometry and cleanup helpers |
| Receipts | 100, 300, 550, 750, 1000 ms cover the main reveal, reverse text erase, delayed secondary strokes, forward redraw, and held poses |
| Bookmarks and status | 50, 200, 450, and 750 ms cover outline stretch, mark redraw, the delayed Ban slash, and spring rotation. Dedicated entry and return replays check pose continuity. Pinned React comparisons check entry at four sizes, settled returns for all ten icons, and interrupted tween returns for CircleCheck, CircleHelp, and Ban. |
| Documents, commands, users, navigation | Existing early, middle, and late samples cover staggered paths and interrupted transforms |
| Cloud | 100, 300, 650, 1600 ms cover transfer overshoot, partial rotations, delayed rays and flakes, and later opacity loops |

Receipts reuse the native path tracks and cancellable keyframe timelines covered by the existing representatives, so they add no shared representative.

Media recipes use `tests/media-icons.spec.ts` with 50, 200, 450, and 1000 ms interruption samples. Volume also checks replacement ordering and cancellation after the waves appear. Airplay checks its automatic return after the 600 ms entry. `/media-comparison/` executes all ten pinned React sources at 14, 16, 24, and 28 px.

Dedicated tests also keep their existing interruption samples and assertions. Comparison routes retain pinned upstream components or their documented independent references at small sizes. These numerical checks support manual visual review.

`tests/cloud-icons.spec.ts` checks all ten cloud drawings, finite held poses, looping stroke order, stop continuity, replay, removal, and reduced motion. Its `/cloud-comparison/` route executes the ten pinned React components at 14, 16, 24, and 28 px. Entry and return measurements sample fifteen times. Return starts from the captured 3250 ms pose with reference velocity reset, because the upstream native stop sampler uses wall-clock time after seeking. Real interrupted spring velocity is covered through adapter continuity tests, without a numerical equality claim against React. Cloud adds no shared representative: existing cases already cover native opacity loops, delayed tracks, and sampled transforms.

The connectivity family reuses native opacity and SVG transform tracks already represented above. WifiLow adds a text node, but its delayed show and hide are flattened into native tracks rather than introducing runtime callbacks. Dedicated connectivity tests check that text at rest, during playback, and after stop, removal, and reduced motion. No shared representative is added.

`tests/corner-resize.spec.ts` checks all ten corner and resize drawings without JavaScript, directional pulse peaks, finite held spring poses, stop continuity at 50, 225, 400, and 650 ms, replay during entry and return, removal, instance isolation, and reduced motion. Its `/corner-resize-comparison/` route executes all ten pinned React components at 14, 16, 24, and 28 px. Fifteen entry and completed-pose return samples measure geometry and paint. Expand and Shrink return from their held translations; corner pulses have already returned to rest. Public adapter tests check pose continuity during interrupted returns. Numerical equality of interrupted spring velocity to React is unverified. These icons reuse the existing native transform sampler and lifecycle, so shared representatives remain unchanged.

## Checks without a browser

`pnpm check` checks the package, the remaining Astro consumer fixtures, and TypeScript test code. Both Astro checks remain because adapters and consumer templates have different typing responsibilities.

`pnpm inspect:bundle` checks every exported icon against its directory and single-icon route. It also checks registration counts, shared CSS, unused exports, absence of React in consumer bundles, and exact chunk unions for combined routes. `pnpm test:bundle` keeps all negative cases against temporary output copies. These checks already run without Chrome. Their assertions remain intact.

`pnpm test:fixture` checks reuse and rejection of changed inputs or output through the fixture commands. The tests restore their temporary changes and reuse an existing build.

See [the contributor workflow](../CONTRIBUTING.md#validate-the-change) for commands.

Measurements for this strategy are recorded in [the validation timing record](history/2026-10-18-validation.md).

`tests/directional-arrows.spec.ts` checks all ten directional arrow drawings without JavaScript, automatic and manual playback, interruption at 50, 200, 350 and 450 ms, stop continuity, replay, instance isolation, removal and reduced motion. The `/directional-arrows-comparison/` route executes the pinned React components at 14, 16, 24 and 28 px. Numerical checks sample entry and returns from captured early, middle and late poses. Both versions reset velocity before those measured returns; real interrupted velocity is retained by manual playback and checked for continuity through the public adapter API. These native SVG transform tracks reuse the existing representatives, so no shared representative is added. The former ArrowLeft/ArrowDown bundle route moves from `/arrow-down-left/` to `/arrow-left-down/` to free the new icon's consumer route.

The communication family uses the existing SVG transform, signal, and path-reveal mechanisms, so it adds no shared representative. `tests/communication-icons.spec.ts` checks every drawing and native link without JavaScript, stop continuity at 100, 300, 650, and 1000 ms, rapid replay, removal, reduced motion, and instance isolation. Dedicated tests check PhoneCall's fade and delayed spring reveal, Mailbox's held flag, and Send's hidden decorative trail. `/communication-comparison/` executes the ten pinned React sources at 14, 16, 24, and 28 px. It measures entry, PhoneCall's separate spring phase, and return from a captured completed pose. The runner normalizes three fixed-size upstream SVGs after mounting. The package notices describe the handset return correction and the limits of interrupted spring comparisons.

The infrastructure family reuses the SVG transform sampler, delayed path reveals, and native opacity loops, so it adds no shared representative. `tests/infrastructure-icons.spec.ts` checks complete idle SVG and native links without JavaScript, automatic and manual playback, stop continuity at 50, 120, 225, 400, 650, and 1200 ms, rapid replay, removal, reduced motion, and instance isolation. Dedicated tests check Cpu's interrupted axis reset, Terminal's infinite blink and reconnection, and Binary's hidden phases, queued completion cancellation, and staggered return. `/infrastructure-comparison/` executes all ten pinned React sources at 14, 16, 24, and 28 px. Entry and captured-return measurements compare geometry and normalized paint. Reference velocity resets before measured returns. Real interrupted spring velocity equality remains unverified.
