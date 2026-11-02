# Recipe delivery runtime measurements

The bounded proof adds measurable rendering cost. It also delays browser readiness on the large repeated page with warm assets. I would not integrate it unchanged on these results. Production remains at `90302b37876ba25f417b63ffd721fbab5e21f0aa`.

The large page saves 24108 gzip bytes, as recorded in the [payload proof](2026-11-02-bounded-recipe-delivery.md). Its median server render increases from 32.277 to 39.896 ms, about 23.6%. Chrome readiness increases from 120.75 to 137.20 ms. The smaller cases retain identical delivered HTML and JavaScript, but the server still pays for the proof wrapper and byte accounting.

## Inputs and protocol

The cases are one EyeOff, twenty CircleDashed instances, all 120 CSS recipes, three adjacent copies of those recipes, and twenty copies of the original 89-member paint scope. The last contains 1780 hosts, including retained Motion WindArrowDown, and 1423 reference hosts in the proof. The baseline and proof use the same drawings, recipes, public props and playback factories.

Node v22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1 and TypeScript 6.0.3 run on the same Apple M1 Pro, darwin arm64. Chrome is 154.0.0.0 with DPR 2, a visible 1100 by 800 iframe and reduced motion disabled. The browser reports ten logical processors and a deviceMemory value of 16. These are measurements from one machine, without imposed CPU or network throttling.

Server and browser campaigns ran sequentially. Two independent production Node builds provide 30 measured pairs per case after five warmup pairs. Each pair alternates AB or BA order. Small server cases batch 32 or eight renders; the other cases render once. Reported values are per-render times. Each batch provides one statistical sample. GC runs naturally. Module loading, compilation and container creation are excluded.

The server benchmark runs the production-compiled Astro container API. Generated proof adapters change only the shared CSS-wrapper imports. Motion adapters stay original. Every render receives fresh locals. Control renders must match the production SVG strings and reference counts. This is not an HTTP adapter or a cold-start measurement. Static sites pay rendering during generation rather than on each request for a generated file.

Chrome runs 20 measured fresh-frame pairs per case after three warmup pairs. HTML is fetched once outside measurement and supplied as srcdoc. A base URL selects each build's assets. The custom-element registry is new in every frame. All measured resource requests hit the warm cache, no normal recipe JSON request occurs, and all documents remain visible. This excludes HTML transfer and the network benefit of the saved 24.1 kB.

Tables show medians and, where listed, observed p95s. Intervals use 5000 deterministic paired bootstrap resamples and estimate the difference between medians. No outliers are discarded. The [evidence record](2026-11-02-recipe-delivery-runtime-evidence.json) contains raw paired samples, per-process server summaries, controls, environment and source hashes. Intervals describe sampling variation within these campaigns. Other machines remain untested.

## Complete server render

Times are elapsed milliseconds per rendered scene. The timer includes the container render and construction of its complete HTML string, with no compression or HTTP delivery.

| Case | Reference median | Proof median | Difference | 95% interval for difference | Reference / proof p95 |
| --- | ---: | ---: | ---: | ---: | ---: |
| paint-eye-off | 0.107 | 0.118 | 0.011 | -0.001 to 0.031 | 0.157 / 0.192 |
| repeated | 0.551 | 0.873 | 0.323 | 0.294 to 0.360 | 0.672 / 1.069 |
| all | 5.921 | 6.844 | 0.923 | 0.709 to 1.195 | 7.222 / 8.255 |
| repeated-all | 9.403 | 12.298 | 2.895 | 2.594 to 3.280 | 10.450 / 13.839 |
| path-paint-repeated | 32.277 | 39.896 | 7.619 | 7.097 to 8.081 | 48.131 / 61.877 |

Both independent server runs show the increase on the twenty-instance, 120-recipe, 360-instance and large repeated scenes. The one-icon effect is about 0.011 ms and its pooled interval crosses zero. I would not infer a stable regression for that small case from these samples.

The twenty-instance scene rises about 58.6%, or 0.323 ms in absolute time. The 360-instance scene rises about 30.8%, or 2.895 ms. Both deliver byte-identical output in the payload experiment. The large scene rises about 7.619 ms despite producing a shorter response.

The proof performs an eager drawing-slot render, JSON serialization and byte counting on every CSS instance. The inline path then calls the original wrapper. These operations are present even when delivery stays unchanged. The measurements do not allocate the time difference to individual functions; that would require a profile.

Process CPU milliseconds show the same direction. They include CPU used by concurrent GC and other threads in the benchmark process, so they can exceed elapsed wall time. They are not main-thread self-time.

| Case | Reference CPU median | Proof CPU median |
| --- | ---: | ---: |
| paint-eye-off | 0.178 | 0.206 |
| repeated | 0.587 | 1.026 |
| all | 6.758 | 8.049 |
| repeated-all | 12.380 | 15.949 |
| path-paint-repeated | 53.559 | 66.968 |

## Streaming to the first complete SVG

A separate streaming container runs three warmup pairs and 15 measured pairs per process. The timer ends when the response reader first receives a complete closing SVG tag. This includes response creation and stream reading/decoding. It measures renderer output. Network TTFB remains outside scope. Total stream times and chunk counts remain in the evidence.

| Case | Reference median ms | Proof median ms | Difference ms | 95% interval for difference |
| --- | ---: | ---: | ---: | ---: |
| paint-eye-off | 0.087 | 0.109 | 0.022 | 0.017 to 0.046 |
| repeated | 0.441 | 0.708 | 0.266 | 0.235 to 0.320 |
| all | 5.759 | 6.756 | 0.997 | 0.416 to 1.472 |
| repeated-all | 9.170 | 12.358 | 3.189 | 2.092 to 3.985 |
| path-paint-repeated | 30.026 | 38.371 | 8.345 | 6.970 to 9.347 |

