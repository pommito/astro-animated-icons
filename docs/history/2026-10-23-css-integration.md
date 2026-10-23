# CSS migration integration, 2026-10-23

The owner requested that the #84 continuation join existing draft PR #93. The final review base is main at `0f7e7574bf843d0d5824110e033180429f36d8d6`. The former snapshot base, `review/css-validation-base` at `e4fa797a5b11ad06e1609469f75088b4ad00f063`, already contained #84 and #85 and hid those implementations from the PR diff. Review and integration now cover #84, #85 and #86 together. PR #90 remains a separate documentation change; #91 remains separate chunking work.

The integration preserves the original chevron commit `28dd4ef839954136095d403f880f9bfc4d01b25d`, capability commit `e4fa797a5b11ad06e1609469f75088b4ad00f063`, validation commit `e6197ce1d9c59dce08616445d93ccdfc77a9b4e9`, and comparison-control commit `4986004d3da563760d1d69144bb726e25917df0b`. It also retains main's promotion template correction and Folder from PR #92. The pilot patch was not reapplied. Other chats' worktrees and handoff files were not changed.

## Integration changes

The public changes against main migrate 12 finite chevrons and seven capability-stage icons. ChevronRight and Bell were already on CSS. Each icon keeps one recipe definition, its drawing and public interface. Four paired chevron springs and LoaderCircle retain Motion. The chevron icon sources match the accepted original commit exactly. The comparison pages, styling and controls match `4986004` exactly.

Folder added a 22nd CSS recipe on main after the original integrated validation. The existing catalogue check first rejected the old 21-recipe manifest. The integration now generates 22 recipes across 32 compositions, including 66 repeated instances. It reuses Folder's existing Motion reference and `/folder-css/` comparison. Folder's intentional 200 ms CSS return remains the owner-approved change from PR #92; it is not claimed to reproduce the previous spring return.

The Standards review found repeated resource measurements and repeated synthetic lifecycle probes. `scripts/measure-resources.mjs` now supplies the shared measurement logic, including optional complete-page totals. The pilot re-exports its existing `measureRoute` entry for Folder. `synthetic-lifecycle.ts` supplies the same 14 probes to all three migration comparators, with recipe-specific track counts. These corrections change fixture and measurement code only. No public runtime, drawing, export or dependency changed during review.

## Validation

Commands executed in the isolated `css-chevrons-review` worktree include:

```sh
rtk pnpm install --frozen-lockfile --offline
rtk pnpm check
rtk pnpm fixture:prepare
rtk proxy node --test scripts/cycle-css.test.mjs scripts/inventory-animations.test.mjs
rtk proxy node --test scripts/check-css-chevrons.test.mjs
rtk proxy node scripts/css-migration-catalogue.mjs
rtk proxy node scripts/css-migration-catalogue.mjs --write
rtk pnpm validate
rtk proxy env MIGRATION_RESULT=.artifacts/css-integration-payloads-final.json node scripts/measure-css-migration.mjs
rtk proxy env ICON_TEST_PORT=45336 pnpm fixture:serve
rtk git diff --cached --check
```

Node 22.20.0 and pnpm 12.5.1 used the frozen dependencies. The final `pnpm validate` passed in 139.914 seconds with zero type diagnostics, 470 production drawings, 944 catalogue bundle cases, seven pilot routes, 16 chevron routes, 15 capability routes, 22 CSS recipes across 32 integrated compositions, and all 50 Node tests. Validation launched no browser. The [validation excerpt](2026-10-23-css-integration-validation.txt) records the output. An earlier run stopped at the fixture lock because the preview was running; the successful final run used no preview server.

Resource reports were compared with `assert.deepEqual` before and after the measurement extraction, then again after the fixture rebuild. All 32 baseline/managed reports were identical, including JavaScript, CSS, HTML, complete-page totals and resource URLs. Negative validator tests continue to reject axis and timing drift, omitted catalogue entries, missing markers, duplicate or unused styles, missing drawings and incorrect chunk unions.

## Separate browser checks

