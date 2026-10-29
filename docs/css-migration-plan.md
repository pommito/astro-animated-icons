# CSS migration plan

The owner approved internal CSS engine selection in [issue #81](https://github.com/pommito/astro-animated-icons/issues/81). Consumers keep the existing imports, tags, props, and playback methods. Generated CSS keyframes use JavaScript playback control and the shared custom-element lifecycle.

This branch has 23 CSS recipes among 470 exported icons. The owner visually accepted UserRoundCog on 2026-10-29 at `7f30ce7` on `/css-capabilities/#user-round-cog` for [PR #97](https://github.com/pommito/astro-animated-icons/pull/97). The [2026-10-29 record](history/2026-10-29-user-round-cog.md) compares it with the post-#91 baseline at `3efe4f2`. The earlier implementation at `da69ce6` had 22 CSS recipes. Its [integration record](history/2026-10-23-css-integration.md) contains evidence and measurements for 32 compositions, including 66 repeated instances. The [documentation integration check](history/2026-10-23-css-documentation-integration.md) records the inventory and command verification from that stage. The original [documentation check](history/2026-10-23-css-documentation.md) and [21-recipe verification](history/2026-10-23-css-migration.md) remain dated history.

The original 21 migrated recipes have owner visual acceptance. Bell and ChevronRight were accepted during promotion. The [chevron acceptance record](history/2026-10-23-css-chevron-acceptance.md) covers the other 12 finite chevrons. The [capability acceptance record](history/2026-10-23-css-capability-acceptance.md) covers seven icons. Folder has separate acceptance in [PR #92](https://github.com/pommito/astro-animated-icons/pull/92), including its intentional 200 ms return. Documentation integration adds no visual approval.

## Family decisions

| Family | Current decision | Mechanism or reason |
| --- | --- | --- |
| Bell | CSS | Finite rotation, current-pose replay, hold completion |
| 13 finite chevrons | CSS | One translation axis, explicit first entry value, restore completion; ChevronFirst keeps independent return timing |
| Four folder translations | CSS | Inner-group translation, restart entry, hold completion |
| Folder | CSS | Path rotation, current-pose replay, hold completion; intentional 200 ms return replaces the previous spring |
| CircleHelp | CSS | Inner-group rotation, current-pose replay, hold completion |
| UserRoundCog | CSS, owner visually accepted | Positive 180-degree cog rotation, 300 ms easeOut entry and return, current-pose replay, hold completion |
| CalendarDays and CircleDashed | CSS | Timed opacity parts with per-target delays, completion, replay, and return policies |
| LoaderCircle and four paired chevron springs | Motion retained | Interrupted returns inherit measured velocity and use springs |
| Archive and other reviewed Motion recipes | Motion retained | Retained Motion values, morphs, spring defaults, unwrapped angles, random delays, or queued phases need their existing mechanisms |
| Combined transforms, opacity with scale, repeated combined tracks | Capability needed | The present single-property mechanisms do not represent these policies |
| Other catalogue recipes | Source review required | Resolve effective settings and runtime branches before choosing a migration |

Keep one maintained definition per recipe. Reuse an existing mechanism only when it preserves the recipe behavior. A matching import is insufficient evidence. [The capability-stage record](history/2026-10-23-css-capabilities.md#candidate-queue-and-decisions) names reviewed recipes and their concrete retention reasons. LoaderCircle remains on Motion because a fixed CSS return would lose its angular velocity and spring behavior.

## Inventory and next work

[Issue #95](https://github.com/pommito/astro-animated-icons/issues/95) has a [proposed combined-transform decision](adr/0001-combined-finite-transforms.md) and [pre-implementation Motion and payload evidence](history/2026-10-29-combined-transform-decision.md) at main `92523bd`. Owner architecture review is pending. KeySquare, Wallet, and KeyCircle remain on Motion. [#98](https://github.com/pommito/astro-animated-icons/issues/98) owns systematic source review of all 470 exports; [#99](https://github.com/pommito/astro-animated-icons/issues/99) owns migration of complete reviewed compatible families after capability proof. There is no arbitrary two- or three-icon limit on later family batches.

Generate detailed status from the current code rather than maintaining another per-icon table:

```sh
mkdir -p .artifacts
pnpm inventory:animations --summary --output .artifacts/animation-inventory.json
```

Read [the inventory contract](animation-inventory.md) before interpreting its results. `engine` describes current wiring. `migrationState` distinguishes migrated, supported but deferred, capability needed, retained on Motion, and needs review. Reviewed decisions pin dependency hashes and return to review after source changes.

The inventory regenerated on 2026-10-29 accounts for 23 migrated recipes, no supported but deferred recipe, five needing another capability, 18 explicit Motion retentions, and 424 entries needing review. These counts cover all 470 exports. They do not mean that every remaining recipe has been fully evaluated. The command's generic `Visual acceptance: pending` output describes the inventory's limits; the owner approvals above are separate evidence.

For the next family, resolve its source expressions and transitive defaults, choose real representative recipes, and capture the previous behavior. Preserve the public contract and initial SVG. Extend a mechanism only for a proven requirement, then add comparison coverage, validate interruption and cleanup, and measure complete pages including Motion mixtures. Follow [CONTRIBUTING.md](../CONTRIBUTING.md#add-an-icon) and [Validation](validation.md).

## Completed dependencies

| Stage | Issue | Committed result |
| --- | --- | --- |
| Promote Bell and ChevronRight | [#82](https://github.com/pommito/astro-animated-icons/issues/82) | `28d3e5d`, then template recovery correction `b620895` |
| Generate capability inventory | [#83](https://github.com/pommito/astro-animated-icons/issues/83) | `d6daa02`, on promotion |
| Migrate finite chevrons | [#84](https://github.com/pommito/astro-animated-icons/issues/84) | `28dd4ef`, on inventory |
| Extend deterministic capabilities | [#85](https://github.com/pommito/astro-animated-icons/issues/85) | `e4fa797`, including template recovery for both engines |
| Validate integrated implementation | [#86](https://github.com/pommito/astro-animated-icons/issues/86) | Original `e6197ce`, comparison controls `4986004`, integration `07d2162`, shared route contract `7b4a57c`; merged in [#93](https://github.com/pommito/astro-animated-icons/pull/93) at `da69ce6` |
| Document engines and workflow | [#87](https://github.com/pommito/astro-animated-icons/issues/87) | [PR #90](https://github.com/pommito/astro-animated-icons/pull/90), merged into main at `392f580` on 2026-10-27 |

These are implementation stages, not blanket visual approval or release status. The source pilot patch was promoted once; downstream stages integrate prerequisite commits.

All six initial stages are integrated into main and their issues are closed. Documentation PR #90 merged on 2026-10-27. JavaScript chunk consolidation in [#91](https://github.com/pommito/astro-animated-icons/issues/91) is complete. [PR #96](https://github.com/pommito/astro-animated-icons/pull/96) merged at `3efe4f237e83ff8fb8abc9c264f82905785b4d0a`, and #91 is closed. The [2026-10-27 loading baseline](history/2026-10-27-page-loading-baseline.md) measures both the full fixture and a minimal consumer.

The [selective registration implementation](history/2026-10-27-selective-loading.md) shares one entry per rendered CSS mechanism and carries selected recipe data in HTML. It needs no consumer configuration. For all 22 CSS icons, the minimal consumer reaches four JavaScript files instead of 26 and saves 4950 whole-page gzip bytes. Twenty CircleDashed instances cost 126 additional whole-page gzip bytes. Some warm transitions also transfer more HTML. PR #96 merged on 2026-10-29, and #91 is closed. Its dated report preserves the measurements and owner-review scope from that stage.

[Issue #94](https://github.com/pommito/astro-animated-icons/issues/94) migrates UserRoundCog with the existing CSS cycle. The [half-turn and payload evidence](history/2026-10-29-user-round-cog.md) records unchanged timing and tolerance, single-icon savings, and the LoaderCircle-only mixture regression. The owner visually accepted the UserRoundCog preview on 2026-10-29. [Issue #95](https://github.com/pommito/astro-animated-icons/issues/95) prepares combined transforms for KeySquare, Wallet and KeyCircle, with an architecture decision before implementation. Issue #95 still requires owner visual review for any migration.

## Measurements and acceptance

The [2026-10-23 parity pilot](history/2026-10-23-css-parity.md) saved 10398 gzip bytes for Bell plus ChevronRight. Adding LoaderCircle made that pilot page 258 gzip bytes larger than its all-Motion reference. Those historical figures precede template recovery and later shared chunk changes.

The [current integrated measurement](history/2026-10-23-css-integration.md#current-payloads) reports both normalized JavaScript plus CSS and complete page totals. All 22 CSS icons save 21942 normalized gzip bytes, or 26709 complete-page gzip bytes. Adding LoaderCircle costs 7156 normalized gzip bytes, or 2390 complete-page gzip bytes. The chevron family costs 20 normalized gzip bytes while complete-page compression saves 2867 bytes. Single ChevronDown saves 2811 normalized gzip bytes. Per-icon savings cannot be added. Repeated instances share resources, while HTML and its compression still change. The earlier [21-recipe measurements](history/2026-10-23-css-migration.md#whole-page-payloads) remain historical evidence.

Both sides use the same production build and integrated lifecycle. References use the previous Motion mechanisms with the same recipe data, rather than rebuilding the original baseline commit. Shared resources count once per route. Gzip uses Node zlib defaults per resource with a cold cache. Whole-page totals compress actual HTML, including inline content, once and then add external resources. Headers, latency, Brotli, and warm caches are excluded. Payload savings do not establish smoother frames.

Preserve dated experiments and final evidence under [docs/history/](history/). Routine `pnpm validate` remains browser-free. Separate Chromium checks at `07d2162` passed 9880 assertions across 5880 poses, plus 294 synthetic lifecycle probes. Earlier independent-template checks and native matchMedia checks with DevTools media emulation remain dated evidence. The subsequent validation-only correction and documentation integration ran no browser probes. Safari, Firefox, real touch/hybrid hardware, native operating-system preference changes, frame pacing, and preparation timing remain unverified. The [promotion record](history/2026-10-23-css-promotion.md), chevron and capability records, and PR #92 retain their distinct owner approval scopes.
