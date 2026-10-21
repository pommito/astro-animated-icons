# Contributing

Read a recent [merged pull request](https://github.com/pommito/astro-animated-icons/pulls?q=is%3Apr+is%3Amerged) for a comparable change to see the expected scope and validation evidence.

## Development setup

Use Node.js 22.12 or later and pnpm 12.5.1, as declared in [package.json](package.json). Install dependencies with `pnpm install --frozen-lockfile`.

For manual review, run:

```sh
pnpm fixture:serve
```

This command prepares the production Astro fixture and keeps preview in the foreground on port 45321. Use `ICON_TEST_PORT=45322 pnpm fixture:serve` when another checkout uses that port. Open the relevant route from [the fixture pages](tests/fixtures/astro/src/pages). Comparison pages provide play and stop controls; check the page's implementation to see how its reference is produced.

## Work with the existing architecture

Before changing behavior, read a comparable icon and its callers. Reuse or extend an existing mechanism when it fits. Extract shared behavior when another icon needs it, and keep recipe differences local.

Read [the architecture guide](docs/architecture.md) before changing rendering, recipes, or lifecycle behavior. Preserve the [public contract](README.md#usage), complete initial SVG without JavaScript, shared CSS, and documented input and playback behavior. Check interruption and cleanup when changing animation code.

Explain substantial design choices through the mechanism they use. Keep code comments focused on constraints or API traps that the code cannot explain.

## Add an icon

Follow a comparable icon's files and update:

- Component and handle exports in [astro.ts](packages/animated-icons/src/astro.ts).
- Consumer pages in [the Astro fixture](tests/fixtures/astro/src/pages) and the expected drawing in the matching `tests/helpers/` data file. The HTML drawing check covers each icon without launching Chrome. Follow the automated checks and manual review described in [the validation guide](docs/validation.md).
- Single-icon and combined-route cases in [the bundle inspector](scripts/inspect-bundle.mjs), with matching fixture pages.
- Source attribution and applicable [third-party notices](packages/animated-icons/THIRD_PARTY_NOTICES.md).

Pin the upstream recipe revision used for the adaptation. Provide a comparison fixture for visual review and describe how its reference is produced, including whether it executes the upstream component.

Run `pnpm validate` after adding an icon. The user reviews its rendering and animation in the comparison fixture.

Update the README when the common API or setup changes. Keep icon-specific details with the affected recipe, tests, and attribution.

## Validate the change

Read [the validation guide](docs/validation.md), then run:

```sh
pnpm validate
```

The command checks types, prepares or reuses the production fixture, verifies the catalogue, bundles and initial SVG output, and runs the Node tests for the validation scripts. Automated validation runs without a browser. Use the existing comparison pages for manual review; the user owns visual acceptance.

Report commands, relevant results, and limitations. For refactors, name the behavior checked for preservation. Report browser checks only when someone actually performed them. Historical records describe past executions; current requirements live in the validation guide.

## Open a pull request

Keep the change focused. Follow the title style used in the repository, such as `feat(icons): add animated Example icon`, `fix(icons): restore interrupted playback`, or `docs: clarify contribution guidelines`.

Describe the problem and final behavior, explain design choices that affect review, and link the related issue when applicable. Include the commands run and relevant output, the behavior they establish, and anything left unverified. State which browsers were checked. For animation changes, link the comparison fixture and report measured differences separately from visual acceptance.
