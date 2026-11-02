# Prepared CSS client proofs

These isolated proofs support [#110](https://github.com/pommito/astro-animated-icons/issues/110). Production stays at the selective transform implementation in `9a5a81f`. Neither proof is an approved package architecture. The proposed decision is in [ADR 0003](../../docs/adr/0003-prepared-css-client.md).

Both proofs compile the existing recipes on the server and carry enough information in each host for recovery without its source. One transport uses a complete JSON attribute. The other uses an inert template with CSS text and a JSON attribute for combined scalar samples. Both retain the original active styles, complete SVG and public handles. No catalogue registry, per-instance byte accounting, eager slot rendering or JSON fetch is introduced.

`prepare.mjs` derives the wrappers and discovery from production sources. It also derives opacity, paint and combined adapters with injected sheet recovery. Paint's runtime measurement/name helpers and combined current-time interpolation remain. Server-prepared base/unit samples replace browser Bezier sampling. `prepared.ts` caches prepared data once per recipe in request-local state. Paint is decoded on the server, so the browser omits the compact codec too. The authored `paint.ts`, `parts.ts` and `cycle.ts` remain the source of recipe data.

Generated files belong in `.artifacts/css-client/`. They are not release assets. Vite aliases affect only experimental builds. Package imports and production engine selection do not change. A production implementation would still need an owner-approved representation, stable internal data types, package/consumer qualification and final benchmarks in #111.

## Payload and compiled-page checks

Use locked dependencies and the #109 full/minimal outputs as the reference:

```sh
rtk pnpm install --frozen-lockfile
rtk proxy node scripts/measure-page-loading.mjs
rtk proxy node experiments/css-client/measure.mjs
rtk proxy node --test scripts/prepared-css.test.mjs
rtk pnpm validate
```

The measure command builds both transports in full and minimal consumers. It uses #108's graph capture and resource measurement. An explicit record-verifier callback checks the proof representation against the original recipe data before delegating to the existing registration contract. Measurement always uses the original candidate HTML. The template proof permits repeated inert CSS in diagnostics, but checks one active server sheet per recipe and exact recovery CSS. Production style-reuse checks remain enabled by default.

Each transport produces `loading.json`, both output directories and chunk/module metadata below `.artifacts/css-client/<transport>/`. The public compiled-page test first failed with the original compiler-bearing adapters. It now checks all four CSS mechanisms without a browser. Routine validation remains browser-free.

## Functional browser evidence

Start dedicated local servers for the two output pairs. These commands keep their process in the foreground:

```sh
rtk proxy env PORT=45386 node experiments/recipe-delivery/serve.mjs .artifacts/css-client/attribute/minimal/dist
rtk proxy env PORT=45387 node experiments/recipe-delivery/serve.mjs .artifacts/css-client/attribute/full/dist
rtk proxy env PORT=45388 node experiments/recipe-delivery/serve.mjs .artifacts/css-client/template/minimal/dist
rtk proxy env PORT=45389 node experiments/recipe-delivery/serve.mjs .artifacts/css-client/template/full/dist
```

Use dedicated Chrome with a temporary profile and remote debugging on port 45385. Reuse #108's request runner, once per transport, saving its result before the next run:

```sh
rtk proxy env CHROME_DEBUG_URL=http://127.0.0.1:45385 BENCHMARK_MINIMAL_URL=http://127.0.0.1:45386 BENCHMARK_FULL_URL=http://127.0.0.1:45387 node benchmarks/trace-requests.mjs
rtk proxy cp .artifacts/page-loading/request-trace.json .artifacts/css-client/attribute/requests.json
rtk proxy env CHROME_DEBUG_URL=http://127.0.0.1:45385 BENCHMARK_MINIMAL_URL=http://127.0.0.1:45388 BENCHMARK_FULL_URL=http://127.0.0.1:45389 node benchmarks/trace-requests.mjs
rtk proxy cp .artifacts/page-loading/request-trace.json .artifacts/css-client/template/requests.json
rtk proxy env FUNCTIONAL_BASE_URL=http://127.0.0.1:45387 FUNCTIONAL_RESULT=.artifacts/css-client/attribute/functional.json node experiments/css-client/functional.mjs
rtk proxy env FUNCTIONAL_BASE_URL=http://127.0.0.1:45389 FUNCTIONAL_RESULT=.artifacts/css-client/template/functional.json node experiments/css-client/functional.mjs
```

`functional.mjs` activates existing comparison, paint and independent-template controls. It adds no animation assertions. Run browser controls sequentially if every document must stay foregrounded. Request traces record each ordinary page's observed visibility; a hidden request trace is not preparation evidence. Numerical controls and synthetic lifecycle probes do not grant native-input coverage or owner visual acceptance.

The existing source-removed fixture understands both compact and decoded paint records. Its synthetic unknown-tag probe copies all host children, matching native cloning when recovery data is in an inert child. It keeps the same entry, return, disconnect, reconnect and nested-template assertions.

## Server and browser preparation

Reserve a quiet measurement window before these commands. Stop builds, validations and functional probes first. Run campaigns sequentially. The server adapter reuses #108's production-container benchmark with fresh locals, paired AB/BA order and the same batch/stream protocol. The ten scenarios add single opacity, simple, combined and mixed pages to its existing repeated, catalogue and stress cases.

```sh
rtk proxy node experiments/css-client/prepare-runtime.mjs
rtk proxy node experiments/css-client/run-runtime.mjs attribute 1
rtk proxy node experiments/css-client/run-runtime.mjs attribute 2
rtk proxy node experiments/css-client/run-runtime.mjs template 1
rtk proxy node experiments/css-client/run-runtime.mjs template 2
rtk proxy node experiments/css-client/browser-server.mjs
```

With that server running, execute one browser campaign at a time:

```sh
rtk proxy node experiments/css-client/run-browser.mjs attribute
rtk proxy node experiments/css-client/run-browser.mjs template
rtk proxy node experiments/css-client/summarize.mjs
```

`CSS_BENCHMARK_PORT` changes the base server port, default 45390. `CHROME_DEBUG_URL` changes the debug endpoint. Browser preparation reuses #108's probe/controller with fresh visible documents, warm assets, three warmup pairs, twenty measured pairs and at most twenty matched launch hosts. Its verifier requires visible documents, matched tags and geometry reads, and cache hits for external resources. The summary reuses the original protocol verifier and bootstrap statistics. Each transport has 600 server batch pairs, 300 streaming pairs and 200 browser pairs. No outlier is removed.

The summary records source hashes, both independent server runs, medians, p95, paired intervals and all loading deltas against #108 and #109. Hardware-dependent results remain outside routine CI. Report regressions across every metric before seeking an architecture decision.
