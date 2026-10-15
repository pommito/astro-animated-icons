# Astro animated icons

Animated Lucide icons for Astro, with static SVG output and Motion animations managed by Web Components.

The first consumer is [Victor's portfolio](https://github.com/pommito/portfolio-2026). The project is intended to become an independent open-source package.

## Status

The local pilot implements `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowUpRight`, `ArrowUpLeft`, `MapPin`, `Copy`, `Check`, `AtSign`, `ArrowDown`, `Archive`, `Bot`, and `AttachFile` in `@grave/animated-icons`. It is linked into the portfolio's article back link. The package remains private and unpublished. A root license must be chosen before publication.

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

For a forward link, use `ArrowRight`:

```astro
---
import { ArrowRight } from "@grave/animated-icons/astro";
---

<a href="/next-article/">Next article <ArrowRight size={16} /></a>
```

`ArrowRight` shares the props below and exports `ArrowRightIconHandle` for manual playback. Use `controlled` and wait for `customElements.whenDefined("grave-arrow-right")` before calling `startAnimation()` or `stopAnimation()`. The containing link keeps its name and focus behavior.

Use `ArrowUp` for an upward link or control:

```astro
---
import { ArrowUp } from "@grave/animated-icons/astro";
---

<a href="#top"><ArrowUp size={16} />Back to top</a>
```

`ArrowUp` shares the props below and exports `ArrowUpIconHandle`. For manual playback, use `controlled`, wait for `customElements.whenDefined("grave-arrow-up")`, then call `startAnimation()` or `stopAnimation()` on the element.

Use `ArrowUpLeft` for a diagonal direction:

```astro
---
import { ArrowUpLeft } from "@grave/animated-icons/astro";
---

<a href="/overview/"><ArrowUpLeft size={16} />Overview</a>
```

`ArrowUpLeft` shares the props below and exports `ArrowUpLeftIconHandle`. For manual playback, use `controlled`, wait for `customElements.whenDefined("grave-arrow-up-left")`, then call `startAnimation()` or `stopAnimation()` on the element. The containing control retains its accessible name and keyboard behavior.

Use `ArrowUpRight` inside a link:

```astro
---
import { ArrowUpRight } from "@grave/animated-icons/astro";
---

<a href="https://example.com/">Visit website <ArrowUpRight size={16} /></a>
```

`ArrowUpRight` shares the props below and exports `ArrowUpRightIconHandle`. For manual playback, use `controlled`, wait for `customElements.whenDefined("grave-arrow-up-right")`, then call `startAnimation()` or `stopAnimation()` on the element. Its complete static SVG is present before registration.

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

Use `ArrowDown` to point to another section:

```astro
---
import { ArrowDown } from "@grave/animated-icons/astro";
---

<a href="#details"><ArrowDown size={16} /> Details</a>
```

`ArrowDown` shares the props below and exports `ArrowDownIconHandle`. For manual playback, use `controlled` and wait for `customElements.whenDefined("grave-arrow-down")` before calling its methods.

Use `AtSign` for an address or contact control:

```astro
---
import { AtSign } from "@grave/animated-icons/astro";
---

<a href="mailto:hello@example.com"><AtSign size={16} />Email</a>
```

`AtSign` exports `AtSignIconHandle` for manual playback. Use `controlled` and wait for `customElements.whenDefined("grave-at-sign")` before calling `startAnimation()` or `stopAnimation()`. The circle reveals over 300 ms, with opacity over 100 ms and a full-length negative dash offset returning to zero. The outer path waits 300 ms, then reveals over 300 ms with a 100 ms opacity transition. Both shapes stay complete until stopped. The circle returns over 400 ms; the outer path retains its 300 ms delay and 300 ms return. Removal and reduced-motion changes cancel every track and restore the static drawing immediately. AtSign reuses the shared lifecycle and CSS.

The `/at-sign-comparison/` preview pairs the adapter with a native keyframe reproduction of the pinned upstream recipe at 14, 16, 24, and 28 px. The reference uses normalized path lengths independently of the adapter's measured SVG lengths. Play all and Stop all compare full playback and interrupted returns. `/at-sign/` provides hover, manual controls, and template instances. After `pnpm test:build`, serve it with `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45329` and open `http://127.0.0.1:45329/at-sign-comparison/`. Visual acceptance belongs to Victor.

Use `AudioLines` for an animated equalizer drawing:

```astro
---
import { AudioLines } from "@grave/animated-icons/astro";
---

<button type="button"><AudioLines size={16} /> Audio settings</button>
```

The four inner lines loop while hovered. The two outer lines stay fixed. To represent actual audio playback, the consumer owns that state and uses `controlled` with `AudioLinesIconHandle`. Wait for `customElements.whenDefined("grave-audio-lines")` before calling `startAnimation()` or `stopAnimation()`.

Use `AttachFile` inside a native attachment control:

```astro
---
import { AttachFile } from "@grave/animated-icons/astro";
---

<button type="button"><AttachFile size={16} />Attach file</button>
```

`AttachFile` exports `AttachFileIconHandle`. For manual playback, use `controlled`, wait for `customElements.whenDefined("grave-attach-file")`, then call `startAnimation()` or `stopAnimation()`. File selection and upload belong to the consumer. The initial HTML contains the complete drawing.

AttachFile waits 100 ms, then reveals opacity over 100 ms and path length over 400 ms. Entry uses ease-out and holds the complete drawing. Stopping cancels the entry delay and restores opacity and path length over 300 ms with cubic Bézier (0.25, 0.1, 0.35, 1). Replaying restarts the delayed reveal. Native stroke dashes use `getTotalLength()` to reproduce the normalized upstream path without React. Removal and reduced-motion changes cancel both tracks and restore the full drawing immediately. The icon reuses `src/element.ts` and `src/icon.css`.

The `/attach-file-comparison/` fixture pairs the adapter with an independent normalized-path reference at 14, 16, 24, and 28 px. Play all synchronizes entry; Stop all interrupts both columns. The reference runs native keyframes, rather than the upstream React component. `/attach-file/` provides hover, controlled playback, and template instances. Build with `pnpm test:build`, then serve with `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45337`. Open `http://127.0.0.1:45337/attach-file-comparison/`. Visual acceptance belongs to Victor.

Use `Bot` for an assistant control:

```astro
---
import { Bot } from "@grave/animated-icons/astro";
---

<button type="button"><Bot size={16} />Open assistant</button>
```

`Bot` exports `BotIconHandle`. For manual playback, use `controlled`, wait for `customElements.whenDefined("grave-bot")`, then call `startAnimation()` or `stopAnimation()`. Both eyes wait 200 ms, blink once over 500 ms with ease-in-out per segment, and return to their original shape. The antenna, body, and side paths stay still. A stop cancels the pending delay and returns the eyes over 300 ms with cubic Bézier (0.25, 0.1, 0.35, 1). Centered stroke dashes preserve the two-unit stroke and round dot when the eye closes. Removal and reduced motion cancel all tracks and restore the complete drawing immediately.

The `/bot-comparison/` preview pairs Bot with an independent reference that animates the SVG line endpoints at 14, 16, 24, and 28 px. It uses an analytic Bézier curve and a native animation clock, without React. Use Play all and Stop all to compare the delayed blink and interrupted returns. After `pnpm test:build`, serve it with `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45338` and open `http://127.0.0.1:45338/bot-comparison/`. `/bot/` provides manual controls and template instances. Visual acceptance belongs to Victor.

The package owns the SVG and animation. Consumers do not register elements or import Motion. Astro emits the complete SVG in the initial HTML, then loads the rendered icon's registration script for `<grave-arrow-left>`, `<grave-arrow-right>`, `<grave-arrow-up>`, `<grave-arrow-up-right>`, `<grave-arrow-up-left>`, `<grave-map-pin>`, `<grave-copy>`, `<grave-check>`, `<grave-at-sign>`, `<grave-arrow-down>`, `<grave-archive>`, `<grave-bot>`, `<grave-attach-file>`, or `<grave-audio-lines>`. The browser attaches behavior to the existing markup. No hydration directive is needed.

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

`startAnimation()` starts the icon's recipe. `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowUpRight`, `ArrowUpLeft`, `ArrowDown`, and `Bot` complete one cycle; `MapPin` stays raised and `Copy` keeps its shapes shifted until stopped. `Check` reveals and keeps the completed checkmark visible. `Archive` holds its raised lid and morphed paths until stopped. `stopAnimation()` returns ArrowLeft and MapPin to rest over 120 ms; Copy, ArrowUpLeft, and ArrowUpRight return with their springs; Check restores its full size and path over 300 ms with a 100 ms opacity transition. Archive returns its lid with the same spring and its paths over 300 ms. Both methods return `void`. The package exports the `ArrowDownIconHandle`, `ArrowRightIconHandle`, `ArrowUpIconHandle`, `ArrowUpRightIconHandle`, `ArrowUpLeftIconHandle`, `ArrowLeftIconHandle`, `MapPinIconHandle`, `CopyIconHandle`, `CheckIconHandle`, `AtSignIconHandle`, `ArchiveIconHandle`, `BotIconHandle`, and `AttachFileIconHandle` types. Wait for registration before calling either method on an element inserted before its registration script runs.

## Motion and lifecycle

The nearest `a[href]` or `button` triggers one hover animation. Without a containing control, the wrapper itself triggers hover, as in the React reference. A controlled icon only responds to its playback methods. Mouse hover works even when touch is the primary input. Touch contact and keyboard focus do not trigger automatic playback.

ArrowLeft's arrowhead moves three SVG units to the right while the shaft shortens, then both return over 400 ms. The shaft's path runs from x=19 to x=5. Its length comes from `getTotalLength()`. A five-unit retraction moves its visible left endpoint to x=10, matching Lucide Animated's path recipe. Animating `stroke-dasharray` preserves the stroke thickness and rounded caps at each size. The fixed right endpoint stays at x=19.

`motion/mini` drives the recipes through the Web Animations API. It animates ArrowLeft's head transform and shaft dash. Retriggering starts from the current drawing. Leaving the hover target returns ArrowLeft over 120 ms. There is no autoplay. Archive uses the full vanilla Motion API to interpolate its path strings. Other recipes keep `motion/mini`.

ArrowDown uses the same directional cycle helper as ArrowLeft, with local geometry and values. Its head follows y=0, -3, and 0 over 400 ms. The shaft follows `M12 5v14`, `M12 5v9`, and `M12 5v14` through native dash lengths, keeping the top endpoint at (12, 5), the two-unit stroke, and rounded caps. There are no delayed or repeating tracks. ArrowLeft keeps its existing motion and 120 ms return.

Stopping ArrowDown restores the shaft over 300 ms with the upstream default cubic-bezier(0.25, 0.1, 0.35, 1). The head returns with the upstream default spring, stiffness 500, damping 25, mass 1, and rest speed 10. Before interruption, the adapter samples the head's native animation ten milliseconds apart to retain its velocity. Motion's vanilla spring generator produces five-millisecond transform samples for native playback. This avoids scaling the shaft and retains the head's momentum without the hybrid animation runtime. Rapid replay starts from the current pose, as in the existing package contract. Frame sampling can differ slightly from React's frame-by-frame velocity estimate.

ArrowRight uses the pinned upstream geometry `M5 12h14` and `m12 5 7 7-7 7`. Its head moves through x=0, -3, and 0 in SVG coordinates over 400 ms. Its shaft shortens from 14 to 9 units and returns, with its left endpoint fixed at x=5. Each half uses ease-out, as resolved by the live site's Motion runtime. Native stroke dashes preserve thickness and rounded caps at 14, 16, 24, and 28 px. Screen travel scales with size.

Stopping ArrowRight returns the shaft over 300 ms with `cubic-bezier(0.25, 0.1, 0.35, 1)`. The head returns with stiffness 500, damping 25, mass 1, rest speed 10, and a 0.005 rest-delta threshold. The resolved live options confirmed the stiffness, damping, mass, and rest speed on 2026-10-15. The pinned source and live variants agree. The return spring retains the current velocity, measured over the preceding 5 ms, and is sampled into native keyframes every 5 ms. This keeps the physical distance in SVG units while using `motion/mini`. A new cycle starts from the current pose. Removal and reduced motion cancel both tracks and restore the full drawing immediately. ArrowLeft keeps its existing easing and 120 ms return.

ArrowUp shares the native dash mechanism in `src/icons/arrow.ts` while keeping its paths and transition choices in `src/icons/arrow-up/`. Its head moves through y=0, 3, and 0 in SVG units. Its shaft starts at (12, 19), so shortening the dash from 14 to 9 units moves only the upper endpoint from y=5 to y=10. Both tracks complete in 400 ms, with `easeOut` applied separately to each 200 ms segment. There are no delayed or repeating tracks.

On interrupted return, ArrowUp's head uses the upstream default transform spring (stiffness 500, damping 25, rest speed 10). Its shaft returns over 300 ms with cubic Bézier (0.25, 0.1, 0.35, 1), the upstream default for a path. Position stays continuous on stop or replay. Like Copy, the native spring starts without the previous track's velocity. ArrowLeft retains its existing easing and 120 ms return. Shared lifecycle cleanup waits for both ArrowUp tracks before clearing styles.

ArrowUpLeft transforms its complete group over 500 ms. Translation follows (0, 0), (4, 4), (0, 0), while scale follows 1, 0.85, 1. Each half uses ease-in-out. Its explicit view-box origin at (7, 7) matches the source's top-left fill-box origin. At the midpoint, the corner moves to (11, 11), and the ten-unit sides shrink to 8.5 units. Translation and stroke scale with the SVG at every size. There are no delayed or repeating tracks. Starting again replays the source's explicit initial keyframes.

Stopping ArrowUpLeft preserves position and estimates velocity over the preceding 5 ms. Translation returns with stiffness 500 and damping 25; scale returns with stiffness 550 and damping 30. Both use mass 1, rest speed 10, and a 0.005 rest-delta threshold. Motion's spring generators sample the return every 5 ms in SVG units, then `motion/mini` runs the combined transform through native keyframes. Removal and reduced motion cancel the group and clear its transform. ArrowUpLeft shares `src/icons/diagonal-arrow.ts` with ArrowUpRight. Each icon keeps its paths and origin local. ArrowUpLeft passes horizontal direction 1; ArrowUpRight passes -1.

ArrowUpRight moves its complete group through (0, 0), (-4, 4), and (0, 0) in SVG units, scaling through 1, 0.85, and 1 over 500 ms. Each 250 ms segment uses ease-in-out. Its explicit `transform-box: view-box` and `transform-origin: 17px 7px` match the source's top-right fill-box origin. Translation and stroke scaling therefore follow the SVG size. There are no delays or repeats. Restarting replays the explicit keyframes from rest, as in the source.

Interrupted return preserves position and velocity. Translation uses stiffness 500 and damping 25; scale uses stiffness 550 and damping 30. All three springs use mass 1, rest speed 10, and rest delta 0.005. Motion's vanilla spring generator supplies a sample every 5 ms for one native transform track. The diagonal helper accepts the horizontal direction; each icon keeps its geometry and origin local. The shared lifecycle cancels the track on removal and reduced-motion changes, leaving the complete drawing. Existing icons keep their recipes.

MapPin translates the whole SVG through y=0, -5, and -3 px over 500 ms, with offsets 0, 0.6, and 1. Easing applies to each segment so the pin reaches -5 px at 300 ms. Moving the SVG keeps the same travel in screen pixels at 14, 16, 24, and 28 px, as in the upstream recipe. Shared SVG overflow keeps the drawing visible.

The inner circle starts hidden when playback starts. After 300 ms, opacity reaches one over 100 ms while its stroke dash grows from zero to the complete circumference and its negative half-circumference offset returns to zero over 500 ms. `getTotalLength()` maps the source's normalized path values to native SVG dash styles without the hybrid Motion API. The raised pin and full circle stay visible until hover ends or `stopAnimation()` runs. Returning replaces every animation, including delayed circle tracks, and restores the complete drawing over 120 ms. Removal and reduced-motion changes cancel every track and restore it immediately.

Copy translates the front rectangle by -3 on both axes and the back path by +3 in SVG coordinates. Screen travel scales with the SVG size. Motion's `spring` generator supplies stiffness 160, damping 17, and mass 1 to `motion/mini`, which converts the spring into native easing. Entry and return use the same spring. Entry holds the shifted drawing after completion. Interruption preserves the current position before starting the next spring; it does not inherit the previous spring's velocity. Removal and reduced-motion changes immediately cancel both tracks and clear their transforms.

Under `prefers-reduced-motion: reduce`, all icons stay static, including manual playback. Changing the preference during playback cancels the animation and restores the drawing. The consumer's control continues to provide its normal color and focus feedback.

Check reveals opacity from zero to one over 100 ms, grows its path from zero to the complete checkmark, and scales from 0.5 to one over 400 ms. All tracks use the source's ease-in-out curve. The path has an explicit `transform-box: fill-box` and `transform-origin: center`, so scaling uses its own center at SVG coordinates (12, 11.5). `getTotalLength()` converts the normalized reveal into native stroke dash lengths for `motion/mini`. Rounded caps and the two-unit stroke scale with the path, as in the source. Starting again replays the reveal from its initial keyframes; stopping preserves the current pose before returning. Removal and reduced-motion changes clear the three tracks and leave the complete checkmark visible. Under reduced motion, a consumer still inserts Check after success, without a drawing or scale effect.

Archive adapts the [pinned upstream recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/archive.tsx). Its lid moves by -1.5 SVG units with stiffness 200, damping 25, and mass 1. These physics override the source's declared 200 ms duration. The spring settles after roughly 650 ms, rather than stopping at 200 ms. Travel scales with the SVG size. The body morphs from `M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8` to `M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11`, and the handle moves from `M10 12h4` to `M10 15h4`. Both paths use Motion's default 300 ms transition and cubic Bezier curve `[0.25, 0.1, 0.35, 1]` on entry and return.

The Archive recipe animates Motion values and writes the resulting transform and `d` attributes to the existing SVG. A retained numeric Motion value carries the lid's velocity into an interrupted return. Each path transition reads its current `d` attribute. Stopping the Motion values preserves the drawing and detaches their old controls. Calling a value animation's `cancel()` directly would rewind its update callback. The shared lifecycle cancels all three tracks on removal or a reduced-motion change, then restores the complete static SVG. There are no delayed or repeating tracks.

AudioLines keeps the lines at x=2 and x=22 fixed. The inner lines cycle through the pinned source's endpoints over 1.5, 1, 0.8, and 1.5 seconds. Each half-cycle uses ease-out. Native stroke dash lengths and offsets reproduce the visible endpoints without scaling the two-unit stroke. The x=14 path covers y=6 through y=17; its initial dash exposes only y=8 through y=15, so the complete resting drawing is visible before JavaScript runs. Entry replays from the normal endpoints. Stopping preserves the current pose and returns over 300 ms with the upstream default path curve, `cubic-bezier(0.25, 0.1, 0.35, 1)`. The shared lifecycle cancels all eight tracks on removal or a reduced-motion change and restores the normal dashes immediately.

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

`/arrow-down-comparison/` pairs ArrowDown with an independent native path-morph reference at 14, 16, 24, and 28 px. Play all and Stop all compare entry and interrupted return. The reference samples the analytical spring equation; it does not execute the upstream React component. `/arrow-down/` provides hover, manual playback, and template instances. The pinned source is [arrow-down.tsx at 4662fff](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-down.tsx). The live site's initial paths, full cycle, and interrupted spring return were inspected on 2026-10-15. A 51-frame capture measured a minimum head y of -2.97429 and a minimum shaft length of 9.04285 units, then restored y=0 and `M12 5v14`. These sampled values agree with the pinned peak values of -3 and 9; no recipe difference was observed. Its implicit return defaults differ from ArrowLeft's adapter, so ArrowDown supplies its own return tracks. Visual acceptance belongs to Victor.

The `/arrow-right-comparison/` fixture compares ArrowRight with an independent native path morph at 14, 16, 24, and 28 px. Play all runs a single cycle; Stop all interrupts it. The reference uses native per-segment easing and an independent analytic spring equation with inherited velocity. It does not execute React. The live site's React variants and resolved Motion options were inspected separately and agree with the pinned recipe and the adapter's timing and return parameters. The fixture has no presentation stylesheet. Visual acceptance belongs to Victor.

Use a separate port when other fixture servers are running:

```sh
pnpm test:build
pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45331
```

Open `http://127.0.0.1:45331/arrow-right-comparison/` for comparison or `/arrow-right/` for standalone hover, manual controls, and dynamic instances.

`/arrow-up-comparison/` pairs ArrowUp with native path morphing and an independently sampled return spring at 14, 16, 24, and 28 px. Play all synchronizes both columns; Stop all interrupts both. The reference uses CSS `d` keyframes in Chrome and does not execute React. `/arrow-up/` provides standalone hover, controlled playback, and dynamic templates. For concurrent development, this task uses port 45332 instead of the default port. After `pnpm test:build`, run `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45332` and open `http://127.0.0.1:45332/arrow-up-comparison/`.

On 2026-10-15, the live catalogue's ArrowUp module matched the [pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up.tsx): the same two paths, 400 ms cycle, and no explicit transition on the normal variants. Browser frame sampling confirmed the implicit ease-out entry, spring head return, and 300 ms shaft return. The catalogue displays samples at 40 px through its page CSS; the component's default remains 28 px. Visual acceptance belongs to Victor.

`/arrow-up-left-comparison/` compares ArrowUpLeft at 14, 16, 24, and 28 px. The adapter uses an explicit SVG coordinate origin; the reference uses a top-left fill-box origin and independent spring equations. Play all starts one cycle, and Stop all compares interrupted returns. The reference uses native browser keyframes and does not execute React. After `pnpm test:build`, run `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45335` and open `http://127.0.0.1:45335/arrow-up-left-comparison/`. `/arrow-up-left/` provides manual controls and template instances. Visual acceptance belongs to Victor.

`/arrow-up-right-comparison/` pairs ArrowUpRight with an independent native keyframe and analytic spring reference at 14, 16, 24, and 28 px. The reference uses the upstream fill-box origin; the adapter uses explicit viewBox coordinates. Play all synchronizes the columns and Stop all interrupts them. `/arrow-up-right/` provides hover, manual controls, and dynamic templates. The fixture does not execute React. Visual acceptance belongs to Victor.

For this comparison, run `pnpm test:build`, then `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45334` and open `http://127.0.0.1:45334/arrow-up-right-comparison/`. On 2026-10-15, the live catalogue's geometry, variants, and resolved return spring options matched the pinned ArrowUpRight source. Sampling the live React component at 0, 125, 250, 375, and 500 ms confirmed translations (0, 0), (-2, 2), (-4, 4), (-2, 2), (0, 0) and scales 1, 0.925, 0.85, 0.925, 1. Its page CSS displays the sample at 40 px; the component default remains 28 px.

ArrowUpRight's browser scenarios cover static HTML without JavaScript, default size and wrapper props, standalone hover, controlled playback, independent instances, template insertion before and after registration, removal, reconnection, rapid replay, queued completion callbacks, touch and keyboard exclusion, mouse hover with a touch primary pointer, and reduced motion during entry and return. The comparison samples entry and returns interrupted at 50, 125, 250, and 350 ms. It compares three transformed points at eleven times and all four sizes. Every coordinate differs by less than 0.03 screen pixels. The preview reference solves the springs independently; a separate browser inspection checks the live React component. Safari, Firefox, and physical touch devices remain unverified.

On 2026-10-15, `pnpm check` reported zero Astro diagnostic errors, warnings, or hints, and TypeScript exited successfully. `pnpm test:build` built all 40 fixture pages. `pnpm test --workers=1 --config=.artifacts/playwright.config.ts` reported `134 passed (2.6m)` in Chrome, including 16 ArrowUpRight scenarios. The ignored local config changes only the fixture port to 45334. Initial full runs exposed two timing races in shared tests: hover could precede registration or finish before the first observation, and Check's 100 ms opacity track could finish before removal. The shared tests now wait for registration where needed and pause tracks on pointer entry. The final full run passed without changing existing icon recipes. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

After integrating Archive and ArrowDown from `main` on 2026-10-15, `pnpm check` passed and the complete Chrome run reported `161 passed (4.5m)`. Playwright's server setup rebuilt the production fixtures on port 45334. `pnpm inspect:bundle` verified one external entry, four imported chunks, no inline script, and the same 123 bytes of shared CSS on `/arrow-up-right-single/`. ArrowUpRight alone loads 15,015 raw JS bytes and 6,596 gzip bytes. `/arrow-left-up-right/` loads the exact union of ArrowLeft's and ArrowUpRight's chunks. Pages without ArrowUpRight exclude its registration; the browser bundles exclude React. The expanded fixture changes how the bundler splits the shared runtime.

| Imported chunk | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| `ArrowUpRight.astro_astro_type_script_index_0_lang.CnPpcKIl.js` | 1,264 | 762 |
| `resolve-elements.uR7bWyEF.js` | 7,648 | 3,006 |
| `spring.BQl6Gvt7.js` | 4,081 | 1,852 |
| `animate-style.CqlGSeCm.js` | 2,022 | 976 |

`/audio-lines-comparison/` compares AudioLines with an independent native SVG path-morph reference at 14, 16, 24, and 28 px. Play all starts both columns; Stop all interrupts the loops and compares their returns. The reference does not import the adapter recipe or execute React. `/audio-lines/` provides standalone hover, manual controls, and template instances. For concurrent local review, build the fixture and run `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45336`, then open `http://127.0.0.1:45336/audio-lines-comparison/`. Visual acceptance belongs to Victor.

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

ArrowDown tests cover its full initial drawing without JavaScript, the 400 ms cycle, fixed shaft endpoint, retained position and sampled velocity on interruption, rapid replay, stale completion callbacks, removal, and reduced-motion cancellation during the return. Shared scenarios cover props, independent template instances before and after registration, reconnection, touch exclusion, mouse hover with a touch primary pointer, and keyboard focus. The comparison samples entry at 0, 50, 100, 150, 200, 300, and 400 ms. It interrupts at 100 and 200 ms, then samples the return at 0, 25, 50, 100, 150, 200, and 300 ms. At all four sizes, head positions and visible shaft endpoints differ from the independent reference by less than 0.03 screen pixels. Native dash rendering can still produce antialiasing differences from a morphed path.

After integrating AtSign and ArrowUp from main, the ArrowDown verification run on 2026-10-15 passed `pnpm check`, `pnpm test:build`, `pnpm test --workers=1 --config=.artifacts/playwright.config.ts`, and `pnpm inspect:bundle`. Astro diagnostics reported zero errors, warnings, and hints, TypeScript exited successfully, the fixture built 35 pages, and Chrome reported `118 passed (1.6m)`. The ignored local configuration reserves port 45333 for this task. Repository defaults remain on port 45321. For this worktree, start the comparison with `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45333` and open `http://127.0.0.1:45333/arrow-down-comparison/`. Firefox, Safari, and physical touch devices remain unverified. Victor gives visual acceptance.

After integrating ArrowRight from main, the ArrowDown source remained unchanged. `pnpm check` passed, `pnpm test:build` built 40 pages, and the focused ArrowDown, ArrowUp, and ArrowRight browser suite reported `24 passed (19.4s)`. Bundle inspection passed with the latest combined catalogue.

Before ArrowDown was added, the verification run on 2026-10-15 completed `pnpm check` with zero errors, warnings, or hints in Astro diagnostics, and TypeScript exited successfully. That earlier `pnpm test --workers=1` run reported `69 passed (57.3s)` in Chrome. The regressions include queued finish events followed by restart, stopping during or after that restart, and removal before the old finish callbacks run. Stopping MapPin leaves four return tracks; stopping Copy leaves two; stopping Check leaves three. Each restores the complete drawing. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

ArrowRight tests cover the complete drawing without JavaScript, a single 400 ms cycle with no delay or repeat, per-segment ease-out, controlled and standalone playback, interruption continuity, inherited head velocity, rapid replay, queued completion cleanup, removal, and reduced-motion cancellation. Shared scenarios cover props, independent template instances before and after registration, reconnection, touch, keyboard focus, and mouse hover when touch is the primary pointer. The comparison samples entry at 0, 50, 100, 150, 200, 250, 300, 350, and 400 ms, then interrupts at 100 ms and samples return at 0, 30, 60, 120, 200, 300, and 500 ms. It checks painted shaft endpoints and head positions at all four sizes, with a 0.03 screen-pixel tolerance, plus the fixed start, two-unit stroke, and rounded caps. A separate 64-sample run measured a maximum difference of 0.000047 screen pixels against the independent reference, zero page errors, and zero tracks after reduced-motion playback. Browser coverage remains Chrome; Firefox, Safari, and manual visual acceptance remain unverified.

AudioLines tests compare visible endpoints against independent path morphing at 13 times between 0 and 3000 ms, then interrupt at 350 ms and sample the 300 ms return. Endpoint differences stay below 0.03 screen pixels at all four sizes. A final preview check measured a maximum difference of 0.000085 screen pixels across entry and interrupted return, zero page errors, and zero tracks after manual playback under reduced motion. Tests also check continued looping, static outer lines, manual playback, rapid replay with queued return callbacks, removal, and reduced-motion cancellation. Shared scenarios cover props, template upgrades, independent instances, reconnection, and pointer and keyboard behavior.

On 2026-10-15, AudioLines validation ran in a dedicated worktree on port 45336. `pnpm check` passed with zero Astro errors, warnings, or hints, and TypeScript succeeded. The first full `pnpm test --workers=1 --config=.artifacts/playwright.audio-lines.config.ts` run reported `134 passed (5.2m)` and two failures in existing ArrowLeft and Check tests. ArrowLeft expected two tracks after hover but observed zero. Check observed its two 300 ms return tracks and no remaining 100 ms opacity track. Both tests passed unchanged with `--last-failed`, reporting `2 passed (13.0s)`. After adding the paused-loop callback regression, `pnpm test --workers=1 --config=.artifacts/playwright.audio-lines.config.ts --grep AudioLines` reported `19 passed (35.2s)`. All AudioLines scenarios passed. The local config copies the repository config and changes only the fixture server port and config-relative paths. It is ignored; the shared Playwright port stays unchanged.

After integrating Archive and ArrowDown from main, `pnpm check` and `pnpm inspect:bundle` passed. The full Chrome run reported `162 passed (5.3m)` and two existing AtSign hover-count failures, each expecting five tracks but observing zero. Both tests passed unchanged with `--last-failed`, reporting `2 passed (8.4s)`. All 19 AudioLines scenarios passed in the full run. The shared lifecycle and CSS remained unchanged.

After integrating ArrowUpRight from main, `pnpm check` and `pnpm inspect:bundle` passed again. `pnpm test --workers=1 --config=.artifacts/playwright.audio-lines.config.ts --grep 'AudioLines|ArrowUpRight|arrow-up-right.spec.ts'` reported `35 passed (34.9s)`. This run covers every AudioLines and ArrowUpRight scenario, including their shared API, lifecycle, and accessibility checks. The test server rebuilt the production fixtures on port 45336.

After integrating Bot from main, `pnpm check` passed with zero Astro diagnostic errors, warnings, or hints, and TypeScript succeeded. `pnpm test --workers=1 --config=.artifacts/playwright.audio-lines.config.ts --grep AudioLines` reported `19 passed (18.7s)`. The production fixtures rebuilt successfully and `pnpm inspect:bundle` passed, including mutual exclusion of Bot and AudioLines registrations. The AudioLines recipe, shared lifecycle, and shared CSS remained unchanged.

After integrating AttachFile from main, `pnpm check` passed, the production fixtures rebuilt, and the AudioLines browser suite reported `19 passed (19.5s)`. `pnpm inspect:bundle` passed with mutual exclusion of AttachFile and AudioLines registrations. The AudioLines recipe, shared lifecycle, and shared CSS remained unchanged.

On 2026-10-15, the live site's `audio-lines` registry source matched the pinned file byte for byte. A Chrome recording sampled 97 frames of the live icon over 1.6 seconds. The four paths followed the pinned periods and per-segment ease-out curve, with a maximum fitted deviation of 0.021 SVG units after clock alignment. Leaving hover restored all source paths. This recording supports the comparison; it does not replace Victor's visual acceptance. Firefox and Safari remain unverified.

On 2026-10-15, `pnpm check` completed with zero errors, warnings, or hints in Astro diagnostics, and TypeScript exited successfully. `pnpm test --workers=1 --config .artifacts/playwright.arrow-right.config.ts` reported `118 passed (1.7m)` in Chrome. The regressions include queued finish events followed by restart, stopping during or after that restart, and removal before the old finish callbacks run. Stopping MapPin leaves four return tracks; stopping Copy leaves two; stopping Check leaves three. Each restores the complete drawing. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

The ignored ArrowRight validation config copies the repository config and changes only its test directory and server port to 45331. The first full run had one timing-sensitive MapPin failure, observing three tracks instead of four during rapid replay. Its focused rerun and the final full suite passed without changes to MapPin.

ArrowUp coverage extends the shared props, insertion, reconnection, pointer, and reduced-motion scenarios. Focused tests check static HTML without JavaScript, the 200 ms peak, a fixed shaft bottom, standalone hover, manual control, interrupted return, rapid replay, and stale completion callbacks. The comparison samples entry every 50 ms from 0 to 400 ms, then returns interrupted at 50 and 200 ms at 0, 50, 100, 150, 200, 300, 400, and 600 ms. Head displacement and shaft endpoints differ by less than 0.03 screen pixels at all four sizes. Bundle inspection adds `/arrow-up-single/` and `/arrows/`, verifies that unused ArrowUp registration stays out of other pages, and checks that the two arrows share their runtime and CSS.

On 2026-10-15, `pnpm check` completed with zero errors, warnings, or hints in Astro diagnostics, and TypeScript exited successfully. `pnpm test --workers=1 --config=.artifacts/playwright.arrow-up.config.ts` reported `102 passed (1.4m)` in Chrome. The ignored local config uses port 45332; the committed Playwright config keeps port 45321. `pnpm test:build` built all 30 routes. After integrating AtSign, the template-upgrade test pauses tracks at pointer entry so its animation count cannot miss the 100 ms opacity tracks. The previously failing AtSign scenario passed five consecutive runs, followed by the full 102-test suite. The regressions include queued finish events followed by restart, stopping during or after that restart, and removal before the old finish callbacks run. Stopping MapPin leaves four return tracks; stopping Copy leaves two; stopping Check leaves three. Each restores the complete drawing. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

AtSign verification on 2026-10-15 ran `pnpm check`, `pnpm test:build`, `pnpm test --workers=1`, and `pnpm inspect:bundle`. A temporary Playwright configuration changed the test URL and preview server to port 45329 for concurrent icon work. Astro reported zero diagnostic errors, warnings, or hints; TypeScript passed. Chrome reported `86 passed (1.2m)`, including the existing icons. AtSign coverage includes the initial drawing without JavaScript, props, hover and manual control, delayed entry and return, interruptions at 50 and 350 ms, rapid replay with queued completions, removal, reconnection, template upgrades, touch and mouse input, keyboard focus, and reduced motion.

The comparison samples entry and both interrupted returns at 0, 25, 50, 100, 150, 299, 300, 350, 400, 450, and 600 ms. At 14, 16, 24, and 28 px, adapter and reference opacity, normalized dash length, and normalized dash offset agree to four decimal places. Shape bounds differ by less than 0.03 screen pixels. Chrome screenshots at rest, 150 ms, 450 ms, and reduced motion support visual review. The live site's circle and path geometry match the pinned source, and its registry serves identical circle and path variants. A live Chrome hover check showed the circle reveal before the delayed outer path and the complete drawing after leaving. The comparison fixture runs native keyframes rather than the upstream React component. Firefox and Safari remain unverified. Victor gives visual acceptance.

ArrowUpLeft tests cover the full drawing without JavaScript, the 500 ms group cycle, the explicit SVG origin, controlled and standalone playback, position continuity on stop, replay from the source's initial keyframes, queued finish callbacks, removal, reduced motion, and the shared props and lifecycle contract. The comparison checks four drawing points and group scale during entry and returns interrupted at 50, 100, 250, and 350 ms. A separate Chrome run recorded 192 samples with a maximum coordinate difference below 0.001 screen pixels, zero page errors, and zero tracks after reduced-motion playback. The completed hover cycle did not repeat. Changing the preference during an interrupted return cleared the transform immediately.

On 2026-10-15, the live ArrowUpLeft React variants matched the pinned source, including all three paths, the 500 ms ease-in-out cycle, and `originX: 0`, `originY: 0`. Its rendered group used a top-left fill-box origin, with drawing bounds (7, 7, 10, 10). The live runtime resolved translation return to stiffness 500, damping 25, and rest speed 10, and scale return to stiffness 550, damping 30, and rest speed 10. The catalogue's page CSS displayed its main sample at 48 px; the component default remained 28 px. The adapter estimates interruption velocity over 5 ms, while React derives velocity from its frame history. The comparison preview uses the same 5 ms estimate in both columns, so its measurements do not establish identical velocity under every live frame schedule. Firefox, Safari, physical touch devices, and Victor's visual acceptance remain unverified.

The first full ArrowUpLeft validation run reported 130 passes and four timing-sensitive failures in existing Check and AtSign scenarios. The shared reduced-motion and reconnection tests, plus AtSign's standalone reduced-motion test, now pause tracks at pointer entry. This follows the existing template-upgrade test and prevents 100 ms opacity tracks from finishing before inspection. The reduced-motion test advances the paused tracks to 50 ms before changing the preference, so it checks an already displaced drawing. Icon behavior is unchanged. The ignored `.artifacts/playwright.arrow-up-left.config.ts` uses port 45335; the committed config keeps its default port.

The final full command, `pnpm test --workers=1 --config=.artifacts/playwright.arrow-up-left.config.ts`, reported `134 passed (2.0m)` in Chrome. After advancing the reduced-motion scenario to a paused 50 ms pose, the focused command with `tests/accessibility.spec.ts --grep 'changing the motion preference'` reported `8 passed (10.5s)`, and `pnpm exec tsc --noEmit` passed. `pnpm check` passed Astro and TypeScript checks, with zero diagnostic errors, warnings, or hints. Astro also printed its existing startup warning about the package's missing `src/pages` directory. `pnpm test:build` built 40 pages. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.` ArrowUpLeft alone loaded its entry, the shared runtime, and the shared spring generator, totaling 14,674 raw JS bytes and 6,157 gzip bytes. CSS stayed at 123 bytes, and unrelated routes excluded its registration.

AttachFile validation ran `pnpm check`, `pnpm test:build`, `pnpm test --workers=1 --config=.artifacts/playwright.attach-file.config.ts`, and `pnpm inspect:bundle`. The ignored local config uses port 45337; the repository config retains port 45321. Astro reported zero diagnostic errors, warnings, or hints, and TypeScript passed. The final Chrome suite reported `141 passed (2.8m)`. The first full run had four timing-sensitive failures in shared AtSign and Check scenarios. Those scenarios now pause tracks on pointer entry before counting them, so 100 ms opacity tracks cannot finish between assertions. Icon runtime behavior was unchanged.

AttachFile verification on 2026-10-15 sampled entry at 0, 25, 50, 99, 100, 150, 200, 300, 400, 500, and 700 ms. Returns were interrupted at 50, 150, and 250 ms. At 14, 16, 24, and 28 px, adapter and normalized reference opacity and path length agree to four decimal places. Path bounds differ by less than 0.03 screen pixels. Tests cover static HTML, the entry delay, replay during reveal, stale completion callbacks, removal, reconnection, template insertion before and after registration, props, pointer input, focus, and reduced motion. Chrome is the tested browser; Firefox, Safari, and Victor's visual acceptance remain unverified.

The live catalogue's AttachFile geometry and variants matched the [pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/attach-file.tsx). Its resolved Motion options confirmed ease-out entry, a 100 ms delay, a 100 ms opacity reveal, and a 400 ms path reveal. Interrupted path return resolved to 300 ms without delay and cubic Bézier (0.25, 0.1, 0.35, 1). The catalogue's page CSS displays the icon at 40 px; the component default remains 28 px. A separate comparison sampled the live Motion path and native opacity at eight times, then compared the adapter at all four sizes. The maximum visible endpoint difference was 0.0232 screen pixels, and sampled opacity matched exactly. The small path difference comes from the live JavaScript easing approximation and native browser easing.

Before integrating Archive and ArrowDown from main, AttachFile bundle inspection verified one external entry, two imported JS chunks, no inline scripts, and the existing 123-byte shared CSS. The single-icon route loads 9,913 raw JS bytes and 4,011 gzip bytes. Its entry is `AttachFile.astro_astro_type_script_index_0_lang.CWJ6kJS5.js`, 551 raw bytes and 377 gzip bytes. The shared runtime is `element.3lv88F-F.js`, 9,362 raw bytes and 3,634 gzip bytes. ArrowLeft with AttachFile loads four chunks, 10,855 raw bytes and 4,624 gzip bytes, exactly the union of the individual routes. Unrelated routes exclude AttachFile registration. Chunk hashes can change on rebuild. After integration, the shared runtime splits into `resolve-elements.uR7bWyEF.js`, 7,648 raw bytes and 3,006 gzip bytes, and `animate-style.CqlGSeCm.js`, 2,022 raw bytes and 976 gzip bytes. The AttachFile entry is `AttachFile.astro_astro_type_script_index_0_lang.W_f3r8Wa.js`, 601 raw bytes and 402 gzip bytes. AttachFile alone totals 10,271 raw bytes and 4,384 gzip bytes across three chunks. ArrowLeft with AttachFile totals 11,291 raw bytes and 5,028 gzip bytes across five chunks. The shared CSS remains 123 bytes, and both routes exclude Archive and ArrowDown registration.

After `pnpm test:build`, `pnpm inspect:bundle` reads the fixture's production HTML and reports external entry scripts, imported JS chunks, raw and gzip sizes, inline scripts, and CSS bytes. `/plain/` must have no scripts or CSS. `/single/` must have one external icon script and no inline script. The browser-test page adds a script for dynamic instances and manual control.

The fixture has a private barrel containing `ArrowLeft` and a test-only `BundleProbe`. `/selective/` renders only `ArrowLeft`; `/probe/` renders only the probe. Bundle inspection verifies that they share the same base CSS and exclude the unused element's registration code. `/map-pin-single/` renders only `MapPin`; `/both/` renders ArrowLeft and MapPin. `/copy-single/` renders only Copy; `/arrow-copy/` renders ArrowLeft and Copy. `/check-single/` renders only Check; `/copy-check/` renders Copy and Check. `/arrow-right-single/` renders only ArrowRight; `/arrow-left-right/` renders ArrowLeft and ArrowRight; `/arrows/` renders ArrowLeft and ArrowUp. Inspection verifies that each single-icon route excludes the other registrations, all reuse the same base CSS, and the browser code excludes React. ArrowLeft and Copy together, and Copy and Check together, reuse the exact union of their individual JS chunks. It prints every imported JS chunk with raw and gzip bytes.

Bot's comparison samples entry at 0, 50, 150, 199, 200, 250, 325, 400, 450, 500, 575, 650, and 700 ms, plus returns interrupted at 50, 325, 450, and 575 ms. Painted eye endpoints and stroke widths agree with the independent attribute reference within 0.001 screen pixels at 14, 16, 24, and 28 px. Chrome screenshots cover rest, 199, 325, 450, 575, and 700 ms, plus reduced motion. An additional canvas rasterization comparison found differences around the eye edges between native dashes and direct SVG endpoints, including at rest and the closed dot. Geometric agreement does not establish pixel equality. Victor gives visual acceptance.

The live Bot page's geometry and React variants agree with the pinned source. Its resolved Motion options confirm a 200 ms delay, 500 ms entry, and ease-in-out, then a 300 ms return with no delay and cubic Bézier (0.25, 0.1, 0.35, 1). Both live eyes reach y1=y2=14 when paused at 450 ms. The local preview reports zero page errors and zero tracks after reduced-motion playback. Browser coverage remains Chrome; Firefox, Safari, and physical touch devices remain unverified.

Bot verification on 2026-10-15 ran `pnpm check`, `pnpm test:build`, `pnpm test --workers=1 --config=.artifacts/playwright.bot.config.ts`, and `pnpm inspect:bundle`. Astro diagnostics reported zero errors, warnings, or hints, and TypeScript passed. The final Chrome suite reported `138 passed (2.6m)`. The ignored local configuration replaces the preview URL and port with 45338. The committed Playwright configuration remains unchanged. Coverage includes static HTML without JavaScript, props, hover and manual controls, delay cancellation, interrupted returns, rapid replay, stale completion callbacks, template upgrades, independent instances, removal, reconnection, touch and mouse input, keyboard focus, and reduced motion. An initial run exposed a timing race in the existing Check removal scenario: its 100 ms opacity track could finish between counting and removing the element. The shared test now pauses tracks at pointer entry, matching the existing template-upgrade scenario, without changing production behavior. Bundle inspection reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

After integrating ArrowDown and Archive, the complete Chrome suite reported `165 passed (3.1m)`. A concurrent ArrowUpRight merge added a separate recipe and helper without changing existing icon production code. After resolving the shared exports, documentation, and bundle inspection, `pnpm check` passed again, and the focused Bot/ArrowUpRight contract run reported `30 passed (30.2s)`. The shared test pauses added on both branches were deduplicated during integration.

After integrating ArrowDown, Archive, and ArrowUpRight, Bot's production route imports the following chunks. The shared chunk split changes because Archive uses the full Motion API. Bot's recipe still uses `motion/mini` and adds no CSS. `/arrow-bot/` loads the union of ArrowLeft and Bot, totaling 11,336 raw bytes and 5,029 gzip bytes. Gzip totals sum individually compressed chunks.

| Imported Bot chunk | Raw bytes | Gzip bytes |
| --- | --- | --- |
| `Bot.astro_astro_type_script_index_0_lang.B6I_D6tZ.js` | 646 | 403 |
| `resolve-elements.uR7bWyEF.js` | 7,648 | 3,006 |
| `animate-style.CqlGSeCm.js` | 2,022 | 976 |
| Bot route total | 10,316 | 4,385 |

A production build with Astro 7.3.8 and Motion 13.5.1 produced these totals. Gzip totals sum the individually compressed chunks.

| Route | External entries | Imported JS chunks | Raw JS bytes | Gzip JS bytes | CSS bytes |
| --- | --- | --- | --- | --- | --- |
| `/plain/` | 0 | 0 | 0 | 0 | 0 |
| `/single/` | 1 | 3 | 10,379 | 4,265 | 123 |
| `/map-pin-single/` | 1 | 2 | 10,224 | 4,099 | 123 |
| `/both/` | 2 | 4 | 11,241 | 4,743 | 123 |
| `/copy-single/` | 1 | 3 | 13,975 | 5,812 | 123 |
| `/arrow-copy/` | 2 | 5 | 14,992 | 6,456 | 123 |
| `/check-single/` | 1 | 2 | 9,944 | 4,013 | 123 |
| `/copy-check/` | 2 | 4 | 14,557 | 6,204 | 123 |
| `/at-sign-single/` | 1 | 2 | 10,175 | 4,064 | 123 |
| `/arrow-at-sign/` | 2 | 4 | 11,192 | 4,708 | 123 |
| `/arrow-right-single/` | 1 | 3 | 14,722 | 6,193 | 123 |
| `/arrow-left-right/` | 2 | 5 | 15,739 | 6,837 | 123 |
| `/arrow-up-single/` | 1 | 4 | 14,600 | 6,214 | 123 |
| `/arrows/` | 2 | 5 | 14,853 | 6,408 | 123 |
| `/arrow-down-single/` | 1 | 4 | 15,275 | 6,557 | 123 |
| `/arrow-down-left/` | 2 | 5 | 15,528 | 6,751 | 123 |

The production build imports these JavaScript chunks. The arrow helper and lifecycle are shared; each icon registers only its own element.

After integrating Archive and ArrowDown, the AudioLines production build adds `AudioLines.astro_astro_type_script_index_0_lang.DMqdn5We.js` with 1,312 raw bytes and 608 gzip bytes. It imports the shared `resolve-elements.uR7bWyEF.js` chunk with 7,648 raw bytes and 3,006 gzip bytes, and `animate-style.CqlGSeCm.js` with 2,022 raw bytes and 976 gzip bytes. `/audio-lines-single/` loads those three chunks for a total of 10,982 raw bytes and 4,590 gzip bytes, plus 123 bytes of shared CSS. `/arrow-audio-lines/` loads five chunks for 12,002 raw bytes and 5,234 gzip bytes. Bundle inspection verifies that the combined route loads exactly the union of its individual icon chunks, excludes unused registrations, and adds no icon-specific CSS. These measurements are from 2026-10-15; chunk hashes can change on rebuild.

| Chunk | Raw bytes | Gzip bytes |
| --- | --- | --- |
| `ArrowLeft.astro_astro_type_script_index_0_lang.UwyhE99H.js` | 253 | 194 |
| `animate-style.BLONbVKL.js` | 9,362 | 3,621 |
| `arrow.oBrIjw3q.js` | 764 | 450 |
| `MapPin.astro_astro_type_script_index_0_lang.oiIrofDQ.js` | 862 | 478 |
| `Copy.astro_astro_type_script_index_0_lang.DdRFSo9E.js` | 561 | 350 |
| `spring.lZsRY_TK.js` | 4,052 | 1,841 |
| `Check.astro_astro_type_script_index_0_lang.D1T-1x_O.js` | 582 | 392 |
| `AtSign.astro_astro_type_script_index_0_lang.DpV-AWxW.js` | 813 | 443 |
| `ArrowRight.astro_astro_type_script_index_0_lang.C15l-eBQ.js` | 1,308 | 731 |
| `ArrowUp.astro_astro_type_script_index_0_lang.BLx2hsjl.js` | 422 | 302 |
| `ArrowDown.astro_astro_type_script_index_0_lang.BbAqEzCr.js` | 1,097 | 645 |

ArrowDown alone excludes other icon registrations and uses the same 123-byte CSS. ArrowLeft with ArrowDown loads the union of their individual chunks. Chunk hashes can change on rebuild.

Archive verification on 2026-10-15 completed with `pnpm check`, `pnpm test:build`, `pnpm test --workers=1`, and `pnpm inspect:bundle`. The test run used a temporary Playwright configuration pointing at this worktree's preview on port 45330. Astro diagnostics reported zero errors, warnings, or hints, and TypeScript exited successfully. After integration with AtSign, ArrowUp, ArrowRight, and ArrowDown, Chrome reported `145 passed (2.9m)`. Archive scenarios cover the initial SVG without JavaScript, props, hover and held poses, standalone and controlled playback, position and velocity during interruption, rapid playback, completed morph callbacks, removal, reconnection, templates inserted before and after registration, touch, keyboard focus, mouse input with a touch primary pointer, and reduced-motion changes. Its JS-driven tracks are verified through rendered geometry and SVG attributes rather than `getAnimations()`.

The independent Archive preview sampled entry and a return interrupted at 96 ms at 16, 48, 96, 192, 304, 512, and 896 ms. The reference resamples its current pose at the moment of interruption, as Motion does. The final full test run measured a maximum screen-coordinate difference of 0.0043 px across all four sizes. The automated bound is 0.03 px. A separate Chrome comparison against the live React component on [lucide-animated.com](https://lucide-animated.com/icons/archive), with both browser clocks controlled, measured a maximum difference of 0.000031 px over the same sizes and samples. The live site's CSS enlarges its preview to 48 px; this comparison overrode that preview sizing to compare equal rendered sizes. The live geometry, spring, path timing, and interrupted return agreed with the pinned recipe. These samples do not establish pixel-identical antialiasing or visual acceptance.

The Archive build produced the following imported chunks. Gzip totals sum individually compressed chunks. Chunk names can change on rebuild.

| Chunk | Raw bytes | Gzip bytes |
| --- | --- | --- |
| `Archive.astro_astro_type_script_index_0_lang.Co68OOsf.js` | 45,124 | 16,758 |
| `resolve-elements.uR7bWyEF.js` | 7,648 | 3,006 |
| `spring.BQl6Gvt7.js` | 4,081 | 1,852 |
| Archive route total | 56,853 | 21,616 |

`/archive-single/` has one external entry, three imported JS chunks, no inline script, and the same 123 bytes of CSS as the other icons. `/arrow-archive/` has two entries and six imported chunks, totaling 59,895 raw bytes and 23,236 gzip bytes. Its chunks are the exact union of the individual routes. Inspection reported `Selective loading verified: shared CSS only, unused icon behavior excluded.` Archive adds no CSS selectors and no React code. The full Motion API changes the shared chunk split for this build: ArrowLeft alone totals 10,690 raw bytes and 4,626 gzip bytes, while retaining its existing behavior. The earlier table records the build before Archive.

Browser behavior has been checked in Chrome. Firefox and Safari remain unverified. An ArrowLeft peak-frame comparison at 14, 16, 24, and 28 px retains small antialiasing differences between the dashed shaft and the reference's shortened path. The ignored local playground has a `/map-pin/` comparison at 14, 16, 24, and 28 px. It pairs the Astro adapter with a native keyframe reproduction of the upstream recipe, with play and stop controls. A Chrome comparison at 150, 300, 400, 550, and 800 ms matched translation, opacity, normalized dash length, and normalized dash offset at all four sizes. It does not execute the upstream React component. Start it with `pnpm --dir apps/playground dev` when the local playground is present. The committed `/map-pin/` browser fixture also provides hover and manual controls without a presentation stylesheet. Visual acceptance belongs to Victor, including the movement at small sizes.

After integrating ArrowUpRight from main, ArrowUpLeft reuses the existing diagonal helper. `pnpm check` passed, `pnpm test:build` built 55 pages, and `pnpm test --workers=1 --config=.artifacts/playwright.arrow-up-left.config.ts` reported `177 passed (2.3m)` in Chrome. Both diagonal icons' interruption, replay, and small-size comparisons pass. `pnpm inspect:bundle` confirmed selective loading for all icons. ArrowUpLeft alone loads five JS chunks totaling 15,090 raw bytes and 6,707 gzip bytes. `/arrow-left-up-left/` loads their exact union, seven chunks totaling 16,110 raw bytes and 7,351 gzip bytes. Both routes retain the shared 123-byte CSS. Earlier measurements above record the builds before the shared recipe and Archive changed the chunk split.

| ArrowUpLeft imported chunk | Raw bytes | Gzip bytes |
| --- | --- | --- |
| `ArrowUpLeft.astro_astro_type_script_index_0_lang.p1XQ-jGE.js` | 262 | 199 |
| `diagonal-arrow.HqOdX1ez.js` | 1,077 | 674 |
| `resolve-elements.uR7bWyEF.js` | 7,648 | 3,006 |
| `spring.BQl6Gvt7.js` | 4,081 | 1,852 |
| `animate-style.CqlGSeCm.js` | 2,022 | 976 |

After Bot and AttachFile were added to main, `pnpm check` passed, `pnpm test:build` built 65 pages, and bundle inspection passed. Focused Chrome validation ran `tests/arrow-up-left.spec.ts tests/bot.spec.ts tests/attach-file.spec.ts` and reported `35 passed (29.6s)`. The shared accessibility, props, and lifecycle files filtered with `--grep 'Bot|AttachFile|ArrowUpLeft'` reported `24 passed (10.5s)`. Both commands used `--workers=1 --config=.artifacts/playwright.arrow-up-left.config.ts`. The previously tested shared lifecycle and diagonal recipe were unchanged by these catalog integrations.

After the AudioLines catalog integration, the shared lifecycle, shared diagonal recipe, and ArrowUpLeft implementation were unchanged. `pnpm check`, the 70-page fixture build, and bundle inspection passed. The ArrowUpLeft file reported `8 passed (8.0s)`; shared props, accessibility, and lifecycle scenarios filtered with `--grep 'AudioLines|ArrowUpLeft'` reported `16 passed (7.1s)`. Both commands used the same local config and one worker.

## Attribution

ArrowUpLeft adapts Lucide Animated's [pinned ArrowUpLeft recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up-left.tsx).

The SVG derives from Lucide and Feather. The animations adapt Lucide Animated's [pinned ArrowUp recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up.tsx), [ArrowLeft recipe](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx), [MapPin recipe](https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx), [Copy recipe](https://github.com/pqoqubbw/icons/blob/main/icons/copy.tsx), [Check recipe](https://github.com/pqoqubbw/icons/blob/main/icons/check.tsx), [AtSign recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/at-sign.tsx), [ArrowRight recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-right.tsx), [ArrowDown recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-down.tsx), and [Archive recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/archive.tsx). AudioLines adapts the [pinned AudioLines recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/audio-lines.tsx). Applicable ISC and MIT notices are preserved in [the package notices](packages/animated-icons/THIRD_PARTY_NOTICES.md). Motion remains a package dependency under its own license.
