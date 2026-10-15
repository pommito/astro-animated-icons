# Astro animated icons

Animated Lucide icons for Astro, with static SVG output and Motion animations managed by Web Components.

The first consumer is [Victor's portfolio](https://github.com/pommito/portfolio-2026). The project is intended to become an independent open-source package.

## Status

The local pilot implements `ArrowLeft`, `MapPin`, `Copy`, `Check`, `AtSign`, and `Archive` in `@grave/animated-icons`. It is linked into the portfolio's article back link. The package remains private and unpublished. A root license must be chosen before publication.

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

Use `Archive` inside a native control:

```astro
---
import { Archive } from "@grave/animated-icons/astro";
---

<button type="button"><Archive size={16} /> Archive message</button>
```

`Archive` raises its lid and morphs its body and handle on hover. It holds the open pose until stopped. It shares the props below and exports `ArchiveIconHandle` for manual playback. Use `controlled` and wait for `customElements.whenDefined("grave-archive")` before calling `startAnimation()` or `stopAnimation()`. The consumer implements the archive operation.

Use `AtSign` for an address or contact control:

```astro
---
import { AtSign } from "@grave/animated-icons/astro";
---

<a href="mailto:hello@example.com"><AtSign size={16} />Email</a>
```

`AtSign` exports `AtSignIconHandle` for manual playback. Use `controlled` and wait for `customElements.whenDefined("grave-at-sign")` before calling `startAnimation()` or `stopAnimation()`. The circle reveals over 300 ms, with opacity over 100 ms and a full-length negative dash offset returning to zero. The outer path waits 300 ms, then reveals over 300 ms with a 100 ms opacity transition. Both shapes stay complete until stopped. The circle returns over 400 ms; the outer path retains its 300 ms delay and 300 ms return. Removal and reduced-motion changes cancel every track and restore the static drawing immediately. AtSign reuses the shared lifecycle and CSS.

The `/at-sign-comparison/` preview pairs the adapter with a native keyframe reproduction of the pinned upstream recipe at 14, 16, 24, and 28 px. The reference uses normalized path lengths independently of the adapter's measured SVG lengths. Play all and Stop all compare full playback and interrupted returns. `/at-sign/` provides hover, manual controls, and template instances. After `pnpm test:build`, serve it with `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45329` and open `http://127.0.0.1:45329/at-sign-comparison/`. Visual acceptance belongs to Victor.

The package owns the SVG and animation. Consumers do not register elements or import Motion. Astro emits the complete SVG in the initial HTML, then loads the rendered icon's registration script for `<grave-arrow-left>`, `<grave-map-pin>`, `<grave-copy>`, `<grave-check>`, `<grave-at-sign>`, or `<grave-archive>`. The browser attaches behavior to the existing markup. No hydration directive is needed.

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

`startAnimation()` starts the icon's recipe. `ArrowLeft` completes one cycle; `MapPin` stays raised and `Copy` keeps its shapes shifted until stopped. `Check` reveals and keeps the completed checkmark visible. `Archive` holds its raised lid and morphed paths until stopped. `stopAnimation()` returns ArrowLeft and MapPin to rest over 120 ms; Copy returns with its spring; Check restores its full size and path over 300 ms with a 100 ms opacity transition. Archive returns its lid with the same spring and its paths over 300 ms. Both methods return `void`. The package exports the `ArrowLeftIconHandle`, `MapPinIconHandle`, `CopyIconHandle`, `CheckIconHandle`, `AtSignIconHandle`, and `ArchiveIconHandle` types. Wait for registration before calling either method on an element inserted before its registration script runs.

## Motion and lifecycle

The nearest `a[href]` or `button` triggers one hover animation. Without a containing control, the wrapper itself triggers hover, as in the React reference. A controlled icon only responds to its playback methods. Mouse hover works even when touch is the primary input. Touch contact and keyboard focus do not trigger automatic playback.

The arrowhead moves three SVG units to the right while the shaft shortens, then both return over 400 ms. The shaft's path runs from x=19 to x=5. Its length comes from `getTotalLength()`. A five-unit retraction moves its visible left endpoint to x=10, matching Lucide Animated's path recipe. Animating `stroke-dasharray` preserves the stroke thickness and rounded caps at each size. The fixed right endpoint stays at x=19.

`motion/mini` drives the recipes through the Web Animations API. It animates ArrowLeft's head transform and shaft dash. Retriggering starts from the current drawing. Leaving the hover target returns ArrowLeft over 120 ms. There is no autoplay. Archive uses the full vanilla Motion API to interpolate its path strings. Other recipes keep `motion/mini`.

MapPin translates the whole SVG through y=0, -5, and -3 px over 500 ms, with offsets 0, 0.6, and 1. Easing applies to each segment so the pin reaches -5 px at 300 ms. Moving the SVG keeps the same travel in screen pixels at 14, 16, 24, and 28 px, as in the upstream recipe. Shared SVG overflow keeps the drawing visible.

The inner circle starts hidden when playback starts. After 300 ms, opacity reaches one over 100 ms while its stroke dash grows from zero to the complete circumference and its negative half-circumference offset returns to zero over 500 ms. `getTotalLength()` maps the source's normalized path values to native SVG dash styles without the hybrid Motion API. The raised pin and full circle stay visible until hover ends or `stopAnimation()` runs. Returning replaces every animation, including delayed circle tracks, and restores the complete drawing over 120 ms. Removal and reduced-motion changes cancel every track and restore it immediately.

Copy translates the front rectangle by -3 on both axes and the back path by +3 in SVG coordinates. Screen travel scales with the SVG size. Motion's `spring` generator supplies stiffness 160, damping 17, and mass 1 to `motion/mini`, which converts the spring into native easing. Entry and return use the same spring. Entry holds the shifted drawing after completion. Interruption preserves the current position before starting the next spring; it does not inherit the previous spring's velocity. Removal and reduced-motion changes immediately cancel both tracks and clear their transforms.

Under `prefers-reduced-motion: reduce`, all icons stay static, including manual playback. Changing the preference during playback cancels the animation and restores the drawing. The consumer's control continues to provide its normal color and focus feedback.

Check reveals opacity from zero to one over 100 ms, grows its path from zero to the complete checkmark, and scales from 0.5 to one over 400 ms. All tracks use the source's ease-in-out curve. The path has an explicit `transform-box: fill-box` and `transform-origin: center`, so scaling uses its own center at SVG coordinates (12, 11.5). `getTotalLength()` converts the normalized reveal into native stroke dash lengths for `motion/mini`. Rounded caps and the two-unit stroke scale with the path, as in the source. Starting again replays the reveal from its initial keyframes; stopping preserves the current pose before returning. Removal and reduced-motion changes clear the three tracks and leave the complete checkmark visible. Under reduced motion, a consumer still inserts Check after success, without a drawing or scale effect.

Archive adapts the [pinned upstream recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/archive.tsx). Its lid moves by -1.5 SVG units with stiffness 200, damping 25, and mass 1. These physics override the source's declared 200 ms duration. The spring settles after roughly 650 ms, rather than stopping at 200 ms. Travel scales with the SVG size. The body morphs from `M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8` to `M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11`, and the handle moves from `M10 12h4` to `M10 15h4`. Both paths use Motion's default 300 ms transition and cubic Bezier curve `[0.25, 0.1, 0.35, 1]` on entry and return.

The Archive recipe animates Motion values and writes the resulting transform and `d` attributes to the existing SVG. A retained numeric Motion value carries the lid's velocity into an interrupted return. Each path transition reads its current `d` attribute. Stopping the Motion values preserves the drawing and detaches their old controls. Calling a value animation's `cancel()` directly would rewind its update callback. The shared lifecycle cancels all three tracks on removal or a reduced-motion change, then restores the complete static SVG. There are no delayed or repeating tracks.

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

`/archive-comparison/` pairs Archive with an independent spring equation and cubic Bezier implementation at 14, 16, 24, and 28 px. Play all and Stop all compare entry, the held pose, and an interrupted return. The reference does not import Motion or run React. `/archive/` adds standalone hover, controlled playback, and dynamic template instances. For an isolated preview on port 45330, run `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45330` after `pnpm test:build`, then open `http://127.0.0.1:45330/archive-comparison/`. Visual acceptance belongs to Victor.

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

AtSign verification on 2026-10-15 ran `pnpm check`, `pnpm test:build`, `pnpm test --workers=1`, and `pnpm inspect:bundle`. A temporary Playwright configuration changed the test URL and preview server to port 45329 for concurrent icon work. Astro reported zero diagnostic errors, warnings, or hints; TypeScript passed. Chrome reported `86 passed (1.2m)`, including the existing icons. AtSign coverage includes the initial drawing without JavaScript, props, hover and manual control, delayed entry and return, interruptions at 50 and 350 ms, rapid replay with queued completions, removal, reconnection, template upgrades, touch and mouse input, keyboard focus, and reduced motion.

The comparison samples entry and both interrupted returns at 0, 25, 50, 100, 150, 299, 300, 350, 400, 450, and 600 ms. At 14, 16, 24, and 28 px, adapter and reference opacity, normalized dash length, and normalized dash offset agree to four decimal places. Shape bounds differ by less than 0.03 screen pixels. Chrome screenshots at rest, 150 ms, 450 ms, and reduced motion support visual review. The live site's circle and path geometry match the pinned source, and its registry serves identical circle and path variants. A live Chrome hover check showed the circle reveal before the delayed outer path and the complete drawing after leaving. The comparison fixture runs native keyframes rather than the upstream React component. Firefox and Safari remain unverified. Victor gives visual acceptance.

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
| `/at-sign-single/`, AtSign | 1 | 2 | 10,175 | 4,064 | 123 |
| `/arrow-at-sign/` | 2 | 3 | 10,841 | 4,482 | 123 |

The shared `animate-style.BLONbVKL.js` chunk contains Motion mini and the shared lifecycle, totaling 9,362 raw bytes and 3,621 gzip bytes. `ArrowLeft.astro_astro_type_script_index_0_lang.DHKgs_yC.js` adds 666 raw bytes and 418 gzip bytes. `MapPin.astro_astro_type_script_index_0_lang.oiIrofDQ.js` adds 862 raw bytes and 478 gzip bytes. `Copy.astro_astro_type_script_index_0_lang.Beqn0Av6.js` adds 4,526 raw bytes and 2,049 gzip bytes, including the spring generator. `Check.astro_astro_type_script_index_0_lang.D1T-1x_O.js` adds 582 raw bytes and 392 gzip bytes. `AtSign.astro_astro_type_script_index_0_lang.DpV-AWxW.js` adds 813 raw bytes and 443 gzip bytes. AtSign reuses the same `animate-style.BLONbVKL.js` chunk and 123-byte CSS as ArrowLeft. Bundle inspection verifies that AtSign alone excludes every other registration, unrelated pages exclude AtSign, and ArrowLeft with AtSign loads the union of their individual chunks. Chunk hashes can change on rebuild.

Archive verification on 2026-10-15 completed with `pnpm check`, `pnpm test:build`, `pnpm test --workers=1`, and `pnpm inspect:bundle`. The test run used a temporary Playwright configuration pointing at this worktree's preview on port 45330. Astro diagnostics reported zero errors, warnings, or hints, and TypeScript exited successfully. After integration with AtSign, Chrome reported `97 passed (1.4m)`. Archive scenarios cover the initial SVG without JavaScript, props, hover and held poses, standalone and controlled playback, position and velocity during interruption, rapid playback, completed morph callbacks, removal, reconnection, templates inserted before and after registration, touch, keyboard focus, mouse input with a touch primary pointer, and reduced-motion changes. Its JS-driven tracks are verified through rendered geometry and SVG attributes rather than `getAnimations()`.

The independent Archive preview sampled entry and a return interrupted at 96 ms at 16, 48, 96, 192, 304, 512, and 896 ms. The reference resamples its current pose at the moment of interruption, as Motion does. Three repeated runs measured a maximum screen-coordinate difference of 0.0042 px across all four sizes. The automated bound is 0.03 px. A separate Chrome comparison against the live React component on [lucide-animated.com](https://lucide-animated.com/icons/archive), with both browser clocks controlled, measured a maximum difference of 0.000031 px over the same sizes and samples. The live site's CSS enlarges its preview to 48 px; this comparison overrode that preview sizing to compare equal rendered sizes. The live geometry, spring, path timing, and interrupted return agreed with the pinned recipe. These samples do not establish pixel-identical antialiasing or visual acceptance.

The Archive build produced the following imported chunks. Gzip totals sum individually compressed chunks. Chunk names can change on rebuild.

| Chunk | Raw bytes | Gzip bytes |
| --- | --- | --- |
| `Archive.astro_astro_type_script_index_0_lang.Co68OOsf.js` | 45,124 | 16,758 |
| `resolve-elements.uR7bWyEF.js` | 7,648 | 3,006 |
| `spring.BQl6Gvt7.js` | 4,081 | 1,852 |
| Archive route total | 56,853 | 21,616 |

`/archive-single/` has one external entry, three imported JS chunks, no inline script, and the same 123 bytes of CSS as the other icons. `/arrow-archive/` has two entries and five imported chunks, totaling 59,585 raw bytes and 23,031 gzip bytes. Its chunks are the exact union of the individual routes. Inspection reported `Selective loading verified: shared CSS only, unused icon behavior excluded.` Archive adds no CSS selectors and no React code. The full Motion API changes the shared chunk split for this build: ArrowLeft alone totals 10,380 raw bytes and 4,421 gzip bytes, while retaining its existing behavior. The earlier table records the build before Archive.

Browser behavior has been checked in Chrome. Firefox and Safari remain unverified. An ArrowLeft peak-frame comparison at 14, 16, 24, and 28 px retains small antialiasing differences between the dashed shaft and the reference's shortened path. The ignored local playground has a `/map-pin/` comparison at 14, 16, 24, and 28 px. It pairs the Astro adapter with a native keyframe reproduction of the upstream recipe, with play and stop controls. A Chrome comparison at 150, 300, 400, 550, and 800 ms matched translation, opacity, normalized dash length, and normalized dash offset at all four sizes. It does not execute the upstream React component. Start it with `pnpm --dir apps/playground dev` when the local playground is present. The committed `/map-pin/` browser fixture also provides hover and manual controls without a presentation stylesheet. Visual acceptance belongs to Victor, including the movement at small sizes.

## Attribution

The SVG derives from Lucide and Feather. The animations adapt Lucide Animated's [ArrowLeft recipe](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx), [MapPin recipe](https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx), [Copy recipe](https://github.com/pqoqubbw/icons/blob/main/icons/copy.tsx), [Check recipe](https://github.com/pqoqubbw/icons/blob/main/icons/check.tsx), [AtSign recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/at-sign.tsx), and [Archive recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/archive.tsx). Applicable ISC and MIT notices are preserved in [the package notices](packages/animated-icons/THIRD_PARTY_NOTICES.md). Motion remains a package dependency under its own license.
