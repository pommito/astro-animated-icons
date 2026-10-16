# Contributing

Read a recent [merged pull request](https://github.com/pommito/astro-animated-icons/pulls?q=is%3Apr+is%3Amerged) for a comparable change to see the expected scope and validation evidence.

## Development setup

Use Node.js 22.12 or later and pnpm 12.5.1, as declared in [package.json](package.json). Install dependencies with `pnpm install --frozen-lockfile`.

The browser tests use installed Google Chrome through Playwright's `chrome` channel. Run `pnpm exec playwright install chrome` if Chrome is absent. `pnpm test` builds and serves the Astro fixture automatically on port 45321. See [playwright.config.ts](playwright.config.ts) for server settings and [package.json](package.json) for available checks.

For manual review, build with `pnpm test:build`, then serve the fixture:

```sh
pnpm --filter @grave/animated-icons-test-fixture exec astro preview --ignore-lock --host 127.0.0.1 --port 45321
```

The `--ignore-lock` flag keeps the server in the foreground so the invoking process can manage its lifetime. Use another port if 45321 is occupied. Open the relevant route from [the fixture pages](tests/fixtures/astro/src/pages). Comparison pages provide play and stop controls; check the page's implementation to see how its reference is produced.

## Work with the existing architecture

Before changing behavior, read a comparable icon and its callers. Reuse or extend an existing mechanism when it fits. Extract shared behavior when another icon needs it, and keep recipe differences local.

Read [the architecture guide](docs/architecture.md) before changing rendering, recipes, or lifecycle behavior. Preserve the [public contract](README.md#usage), complete initial SVG without JavaScript, shared CSS, and documented input and playback behavior. Check interruption and cleanup when changing animation code.

Explain substantial design choices through the mechanism they use. Keep code comments focused on constraints or API traps that the code cannot explain.

## Add an icon

Follow a comparable icon's files and update:

- Component and handle exports in [astro.ts](packages/animated-icons/src/astro.ts).
- Consumer pages in [the Astro fixture](tests/fixtures/astro/src/pages), recipe tests, and applicable icon cases in the shared API, accessibility, and lifecycle tests under [tests/](tests).
- Single-icon and combined-route cases in [the bundle inspector](scripts/inspect-bundle.mjs), with matching fixture pages.
- Source attribution and applicable [third-party notices](packages/animated-icons/THIRD_PARTY_NOTICES.md).

Pin the upstream recipe revision used for the adaptation. Provide a comparison fixture for visual review and describe how its reference is produced, including whether it executes the upstream component.

Update the README when the common API or setup changes. Keep icon-specific details with the affected recipe, tests, and attribution.

## Validate the change

Choose checks for the behavior affected:

- For source changes, run `pnpm check` and affected Playwright scenarios with `pnpm test`. Broaden test coverage across icons when changing shared rendering or lifecycle behavior.
- For exports or loading changes, run `pnpm test:build`, then `pnpm inspect:bundle`. The inspector checks selective loading and agreement between icon directories, exports, and bundle cases.
- For inspector changes, also run `pnpm test:bundle` after building the fixture. It checks rejected output using temporary copies.
- For documentation changes, verify referenced paths, anchors, and commands against the repository.

For refactors, name the behavior being preserved and compare before and after results when feasible. Automated timing and geometry checks support manual visual review. Visual acceptance belongs to the user.

## Open a pull request

Keep the change focused. Follow the title style used in the repository, such as `feat(icons): add animated Example icon`, `fix(icons): restore interrupted playback`, or `docs: clarify contribution guidelines`.

Describe the problem and final behavior, explain design choices that affect review, and link the related issue when applicable. Include the commands run and relevant output, the behavior they establish, and anything left unverified. State which browsers were checked. For animation changes, link the comparison fixture and report measured differences separately from visual acceptance.
