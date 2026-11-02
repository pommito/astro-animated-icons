# JavaScript budgets and benchmarks

Issue [#108](https://github.com/pommito/astro-animated-icons/issues/108) supplies the reference for #109, #110 and #112. Production starts at `90302b37876ba25f417b63ffd721fbab5e21f0aa`. The package name is `@grave/animated-icons`. The [results](../docs/history/2026-11-02-low-javascript-budgets.md) record the measurements and their limits.

The numerical targets remain proposed until the architecture decision in #110. Passing the baseline ceilings establishes no runtime reduction. No experimental wrapper belongs in the production package.

## Reproduce payloads

Use Node 22.20.0 and pnpm 12.5.1 for comparison with this reference. Install the locked dependencies, then run from the repository root:

```sh
rtk pnpm install --frozen-lockfile
rtk proxy node scripts/measure-page-loading.mjs
rtk proxy node scripts/check-loading-budgets.mjs
rtk proxy node benchmarks/summarize-loading.mjs
rtk pnpm validate
```

The measurement creates isolated full and minimal production builds under `.artifacts/page-loading/`. It changes no package source. The full build includes the comparison fixture elsewhere in its graph. The minimal build contains only the loading pages and imports the same public barrel. It is a linked consumer, not an npm installation.

[loading-cases.json](loading-cases.json) freezes all 549 existing compositions, including one, four, ten, twenty repeated instances, mixed mechanisms, repeated families, unused imports and Motion mixtures. `path-paint-repeated` is stress coverage with 1780 hosts, including Motion WindArrowDown. Its result is not a common-page estimate. The checker rejects missing or changed compositions. A new catalogue or fixture composition needs an explicit reference update.

[javascript-budgets.json](javascript-budgets.json) contains exact per-route raw/gzip JavaScript, JavaScript file and complete-page ceilings for both consumers. It also contains all 104 warm-transition ceilings per consumer. The checker rejects Motion modules on CSS-only pages. Unused imports must reach zero JavaScript. Repetitions retain the existing resource-reuse checks.

The checker uses eventual reachable JavaScript, including literal dynamic imports. `graph.initial` follows static imports; `graph.eventual` also follows dynamic imports; `graph.deferred` is their difference. Rollup graph edges must agree with the existing source inspector. Modules have source IDs, roles, rendered lengths and their containing chunk's SHA-256. A future recovery path cannot exclude its code from the eventual budget by moving it to first playback.

Run the proposed reduction check separately:

```sh
rtk proxy node scripts/check-loading-budgets.mjs --proposed
```

This command intentionally fails on the unchanged reference. The four mechanism targets are proposals for the smaller-client proof. They do not apply to #109 as a demand to finish compiler removal. #109 must improve simple-cycle raw/gzip, remove both combined modules from simple pages and report every mixed/combined regression. #110 evaluates the complete targets and records their acceptance or revision. #112 uses the LoaderCircle and Motion-mixture reference rows.

The checker also accepts a saved report path. The checked-in report is reproducible without the original experiment worktree:

```sh
rtk proxy node scripts/check-loading-budgets.mjs docs/history/2026-11-02-low-javascript-loading.json
```

## Count bytes consistently

Count shared resources once per URL. Gzip uses Node zlib defaults per external resource. `javascript` includes eventual external JavaScript. `total` includes JavaScript and separately compressed inline/external CSS. `page` compresses the HTML with its inline content once, then adds external JavaScript and CSS. `recipeData` is a diagnostic subset of HTML, not another page cost. Its gzip value compresses each attribute separately and is not a transferable resource.

Warm transitions reuse URLs from the first document in the same build, with fresh HTML for the second document. They model no eviction or revalidation. They do not measure ClientRouter timing or cross-build cache reuse. Headers, latency and Brotli are outside the byte model.

Module `renderedLength` describes source contributions before final minification. Use it to locate removable code. It cannot allocate compressed chunk bytes additively. The attribution report separates lifecycle, discovery, registration, adapters, stylesheet compilers, recovery, combined sampling, codecs and Motion.

For each candidate, preserve both consumers' reports before replacing a build. Report HTML/CSS/recipe data and complete-page deltas alongside JavaScript. A renamed asset can change warm costs even when its body has the same size. A regression requires an explicit architecture decision; raising a ceiling is not evidence of an improvement.

## Record actual requests

Run this separately from routine validation. Prepare the payload builds first. In two terminals, serve their outputs on unused ports:

```sh
rtk proxy env PORT=45363 node experiments/recipe-delivery/serve.mjs .artifacts/page-loading/minimal-dist
rtk proxy env PORT=45364 node experiments/recipe-delivery/serve.mjs .artifacts/page-loading/full-dist
```

Launch a dedicated visible Chrome instance with a temporary profile. This macOS example does not use the user's profile:

```sh
rtk proxy '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --user-data-dir=/private/tmp/astro-icons-108-chrome --remote-debugging-port=45365 --no-first-run --no-default-browser-check about:blank
rtk proxy node benchmarks/trace-requests.mjs
```

Override `CHROME_DEBUG_URL`, `BENCHMARK_MINIMAL_URL` and `BENCHMARK_FULL_URL` when using other ports. The runner uses Node's WebSocket API and Chrome DevTools Protocol, with no additional dependency. It creates and closes its own tabs and leaves the selected browser running.

The runner disables the HTTP cache and records actual request URLs/types and resource timing body sizes. It records initial load, first playback, replay, deleted-sheet recovery, late clones and reconnection for the common mechanisms and a Motion mixture. Settlement is 1800 ms per phase. It reuses the existing source-removed template controls and a real ClientRouter document transition. The link activation is programmatic. These checks do not establish native pointer behavior or visual acceptance.

Results go to `.artifacts/page-loading/request-trace.json`. Relate requested script URLs to the module metadata and chunk bytes in the matching payload report. Keep exceptional harness scripts distinct from ordinary consumer entries. An inert template can carry a processed entry that runs only when its content mounts. Report that request even if its dependencies were already loaded. Include JSON requests separately if a future representation adds them.

## Preserve and rerun timing campaigns

The rejected delivery sources live under `experiments/recipe-delivery`, `experiments/recipe-delivery-v2` and `experiments/recipe-delivery-runtime`. Their dated reports retain the conclusions at each experiment stage. The current decision rejects the bounded representation for production.

The [archive](evidence/2026-11-02/) contains the original loading baseline, two independent server runs, one browser run, its environment, summary and compact costs for the rejected variants. `import-manifest.json` records the original imported file hashes before portability/documentation changes. Raw evidence hashes are checked on restoration. It contains no build, cache, profile or `node_modules`.

To verify historical samples without rerunning a campaign, run these commands before preparing new payload builds. Restoration replaces matching files under `.artifacts/`:

```sh
rtk proxy node benchmarks/restore-evidence.mjs
rtk proxy node experiments/recipe-delivery-runtime/verify.mjs
rtk proxy node experiments/recipe-delivery-runtime/summary.mjs
rtk proxy node --test experiments/recipe-delivery-runtime/stats.test.mjs
```

To reproduce the bounded payload proof, use a checkout of this benchmark revision with locked dependencies:

```sh
rtk proxy node scripts/measure-page-loading.mjs
rtk proxy node experiments/recipe-delivery/prepare.mjs
rtk proxy node experiments/recipe-delivery-v2/prepare.mjs
rtk proxy node experiments/recipe-delivery-v2/run.mjs
rtk proxy node experiments/recipe-delivery-v2/verify.mjs
```

The Vite aliases are confined to the experimental builds. The v2 resolver uses the current experiment directory instead of the original author's path. Historical `report.mjs` files are retained to document report generation at the time. Their fixed test-count checks and prose are historical; use the current validation command and write a newly dated report for a new candidate.

The [runtime protocol](../experiments/recipe-delivery-runtime/README.md) compiles real Astro scenes in production mode. Every render gets fresh locals. Run five warmup pairs and thirty measured pairs per case in each of two independent processes, alternating AB and BA order. Small cases batch 32 or eight renders and count one batch as one statistical sample. Separate streaming runs use three warmup pairs and fifteen measured pairs per process, measuring the first complete SVG and total stream consumption.

After preparing the proof builds, prepare the runtime scene and run each server campaign in a fresh process:

```sh
rtk proxy node experiments/recipe-delivery-runtime/prepare.mjs
rtk proxy node experiments/recipe-delivery-runtime/run-server.mjs
rtk proxy cp .artifacts/recipe-delivery-runtime/server.json .artifacts/recipe-delivery-runtime/server-run-1.json
rtk proxy node experiments/recipe-delivery-runtime/run-server.mjs
rtk proxy cp .artifacts/recipe-delivery-runtime/server.json .artifacts/recipe-delivery-runtime/server-run-2.json
```

Coordinate before starting a timing campaign. Run server and browser campaigns sequentially with no competing campaign on the machine. The archived measurements used an M1 Pro, Node 22.20.0, Astro 7.3.8 and Motion 13.5.1. Record the candidate revision, lockfile, versions, hardware, visibility, motion preference and competing work. Rebuild both variants from the same locked environment. No new timing campaign ran for #108.

Chrome timing uses fresh visible documents with warm assets, three warmup pairs and twenty measured pairs. Its 1100 by 800 frame has a new custom-element registry each time. Launch at most twenty matched hosts, with the same tags and geometry-read counts in each pair. Do not reuse the abandoned all-host calibration. Use `browser-server.mjs` and its documented `runPreparation({ warmups: 3, pairs: 20 })` controller, save `browser.json` as `browser-run-1.json`, and preserve the browser environment before verification and summary.

Use 5000 deterministic paired bootstrap resamples, preserve raw pairs, show medians, p95s and 95% intervals, and discard no outliers. A smaller JavaScript payload cannot approve a server, streaming, readiness, first-launch or complete-page regression. Review those paired differences before the architecture decision. No hardware-dependent millisecond threshold belongs in `pnpm validate`.

For a later runtime candidate, keep this revision as the reference checkout and prepare the candidate's own builds and compiled scenes with the same cases. The archived renderer compares the original components with the rejected v2 wrappers; changing its candidate requires a newly reviewed adapter and fresh controls. Do not present its historical samples as measurements of another design.

If public naming changes, first run a naming-only build pair with unchanged runtime and locked dependencies. Preserve that baseline before attributing further savings to #109, #110 or #112.
