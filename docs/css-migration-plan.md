# CSS migration plan

The owner approved internal CSS engine selection in [issue #81](https://github.com/pommito/astro-animated-icons/issues/81). Consumers keep the existing imports, tags, props, and playback methods. Generated CSS keyframes use JavaScript playback control and the shared custom-element lifecycle.

The integrated implementation at `e6197ce` has 21 CSS recipes among 404 exported icons. The [final verification record](history/2026-10-23-css-migration.md) contains commands, browser results, measurements, and limits. The [documentation check](history/2026-10-23-css-documentation.md) records the command and link verification. Bell and all 13 finite chevrons have recorded owner visual acceptance. The [chevron acceptance record](history/2026-10-23-css-chevron-acceptance.md) covers the 12 additions. The seven capability-stage migrations still await that review.

## Family decisions

| Family | Current decision | Mechanism or reason |
| --- | --- | --- |
| Bell | CSS | Finite rotation, current-pose replay, hold completion |
| 13 finite chevrons | CSS | One translation axis, explicit first entry value, restore completion; ChevronFirst keeps independent return timing |
| Four folder translations | CSS | Inner-group translation, restart entry, hold completion |
| CircleHelp | CSS | Inner-group rotation, current-pose replay, hold completion |
| CalendarDays and CircleDashed | CSS | Timed opacity parts with per-target delays, completion, replay, and return policies |
| LoaderCircle and four paired chevron springs | Motion retained | Interrupted returns inherit measured velocity and use springs |
| Archive and other reviewed Motion recipes | Motion retained | Retained Motion values, morphs, spring defaults, unwrapped angles, random delays, or queued phases need their existing mechanisms |
| Combined transforms, opacity with scale, repeated combined tracks | Capability needed | The present single-property mechanisms do not represent these policies |
| Other catalogue recipes | Source review required | Resolve effective settings and runtime branches before choosing a migration |

Keep one maintained definition per recipe. Reuse an existing mechanism only when it preserves the recipe behavior. A matching import is insufficient evidence. [The capability-stage record](history/2026-10-23-css-capabilities.md#candidate-queue-and-decisions) names reviewed recipes and their concrete retention reasons. LoaderCircle remains on Motion because a fixed CSS return would lose its angular velocity and spring behavior.

## Inventory and next work

Generate detailed status from the current code rather than maintaining another per-icon table:

```sh
mkdir -p .artifacts
pnpm inventory:animations --summary --output .artifacts/animation-inventory.json
```

Read [the inventory contract](animation-inventory.md) before interpreting its results. `engine` describes current wiring. `migrationState` distinguishes migrated, supported but deferred, capability needed, retained on Motion, and needs review. Reviewed decisions pin dependency hashes and return to review after source changes.

At final validation, the generated inventory accounts for 21 migrated recipes, one supported but deferred recipe, five needing another capability, 18 explicit Motion retentions, and 359 entries needing review. These counts cover all 404 exports. They do not mean that every remaining recipe has been fully evaluated.

For the next family, resolve its source expressions and transitive defaults, choose real representative recipes, and capture the previous behavior. Preserve the public contract and initial SVG. Extend a mechanism only for a proven requirement, then add comparison coverage, validate interruption and cleanup, and measure complete pages including Motion mixtures. Follow [CONTRIBUTING.md](../CONTRIBUTING.md#add-an-icon) and [Validation](validation.md).

## Completed dependencies

| Stage | Issue | Committed result |
| --- | --- | --- |
| Promote Bell and ChevronRight | [#82](https://github.com/pommito/astro-animated-icons/issues/82) | `28d3e5d`, then template recovery correction `b620895` |
| Generate capability inventory | [#83](https://github.com/pommito/astro-animated-icons/issues/83) | `d6daa02`, on promotion |
| Migrate finite chevrons | [#84](https://github.com/pommito/astro-animated-icons/issues/84) | `28dd4ef`, on inventory |
| Extend deterministic capabilities | [#85](https://github.com/pommito/astro-animated-icons/issues/85) | `e4fa797`, including template recovery for both engines |
| Validate integrated implementation | [#86](https://github.com/pommito/astro-animated-icons/issues/86) | `e6197ce`, on capabilities |
| Document engines and workflow | [#87](https://github.com/pommito/astro-animated-icons/issues/87) | This documentation branch, on final validation |

These are implementation stages, not blanket visual approval or release status. The source pilot patch was promoted once; downstream stages integrate prerequisite commits.

## Measurements and acceptance

The [2026-10-23 parity pilot](history/2026-10-23-css-parity.md) saved 10398 gzip bytes for Bell plus ChevronRight. Adding LoaderCircle made that pilot page 258 gzip bytes larger than its all-Motion reference. Those historical figures precede template recovery and later shared chunk changes.

The [final integrated measurement](history/2026-10-23-css-migration.md#whole-page-payloads) reports both normalized JavaScript plus CSS and complete page totals. All 21 CSS icons save 22111 normalized gzip bytes, or 26642 whole-page gzip bytes. Adding LoaderCircle costs 6987 normalized gzip bytes, or 2460 whole-page gzip bytes. Per-icon savings cannot be added. Repeated instances share resources, while HTML and its compression still change.

Both sides use the same production build and integrated lifecycle. References use the previous Motion mechanisms with the same recipe data, rather than rebuilding the original baseline commit. Shared resources count once per route. Gzip uses Node zlib defaults per resource with a cold cache. Whole-page totals compress actual HTML, including inline content, once and then add external resources. Headers, latency, Brotli, and warm caches are excluded. Payload savings do not establish smoother frames.

Preserve dated experiments and final evidence under [docs/history/](history/). Routine `pnpm validate` remains browser-free. Separate Chromium checks include numerical poses, synthetic lifecycle probes, independent templates, and native matchMedia with DevTools media emulation. Safari, Firefox, physical touch/hybrid input, operating-system preference changes, frame pacing, and preparation timing remain unverified by final validation. The [promotion record](history/2026-10-23-css-promotion.md) records acceptance of Bell and ChevronRight. The [chevron acceptance record](history/2026-10-23-css-chevron-acceptance.md) adds the other 12 finite chevrons. Owner visual acceptance remains pending for FolderDown, FolderUp, FolderInput, FolderOutput, CircleHelp, CalendarDays, and CircleDashed.
