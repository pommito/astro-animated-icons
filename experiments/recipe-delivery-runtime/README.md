# Recipe delivery runtime measurements

This code is archived evidence for issue #108. The bounded delivery design is rejected for production because its server and browser costs offset the stress-page transfer saving. The [benchmark guide](../../benchmarks/README.md) records the current protocol, budgets and decision status. Historical reports preserve the conclusions available at their original stage.


This benchmark compares the unmodified reference at `90302b3` with the [bounded delivery proof](../../docs/history/2026-11-02-bounded-recipe-delivery.md). It changes no production component or animation. Read the [runtime results](../../docs/history/2026-11-02-recipe-delivery-runtime.md) before an integration decision.

## Server benchmark

Prepare the existing payload builds and generated recovery assets first, following the bounded proof README. Then run:

```sh
rtk proxy node experiments/recipe-delivery-runtime/prepare.mjs
rtk proxy node experiments/recipe-delivery-runtime/run-server.mjs
```

The preparation creates an isolated Astro project under `.artifacts/recipe-delivery-runtime/ssr-project/`. Its production build compiles a scene with the original public adapters and generated proof adapters in the same bundle. CSS proof adapters import the existing bounded wrappers. Motion adapters remain the original components.

The built page runs the container API benchmark during prerendering. Module loading, compilation and container creation occur outside timed sections. Every render receives fresh locals and the same props. Before measurements, SVG strings and reference counts must match the already measured production HTML. Streaming trials repeat the drawing and reference checks after timing stops.

Each scenario runs five warmup pairs and 30 measured pairs. The order alternates baseline/proof and proof/baseline. Small scenes batch 32 or eight renders per sample; reported times are per render. Larger scenes render once per sample. GC runs naturally. Streaming has three warmup pairs and 15 measured pairs, with time to the first complete SVG and total stream consumption recorded separately.

The result is `.artifacts/recipe-delivery-runtime/server.json`. Preserve it as `server-run-1.json`, then repeat the command in a new process and preserve `server-run-2.json`. Run the server and browser campaigns sequentially.

This measures Astro's production-compiled container renderer. It does not measure an HTTP adapter, compression, cold start or network TTFB. On a statically generated site, rendering is generation work rather than a cost on each file request.

## Browser benchmark

```sh
rtk proxy node experiments/recipe-delivery-runtime/browser-server.mjs
```

Open `http://127.0.0.1:45345/` in a fresh Chrome context, keep the document visible and run:

```js
window.browserFailure = null;
window.browserBenchmarkPromise = runPreparation({ warmups: 3, pairs: 20 })
  .then(result => { window.finalBrowserResult = result; })
  .catch(error => { window.browserFailure = String(error.stack); });
```

Read `window.benchmarkProgress` and `window.browserFailure` while it runs. Each completed scenario is saved to `.artifacts/recipe-delivery-runtime/browser.json`. Preserve the completed file as `browser-run-1.json`.

Production HTML is fetched once outside measurement, then parsed as `srcdoc` in a fresh iframe per trial. Each frame has a new custom-element registry. A base URL selects the reference or proof asset server. Both servers permit resource timing and use explicit immutable asset caching. The measurement rejects JSON fetches, hidden frames, mismatched launch targets or geometry reads. The verifier also rejects measured cache misses.

The readiness milestone follows the load event, all custom-element definitions and a forced initial layout. It includes HTML parsing, cached module loading/evaluation, upgrades and initial layout. `defineMs` times only calls to `customElements.define`, including synchronous reactions. It is not a complete registration CPU profile.

After one animation frame, the probe times synchronous `startAnimation()` calls on at most 20 hosts. It spreads selection over distinct tags and alternates first/last occurrences. Small pages launch every host. The probe records exact tags and geometry-read counts for both variants. It removes the frame after reporting, so teardown is outside the launch timer.

This benchmark excludes HTML transfer, network throttling, frame pacing and simultaneous launch of all hosts on large pages. An initial all-host calibration was stopped after the large stress case stalled the renderer. Its partial samples are separate and excluded from final statistics.

## Validate and summarize

Save the post-campaign browser environment as `.artifacts/recipe-delivery-runtime/browser-environment.json`, including browser version, DPR, motion preference and visibility. Then run:

```sh
rtk proxy node experiments/recipe-delivery-runtime/verify.mjs
rtk proxy node --test experiments/recipe-delivery-runtime/stats.test.mjs
rtk proxy node experiments/recipe-delivery-runtime/summary.mjs
rtk pnpm validate
rtk proxy node experiments/recipe-delivery-runtime/report.mjs
rtk git diff --check
```

`summary.mjs` computes medians, p95s and paired bootstrap intervals with a fixed seed. It retains per-process server results. The bootstrap resamples pairs rather than treating renders within one batch as independent samples. `report.mjs` writes a dated report and raw evidence under `docs/history/`. It expects the production validation log at `.artifacts/recipe-delivery-runtime/validation.txt`.

The campaigns use one machine and one browser version. Intervals describe these measurements. They do not establish cross-browser performance or owner visual acceptance.
