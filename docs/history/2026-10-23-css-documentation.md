# CSS migration documentation verification

Documentation for [issue #87](https://github.com/pommito/astro-animated-icons/issues/87) integrates final validation commit `e6197ce1d9c59dce08616445d93ccdfc77a9b4e9`. The branch preserves the promotion, inventory, chevron, capability, and independent-template work through their existing commit history.

README explains unchanged imports, props, handles, complete initial SVG, selective loading, and internal engines. Architecture describes finite transforms, timed opacity, track policies, and stylesheet recovery. CONTRIBUTING describes recipe selection and source review. Validation gives the manifest, browser comparison, thresholds, and measurement procedures. The [migration plan](../css-migration-plan.md) records family decisions and links dated evidence. Detailed catalogue rows remain generated output.

## Executed checks

Commands ran in the isolated documentation worktree with Node 22.20.0 and pnpm 12.5.1. These were the relevant commands:

```sh
rtk proxy pnpm install --frozen-lockfile --offline
rtk proxy pnpm inventory:animations --summary --output .artifacts/animation-inventory.json
rtk proxy node scripts/css-migration-catalogue.mjs
rtk proxy sh -c 'pnpm validate > .artifacts/docs-validation.log 2>&1'
rtk proxy sh -c 'MIGRATION_RESULT=.artifacts/css-migration-payloads.json node scripts/measure-css-migration.mjs > .artifacts/docs-payload-command.log'
rtk proxy git diff --check
```

The first inventory attempt failed because `.artifacts` did not exist in the fresh worktree. The instructions now create that directory before requesting output. The repeated command passed. The generated inventory agrees with the plan: 21 migrated, one supported but deferred, five needing another capability, 18 retained on Motion, and 359 needing review, covering 404 exports.

The manifest verification passed without rewriting its fixture data. Full browser-free validation passed in 101.876 seconds. Its relevant output was:

```text
Verified 404 icons across 811 bundle cases.
Verified 21 migrated recipes across 31 integrated compositions, including unused barrel imports and repeated mixed families.
Verified 404 production drawings and native controls; 404 public exports have recorded drawing baselines.
# pass 49
# fail 0
Validation: 101.876 seconds
```

The payload command reproduced all 31 compositions exactly, including both resource totals and savings from [the final integrated payload JSON](2026-10-23-css-migration-payloads.json). The plan distinguishes normalized JavaScript plus CSS from actual HTML compressed with its inline content. It retains the LoaderCircle regressions and identifies the older pilot numbers as historical.

All 54 local Markdown targets and anchors resolved across README, CONTRIBUTING, architecture, validation, the migration plan, and inventory documentation. Commands and browser control labels were checked against their scripts and fixture sources. The English prose was reviewed with the unslop rules. No public component, runtime, drawing, dependency, or validation script changed in the documentation work.

## Limits and acceptance

This documentation stage ran no browser comparison or visual review. It links the separate [integrated browser evidence](2026-10-23-css-migration.md#browser-evidence). The promotion record grants owner visual acceptance to Bell and ChevronRight only. The 19 later migrations still await owner review. Safari, Firefox, physical touch/hybrid input, operating-system reduced-motion changes, frame pacing, and preparation timing remain outside this stage's verification. Browser DevTools media emulation in the validation stage is documented separately from system preference changes.

The worktree remains available for review and integration. This stage merged no pull request and closed no issue.
