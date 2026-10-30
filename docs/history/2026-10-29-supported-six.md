# Six supported finite cycles

[Issue #99](https://github.com/pommito/astro-animated-icons/issues/99), coordinated by [#81](https://github.com/pommito/astro-animated-icons/issues/81), migrates the complete supported set at main `3479eaab02559358a6070f62e16a51dc2d1188b7`. The set is Disc3, PanelLeftClose, PanelLeftOpen, PanelRightOpen, BriefcaseBusiness and TreePine. This batch adds no capability for the other 196 candidates and changes none of the 242 justified Motion retentions.

The fresh managed worktree uses branch `feat/six-supported-css-icons`. The strict pre-batch inventory reported 26 migrated recipes, six supported but deferred and zero unresolved reviews across 470 exports and 38 families. The post-batch inventory reports 32 migrated, zero supported but deferred, 196 capability candidates, 242 Motion retentions and zero unresolved reviews. Family membership remains complete and unique.

## Source and implementation

The [saved source](2026-10-29-supported-six-source-before.json) preserves all six original definitions and adapters before extraction. Review followed group-transform, SVG-parts, SVG-transform and their actual timing and playback branches through the shared lifecycle. The [5848 saved Motion poses](2026-10-29-supported-six-motion-before.json) were captured in production before any engine change or recipe extraction, at 14, 16, 24 and 28 px. They cover entry, stop and replay at 31, 83 and 199 ms and the final two entry times, repeated stop, replay during return, held entry and stop after hold. Timelines were paused and sought through the public manual API. This is local Motion execution, without upstream React execution.

Disc3 keeps positive 90-degree rotation and 400 ms easeInOut entry/return. PanelLeftClose and PanelRightOpen keep X values [current, -1.5, 0] px; PanelLeftOpen keeps [current, 1.5, 0] px. Their offsets remain [0, .4, 1] with 500 ms easeOut entry/return. The effective target is [data-motion="0"], including the paths used by the panel drawings. Their original drawing origins remain unchanged.

BriefcaseBusiness keeps SVG rotation [0, 4, -3, 2, 0] degrees, quarter offsets, 900 ms easeInOut entry, 300 ms easeOut return and fixed 12px 4px origin. TreePine keeps SVG rotation [0, -10, 10, -10, 0] degrees with quarter offsets and 500 ms easeInOut entry/return. Their normal poses explicitly declare duration, so no implicit spring return executes. Both finish at zero and hold, so completed and active replay fit the existing current-pose finite cycle.

Each production recipe has one cycle.ts definition, a shared Drawing.astro and the existing CssIcon.astro wrapper, transform adapter, registration entry, serialized data and stylesheet recovery. Public exports, tags, handle types, props and void playback methods stay unchanged. The wrapper now declares its already forwarded internal svgStyle prop to preserve BriefcaseBusiness's initial SVG origin. This declaration changes no runtime mechanism. Its source-review hash change was inspected for all 30 CSS transform recipes; only the wrapper dependency changed outside the batch. The six cycle formatting changes were separately checked before their hashes were renewed. The 196 capability and 242 Motion records retain their original values and hashes.

Fixture-only references use the preceding group and SVG-parts helpers with the same cycles and drawings. A shared finite comparison controller serves this batch and the existing combined-transform page. Saved pre-extraction matrices independently check source extraction, so a wrong shared value cannot pass through reference agreement alone. Numerical tolerances remain matrix components 0.005, translation 0.005 and opacity 0.001.

## Browser evidence

The [browser result](2026-10-29-supported-six-browser.json) records Chrome 154 on macOS. The complete batch passes 19736 assertions across 5168 paired snapshots and 5848 saved Motion snapshots. Maximum paired matrix error is 0.0005850000000000577. Maximum saved-pose error is 0.0005920000000000369, below 0.005. The checks cover entry, interrupted entry/replay/return, repeated stop, replay during return, completed entry/return, stop after hold, stale callbacks, disconnection and reconnection. Every origin comparison passes.

The six synthetic lifecycle reports contain 84 passing checks. They use synthetic pointer events and a matchMedia stub for touch filtering, containing controls, disabled and controlled modes, listener replacement, cloning and preference cleanup. Independent-template checks cover clones before/after registration, stylesheet recovery and late-sheet reconciliation. The shared source-removed template route covers all six plus six existing controls and includes a synthetic astro:page-load event for nested templates. This event is not a real Astro navigation.

The native reduced-motion probe uses browser media emulation and real matchMedia change events. All 32 CSS recipes clear animations, state, captured variables and temporary origins, remain static under reduction, and resume after no-preference is restored. Operating-system preference changes are unverified.

Native mouse hover and leave were exercised on all six containing links through Chrome input. Every hover reaches held entry state, including Disc3's positive 90-degree matrix and the other five recipes' identity endpoint. Every leave completes return and clears animation state. These native inputs are separate from the paused manual-API probes and synthetic lifecycle events.

The occupied dedicated automation Chrome profile was relaunched before capture. The in-app browser attempt produced no accepted capture and contributes no animation evidence. Safari, Firefox, real touch/hybrid hardware and frame pacing remain unverified. Payload and numerical parity establish no smoother-frame claim.

## Production payloads

The [before](2026-10-29-supported-six-loading-before.json) and [after](2026-10-29-supported-six-loading-after.json) records measure fresh production builds of both the full fixture and a minimal consumer. They include complete reachable JavaScript, CSS, HTML and page raw/gzip bytes and JavaScript file counts for each icon, the six-icon family, 20 repetitions, CSS mixtures, LoaderCircle mixtures and CSS-plus-LoaderCircle mixtures. The 35 batch routes per consumer keep identical membership before/after. The broader all and repeated-all routes grow from 26 to 32 recipes, so they are not used as fixed-membership savings comparisons. Historical legacy-21 and legacy-23 controls keep their membership.

Negative page changes mean fewer bytes. All numbers below are bytes.

| Consumer | Route | JS files before / after | Page gzip before / after | Change |
| --- | --- | ---: | ---: | ---: |
| full | disc-3 | 11 / 4 | 12197 / 3742 | -8455 |
| full | panel-left-close | 11 / 4 | 12226 / 3758 | -8468 |
| full | panel-left-open | 11 / 4 | 12218 / 3754 | -8464 |
| full | panel-right-open | 11 / 4 | 12227 / 3756 | -8471 |
| full | briefcase-business | 15 / 4 | 30592 / 3830 | -26762 |
| full | tree-pine | 15 / 4 | 30518 / 3766 | -26752 |
| full | supported-six | 21 / 4 | 32209 / 4577 | -27632 |
| full | supported-six-repeated | 21 / 4 | 32791 / 5763 | -27028 |
| full | supported-six-css | 26 / 6 | 37309 / 7111 | -30198 |
| full | supported-six-loader | 22 / 18 | 32549 / 34024 | 1475 |
| full | supported-six-css-loader | 27 / 20 | 37652 / 36555 | -1097 |
| full | cog | 4 / 4 | 3834 / 3834 | 0 |
| minimal | disc-3 | 9 / 3 | 11875 / 3681 | -8194 |
| minimal | panel-left-close | 9 / 3 | 11901 / 3697 | -8204 |
| minimal | panel-left-open | 9 / 3 | 11897 / 3693 | -8204 |
| minimal | panel-right-open | 9 / 3 | 11902 / 3695 | -8207 |
| minimal | briefcase-business | 11 / 3 | 27674 / 3769 | -23905 |
| minimal | tree-pine | 11 / 3 | 27601 / 3704 | -23897 |
| minimal | supported-six | 17 / 3 | 29295 / 4516 | -24779 |
| minimal | supported-six-repeated | 17 / 3 | 29876 / 5702 | -24174 |
| minimal | supported-six-css | 20 / 4 | 34270 / 6988 | -27282 |
| minimal | supported-six-loader | 18 / 13 | 29636 / 31040 | 1404 |
| minimal | supported-six-css-loader | 21 / 14 | 34611 / 33510 | -1101 |
| minimal | cog | 3 / 3 | 3772 / 3772 | 0 |

The full family saves 27632/24779 page gzip bytes in full/minimal consumers. The family with LoaderCircle adds 1475/1404 page gzip bytes, although its JavaScript file count falls. Adding the existing Bell, CircleDashed and UserRoundCog CSS mixture changes that result to savings of 1097/1101 bytes. The unchanged cog page has zero page gzip change. Individual savings cannot be added to predict a family page.

Both builds use Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, TypeScript 6.0.3 and an Apple M1 Pro on arm64 macOS 27.0.1, build 26A434. Reachable shared resources count once per URL. Gzip uses Node zlib defaults per external resource. Normalized total compresses inline CSS independently and excludes HTML; page compresses each actual HTML document with inline data once and adds external JavaScript/CSS. Encoded recipe data is already included in HTML. Cold results assume no cached resources. Warm transitions model same-build external URL reuse with a fresh second HTML fetch; this is a cache model, not observed browser traffic. Headers, latency, Brotli, eviction, cache revalidation, cross-build reuse, frame pacing and preparation timing are excluded. The minimal consumer uses installed workspace links, without a reference implementation or a packed-package installation.

The #95 historical tradeoffs remain separate. Its combined family added 2267/2529 page gzip bytes, LoaderCircle mixtures added 12990/12931, and cog controls added 845/846 in full/minimal consumers. This batch does not revise those dated measurements.

## Validation and review

TDD first rejected missing measurement compositions, each missing finite cycle, missing comparison-family coverage and stale six-icon decisions. Each vertical slice passed after its implementation. Focused cycle/compiler, catalogue, loading and inventory tests pass all 39 checks. Astro package and fixture checks report zero errors, warnings or hints after the svgStyle type correction. Routine checks launch no browser and add no browser dependency.

Executed commands use the required rtk prefix. The focused per-icon red/green runs used node --test --test-name-pattern before and after each extraction.

```sh
rtk pnpm install --frozen-lockfile
rtk proxy node scripts/inventory-animations.mjs --check --summary --output .artifacts/animation-inventory.json
rtk proxy node --test scripts/cycle-css.test.mjs scripts/css-migration-catalogue.test.mjs scripts/measure-page-loading.test.mjs scripts/inventory-animations.test.mjs
rtk pnpm check
rtk proxy node scripts/css-migration-catalogue.mjs --write
rtk proxy node scripts/measure-page-loading.mjs
rtk pnpm fixture:prepare
rtk pnpm validate
rtk proxy env ICON_TEST_PORT=45352 pnpm fixture:serve
```

### Final validation

The first complete validation passed 89 Node tests in 109.025 seconds at the implementation stage. After independent review corrections, the final `rtk pnpm validate` passed all 90 tests in 151.158 seconds. It rebuilt the production fixture, verified 470 drawings and native controls, 944 bundle cases and 32 migrated recipes across 43 integrated compositions. Astro package and fixture checks reported zero errors, warnings or hints. The build retained existing upstream reference warnings about use client directives. No production recipe changed after its recorded browser and payload checks. All 35 fixed-membership full-consumer routes were compared again with the recorded after payloads and had no JavaScript/CSS/HTML/page or file-count drift. The minimal consumer has no comparison-page imports and remains unchanged by the fixture-only review fixes. All 76 local documentation links resolve.

### Standards

Independent review of `3479eaa...4656b1e` found two actionable issues. The deferred-compatible Motion proof test had become a migrated-CSS test and no longer exercised schema 2's proof-only dependency branch. The correction reconstructs the preceding Disc3 recipe only inside a temporary copy, establishes supported-but-deferred, then changes its proven CSS dependency and requires needs-review while the engine remains Motion. All 13 inventory tests pass.

The new independent-template page also copied the existing combined-transform page. Both now use IndependentTemplatesPage.astro with their catalogue, preserving inline clones before registration and the processed check script. The targeted Standards re-review found zero remaining issues.

### Spec

Independent Spec review found zero actionable issues. Its targeted re-review confirmed that the added Motion case stays inside the test copy and that the template extraction changes no production recipe or capability. The two template routes are checked again after the final rebuild. Owner visual acceptance remains separate.

## Owner acceptance

The complete migrated set awaits owner visual acceptance at /supported-six/. Neither the targeted pre-merge Motion inspection for PR #101 nor earlier approvals of UserRoundCog, KeySquare, Wallet and KeyCircle approve these CSS migrations. Leave the animation PR in draft, merge pending and #99 open until the owner accepts all six. #81 continues to coordinate the remaining specified capabilities and concrete Motion retentions.

## Subsequent owner acceptance

The owner visually accepted the complete six-icon migrated set on 2026-10-30 at `30b07aac9d24a056d57df17fabd69a8abd5c46ea` on /supported-six/. The [acceptance record](2026-10-30-supported-six-acceptance.md) supplies the decision after this report's pre-acceptance checks. Existing numerical and payload evidence remains unchanged.
