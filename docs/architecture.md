# Architecture

Read this when changing rendering, recipes, or lifecycle behavior. The consumer API is documented in [README.md](../README.md#usage).

Paths beginning with `src/` below are relative to [packages/animated-icons/](../packages/animated-icons).

## Rendering and recipe protocol

All icons use the lifecycle and trigger code in `src/element.ts`. Each instance attaches listeners in `connectedCallback()`. `disconnectedCallback()` aborts those listeners and cancels its animations. Reconnection finds the current containing control. Each new playback stops and cancels the previous controls while preserving their current pose. A playback identifier prevents queued completion callbacks from clearing a newer playback, and removes late style writes after reset. Template clones work both before and after custom-element registration. Use the Astro component to create the template's SVG, rather than supplying SVG markup yourself.

`src/icon.css` contains the shared wrapper and SVG styles. Keep drawing-specific settings with the rendered drawing or client recipe. Astro can collect styles from unused components imported through an export barrel, so per-icon `<style>` blocks would make the catalogue's CSS accumulate on consumer pages.

`src/Icon.astro` owns the common props, wrapper attributes, SVG defaults, and accessible name. Each icon's Astro adapter supplies its fixed custom-element tag and drawing, including the drawing's `<g>` and origin styles. Its registration script stays in that adapter so rendering one icon loads only that icon's behavior. The shared module has no registration script.

Each `src/icons/<name>/definition.ts` exports an internal recipe with three responsibilities:

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

Each icon selects its mechanism inside the package. Consumers use the same Astro component and playback handle. CSS keyframes still require JavaScript for triggers, manual playback, interruption, and cleanup. The shared lifecycle owns those behaviors for both engines.

A CSS recipe keeps its values, offsets, timing, target, replay policy, and finish policy in one definition. The server generates CSS from that definition. A fixture reference may consume the same definition through Motion, but reference adapters belong to fixtures and must not enter consumer bundles.

The CSS adapter implements the existing track protocol. Before replacing playback, it captures the rendered pose. The recipe determines whether entry restarts at zero or uses that pose. Return begins at the captured pose. Completion and stale callbacks still pass through the shared lifecycle. Clear removes playback state, temporary custom properties, and retained transforms.

Generated styles must be emitted only for rendered recipes and deduplicated within a render. Avoid per-icon static style blocks collected from unused barrel imports. Keep engine code selective too; an unrelated Motion recipe must not cause the full catalogue to load.

The [migration plan](css-migration-plan.md) records family decisions. LoaderCircle retains Motion because its interrupted return uses a spring with inherited angular velocity.

## Reuse and icon boundaries

Each direct directory in `src/icons/` contains one exported icon. `src/shared/` contains mechanisms used by at least two icons, including [arrow.ts](../packages/animated-icons/src/shared/arrow.ts) and [diagonal-arrow.ts](../packages/animated-icons/src/shared/diagonal-arrow.ts). Reuse these mechanisms when they fit, and keep geometry, origins, and transition choices in the icon's own files.

For a particular icon's geometry, timing, finish policy, and interrupted returns, read its `definition.ts` alongside its drawing baseline under [tests/helpers/](../tests/helpers). Follow [Validation](validation.md) for automated checks and manual review. Use its comparison page under [the Astro fixture](../tests/fixtures/astro/src/pages) when present. A comparison may use an independent native reference instead of running the upstream component, so check what it actually establishes.

## Loading contract

[The bundle inspector](../scripts/inspect-bundle.mjs) applies one contract to single-icon and combined routes. It checks registrations, script counts, shared CSS, absence of React, and exact chunk unions for combined routes. It also checks agreement between icon directories, Astro exports, and single-icon cases.

The inspector reads the same catalogue as the drawing checker. It caches each chunk's source and byte and gzip sizes for one inspection. A later inspection reads the files again, including any changes made by a test.

Its [negative tests](../scripts/inspect-bundle.test.mjs) share one temporary copy of the built fixture and restore each modified file after its check. See [contribution validation](../CONTRIBUTING.md#validate-the-change) for the commands. Past measurements are preserved in [the dated verification record](history/2026-10-16-verification.md).

## CSS playback

Bell and ChevronRight use generated CSS keyframes through the public adapters. Their cycle.ts files also drive fixture-only Motion references with distinct tags. CssIcon.astro emits each rendered cycle once per request. The CSS track adapter reuses element.ts and captures the rendered transform before interruption. Bell replays from that pose; ChevronRight restarts from zero and restores on completion. LoaderCircle keeps Motion. The dated [parity follow-up](history/2026-10-23-css-parity.md) records the preceding pilot and its limits.
