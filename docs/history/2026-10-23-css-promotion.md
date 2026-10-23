# CSS promotion verification, 2026-10-23

Bell and ChevronRight now use CSS through their existing public imports, tags, props, and handle methods. Their cycle.ts files drive both production keyframes and fixture-only Motion references. LoaderCircle's recipe is unchanged. The preceding [pilot](2026-10-23-css-pilot.md) and [parity follow-up](2026-10-23-css-parity.md) describe historical implementations. Their experimental paths have since moved to src/CssIcon.astro and src/shared/{css-cycle,cycle-css}.ts. Consumers no longer choose an engine for this pair.

## Reproduction and source

The supplied pilot.patch SHA256 was 6fb0ce27b12179a3837c2fdb5f2cc7db5083753349f3a320f10ec4d36a155d79. It matched manifest.json. git apply --check passed on ee11db863fee0d9fcde04a31c794cc9316d536e7 before the patch was applied in the isolated css-promote worktree. The original pilot was read-only context.

The host pnpm launcher failed with ENOEXEC. Installation and validation used Node 22.20.0 and pnpm 12.5.1 through an explicit shell launcher. Astro was 7.3.8 and Motion was 13.5.1, with a frozen lockfile.

Commands executed in the isolated worktree included:

```sh
rtk proxy pnpm install --frozen-lockfile
rtk proxy pnpm validate
rtk proxy node scripts/fixture.mjs build
rtk proxy node scripts/inspect-bundle.mjs
rtk proxy node scripts/check-css-pilot.mjs
rtk proxy node --test --test-concurrency=1 scripts/inspect-bundle.test.mjs scripts/check-css-pilot.test.mjs
rtk proxy env PILOT_RESULT=docs/history/2026-10-23-css-promotion-payload.json node scripts/measure-css-pilot.mjs baseline managed
rtk proxy env ICON_TEST_PORT=45331 pnpm fixture:serve
rtk git diff --check
```

The installation command initially failed through the host launcher, then passed through /bin/sh with Node 22.20.0. A direct preview attempt timed out; fixture:serve started successfully. An early bundle inspection ran before the build finished and failed on missing output; the complete build and subsequent inspection passed.

## Browser-free validation

pnpm validate passed in 451.838 seconds. Both Astro checks reported zero errors and warnings. The workflow verified 404 drawing baselines, 811 production bundle cases, seven CSS parity routes, and 22 Node tests. The targeted bundle and parity tests also passed all 13 cases. Existing drawing expectations were not edited.

Production checks require exactly the shared CSS plus the generated sheets for rendered CSS recipes. Negative tests remove, alter, duplicate, or add an unused sheet. The checks preserve registration checks, absence of React, script counts, selective barrel loading, and combined-route chunk unions. Repeated instances share styles and chunks. The seven parity routes also compare complete initial SVG and require the LoaderCircle route's chunks and CSS to match its unchanged reference.

## Payloads

All rows use the same full production fixture build. Baseline routes use fixture-only Motion references with distinct tags, while managed routes use public exports. The measurement follows reachable static and dynamic JS imports and counts each chunk once per route. It includes JS and CSS, with Node zlib default gzip per resource. HTML, headers, latency, Brotli, and browser caches are excluded. Inline CSS gzip is a normalized estimate because deployment compresses it with HTML. Per-icon savings are not additive.

| Route | Motion raw / gzip bytes | Public implementation raw / gzip bytes | Gzip bytes saved |
| --- | ---: | ---: | ---: |
| bell | 26414 / 12131 | 3609 / 1816 | 10315 |
| chevron | 11256 / 5306 | 3633 / 1802 | 3504 |
| loader | 71549 / 30139 | 71549 / 30139 | 0 |
| pair | 27377 / 12812 | 4709 / 2419 | 10393 |
| three | 73466 / 31532 | 74704 / 31795 | -263 |
| repeated | 26414 / 12131 | 3609 / 1816 | 10315 |
| mixed | 27377 / 12758 | 13311 / 6305 | 6453 |

The [payload JSON](2026-10-23-css-promotion-payload.json) records JS and CSS separately and lists chunks. LoaderCircle totals remain 71549 raw and 30139 gzip bytes. The pair saves 10393 gzip bytes; adding LoaderCircle increases the page total by 263 gzip bytes. This measures payload, not smoother animation.

## Numerical browser comparisons

The production comparison page at /css-pilot/ ran in the Codex in-app browser. Its runner passed 592 assertions across 496 pose comparisons at 14, 16, 24, and 28 px. It covered entry, stop, replay, stop during return, replay during return, completion, cleanup, and queued old completion. Bell's maximum rotation error was 0.0139843972 degrees against a 0.03 degree tolerance. ChevronRight's translation error was zero against a 0.005 viewBox-unit tolerance. The Motion reference samples Bell's easing; CSS evaluates it continuously.

All 14 lifecycle checks passed, including synthetic touch filtering, parent mouse triggering, disabled and controlled mode, void handle results, disconnect, reconnection, template cloning, and preference-change cleanup through an isolated matchMedia stub. The [browser JSON](2026-10-23-css-promotion-browser.json) records results and limits.

Safari, Firefox, real touch/hybrid hardware, and native operating-system reduced-motion behavior remain pending. No new preparation benchmark or frame-pacing measurement was performed. No merge or issue closure is authorized by these checks.

## Owner visual review

On 2026-10-23, the owner confirmed visual acceptance of Bell and ChevronRight on the [production comparison page](http://127.0.0.1:45331/css-pilot/) after the review requested in this chat. This acceptance applies to promotion commit 28d3e5dbea1f0ec4a8dca59ff1cf7ee5fcbd628e. It does not cover later migrations. The owner did not report additional browser or hardware coverage.

## Template correction

The subsequent [template correction record](2026-10-23-css-template-fix.md) resolves the review findings and records the corrected implementation's browser checks and updated payloads. Its measurements supersede the table above for the corrected runtime.
