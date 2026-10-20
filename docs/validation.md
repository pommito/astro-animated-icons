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

The shared suites previously expanded the same scenarios across nearly the entire catalog. Removing those repetitions does not remove recipe tests. HTML props fixtures now exist only for the four rendering cases. Single-icon and combined routes remain because each protects a distinct consumer bundle.

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
| Documents, commands, users, navigation | Existing early, middle, and late samples cover staggered paths and interrupted transforms |
| Cloud | 100, 300, 650, 1600 ms cover transfer overshoot, partial rotations, delayed rays and flakes, and later opacity loops |

Receipts reuse the native path tracks and cancellable keyframe timelines covered by the existing representatives, so they add no shared representative.

Dedicated tests also keep their existing interruption samples and assertions. Comparison routes retain pinned upstream components or their documented independent references at small sizes. These numerical checks support manual visual review.

`tests/cloud-icons.spec.ts` checks all ten cloud drawings, finite held poses, looping stroke order, stop continuity, replay, removal, and reduced motion. Its `/cloud-comparison/` route executes the ten pinned React components at 14, 16, 24, and 28 px. Entry and return measurements sample fifteen times. Return starts from the captured 3250 ms pose with reference velocity reset, because the upstream native stop sampler uses wall-clock time after seeking. Real interrupted spring velocity is covered through adapter continuity tests, without a numerical equality claim against React. Cloud adds no shared representative: existing cases already cover native opacity loops, delayed tracks, and sampled transforms.

The connectivity family reuses native opacity and SVG transform tracks already represented above. WifiLow adds a text node, but its delayed show and hide are flattened into native tracks rather than introducing runtime callbacks. Dedicated connectivity tests check that text at rest, during playback, and after stop, removal, and reduced motion. No shared representative is added.

## Checks without a browser

`pnpm check` checks the package, the remaining Astro consumer fixtures, and TypeScript test code. Both Astro checks remain because adapters and consumer templates have different typing responsibilities.

`pnpm inspect:bundle` checks every exported icon against its directory and single-icon route. It also checks registration counts, shared CSS, unused exports, absence of React in consumer bundles, and exact chunk unions for combined routes. `pnpm test:bundle` keeps all negative cases against temporary output copies. These checks already run without Chrome. Their assertions remain intact.

`pnpm test:fixture` checks reuse and rejection of changed inputs or output through the fixture commands. The tests restore their temporary changes and reuse an existing build.

See [the contributor workflow](../CONTRIBUTING.md#validate-the-change) for commands.

Measurements for this strategy are recorded in [the validation timing record](history/2026-10-18-validation.md).

The communication family uses the existing SVG transform, signal, and path-reveal mechanisms, so it adds no shared representative. `tests/communication-icons.spec.ts` checks every drawing and native link without JavaScript, stop continuity at 100, 300, 650, and 1000 ms, rapid replay, removal, reduced motion, and instance isolation. Dedicated tests check PhoneCall's fade and delayed spring reveal, Mailbox's held flag, and Send's hidden decorative trail. `/communication-comparison/` executes the ten pinned React sources at 14, 16, 24, and 28 px. It measures entry, PhoneCall's separate spring phase, and return from a captured completed pose. The runner normalizes three fixed-size upstream SVGs after mounting. The package notices describe the handset return correction and the limits of interrupted spring comparisons.
