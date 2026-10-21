# Validation coverage

Select validation by the mechanism changed. Ordinary icon work checks that icon's drawing and wiring through the production fixture, then reuses existing behavior coverage. Add a browser test when a new mechanism or a reproduced failure needs one.

## Required workflows

| Change | Command | Completion criterion |
| --- | --- | --- |
| An icon using existing mechanisms | `pnpm validate:icon activity` | Types, current production output, bundle integrity, every recorded drawing, production registrations, and any retained regression suite for that icon pass. Replace `activity` with one or more affected slugs. |
| Shared pointer, manual control, props or accessible rendering | `pnpm validate:shared triggers` | Shared input, API, reduced-motion and template cases pass. |
| JavaScript path morphing | `pnpm validate:shared morph` | Archive, square shaft, Rocket and Accessibility cases preserve pose and cancel actual path/frame work. |
| SVG transforms, paint, springs or repeating tracks | `pnpm validate:shared tracks` | Interrupted opacity, loop bridges, repeated delays, cycle boundaries, paint and cleanup representatives pass. |
| Sequencing and queued stages | `pnpm validate:shared sequence` | ScanText's stage barrier, ScanFace's hidden phase and Volume's queued branch cases pass. |
| Animated SVG attributes | `pnpm validate:shared attributes` | Moving endpoints and retained stroke width restore correctly. |
| Central lifecycle or track protocol | `pnpm validate:shared lifecycle` | Every retained mechanism and regression passes. This is a representative suite, rather than a catalogue interaction matrix. |
| Exports, dependencies, distribution, fixture preparation or validation scripts | `pnpm validate:distribution` | Types, output integrity, bundle and drawing checks, validator negative tests, fixture cache tests, production registrations and public API cases pass. Also select a shared mechanism if behavior changes. |
| A release or a change affecting all mechanisms | `pnpm validate` | All current static checks, validator checks and retained browser cases pass. |

Several mechanisms can be named in one command, for example `pnpm validate:shared morph tracks`. The runner deduplicates suite files and prepares the fixture once. Use `--workers=2` to set browser concurrency. An unknown mode, mechanism or icon fails before validation starts.

For a geometry or timing edit, use the icon workflow. A change to an existing shared helper uses the corresponding shared workflow. A new runtime mechanism requires a focused test and an entry in `scripts/validate.mjs` so the normal icon workflow selects its regression. Adding or changing consumer fixtures, public exports, a source name or a deletion also uses the distribution workflow.

During debugging, run the smallest relevant existing suite, for example `pnpm test tests/common-utilities.spec.ts --workers=2`. Complete the applicable workflow before finishing. Documentation-only edits require checking referenced commands, paths and anchors.

## Every icon without an interaction matrix

`pnpm test:drawings` checks built HTML without Chrome. It verifies the native link, destination, custom-element tag, complete shape count, expected geometry and attributes, decorative SVG defaults, and a labeled SVG. Expected geometry comes from the existing family data in `tests/helpers/`. `standalone-drawings.json` preserves the initial drawings of the sixteen earlier icons that lacked family data. Those sixteen baselines were captured from the unchanged production output before this test reduction. They are recorded output, not independent upstream renders.

The checker requires drawing baselines to agree with public exports. It combines the existing overlapping FolderGit expectations. A new icon needs a drawing entry; removing a baseline cannot silently reduce coverage. The negative tests reject missing paths, changed coordinates, a wrong element tag, a broken destination and a missing label.

Update expected geometry for an intended drawing change and review that baseline diff. The checker never regenerates its own expectations.

The HTML check does not execute CSS, calculate painted bounds or verify animation targets. Keep the API rendering representatives and manual visual review for those responsibilities.

`pnpm inspect:bundle` retains the existing global checks for icon directories, public exports and single-icon routes. It checks registrations, script counts, shared CSS, selective loading, absence of React in consumer bundles and exact chunk unions for combined routes. Its negative tests still modify temporary copies of output. These checks remain global because membership and loading relationships cross icon boundaries.

`tests/catalog.spec.ts` loads the production entry modules from every existing single-icon route in one browser page. It checks that every public custom element registers and exposes the public playback methods, with no page errors. It does not repeat hover, interruption or timing scenarios for each icon. The initial drawings are checked separately in HTML. Loading all modules together does not prove isolation; the bundle inspector checks each single-icon dependency graph.

## Shared behavior and regressions

The test bodies retain their behavioral assertions and timeouts. Reductions remove repeated parameter rows or whole redundant scenarios. The following representatives protect distinct mechanisms:

