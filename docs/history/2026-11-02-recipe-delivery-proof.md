# Recipe delivery proof

The proof reduces the repeated paint page by 36116 gzip bytes in the minimal consumer and 36070 in the full consumer. I would not integrate it unchanged. It adds 237 bytes to a minimal EyeOff page and 903 bytes to the adjacent three-copy catalogue. These steps establish a fresh baseline and a runnable architecture experiment. Production remains unchanged at `90302b37876ba25f417b63ffd721fbab5e21f0aa`.

The short-URL proof removes about 60.3% of the earlier 59876-byte repeated-page regression. It still exceeds the preceding Motion page by 23760 gzip bytes. Eight of 549 measured compositions improve in each consumer; 536 regress and five stay unchanged. The cases are a test matrix, not a traffic-weighted forecast.

## Baseline and conditions

Fresh baseline builds reproduce the 2026-10-30 production-paint measurements, including the minimal repeated-page total of 186794 bytes. Both consumers use public package imports and installed workspace links. The full fixture builds 2862 pages, and the minimal consumer builds the same 549 loading compositions without comparison implementations.

The environment is Node v22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, TypeScript 6.0.3, darwin arm64, Apple M1 Pro. Cold totals compress HTML once, including inline styles and data, then add reachable external JavaScript and CSS once per URL. Gzip uses Node zlib defaults. Warm totals model reuse of those URLs within one build and a fresh HTML fetch. They are not network timings.

The path-paint scope contains 89 original candidates, including WindArrowDown on Motion. There are 88 CSS records per group and 1760 CSS hosts in the twenty-group repetition. Repeated-all contains three adjacent copies of each of the 120 migrated recipes. Dynamic all changed membership during earlier migrations, so this report compares identical compositions on the current commit.

## Diagnosis

The repeated paint HTML contains 583980 raw bytes of recipe attributes, including their leading spaces. Removing every recipe attribute reduces HTML gzip from 172581 to 115530. This is an invalid delivery format and only isolates the cost. Keeping the first complete record and dropping later records reduces it to 118505. That second format cannot register a reference-only clone after every source record disappears.

The baseline already deduplicates generated sheets and runtime. Those resources do not multiply with the instance count. Removing styles alone reduces repeated HTML gzip to 157100, while per-record deflate plus base64 increases it to 299777. The latter is an HTML experiment with no decoder cost included; it already loses on payload alone. Compression benefits depend on distance between repeated strings. Shortening HTML does not guarantee a smaller compressed page.

## Measured proof

These are complete-page gzip bytes. Delta is proof minus baseline. The proof uses the same drawings, recipes, generated CSS, adapters and lifecycle. Only experimental wrappers and registration delivery change through Vite aliases.

| Consumer | Composition | JS files before / after | Baseline | Short-URL proof | Delta |
| --- | --- | ---: | ---: | ---: | ---: |
| full | paint-eye-off | 5 / 5 | 4149 | 4431 | 282 |
| full | path-paint | 15 / 15 | 38505 | 38789 | 284 |
| full | path-paint-repeated | 15 / 15 | 187297 | 151227 | -36070 |
| full | all | 9 / 9 | 49194 | 49548 | 354 |
| full | repeated-all | 9 / 9 | 52214 | 53245 | 1031 |
| full | one | 5 / 5 | 3884 | 4162 | 278 |
| full | repeated | 5 / 5 | 4437 | 4312 | -125 |
| full | path-paint-loader | 21 / 21 | 57384 | 57667 | 283 |
| full | unused | 0 / 0 | 209 | 209 | 0 |
| minimal | paint-eye-off | 3 / 3 | 3979 | 4216 | 237 |
| minimal | path-paint | 11 / 11 | 38003 | 38240 | 237 |
| minimal | path-paint-repeated | 11 / 11 | 186794 | 150678 | -36116 |
| minimal | all | 5 / 5 | 48865 | 49091 | 226 |
| minimal | repeated-all | 5 / 5 | 51885 | 52788 | 903 |
| minimal | one | 3 / 3 | 3717 | 3951 | 234 |
| minimal | repeated | 3 / 3 | 4269 | 4100 | -169 |
| minimal | path-paint-loader | 15 / 15 | 54286 | 54523 | 237 |
| minimal | unused | 0 / 0 | 209 | 209 | 0 |

The first asset naming scheme included a source hash and Vite's hash. It saved only 20601 bytes on the minimal repeated paint page. Generating each input as `<icon>/r.json` lets Vite emit a shorter `r.<hash>.json` URL and raises the saving to 36116 bytes. No runtime code guesses an asset path. Every reference uses the URL returned by Vite.

The adjacent three-copy catalogue loses 903 bytes despite a 79350-byte HTML reduction. Its repeated original records already compress well. References add new URL strings, and the more capable discovery module adds JavaScript. EyeOff has no repeated record to remove, so it pays that runtime cost with no HTML saving.

For warm path-paint to path-paint-repeated, minimal HTML transfer falls from 172581 to 136229 gzip bytes with no new external resource. For LoaderCircle to path-paint plus LoaderCircle, the modeled total rises from 27174 to 27411. Headers, Brotli, cache policy, cross-build reuse, preparation time and frame pacing are excluded.

Normal pages fetch no recovery JSON. The exceptional all-source-removed test fetches 120 distinct JSON assets for 240 clones. Their bodies total 34390 raw bytes, or 15128 modeled gzip bytes when compressed separately. Those exceptional costs are separate from normal page totals. The local test server serves plain bodies; the gzip figure is a calculation, not observed transfer compression.

