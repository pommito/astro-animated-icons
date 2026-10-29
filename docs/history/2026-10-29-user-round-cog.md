# UserRoundCog CSS migration evidence

Recorded on 2026-10-29 for [issue #94](https://github.com/pommito/astro-animated-icons/issues/94). Owner visual acceptance is pending. Issue #95 is outside this change.

## Preserved behavior

The baseline is main at `3efe4f237e83ff8fb8abc9c264f82905785b4d0a`, after #91 and PR #96. Before editing the production recipe, Chromium 156 captured 324 matrices from the public Motion icon at 14, 16, 24, and 28 px. The [capture](2026-10-29-user-round-cog-motion-before.json) records the baseline commit, sample times, matrices, and computed origin. Entry samples include 0, 31, 83, 125, 150, 199, 250, 299, and 300 ms. Stop and replay interrupt at 31, 83, 199, 299, and 300 ms. Repeated stop and replay during return interrupt the return at 83 ms.

The original definition used `{ rotate: 180 }`, `{ duration: 0.3, ease: "easeOut" }`, `finish: "hold"`, and `[data-cog]`. The scalar Motion helper replays and returns from its retained current pose. Rest is zero and return timing inherits the same 300 ms easeOut settings. The drawing retains `transform-box: fill-box; transform-origin: 50% 50%`. Its half-turn matrix is `[-1, 0, 0, -1, 0, 0]`. Positive intermediate sine components distinguish the direction before the half-turn.

Production and the fixture-only Motion reference now consume one `cycle.ts` definition and one unchanged `Drawing.astro`. The reference uses the preceding local scalar `animateSvgTransform` path. It does not execute the upstream React component. The existing attribution still pins Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

The public component, handle, tag, initial SVG, finish and replay policies stay unchanged. Registration belongs to `CssIcon.astro`; UserRoundCog adds no processed registration script. The single-property cycle type now permits its semantic `[data-cog]` selector. No combined-transform capability or lifecycle mechanism changed.

## Payload conditions

Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, TypeScript 6.0.3, Darwin 27.0.0, arm64, Apple M1 Pro. Both measurements use the locked dependencies and production builds. The full fixture includes all comparison and catalogue routes. The minimal consumer contains only measurement routes and uses the public barrel through installed package links. It does not test a packed package.

The fresh baseline adds only measurement cases and their public imports to the post-#91 source. Run `node scripts/measure-page-loading.mjs` before and after the recipe change. The named cog cases are identical on both sides. The dynamic `all` cases grow from 22 to 23 CSS recipes and therefore must not be treated as equal-composition migration measurements. The older [loading baseline](2026-10-27-page-loading-baseline.md) and [selective-loading report](2026-10-27-selective-loading.md) remain unchanged.

Cold totals count each reachable external URL once. JavaScript file counts describe reachable build resources rather than observed requests. Gzip uses Node zlib defaults per resource. CSS totals include generated inline sheets compressed separately. Whole-page totals compress HTML, including inline CSS and serialized recipe attributes, once, then add external JavaScript and CSS. Do not add the separately reported `recipeData` size to the page. Headers, latency, Brotli, frame pacing, preparation timing, and HTTP cache policy are excluded.

### Cold payloads

Each size cell is raw / gzip bytes. The CSS mixtures contain Bell and CircleDashed. Repeated means 20 UserRoundCog instances.

| Consumer and composition | JS files before / after | JS before | JS after | CSS before | CSS after | Page before | Page after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| full, cog | 10 / 4 | 25706 / 11557 | 4225 / 2011 | 124 / 116 | 871 / 396 | 26901 / 12192 | 6589 / 2989 |
| full, cog-repeated | 10 / 4 | 25706 / 11557 | 4225 / 2011 | 124 / 116 | 871 / 396 | 42557 / 12317 | 29313 / 3175 |
| full, cog-css | 15 / 6 | 31684 / 14408 | 7426 / 3507 | 7595 / 881 | 8342 / 1161 | 44424 / 16171 | 21233 / 5349 |
| full, cog-loader | 16 / 18 | 71795 / 30276 | 74220 / 31386 | 124 / 116 | 871 / 396 | 73507 / 30990 | 77101 / 32440 |
| full, cog-css-loader | 21 / 20 | 77773 / 33127 | 77421 / 32882 | 7595 / 881 | 8342 / 1161 | 91030 / 34960 | 91745 / 34794 |
| minimal, cog | 8 / 3 | 25328 / 11233 | 4184 / 1950 | 124 / 116 | 871 / 396 | 26523 / 11871 | 6548 / 2926 |
| minimal, cog-repeated | 8 / 3 | 25328 / 11233 | 4184 / 1950 | 124 / 116 | 871 / 396 | 42179 / 11996 | 29272 / 3113 |
| minimal, cog-css | 11 / 4 | 31222 / 13960 | 7342 / 3383 | 7595 / 881 | 8342 / 1161 | 43962 / 15726 | 21149 / 5225 |
| minimal, cog-loader | 12 / 13 | 67295 / 27356 | 69679 / 28406 | 124 / 116 | 871 / 396 | 69007 / 28070 | 72560 / 29456 |
| minimal, cog-css-loader | 15 / 14 | 73189 / 30083 | 72837 / 29839 | 7595 / 881 | 8342 / 1161 | 86446 / 31914 | 87161 / 31749 |

Single-icon whole-page gzip savings are 9203 bytes in the full fixture and 8945 bytes in the minimal consumer. With LoaderCircle alone, whole-page gzip grows by 1450 and 1386 bytes respectively because Motion remains reachable and CSS support is added. With Bell, CircleDashed, and LoaderCircle, gzip shrinks by 166 and 165 bytes, while raw page bytes grow by 715. These results do not establish smoother playback.

### Warm navigation model

The second navigation reuses every external URL reached by the first route in the same build. HTML is fetched again. There is no eviction or revalidation. This is a model, not an observed browser cache measurement. Each size is raw / gzip bytes for the second transfer.

| Consumer | Transition | New JS files before / after | Page before | Page after |
| --- | --- | ---: | ---: | ---: |
| full | cog to cog-repeated | 0 / 0 | 16851 / 760 | 25088 / 1164 |
| full | cog to cog-css | 5 / 2 | 18718 / 4614 | 17008 / 3338 |
| full | cog-css to cog-css-loader | 6 / 14 | 59346 / 20552 | 84319 / 31287 |
| full | loader to cog-loader | 1 / 3 | 2064 / 959 | 5658 / 2409 |
| full | cog-css-loader to cog | 0 / 0 | 1195 / 635 | 2364 / 978 |
| minimal | cog to cog-repeated | 0 / 0 | 16851 / 763 | 25088 / 1163 |
| minimal | cog to cog-css | 3 / 1 | 18634 / 4493 | 16965 / 3275 |
| minimal | cog-css to cog-css-loader | 4 / 10 | 55224 / 17954 | 79819 / 28366 |
| minimal | loader to cog-loader | 1 / 2 | 2064 / 958 | 5617 / 2344 |
| minimal | cog-css-loader to cog | 0 / 0 | 1195 / 638 | 2364 / 976 |

Moving from one to 20 instances adds no JavaScript on either side, but repeated recipe attributes increase the second HTML transfer. Moving from the CSS mixture to its LoaderCircle mixture now loads Motion on the second page; the previous UserRoundCog already loaded it on the first page.

Full route, module, and transition data are preserved in [before JSON](2026-10-29-user-round-cog-loading-before.json) and [after JSON](2026-10-29-user-round-cog-loading-after.json).

## Validation and browser evidence

The cycle compiler test failed before the migration with `UserRoundCog uses the shared cycle compiler`, then passed with the positive 180-degree values, exact offsets, current replay, hold completion, and 300 ms easeOut entry and return. The loading test first failed to reject a duplicated stylesheet on the repeated cog route. The added invariant now rejects it and verifies that repeated instances share scripts and sheets.

The inventory was regenerated with `pnpm inventory:animations --summary --output .artifacts/animation-inventory.json`. It covers 470 exports, 23 migrated recipes, five capability candidates, 18 retained Motion recipes, and 424 entries needing source review. The generated comparison manifest covers UserRoundCog as well as existing families and unused imports.

`pnpm validate` passed in 114.841 seconds. Both Astro checks reported zero errors, warnings, or hints. The output included `Verified 470 icons across 944 bundle cases`, `Verified 23 migrated recipes across 33 integrated compositions`, `Verified 470 production drawings`, and `tests 67`, `pass 67`, `fail 0`. This establishes the static drawing, registration-data, stylesheet, loading, catalogue, compiler, and negative-test contracts. Routine validation launched no browser.

The final payload run reproduced JavaScript file counts and JavaScript, CSS, and page raw/gzip totals for all five cog compositions in both consumers. The final `legacy-21` case keeps its original 21 recipes; `all` includes the new recipe.

Chromium 156 in the Codex in-app browser ran the `/css-capabilities/` control on the validated production fixture. It passed 5348 assertions across 2440 live-reference pose comparisons and 324 comparisons with the saved pre-migration Motion capture. There were zero failures. The maximum matrix-component error across the live-reference comparisons was 0.000885. The maximum error against the saved capture was 0.0007956. Both are below the unchanged 0.005 tolerance. Maximum opacity error was zero. The controls check the exact half-turn, positive direction before completion, interrupted entry, stop, repeated stop, replay during return, completed entry and return, queued old completion after replay, stale completion after disconnect, reconnection, and cleanup. The half-turn return uses the full 300 ms duration and easeOut curve.

The synthetic lifecycle control passed 112 flags, including 14 for UserRoundCog. These dispatch synthetic pointer events and stub matchMedia. They cover touch filtering, parent mouse hover, disabled and controlled modes, preference reset, return values, detached parents, reconnection, and template clones. They do not establish real touch or native preference behavior.

The independent-template control passed 91 assertions. The removed-source control passed 33 flags, including UserRoundCog clones before and after registration, playback, return, disconnect, reconnection, and one active recovered sheet. Its nested-template discovery uses a synthetic `astro:page-load` event. No real Astro navigation was measured for this migration. The [browser summary](2026-10-29-user-round-cog-browser.json) keeps these scopes separate.

Reproduce owner review with `ICON_TEST_PORT=45341 pnpm fixture:serve` and open `/css-capabilities/#user-round-cog`. Use the existing per-pair play/stop controls and synchronized row hover. Expand the numerical checks to rerun the browser and synthetic controls. Open `/css-capabilities/templates/` and `/page-loading/templates/` for their template controls. Numerical agreement does not grant visual acceptance.

Independent Standards and Spec reviews checked the staged change against `3efe4f2`. Standards found one English punctuation issue, which was corrected and re-reviewed. Both axes ended with zero actionable findings. The production fixture was rebuilt after that prose correction.

Safari, Firefox, real touch or hybrid hardware, native operating-system preference changes, frame pacing, and preparation timing remain unverified. The synthetic matchMedia checks do not establish native preference coverage. Owner review is required before merge or issue closure.
