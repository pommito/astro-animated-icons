# CSS template correction verification, 2026-10-23

The [promotion review](https://github.com/pommito/astro-animated-icons/pull/88) found that request-wide CSS deduplication could emit the only stylesheet inside an inert template. Cloning a second template then produced Bell and ChevronRight without active keyframes. The original lifecycle probe cloned a live icon whose stylesheet was already active.

## Reproduction and correction

The new fixture at /css-pilot/templates/ renders two templates containing both public icons. It clones only the second template before and after custom-element registration. Before the correction, 14 checks failed, including entry, return, and reconnection for both icons. After stylesheet recovery was added, mounting the first template later exposed four additional deduplication failures. Both sequences are preserved in the [browser evidence](2026-10-23-css-template-fix-browser.json).

Server styles now carry a recipe marker. The CSS recipe uses an optional connect(host) hook in the existing lifecycle to reconcile active styles when an instance connects. Before playback it also recovers a sheet removed after connection. The same cycleCSS generator supplies server and recovered styles. The document query excludes inert template contents, removes active duplicates, and creates a sheet only when none is active. Motion recipes omit the optional hook and keep their behavior. The shared lifecycle grows by 18 raw JavaScript bytes; LoaderCircle's recipe is unchanged.

The final fixture passes all 25 checks in the in-app browser against the production build. These cover registration order, entry, return, disconnect, reconnect, one active sheet per recipe, and late mounting of the first template. The existing comparison runner also passes 592 assertions across 496 pose comparisons, with a maximum Bell error of 0.0139843972 degrees and zero ChevronRight translation error. All 14 existing synthetic lifecycle probes pass.

## Browser-free validation

Node 22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, frozen lockfile. Commands used the explicit pnpm shell launcher described in the [promotion record](2026-10-23-css-promotion.md).

```sh
rtk proxy node --test scripts/cycle-css.test.mjs
rtk proxy pnpm validate
rtk proxy env ICON_TEST_PORT=45331 pnpm fixture:serve
rtk proxy env PILOT_RESULT=docs/history/2026-10-23-css-template-fix-payload.json node scripts/measure-css-pilot.mjs baseline managed
rtk git diff --check
```

The four focused Node tests pass. They check selected CSS recovery, reuse of an existing server sheet without DOM writes, owning-document isolation, recovery after removal, and reconciliation of duplicate sheets. A negative production test rejects missing server markers. The complete pnpm validate passes in 80.188 seconds, with zero Astro errors and warnings, 404 unchanged drawing baselines, 811 bundle cases, seven parity routes, and 27 Node tests. An earlier run stopped on a wrong type import in the new fixture; that import was corrected before the successful run.

Routine validation remains browser-free. The template fixture and numerical runner are separate browser evidence. No new browser automation dependency or broad browser suite was added.

## Updated payloads

Client recovery requires the common CSS generator in the selected runtime. The following same-build totals supersede the initial promotion measurements for the corrected implementation. They include reachable JavaScript and CSS, count shared chunks once per route, and use Node zlib default gzip separately per resource. HTML, headers, latency, Brotli, and browser caches are excluded. Inline CSS compression remains a normalized estimate because deployment compresses it with HTML.

| Route | Motion reference raw / gzip bytes | Public implementation raw / gzip bytes | Gzip bytes saved |
| --- | ---: | ---: | ---: |
| bell | 26432 / 12139 | 4743 / 2299 | 9840 |
| chevron | 11274 / 5312 | 4767 / 2287 | 3025 |
| loader | 71567 / 30147 | 71567 / 30147 | 0 |
| pair | 27395 / 12817 | 5843 / 2899 | 9918 |
| three | 73484 / 31536 | 75838 / 32274 | -738 |
| repeated | 26432 / 12139 | 4743 / 2299 | 9840 |
| mixed | 27395 / 12763 | 14445 / 6785 | 5978 |

The pair saves 9918 gzip bytes. The pair with LoaderCircle increases the total by 738 gzip bytes. LoaderCircle's shared-runtime change raises its total from 30139 to 30147 gzip bytes; both routes in this build use the same lifecycle. These payloads do not establish smoother animation. Separate JavaScript and CSS figures and reachable chunks are in the [payload JSON](2026-10-23-css-template-fix-payload.json).

## Review and limits

Independent Standards and Spec reviewers re-read the final correction. The original template finding and the late-template deduplication finding are resolved. Both axes report zero remaining findings. Their review was static; the execution evidence above was collected separately by the implementation agent.

The owner's prior visual acceptance covers Bell and ChevronRight's appearance and movement. This correction preserves their cycle data and generated keyframes. The owner subsequently authorized correction, commit, merge, and closure of issue #82 after successful checks. No additional owner visual review is claimed for the isolated-template fixture. Safari, Firefox, real touch or hybrid hardware, and native operating-system reduced-motion behavior remain unverified.
