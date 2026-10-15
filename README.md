# Astro animated icons

Animated Lucide icons for Astro, with static SVG output and Motion animations managed by Web Components.

The first consumer is [Victor's portfolio](https://github.com/pommito/portfolio-2026). The project is intended to become an independent open-source package.

## Status

The local pilot implements `ArrowLeft`, `ArrowRight`, `ArrowUp`, `MapPin`, `Copy`, `Check`, `AtSign`, `ArrowDown`, `Archive`, and `FileText` in `@grave/animated-icons`. It is linked into the portfolio's article back link. The package remains private and unpublished. A root license must be chosen before publication.

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

Use `FileText` for a document link:

```astro
---
import { FileText } from "@grave/animated-icons/astro";
---

<a href="/notes/"><FileText size={16} />Read notes</a>
```

`FileText` shares the props below and exports `FileTextIconHandle`. For manual playback, set `controlled`, wait for `customElements.whenDefined("grave-file-text")`, then call `startAnimation()` or `stopAnimation()`. Astro renders all five paths before JavaScript runs. The existing Web Component lifecycle adds hover and manual playback to that SVG, and the containing link retains its name and keyboard focus.

FileText scales the whole SVG to 1.05 over 300 ms with ease-out and holds that scale until stopped. The three text paths follow normalized length 1, 0, 1 over 700 ms, starting after 300, 500, and 700 ms. Each half uses the live runtime's implicit ease-out curve. The outline and folded corner keep their geometry. The source's x1 and x2 attributes have no rendered effect on a path, whose geometry comes from `d`; the adapter omits those tracks. Measured native dash lengths preserve the visible endpoints and rounded caps at each size.

Stopping FileText cancels the delayed entry tracks. Each text path returns from its current length over 300 ms with cubic Bézier (0.25, 0.1, 0.35, 1), without delay. The scale returns with the upstream default spring, stiffness 550, damping 30, mass 1, rest speed 10, and rest delta 0.005. Like ArrowRight, the native scale track retains velocity sampled over the preceding 5 ms. Sampling the spring in scale units preserves the upstream rest threshold. Replaying restarts the text cycle at full length, as in the source, while scale starts from its current value. Removal and reduced-motion changes cancel all tracks and immediately restore the static SVG. No repeat is scheduled.

The `/file-text-comparison/` fixture compares FileText at 14, 16, 24, and 28 px against native keyframes with normalized paths and an independent analytic return spring. Play all and Stop all synchronize both columns. The fixture does not execute React. `/file-text/` provides standalone hover, manual controls, and dynamic template instances. For this task, serve the built fixture with `pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45339` and open `http://127.0.0.1:45339/file-text-comparison/`. Visual acceptance belongs to Victor.

The package owns the SVG and animation. Consumers do not register elements or import Motion. Astro emits the complete SVG in the initial HTML, then loads the rendered icon's registration script for `<grave-arrow-left>`, `<grave-arrow-right>`, `<grave-arrow-up>`, `<grave-map-pin>`, `<grave-copy>`, `<grave-check>`, `<grave-at-sign>`, `<grave-arrow-down>`, `<grave-archive>`, or `<grave-file-text>`. The browser attaches behavior to the existing markup. No hydration directive is needed.

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

`startAnimation()` starts the icon's recipe. `ArrowLeft`, `ArrowRight`, `ArrowUp`, and `ArrowDown` complete one cycle; `MapPin` stays raised and `Copy` keeps its shapes shifted until stopped. `Check` reveals and keeps the completed checkmark visible. `Archive` holds its raised lid and morphed paths until stopped. `stopAnimation()` returns ArrowLeft and MapPin to rest over 120 ms; Copy returns with its spring; Check restores its full size and path over 300 ms with a 100 ms opacity transition. Archive returns its lid with the same spring and its paths over 300 ms. Both methods return `void`. The package exports the `ArrowDownIconHandle`, `ArrowRightIconHandle`, `ArrowUpIconHandle`, `ArrowLeftIconHandle`, `MapPinIconHandle`, `CopyIconHandle`, `CheckIconHandle`, `AtSignIconHandle`, `ArchiveIconHandle`, and `FileTextIconHandle` types. Wait for registration before calling either method on an element inserted before its registration script runs.

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

On 2026-10-15, `pnpm check` completed with zero errors, warnings, or hints in Astro diagnostics, and TypeScript exited successfully. `pnpm test --workers=1 --config .artifacts/playwright.arrow-right.config.ts` reported `118 passed (1.7m)` in Chrome. The regressions include queued finish events followed by restart, stopping during or after that restart, and removal before the old finish callbacks run. Stopping MapPin leaves four return tracks; stopping Copy leaves two; stopping Check leaves three. Each restores the complete drawing. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

The ignored ArrowRight validation config copies the repository config and changes only its test directory and server port to 45331. The first full run had one timing-sensitive MapPin failure, observing three tracks instead of four during rapid replay. Its focused rerun and the final full suite passed without changes to MapPin.

ArrowUp coverage extends the shared props, insertion, reconnection, pointer, and reduced-motion scenarios. Focused tests check static HTML without JavaScript, the 200 ms peak, a fixed shaft bottom, standalone hover, manual control, interrupted return, rapid replay, and stale completion callbacks. The comparison samples entry every 50 ms from 0 to 400 ms, then returns interrupted at 50 and 200 ms at 0, 50, 100, 150, 200, 300, 400, and 600 ms. Head displacement and shaft endpoints differ by less than 0.03 screen pixels at all four sizes. Bundle inspection adds `/arrow-up-single/` and `/arrows/`, verifies that unused ArrowUp registration stays out of other pages, and checks that the two arrows share their runtime and CSS.

On 2026-10-15, `pnpm check` completed with zero errors, warnings, or hints in Astro diagnostics, and TypeScript exited successfully. `pnpm test --workers=1 --config=.artifacts/playwright.arrow-up.config.ts` reported `102 passed (1.4m)` in Chrome. The ignored local config uses port 45332; the committed Playwright config keeps port 45321. `pnpm test:build` built all 30 routes. After integrating AtSign, the template-upgrade test pauses tracks at pointer entry so its animation count cannot miss the 100 ms opacity tracks. The previously failing AtSign scenario passed five consecutive runs, followed by the full 102-test suite. The regressions include queued finish events followed by restart, stopping during or after that restart, and removal before the old finish callbacks run. Stopping MapPin leaves four return tracks; stopping Copy leaves two; stopping Check leaves three. Each restores the complete drawing. `pnpm inspect:bundle` reported `Selective loading verified: shared CSS only, unused icon behavior excluded.`

AtSign verification on 2026-10-15 ran `pnpm check`, `pnpm test:build`, `pnpm test --workers=1`, and `pnpm inspect:bundle`. A temporary Playwright configuration changed the test URL and preview server to port 45329 for concurrent icon work. Astro reported zero diagnostic errors, warnings, or hints; TypeScript passed. Chrome reported `86 passed (1.2m)`, including the existing icons. AtSign coverage includes the initial drawing without JavaScript, props, hover and manual control, delayed entry and return, interruptions at 50 and 350 ms, rapid replay with queued completions, removal, reconnection, template upgrades, touch and mouse input, keyboard focus, and reduced motion.

The comparison samples entry and both interrupted returns at 0, 25, 50, 100, 150, 299, 300, 350, 400, 450, and 600 ms. At 14, 16, 24, and 28 px, adapter and reference opacity, normalized dash length, and normalized dash offset agree to four decimal places. Shape bounds differ by less than 0.03 screen pixels. Chrome screenshots at rest, 150 ms, 450 ms, and reduced motion support visual review. The live site's circle and path geometry match the pinned source, and its registry serves identical circle and path variants. A live Chrome hover check showed the circle reveal before the delayed outer path and the complete drawing after leaving. The comparison fixture runs native keyframes rather than the upstream React component. Firefox and Safari remain unverified. Victor gives visual acceptance.

FileText comparison checks 2,520 poses across five paths, four sizes, and 18 timestamps. It checks entry and returns interrupted at 100, 250, 450, 650, 825, and 1,025 ms. Scale and normalized dash length must differ by less than 0.00005, and path endpoints and bounds by less than 0.03 screen pixels. Separate tests cover full static HTML, held scale, the absence of repeats, replay during a text cycle, stale completion callbacks, cancelled delayed work, props, template upgrades, reconnection, pointer input, keyboard focus, and reduced motion.

On 2026-10-15, the live FileText variants and geometry matched the pinned source. Inspection of the live Motion tracks confirmed 300 ms ease-out scale, 700 ms text cycles with ease-out per segment, delays of 300, 500, and 700 ms, a 550/30 scale return spring, and 300 ms text returns without delay. Changing the live top path's x1 and x2 attributes to 100 and -100 left its `d` and bounds unchanged at x=8, y=9, width=2, height=0. The live page displays a 48 px SVG through CSS while its component default remains 28 px. Screenshots compare the live 825 ms pose, the local four-size preview, and the complete reduced-motion drawing. Browser observation reported no page errors and zero local tracks after reduced motion. The preview uses native keyframes rather than React; Firefox, Safari, and Victor's visual acceptance remain unverified.

FileText validation on 2026-10-15 ran `pnpm check`, `pnpm test:build`, `pnpm test --workers=1 --config .artifacts/playwright.file-text.config.ts`, and `pnpm inspect:bundle`. Astro reported zero diagnostic errors, warnings, or hints, TypeScript passed, and the fixture built 40 routes before integration with ArrowDown and Archive. The ignored configuration changes only the fixture URL and server port to 45339, plus the relative test directory for its location. The strict full run reported `138 passed (2.5m)` with two failures in existing Check and AtSign tests that missed short tracks before counting them. The next full run added `--retries=1` and exited successfully with `139 passed (2.4m)` and `1 flaky`: the existing AtSign reduced-motion test passed on retry. All 22 FileText scenarios passed without retries, including the 2,520-pose comparison. The shared runtime and other icon recipes were not changed. Bundle inspection reported `Selective loading verified: shared CSS only, unused icon behavior excluded.` Before integration, FileText alone imported three chunks totaling 14,748 raw bytes and 6,231 gzip bytes, with the same 123 bytes of shared CSS.

After integration with ArrowDown and Archive, `pnpm check` again passed with zero Astro diagnostic errors, warnings, or hints and successful TypeScript checks. Bundle inspection again verified selective loading. FileText alone imports four chunks totaling 15,131 raw bytes and 6,615 gzip bytes. ArrowLeft with FileText imports six chunks totaling 16,151 raw bytes and 7,259 gzip bytes, the exact union of their individual chunks. Both routes use the same 123-byte stylesheet. Archive's full Motion runtime changes the shared chunk split for this build. The FileText chunks are:

| Chunk | Raw bytes | Gzip bytes |
| --- | --- | --- |
| `FileText.astro_astro_type_script_index_0_lang.DV8QPLIl.js` | 1,380 | 781 |
| `resolve-elements.uR7bWyEF.js` | 7,648 | 3,006 |
| `spring.BQl6Gvt7.js` | 4,081 | 1,852 |
| `animate-style.CqlGSeCm.js` | 2,022 | 976 |

The final integrated run of `pnpm test --workers=1 --config .artifacts/playwright.file-text.config.ts` reported `167 passed (2.5m)` without retries. Its server command rebuilt the fixture before running Chrome. To make short-track measurements deterministic, the shared accessibility and lifecycle tests now pause native animations in the pointer event before counting them. Reduced-motion tests seek those paused tracks to 50 ms before changing the preference. Check's return-duration test freezes the pointer-leave tracks, records their durations, then finishes them to verify cleanup. The package runtime and icon recipes are unchanged by this test adjustment.

After `pnpm test:build`, `pnpm inspect:bundle` reads the fixture's production HTML and reports external entry scripts, imported JS chunks, raw and gzip sizes, inline scripts, and CSS bytes. `/plain/` must have no scripts or CSS. `/single/` must have one external icon script and no inline script. The browser-test page adds a script for dynamic instances and manual control.

The fixture has a private barrel containing `ArrowLeft` and a test-only `BundleProbe`. `/selective/` renders only `ArrowLeft`; `/probe/` renders only the probe. Bundle inspection verifies that they share the same base CSS and exclude the unused element's registration code. `/map-pin-single/` renders only `MapPin`; `/both/` renders ArrowLeft and MapPin. `/copy-single/` renders only Copy; `/arrow-copy/` renders ArrowLeft and Copy. `/check-single/` renders only Check; `/copy-check/` renders Copy and Check. `/arrow-right-single/` renders only ArrowRight; `/arrow-left-right/` renders ArrowLeft and ArrowRight; `/arrows/` renders ArrowLeft and ArrowUp. Inspection verifies that each single-icon route excludes the other registrations, all reuse the same base CSS, and the browser code excludes React. ArrowLeft and Copy together, and Copy and Check together, reuse the exact union of their individual JS chunks. It prints every imported JS chunk with raw and gzip bytes.

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

## Attribution

The SVG derives from Lucide and Feather. The animations adapt Lucide Animated's [pinned ArrowUp recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up.tsx), [ArrowLeft recipe](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx), [MapPin recipe](https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx), [Copy recipe](https://github.com/pqoqubbw/icons/blob/main/icons/copy.tsx), [Check recipe](https://github.com/pqoqubbw/icons/blob/main/icons/check.tsx), [AtSign recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/at-sign.tsx), [ArrowRight recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-right.tsx), [ArrowDown recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-down.tsx), [FileText recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-text.tsx), and [Archive recipe](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/archive.tsx). Applicable ISC and MIT notices are preserved in [the package notices](packages/animated-icons/THIRD_PARTY_NOTICES.md). Motion remains a package dependency under its own license.
