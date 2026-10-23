# Validation

The user reviews rendered icons and animations manually. Automated validation checks types, production output, catalogue integrity, and the validation scripts without launching a browser.

## Automated checks

Run `pnpm validate` before completing an icon, runtime, export, dependency, fixture, or validation change. This single workflow checks:

- Package and consumer Astro types, plus shared fixture data types.
- A production fixture build, reusing output when its inputs and contents match.
- Catalogue membership, public exports, registrations in generated bundles, shared CSS, selective loading, and combined-route chunk unions.
- Initial SVG geometry, attributes, native links, custom-element tags, and accessible SVG markup for every exported icon.
- The drawing checker, bundle inspector, and fixture cache through Node tests, including deliberately broken inputs.

The drawing checker reads built HTML and the recorded expectations in `tests/helpers/`. It does not execute animation code. A passing build and bundle inspection do not establish that custom elements register successfully at runtime.

For a new icon, add its expected drawing to the existing family data, its consumer pages, and its single-icon and combined-route bundle cases. Update a drawing expectation only for an intended change and review that diff. Keep comparison fixtures and pinned source attribution current.

For a validation-script change, name the failure its existing tests should detect. Add a focused Node test when a new failure needs coverage. Ordinary icon changes reuse the existing checks.

Documentation-only edits require checking referenced commands, paths, and anchors.

## Manual review

Run `pnpm fixture:serve`, then open the affected icon and comparison pages under `tests/fixtures/astro/src/pages`. The command builds missing or stale output and serves it on port 45321. Use `ICON_TEST_PORT=45322 pnpm fixture:serve` if another checkout uses that port.

Review the initial drawing, playback, interruption, stop, replay, and any loops or queued stages affected by the change. For shared runtime changes, also exercise the affected input, reconnection, and reduced-motion behavior on suitable icons. The comparison page's implementation identifies whether its reference executes the pinned upstream component or uses an independent native animation.

The user owns visual acceptance. Report which manual checks were actually performed and leave acceptance pending when the user has not reviewed the change. Automated checks provide no browser rendering, animation timing, interaction, or runtime cleanup coverage.

## Build reuse and evidence

`pnpm fixture:prepare` prepares production output without starting a server. `pnpm fixture:build` forces a fresh build when an input lies outside the tracked cache contract. `pnpm test` prepares output and runs the Node tests. The remaining individual commands are listed in `package.json`.

`pnpm validate` prepares the fixture before running the bundle inspector, drawing checker, and Node tests directly. These stages share that preparation; fixture-cache tests still exercise preparation and freshness separately. The command reports elapsed time for each stage and the complete command. Individual `pnpm inspect:bundle`, `pnpm check:drawings`, and `pnpm test` commands keep their fixture checks.

The fixture cache hashes sources, shared fixture data, manifests, lockfiles, installed dependency metadata, Node version, and the build environment. It verifies output contents and rejects sources changed during a build. The lock in `.artifacts/fixture.lock` protects served output. Check its recorded PID before removing a lock left by a stopped process.

Report executed commands, relevant results, and anything unverified. Historical entries in `docs/history/` record earlier test strategies and executions; they do not define current requirements.

## CSS migration comparisons

Keep routine validation browser-free, following [issue #47](https://github.com/pommito/astro-animated-icons/issues/47) and [PR #73](https://github.com/pommito/astro-animated-icons/pull/73). Use comparison fixtures for numerical browser probes and owner review. A fixture reference must identify its recipe source and whether it executes upstream code.

For each migrated family, compare entry, interrupted replay, stop, stop during return, replay during return, completion, stale callbacks, disconnect, reconnection, and reduced motion. Include parent hover, touch filtering, disabled controls, and controlled mode when shared input code changes. Separate real browser input and media-query coverage from synthetic events or matchMedia stubs. Record the browser, sizes, sample times, tolerances, measured maxima, and failure count.

Measure total reachable JavaScript and CSS for single icons, families, repeated instances, and mixtures that retain Motion. Count shared resources once per route. Report raw and gzip sizes, production build versions, and compression settings. State whether HTML, inline CSS compression, headers, cache, and network costs are included. Do not infer frame pacing from payload sizes or one preparation benchmark.

Preserve dated evidence under [docs/history/](history/). The [migration plan](css-migration-plan.md) links the final evidence and records pending visual acceptance.
