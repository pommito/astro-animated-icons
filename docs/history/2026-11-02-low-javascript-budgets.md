# Low-JavaScript reference and proposed budgets

Issue [#108](https://github.com/pommito/astro-animated-icons/issues/108) now has committed benchmark inputs, executable tooling and raw evidence. Production remains at `90302b37876ba25f417b63ffd721fbab5e21f0aa`, under `@grave/animated-icons`. No production component, recipe, dependency, public API or animation changes in this work.

The [benchmark guide](../../benchmarks/README.md) gives the reproduction commands. [Exact ceilings](../../benchmarks/javascript-budgets.json) cover 549 frozen compositions and 104 same-build warm transitions in each consumer. They check eventual JavaScript raw/gzip, JavaScript files and complete-page transfer. Unused imports reach zero JavaScript. CSS-only graphs reach no Motion module. These ceilings preserve the reference while later changes seek reductions. The smaller-client targets below remain proposed until #110 records an owner decision.

## Reproduced payloads

Fresh isolated full and minimal production builds reproduce all 1098 archived JavaScript and page measurements with no changed byte count or file count. The [new loading record](2026-11-02-low-javascript-loading.json) adds static/dynamic chunk edges, source module identities and containing chunk hashes. It records Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1 and TypeScript 6.0.3 on an Apple M1 Pro, darwin arm64. Its lockfile SHA-256 is `1438fedfd046e4531bf8680282266add183d0503e6a0932b38810e7f6e60f7cf`.

| Composition | Hosts | Minimal JS raw / gzip | Full JS raw / gzip | Minimal / full JS files | Minimal page gzip |
| --- | ---: | ---: | ---: | ---: | ---: |
| Unused imports | 0 | 0 / 0 | 0 / 0 | 0 / 0 | 209 |
| CircleDashed | 1 | 5269 / 2491 | 5353 / 2658 | 3 / 5 | 3717 |
| UserRoundCog | 1 | 6240 / 2794 | 6322 / 2961 | 3 / 5 | 3772 |
| EyeOff | 1 | 6667 / 2991 | 6749 / 3158 | 3 / 5 | 3979 |
| Four mixed icons | 4 | 9398 / 4227 | 9561 / 4474 | 4 / 7 | 6155 |
| Ten mixed icons | 10 | 9398 / 4227 | 9561 / 4474 | 4 / 7 | 7226 |
| Repeated CircleDashed | 20 | 5269 / 2491 | 5353 / 2658 | 3 / 5 | 4269 |
| All CSS recipes | 120 | 13954 / 6160 | 14196 / 6487 | 5 / 9 | 48865 |
| Three copies of all CSS recipes | 360 | 13954 / 6160 | 14196 / 6487 | 5 / 9 | 51885 |
| LoaderCircle | 1 | 66943 / 27112 | 71471 / 30044 | 11 / 15 | 27610 |
| All CSS plus LoaderCircle | 121 | 79449 / 32616 | 84219 / 35875 | 15 / 23 | 75482 |
| Original paint scope repeated, stress | 1780 | 31887 / 14213 | 32375 / 14715 | 11 / 15 | 186794 |

All values are bytes. Resource URLs count once per route. Node gzip defaults compress each external resource. Page totals compress HTML and inline content together once. The JSON includes HTML, CSS, recipe attributes and warm transfers for every case. Recipe attribute sizes are diagnostic subsets of HTML. They must not be added to page transfer.

The full fixture changes chunk splitting even when the reachable mechanisms match the minimal consumer. These are measured compositions, not additive per-icon prices. For example, adding CSS to a page that already reaches Motion retains its required shared chunks. The 1780-host scene remains stress coverage and includes the retained Motion WindArrowDown recipe.

Every measured production graph has the same initial and eventual closure, with no literal dynamic import deferred to playback or recovery. That is an observation of this reference. The report schema and negative test retain eventual accounting when a later candidate adds a dynamic import.

## Module cost attribution

The [attribution record](2026-11-02-low-javascript-attribution.json) maps each measured source contribution to its resource. The following lengths are Rollup rendered source bytes before final minification. They do not add up to final chunk raw/gzip sizes.

| Source role | CircleDashed | UserRoundCog | KeySquare | EyeOff |
| --- | ---: | ---: | ---: | ---: |
| Shared lifecycle, `element.ts` | 2534 | 2534 | 2534 | 2534 |
| Discovery, `register-css.ts` | 636 | 636 | 636 | 636 |
| Mechanism registration | 195 | 158 | 158 | 187 |
| CSS adapter | 2387 | 2853 | 2853 | 4396 |
| Stylesheet compiler | 2837 | 3025 | 3025 | 2595 |
| Stylesheet recovery, `recipe-css.ts` | 473 | 473 | 473 | 473 |
| Combined pose/frame sampling | 0 | 2248 | 2248 | 0 |
| Other data support | 567 | 0 | 0 | 1139 |

UserRoundCog reaches both `combined-transform-cycle.ts`, 2248 rendered bytes, and `combined-transform-css.ts`, 1216. #109 can remove those 3464 rendered bytes from simple-only pages. Its remaining simple compiler contributes 1809 bytes. The combined adapter's retained pose sampling remains necessary on combined recipes. The renderer must select the appropriate registration entry without changing public imports.

Opacity compilation contributes 2837 rendered bytes. Paint compilation contributes 2595, but its geometry measurement and property/name helpers share that module with generation. Their entire module length is not removable. The recovery helper contributes another 473 bytes and still needs a replacement or retained equivalent for independent clones. The new design must preserve synchronous manual playback after registration.

LoaderCircle reaches 139599 rendered bytes in Motion modules in the minimal build, within a final 66943-byte raw / 27112-byte gzip JavaScript graph. The same Motion contribution remains in the all-CSS mixture. The stress scene reaches a different 49953-byte rendered Motion subset through WindArrowDown. #112 must compare actual graphs and mixtures; those rendered lengths cannot predict a gzip saving.

## Proposed reduction targets

These targets apply to eventual JavaScript, including first use and exceptional recovery. Both raw and gzip limits must pass. They are engineering proposals based on the removable source above. They reserve room for recovery code instead of treating every compiler byte as a compressed saving. They are not outputs of a compiler-removal proof.

| Common mechanism and representative | Desired raw / gzip reduction | Minimal proposed raw / gzip ceiling | Full proposed raw / gzip ceiling |
| --- | ---: | ---: | ---: |
| Opacity, CircleDashed | 1000 / 500 | 4269 / 1991 | 4353 / 2158 |
| Simple transform, UserRoundCog | 1500 / 800 | 4740 / 1994 | 4822 / 2161 |
| Combined transform, KeySquare | 800 / 400 | 5440 / 2394 | 5522 / 2561 |
| Paint, EyeOff | 1000 / 500 | 5667 / 2491 | 5749 / 2658 |

The simple target includes both selective combined-code loading and later compiler removal. #109 alone must show a raw/gzip improvement and remove the combined modules from simple pages. It does not have to complete #110. The combined target leaves pose sampling in place. The paint target allows less removable code than the module's full size because measurement stays in the browser. Compression mixes these source contributions, so #110 must validate or revise the target after implementing real recovery alternatives. No universal 1 kB ceiling is proposed.

Mixed mechanisms, Motion mixtures and repeated pages retain their exact baseline ceilings, including complete pages and warm transfers. New asynchronous code counts eventually even if the first script gets smaller. A proof must show all deltas, including HTML/CSS/JSON and the server/browser costs. The architecture decision must record any accepted regression before integration.

`check-loading-budgets.mjs` passes on both fresh and checked-in reports. Its separate `--proposed` mode fails on the unchanged reference at the opacity raw ceiling. This expected failure establishes that the proposed reductions have not been achieved here.

## Observed requests and recovery

The [request record](2026-11-02-low-javascript-requests.json) comes from a separate visible Chrome 154.0.8037.98 instance with a temporary profile and disabled HTTP cache. It records requests, not a new timing campaign. Script URLs map to the corresponding chunks and module metadata in the fresh payload build.

| Minimal page | Initial JS requests | After playback, replay, missing sheets and late-clone reconnection | JSON requests |
| --- | ---: | ---: | ---: |
| Unused | 0 | 0 | 0 |
| CircleDashed | 3 | 3 | 0 |
| UserRoundCog | 3 | 3 | 0 |
| EyeOff | 3 | 3 | 0 |
| KeySquare | 3 | 3 | 0 |
| Four mixed icons | 4 | 4 | 0 |
| CircleDashed plus LoaderCircle | 13 | 13 | 0 |

The manual methods return `undefined` throughout these observations. The probe records zero remaining animations after each final return. Source/module inspection and observed requests place compilers, combined sampling and the retained Motion code in the initial graph. There is no deferred compiler download on the measured production paths.

The existing source-removed template fixture passes 906 checks for early/late clones, nested inert-template discovery, playback, return, disconnect/reconnect and active-sheet reconciliation. It begins with seven requested scripts. Its final mounting of the original template requests three additional wrapper entry scripts. Those bodies contain only imports of the already loaded registration modules and total 125 raw / 185 gzip bytes. Count those entry requests as eventual fixture cost. They add no compiler, sampler or Motion source module. The fixture's own verification script and explicit bootstrap imports are separate from an ordinary consumer's graph.

The ClientRouter transition from A to B keeps the same document, fetches the second HTML document and requests no additional JavaScript. CircleHelp and CircleDashed register and accept immediate start/stop on B. The link activation is programmatic. The nested-template `astro:page-load` event in the template controls remains synthetic and separate from this document transition.

These traces cover selected mechanisms and existing exceptional fixtures. They do not establish CPU self-time, frame pacing, native pointer behavior or cross-browser qualification. Settlement lasts 1800 ms per phase. The static eventual graph supplies the conservative byte boundary beyond those sampled paths.

## Rejected delivery evidence and guardrails

The three experiment directories and eight original reports are archived outside production. [Raw samples and import hashes](../../benchmarks/evidence/2026-11-02/) no longer depend on a private worktree. Compact delivery trials preserve the first design, longer URLs, the bounded design and rejected one-off-style/64 kB alternatives. No generated build, browser profile, cache or dependency tree is committed.

The bounded proof reproduces its 24108-byte minimal stress-page gzip saving after fixing its hard-coded checkout path. Its verifier checks 1098 complete-page budgets. The other 1096 pages retain byte-identical HTML and JavaScript. This is a payload result for a rejected representation, not an achieved production reduction.

The archived production-compiled server protocol uses fresh locals, five warmup pairs and thirty measured pairs in each of two independent processes. Separate streaming runs use three warmup pairs and fifteen measured pairs per process. Chrome uses warm assets, fresh visible documents, three warmup pairs and twenty measured pairs. First launch caps selection at twenty matched hosts. The verifier confirms 300 server batch pairs, 150 streaming pairs and 100 browser pairs. Summary regeneration reproduces the original medians and paired intervals.

On the stress scene, the reference/proof server medians are 32.277 / 39.896 ms, a 7.619 ms increase with a 95% paired-bootstrap interval of 7.097 to 8.081 ms. Chrome readiness medians are 120.75 / 137.20 ms, an increase of 16.45 ms with an interval of 13.15 to 17.25 ms. The smaller scenes save no bytes and still add server work. The first-launch stress interval, about -11.00 to +16.15 ms, supports no reliable improvement. The [runtime report](2026-11-02-recipe-delivery-runtime.md) retains every case and limitation.

The bounded HTML-deduplication representation is rejected for production. A later JavaScript reduction must also review paired server render, first complete SVG, browser readiness and first launch. No hardware-dependent millisecond threshold enters routine validation. The archived timing samples describe one M1 Pro and one Chrome campaign. #108 reran the payload proof and verified those samples; it did not rerun or mix timing campaigns.

## Verification and remaining decisions

- `rtk pnpm install --frozen-lockfile` installs the locked workspace. An initial offline attempt lacked a cached tarball; the online locked installation completed.
- `rtk pnpm check` reports zero errors, warnings or hints for package/consumer Astro types and passes shared TypeScript checks.
- `rtk proxy node scripts/measure-page-loading.mjs` builds both consumers and reproduces all 549 compositions per consumer with unchanged JS/page raw/gzip and file counts.
- `rtk proxy node scripts/check-loading-budgets.mjs` passes the ceilings and structural checks. The saved report passes the same command with its path argument. The separate `--proposed` invocation intentionally fails because no production reduction has occurred.
- Four new failing tests preceded implementation at the existing `measureLoading` interface. They cover added JavaScript, Motion on CSS-only pages, dynamic recovery included eventually, and changed warm-navigation URLs. Existing unused-import, source-hash, drawing, CSS and registration tests remain active.
- `rtk proxy node experiments/recipe-delivery-v2/verify.mjs` verifies 1098 page budgets and 1096 byte-identical non-reference pages after a fresh proof build. Six existing delivery/statistics tests pass. A strict DOM TypeScript invocation passes for all three recovery entries, their loader and the bounded delivery module.
- `rtk proxy node experiments/recipe-delivery-runtime/verify.mjs` and `summary.mjs` verify and recompute the archived paired measurements. No new timing campaign runs.
- `rtk proxy node benchmarks/trace-requests.mjs` records the seven minimal pages, 906 existing template checks and the real ClientRouter transition. All documents are visible and reduced motion is disabled for this request trace.
- `rtk pnpm validate` passes 112 Node tests, 470 drawings, 944 bundle cases and 120 CSS recipes across 132 compositions in 172.651 seconds. Validation remains browser-free. `rtk git diff --check` passes.

The technical baseline and proposed budgets are available for #109 and #112. #110 still owns architecture approval and target ratification. No issue closure, merge, push, npm publication or deployment is performed. A future package rename requires a naming-only control before runtime comparisons. Packed/registry consumers, Safari, Firefox, native input, operating-system motion preferences and owner visual acceptance are outside this task's evidence.
