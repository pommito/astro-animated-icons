# Validation

The user reviews rendered icons and animations manually. Automated validation checks types, production output, catalogue integrity, and the validation scripts without launching a browser.

## Automated checks

Run `pnpm validate` before completing an icon, runtime, export, dependency, fixture, or validation change. This single workflow checks:

- Package and consumer Astro types, plus shared fixture data types.
- A production fixture build, reusing output when its inputs and contents match.
- Catalogue membership, public exports, registrations in generated bundles, shared CSS, selective loading, and combined-route chunk unions.
- Initial SVG geometry, attributes, native links, custom-element tags, and accessible SVG markup for every exported icon.
- Recipe/compiler agreement, exact serialized recipe records and selected registration mechanisms, generated stylesheet selection and markers, repeated-instance deduplication, cross-family chunk unions, unused barrel imports, and comparison coverage for migrated recipes.
- The drawing checker, bundle inspector, CSS validators, and fixture cache through Node tests, including deliberately broken inputs.

The drawing checker reads built HTML and the recorded expectations in `tests/helpers/`. It does not execute animation code. A passing build and bundle inspection do not establish that custom elements register successfully at runtime.

For a new icon, add its expected drawing to the existing family data, its consumer pages, and its single-icon and combined-route bundle cases. Update a drawing expectation only for an intended change and review that diff. Keep comparison fixtures and pinned source attribution current.

For a validation-script change, name the failure its existing tests should detect. Add a focused Node test when a new failure needs coverage. Ordinary icon changes reuse the existing checks.

Documentation-only edits require checking referenced commands, paths, and anchors against the integrated implementation.

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

Preserve dated evidence under [docs/history/](history/). The [migration plan](css-migration-plan.md) links the current evidence and records the scope of owner visual acceptance.

### Recipe manifests and numerical thresholds

After changing a migrated recipe or adding one, regenerate the comparison manifest before preparing the fixture:

```sh
node scripts/css-migration-catalogue.mjs --write
pnpm validate
```

The manifest is [tests/helpers/css-migration-cases.json](../tests/helpers/css-migration-cases.json). It derives membership and finish/replay policies from current recipes and compiler data. Validation rejects a stale manifest or a migrated recipe without comparison coverage. The integrated cases include each migrated icon, families, repeated mixed families, all migrated icons, Motion mixtures, and unused barrel imports. The unused route may retain common wrapper CSS; it must contain no scripts or recipe CSS.

The chevron, capability, and integrated validators share [the CSS route contract](../scripts/css-route-contract.mjs). It checks expected SVG count and parity, exact stylesheet selection and active markers, registrations, script entries, JavaScript budgets, and chunk unions. Family callers keep their compositions and budgets. These checks inspect production output without executing playback.

Numerical comparisons use 14, 16, 24, and 28 px drawings. The current Bell rotation tolerance is 0.03 degrees because its previous Motion helper samples easing while CSS evaluates the curve continuously. Translation and matrix-component tolerance is 0.005; opacity tolerance is 0.001. Inspect all failures and record the measured maximum. Do not enlarge a tolerance to conceal a behavior change. Shared recipe data can hide a wrong value in both engines, so compare extracted data with the preceding definition as well as comparing poses.

The current [integration record](history/2026-10-23-css-integration.md) and original [21-recipe verification](history/2026-10-23-css-migration.md) contain dated results and limitations. Their thresholds are comparison tolerances, not visual acceptance.

### Reproduce browser and payload evidence

Serve the fixture on an unused port, for example:

```sh
ICON_TEST_PORT=45337 pnpm fixture:serve
```

Open `/css-migration/` for the acceptance index. Run playback and lifecycle controls on `/css-pilot/`, `/css-chevrons/`, and `/css-capabilities/`; inspect their JSON results. Run independent-template controls on `/css-pilot/templates/` and `/css-capabilities/templates/`. These compare the previous local Motion mechanisms with the public CSS components using shared data and drawings. They do not execute upstream React components.

