# Astro animated icons

Animated Lucide icons for Astro, with static SVG output and Motion animations managed by Web Components.

The first consumer is [Victor's portfolio](https://github.com/pommito/portfolio-2026). The project is intended to become an independent open-source package.

## Status

The local pilot implements `ArrowLeft` and `MapPin` in `@grave/animated-icons`. It is linked into the portfolio's article back link. The package remains private and unpublished. A root license must be chosen before publication.

Agents should start with [AGENTS.md](AGENTS.md).

## Usage

Use the shared named-export entry point in an Astro component:

```astro
---
import { ArrowLeft } from "@grave/animated-icons/astro";
---

<a href="/blog/">
  <ArrowLeft size={16} />
  Back to articles
</a>
```

For a location label, import `MapPin` from the same entry point:

```astro
---
import { MapPin } from "@grave/animated-icons/astro";
---

<p><MapPin size={16} /> Paris, France</p>
```

This label has no extra focus target. `MapPin` shares the props below and exports `MapPinIconHandle` for manual playback. Use `controlled` and wait for `customElements.whenDefined("grave-map-pin")` before calling `startAnimation()` or `stopAnimation()`.

The package owns the SVG and animation. Consumers do not register elements or import Motion. Astro emits the complete SVG in the initial HTML, then loads the rendered icon's registration script for `<grave-arrow-left>` or `<grave-map-pin>`. The browser attaches behavior to the existing markup. No hydration directive is needed.

| Prop | Default | Behavior |
| --- | --- | --- |
| `size` | `28` | Numeric SVG width and height in pixels, matching the React reference |
| `class` | None | Class on the custom-element wrapper |
| `class:list` | None | Astro class-list directive, resolved into the wrapper's class |
| `style` | None | CSS string or Astro style object on the wrapper |
| `id`, `title`, `data-*`, other HTML attributes | None | Passed to the wrapper, including Astro's parent style scope |
| `label` | None | Accessible SVG label for a meaningful standalone icon |
| `controlled` | `false` | Disables automatic hover so a client script controls playback |

The React reference exposes `size`, HTML wrapper attributes, and the `startAnimation()` and `stopAnimation()` ref methods. This adapter uses Astro's `class` instead of React's `className`. `controlled` replaces the controlled mode that React activates when a ref is attached. `label` supplies an accessible SVG name. Keep React callback props such as `onMouseEnter` out of Astro frontmatter; attach browser listeners in a client script instead.

The SVG uses `currentColor` and a stroke width of two viewBox units, as in the reference. Set the color through an inherited text color, a class, or `style={{ color: "rebeccapurple" }}`. `color` and `strokeWidth` are no longer dedicated icon props. Use `size` for SVG dimensions; a size class on the wrapper does not resize the SVG.

Icons are decorative by default and have no keyboard tab stop. Keep the name and focus on the containing link or button. Use `label` when the icon itself needs an accessible name. HTML accessibility attributes apply to the wrapper; `label` names the inner SVG.

Control an icon from a client script with the same method names as the React handle:

```astro
---
import { ArrowLeft } from "@grave/animated-icons/astro";
---

<ArrowLeft id="manual-arrow" controlled />
<button id="replay" type="button">Replay</button>

<script>
  import type { ArrowLeftIconHandle } from "@grave/animated-icons/astro";

  await customElements.whenDefined("grave-arrow-left");
  const icon = document.querySelector<HTMLElement & ArrowLeftIconHandle>("#manual-arrow")!;
  document.querySelector("#replay")!.addEventListener("click", () => {
    icon.startAnimation();
  });
</script>
```

`startAnimation()` starts the icon's recipe. `ArrowLeft` completes one cycle; `MapPin` stays raised until stopped. `stopAnimation()` returns it to rest over 120 ms. Both methods return `void`. The package exports the `ArrowLeftIconHandle` and `MapPinIconHandle` types. Wait for registration before calling either method on an element inserted before its registration script runs.

## Motion and lifecycle

The nearest `a[href]` or `button` triggers one hover animation. Without a containing control, the wrapper itself triggers hover, as in the React reference. A controlled icon only responds to its playback methods. Mouse hover works even when touch is the primary input. Touch contact and keyboard focus do not trigger automatic playback.

The arrowhead moves three SVG units to the right while the shaft shortens, then both return over 400 ms. The shaft's path runs from x=19 to x=5. Its length comes from `getTotalLength()`. A five-unit retraction moves its visible left endpoint to x=10, matching Lucide Animated's path recipe. Animating `stroke-dasharray` preserves the stroke thickness and rounded caps at each size. The fixed right endpoint stays at x=19.

`motion/mini` drives both recipes through the Web Animations API. It animates ArrowLeft's head transform and shaft dash. Retriggering starts from the current drawing. Leaving the hover target returns the drawing over 120 ms. There is no autoplay. Future icons should use the Motion API their recipe needs; path morphing may require the hybrid API.

MapPin translates the whole SVG through y=0, -5, and -3 px over 500 ms, with offsets 0, 0.6, and 1. Easing applies to each segment so the pin reaches -5 px at 300 ms. Moving the SVG keeps the same travel in screen pixels at 14, 16, 24, and 28 px, as in the upstream recipe. Shared SVG overflow keeps the drawing visible.

The inner circle starts hidden when playback starts. After 300 ms, opacity reaches one over 100 ms while its stroke dash grows from zero to the complete circumference and its negative half-circumference offset returns to zero over 500 ms. `getTotalLength()` maps the source's normalized path values to native SVG dash styles without the hybrid Motion API. The raised pin and full circle stay visible until hover ends or `stopAnimation()` runs. Returning replaces every animation, including delayed circle tracks, and restores the complete drawing over 120 ms. Removal and reduced-motion changes cancel every track and restore it immediately.

Under `prefers-reduced-motion: reduce`, both icons stay static, including manual playback. Changing the preference during playback cancels the animation and restores the drawing. The consumer's control continues to provide its normal color and focus feedback.

Both icons use the lifecycle and trigger code in `src/element.ts`. Each instance attaches listeners in `connectedCallback()`. `disconnectedCallback()` aborts those listeners and cancels its animations. Reconnection finds the current containing control. Each new playback stops and cancels the previous controls while preserving their current pose. A playback identifier prevents queued completion callbacks from clearing a newer playback, and removes late style writes after reset. Template clones work both before and after custom-element registration. Use the Astro component to create the template's SVG, rather than supplying SVG markup yourself.

`src/icon.css` contains the shared wrapper and SVG styles. Keep drawing-specific settings with the rendered drawing or client recipe. Astro can collect styles from unused components imported through an export barrel, so per-icon `<style>` blocks would make the catalogue's CSS accumulate on consumer pages.

## Local development

Use Node.js 22.12 or later and pnpm 12.5.1. The peer range is Astro `^7.2.10`. The test fixture uses Astro 7.3.8; the portfolio integration uses Astro 7.2.10. The lockfile currently resolves Motion 13.5.1.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:build
pnpm test
pnpm inspect:bundle
```

The tests use installed Google Chrome through Playwright's `chrome` channel. Install Chrome, or run `pnpm exec playwright install chrome` if it is absent. The test server uses port 45321. Astro's `--ignore-lock` flag keeps that server in the foreground under an agent so Playwright can manage its lifetime.

`tests/fixtures/astro` is a minimal consumer for automated browser tests and bundle measurements. It has no presentation stylesheet or visual-demo interface. `pnpm test:build` compiles its pages. Playwright builds and serves them automatically when running `pnpm test`.

An optional visual playground can live in the ignored `apps/playground` directory. It is local tooling, excluded from the shared workspace and repository. The package's tests and checks do not require it. A public demo can be added when the package and its design are ready.

The package exports its Astro and TypeScript source. The consumer's Astro build compiles it, so there is no separate library compilation or watcher. Run `pnpm install` in this repository first so the linked package can resolve Motion. Restart the consumer dev server if it does not notice a linked source change.

## Portfolio integration

With this repository at `Developer/product/astro-animated-icons` and the portfolio at `Developer/me/portfolio-new`, run this command from the portfolio root:

```sh
pnpm --filter @portfolio/web add '@grave/animated-icons@link:../../../../product/astro-animated-icons/packages/animated-icons'
```

The path resolves from the portfolio's `apps/web/package.json`. Its article back link uses `<ArrowLeft size={14} />`, preserving its destination, translated label, and classes. Validate the consumer with `pnpm check`, `pnpm build`, and `pnpm test apps/web/test/site-output.test.ts`. Its build fixture lives under `.astro` because Astro 7 misresolves external component virtual modules when the fixture and linked source have no shared filesystem ancestor beyond the root.

## Verification and limits

Browser tests check both icons on the built fixture pages with JavaScript disabled, hover compression and return, independent instances, insertion before and after registration, cancellation on removal, reconnection to a different control, rapid retriggering, touch input, mouse input with a touch primary pointer, and reduced-motion changes during playback. MapPin tests also check its delayed reveal, held state, early leave, manual stop, removal, reduced-motion cancellation, and pixel travel at small sizes. API checks cover scoped classes, HTML attributes, inline styles, the default size, standalone hover, and manual playback. Astro and TypeScript checks cover the package, test fixture, and test code.

On 2026-10-15, `pnpm check` completed with zero errors, warnings, or hints in Astro diagnostics, and TypeScript exited successfully. `pnpm test --workers=1` reported `33 passed` in Chrome. The regressions include queued finish events followed by restart, stopping during or after that restart, and removal before the old finish callbacks run. Stopping leaves four return tracks rather than overlapping old and new tracks, then restores the complete drawing. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

After `pnpm test:build`, `pnpm inspect:bundle` reads the fixture's production HTML and reports external entry scripts, imported JS chunks, raw and gzip sizes, inline scripts, and CSS bytes. `/plain/` must have no scripts or CSS. `/single/` must have one external icon script and no inline script. The browser-test page adds a script for dynamic instances and manual control.

The fixture has a private barrel containing `ArrowLeft` and a test-only `BundleProbe`. `/selective/` renders only `ArrowLeft`; `/probe/` renders only the probe. Bundle inspection verifies that they share the same base CSS and exclude the unused element's registration code. This covers two static exports in Astro 7.3.8. `/map-pin-single/` renders only `MapPin`; `/both/` renders both real icons. Inspection verifies that either icon alone excludes the other registration, both reuse the same base CSS, and the browser code excludes React. It prints every imported JS chunk with raw and gzip bytes. Repeat the measurement with further recipes when adding `Copy` and `Check`.

A production build with Astro 7.3.8 and Motion 13.5.1 produced these totals. Gzip totals sum the individually compressed chunks.

| Route | External entries | Imported JS chunks | Raw JS bytes | Gzip JS bytes | CSS bytes |
| --- | --- | --- | --- | --- | --- |
| `/plain/` | 0 | 0 | 0 | 0 | 0 |
| `/single/`, ArrowLeft | 1 | 2 | 9,991 | 4,026 | 123 |
| `/map-pin-single/`, MapPin | 1 | 2 | 10,187 | 4,086 | 123 |
| `/both/` | 2 | 3 | 10,853 | 4,502 | 123 |

The shared `animate-style.Cls85PvT.js` chunk contains Motion and the shared lifecycle, totaling 9,325 raw bytes and 3,610 gzip bytes. `ArrowLeft.astro_astro_type_script_index_0_lang.DjFqHKpn.js` adds 666 raw bytes and 416 gzip bytes. `MapPin.astro_astro_type_script_index_0_lang.D87_ibfr.js` adds 862 raw bytes and 476 gzip bytes. Chunk hashes can change on rebuild.

Browser behavior has been checked in Chrome. Firefox and Safari remain unverified. An ArrowLeft peak-frame comparison at 14, 16, 24, and 28 px retains small antialiasing differences between the dashed shaft and the reference's shortened path. The ignored local playground has a `/map-pin/` comparison at 14, 16, 24, and 28 px. It pairs the Astro adapter with a native keyframe reproduction of the upstream recipe, with play and stop controls. A Chrome comparison at 150, 300, 400, 550, and 800 ms matched translation, opacity, normalized dash length, and normalized dash offset at all four sizes. It does not execute the upstream React component. Start it with `pnpm --dir apps/playground dev` when the local playground is present. The committed `/map-pin/` browser fixture also provides hover and manual controls without a presentation stylesheet. Visual acceptance belongs to Victor, including the movement at small sizes.

## Attribution

The SVG derives from Lucide and Feather. The animations adapt Lucide Animated's [ArrowLeft recipe](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx) and [MapPin recipe](https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx). Applicable ISC and MIT notices are preserved in [the package notices](packages/animated-icons/THIRD_PARTY_NOTICES.md). Motion remains a package dependency under its own license.