| Suite | Reason to retain it |
| --- | --- |
| `api.spec.ts` | Public attributes, size, scoped styles, labels and manual control. Four rendering adapters exercise native tracks, path morphing, SVG attributes and custom stroke settings. |
| `accessibility.spec.ts` | Reduced motion at load and during playback for ArrowLeft, FolderHeart's loop and ScanFace's queued stage. Touch, keyboard and mouse-on-touch input rules run once against the shared controller. |
| `lifecycle.spec.ts` | The common element upgrades templates before registration, isolates instances and rebinds listeners after reconnection. Custom JS mechanisms retain their own lifecycle observations below. |
| `arrow-left.spec.ts` and `check.spec.ts` | Browser rendering without JavaScript, actual native link navigation, visible native-track geometry, queued completion cleanup and a consumer's asynchronous success action. |
| `archive.spec.ts` | Motion values, path morphing and interrupted spring velocity, with real paths observed after stop, removal, reduced motion and reconnection. |
| `commands.spec.ts` | JavaScript SVG endpoint animation, template upgrade and listener rebinding. Native animation counts alone cannot establish attribute cleanup. |
| `common-utilities.spec.ts` | Accessibility's actual idle path after interrupted morphs; early and late cancellation; UsersRound's resolved opacity spring during stop and replay, and after partial or complete track completion; BotMessageSquare's consumed delay on later loop cycles. SquareActivity and CursorClick retain their distinct target and transition regressions. |
| `sorting-trends.spec.ts` | One square-arrow direction observes morphed shaft paths and stopped animation frames in entry and return. Glyph swaps, held reveals and completed-reveal replay have separate cases. Other directions reuse the same mechanism and retain their drawing baselines. |
| `transport-routes.spec.ts` | Rocket combines a reversing morph loop and JS frames. Its cancellation cases observe the actual path and frame count after cleanup, including reconnection. |
| `design-tools.spec.ts` | ScanText waits for every erase track before redraw. Stop, replay, removal and reduced motion are checked in both real stages. Other sequence users reuse this barrier coverage. |
| `media-icons.spec.ts` | Volume replaces SVG branches asynchronously and must cancel queued replacements. Partial-stroke continuity, repeated stop, templates and reconnection need branch observations. Airplay retains its automatic return case. |
| `health-science.spec.ts` | Interrupted native transform, scale, paint and path loop bridges return to their original cycles. Ambulance checks cancellation of the pending cycle on stop, removal and reduced motion. |
| `loading-view.spec.ts` | Loader checks a late-cycle angle and the loop boundary, then removal and reconnection. CircleDashed covers replay of completed opacity tracks. FilePenLine retains both sides of its finite-repeat boundary. |
| `food-plants.spec.ts` | Coffee covers delayed steam-loop cleanup and reconnection. CupSoda combines a finite track with independent hidden bubble loops. |
| `text-formatting.spec.ts` | Bold observes actual stroke width through interruption and cleanup. |
| `devices.spec.ts` | Keyboard has a random per-key recipe and an immediate reset, distinct from shared return animations. |
| `security-icons.spec.ts` | ScanFace's hidden phase and queued return cancel correctly on removal. |
| `connectivity-question.spec.ts` | WifiLow's text remains continuous when stopped during show, hold or hide. |

Representative tests cover mechanisms, not every possible recipe parameter. A malformed selector or icon-specific timing mistake can still escape a shared test. The production registration and drawing checks catch wiring and static-output failures; manual review of changed icons checks the animation itself.

## Adding or changing a test

1. Name the failure the test should catch and identify its owner in `src/element.ts`, `src/shared/`, or a custom recipe.
2. Read the existing representative for that owner. Use it unchanged when the new icon adds only geometry, target choices or ordinary timing values.
3. For a reproduced defect, keep the smallest case that fails on that defect. Observe the path, attribute, opacity, branch, frame work or native animation that proves the failure. A state flag alone does not prove visible cleanup.
4. For a new mechanism, add one representative and connect its suite to the appropriate shared scope and affected icon in `scripts/validate.mjs`. Keep assertions for genuinely different stages or completion orders.
5. For a new icon, update its existing family drawing data and consumer bundle fixtures. Review the comparison fixture manually for start, interruption, stop and replay at the intended size.

Choose parameter rows for distinct failure classes. An early opacity spring and a completed opacity track differ. Stop, removal and a motion-preference change have different entry points. Repeating all those cases for every icon, every arbitrary millisecond and every size does not add another mechanism.

Comparison fixtures and pinned upstream sources remain available for visual review. Automated four-size, many-time React comparison matrices have been removed. This gives up catalogue-wide numerical fidelity checks. Review changed drawings and motion in the existing comparison pages; add a numerical regression only when a concrete defect needs it. Visual acceptance belongs to the user.

## Fixture reuse and verification records

`pnpm test:prepare` builds missing or stale production output. `pnpm test` and all validation workflows reuse matching output. `pnpm test:build` and `pnpm test:fresh` deliberately force a rebuild for dependency or build inputs outside the tracked cache contract.

The preparation command hashes package and fixture sources, imported helper data, manifests, lockfiles, installed dependency metadata, Node version and the build environment. It verifies output content as well as inputs. Source changes during a build reject that result. Stop the preview before rebuilding; a checkout's fixture lock protects served output.

`pnpm check` retains package and consumer Astro checks and TypeScript checking of the browser tests. The icon workflow and the morph, tracks, sequence and attributes scopes check the package and browser-test types. The triggers, lifecycle and distribution workflows also type-check all consumer fixtures. This defers fixture-only type errors during a geometry edit; changes to fixtures or public exports require distribution validation.

`pnpm test:bundle`, `pnpm test:fixture` and `pnpm test:drawing-checker` validate the distribution and validation machinery. The distribution workflow includes them; ordinary icon work uses their established assertions without repeating their negative tests.

Record validation commands, case counts, elapsed time, build reuse, failures and remaining uncertainty in the change evidence. Separate shell elapsed time, Playwright duration and build cost. Past entries in `docs/history/` are historical evidence, not current test requirements. See [the reduction record](history/2026-10-21-lean-validation.md) for the before/after measurements.
