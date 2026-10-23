# CSS documentation integration, 2026-10-23

Documentation PR #90 integrates main at `da69ce67e40579620b728c165aa6caafd96f6c8d`, after the owner-approved merge of PR #93. Its previous review base was the fixed `docs/css-migration-base` snapshot at `e6197ce1d9c59dce08616445d93ccdfc77a9b4e9`. Main is now the review and eventual merge destination. PR #90 remains a draft; this continuation merges no pull request and closes no issue.

The integration preserves the existing documentation and acceptance records from `a15da807152638b99161abfcca73a92d484b78b7`. It retains main's current runtime, shared validation contract, comparison controls, and Folder implementation. Only Markdown documentation differs from main. The original pilot patch was not reapplied, and the separate chunking work in #91 was not imported. Other worktrees and stage coordination files were not changed.

Architecture now includes Folder's path rotation, current-pose replay and intentional 200 ms return alongside the finite transform and opacity mechanisms. Validation documents the shared route contract, current comparison controls and separate Folder reference. The migration plan points to the current integration evidence and preserves earlier measurements as dated history.

## Inventory and acceptance

The regenerated inventory covers 470 exports, with 22 migrated recipes, one supported but deferred recipe, five needing another capability, 18 retained on Motion and 424 needing source review. The manifest check confirms 22 CSS recipes across 32 compositions, including 66 repeated instances. Inventory output does not grant visual approval; its generic pending-acceptance message remains separate from the owner records.

The [promotion record](2026-10-23-css-promotion.md) covers Bell and ChevronRight. The [chevron record](2026-10-23-css-chevron-acceptance.md) covers the other 12 finite chevrons, and the [capability record](2026-10-23-css-capability-acceptance.md) covers seven icons. These are the original 21 CSS migrations. Folder has separate owner acceptance in [PR #92](https://github.com/pommito/astro-animated-icons/pull/92), including its changed return. The original [documentation report](2026-10-23-css-documentation.md) describes checks before those later approvals. Its historical counts and measurements remain unchanged.

## Executed checks

Commands ran in the isolated `docs-engines-integration` worktree with Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1 and TypeScript 6.0.3 on Darwin arm64 with an Apple M1 Pro. Relevant commands were:

```sh
rtk proxy pnpm install --frozen-lockfile --offline
rtk proxy mkdir -p .artifacts
rtk proxy pnpm inventory:animations --summary --output .artifacts/animation-inventory.json
rtk proxy node scripts/css-migration-catalogue.mjs
rtk proxy sh -c 'pnpm validate > .artifacts/docs-integration-validation.log 2>&1'
rtk proxy pnpm fixture:prepare
rtk proxy sh -c 'MIGRATION_RESULT=.artifacts/css-migration-payloads.json node scripts/measure-css-migration.mjs > .artifacts/docs-integration-payloads.log'
rtk proxy node /tmp/compare-pr90-payloads.mjs .artifacts/css-migration-payloads.json docs/history/2026-10-23-css-integration-payloads.json
rtk proxy python3 /tmp/audit-pr90-links.py /Users/victor/.codex/worktrees/docs-engines-integration/astro-animated-icons
rtk proxy git diff --cached --check
```

The frozen offline installation passed without manifest or lockfile changes. Manifest verification passed without rewriting the fixture. Full browser-free validation passed in 767.725 seconds. Both Astro checks reported zero errors, warnings and hints. Relevant output was:

```text
Verified 470 icons across 944 bundle cases.
Verified 22 migrated recipes across 32 integrated compositions, including unused barrel imports and repeated mixed families.
Verified 470 production drawings and native controls; 470 public exports have recorded drawing baselines.
# tests 52
# pass 52
# fail 0
Validation: 767.725 seconds
```

The seven pilot routes, 16 chevron routes and 15 capability routes also passed. The Node tests include deliberately broken production output, stylesheet markers, selected recipes, drawings and chunk unions. These checks establish the production-output contract and validator behavior; they do not execute browser playback.

`pnpm fixture:prepare` reused the validated build because its sources and output matched. The documented payload command reproduced all 32 compositions. A temporary Node script used `assert.deepEqual` on both `modes` and `savings` against [the current committed JSON](2026-10-23-css-integration-payloads.json). Every resource URL and raw/gzip field matched. For all 22 icons, normalized JavaScript plus CSS saves 21942 gzip bytes and complete-page compression saves 26709. Adding LoaderCircle costs 7156 normalized gzip bytes and 2390 complete-page gzip bytes.

Measurements count each reachable JavaScript chunk and external CSS resource once per route, with Node zlib defaults and a cold cache. Normalized totals gzip inline styles separately. Complete-page totals compress HTML once with its inline content, then add external resources. Headers, latency, Brotli and warm caches are excluded. Full-fixture chunk splitting affects the result.

A temporary Python script checked all 70 local Markdown targets and anchors across the ten documentation files in the final diff. Commands, routes, ports and comparison labels were checked against their source scripts and fixtures. `git diff --cached --check` passed. English prose was reviewed with the unslop rules.

## Review

Two independent agents reviewed the immutable snapshot `af16779989ecc82f81a65a9e1f224ba8b94581d7` against main at `da69ce6` before the branch commit. Only this report's executed-check details were completed afterward. Both reviewers then checked the completed report against the validation log and resource JSON. Neither follow-up found a new issue.

### Standards

The reviewer found no documented-standard violation or relevant Fowler smell. Source inspection covered the adapters, generators, recipe data, validation and measurement scripts, and comparison controls. The reviewer did not rerun full validation or browser probes.

### Spec

The reviewer found no missing, incorrect or out-of-scope requirement for #87. The documentation preserves the consumer contract, current integration and distinct approval scopes. The reviewer did not rerun full validation or browser probes. Both axes have zero findings.

## Limits

This documentation continuation ran no browser checks and claims no new visual approval. It links the [integration browser evidence](2026-10-23-css-integration.md#separate-browser-checks) from `07d2162`. Earlier independent-template checks and native matchMedia checks with DevTools media emulation remain dated evidence. Safari, Firefox, real touch/hybrid hardware, native operating-system preference changes, frame pacing and preparation timing remain unverified. Smaller payloads do not establish smoother animation.