The [payload record](2026-11-02-recipe-delivery-payloads.json) preserves all 549 cold compositions and modeled warm transitions in each consumer, the long-URL variant and the diagnostic HTML experiments. Original raw build results remain in `.artifacts/page-loading/` and `.artifacts/recipe-delivery/` in this worktree.

## Proposed architecture

Keep the transport module separate from recipe authoring and playback. Its server interface receives a tag, the existing serialized wire, the mechanism, its emitted recovery URL and request-local state. It returns either a complete recipe attribute or a recovery reference. Callers keep their current recipe types and compiler calls.

1. The first rendered instance of each recipe keeps its complete existing wire record. It also emits the generated stylesheet through the existing request-local deduplication.
2. Later instances keep their original SVG and a short emitted JSON URL. The generated JSON contains the same wire as the inline record. This adds a generated artifact, not a second maintained recipe.
3. Client discovery first reads complete records across the document and nested inert templates. It defines the existing public custom-element classes through the same recipe factories. Normal repeated instances then upgrade without fetching JSON.
4. For an unknown tag whose complete source record has disappeared, discovery fetches the referenced asset once while registration is pending. It decodes the same wire and defines the same class. Existing stylesheet recovery rebuilds any missing sheet from that recipe.

The client interface can remain `registerCSSRecipes(attribute, create)`. Extend its implementation for the second discovery pass and pending recovery requests. Keep engine-specific decoding in the existing three entries. Public imports, tags, props, SVG, `startAnimation()` and `stopAnimation()` stay unchanged. Consumers already wait for `customElements.whenDefined()`. Only recovery of an unknown reference-only clone adds asynchronous data loading.

Generate each recovery JSON and its URL import from the existing authoring data during package preparation. Package the generated files under `src`, which is already included by the package file list. A per-icon server import supplies its own URL to the shared wrapper. Importing unused icons must still emit no browser script or recipe record for them. The proof uses a server-only URL map to avoid editing 120 icon adapters; it sends no catalogue map to the browser. Per-icon generation, packed-package installation and release checks remain proposed work.

Vite supplies the final asset URL, including the configured base. Resolve template references against the active document base. An inert template's content has a separate document with an unusable base for this purpose. The browser test found that error in the first loader and passed after correction. A future codec change must invalidate recovery assets when its interpretation changes, even if an old wire happens to serialize identically.

A missing recovery asset leaves that unknown clone unregistered. The proof reports the failed request, clears its pending entry and retries on a later `astro:page-load`. Standard inline-backed pages do not need that asset to register. Error reporting and retry policy need explicit review before integration.

## Alternatives and decision

A document-only table gives a stronger HTML saving, but loses the existing source-removed clone contract. A separately compressed payload on every host loses on the measured repeated page. The hybrid preserves that contract and keeps the number of JavaScript files unchanged, but its fixed runtime and per-type URLs impose a cost on small or locally repeated compositions.

I recommend retaining the hybrid as a candidate and keeping this version outside production. Before integration, decide whether a fixed cost of roughly 0.24 kB on minimal single-icon pages is acceptable. The adjacent-copy regression needs a separate delivery policy experiment or an explicit accepted tradeoff. Avoid an unmeasured repeat-count heuristic. Every future variant must retain the same clone tests and repeat the complete-page measurements.

No production mechanism, icon adapter, inventory decision, documented public contract or migration status has changed. This experiment does not grant approval to integrate it.

## Verification

- `rtk proxy node scripts/measure-page-loading.mjs` built and verified 549 baseline compositions in each consumer.
- `rtk proxy node experiments/recipe-delivery/diagnose.mjs` reproduced the 59876-byte earlier regression and saved the HTML removal/compression experiments.
- `rtk proxy node experiments/recipe-delivery/prepare.mjs` generated 120 exact recovery records and three isolated wrappers.
- `rtk proxy node experiments/recipe-delivery/run.mjs` built both consumers and checked all 549 compositions in each. It verifies exact initial SVG, unchanged CSS, one complete inline record per selected recipe, exact recovery data, selected registration entry counts and no unused-route JavaScript.
- A focused `tsc --ignoreConfig --noEmit` invocation with strict DOM types passed for the proof loader and all three registration entries. The exact command is in the experiment README.
- `rtk pnpm validate` passed 108 tests, all 470 production drawings, 944 bundle cases and 120 migrated recipes across 132 compositions.

Separate Chrome 154 checks passed for 120 ordinary instances, zero normal JSON requests, deleted-sheet recovery, 240 source-removed reference clones, deduplicated recovery fetches, playback and completed return cleanup. One recipe was discoverable only through two nested inert templates before mounting. Reconnection passed for EyeOff. The negative control remained unregistered without either record or reference. A 404 caused one failed request for two clones, then a corrected URL and synthetic page-load event registered them. The [browser record](2026-11-02-recipe-delivery-browser.json) separates these scenarios.

The first cleanup probe waited 1200 ms and failed on legitimate longer returns. The corrected probe waits 2000 ms; the longest reviewed paint return is 1500 ms. This changes the probe deadline, not the recipes or tolerances.

Browser probes use programmatic manual playback and synthetic events. They establish no visual acceptance, native mouse/touch behavior, real ClientRouter navigation, reduced-motion behavior or full pose parity for this delivery experiment. Safari, Firefox, custom asset bases/CDNs, fetch latency, frame pacing and packed-package installation remain unverified. The unchanged production validation and earlier animation evidence retain their own scopes.
