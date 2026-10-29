# Full catalogue source review

[Issue #98](https://github.com/pommito/astro-animated-icons/issues/98) reviews the full catalogue after #95 merged at `1bbd0e272043b4c6150828deeb3c0ff8c15f394a`. The baseline inventory had 26 migrated recipes, two capability candidates, 18 Motion retentions and 424 unresolved reviews. The new queue accounts for every one of the same 470 exports exactly once, with 26 migrated, six supported but deferred, 196 capability candidates, 242 Motion retentions and zero unresolved reviews.

## Source evidence

The maintained records are [animation-decisions.json](../../scripts/animation-decisions.json) and [animation-families.json](../../scripts/animation-families.json). Generate the complete family membership and source evidence with the command in [the inventory contract](../animation-inventory.md). Records contain resolved factory arguments, effective SVG-part poses and per-recipe branch notes. These are source-review evidence, outside the production recipe and registration graphs.

The review follows local definitions through their complete runtime TypeScript call paths. It also pins drawings, Astro adapters, the common lifecycle/wrapper/styles, recipe types, dependency lock and proof dependencies for deferred supported recipes. This rechecks the combined compiler, retained scalar poses, matrix bridge and shared registration changes from #95. Static evidence retains source lines and original expressions. Source ambiguity is not counted as support: an absent or changed record becomes `needs-review`, and the strict check fails.

The six additional compatible recipes are Disc3, PanelLeftClose, PanelLeftOpen, PanelRightOpen, BriefcaseBusiness and TreePine. The [migration plan](../css-migration-plan.md#family-decisions) records their complete contracts and the remaining family queue. No icon, drawing, public API, recipe, animation mechanism, comparison fixture or numerical tolerance changes in #98.

The reviewed distinctions include normal-pose spring defaults, pose/property replacement precedence, per-property offsets, fixed transform order, retained scalar values and velocity, active versus completed replay, full return durations, runtime path lengths, repeat boundaries, delayed properties, continued return samplers, drawing branches, queued completion and cleanup. Shared modules can contain unused branches. ArrowLeft does not supply the shared arrow spring callback; Sun takes opacity-only reveal branches; Languages uses a fixed sampled spring rather than inherited velocity. LoaderCircle and other retained springs keep their existing behavior.

## Existing evidence and costs

The [combined-transform browser JSON](2026-10-29-combined-transforms-browser.json) reports 8796 assertions with maximum matrix error 0.000010000000000065512, below the unchanged 0.005 threshold. It predates the separate [owner acceptance](2026-10-29-combined-transform-acceptance.md) at `df1ad33`. The [before](2026-10-29-combined-loading-before.json) and [after](2026-10-29-combined-loading-after.json) loading data preserve both production consumers and measurement conditions.

The family adds 2267/2529 page gzip bytes, LoaderCircle mixtures add 12990/12931, and the unchanged cog control adds 845/846, for full/minimal consumers respectively. Unit pages save gzip bytes. Compatibility and payload cost are separate decisions. These are #95's dated results, not measurements of an unimplemented #99 rollout. Existing architecture approval and owner visual acceptance retain their original scope.

## Validation

The focused inventory test first failed because the complete reviewed family partition was absent. It passed after the maintained contracts and strict coverage check were added. A second focused test first showed that Disc3's deferred support survived changes to its CSS proof dependency. It passed after that proof graph was included in its hash, while its `engine` remained Motion.

Negative cases reject missing reviews, orphan records, empty contracts, unknown families and attempted per-export outcome overrides. Drawing, adapter, lifecycle, dependency lock, family and shared compiler changes invalidate decisions, including CSS icons. Unknown calls and source words still cannot confer eligibility. Repeated inventory generation produces identical data.

Independent review corrected two branch distinctions. ChartScatter belongs to opacity interval easing because its measured length contributes to no track. Connect and Rocket now have a separate direct-morph family because animatePathMorph forwards the complete options object, including springs, repeats and offsets. The three SVG-part morph recipes retain that helper's restricted d options. Focused inventory regressions cover both distinctions. Per-recipe notes now spell out units and spring settings; structured SVG-part records carry the numeric values directly. The final queue has 38 families.

Commands executed use the required `rtk` prefix:

```sh
rtk pnpm install --frozen-lockfile
rtk pnpm check
rtk proxy node --test scripts/inventory-animations.test.mjs
rtk pnpm inventory:animations --check --summary --output .artifacts/animation-inventory.json
rtk pnpm validate
```

`pnpm validate` passed in 131.563 seconds. Astro reported zero errors, warnings or hints. The production checks verified 470 drawings and native controls, 944 bundle cases, 26 migrated recipes across 36 integrated compositions, and all 78 Node tests. The fixture build reported warnings about existing upstream reference files' `use client` directives. No production source or reference changed here.

Routine validation stays browser-free and adds no browser dependency. #98 performs no browser animation, hardware, frame-pacing or new payload checks. The user retains visual acceptance of later migrations. #99 remains separate work, and #81 remains open for rollout and capability follow-ups.
