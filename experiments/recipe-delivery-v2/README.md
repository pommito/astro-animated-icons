# Bounded recipe delivery proof

This code is archived evidence for issue #108. The bounded delivery design is rejected for production because its server and browser costs offset the stress-page transfer saving. The [benchmark guide](../../benchmarks/README.md) records the current protocol, budgets and decision status. Historical reports preserve the conclusions available at their original stage.


This experiment follows [the first recipe-delivery proof](../../docs/history/2026-11-02-recipe-delivery-proof.md). It removes the universal client helper cost and preserves the original transport for close repetitions. Production remains unchanged at `90302b3`.

Read [the results and proposed architecture](../../docs/history/2026-11-02-bounded-recipe-delivery.md). The measured matrix has no page-gzip regressions. Its large repeated composition saves less than the first proof because recovery now carries its own module inside each reference host.

## Reproduce

Run from the repository root with the locked dependencies installed:

```sh
rtk proxy node scripts/measure-page-loading.mjs
rtk proxy node experiments/recipe-delivery/prepare.mjs
rtk proxy node experiments/recipe-delivery-v2/prepare.mjs
rtk proxy node experiments/recipe-delivery-v2/run.mjs
rtk proxy node experiments/recipe-delivery-v2/verify.mjs
rtk proxy node --test experiments/recipe-delivery-v2/delivery.test.mjs
```

The first preparation provides the existing generated recovery assets and mechanism entries. The second generates experimental wrappers. Vite aliases select those wrappers only in the proof builds. Results and builds live under `.artifacts/recipe-delivery-v2/`.

The delivery module counts only bytes in rendered drawing content and serialized instance records. It omits one-off sheets and unrelated page markup. A reference requires a previous instance more than 32768 counted bytes away and must be shorter than the complete attribute plus its attached module. This is a conservative locality estimate, not an exact model of gzip savings. The build verifies every chosen reference against actual HTML positions.

`verify.mjs` rejects a positive page-gzip delta in any measured composition. For pages without references, it also requires byte-identical HTML, JavaScript URLs and JavaScript bodies. It does not choose the smaller result after measuring it.

The original wrappers handle every complete record. Only a reference renders `ReferenceIcon.astro`, which adds a private slot after the unchanged SVG. That slot carries the external recovery module inside the host so native template clones retain their bootstrap. Vite's `?worker&url` import builds the recovery module independently of the original client graph. The browser executes the result as a document module. The proof creates no Worker.

## Browser verification

```sh
rtk proxy node experiments/recipe-delivery-v2/harness.mjs
rtk proxy node experiments/recipe-delivery/serve.mjs .artifacts/recipe-delivery-v2/minimal-dist
```

Use fresh Chrome documents and evaluate the stored functions:

| Page | Probe | Expected result |
| --- | --- | --- |
| `/native-clones/` | `browser/native.js` | 240 clones across 120 recipes register after their native source template disappears. The 86 reference recipes fetch once each. Playback, return, late cloning, stylesheet recovery and reconnection pass. |
| `/page-loading/repeated-all/` | `browser/normal.js` | All 360 hosts register with no recovery module or JSON request. |
| `/page-loading/path-paint-repeated/` | `browser/normal.js` | All 1780 hosts register. The 1423 reference hosts share one recovery module request and fetch no JSON on this ordinary page. |

The native harness clones actual parsed HTML before deferred bootstraps run. It does not manually import recovery scripts. One referenced recipe exists only in two nested inert templates until registration completes. This tests whether the module inside a cloned host can bootstrap itself.

Each probe stores its result as `window.__deliveryV2Result`. Browser results are programmatic checks, not visual acceptance. Native mouse/touch, real ClientRouter transitions, reduced motion and other browsers have not been rerun for this experiment.

## Types and production checks

```sh
rtk pnpm exec tsc --ignoreConfig --noEmit --target ES2022 --module ESNext --moduleResolution bundler --lib ES2022,DOM,DOM.Iterable --strict --skipLibCheck experiments/recipe-delivery-v2/delivery.ts
rtk pnpm validate
rtk git diff --check
```

The 32768-byte policy targets gzip. It gives no guarantee for arbitrary unseen compositions, Brotli or a different build graph. The eager drawing render and byte accounting also add server work that has not been timed. These limits need review before production integration.
