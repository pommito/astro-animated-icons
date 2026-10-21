# Contributing

Read a recent [merged pull request](https://github.com/pommito/astro-animated-icons/pulls?q=is%3Apr+is%3Amerged) for a comparable change to see the expected scope and validation evidence.

## Development setup

Use Node.js 22.12 or later and pnpm 12.5.1, as declared in [package.json](package.json). Install dependencies with `pnpm install --frozen-lockfile`.

The browser tests use installed Google Chrome through Playwright's `chrome` channel. Run `pnpm exec playwright install chrome` if Chrome is absent. `pnpm test` prepares and serves the production Astro fixture on port 45321. It builds missing or stale output and reuses matching output on consecutive runs. See [playwright.config.ts](playwright.config.ts) for server settings and [package.json](package.json) for available checks.

For manual review, run:

```sh
pnpm test:serve
```

This command prepares the fixture and keeps Astro preview in the foreground. Use `ICON_TEST_PORT=45322 pnpm test:serve` or `ICON_TEST_PORT=45322 pnpm test tests/check.spec.ts` when another checkout uses the default port. Playwright refuses to reuse an existing server, and Astro preview fails if its port is occupied. Open the relevant route from [the fixture pages](tests/fixtures/astro/src/pages). Comparison pages provide play and stop controls; check the page's implementation to see how its reference is produced.

## Work with the existing architecture

Before changing behavior, read a comparable icon and its callers. Reuse or extend an existing mechanism when it fits. Extract shared behavior when another icon needs it, and keep recipe differences local.

Read [the architecture guide](docs/architecture.md) before changing rendering, recipes, or lifecycle behavior. Preserve the [public contract](README.md#usage), complete initial SVG without JavaScript, shared CSS, and documented input and playback behavior. Check interruption and cleanup when changing animation code.

Explain substantial design choices through the mechanism they use. Keep code comments focused on constraints or API traps that the code cannot explain.

## Add an icon

Follow a comparable icon's files and update:

- Component and handle exports in [astro.ts](packages/animated-icons/src/astro.ts).
- Consumer pages in [the Astro fixture](tests/fixtures/astro/src/pages) and the expected drawing in the matching `tests/helpers/` data file. The HTML drawing check covers each icon without launching Chrome. Reuse the mechanism coverage described in [the validation guide](docs/validation.md).
- Single-icon and combined-route cases in [the bundle inspector](scripts/inspect-bundle.mjs), with matching fixture pages.
- Source attribution and applicable [third-party notices](packages/animated-icons/THIRD_PARTY_NOTICES.md).

Pin the upstream recipe revision used for the adaptation. Provide a comparison fixture for visual review and describe how its reference is produced, including whether it executes the upstream component.

Run `pnpm validate:distribution` for a new icon because its exports and consumer fixtures change. Run the appropriate shared workflow as well when introducing a mechanism.

Shared API, accessibility, and lifecycle tests use the representatives in [the coverage guide](docs/validation.md). Follow its criteria for adding coverage.

Update the README when the common API or setup changes. Keep icon-specific details with the affected recipe, tests, and attribution.

## Validate the change

Read [the validation guide](docs/validation.md) and select the workflow for the change. For an ordinary icon edit using existing mechanisms, run:

```sh
pnpm validate:icon activity
```

Replace `activity` with the affected icon slug. The command checks types, prepares or reuses the production fixture, verifies the catalogue and bundles, checks drawings, and runs production loading plus any retained regression suite for that icon. Repeat a focused existing test while debugging. A new icon using an existing mechanism needs its drawing baseline and bundle fixtures; add a browser regression only for a new mechanism or a reproduced failure.

For shared changes, select the affected mechanism with `pnpm validate:shared`. For exports, dependencies, distribution, fixture preparation, or validation infrastructure, use `pnpm validate:distribution` and the affected mechanism if behavior also changes. The validation guide lists the scopes and completion criteria. `pnpm validate` runs every retained representative and regression for central lifecycle changes or a release check.

The fixture rebuilds when its inputs or output change. Selecting another test alone does not require a rebuild. `pnpm test:prepare` prepares output without a server. `pnpm test:build` forces a fresh build for untracked build inputs; routine validation reuses valid output. The lock in `.artifacts/fixture.lock` prevents replacement while this checkout serves it. Check the recorded PID before removing a lock left by a stopped process. Use separate checkouts and ports for concurrent runs.

Report commands, results, browser, and relevant limitations. For refactors, name the behavior preserved. Separate measured differences from manual visual acceptance. Historical records describe past executions; current requirements live in the validation guide.

## Open a pull request

Keep the change focused. Follow the title style used in the repository, such as `feat(icons): add animated Example icon`, `fix(icons): restore interrupted playback`, or `docs: clarify contribution guidelines`.

Describe the problem and final behavior, explain design choices that affect review, and link the related issue when applicable. Include the commands run and relevant output, the behavior they establish, and anything left unverified. State which browsers were checked. For animation changes, link the comparison fixture and report measured differences separately from visual acceptance.
