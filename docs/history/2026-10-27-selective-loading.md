# Selective CSS registration

The 22 CSS icons now share one registration entry per selected mechanism. Their existing recipe data is serialized into the rendered HTML. In the minimal consumer, all 22 icons reach four JavaScript files instead of 26, and whole-page gzip falls from 12384 to 7434 bytes. The full fixture reaches six files instead of 48, with whole-page gzip falling from 14089 to 7556 bytes.

This implements the delivery change in [issue #91](https://github.com/pommito/astro-animated-icons/issues/91). The source baseline is `cd14772c0818dc4e31116211e15b32c645c2285d`, recorded in [the loading baseline](2026-10-27-page-loading-baseline.md) and its [JSON](2026-10-27-page-loading-baseline.json). Current [payload evidence](2026-10-27-selective-loading-payloads.json) and [browser evidence](2026-10-27-selective-loading-browser.json) accompany this report. Owner review of the loading tradeoffs remains pending.

## Chosen representation

The public Astro imports, tags, props, handles and void playback methods stay the same. CssIcon and CssOpacityIcon each own a processed registration script. Icon-local CSS adapters no longer import their registration modules. Motion icons keep their previous delivery path. Consumers need no integration or configuration change.

Each rendered CSS host carries a complete escaped JSON attribute from its existing cycle.ts or parts.ts data. Registration reads those hosts, recursively scans inert templates and defines each tag once through createIconElement. It uses the existing CSS adapters and lifecycle without changing their playback code. Discovery runs again on astro:page-load. Later clones of known tags reuse the same class.

A complete per-host record lets an independent clone register before its source template and stylesheet exist in the active document. Repeated hosts carry repeated data, but create no additional class definition, engine entry or generated stylesheet. The JSON attributes are part of HTML, not executable inline scripts. The source definition remains the only maintained recipe.

The shared registration module must load before its data can be used. Scripts inside an inert template remain inert until that fragment is mounted. The removed-source fixture imports the registration code outside the template, then proves that independent host clones retain their data and recover their styles. It does not claim that data alone executes registration code.

The stylesheet recovery helper now lives in recipe-css.ts. Both compilers reuse it. An opacity-only page no longer imports the transform compiler through the old recovery-helper import. CSS keyframes, recipe values, drawing data and playback adapters retain their previous behavior.

A per-page build integration was considered after the baseline. Shared mechanism entries with rendered recipe data achieve the file-count goal through ordinary Astro component scripts and avoid a new consumer setup. Folding each recipe into its old entry was already the minimal consumer baseline and would leave one JavaScript entry per icon. A full-catalogue bootstrap would violate selective loading.

## Measurements

Run:

```sh
pnpm install --frozen-lockfile
node scripts/measure-page-loading.mjs
```

The command builds both consumers into isolated output and cache directories under .artifacts/page-loading. Its current result is .artifacts/page-loading/baseline.json. The committed baseline JSON above remains immutable. Both versions use Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, macOS arm64 and Apple M1 Pro. There is no dependency or lockfile change.

The 13 compositions and nine cache transitions per consumer match the baseline. The full fixture now also has a removed-source template probe. Its fixture-only imports share the runtime factories and affect splitting, so it reaches six files for both CSS mechanisms while the minimal consumer reaches four. The minimal project still contains only the 13 measurement routes and reuses the installed package links. It does not test a packed package installation.

The resource walker follows static and literal dynamic imports. It counts unique external URLs once per route, including reachable imports that may execute later. Counts describe the graph and do not imply that every Motion import is requested immediately. Client chunk SHA256 values bind module provenance to the actual bytes measured.

Gzip uses Node zlib defaults per external resource. Whole-page totals compress actual HTML once, including generated styles and recipe attributes, then add external JavaScript and stylesheets. The JSON also records JavaScript, CSS, HTML and whole-page raw/gzip sizes. recipeData records encoded attribute size with each attribute compressed separately. It is a normalized diagnostic and must not be added to the page total. Headers, latency, Brotli, HTTP cache policy and cross-build cache reuse are excluded.

The following sizes are gzip bytes. A negative page delta means a reduction.

### Full production fixture

| Case | JS files before / after | JS gzip before / after | Page gzip before / after | Page delta |
| --- | ---: | ---: | ---: | ---: |
| one | 5 / 4 | 3051 / 2554 | 4097 / 3778 | -319 |
| four | 12 / 6 | 4539 / 3507 | 6147 / 5430 | -717 |
| ten | 24 / 6 | 6538 / 3507 | 9112 / 6503 | -2609 |
| legacy-21 | 46 / 6 | 10188 / 3507 | 13657 / 7450 | -6207 |
| all | 48 / 6 | 10532 / 3507 | 14089 / 7556 | -6533 |
| repeated | 5 / 4 | 3051 / 2554 | 4221 / 4332 | 111 |
| repeated-all | 48 / 6 | 10532 / 3507 | 14584 / 8305 | -6279 |
| loader | 15 / 15 | 30031 / 30031 | 30531 / 30531 | 0 |
| one-loader | 19 / 18 | 32426 / 31929 | 33563 / 33248 | -315 |
| four-loader | 26 / 20 | 33914 / 32882 | 35592 / 34876 | -716 |
| ten-loader | 38 / 20 | 35913 / 32882 | 38556 / 35951 | -2605 |
| all-loader | 62 / 20 | 39907 / 32882 | 43532 / 37048 | -6484 |
| unused | 0 / 0 | 0 / 0 | 209 / 209 | 0 |

### Minimal production consumer

| Case | JS files before / after | JS gzip before / after | Page gzip before / after | Page delta |
| --- | ---: | ---: | ---: | ---: |
| one | 4 / 3 | 2973 / 2491 | 4019 / 3717 | -302 |
| four | 8 / 4 | 4240 / 3383 | 5847 / 5310 | -537 |
| ten | 14 / 4 | 5780 / 3383 | 8356 / 6381 | -1975 |
| legacy-21 | 25 / 4 | 8555 / 3383 | 12025 / 7328 | -4697 |
| all | 26 / 4 | 8824 / 3383 | 12384 / 7434 | -4950 |
| repeated | 4 / 3 | 2973 / 2491 | 4143 / 4269 | 126 |
| repeated-all | 26 / 4 | 8824 / 3383 | 12880 / 8182 | -4698 |
| loader | 11 / 11 | 27112 / 27112 | 27610 / 27610 | 0 |
| one-loader | 14 / 13 | 29429 / 28947 | 30563 / 30263 | -300 |
| four-loader | 18 / 14 | 30696 / 29839 | 32371 / 31832 | -539 |
| ten-loader | 24 / 14 | 32236 / 29839 | 34879 / 32906 | -1973 |
| all-loader | 36 / 14 | 35280 / 29839 | 38907 / 34005 | -4902 |
| unused | 0 / 0 | 0 / 0 | 209 / 209 | 0 |

The all-22 minimal case saves 5441 JavaScript gzip bytes and 4950 whole-page gzip bytes. The all-22 plus LoaderCircle case saves the same 5441 JavaScript gzip bytes and 4902 whole-page gzip bytes. LoaderCircle alone has identical sizes to the baseline. Unused imports still emit no JavaScript or recipe records.

Twenty CircleDashed instances regress by 126 whole-page gzip bytes in the minimal consumer and 111 bytes in the full fixture. Their JavaScript still shrinks and uses fewer files, but repeating complete attributes adds HTML. Sixty-six instances across all 22 icons still save 4698 whole-page gzip bytes in the minimal consumer and 6279 bytes in the full fixture. These tradeoffs require review; a JavaScript-only saving would hide the repeated-instance regression.

The final isolated measurement reproduced all 26 route payloads and all 18 cache transitions after source formatting and after adding the ClientRouter fixture. Earlier prototypes had different full-fixture sharing boundaries before the explicit registration fixture imports. Those results are not the final comparison.

## Reuse across routes

Warm results model a second document navigation in the same build. Every external URL reached by the first route stays cached without eviction or revalidation. The second HTML document is fetched again, including its recipe attributes. These are set-based calculations, not browser cache or latency measurements.

| Transition | Full new JS files before / after | Full page gzip before / after | Minimal new JS files before / after | Minimal page gzip before / after |
| --- | ---: | ---: | ---: | ---: |
| one to four | 9 / 2 | 3437 / 2876 | 5 / 1 | 3137 / 2819 |
| four to ten | 12 / 0 | 4573 / 2996 | 6 / 0 | 4116 / 2998 |
| ten to all | 24 / 0 | 7551 / 4049 | 12 / 0 | 6604 / 4051 |
| all to one | 0 / 0 | 1046 / 1224 | 0 / 0 | 1046 / 1226 |
| all to all-loader | 14 / 14 | 33000 / 33541 | 10 / 10 | 30083 / 30622 |
| loader to all-loader | 47 / 5 | 13501 / 7017 | 25 / 3 | 11795 / 6893 |
| all-loader to four | 0 / 0 | 1608 / 1923 | 0 / 0 | 1607 / 1927 |
| one to repeated | 0 / 0 | 1170 / 1778 | 0 / 0 | 1170 / 1778 |
| all to repeated-all | 0 / 0 | 4052 / 4798 | 0 / 0 | 4056 / 4799 |

For the minimal consumer, moving from four to ten icons now adds zero JavaScript files instead of six and reduces the second transfer from 4116 to 2998 gzip bytes. Returning from all icons to one reuses JavaScript in both versions, but HTML rises from 1046 to 1226 gzip bytes. Moving from all icons to the same icons plus LoaderCircle keeps ten additional JavaScript files in both versions and adds 539 gzip bytes to the second transfer because recipe data is fetched with HTML again. Repeated-instance transitions also cost more HTML.

## Validation

Run:

```sh
pnpm validate
pnpm inventory:animations --summary --output .artifacts/animation-inventory.json
node --test scripts/register-css.test.mjs scripts/registration-contract.test.mjs scripts/cycle-css.test.mjs scripts/measure-page-loading.test.mjs
```

The final pnpm validate passed in 118.339 seconds. Both Astro checks reported zero errors, warnings and hints. It verified 470 drawings, 944 bundle cases, seven pilot routes, 16 chevron routes, 15 capability routes, 22 recipes across 32 integrated compositions and all 65 Node tests. Routine validation launched no browser.

The shared registration contract compares every serialized record with its source, checks every CSS instance, rejects unused records and static registrations, and detects missing or unused CSS bootstraps and adapters. Entry counts combine selected CSS mechanisms with selected Motion icons. Exact combined-route chunk unions, generated stylesheet selection, active markers and repeated-instance checks remain enforced. Negative tests reject missing records, changed timing, wrong mechanism records, unused recipe data, absent bootstraps, extra adapters, stale module provenance and repeated stylesheet payloads.

The inventory still accounts for 470 exports and 22 CSS recipes. It now follows the shared CSS registration entries instead of the icon-local modules retained for public handle types. The queue remains one supported deferred recipe, five capability candidates, 18 Motion retentions and 424 entries needing review. UserRoundCog and the combined-transform follow-ups remain separate work.

## Browser evidence

Chrome DevTools used Chromium 154. The checks ran against the isolated full production output. The independent minimal-consumer selection check ran in a separate browser context.

- The existing pilot, chevron, capability and Folder controls passed 10062 assertions across 5912 pose snapshots. Maximum Bell angle error was 0.013984397 degrees, chevron translation error was zero, capability matrix error was 0.0007800000000000029, opacity error was zero and Folder entry error was 0.005012785 degrees. Existing tolerances were unchanged.
- All 294 synthetic lifecycle flags passed across the pilot, chevrons and capabilities. These cover parent mouse entry, touch filtering, disabled controls, controlled mode, void methods, interruption cleanup, reconnect and preference stubs. They do not establish real touch behavior.
- Existing independent-template controls and the new removed-source control passed 129 assertions. They cover early and late clones, style recovery and deduplication, return, disconnect, reconnect and nested inert templates. The new nested-template test dispatches a synthetic astro:page-load event. The separate ClientRouter scenario below checks a real route transition.
- DevTools reduced-motion emulation exercised native matchMedia for all 22 CSS icons. All 176 checks passed across entry, preference changes, cancellation, cleanup, static manual playback and restored playback. Operating-system preference changes remain untested.
- A real ClientRouter transition moved from page A with Bell and CalendarDays to page B with previously unknown CircleHelp and CircleDashed tags. A programmatic link click triggered the router. The window token stayed unchanged and the navigation entry count stayed at one. Both new tags registered and passed entry, return and disconnect checks. No new JavaScript resource entries appeared during the transition.
- The minimal four-icon page exposed all four handles, left unused ChevronFirst and LoaderCircle unregistered, and recorded four JavaScript resource entries.

Safari, Firefox, real touch/hybrid hardware, frame pacing and preparation timing remain unverified. All 69 local Markdown targets and anchors resolved. No manual visual acceptance was performed for this loading change. Prior recipe acceptances keep their existing scope.
