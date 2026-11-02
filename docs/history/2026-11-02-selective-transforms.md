# Selective simple and combined transform clients

Issue [#109](https://github.com/pommito/astro-animated-icons/issues/109) now has a local implementation and measured evidence. The benchmark dependency is `c6008c9a003974b7a1626ce7817241a5cfb715b2`, incorporated with its history. The implementation baseline is `6b16a8bcbc4be6aa96fcf12f84124e5f16e478ad`. Remote main remained `90302b3` when work resumed. No naming change is included.

Simple transform pages no longer reach `combined-transform-cycle.ts` or `combined-transform-css.ts`. Public Astro imports, tags, props, drawings and handles remain unchanged. Combined and mixed pages have transfer and request-count regressions. No budget has been raised, and these regressions need an explicit owner decision before merge. This report grants no visual acceptance or approval for #111.

## Implementation

`CssIcon.astro` selects `CssCycleRegistration.astro` or `CssCombinedCycleRegistration.astro` from the rendered cycle data. Each processed script imports its own adapter and compiler. The common `css-transform.ts` owns displayed-pose capture, native track control, cancellation and cleanup. The combined adapter adds retained scalar capture and cleanup. `transform-css.ts` shares stylesheet formatting without importing the sampler. `transform-cycle-css.ts` dispatches compilation on the server only.

Combined hosts use `data-grave-combined-recipe` for discovery. Simple hosts retain `data-grave-cycle-recipe`. Both carry complete original cycle data. The drawing/state/style markers stay unchanged. The shared discovery and lifecycle code are byte-for-byte unchanged. This avoids charging opacity and paint pages for a new discovery predicate. The removed-source fixture explicitly loads both transform bootstraps outside its inert source template.

The registration validator counts the two transform entries separately and verifies exact serialized data. Module attribution recognizes the new adapters and compiler files. The inventory follows each definition's selected transform adapter and pins its Astro registration component. It also pins the server compiler dispatch and its dependencies as review sources, separately from the client graph. Exactly 30 transform source hashes changed after review. The 27 simple client call paths have no combined modules; the three combined paths retain them. Other decisions and family contracts are unchanged.

All 30 generated transform styles match the preceding compiler byte for byte. No maintained cycle data or saved pose changed. The combined adapter preserves the same scalar samples, identity guards and native current-time capture. The common adapter preserves cancellation ordering and displayed-pose bridges.

## Payloads

Fresh full/minimal builds reproduce the #108 reference before modification. The [candidate report](2026-11-02-selective-transforms-loading.json) contains all 549 compositions and 104 modeled warm transitions per consumer. The [complete deltas](2026-11-02-selective-transforms-deltas.json) include raw/gzip JavaScript, HTML, CSS, recipe attributes, normalized total and whole-page differences for every composition, plus file counts and warm costs. Positive deltas are regressions.

| Composition | Minimal JS raw before / after | Minimal JS gzip before / after | Full JS gzip before / after | Minimal / full page gzip delta |
| --- | ---: | ---: | ---: | ---: |
| CircleDashed control | 5269 / 5269 | 2491 / 2491 | 2658 / 2658 | 0 / 0 |
| UserRoundCog | 6240 / 4445 | 2794 / 2176 | 2961 / 2344 | -611 / -610 |
| Four mixed CSS icons | 9398 / 7603 | 4227 / 3609 | 4474 / 3857 | -612 / -612 |
| Ten mixed CSS icons | 9398 / 7603 | 4227 / 3609 | 4474 / 3857 | -610 / -609 |
| KeySquare | 6240 / 6032 | 2794 / 2859 | 2961 / 3033 | +83 / +88 |
| Combined family | 6240 / 6032 | 2794 / 2859 | 2961 / 3033 | +91 / +96 |
| Combined with simple and opacity | 9398 / 9800 | 4227 / 4671 | 4474 / 5006 | +499 / +586 |
| All 120 CSS recipes | 13954 / 14356 | 6160 / 6604 | 6487 / 7019 | +567 / +655 |
| All CSS with LoaderCircle | 79449 / 79851 | 32616 / 33060 | 35875 / 36407 | +567 / +654 |
| Unused imports | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |

The separate shared transform chunk adds one reachable file to simple and combined-only pages. A page using both transform mechanisms adds two files in the minimal consumer and three in the full consumer. Separate resources compress independently, so KeySquare's raw bytes decrease while gzip increases. All simple pages compiled by the focused integration test exclude both combined modules. Repetitions share scripts and styles. CSS-only graphs contain no Motion module. Initial and eventual JavaScript are equal, with no deferred compiler or sampler.

Each consumer has 23 routes with increased JS gzip and whole-page gzip. These are the combined single/family compositions, their repetitions and mixtures, plus all-CSS compositions. Their complete names and raw/gzip deltas are in the linked delta record. There are 65 warm whole-page gzip regressions per consumer. The largest is `ten -> all`, +1185 bytes minimal and +1272 bytes full, because code formerly cached with simple transforms now loads on the combined transition. This is a same-build URL-reuse model, not measured navigation latency.

`check-loading-budgets.mjs` deliberately remains failing on the unchanged #108 ceilings. Its first rejection is the added JavaScript file on UserRoundCog. The complete record also exposes the combined/mixed byte regressions. #110 must compare these costs with its recovery alternatives and present them for an owner decision. A passing routine validation does not override this release gate.

Measurements use Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1 and TypeScript 6.0.3 on an Apple M1 Pro. External URLs count once. Node gzip defaults compress each external resource separately. Whole-page totals compress HTML with inline content once. Recipe attributes are already included in HTML. Headers, latency, Brotli and cross-build cache reuse are excluded.

## Browser evidence

The [existing comparison results](2026-11-02-selective-transforms-browser.json) were rerun in visible Chrome 154 at 14, 16, 24 and 28 px. The controls were activated programmatically. All reported comparisons and template controls pass:

- CSS capabilities check 2440 paired snapshots and 324 saved UserRoundCog poses. Maximum matrix error is 0.000885 and opacity error is zero.
- Combined transforms check 2688 paired snapshots and 1644 saved Motion poses. Maximum paired and saved matrix error is 0.000010000000000065512.
- The supported six use their existing saved-pose and lifecycle controls. Their complete counts and maxima are in the result record.
- Independent template controls cover early/late clones, entry, return, disconnect, reconnect, late sheets and one active sheet per recipe.

The [request trace](2026-11-02-selective-transforms-requests.json) reuses #108's runner with fresh documents and HTTP cache disabled. Six ordinary routes recorded hidden documents while other functional checks activated their own targets; only `one-loader` recorded a visible document. This trace establishes request counts, not visible readiness or timing. Minimal UserRoundCog loads four scripts initially. KeySquare also loads four. The four-icon composition loads five. Those counts do not increase after first playback, replay, deleted-sheet recovery or late-clone reconnection. Methods return `undefined`. The source-removed fixture passes with no failures, including nested inert templates. A real ClientRouter transition keeps the same document and discovers CircleHelp and CircleDashed on page B. Its link activation is programmatic.

Synthetic lifecycle checks include parent pointer events, touch filtering, disabled/controlled state, matchMedia replacement and reconnection. They do not establish native input or operating-system preference behavior. No new native-media campaign, Safari/Firefox run, server timing campaign, browser preparation campaign or frame-pacing measurement belongs to this stage. Owner visual review is pending.

## Commands and review

Commands run include:

```sh
rtk proxy node scripts/measure-page-loading.mjs
rtk proxy node scripts/check-loading-budgets.mjs .artifacts/css-109-before.json
rtk proxy node --test scripts/selective-css.test.mjs scripts/cycle-css.test.mjs scripts/register-css.test.mjs scripts/registration-contract.test.mjs
rtk proxy node --test scripts/inventory-animations.test.mjs scripts/measure-page-loading.test.mjs
rtk pnpm inventory:animations --check --summary --output .artifacts/css-109-inventory.json
rtk pnpm validate
rtk proxy node scripts/check-loading-budgets.mjs docs/history/2026-11-02-selective-transforms-loading.json
rtk proxy env CHROME_DEBUG_URL=http://127.0.0.1:45385 BENCHMARK_MINIMAL_URL=http://127.0.0.1:45383 BENCHMARK_FULL_URL=http://127.0.0.1:45384 node benchmarks/trace-requests.mjs
```

The public-page integration test failed before implementation with both combined modules in Bell's graph. It now compiles all 27 public simple-transform pages and checks their actual chunk/module metadata. No new test boundary beyond compiled Astro pages was introduced. Existing compiler, discovery and browser controls were reused. An existing inventory drift case now checks a combined recipe when the combined sampler changes.

The strict inventory passes with 470 current reviews, 120 migrated recipes, 107 capability candidates and 243 Motion retentions. The final full validation result and independent Standards/Spec reviews are recorded in the delivery summary. Neither those reviews nor this implementation closes owner acceptance gates. #110 continues with isolated proofs; #111 waits for explicit ADR approval.
