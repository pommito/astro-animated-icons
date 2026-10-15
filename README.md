# Astro animated icons

Animated Lucide icons for Astro, with static SVG output and Motion animations managed by Web Components.

The first consumer is [Victor's portfolio](https://github.com/pommito/portfolio-2026). The project is intended to become an independent open-source package.

## Status

The local pilot implements `ArrowLeft` in `@grave/animated-icons`. It is linked into the portfolio's article back link. The package remains private and unpublished. A root license must be chosen before publication.

Read [the project brief](docs/PROJECT_BRIEF.md) for the agreed direction, API examples, open decisions, and implementation checks. Agents should start with [AGENTS.md](AGENTS.md).

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

The package owns the SVG and animation. Consumers do not register elements or import Motion. Astro emits the complete SVG in the initial HTML, then loads a script that registers `<grave-arrow-left>`. The browser attaches behavior to the existing markup. No hydration directive is needed.

| Prop | Default | Behavior |
| --- | --- | --- |
| `size` | `24` | SVG width and height, as a number in pixels or a CSS length such as `"1em"` |
| `strokeWidth` | `2` | Stroke width in the 24-unit SVG viewBox |
| `color` | `"currentColor"` | Stroke color, inherited from the control by default |
| `class` | None | Class on the custom-element wrapper |
| `label` | None | Accessible SVG label for a meaningful standalone icon |

Icons are decorative by default and cannot receive keyboard focus. Keep the name and focus on the containing link or button. An icon outside a native control stays static. Use `label` only when the icon itself needs an accessible name.

## Motion and lifecycle

The nearest `a[href]` or `button` triggers one hover animation. The arrowhead moves three SVG units to the right while the shaft shortens, then both return over 400 ms. This follows the movement in the reference supplied for the pilot and Lucide Animated's recipe. The shaft scales around its visible right endpoint. This preserves the endpoint but slightly scales its rounded cap, unlike upstream path morphing.

`motion/mini` drives CSS transforms through the Web Animations API. Retriggering starts from the current transform. Leaving the control returns the drawing over 120 ms. There is no autoplay, keyboard-focus animation, touch-hover animation, or public playback method in this first icon.

Under `prefers-reduced-motion: reduce`, the arrow stays static. Changing the preference during playback cancels the animation and restores the drawing. The consumer's control continues to provide its normal color and focus feedback.

Each instance attaches listeners in `connectedCallback()`. `disconnectedCallback()` aborts those listeners and cancels its animations. Reconnection finds the current containing control. Template clones work both before and after custom-element registration. Use the Astro component to create the template's SVG, rather than supplying SVG markup yourself.

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

Browser tests check the built fixture pages with JavaScript disabled, hover compression and return, independent instances, insertion before and after registration, cancellation on removal, reconnection to a different control, rapid retriggering, touch input, and reduced-motion changes during playback. Astro and TypeScript checks cover the package, test fixture, and test code.

After `pnpm test:build`, `pnpm inspect:bundle` reads the fixture's production HTML and reports external entry scripts, their raw and gzip sizes, and inline scripts. `/plain/` must have no scripts. `/single/` must have one external icon script and no inline script. The browser-test page reuses the icon script across repeated instances and adds a small inline script for template insertion and removal. Source imports are per icon. With one icon, selective loading of unused icon animations cannot yet be proved. Repeat this check when adding `Copy` and `Check`, including any imported child chunks.

Browser behavior has been checked in Chrome. Firefox and Safari remain unverified. Visual acceptance belongs to Victor, including how closely the scaled shaft matches the reference at small sizes.

## Attribution

The SVG derives from Lucide and Feather. The animation adapts [Lucide Animated's ArrowLeft recipe](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx). Applicable ISC and MIT notices are preserved in [the package notices](packages/animated-icons/THIRD_PARTY_NOTICES.md). Motion remains a package dependency under its own license.
