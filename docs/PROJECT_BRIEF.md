# Project brief

Recorded on 2026-10-15 from the planning conversation in the portfolio repository. This document preserves the decisions, reasons, rejected approaches, and remaining questions. It is a handoff rather than a verbatim transcript or an implementation specification.

## Purpose

Victor wants animated Lucide icons inspired by [Lucide Animated](https://lucide-animated.com/). He wants to add icons as he needs them, starting with a few icons already used in his portfolio.

The long-term goal is an independent open-source package that others can use. Immediate work focuses on Astro. A framework-independent implementation should remain possible through the browser behavior, but a public vanilla interface and other framework adapters are future work.

Victor has not developed Web Components before. He wants to understand the implementation as it progresses. Explain how the browser lifecycle, static rendering, and animation control fit together when those parts are implemented.

## Decisions established in the conversation

- Develop the library in this separate repository. The portfolio and the boilerplate will consume it.
- Focus the first version on Astro components with a simple interface.
- Support grouped named imports so consumers can import multiple icons in one statement.
- Have Astro render the complete SVG into the initial HTML. Icons must be visible without JavaScript.
- Use Web Components to manage the browser behavior and Motion's vanilla APIs to animate the icons. React is not needed for this approach.
- Keep the SVG and animation for an icon together under package ownership. Consumers must not supply or match SVG markup themselves.
- Build the catalogue gradually from real needs. Do not port the entire library as the initial task.
- Use the local portfolio as the first consumer before publishing a package.

The package name, element names, exact props, directory layout, and initial icon selection still need implementation decisions. Examples below express the intended simplicity. They are not existing exports.

## Target Astro interface

```astro
---
import { Check, Copy, ArrowLeft } from "@grave/animated-icons/astro";
---

<ArrowLeft size={16} />
<Copy size={16} />
<Check size={16} />
```

`@grave/animated-icons` was the working name during discussion. Confirm the final package name and export path during package setup. The repository name `astro-animated-icons` does not establish an npm name or namespace.

The consumer should not need to register elements, import a separate animation runtime, or write SVG paths. Importing and rendering the Astro component should supply everything required for that icon.

Internally, an Astro component could produce a custom element such as `<grave-check>` with its SVG already inside. The component also includes the browser script that registers the element. The exact tag prefix remains provisional.

## Rendering and browser behavior

Astro and the custom element have different jobs. Astro emits the SVG during the build or server rendering. The browser upgrades the existing custom element when its script runs, and the element attaches its behavior without replacing the SVG.

A custom element used alone with empty markup, such as `<grave-check></grave-check>`, cannot provide an initial server-rendered SVG by itself. If it creates the SVG in JavaScript, the icon appears only after that JavaScript runs. The final Astro approach deliberately supplies the SVG earlier.

Maintain a shared definition for each icon so its static geometry and animation targets stay consistent. Consumers should never be able to combine one icon's SVG with another icon's animation through the normal interface.

The custom element should handle its own instances. `connectedCallback()` can attach behavior when an instance joins the document. `disconnectedCallback()` can release listeners and stop animations when it leaves. Cleanup must be implemented explicitly. Reconnection should not duplicate listeners or leave stale animation state.

Parent-triggered hover and manual playback were proposed for the first version. The former lets a link or button trigger its icon, and the latter lets application logic play an icon after an action succeeds. Exact props, methods, and interruption behavior remain to be specified.

Icons should be static on first paint. Motion should be brief and purposeful. Reduced-motion preferences need an explicit behavior, while meaningful success feedback must remain visible. Accessible names and focus behavior should remain with the native button or link where appropriate.

Shadow DOM was discussed and is optional. Light DOM was the assistant's initial recommendation because it lets existing SVG markup and consumer styling work together. It has not been established as a user-approved hard requirement.

## How the interface evolved

The first proposal separated a vanilla core from an Astro adapter. Victor then asked whether Web Components would improve portability. The benefit identified was a standard HTML interface and browser lifecycle callbacks. Vanilla JavaScript is already portable; Web Components do not automatically solve server rendering or accessibility.

A generic `<grave-icon name="check">` wrapper containing user-provided SVG was considered. Victor rejected the manual pairing because users could provide the wrong SVG, and the integration required too many steps.

The next proposal gave each icon its own element, with geometry and animation owned by the package. Individual imports were then considered too cumbersome for a large icon set. Victor requested grouped imports similar to Lucide Astro.

The final direction is grouped Astro components backed by Web Components, with Astro supplying the initial SVG. A separate vanilla registration interface and PHP server rendering were explored but are outside the first version.

## Proposed pilot icons and portfolio behavior

The assistant proposed `ArrowLeft`, `Copy`, and `Check`. Victor accepted the overall Astro direction but did not separately approve the exact icon list or motion recipes. This is the most developed candidate scope, not a finished specification.

The portfolio is at `/Users/victor/Developer/me/portfolio-new`. Its GitHub repository is [pommito/portfolio-2026](https://github.com/pommito/portfolio-2026), and its Astro application is `apps/web` with package name `@portfolio/web`.

The source inspection found these uses:

| Source in the portfolio | Existing icon or behavior | Candidate integration |
| --- | --- | --- |
| `apps/web/src/pages/[...locale]/blog/[slug].astro` | Lucide `arrow-left` in the article back link | Trigger the icon from the containing link |
| `apps/web/src/components/Prose.astro` | Lucide `copy` and `check` in a code-copy template | Hover feedback and confirmation after clipboard success |
| `apps/web/src/components/Header.astro` | Lucide `map-pin` beside static location text | Possible later icon, no interaction chosen |
| `apps/web/src/components/ArticleCard.astro` | Lucide `corner-down-right`, already revealed by CSS | Possible later icon, preserve existing behavior during initial integration |
| `apps/web/src/components/ThemeToggle.astro` | Inline sun, moon, and monitor SVGs | Possible later batch |

`Prose.astro` clones a `<template>` around highlighted code blocks in a client script. Its controls do not exist as connected document elements at initial script execution. The package needs to support custom elements inserted this way, regardless of the order in which its registration script and the consumer script execute.

The existing copy handler waits for `navigator.clipboard.writeText()`. On success it marks the button as copied, updates a live status, and resets after two seconds. Failure returns without success feedback. Preserve that meaning when adding animation. Read the current code before making changes because the portfolio has unrelated local edits.

Motion is already a portfolio dependency. `@grave/motion` is an existing internal package that supplies CSS easing tokens. The animated icon library should remain a separate package. Portfolio styling conventions belong to the consumer; the new library's styling dependencies have not been chosen.

## Repository ownership and local integration

The library now belongs at `/Users/victor/Developer/product/astro-animated-icons`. Its configured remote is [pommito/astro-animated-icons](https://github.com/pommito/astro-animated-icons).

A pnpm workspace with the library under `packages/animated-icons` and an Astro playground under `apps/playground` was proposed. This layout is optional and has not been created.

The portfolio can consume the separate local package through a pnpm `link:` dependency during development. Resolve the link from the directory containing the consuming `package.json`, not the portfolio root. The correct path depends on the library layout selected here.

If the proposed `packages/animated-icons` layout is adopted, the relative target from the portfolio's `apps/web` directory would be `../../../../product/astro-animated-icons/packages/animated-icons`. Verify that directory and package exports before installing the link.

The development setup must account for the library's own dependencies, any required compilation, and watching source changes. Verify the integration with an actual Astro build. Replacing the link with a published version should preserve the consumer import shape once the package name is settled.

The boilerplate is a later consumer. PHP adapters, a public framework-independent rendering interface, automatic loading of a complete catalogue, npm publication, and additional framework adapters are outside the first implementation.

## Verification expected for the first implementation

Choose checks before editing. The proposed acceptance scenarios are:

1. A fixture using grouped named imports builds with Astro and passes its type checks.
2. Generated HTML contains the expected SVG geometry for each rendered icon. With JavaScript disabled, icons remain visible and controls remain meaningful.
3. Repeated instances and icons cloned from a template initialize correctly whether registration happens before or after insertion.
4. Removing, reconnecting, and retriggering an instance cleans up listeners and animation state without duplicate playback.
5. Parent hover works on the intended control. Manual confirmation runs only after successful copying. Failed copying does not show success.
6. Reduced-motion mode preserves meaningful state and removes decorative spatial motion. Check in a browser.
7. A minimal consumer that uses one grouped export does not ship unused icon animations. Measure actual output, since Astro script collection and barrel exports can affect this.
8. The local linked package works in the portfolio's production build, including its existing route and SEO checks.

Report commands, expected behavior, observed results, and remaining limits. Visual acceptance remains with Victor.

## Existing artifacts and work status

Before repository ownership was settled, the assistant created [portfolio issue #5](https://github.com/pommito/portfolio-2026/issues/5), titled "Add Astro animated Lucide icons with custom elements". It describes the proposed pilot but predates the decision to use this separate repository. It has not been moved, closed, or replaced. Treat it as historical context rather than an authoritative issue in this repository.

The assistant also created the portfolio branch `feat/astro-animated-icons` in a dedicated worktree and installed the existing dependencies. No implementation files or commits were created there. That unused worktree was archived during this handoff. The portfolio's original working directory and its unrelated edits were left intact.

A small interactive teaching demo was created outside both repositories. It demonstrated adding an instance, calling a manual `play()` method, and removing the instance. Those interactions were checked in Chrome. It used a simplified native browser animation, not a Motion implementation, and does not constitute package verification.

At handoff, this repository initially contained only a README. No package runtime, package manifest, exports, playground, CI setup, or local dependency link has been implemented. No implementation task has been delegated. The current user request is to transfer context; subsequent implementation should follow the user's next task.

## Open implementation decisions

- Final npm name, namespace, component names, and custom-element prefix.
- Package layout, toolchain, supported Astro versions, and source or compiled distribution.
- Exact pilot icon list and how closely to reproduce upstream motion at the portfolio's small icon sizes.
- Trigger props, manual playback methods, reset semantics, and interruption behavior.
- Styling and accessibility props, including decorative versus labeled icons.
- Selective script loading from grouped exports and server-safe module evaluation.
- Root package license and the process for preserving upstream attribution.

## References

- [Lucide Animated](https://lucide-animated.com/) and [its documentation index](https://lucide-animated.com/llms.txt).
- [Lucide Animated source](https://github.com/pqoqubbw/icons) and [MIT license](https://github.com/pqoqubbw/icons/blob/main/LICENSE).
- Upstream recipes for [arrow-left](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx), [copy](https://github.com/pqoqubbw/icons/blob/main/icons/copy.tsx), and [check](https://github.com/pqoqubbw/icons/blob/main/icons/check.tsx). These use React and Motion for React, so they require adaptation to browser APIs from `motion`.
- [Lucide source and license notices](https://github.com/lucide-icons/lucide/blob/main/LICENSE), including Feather attribution for derived icons. Preserve applicable notices when copying geometry or adapting recipes.
- [Motion animate documentation](https://motion.dev/docs/animate).
- [Astro custom elements and client scripts](https://docs.astro.build/en/guides/client-side-scripts/#web-components-with-custom-elements).
- [MDN custom elements and lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements).

These references were consulted during planning. Recheck implementation details against the versions selected for this repository.
