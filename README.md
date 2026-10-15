# Astro animated icons

Animated Lucide icons for Astro, with static SVG output and Motion animations managed by Web Components.

The first consumer is [Victor's portfolio](https://github.com/pommito/portfolio-2026). The project is intended to become an independent open-source package.

## Status

The local pilot implements `ArrowLeft`, `MapPin`, `Copy`, and `Check` in `@grave/animated-icons`. It is linked into the portfolio's article back link. The package remains private and unpublished. A root license must be chosen before publication.

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

Use `Copy` inside a native control:

```astro
---
import { Copy } from "@grave/animated-icons/astro";
---

<button type="button"><Copy size={16} /> Copy link</button>
```

`Copy` animates on hover and returns when hover ends. The consumer implements clipboard operations and success feedback. It shares the props below and exports `CopyIconHandle` for manual playback. Use `controlled` and wait for `customElements.whenDefined("grave-copy")` before calling the handle methods.

Use `Check` for a complete checkmark that reveals on hover:

```astro
---
import { Check } from "@grave/animated-icons/astro";
---

<Check size={16} label="Complete" />
```

For success feedback, use `controlled` and the exported `CheckIconHandle`. Wait for `customElements.whenDefined("grave-check")` before calling its methods. The checkmark is visible at rest, so the consumer must insert its template only after the operation succeeds. For example, await `navigator.clipboard.writeText()` before replacing Copy with Check and calling `startAnimation()`. On rejection, retain Copy and announce the error. Keep the button's accessible name stable and use a separate live status. The [consumer fixture](tests/fixtures/astro/src/pages/check.astro) demonstrates these boundaries with a promise that can be resolved or rejected manually. The icon does not access the clipboard, swap icons, or announce status.

The package owns the SVG and animation. Consumers do not register elements or import Motion. Astro emits the complete SVG in the initial HTML, then loads the rendered icon's registration script for `<grave-arrow-left>`, `<grave-map-pin>`, `<grave-copy>`, or `<grave-check>`. The browser attaches behavior to the existing markup. No hydration directive is needed.

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

`startAnimation()` starts the icon's recipe. `ArrowLeft` completes one cycle; `MapPin` stays raised and `Copy` keeps its shapes shifted until stopped. `Check` reveals and keeps the completed checkmark visible. `stopAnimation()` returns ArrowLeft and MapPin to rest over 120 ms; Copy returns with its spring; Check restores its full size and path over 300 ms with a 100 ms opacity transition. Both methods return `void`. The package exports the `ArrowLeftIconHandle`, `MapPinIconHandle`, `CopyIconHandle`, and `CheckIconHandle` types. Wait for registration before calling either method on an element inserted before its registration script runs.

## Motion and lifecycle

The nearest `a[href]` or `button` triggers one hover animation. Without a containing control, the wrapper itself triggers hover, as in the React reference. A controlled icon only responds to its playback methods. Mouse hover works even when touch is the primary input. Touch contact and keyboard focus do not trigger automatic playback.

The arrowhead moves three SVG units to the right while the shaft shortens, then both return over 400 ms. The shaft's path runs from x=19 to x=5. Its length comes from `getTotalLength()`. A five-unit retraction moves its visible left endpoint to x=10, matching Lucide Animated's path recipe. Animating `stroke-dasharray` preserves the stroke thickness and rounded caps at each size. The fixed right endpoint stays at x=19.

`motion/mini` drives the recipes through the Web Animations API. It animates ArrowLeft's head transform and shaft dash. Retriggering starts from the current drawing. Leaving the hover target returns ArrowLeft over 120 ms. There is no autoplay. Future icons should use the Motion API their recipe needs; path morphing may require the hybrid API.

MapPin translates the whole SVG through y=0, -5, and -3 px over 500 ms, with offsets 0, 0.6, and 1. Easing applies to each segment so the pin reaches -5 px at 300 ms. Moving the SVG keeps the same travel in screen pixels at 14, 16, 24, and 28 px, as in the upstream recipe. Shared SVG overflow keeps the drawing visible.

The inner circle starts hidden when playback starts. After 300 ms, opacity reaches one over 100 ms while its stroke dash grows from zero to the complete circumference and its negative half-circumference offset returns to zero over 500 ms. `getTotalLength()` maps the source's normalized path values to native SVG dash styles without the hybrid Motion API. The raised pin and full circle stay visible until hover ends or `stopAnimation()` runs. Returning replaces every animation, including delayed circle tracks, and restores the complete drawing over 120 ms. Removal and reduced-motion changes cancel every track and restore it immediately.

Copy translates the front rectangle by -3 on both axes and the back path by +3 in SVG coordinates. Screen travel scales with the SVG size. Motion's `spring` generator supplies stiffness 160, damping 17, and mass 1 to `motion/mini`, which converts the spring into native easing. Entry and return use the same spring. Entry holds the shifted drawing after completion. Interruption preserves the current position before starting the next spring; it does not inherit the previous spring's velocity. Removal and reduced-motion changes immediately cancel both tracks and clear their transforms.

Under `prefers-reduced-motion: reduce`, all icons stay static, including manual playback. Changing the preference during playback cancels the animation and restores the drawing. The consumer's control continues to provide its normal color and focus feedback.

Check reveals opacity from zero to one over 100 ms, grows its path from zero to the complete checkmark, and scales from 0.5 to one over 400 ms. All tracks use the source's ease-in-out curve. The path has an explicit `transform-box: fill-box` and `transform-origin: center`, so scaling uses its own center at SVG coordinates (12, 11.5). `getTotalLength()` converts the normalized reveal into native stroke dash lengths for `motion/mini`. Rounded caps and the two-unit stroke scale with the path, as in the source. Starting again replays the reveal from its initial keyframes; stopping preserves the current pose before returning. Removal and reduced-motion changes clear the three tracks and leave the complete checkmark visible. Under reduced motion, a consumer still inserts Check after success, without a drawing or scale effect.

All icons use the lifecycle and trigger code in `src/element.ts`. Each instance attaches listeners in `connectedCallback()`. `disconnectedCallback()` aborts those listeners and cancels its animations. Reconnection finds the current containing control. Each new playback stops and cancels the previous controls while preserving their current pose. A playback identifier prevents queued completion callbacks from clearing a newer playback, and removes late style writes after reset. Template clones work both before and after custom-element registration. Use the Astro component to create the template's SVG, rather than supplying SVG markup yourself.

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

`tests/fixtures/astro` is a minimal consumer for automated browser tests and bundle measurements. It has no presentation stylesheet. `/copy-comparison/` provides an unstyled table comparing Copy with an independent spring reference at 14, 16, 24, and 28 px, plus play and stop controls. `pnpm test:build` compiles its pages. Playwright builds and serves them automatically when running `pnpm test`.

To review Copy visually, run `pnpm test:build`, then `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45321` and open `http://127.0.0.1:45321/copy-comparison/`. The reference samples the spring equation into native keyframes; it does not run the upstream React component. `/copy/` also provides standalone hover, manual controls, and dynamic template instances. Visual acceptance belongs to Victor.

The same preview server provides `/check-comparison/`, pairing Check with a native keyframe reproduction of the upstream recipe at 14, 16, 24, and 28 px. The reference uses `pathLength="1"` and an explicit SVG origin, independently of the adapter's measured dash lengths and fill-box origin. Use Play all and Stop all to compare the reveal and interrupted returns. `/check/` adds manual playback, dynamic instances, and simulated clipboard success and rejection. These fixtures contain no presentation stylesheet. Visual acceptance belongs to Victor; the comparison does not execute the upstream React component.

An optional visual playground can live in the ignored `apps/playground` directory. It is local tooling, excluded from the shared workspace and repository. The package's tests and checks do not require it. A public demo can be added when the package and its design are ready.

The package exports its Astro and TypeScript source. The consumer's Astro build compiles it, so there is no separate library compilation or watcher. Run `pnpm install` in this repository first so the linked package can resolve Motion. Restart the consumer dev server if it does not notice a linked source change.

## Portfolio integration

With this repository at `Developer/product/astro-animated-icons` and the portfolio at `Developer/me/portfolio-new`, run this command from the portfolio root:

```sh
pnpm --filter @portfolio/web add '@grave/animated-icons@link:../../../../product/astro-animated-icons/packages/animated-icons'
```

The path resolves from the portfolio's `apps/web/package.json`. Its article back link uses `<ArrowLeft size={14} />`, preserving its destination, translated label, and classes. Validate the consumer with `pnpm check`, `pnpm build`, and `pnpm test apps/web/test/site-output.test.ts`. Its build fixture lives under `.astro` because Astro 7 misresolves external component virtual modules when the fixture and linked source have no shared filesystem ancestor beyond the root.

## Verification and limits

Browser tests check all icons on the built fixture pages with JavaScript disabled, hover compression and return, independent instances, insertion before and after registration, cancellation on removal, reconnection to a different control, rapid retriggering, touch input, mouse input with a touch primary pointer, and reduced-motion changes during playback. MapPin tests also check its delayed reveal, held state, early leave, manual stop, removal, reduced-motion cancellation, and pixel travel at small sizes. API checks cover scoped classes, HTML attributes, inline styles, the default size, standalone hover, and manual playback. Astro and TypeScript checks cover the package, test fixture, and test code.

Copy tests cover spring positions, held and return states, position continuity on interruption, rapid retriggering, queued completion callbacks, manual reduced motion, and small-size travel. The comparison preview checks both axes at 50, 100, 200, 350, and 700 ms on entry and return against an independent spring equation. The difference stays below 0.03 screen pixels at 14, 16, 24, and 28 px.

Check tests cover the full initial drawing without JavaScript, 100 ms opacity and 400 ms reveal, held completion, 300 ms interrupted return, standalone and controlled playback, rapid retriggering, queued completion cleanup, and reduced-motion success feedback. The consumer fixture keeps Copy during a pending promise and after rejection, then inserts and animates Check only after resolution. Shared scenarios cover props, template upgrades, reconnection, mouse input with a touch primary pointer, and exclusion of touch and focus autoplay. The comparison samples reveal at 0, 25, 50, 100, 200, and 400 ms and a return interrupted at 50 ms at 0, 50, 100, 150, and 300 ms. At all four sizes, adapter and reference opacity and normalized path length agree to four decimal places, and path bounds differ by less than 0.03 screen pixels. These checks establish timing and geometry; Victor still reviews the visual result.

On 2026-10-15, `pnpm check` completed with zero errors, warnings, or hints in Astro diagnostics, and TypeScript exited successfully. `pnpm test --workers=1` reported `69 passed (57.3s)` in Chrome. The regressions include queued finish events followed by restart, stopping during or after that restart, and removal before the old finish callbacks run. Stopping MapPin leaves four return tracks; stopping Copy leaves two; stopping Check leaves three. Each restores the complete drawing. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

After `pnpm test:build`, `pnpm inspect:bundle` reads the fixture's production HTML and reports external entry scripts, imported JS chunks, raw and gzip sizes, inline scripts, and CSS bytes. `/plain/` must have no scripts or CSS. `/single/` must have one external icon script and no inline script. The browser-test page adds a script for dynamic instances and manual control.

The fixture has a private barrel containing `ArrowLeft` and a test-only `BundleProbe`. `/selective/` renders only `ArrowLeft`; `/probe/` renders only the probe. Bundle inspection verifies that they share the same base CSS and exclude the unused element's registration code. `/map-pin-single/` renders only `MapPin`; `/both/` renders ArrowLeft and MapPin. `/copy-single/` renders only Copy; `/arrow-copy/` renders ArrowLeft and Copy. `/check-single/` renders only Check; `/copy-check/` renders Copy and Check. Inspection verifies that each single-icon route excludes the other registrations, all reuse the same base CSS, and the browser code excludes React. ArrowLeft and Copy together, and Copy and Check together, reuse the exact union of their individual JS chunks. It prints every imported JS chunk with raw and gzip bytes.

A production build with Astro 7.3.8 and Motion 13.5.1 produced these totals. Gzip totals sum the individually compressed chunks.

| Route | External entries | Imported JS chunks | Raw JS bytes | Gzip JS bytes | CSS bytes |
| --- | --- | --- | --- | --- | --- |
| `/plain/` | 0 | 0 | 0 | 0 | 0 |
| `/single/`, ArrowLeft | 1 | 2 | 10,028 | 4,039 | 123 |
| `/map-pin-single/`, MapPin | 1 | 2 | 10,224 | 4,099 | 123 |
| `/both/` | 2 | 3 | 10,890 | 4,517 | 123 |
| `/copy-single/`, Copy | 1 | 2 | 13,888 | 5,670 | 123 |
| `/arrow-copy/` | 2 | 3 | 14,554 | 6,088 | 123 |
| `/check-single/`, Check | 1 | 2 | 9,944 | 4,013 | 123 |
| `/copy-check/` | 2 | 3 | 14,470 | 6,062 | 123 |

The shared `animate-style.BLONbVKL.js` chunk contains Motion mini and the shared lifecycle, totaling 9,362 raw bytes and 3,621 gzip bytes. `ArrowLeft.astro_astro_type_script_index_0_lang.DHKgs_yC.js` adds 666 raw bytes and 418 gzip bytes. `MapPin.astro_astro_type_script_index_0_lang.oiIrofDQ.js` adds 862 raw bytes and 478 gzip bytes. `Copy.astro_astro_type_script_index_0_lang.Beqn0Av6.js` adds 4,526 raw bytes and 2,049 gzip bytes, including the spring generator. `Check.astro_astro_type_script_index_0_lang.D1T-1x_O.js` adds 582 raw bytes and 392 gzip bytes. Chunk hashes can change on rebuild.

Browser behavior has been checked in Chrome. Firefox and Safari remain unverified. An ArrowLeft peak-frame comparison at 14, 16, 24, and 28 px retains small antialiasing differences between the dashed shaft and the reference's shortened path. The ignored local playground has a `/map-pin/` comparison at 14, 16, 24, and 28 px. It pairs the Astro adapter with a native keyframe reproduction of the upstream recipe, with play and stop controls. A Chrome comparison at 150, 300, 400, 550, and 800 ms matched translation, opacity, normalized dash length, and normalized dash offset at all four sizes. It does not execute the upstream React component. Start it with `pnpm --dir apps/playground dev` when the local playground is present. The committed `/map-pin/` browser fixture also provides hover and manual controls without a presentation stylesheet. Visual acceptance belongs to Victor, including the movement at small sizes.

## Attribution

The SVG derives from Lucide and Feather. The animations adapt Lucide Animated's [ArrowLeft recipe](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx), [MapPin recipe](https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx), [Copy recipe](https://github.com/pqoqubbw/icons/blob/main/icons/copy.tsx), and [Check recipe](https://github.com/pqoqubbw/icons/blob/main/icons/check.tsx). Applicable ISC and MIT notices are preserved in [the package notices](packages/animated-icons/THIRD_PARTY_NOTICES.md). Motion remains a package dependency under its own license.
