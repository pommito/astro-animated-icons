# Astro animated icons

Animated Lucide icons for Astro, with complete SVG output and animations managed by Web Components. Animation engines are selected internally to preserve each icon's playback behavior.

Astro renders each icon before JavaScript runs. The browser adds animation to the existing drawing. Each rendered icon loads its own registration script and shares the common runtime and CSS. No hydration directive is needed.

## Installation

The package targets Astro `^7.2.10`. It is currently private and unpublished, so use a local link while developing.

Install this repository's dependencies:

```sh
pnpm install --frozen-lockfile
```

From the consuming Astro package directory, link the icon package. This example assumes the repositories are siblings; adjust the path for your checkout:

```sh
pnpm add '@grave/animated-icons@link:../astro-animated-icons/packages/animated-icons'
```

## Usage

Import an icon from the shared Astro entry point:

```astro
---
import { ArrowLeft } from "@grave/animated-icons/astro";
---

<a href="/blog/">
  <ArrowLeft size={16} />
  Back to articles
</a>
```

Available components and playback handle types are listed in [the public exports](packages/animated-icons/src/astro.ts). Each icon uses the same props and playback methods.

### Props

| Prop | Default | Behavior |
| --- | --- | --- |
| `size` | `28` | Numeric SVG width and height in pixels |
| `class` | None | Class on the custom-element wrapper |
| `class:list` | None | Astro class-list directive, resolved into the wrapper's class |
| `style` | None | CSS string or Astro style object on the wrapper |
| `id`, `title`, `data-*`, other HTML attributes | None | Passed to the wrapper, including Astro's parent style scope |
| `label` | None | Accessible SVG label for a meaningful standalone icon |
| `controlled` | `false` | Disables automatic hover so a client script controls playback |

The SVG inherits `currentColor` and uses a stroke width of two viewBox units. Set color through inherited text color, a class, or `style={{ color: "rebeccapurple" }}`. Use `size` for SVG dimensions; a size class on the wrapper does not resize the SVG.

### Accessibility and automatic playback

Icons are decorative by default and have no keyboard tab stop. Keep the accessible name and focus on the containing link or button. Use `label` when the icon itself needs an accessible name. HTML accessibility attributes apply to the wrapper; `label` names the inner SVG.

The nearest `a[href]` or `button` triggers hover playback. Without a containing control, the icon wrapper triggers hover. Touch contact and keyboard focus do not trigger automatic playback. Mouse hover works even when touch is the primary input. Disabled controls do not trigger hover playback.

Under `prefers-reduced-motion: reduce`, icons stay static, including during manual playback. Changing the preference during playback cancels animation and restores the drawing.

### Manual playback

Set `controlled` and wait for custom-element registration before calling the handle methods:

```astro
---
import { ArrowLeft } from "@grave/animated-icons/astro";
---

<ArrowLeft id="manual-arrow" controlled />
<button id="replay" type="button">Replay</button>
<button id="stop" type="button">Stop</button>

<script>
  import type { ArrowLeftIconHandle } from "@grave/animated-icons/astro";

  await customElements.whenDefined("grave-arrow-left");
  const icon = document.querySelector<HTMLElement & ArrowLeftIconHandle>("#manual-arrow")!;
  document.querySelector("#replay")!.addEventListener("click", () => {
    icon.startAnimation();
  });
  document.querySelector("#stop")!.addEventListener("click", () => {
    icon.stopAnimation();
  });
</script>
```

`startAnimation()` starts or replays the icon's recipe. Depending on the recipe, playback completes one cycle, holds a pose, or loops until stopped. `stopAnimation()` returns the drawing toward rest. Both methods return `void`.

Attach browser listeners in a client script. The consumer owns operations such as navigation, copying, and uploading, as well as success or error feedback. The icon owns its drawing and animation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, adding an icon, validation, and pull request guidelines. The [architecture guide](docs/architecture.md) describes the internal rendering and animation protocol. Agents start with [AGENTS.md](AGENTS.md).

## Attribution and license

The drawings derive from Lucide and Feather, and the animation recipes adapt Lucide Animated. Source links and applicable ISC and MIT notices are preserved in [the package notices](packages/animated-icons/THIRD_PARTY_NOTICES.md). Motion is a package dependency under its own license.

A root project license must be selected before publication.
