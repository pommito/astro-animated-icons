# CSS migration plan

The owner approved internal CSS engine selection in [issue #81](https://github.com/pommito/astro-animated-icons/issues/81). Consumers keep the existing imports, tags, props, and playback methods. Generated CSS keyframes use a JavaScript playback adapter and the shared custom-element lifecycle.

This draft records the decision before final integration. Implementation status, supported capabilities, and final measurements must be reconciled with the inventory and validation commits before this document is ready for review.

## Engine decision

Keep one maintained recipe definition. Reuse an existing mechanism when it preserves the recipe behavior. Migrate a coherent family only after its interruption and cleanup policies have evidence. Keep unsupported or uncertain behavior on Motion with a concrete reason.

LoaderCircle stays on Motion because its interrupted return inherits angular velocity and uses a spring. A fixed CSS return would change that behavior.

## Stages and dependencies

| Stage | Issue | Dependency | Draft status |
| --- | --- | --- | --- |
| Promote Bell and ChevronRight | [#82](https://github.com/pommito/astro-animated-icons/issues/82) | Pilot | Awaiting committed result |
| Generate capability inventory | [#83](https://github.com/pommito/astro-animated-icons/issues/83) | Catalogue and promotion | Awaiting generated inventory |
| Migrate finite chevrons | [#84](https://github.com/pommito/astro-animated-icons/issues/84) | Promotion and inventory | Awaiting result |
| Extend deterministic capabilities | [#85](https://github.com/pommito/astro-animated-icons/issues/85) | Inventory and chevrons | Awaiting result |
| Validate integrated implementation | [#86](https://github.com/pommito/astro-animated-icons/issues/86) | Implementation stages | Awaiting final evidence |
| Finish documentation | [#87](https://github.com/pommito/astro-animated-icons/issues/87) | Inventory and validation | Draft |

Detailed catalogue status must come from the reproducible inventory command. This plan records family decisions rather than duplicating per-icon rows.

## Evidence boundaries

The 2026-10-23 pilot measured a saving of 10398 gzip bytes for Bell plus ChevronRight. Adding LoaderCircle made that page 258 gzip bytes larger than its all-Motion reference. These are pilot measurements, not final integrated results. Page composition determines shared chunk costs; per-icon savings cannot be added.

Measure reachable JavaScript and CSS together, count shared resources once, and report raw and gzip bytes. State build versions, compression assumptions, HTML exclusions, and cache conditions. Smaller delivery does not establish smoother animation.

Keep dated experiments and final evidence under docs/history/. Routine pnpm validate stays browser-free. Numerical browser comparisons remain separate evidence. The owner has not granted visual acceptance.
