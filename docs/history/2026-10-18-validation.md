# Validation timing, 2026-10-18

This records the investigation and implementation of [issue #47](https://github.com/pommito/astro-animated-icons/issues/47).

## Conditions

The baseline is commit `8b2f246b3168292b3010f61ab901dd7c414948d6`, the merge of PR #45. The after revision is the commit containing this record, based on that baseline. The implementation changes validation code and fixtures; it leaves the package's icon and animation sources unchanged.

Measurements ran on macOS 27.0.1, an Apple M1 Pro with 10 logical CPUs and 16 GiB RAM, Node.js 22.20.0, pnpm 12.5.1, Playwright 1.64.1, Astro 7.3.8, and installed Chrome 154.0.8037.98. Commands requested two workers. Playwright used one worker for the focused file and two for the complete suite because files run serially within a worker by default.

Commands ran sequentially with no concurrent validation jobs. Wall times use Python's `time.monotonic()` around each subprocess. Browser runs used `--reporter=dot,json` and a separate `PLAYWRIGHT_JSON_OUTPUT_FILE`. `NO_COLOR=1` was set; Playwright also supplied `FORCE_COLOR`. Test execution time is the interval between the first result's `startTime` and the last result's end, calculated from the JSON report. It excludes fixture preparation and worker startup. Summed test durations are reported separately because tests overlap across workers.

The fixture was already built before the first focused run in both revisions. The baseline rebuilt it anyway. Each revision then ran three consecutive focused invocations against unchanged sources. A separate after run forced a fresh build. Preliminary interrupted runs are excluded from these measurements.

## Focused measurements

Every focused invocation ran the same ten tests in `tests/check.spec.ts`. The ordinary command was `pnpm test tests/check.spec.ts --workers=2 --reporter=dot,json`. The explicit fresh command after the change was `pnpm test:fresh tests/check.spec.ts --workers=2 --reporter=dot,json`.

| Scenario | Before, seconds | After, seconds | Fixture builds before / after |
| --- | ---: | ---: | ---: |
| `pnpm check` | 32.161 | 26.839 | 0 / 0 |
| `pnpm test:build` | 5.518 | 4.101 | 1 / 1 |
| Focused run 1, output already built | 17.517 | 11.040 | 1 / 0 |
| Focused run 2 | 17.476 | 10.547 | 1 / 0 |
| Focused run 3 | 17.506 | 10.775 | 1 / 0 |
| Three consecutive focused runs, 30 tests | 52.499 | 32.362 | 3 / 0 |
| One preparation plus those three runs | 58.017 | 36.463 | 4 / 1 |
| Focused run with a fresh build, ten tests | 17.517 | 13.802 | 1 / 1 |

The mean ordinary focused invocation fell from 17.500 to 10.787 seconds, a 38.4% reduction in these samples. The fresh invocation remains available and builds once. Logs for all three ordinary after runs contain `Reusing fixture: sources and output match.` and no build message. The explicit fresh run contains one build message, followed by reuse when Playwright starts its server.

The focused test execution intervals were 9.319, 9.288, and 9.317 seconds before, and 9.091, 8.649, and 8.878 seconds after. Most of the saved focused time comes from preparation. The comparison uses three focused samples and one complete sample per revision on this machine.

## Complete validation

The baseline total sums the measured serial commands `pnpm check`, `pnpm test:build`, `pnpm inspect:bundle`, `pnpm test:bundle`, and `pnpm test --workers=2 --reporter=dot,json`. The dedicated build supplies the inspector, and the baseline browser command builds again. Focused experiments are excluded from this total.

The after total measures the single command `pnpm validate --workers=2 --reporter=dot,json`. It runs the same checks, adds the three cache tests, and builds once. Its browser step reuses that build. Both totals include type checks and production output, rather than comparing a fresh baseline with an after run that skips those checks.

| Measurement | Before, seconds | After, seconds | Fixture builds before / after |
| --- | ---: | ---: | ---: |
| Browser test execution interval | 815.909 | 427.567 | 0 / 0 during this interval |
| Playwright reported duration, including its server preparation | 824.545 | 429.312 | 1 / 0 |
| Complete validation wall time | 868.048 | 466.709 | 2 / 1 |

Complete validation fell by 46.2% in this comparison. The final output reports `1128 passed (7.2m)`, zero failures, zero skipped tests, and zero flaky tests. Type checks passed with zero diagnostic errors. Bundle inspection reports `Verified 164 icons across 331 bundle cases.` All five inspector tests and all three cache tests passed. The after log contains one fixture build message for complete validation. Its server exits with no lock left behind.

The remaining cost is browser recipe validation. All 1,072 recipe scenarios remain, including interrupted springs, asynchronous phases, loops, and small-size geometry comparisons. Reducing that work needs evidence about individual recipe phases. The fixture build is now about four seconds, less than 1% of complete validation.

## Coverage decisions

The baseline's API, accessibility, and lifecycle suites contain 1,306 of 2,378 browser tests. They account for 726.446 seconds of summed test durations, about 46% of the baseline total. This is test work across both workers, not elapsed validation time. The baseline's complete browser invocation took 825.155 seconds; its test execution interval was 815.909 seconds. All 2,378 tests passed.

The revised shared suites contain seven API tests, 35 accessibility tests, and 14 lifecycle tests. They retain the original assertions against documented representatives. The other 32 suites retain all 1,072 recipe tests with their assertions, interruption times, and timeouts unchanged. The complete suite therefore collects 1,128 browser tests. Its 167 no-JavaScript scenarios cover all 164 exported icons. Check's existing scenario uses the phrase "before JavaScript runs"; it needs no additional test.

The fixture has 526 Astro pages, down from 686. The 160 removed pages only repeated HTML props combinations now covered by four rendering representatives. Type checking still covers the package and all remaining consumer fixtures. Astro reports 524 package files and 668 fixture files after the change, compared with 524 and 828 before it.

Bundle inspection remains exhaustive for the 164 exports and 331 bundle cases. Its original assertions and five negative cases remain intact. The baseline inspector took 0.652 seconds and its negative tests took 4.562 seconds. These costs did not justify another inspector abstraction or a change to the copied-output negative tests.

[The coverage guide](../validation.md) maps the shared representatives and retained recipe phases to their guarantees. All browserless checks continue to run outside Playwright.

## Fixture controls

Three command-level cache tests passed. They verify that unchanged sources and output can be reused, an added fixture input rejects existing output, and altered output rejects the freshness check. Both negative cases restore the files and verify that the original output becomes current again.

The targeted shared run rebuilt after a helper changed and reported `56 passed (21.5s)`. A forced build attempted while that server was active failed with `Fixture is in use`. After correcting shutdown, consecutive browser invocations released their lock and reused output. Playwright sends `SIGTERM` so the fixture process can finish Astro and remove its lock.

A temporary unrelated HTTP server returned 404 on port 45322. `ICON_TEST_PORT=45322 pnpm test tests/arrow-left.spec.ts -g 'without JavaScript' --workers=2 --reporter=dot` failed with `Port 45322 is already in use`. After stopping that server, the same command reported `1 passed`, and a subsequent invocation reused the build and reported `1 passed (3.7s)`. This checks both refusal to fall back to another port and the configurable port used by isolated checkouts.

Chrome was checked. Firefox and Safari were not checked. Numerical geometry checks support manual review; visual acceptance remains with the reviewer.
