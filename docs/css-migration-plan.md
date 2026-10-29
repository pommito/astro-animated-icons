# CSS migration plan

The owner approved internal CSS engine selection in [issue #81](https://github.com/pommito/astro-animated-icons/issues/81). Consumers keep the existing imports, tags, props, and playback methods. Generated CSS keyframes use JavaScript playback control and the shared custom-element lifecycle.

This branch has 26 CSS recipes among 470 exported icons. The owner visually accepted KeySquare, Wallet, and KeyCircle on 2026-10-29 at `df1ad33` on `/combined-transforms/`. The [acceptance record](history/2026-10-29-combined-transform-acceptance.md) identifies the reviewed scope. The owner visually accepted UserRoundCog on 2026-10-29 at `7f30ce7` on `/css-capabilities/#user-round-cog` for [PR #97](https://github.com/pommito/astro-animated-icons/pull/97). The [2026-10-29 record](history/2026-10-29-user-round-cog.md) compares it with the post-#91 baseline at `3efe4f2`. The earlier implementation at `da69ce6` had 22 CSS recipes. Its [integration record](history/2026-10-23-css-integration.md) contains evidence and measurements for 32 compositions, including 66 repeated instances. The [documentation integration check](history/2026-10-23-css-documentation-integration.md) records the inventory and command verification from that stage. The original [documentation check](history/2026-10-23-css-documentation.md) and [21-recipe verification](history/2026-10-23-css-migration.md) remain dated history.

The original 21 migrated recipes have owner visual acceptance. Bell and ChevronRight were accepted during promotion. The [chevron acceptance record](history/2026-10-23-css-chevron-acceptance.md) covers the other 12 finite chevrons. The [capability acceptance record](history/2026-10-23-css-capability-acceptance.md) covers seven icons. Folder has separate acceptance in [PR #92](https://github.com/pommito/astro-animated-icons/pull/92), including its intentional 200 ms return. Documentation integration adds no visual approval.

## Family decisions

The full source review for [#98](https://github.com/pommito/astro-animated-icons/issues/98) starts at merged main `1bbd0e2`, after #95. All 470 exports have a pinned outcome. The maintained [per-export contracts](../scripts/animation-decisions.json) and [family contracts](../scripts/animation-families.json) supply complete membership and playback decisions. The generated `familyQueue` partitions every export exactly once; it has no arbitrary batch-size limit.

| Outcome | Exports | Next action |
| --- | ---: | --- |
| Migrated | 26 | Preserve existing evidence and scoped owner approvals. |
| Supported but deferred | 6 | #99 captures preceding behavior and migrates the complete compatible families. |
| Specified capability needed | 196 | #81 coordinates capability design and proof before rollout. |
| Retained on Motion | 242 | Preserve the concrete retained behavior. |
| Needs source review | 0 | New or changed source must pass review before entering the queue. |

The complete additional set supported by the existing finite cycle is `Disc3`, `PanelLeftClose`, `PanelLeftOpen`, `PanelRightOpen`, `BriefcaseBusiness`, and `TreePine`. The four group recipes use the already supported `[data-motion="0"]` target. Disc3 rotates to 90 degrees with 400 ms easeInOut; the panels translate on X for 500 ms with offsets `[0, .4, 1]` and easeOut. Their returns use the same duration/easing, current-pose replay and hold completion. Their drawing origins stay unchanged.

BriefcaseBusiness and TreePine rotate the SVG. BriefcaseBusiness keeps its fixed `12px 4px` origin, 900 ms easeInOut entry and 300 ms easeOut return. TreePine uses 500 ms easeInOut in both directions. Both hold entry at zero and explicitly time their normal poses, so the shared SVG-parts spring defaults do not execute. Their active replay and completed replay fit the current-pose cycle. These six remain on Motion in #98. Source compatibility grants no browser parity or visual acceptance for their later migration.

The queue also records the exceptions within shared helpers. Languages has fixed sampled spring paint without inherited velocity. Sun uses only opacity branches and performs no geometry measurement. Signals still use entry springs when their return is timed. LoaderCircle, Loader and LoaderPinwheel retain angular velocity and spring returns. Cart, GraduationCap and the trending family continue selected samplers during return. Archive keeps a Motion value and path morphs. Vehicle loops and explicit sequences retain their queued phases and cancellation guards. Full-turn scalar/group rotations keep their unwrapped angles. No shared import or word match establishes eligibility.

### Complete family queue

This table is the 2026-10-29 source-review snapshot. Full slug membership and contracts live in the maintained JSON above and in generated `familyQueue`; the table does not create another per-icon list.

| Family | Exports | Outcome | Mechanism or required behavior |
| --- | ---: | --- | --- |
| `continued-samplers` | 5 | Motion retained | `continue-on-return` |
| `css-combined-cycle` | 3 | Supported | `combined-finite-transforms` |
| `css-finite-cycle` | 21 | Supported | `finite-transform-cycle` |
| `css-opacity-parts` | 2 | Supported | `timed-opacity-parts` |
| `currency-path-reveal` | 21 | Capability needed | `runtime-path-paint` |
| `finite-group-cycle` | 4 | Supported | `finite-transform-cycle` |
| `finite-svg-parts-cycle` | 2 | Supported | `finite-transform-cycle` |
| `fixed-spring-paint` | 1 | Capability needed | `sampled-spring-paint` |
| `geometry-with-transforms` | 9 | Capability needed | `runtime-path-paint-and-transforms` |
| `native-springs` | 6 | Motion retained | `native-spring` |
| `opacity-loop` | 7 | Capability needed | `repeated-opacity` |
| `opacity-restart` | 13 | Capability needed | `opacity-restart-easing-and-completion` |
| `parts-finite-paint` | 30 | Capability needed | `normalized-svg-paint` |
| `parts-finite-transform` | 12 | Capability needed | `multiple-targets-transform-channels-and-repeat` |
| `parts-morph` | 5 | Motion retained | `path-morph` |
| `parts-repeated-opacity` | 5 | Capability needed | `repeated-opacity-with-replay-phases` |
| `parts-springs` | 68 | Motion retained | `inherited-velocity` |
| `queued-sequences` | 10 | Motion retained | `custom-sequence` |
| `random-delays` | 1 | Motion retained | `random-delays` |
| `runtime-path-reveal` | 30 | Capability needed | `runtime-path-paint` |
| `signal-springs` | 8 | Motion retained | `signal-spring` |
| `spring-return-corners` | 8 | Motion retained | `inherited-velocity` |
| `spring-return-directions` | 10 | Motion retained | `inherited-velocity` |
| `spring-return-flight` | 2 | Motion retained | `inherited-velocity` |
| `spring-return-map-symbol` | 9 | Motion retained | `inherited-velocity` |
| `spring-return-marks` | 5 | Motion retained | `inherited-velocity` |
| `spring-return-phone-symbol` | 2 | Motion retained | `inherited-velocity` |
| `spring-return-pulse` | 3 | Motion retained | `inherited-velocity` |
| `spring-transforms` | 90 | Motion retained | `inherited-velocity` |
| `staggered-path-cycle` | 7 | Capability needed | `runtime-path-cycle` |
| `staggered-path-reveal` | 23 | Capability needed | `runtime-path-paint` |
| `symbol-path-reveal` | 12 | Capability needed | `runtime-path-paint` |
| `timed-paint` | 4 | Capability needed | `finite-svg-paint` |
| `timed-transform-parts` | 19 | Capability needed | `multiple-targets-and-transform-channels` |
| `unwrapped-angle` | 7 | Motion retained | `unwrapped-rotation` |
| `vehicle-sequences` | 3 | Motion retained | `custom-sequence-and-springs` |
| `wind-path-reveal` | 3 | Capability needed | `runtime-path-paint` |

Motion retention reasons are explicit in the family and local contracts: retained spring velocity, native spring physics, `d` morphs, current-opacity signal springs, continuing samplers, unwrapped turns, randomized delays or queued phases. Capability candidates specify paint/geometry, target/channel support, repeat/replay policy or fixed sampled paint. They cannot silently count as eligible migrations.

## Inventory and next work

[Issue #95](https://github.com/pommito/astro-animated-icons/issues/95) implements the [combined-transform decision](adr/0001-combined-finite-transforms.md) approved by the owner on 2026-10-29 before implementation. Its [pre-implementation Motion and payload evidence](history/2026-10-29-combined-transform-decision.md) starts at main `92523bd`. [Implementation evidence](history/2026-10-29-combined-transforms.md) records the preserved behavior, unit-page savings, family and mixed-Motion regressions for KeySquare, Wallet, and KeyCircle. The owner visually accepted all three on 2026-10-29 at `df1ad33`. [#98](https://github.com/pommito/astro-animated-icons/issues/98) owns systematic source review of all 470 exports; [#99](https://github.com/pommito/astro-animated-icons/issues/99) owns migration of complete reviewed compatible families after capability proof. There is no arbitrary two- or three-icon limit on later family batches.

Generate detailed status from the current code rather than maintaining another per-icon table:

```sh
mkdir -p .artifacts
pnpm inventory:animations --check --summary --output .artifacts/animation-inventory.json
```

Read [the inventory contract](animation-inventory.md) before interpreting its results. `engine` describes current wiring. `migrationState` distinguishes migrated, supported but deferred, capability needed, retained on Motion, and needs review. Reviewed decisions pin dependency hashes and return to review after source changes.

The inventory regenerated for #98 accounts for 26 migrated recipes, six supported but deferred, 196 needing specified capabilities, 242 retained on Motion, and zero needing source review. The strict check rejects missing/orphan records and invalidates reviews when local definitions, transitive helpers, drawings, origins, lifecycle, delivery, recipe types, dependency lock or reviewed family policies change. Deferred recipes also pin the existing CSS mechanism that supports their compatibility decision. [Schema version 2](animation-inventory.md) separates production import graphs from this broader review dependency set. The [source-review record](history/2026-10-29-catalogue-source-review.md) preserves its validation and limits.

For the next family, resolve its source expressions and transitive defaults, choose real representative recipes, and capture the previous behavior. Preserve the public contract and initial SVG. Extend a mechanism only for a proven requirement, then add comparison coverage, validate interruption and cleanup, and measure complete pages including Motion mixtures. Follow [CONTRIBUTING.md](../CONTRIBUTING.md#add-an-icon) and [Validation](validation.md).

### Compatibility and payload cost

ADR 0001 proves the sampled ordered-channel mechanism for its reviewed recipes. It does not imply that every combined transform fits. Existing types support SVG targets with translateY, uniform scale and rotation, shared channel timing, independent offsets and retained scalar poses. Other targets, horizontal/axis-scale channels, custom easing, delays, repeats, paint and queued phases remain explicit capabilities or retentions in the queue.

The [merged before/after evidence](history/2026-10-29-combined-transforms.md#production-payloads) reports unit-page gzip savings but a 2267-byte full-consumer and 2529-byte minimal-consumer page gzip increase for the three-icon family. Adding LoaderCircle increases page gzip by 12990 and 12931 bytes. The broader shared transform runtime also adds 845 and 846 page gzip bytes to the unchanged UserRoundCog control. These are prior measured payload tradeoffs, not new measurements from #98. Preserve both behavioral compatibility and complete-page costs when #99 selects rollout batches. This issue neither optimizes that mechanism nor migrates another recipe.

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

[Issue #94](https://github.com/pommito/astro-animated-icons/issues/94) migrates UserRoundCog with the existing CSS cycle. The [half-turn and payload evidence](history/2026-10-29-user-round-cog.md) records unchanged timing and tolerance, single-icon savings, and the LoaderCircle-only mixture regression. The owner visually accepted the UserRoundCog preview on 2026-10-29. [Issue #95](https://github.com/pommito/astro-animated-icons/issues/95) migrates KeySquare, Wallet, and KeyCircle after the owner approved ADR 0001. The owner visually accepted the three migrated recipes at `df1ad33` on 2026-10-29 after the implementation comparisons. Architecture and visual approval have separate records.

## Measurements and acceptance

The [2026-10-23 parity pilot](history/2026-10-23-css-parity.md) saved 10398 gzip bytes for Bell plus ChevronRight. Adding LoaderCircle made that pilot page 258 gzip bytes larger than its all-Motion reference. Those historical figures precede template recovery and later shared chunk changes.

The [current integrated measurement](history/2026-10-23-css-integration.md#current-payloads) reports both normalized JavaScript plus CSS and complete page totals. All 22 CSS icons save 21942 normalized gzip bytes, or 26709 complete-page gzip bytes. Adding LoaderCircle costs 7156 normalized gzip bytes, or 2390 complete-page gzip bytes. The chevron family costs 20 normalized gzip bytes while complete-page compression saves 2867 bytes. Single ChevronDown saves 2811 normalized gzip bytes. Per-icon savings cannot be added. Repeated instances share resources, while HTML and its compression still change. The earlier [21-recipe measurements](history/2026-10-23-css-migration.md#whole-page-payloads) remain historical evidence.

Both sides use the same production build and integrated lifecycle. References use the previous Motion mechanisms with the same recipe data, rather than rebuilding the original baseline commit. Shared resources count once per route. Gzip uses Node zlib defaults per resource with a cold cache. Whole-page totals compress actual HTML, including inline content, once and then add external resources. Headers, latency, Brotli, and warm caches are excluded. Payload savings do not establish smoother frames.

Preserve dated experiments and final evidence under [docs/history/](history/). Routine `pnpm validate` remains browser-free. Separate Chromium checks at `07d2162` passed 9880 assertions across 5880 poses, plus 294 synthetic lifecycle probes. Earlier independent-template checks and native matchMedia checks with DevTools media emulation remain dated evidence. The subsequent validation-only correction and documentation integration ran no browser probes. Safari, Firefox, real touch/hybrid hardware, native operating-system preference changes, frame pacing, and preparation timing remain unverified. The [promotion record](history/2026-10-23-css-promotion.md), chevron and capability records, and PR #92 retain their distinct owner approval scopes.
