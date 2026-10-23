# Architecture

Read this when changing rendering, recipes, or lifecycle behavior. The consumer API is documented in [README.md](../README.md#usage).

Paths beginning with `src/` below are relative to [packages/animated-icons/](../packages/animated-icons).

## Rendering and recipe protocol

All icons use the lifecycle and trigger code in `src/element.ts`. Each instance attaches listeners in `connectedCallback()`. `disconnectedCallback()` aborts those listeners and cancels its animations. Reconnection finds the current containing control. Each new playback stops and cancels the previous controls while preserving their current pose. A playback identifier prevents queued completion callbacks from clearing a newer playback, and removes late style writes after reset. Template clones work both before and after custom-element registration. Use the Astro component to create the template's SVG, rather than supplying SVG markup yourself.

`src/icon.css` contains the shared wrapper and SVG styles. Keep drawing-specific settings with the rendered drawing or client recipe. Astro can collect styles from unused components imported through an export barrel, so per-icon `<style>` blocks would make the catalogue's CSS accumulate on consumer pages.

`src/Icon.astro` owns the common props, wrapper attributes, SVG defaults, and accessible name. Each icon's Astro adapter supplies its fixed custom-element tag and drawing, including the drawing's `<g>` and origin styles. Its registration script stays in that adapter so rendering one icon loads only that icon's behavior. The shared module has no registration script.

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

## Reuse and icon boundaries

Each direct directory in `src/icons/` contains one exported icon. `src/shared/` contains mechanisms used by at least two icons, including [arrow.ts](../packages/animated-icons/src/shared/arrow.ts) and [diagonal-arrow.ts](../packages/animated-icons/src/shared/diagonal-arrow.ts). Reuse these mechanisms when they fit, and keep geometry, origins, and transition choices in the icon's own files.

For a particular icon's geometry, timing, finish policy, and interrupted returns, read its `definition.ts` alongside its drawing baseline under [tests/helpers/](../tests/helpers). Follow [Validation](validation.md) for automated checks and manual review. Use its comparison page under [the Astro fixture](../tests/fixtures/astro/src/pages) when present. A comparison may use an independent native reference instead of running the upstream component, so check what it actually establishes.

## Loading contract

[The bundle inspector](../scripts/inspect-bundle.mjs) applies one contract to single-icon and combined routes. It checks registrations, script counts, shared CSS, absence of React, and exact chunk unions for combined routes. It also checks agreement between icon directories, Astro exports, and single-icon cases.

The inspector reads the same catalogue as the drawing checker. It caches each chunk's source and byte and gzip sizes for one inspection. A later inspection reads the files again, including any changes made by a test.

Its [negative tests](../scripts/inspect-bundle.test.mjs) share one temporary copy of the built fixture and restore each modified file after its check. See [contribution validation](../CONTRIBUTING.md#validate-the-change) for the commands. Past measurements are preserved in [the dated verification record](history/2026-10-16-verification.md).

## CSS playback

Folder also uses the shared CSS cycle adapter. Its cycle targets the folder path and defines a separate 200 ms return duration. Optional return timing falls back to entry timing for existing recipes. The drawing and entry data are shared with a fixture-only Motion reference at `/folder-css/`; the reference retains the previous spring return to expose the intentional behavior change.

Bell and ChevronRight use generated CSS keyframes through the public adapters. Their cycle.ts files also drive fixture-only Motion references with distinct tags. CssIcon.astro emits each rendered cycle once per request and marks its style element by recipe. On connection and before playback, the CSS adapter reuses an active marked sheet or generates the missing sheet in the owning document. It removes duplicate marked sheets when a later template brings its server sheet into the document. This covers independent template clones when the server sheet remains in another inert template. Server emission and client recovery use the same generator. The CSS track adapter reuses element.ts and captures the rendered transform before interruption. Bell replays from that pose; ChevronRight restarts from zero and restores on completion. LoaderCircle keeps Motion. The dated [parity follow-up](history/2026-10-23-css-parity.md) records the preceding pilot and its limits.
