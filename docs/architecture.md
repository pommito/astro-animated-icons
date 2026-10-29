# Architecture

Read this when changing rendering, recipes, or lifecycle behavior. The consumer API is documented in [README.md](../README.md#usage).

Paths beginning with `src/` below are relative to [packages/animated-icons/](../packages/animated-icons).

## Rendering and recipe protocol

All icons use the lifecycle and trigger code in `src/element.ts`. Each instance attaches listeners in `connectedCallback()`. `disconnectedCallback()` aborts those listeners and cancels its animations. Reconnection finds the current containing control. Each new playback stops and cancels the previous controls while preserving their current pose. A playback identifier prevents queued completion callbacks from clearing a newer playback, and removes late style writes after reset. Template clones work both before and after custom-element registration. Use the Astro component to create the template's SVG, rather than supplying SVG markup yourself.

`src/icon.css` contains the shared wrapper and SVG styles. Keep drawing-specific settings with the rendered drawing or client recipe. Astro can collect styles from unused components imported through an export barrel, so per-icon `<style>` blocks would make the catalogue's CSS accumulate on consumer pages.

`src/Icon.astro` owns the common props, wrapper attributes, SVG defaults, and accessible name. Each icon's Astro adapter supplies its fixed custom-element tag and drawing, including the drawing's `<g>` and origin styles. Motion registration scripts stay in the icon adapters. CSS registration scripts belong to `CssIcon.astro` and `CssOpacityIcon.astro`, so icons using the same mechanism share an entry. The base `Icon.astro` has no registration script.

Each `src/icons/<name>/definition.ts` exports an internal recipe with these responsibilities:

- Optional `connect(host)` prepares document resources when an instance connects.
- `finish` declares whether completed entry restores the drawing or holds its final pose.
- `animate(drawing, returning, track)` registers the animation tracks.
- `clear(drawing)` restores the drawing, including any attributes or retained motion state.

The lifecycle module owns the track count, cancellation, and completion ordering. A track factory receives one completion callback and returns its `stop()` and `cancel()` operations. It reports completion when that track finishes. A native SVG track can use Motion mini directly:

```ts
track((onComplete) => animate(path, { opacity: [0, 1] }, {
  duration: 0.1,
  onComplete,
}));
```

The recipe does not count tracks or decide when to clear a whole playback. A completed return always restores the drawing. Callbacks from an older playback cannot clear a newer one, but can repair late writes after reset. The lifecycle also accepts factories with custom stop and cancel operations, preserving Archive's Motion values and the velocity sampling used by interrupted springs.

## Internal animation engines

[ADR 0001](adr/0001-combined-finite-transforms.md) proposes independent property channels for combined finite transforms. Owner architecture review is pending. The [pre-implementation evidence](history/2026-10-29-combined-transform-decision.md) captures KeySquare, Wallet, and KeyCircle on Motion before recipe extraction. The current mechanisms below are unchanged.

The [playback vocabulary](../GLOSSARY.md) distinguishes the displayed pose from the retained property pose used by interrupted combined transforms.

Each icon selects its mechanism through imports inside the package. Consumers use the same Astro component and playback handle. There is no catalogue-wide client registry or engine prop. CSS keyframes still require JavaScript for triggers, manual playback, interruption, and cleanup. The shared lifecycle owns those behaviors for both engines.

Finite transforms keep their data in `src/icons/<name>/cycle.ts`. [FiniteTransformCycle](../packages/animated-icons/src/shared/finite-transform-cycle.ts) describes one target and one rotation or translation property, values, offsets, entry and optional return timing, replay policy, and finish policy. [CssIcon.astro](../packages/animated-icons/src/CssIcon.astro) renders the drawing and generated styles. The [CSS cycle adapter](../packages/animated-icons/src/shared/css-cycle.ts) implements the track protocol.

Before replacing playback, the adapter captures the displayed transform. Bell and CircleHelp replay from that pose. Finite chevrons and folder translations restart at their first explicit value. Return starts at the displayed pose. ChevronFirst has a 600 ms entry and a 300 ms return with different easing. The other finite chevrons use 500 ms entry and return. Finite chevrons restore on completion; Bell, folder translations, and CircleHelp hold their completed pose. Clear removes playback attributes, captured-pose variables, retained transforms, and temporary origins.

UserRoundCog uses the same adapter for `[data-cog]`, with a positive 180-degree rotation, 300 ms easeOut entry and return, current-pose replay, and hold completion. Its drawing owns the unchanged fill-box center origin.

Folder uses the same adapter for a path rotation with current-pose replay and hold completion. It has a 400 ms entry and a separate 200 ms return. Optional return timing falls back to entry timing for other recipes. Its fixture-only Motion reference at `/folder-css/` shares the drawing and entry data, but retains the previous spring return to expose the intentional behavior change accepted in [PR #92](https://github.com/pommito/astro-animated-icons/pull/92).

CalendarDays and CircleDashed keep their opacity data in `parts.ts`. [CssOpacityIcon.astro](../packages/animated-icons/src/CssOpacityIcon.astro) uses the [opacity compiler](../packages/animated-icons/src/shared/opacity-css.ts) and [track adapter](../packages/animated-icons/src/shared/css-opacity.ts). Each target has its own delay, duration, completion state, and captured opacity. An interrupted active target resumes from its displayed value; a finished target restarts from the declared entry value. Cancelling one target does not cancel the other targets before their poses have been captured.

Motion mini eases the whole opacity effect, while CSS eases each interval. The opacity compiler splits the original cubic Bezier into equivalent interval offsets and easing. Playback does not sample the curve. Both engines still report track completion to the shared lifecycle, which guards newer playback against stale callbacks.

### Generated styles and templates

Astro renders complete initial SVG regardless of engine. The CSS wrappers emit marked inline styles only for rendered recipes, using request-local sets to deduplicate repeated instances. Static per-icon style blocks would let unused barrel imports accumulate CSS. Unused imports may retain the common wrapper CSS, but must add no recipe CSS or registration script.

The [shared stylesheet helper](../packages/animated-icons/src/shared/recipe-css.ts) also runs on connection and before playback. A style in an inactive template is unavailable to an independently cloned drawing. The helper finds an active marked sheet or regenerates it in the drawing's document. It reconciles late sheets when the original template is mounted. Each mechanism's compiler therefore reaches the browser for recovery as well as running during server rendering. Opacity imports the recovery helper directly, so it does not need the transform compiler. Include that code in payload measurements.

Fixture-only Motion references consume the same recipe data and drawings through the previous mechanisms. They compare the refactor with its preceding local implementation; they do not execute upstream React components. References remain outside consumer imports. The [migration plan](css-migration-plan.md) records family decisions and retained Motion behavior.

## Reuse and icon boundaries

Each direct directory in `src/icons/` contains one exported icon. `src/shared/` contains mechanisms used by at least two icons, including [arrow.ts](../packages/animated-icons/src/shared/arrow.ts) and [diagonal-arrow.ts](../packages/animated-icons/src/shared/diagonal-arrow.ts). Reuse these mechanisms when they fit, and keep geometry, origins, and transition choices in the icon's own files.

For a particular icon's geometry, timing, finish policy, and interrupted returns, read its `definition.ts` alongside its drawing baseline under [tests/helpers/](../tests/helpers). Follow [Validation](validation.md) for automated checks and manual review. Use its comparison page under [the Astro fixture](../tests/fixtures/astro/src/pages) when present. A comparison may use an independent native reference instead of running the upstream component, so check what it actually establishes.

## Loading contract

The CSS wrappers serialize the existing cycle or opacity data into each rendered host's `data-grave-cycle-recipe` or `data-grave-opacity-recipe` attribute. [The serializer](../packages/animated-icons/src/shared/recipe-data.ts) escapes angle brackets before Astro escapes the attribute. The complete SVG and generated stylesheet still render on the server. Recipe data remains defined once in `cycle.ts` or `parts.ts`; serialization creates no second maintained definition.

[Transform registration](../packages/animated-icons/src/shared/register-css-cycle.ts) and [opacity registration](../packages/animated-icons/src/shared/register-css-opacity.ts) each import only their own adapter. Their shared [discovery helper](../packages/animated-icons/src/shared/register-css.ts) reads rendered hosts and recursively scans inert templates. It defines each public tag once through the existing lifecycle factory. The `astro:page-load` event repeats discovery after Astro navigation. Later clones of a discovered icon reuse its registered class.

Every host carries complete recipe data so a clone mounted before registration still works after its source template and styles have been removed. Repeated instances share registration, runtime and generated styles, while their recipe attributes repeat in HTML. Whole-page compression accounts for that cost. No catalogue registry, build integration or consumer configuration is required.

The registration module must still load. A processed script held only in an inert template does not execute until its fragment is mounted. The removed-source fixture loads the bootstraps outside that template to isolate recipe-data and stylesheet recovery.

[The bundle inspector](../scripts/inspect-bundle.mjs) applies one contract to single-icon and combined routes. It checks registrations, script counts, shared CSS, absence of React, and exact chunk unions for combined routes. It also checks agreement between icon directories, Astro exports, and single-icon cases.

[The registration contract](../scripts/registration-contract.mjs) compares every serialized CSS record with its source data, rejects unused records, and verifies that the selected mechanism's bootstrap is reachable. Motion tags remain literal registrations in the JavaScript graph. Entry counts combine distinct CSS mechanisms with distinct Motion icons. Exact combined-route chunk unions still apply.

The inspector reads the same catalogue as the drawing checker. It caches each chunk's source and byte and gzip sizes for one inspection. A later inspection reads the files again, including any changes made by a test.

Its [negative tests](../scripts/inspect-bundle.test.mjs) share one temporary copy of the built fixture and restore each modified file after its check. See [contribution validation](../CONTRIBUTING.md#validate-the-change) for the commands. Past measurements are preserved in [the dated verification record](history/2026-10-16-verification.md).
