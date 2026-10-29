# Page loading baseline

The full fixture splits recipe data used by comparison references into separate client chunks. The minimal consumer already folds that data into the registration entries. For the same 22 CSS icons, the full fixture reaches 48 JavaScript files and the minimal consumer reaches 26. Their JavaScript gzip totals are 10532 and 8824 bytes. These are two consumers of the current implementation, not a before/after optimization result.

This is the first measurement stage of [issue #91](https://github.com/pommito/astro-animated-icons/issues/91), on main source baseline `392f5809963da19970fa63bcebee87524bbe2ebc`, with the measurement additions in this change. No package runtime, recipe, export, dependency or public setup changed.

## Reproduction and conditions

```sh
pnpm install --frozen-lockfile
node scripts/measure-page-loading.mjs
pnpm validate
```

The measurement command builds the full Astro fixture and an isolated consumer generated under `.artifacts/page-loading/minimal/`. It writes `.artifacts/page-loading/baseline.json`. The committed [measurement JSON](2026-10-27-page-loading-baseline.json) contains all routes, resource URLs, module provenance, SHA256 values and cache transitions. Both consumers use the same page component, public barrel imports, package sources and installed dependencies. The minimal consumer contains only the 13 measurement routes and has no Motion comparison reference. Its dependency links reuse the installed fixture dependencies. It does not test a packed package or a separate installation. Even this small project has several pages, which affect shared chunk splitting.

The environment was Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, macOS arm64 and Apple M1 Pro. Both generated configurations extend the existing fixture configuration and use separate output and cache directories under `.artifacts/page-loading/`. They preserve the default production chunk settings and leave the regular validation output intact. A Vite plugin records client chunk provenance without changing chunk selection or content. Every measured chunk must match its recorded SHA256.

The resource walker reuses `inspectRoute` and `measureRoute`. It follows reachable static and literal dynamic imports and counts each external JavaScript URL once per route. It includes the full reachable graph even when a dynamic import may execute later. File counts describe production output, not observed browser requests.

Gzip uses Node zlib defaults. JavaScript and CSS totals compress each resource separately. Inline styles count separately in the normalized CSS total. Page totals compress the actual HTML once, including inline styles, and add each external JavaScript and stylesheet resource once. All byte values in the tables are raw / gzip. Headers, latency, Brotli and HTTP cache policy are excluded. Payload sizes establish no frame-pacing or preparation-time result.

## Compositions

`one` is CircleDashed. `four` is Bell, ChevronRight, FolderDown and CalendarDays. `ten` adds CircleDashed, Folder, CircleHelp, ChevronDown, FolderUp and SquareChevronRight to that set. `legacy-21` excludes Folder to reproduce the original #91 scope. `all` contains the current 22 CSS recipes. `repeated` renders 20 CircleDashed instances and `repeated-all` renders each CSS icon three times, for 66 instances. The loader cases add unchanged LoaderCircle. `unused` retains the barrel imports without rendering an icon.

### Full production fixture

| Case | Icons / distinct | Entries | JS files | JS raw / gzip | CSS raw / gzip | Page raw / gzip |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| one | 1 / 1 | 1 | 5 | 6211 / 3051 | 6842 / 593 | 14194 / 4097 |
| four | 4 / 4 | 4 | 12 | 8535 / 4539 | 8046 / 1441 | 20056 / 6147 |
| ten | 10 / 10 | 10 | 24 | 11033 / 6538 | 18684 / 3343 | 37418 / 9112 |
| legacy-21 | 21 / 21 | 21 | 46 | 15650 / 10188 | 27378 / 6430 | 57444 / 13657 |
| all | 22 / 22 | 22 | 48 | 16086 / 10532 | 28174 / 6725 | 59342 / 14089 |
| repeated | 20 / 1 | 1 | 5 | 6211 / 3051 | 6842 / 593 | 30154 / 4221 |
| repeated-all | 66 / 22 | 22 | 48 | 16086 / 10532 | 28174 / 6725 | 82090 / 14584 |
| loader | 1 / 1 | 1 | 15 | 71443 / 30031 | 124 / 116 | 72224 / 30531 |
| one-loader | 2 / 2 | 2 | 19 | 76206 / 32426 | 6842 / 593 | 84706 / 33563 |
| four-loader | 5 / 5 | 5 | 26 | 78530 / 33914 | 8046 / 1441 | 90568 / 35592 |
| ten-loader | 11 / 11 | 11 | 38 | 81028 / 35913 | 18684 / 3343 | 107930 / 38556 |
| all-loader | 23 / 23 | 23 | 62 | 86081 / 39907 | 28174 / 6725 | 129854 / 43532 |
| unused | 0 / 0 | 0 | 0 | 0 / 0 | 124 / 116 | 264 / 209 |

### Minimal production consumer

| Case | Icons / distinct | Entries | JS files | JS raw / gzip | CSS raw / gzip | Page raw / gzip |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| one | 1 / 1 | 1 | 4 | 6152 / 2973 | 6842 / 593 | 14135 / 4019 |
| four | 4 / 4 | 4 | 8 | 8287 / 4240 | 8046 / 1441 | 19808 / 5847 |
| ten | 10 / 10 | 10 | 14 | 10411 / 5780 | 18684 / 3343 | 36796 / 8356 |
| legacy-21 | 21 / 21 | 21 | 25 | 14335 / 8555 | 27378 / 6430 | 56129 / 12025 |
| all | 22 / 22 | 22 | 26 | 14708 / 8824 | 28174 / 6725 | 57964 / 12384 |
| repeated | 20 / 1 | 1 | 4 | 6152 / 2973 | 6842 / 593 | 30095 / 4143 |
| repeated-all | 66 / 22 | 22 | 26 | 14708 / 8824 | 28174 / 6725 | 80712 / 12880 |
| loader | 1 / 1 | 1 | 11 | 66943 / 27112 | 124 / 116 | 67724 / 27610 |
| one-loader | 2 / 2 | 2 | 14 | 71647 / 29429 | 6842 / 593 | 80147 / 30563 |
| four-loader | 5 / 5 | 5 | 18 | 73782 / 30696 | 8046 / 1441 | 85820 / 32371 |
| ten-loader | 11 / 11 | 11 | 24 | 75906 / 32236 | 18684 / 3343 | 102808 / 34879 |
| all-loader | 23 / 23 | 23 | 36 | 80203 / 35280 | 28174 / 6725 | 123976 / 38907 |
| unused | 0 / 0 | 0 | 0 | 0 / 0 | 124 / 116 | 264 / 209 |

The original #91 baselines reproduce exactly in the full fixture for one, four and legacy-21 icons, including 6211 / 3051, 8535 / 4539 and 15650 / 10188 JavaScript bytes. Repeated instances add HTML but no JavaScript or generated CSS. Unused imports add no JavaScript or recipe CSS. The existing common wrapper CSS remains.

## Source contributions

Client module metadata separates registration, recipe data and definitions, lifecycle, CSS adapters, stylesheet compilation and recovery, and dependencies. The metadata uses Rollup-compatible `renderedLength` values from Vite. These values identify contributions before final minification. They cannot allocate final raw or gzip bytes to each source module. The following rows instead sum the actual output bytes of disjoint chunk groups for all 22 CSS icons.

| Chunk group | Full files | Full raw / gzip | Minimal files | Minimal raw / gzip |
| --- | ---: | ---: | ---: | ---: |
| Registration with local definition and any folded recipe data | 22 | 5106 / 3723 | 22 | 7847 / 5623 |
| Separate recipe data | 22 | 4119 / 3608 | 0 | 0 / 0 |
| Common lifecycle | 1 | 1448 / 656 | 1 | 1448 / 656 |
| Transform CSS adapter | 1 | 1076 / 491 | 1 | 1076 / 491 |
| Transform stylesheet compiler and recovery | 1 | 1219 / 633 | 1 | 1219 / 633 |
| Opacity adapter, compiler and shared opacity utilities | 1 | 3118 / 1421 | 1 | 3118 / 1421 |

The minimal output still has one registration entry per distinct icon. Folding recipe data into those entries removes 22 files and 1708 gzip bytes for this composition compared with the full fixture. This difference does not require a runtime change. The fixture references also reuse the recipe data, which explains their additional sharing boundary. A future optimization must improve the minimal consumer as well as the full fixture. Reducing only the fixture split would overstate a consumer benefit.

## Reuse across routes

The cache model assumes a second document navigation within the same build. Every external URL reached by the first route remains cached, without eviction or revalidation. The second HTML document is fetched again, including its inline styles. There is no cross-build cache claim or measured browser-cache behavior.

| Transition | Full new JS files | Minimal new JS files | Full page gzip | Minimal page gzip |
| --- | ---: | ---: | ---: | ---: |
| one to four | 9 | 5 | 3437 | 3137 |
| four to ten | 12 | 6 | 4573 | 4116 |
| ten to all | 24 | 12 | 7551 | 6604 |
| all to one | 0 | 0 | 1046 | 1046 |
| all to all-loader | 14 | 10 | 33000 | 30083 |
| loader to all-loader | 47 | 25 | 13501 | 11795 |
| all-loader to four | 0 | 0 | 1608 | 1607 |
| one to repeated | 0 | 0 | 1170 | 1170 |
| all to repeated-all | 0 | 0 | 4052 | 4056 |

For example, moving from four to ten icons adds six JavaScript files in the minimal consumer and 12 in the full fixture. Moving from all icons to one reuses all JavaScript in either consumer. Page-specific bundles could reduce cold file counts while losing some of this reuse, so both results must remain in the comparison.

## Next decision for #91

Prototype a page-specific entry that includes only the selected registration and recipe modules, while retaining stable shared lifecycle and engine chunks. First verify that the approach can discover the scripts of rendered icons and preserve unused-import exclusion, templates mounted later and the current Astro setup. Evaluate the prototype against both baselines before choosing its public integration. Document any required Astro integration explicitly.

Keep a second option that folds each recipe into its existing registration entry. This can address the full fixture split, but the minimal consumer already gets that shape and still has 26 files for 22 CSS icons. A catalogue-wide bundle would ship unused recipes on smaller pages and fails the selective-loading requirement.

No packaging strategy has been implemented or accepted by this baseline. The optimization must still show fewer files and fewer JavaScript gzip bytes on representative multi-icon pages, with single-icon, mixed-Motion and route-reuse regressions disclosed. Browser probes for registration, playback, interruption, templates and cleanup belong to the implementation stage if loading changes.

## Verification

- `pnpm inventory:animations --summary --output /tmp/astro-animation-inventory.json` accounted for all 470 exports and confirmed the current queue.
- `node scripts/measure-page-loading.mjs` completed three successful build campaigns. All 26 route payloads and all 18 cache transitions matched exactly between campaigns, including the final isolated-output build. The final two campaigns also recorded SHA256 checks for module provenance.
- `node --test scripts/measure-page-loading.test.mjs` passed six focused tests. They verify unique shared-resource counting, HTML compression, warm navigation costs, exact registration selection, missing and stale module evidence, repeated stylesheet payloads, and module roles. An injected unused registration and changed shared chunk are rejected.
- `node scripts/measure-css-migration.mjs` reproduced the recorded integration report for all 32 compositions. `assert.deepEqual` confirmed identical resource URLs, raw/gzip values and savings. The optional output-root argument preserves the existing measurement command.
- `pnpm validate` passed in 112.619 seconds. Both Astro checks reported zero errors, warnings and hints. It verified 470 drawings, 944 bundle cases, seven pilot routes, 16 chevron routes, 15 capability routes, 22 CSS recipes across 32 migration compositions, and all 58 Node tests.

All 17 local Markdown links and anchors in the changed documents resolved.

The new pages only render existing components for measurement. No browser or manual visual review ran for this change. The earlier migration acceptances retain their recorded scope.

## Follow-up preparation

[Issue #94](https://github.com/pommito/astro-animated-icons/issues/94) scopes UserRoundCog as the next use of the existing CSS cycle. It requires half-turn decomposition, interrupted return and payload proof before migration acceptance. [Issue #95](https://github.com/pommito/astro-animated-icons/issues/95) scopes combined transforms for KeySquare, Wallet and KeyCircle. It requires an architecture decision before extending the engine. Both are native sub-issues of #81 and refer to the delivery baseline from #91.