On the large scene, the first complete SVG arrives about 8.345 ms later. The proof adds eager work before useful drawing output appears in this container. An actual adapter, proxy or compression layer could change flush behavior and has not been measured.

## Browser readiness

The readiness milestone follows the load event, every custom-element definition and a forced initial layout. It includes parsing, cached module loading/evaluation, upgrades and layout. The common injected probe and iframe setup are included. It is elapsed preparation time, not a CPU profile.

| Case | Reference median ms | Proof median ms | Difference ms | 95% interval for difference | Reference / proof p95 |
| --- | ---: | ---: | ---: | ---: | ---: |
| paint-eye-off | 5.70 | 5.80 | 0.10 | 0.000 to 0.200 | 6.10 / 6.10 |
| repeated | 6.90 | 6.75 | -0.15 | -0.300 to 0.350 | 7.42 / 7.60 |
| all | 27.75 | 28.00 | 0.25 | -0.050 to 0.800 | 28.50 / 28.70 |
| repeated-all | 39.60 | 39.75 | 0.15 | -0.750 to 0.450 | 40.41 / 40.52 |
| path-paint-repeated | 120.75 | 137.20 | 16.45 | 13.150 to 17.250 | 128.54 / 141.75 |

The controls with byte-identical delivered output show differences within the observed noise. The large scene has a 16.45 ms increase, about 13.6%, with a 95% interval of 13.15 to 17.25 ms. Time inside customElements.define changes only from about 35.05 to 35.40 ms. Most of the readiness difference lies outside that synchronous call scope. The extra script nodes, module preparation and discovery pass are candidates for profiling; this benchmark does not isolate their individual costs.

The reference contains 1760 complete CSS records. The proof keeps 337 complete records and adds 1423 references that include a module script. Even with one shared recovery-module URL and no JSON fetch on a normal page, the browser must process those extra script elements. A smaller transfer does not establish a smaller preparation cost.

## First launch

After readiness and one animation frame, the probe times synchronous startAnimation calls on at most twenty hosts. It spreads them over distinct tags and alternates first and last occurrences. Pages with fewer than twenty hosts launch all of them. Exact selected tags and geometry-read counts match within every measured pair.

| Case | Hosts launched | Reference median ms | Proof median ms | 95% interval for difference |
| --- | ---: | ---: | ---: | ---: |
| paint-eye-off | 1 | 0.70 | 0.70 | -0.100 to 0.100 |
| repeated | 20 | 8.35 | 8.40 | -0.100 to 0.350 |
| all | 20 | 10.00 | 9.75 | -0.450 to 0.150 |
| repeated-all | 20 | 13.80 | 13.70 | -0.500 to 0.100 |
| path-paint-repeated | 20 | 145.50 | 147.90 | -11.002 to 16.150 |

No reliable first-launch improvement is established. On the large page, 145.50 versus 147.90 ms has a wide interval for the difference, roughly -11.00 to +16.15 ms. It supports neither a clear gain nor a precise regression claim.

An initial all-host calibration reached roughly 3.9 to 4.0 seconds when starting 360 icons together. The calibration that started all 1780 hosts did not complete in a usable time and was stopped. Its partial data is excluded. The final bounded launch measurement is explicit about the twenty-host limit; it does not estimate simultaneous launch of all 1780 icons.

## Validation and limits

Executed commands and relevant results:

`rtk proxy node experiments/recipe-delivery-runtime/prepare.mjs` creates the isolated production SSR scene and adapters.

`rtk proxy node experiments/recipe-delivery-runtime/run-server.mjs` runs each independent server campaign. Both campaigns complete all five cases with drawing and reference controls intact.

`rtk proxy node experiments/recipe-delivery-runtime/browser-server.mjs` serves the two builds and controller. Chrome runs `runPreparation({warmups:3,pairs:20})` in a fresh context.

`rtk proxy node experiments/recipe-delivery-runtime/verify.mjs` reports `Verified 300 server batch pairs, 150 streaming pairs and 100 browser pairs; matched inputs, cache hits and launch targets.`

`rtk proxy node --test experiments/recipe-delivery-runtime/stats.test.mjs` passes two tests for quantile interpolation and paired intervals under known constant regressions.

`rtk pnpm validate` passes 108 tests, 470 production drawings, 944 bundle cases and 120 CSS recipes across 132 compositions in 149.790 seconds. This validation remains browser-free. No production source, recipe, inventory decision or dependency has changed.

The benchmark adds instrumentation equally to both variants. It excludes cold starts, HTTP adapter behavior, HTML transfer, compression, high concurrency, memory/peak RSS, energy, frame pacing and real user input. Browser measurements use warm assets and srcdoc, so they do not establish real navigation timing. Safari, Firefox, real ClientRouter transitions, other hardware and owner visual acceptance remain outside this scope.

## Integration decision

I would keep the proof outside production. The 24.1 kB saving on the stress composition comes with server and browser preparation costs. The server cost also affects scenes that save no bytes. These measurements do not establish an overall loading win under a real network.

The first optimization targets would be the eager slot render and per-instance serialization/counting on the server, followed by the number of script-bearing references and their browser preparation. They are proposals for later work. This task only adds measurements and evidence, with no integration, commit or PR.
