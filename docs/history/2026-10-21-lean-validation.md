# Browser-free validation verification

Date: October 21, 2026. Base: `feat/common-utilities-icons` at `d1367ee264370ec9eaed3638d794d1cd517c098a`. Implementation branch: `feat/lean-icon-validation`.

## Objective and final behavior

The owner manually reviews every icon. Routine development should automate checks of the package and catalogue while leaving rendering and animation acceptance to that review.

The final workflow removes all browser specs, their shared test helpers, Playwright configuration, and Playwright dependencies. The PR base contains 61 tracked browser spec files. An earlier collection recorded 3,718 browser cases; an intermediate reduction retained 120. The final workflow has zero browser cases.

`pnpm validate` checks package and consumer types, prepares or reuses production output, verifies 811 bundle cases and 404 initial SVG drawings, and runs 11 Node tests for the validation scripts. The Node tests include deliberately broken geometry, wiring, registrations, CSS, fixture inputs, and output. Public icon sources and consumer comparison pages are unchanged from the PR base.

The drawing checker reuses existing family data and sixteen frozen initial drawings captured from unchanged production output. Those sixteen expectations record existing output; they are not independent upstream renders. Catalogue membership must agree with the drawing expectations. The bundle inspector retains its existing assertions for exports, registrations in generated code, shared CSS, selective loading, and combined-route chunk unions.

The current requirements are in [Validation](../validation.md). Manual review uses `pnpm fixture:serve` and the existing comparison pages.

## Final verification

The measured command was `pnpm validate`, on the same host used for the earlier records, with Node 22.20.0 and pnpm 12.5.1. A Python wrapper used `time.perf_counter()` around the command. Production output was already prepared, and the command confirmed that it reused matching sources and output.

| Measurement | Result |
| --- | --- |
| Complete validation, cached build | 76.460 seconds, exit code 0 |
| Node test interval, included in that total | 15.890 seconds, 11 passed, 0 failed |
| Package Astro check | 1,273 files, 0 errors, 0 warnings |
| Consumer Astro check | 1,703 files, 0 errors, 0 warnings |
| Catalogue and bundles | 404 icons across 811 bundle cases |
| Initial SVG and native controls | 404 drawings verified |

Relevant output:

```text
Reusing fixture: sources and output match.
Verified 404 icons across 811 bundle cases.
Selective loading verified: shared CSS only, unused icon behavior excluded.
Verified 404 production drawings and native controls; 404 public exports have recorded drawing baselines.
# tests 11
# pass 11
# fail 0
```

The full log and timing record are generated locally under `.artifacts/browser-free-timed-validation.log` and `.artifacts/browser-free-timing.json`. They are ignored build evidence. An earlier successful run also built all 1,270 pages; Astro reported 11.98 seconds for that build. That figure is the build interval, not the full validation time. A stale build adds preparation cost to the cached result above.

`git diff --check` passed. Inspection confirmed that no browser spec, Playwright configuration, dependency, or executable validation command remains. Dependencies were installed with the frozen lockfile after offline and sandboxed network attempts failed.

## Earlier timing evidence and its limits

The intermediate 120-case browser suite used Playwright 1.64.1, installed Google Chrome, prepared production output, and two workers. Its recorded runs were:

| Execution | Result | Wall time | Playwright interval |
| --- | --- | --- | --- |
| All reduced specs with a 300-second global limit | 111 passed, 9 not validated at the limit | 301.84 seconds | 300.0 seconds |
| Remaining files with a 180-second global limit | 19 passed, including 10 repeated successful cases | 62.08 seconds | 43.5 seconds |

The two batches covered all 120 collected cases through 130 successful executions. Their combined wall time was 363.92 seconds. This records the cost of those experiments, including repeated cases and the first batch's limit. It is not a clean single-run benchmark. The final workflow removes that browser phase entirely.

A complete run of the original 3,718 cases was never measured. The earlier distribution workflow took 296.18 seconds, but it selected only eight browser cases and ran under different load. Its type checks took 180.68 seconds, and unchanged bundle inspection varied between 2.11 and 14.54 seconds across earlier runs. These observations do not support a precise overall speedup percentage.

## Validation boundary

Automated checks establish types, static output, catalogue and bundle relationships, and the validators' rejection behavior. They do not execute custom-element registration, interactions, animation timing, or runtime cleanup. Manual review owns those checks and visual acceptance. No current browser or visual acceptance run is claimed by this record.