The three comparison pages have sticky `Play all` and `Stop all` controls, per-icon play and stop buttons, synchronized mouse row hover, and collapsible numerical checks. UserRoundCog appears on `/css-capabilities/#user-round-cog`. Its controls also check the exact positive half-turn and compare 324 matrices captured from the preceding local Motion implementation, with the same 0.005 tolerance. Folder has a separate `/folder-css/` comparison. Its entry shares recipe data with the Motion reference; its intentional 200 ms CSS return differs from the reference's spring and has separate owner acceptance in PR #92.

`/combined-transforms/` compares KeySquare, Wallet, and KeyCircle with fixture-only references using the preceding local Motion helpers and the same cycles and drawings. The playback control also checks 1644 saved pre-extraction Motion matrices, including KeyCircle's quarter offsets and rotation thirds. Matrix tolerance remains 0.005. `/combined-transforms/templates/` checks independent templates and late sheet reconciliation. The shared `/page-loading/templates/` check includes all three combined recipes after source removal. The native media probe includes them and verifies captured-variable cleanup. Keep these browser results separate from synthetic lifecycle results and owner visual acceptance.

`/supported-six/` compares Disc3, PanelLeftClose, PanelLeftOpen, PanelRightOpen, BriefcaseBusiness and TreePine at all four sizes. Its shared finite comparison controls check playback, stale callbacks and cleanup against both the preceding group/SVG-parts helpers and 5848 saved pre-extraction Motion poses. These local references share cycle data and drawings; they do not execute upstream React components. `/supported-six/templates/` checks independent templates and late stylesheet reconciliation. The source-removed templates and native media routes below also cover all six. The owner visually accepted the complete set on 2026-10-30 at `30b07aac9d24a056d57df17fabd69a8abd5c46ea`; the [acceptance record](history/2026-10-30-supported-six-acceptance.md) identifies its scope.

On `/page-loading/templates/`, run `Check registration and templates`. The page removes the source template and its generated sheets before the shared registration scripts run. Independent host clones must register from their own data, recover styles, play, return, disconnect and reconnect. The control also checks nested inert templates through a synthetic `astro:page-load` event. Report that event separately from a real Astro navigation.

Use `/page-loading/navigation/a/` and its link to page B for a real ClientRouter transition. Bell and CalendarDays appear on A; CircleHelp and CircleDashed first appear on B. Confirm that the document stays loaded, the new tags register, and their playback works while the existing CSS mechanism scripts remain reused.

On `/css-migration/media/`, disable reduced motion and select `Prepare paused entry`. Enable reduced motion in DevTools and select `Check reduced motion`. Disable it again and select `Check restored playback`. This uses native matchMedia with browser media emulation. Report it separately from matchMedia stubs and operating-system preference changes.

Stop the fixture server before rebuilding in the same worktree. For payloads, prepare one production build, then run:

```sh
pnpm fixture:prepare
mkdir -p .artifacts
MIGRATION_RESULT=.artifacts/css-migration-payloads.json node scripts/measure-css-migration.mjs
```

The measurement covers generated compositions from the same manifest. Positive savings mean the public implementation is smaller. Compare `total` for normalized JavaScript plus CSS, and `page` for HTML compressed with its inline content plus external resources. The normalized total compresses inline styles independently and excludes HTML. Whole-page totals avoid counting inline content twice. Both count reachable shared chunks and external CSS URLs once per route, using Node zlib gzip defaults and a cold cache. Report Node, pnpm, Astro, Motion, TypeScript, OS, and hardware versions with the result. Include regressions when Motion is already loaded.

Run `node scripts/measure-page-loading.mjs` for the full fixture and the minimal production consumer. It builds isolated outputs under `.artifacts/page-loading/` and records one, four, ten, all migrated icons, repeated instances, Motion mixtures and unused imports. Compare the current output with the dated baseline before a loading change. The `recipeData` field measures encoded recipe attributes separately; it is already included in HTML and must not be added to `page`. Warm transitions model same-build external URL reuse and always fetch the second HTML document again.