After the final build, the existing comparison controls ran in in-app Chromium 155 at 14, 16, 24 and 28 px. Chevron comparisons passed 4836 assertions and 3276 poses with zero matrix error. Capability comparisons passed 4452 assertions and 2108 poses, with maximum matrix error 0.00078 against 0.005 and zero opacity error against 0.001. The pilot passed 592 assertions and 496 poses; maximum Bell angle error was 0.0139844 degrees against 0.03. All 294 synthetic lifecycle probes passed after their extraction. The three pages reported no console errors. The [browser record](2026-10-23-css-integration-browser.json) keeps these results separate from automation.

These checks cover entry, return, interruption, replay, completion, stale callbacks, disconnect and reconnection. Pointer events and preference changes use synthetic events and matchMedia stubs. The original stages' independent-template checks and native matchMedia checks with DevTools emulation remain dated evidence; they were not repeated here. Safari, Firefox, real touch/hybrid hardware, native operating-system preference changes, frame pacing and preparation timing remain unverified.

## Current payloads

The [current payload record](2026-10-23-css-integration-payloads.json) measures all 32 compositions on the final production fixture. Earlier 21-recipe reports remain unchanged as historical evidence. Each reachable JavaScript chunk and external CSS resource counts once per route. Node zlib defaults gzip each resource. Normalized JavaScript plus CSS totals compress inline styles separately. Complete-page totals compress HTML once with its inline content, then add external resources. Headers, latency, Brotli and warm caches are excluded. Full-fixture chunk splitting affects these values; payload savings do not establish smoother animation.

| Composition | Motion JS+CSS raw / gzip bytes | CSS JS+CSS raw / gzip bytes | Normalized gzip bytes saved | Complete-page gzip bytes saved |
| --- | ---: | ---: | ---: | ---: |
| chevron-down | 11261 / 5308 | 5031 / 2497 | 2811 | 2858 |
| chevrons | 17353 / 9856 | 19634 / 9876 | -20 | 2867 |
| folders | 74230 / 32118 | 9765 / 4966 | 27152 | 28084 |
| opacity | 72074 / 30561 | 19160 / 4477 | 26084 | 26298 |
| all | 83739 / 39199 | 44260 / 17257 | 21942 | 26709 |
| repeated | 83739 / 39199 | 44260 / 17257 | 21942 | 26511 |
| mixed-loader | 84129 / 39476 | 114255 / 46632 | -7156 | -2390 |
| mixed-arrow | 84702 / 39823 | 53962 / 21743 | 18080 | 22840 |
| unused | 124 / 116 | 124 / 116 | 0 | 0 |

Negative savings mean the CSS composition costs more. Per-icon savings cannot be added across a page.

## Review and acceptance

Two independent agents reviewed the complete diff against main, first at immutable tree `bfac783ffe26ecc783d2871612d34c72f0cd0df9`, then the corrections at `a6b672d739c84ac01d53471e96fb51c5b6f72f1e`. The immutable trees let review precede the working-branch commit.

### Standards

Both duplication findings were corrected. The follow-up review found no remaining documented-rule breaches or supported code smells. The reviewer inspected source diffs and did not rerun browser checks or full validation.

### Spec

The review found no missing, incorrect or out-of-scope requirement for #84, #85 or #86. It confirmed preserved playback policies, retained Motion recipes and complete validation coverage. The follow-up confirmed that shared proof helpers preserve measurement conventions and all 14 synthetic outcomes. The reviewer did not rerun browser checks or full validation.

Both axes have zero remaining findings. The owner had already accepted all 21 migration recipes in the documentation stage at [a15da807](https://github.com/pommito/astro-animated-icons/blob/a15da807152638b99161abfcca73a92d484b78b7/docs/history/2026-10-23-css-chevron-acceptance.md), with [capability acceptance](https://github.com/pommito/astro-animated-icons/blob/a15da807152638b99161abfcca73a92d484b78b7/docs/history/2026-10-23-css-capability-acceptance.md). Folder has separate acceptance in [PR #92](https://github.com/pommito/astro-animated-icons/pull/92). This continuation adds no visual approval, merge or issue closure.
