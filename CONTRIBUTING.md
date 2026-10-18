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
- Consumer pages in [the Astro fixture](tests/fixtures/astro/src/pages) and recipe tests under [tests/](tests). Keep a no-JavaScript integration check for the complete drawing and native control, plus recipe playback and cleanup checks. Use the existing family helper when it fits.
- Single-icon and combined-route cases in [the bundle inspector](scripts/inspect-bundle.mjs), with matching fixture pages.
- Source attribution and applicable [third-party notices](packages/animated-icons/THIRD_PARTY_NOTICES.md).

Pin the upstream recipe revision used for the adaptation. Provide a comparison fixture for visual review and describe how its reference is produced, including whether it executes the upstream component.

Shared API, accessibility, and lifecycle tests use documented representatives in [the coverage guide](docs/validation.md). An icon that uses existing mechanisms does not need another props route or a copy of the shared test matrix. Add a representative when a new mechanism needs shared coverage.

Update the README when the common API or setup changes. Keep icon-specific details with the affected recipe, tests, and attribution.

## Validate the change

During normal icon work, run:

```sh
pnpm check
pnpm test tests/check.spec.ts --workers=2
```

Replace `tests/check.spec.ts` with the affected recipe suite. Repeat that test while editing. The fixture rebuilds when its inputs change and reuses its output when they do not. Selecting another test alone does not require a rebuild.

The preparation command hashes the package, fixture, imported test helpers, workspace manifests, lockfiles, installed dependency metadata, Node version, and build environment. It also checks the content of built output. Changes, added or deleted input files, missing assets, or altered output invalidate the cache. Build environment includes `ASTRO_*`, `VITE_*`, and `NODE_OPTIONS`; fixture processes use `NODE_ENV=production`. Run `pnpm test:build` to force a fresh build after changing another build input or dependency outside the frozen-lockfile workflow. A source change during a build rejects the result.

`pnpm test:prepare` prepares output without starting a server. `pnpm test:fresh tests/check.spec.ts --workers=2` forces a build before the selected tests. Both use the same preparation code as ordinary tests. The fixture lock in `.artifacts/fixture.lock` prevents a build from replacing output while this checkout serves it. Stop the server before rebuilding. If a killed process leaves a lock, check its recorded PID and remove the lock only after that process has stopped. Use separate checkouts and ports for concurrent runs.

Broaden validation when the change affects shared behavior:

- For shared rendering, input, or lifecycle changes, run `pnpm test tests/api.spec.ts tests/accessibility.spec.ts tests/lifecycle.spec.ts --workers=2`, then the affected recipe suites. Run the complete suite before finishing.
- For exports or loading changes, run `pnpm test:prepare`, then `pnpm inspect:bundle`. The inspector checks selective loading and agreement between icon directories, exports, and bundle cases. It rejects stale output.
- For inspector changes, also run `pnpm test:bundle`. It keeps the negative checks against temporary output copies.
- For fixture preparation changes, run `pnpm test:fixture` and verify a focused browser run. Check occupied-port rejection when changing server behavior.
- For documentation changes, verify referenced paths, anchors, and commands against the repository.

Before submitting a change, run complete validation:

```sh
pnpm validate --workers=2
```

This runs type checks, one forced fixture build, bundle inspection, inspector negative tests, fixture cache tests, and the complete Chrome suite. Later steps reuse the fresh output. The [coverage guide](docs/validation.md) maps these checks to the consumer guarantees they protect.

For refactors, name the behavior being preserved and compare before and after results when feasible. Automated timing and geometry checks support manual visual review. Visual acceptance belongs to the user.

## Open a pull request

Keep the change focused. Follow the title style used in the repository, such as `feat(icons): add animated Example icon`, `fix(icons): restore interrupted playback`, or `docs: clarify contribution guidelines`.

Describe the problem and final behavior, explain design choices that affect review, and link the related issue when applicable. Include the commands run and relevant output, the behavior they establish, and anything left unverified. State which browsers were checked. For animation changes, link the comparison fixture and report measured differences separately from visual acceptance.
