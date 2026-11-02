# Recipe delivery experiment

This code is archived evidence for issue #108. The bounded delivery design is rejected for production because its server and browser costs offset the stress-page transfer saving. The [benchmark guide](../../benchmarks/README.md) records the current protocol, budgets and decision status. Historical reports preserve the conclusions available at their original stage.


This is the proof requested for steps 1 and 2. It starts at main `90302b37876ba25f417b63ffd721fbab5e21f0aa`. It does not change production icons, playback, recipes, inventory decisions or public loading documentation.

Read the [results and proposed architecture](../../docs/history/2026-11-02-recipe-delivery-proof.md) before choosing an integration. The proof reduces one large repeated composition and regresses small pages and the adjacent-copy catalogue. Integration requires a separate decision.

## Reproduce the measurements

Run from the repository root with the locked dependencies installed:

```sh
rtk proxy node scripts/measure-page-loading.mjs
rtk proxy node experiments/recipe-delivery/diagnose.mjs
rtk proxy node experiments/recipe-delivery/prepare.mjs
rtk proxy node experiments/recipe-delivery/run.mjs
```

The baseline is `.artifacts/page-loading/baseline.json`. The proof is `.artifacts/recipe-delivery/proof.json`. Both contain 549 identical loading compositions in each of the full and minimal consumers. Normal page totals include HTML and reachable JavaScript/CSS. Exceptional JSON recovery is measured separately.

To compare the longer asset names, run `prepare.mjs --long-urls`, then `run.mjs` and preserve its output before returning to the default preparation. The saved long-URL record in the report predates the template base-URL correction. Reproducing it with the corrected loader can change a few gzip bytes.

Preparation generates exact JSON wires and URL imports under `.artifacts/recipe-delivery/generated/`. It copies the three existing wrappers into this experiment and changes only their delivery attributes and registration entry. The proof config aliases public icon imports to those wrappers. The server-only URL map is an experiment convenience. Production generation would supply each icon's own URL without a client catalogue map.

The checks in `run.mjs` verify initial SVG equality, stylesheet equality, exact inline and recovery data, selected registration entry counts and unused imports. They do not replace the existing production registration checks, which continue to require self-contained records on every host.

## Check the experimental loader types

```sh
rtk pnpm exec tsc --ignoreConfig --noEmit --target ES2022 --module ESNext --moduleResolution bundler --lib ES2022,DOM,DOM.Iterable --strict --skipLibCheck experiments/recipe-delivery/register.ts experiments/recipe-delivery/register-cycle.ts experiments/recipe-delivery/register-opacity.ts experiments/recipe-delivery/register-paint.ts
```

## Reproduce the browser probes

Serve the built proof:

```sh
rtk proxy node experiments/recipe-delivery/serve.mjs .artifacts/recipe-delivery/minimal-dist
```

The server uses port 45343. Open each scenario in a fresh Chrome document so no custom-element definitions survive from an earlier test. Evaluate the function stored in the corresponding file:

| Page | Probe | Expected result |
| --- | --- | --- |
| `/page-loading/all/` | `browser/normal.js` | 120 registered and animated hosts, zero JSON requests, 120 recovered sheets and no animations after return. |
| `/proof-harness/` | `browser/clone.js` | 240 source-removed clones across 120 recipes, one fetch per recipe, nested inert-template discovery and cleanup. |
| `/proof-harness/` | `browser/negative.js` | No registration without data, one failed fetch for two clones, then successful explicit retry through a synthetic page-load event. |

Each function returns a JSON summary and saves it as `window.__deliveryResult`. These are programmatic playback and delivery tests. They provide no owner visual acceptance, native input coverage, real ClientRouter navigation or cross-browser guarantee.

The longest reviewed paint return is 1500 ms. The probes wait 2000 ms before checking completed returns.

## Preserve the report

Save the three browser summaries as an array in `.artifacts/recipe-delivery/browser.json`. Preserve the earlier long-URL run as `.artifacts/recipe-delivery/proof-long-urls.json`. Run production validation and save its output to `.artifacts/recipe-delivery/validation.txt`:

```sh
rtk pnpm validate > .artifacts/recipe-delivery/validation.txt 2>&1
rtk proxy node experiments/recipe-delivery/report.mjs
rtk git diff --check
```

`report.mjs` reads those results and writes the dated report, compact payload record and browser record under `docs/history/`. The report records the unchanged production validation separately from the experimental build and browser checks.
