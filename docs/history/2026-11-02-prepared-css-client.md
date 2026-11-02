# Prepared CSS recovery proofs

Issue [#110](https://github.com/pommito/astro-animated-icons/issues/110) has two executable proofs and complete measured evidence. The proposed [ADR 0003](../adr/0003-prepared-css-client.md) rejects both transports because their page, server and browser preparation costs regress. Owner decision is pending. Production remains at #109's `9a5a81f`; #111 has not started.

The [proof guide](../../experiments/css-client/README.md) documents reproduction. Both transports prepare exact CSS and combined scalar data on the server. The attribute transport serializes everything into the host record. The template transport puts recovery CSS in an inert host child and scalar data in its attribute. Paint uses decoded playback data. Each host remains independently recoverable. There is no recipe registry, network fallback, deferred compiler or new consumer setting.

## Archived evidence

| Evidence | Attribute transport | Template transport |
| --- | --- | --- |
| Full/minimal payloads, modules and chunk hashes | [Loading](../../benchmarks/evidence/2026-11-02/css-client/attribute/loading.json) | [Loading](../../benchmarks/evidence/2026-11-02/css-client/template/loading.json) |
| All route/warm deltas, timing statistics and source hashes | [Summary](../../benchmarks/evidence/2026-11-02/css-client/attribute/summary.json) | [Summary](../../benchmarks/evidence/2026-11-02/css-client/template/summary.json) |
| Actual requests, first use, recovery, clones and navigation | [Requests](../../benchmarks/evidence/2026-11-02/css-client/attribute/requests.json) | [Requests](../../benchmarks/evidence/2026-11-02/css-client/template/requests.json) |
| Existing comparison and template controls | [Functional](../../benchmarks/evidence/2026-11-02/css-client/attribute/functional.json) | [Functional](../../benchmarks/evidence/2026-11-02/css-client/template/functional.json) |
| Independent server processes | [Run 1](../../benchmarks/evidence/2026-11-02/css-client/attribute/server-run-1.json), [run 2](../../benchmarks/evidence/2026-11-02/css-client/attribute/server-run-2.json) | [Run 1](../../benchmarks/evidence/2026-11-02/css-client/template/server-run-1.json), [run 2](../../benchmarks/evidence/2026-11-02/css-client/template/server-run-2.json) |
| Fresh-frame browser pairs | [Samples](../../benchmarks/evidence/2026-11-02/css-client/attribute/browser-run-1.json), [environment](../../benchmarks/evidence/2026-11-02/css-client/attribute/browser-environment.json) | [Samples](../../benchmarks/evidence/2026-11-02/css-client/template/browser-run-1.json), [environment](../../benchmarks/evidence/2026-11-02/css-client/template/browser-environment.json) |

Each payload report contains all 549 frozen compositions and 104 warm transitions in each consumer. It records initial, eventual and deferred closures, raw/gzip sizes, files, HTML, CSS, recipe attributes, normalized total and complete pages. Recovery CSS and encoded scalar data have separate diagnostic fields. These are subsets of HTML. Their independent compression is not another transferable resource and must not be added to page totals. The template's CSS diagnostic includes inert copies; the attribute's CSS text travels inside JSON. Whole-page gzip provides the consistent comparison.

Shared external URLs count once. Gzip uses Node zlib defaults per resource. HTML is compressed once with inline content. Warm costs model reuse within one build, with another HTML fetch. Headers, network latency, Brotli, eviction and cross-build reuse are excluded. The minimal build is a linked Astro consumer, not an npm installation. No identity rename is included.

## JavaScript and complete pages

All four proposed #108 raw/gzip reductions pass for both transports in both consumers. Initial and eventual JS are equal. Neither compiler nor Bezier sampler is deferred to first playback or missing-sheet recovery. Exact release ceilings remain unchanged and are not satisfied by the page/file/warm regressions.

| Minimal composition | #108 JS gzip | Attribute JS gzip | Template JS gzip | #108 page gzip | Attribute page gzip | Template page gzip |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| CircleDashed | 2491 | 1765 | 1831 | 3717 | 3199 | 3176 |
| UserRoundCog | 2794 | 1793 | 1859 | 3772 | 2833 | 2883 |
| KeySquare | 2794 | 2203 | 2269 | 6979 | 10668 | 13281 |
| EyeOff | 2991 | 2387 | 2451 | 3979 | 3606 | 3659 |
| Four icons | 4227 | 2454 | 2518 | 6155 | 4655 | 4584 |
| Ten icons | 4227 | 2454 | 2518 | 7226 | 6461 | 6141 |
| Twenty CircleDashed | 2491 | 1765 | 1831 | 4269 | 5190 | 4849 |
| All 120 CSS recipes | 6160 | 4302 | 4360 | 48865 | 82147 | 81853 |
| Three copies of all CSS recipes | 6160 | 4302 | 4360 | 51885 | 144693 | 142798 |
| All CSS plus LoaderCircle | 32616 | 30758 | 30816 | 75482 | 108772 | 108481 |
| 1780-host stress scene | 14213 | 13609 | 13673 | 186794 | 560172 | 555379 |

Values are bytes. The original stress scene includes retained Motion WindArrowDown. It is not a common-page estimate. The summary contains every raw and gzip difference against both #108 and #109, including all retained Motion mixtures.

Compared with #109, the attribute transport has 138 full-consumer and 137 minimal-consumer whole-page gzip regressions. The template transport has 137 in each consumer. Both have 82 modeled warm whole-page regressions per consumer. Compared with #108, the corresponding cold counts are 137/136 for attributes and 136/136 for templates. No ceiling was raised or new artifact excluded to make these pass.

The browser graph keeps lifecycle, discovery, prepared recovery and the selected adapters. Paint geometry/property helpers remain; compilation and compact decoding are absent. Combined runtime arithmetic interpolates prepared samples. Every compiled route is checked for the identified production compiler/sampler modules. Unused imports remain at zero JS. CSS-only pages reach no Motion implementation.

## Server and browser costs

The campaigns use Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, TypeScript 6.0.3 and an Apple M1 Pro. Chrome is 154. Source and environment records accompany the samples. Motion #112 was idle, with its browser and servers stopped. Our payload builds, validation, functional probes and server campaigns were stopped during browser timing. The two proof campaigns ran sequentially.

Each transport has 600 paired server batches from two independent production Node processes. Every render gets fresh locals. There are five warmup pairs and thirty measured pairs per scenario per process, with AB/BA order and the existing small-case batch sizes. Separate streaming runs have three warmup pairs and fifteen measured pairs per process, giving 300 measured pairs. Build, module initialization, container creation, HTTP adapters and network are excluded.

Each transport also has 200 browser pairs, twenty per scenario after three warmup pairs. The existing probe uses fresh 1100 by 800 frames, warm assets, at most twenty matched launch hosts, identical launch tags and geometry-read counts. Every measured frame is visible. The verifier checks cached external resources and zero JSON requests. No outlier is removed. Statistics use 5000 deterministic paired bootstrap resamples, medians, p95 and 95% intervals.

| Scenario | Attribute server median before / after, ms | Template server median before / after, ms | Attribute ready delta, ms | Template ready delta, ms |
| --- | ---: | ---: | ---: | ---: |
| CircleDashed | 0.140 / 0.172 | 0.146 / 0.158 | +0.300 | +0.100 |
| UserRoundCog | 0.094 / 0.095 | 0.094 / 0.093 | +0.050 | +0.300 |
| KeySquare | 0.599 / 1.012 | 0.637 / 0.949 | +0.400 | +0.650 |
| EyeOff | 0.069 / 0.103 | 0.072 / 0.092 | +0.100 | +0.450 |
| Four icons | 0.158 / 0.202 | 0.163 / 0.181 | +0.050 | +0.150 |
| Twenty CircleDashed | 0.522 / 1.116 | 0.555 / 0.702 | +1.150 | +0.800 |
| All CSS | 6.266 / 11.346 | 6.194 / 9.708 | +12.800 | +12.250 |
| Three copies of all CSS | 11.232 / 27.525 | 11.071 / 21.089 | +38.100 | +34.950 |
| Stress scene | 32.288 / 141.050 | 32.346 / 110.327 | +202.950 | +194.050 |

For all CSS, the server difference intervals are +4.788 to +5.226 ms for attributes and +3.213 to +3.707 ms for templates. Browser readiness intervals are +12.300 to +13.800 ms and +11.900 to +12.800 ms. First-SVG streaming regresses by 4.172 and 2.943 ms; total streaming regresses by 6.212 and 4.339 ms. Those complete distributions and per-process results are preserved in the summary. Several small-case intervals cross zero, so their median differences do not establish a stable change.

KeySquare's median first-launch time improves by 0.300 ms in each campaign. On larger mixed pages, first-launch differences are smaller or noisy. The stress-scene launch intervals span zero. Payload savings do not establish preparation or frame-pacing improvements. These results describe this hardware/browser campaign, not a universal timing threshold.

## Behavior and verification

Both candidates pass the existing CSS capability, combined-transform, supported-six, paint and independent-template controls. Paint compares 29,852 production poses across the five families with independent pre-extraction records. There are no reported failures. The combined controls retain 1644 saved Motion poses, the supported six retain 5848, and UserRoundCog retains 324. Matrix/translation tolerance stays 0.005, Bell rotation stays 0.03 degrees and opacity stays 0.001. No recipe, drawing or saved expectation changed.

The request runner checks initial load, first playback, replay, deleted sheets and late-clone reconnection. No later JS/JSON request appears in those ordinary phases. Methods return `undefined`. Source removal before registration, nested inert templates, early/late clones, late sheets and reconnection pass. Real ClientRouter navigation keeps the document and registers the later recipes. Link/button activation is programmatic. Attribute Cog's request snapshot was hidden during other functional controls; the archived trace records that limitation. The separate timing campaign verifies visible frames throughout.

The existing template control now accepts compact or prepared paint data and copies all host children when constructing its synthetic unknown tag. Its assertions remain unchanged. Browser controls add no new test boundary. New TDD tests are limited to compiled Astro pages, as agreed. They failed with compiler-bearing adapters and pass for both prepared mechanisms.

`rtk pnpm validate` passes 115 tests, 470 drawings and 944 bundle cases. Package, fixture and shared types have zero errors, warnings or hints. A separate strict typecheck of authored and generated proof runtimes passes. A type-only discovery specialization after timing changed no emitted chunk hash or measured byte count in either full/minimal consumer; the rebuilt artifacts were compared before retaining the timing samples. The focused compiled proof tests pass again. The original budget file is unchanged.

The protocol verifier reports 600 server, 300 streaming and 200 browser pairs per transport, with matched inputs, launch targets and cache hits. Reproduction commands, including the existing request runner, are in the proof guide. Source hashes are in each summary. Routine validation launches no browser. Safari, Firefox, installed npm consumers, native input/media qualification, frame pacing and owner visual acceptance remain unverified.

These are isolated rejected candidates awaiting an owner decision. Their measurements establish compiler-free synchronous recovery for the tested scope and expose its costs. They grant no production runtime reduction beyond #109 and no approval for #111.
