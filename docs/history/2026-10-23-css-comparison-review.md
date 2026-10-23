# CSS comparison review controls

The CSS comparison pages used browser defaults and placed their only playback controls above a long list. Reviewers lost the controls after scrolling and could not replay lower icons without returning to the top.

Bell/ChevronRight, chevron and capability comparison pages now share `ComparisonPage.astro`, `ComparisonSection.astro`, a review stylesheet and fixture-only input code. A sticky toolbar keeps Play all and Stop all visible. Each icon has Play pair and Stop pair controls for all four sizes. Mouse entry into one size row plays both implementations; leaving the row starts their return. Touch does not trigger that hover path. Numerical comparisons suppress local and row playback while their runner is active.

The table separates the Motion reference from the tinted CSS column. Native details keep numerical checks available without placing their output between the playback controls and the samples. The native SVG dimensions, drawing and animation recipes are unchanged.

## Verification

`rtk pnpm validate` passed in 109.386 seconds with zero type diagnostics, 404 drawings, 811 bundle cases, 31 integrated compositions and all 49 Node tests. Existing pilot, chevron and capability checks passed too. No browser ran inside that command.

A separate measurement command recomputed all 31 compositions in both modes with `measureMigration()`. Every JavaScript, CSS, HTML and whole-page raw/gzip field matched [the integrated payload record](2026-10-23-css-migration-payloads.json). Review assets do not change those consumer payloads.

In the in-app Chromium 155 browser, the toolbar stayed at viewport y=0 after 2592.5 px of scrolling. CircleDashed's local play control set entry on its four controlled sizes while FolderDown samples stayed at rest. A native pointer entry into the 24 px row triggered its CSS entry; moving out of the previous row triggered its return. The reloaded chevron page has 13 local control groups and a sticky toolbar.

At a 390 by 844 viewport, the document width was 375 px, with the reserved scrollbar gutter. Both global buttons fit, and the toolbar remained within y=0 to 72 px. The temporary viewport override was reset. Both existing review tabs were reloaded.

The capability comparator still passed 4452 assertions and 2108 pose comparisons. Its 98 synthetic lifecycle checks passed. Maximum matrix error remained 0.00078 and opacity error remained zero. [The browser record](2026-10-23-css-comparison-review-browser.json) preserves those results. The other two numerical browser runners were not rerun for this fixture presentation change. Safari, Firefox and real touch hardware were not checked. Owner visual acceptance remains pending.
