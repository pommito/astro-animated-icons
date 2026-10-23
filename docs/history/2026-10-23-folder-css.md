# Folder CSS conversion

Folder renders the supplied classic Lucide path before JavaScript runs. Its public component uses the existing CSS cycle adapter. The drawing and entry data also drive a fixture-only Motion reference with the previous spring return. Motion does not enter Folder's consumer bundle.

The entry keeps the 400 ms rotation through 0, -4, 3, -2, and 0 degrees with ease-out between keyframes. Replay starts from the displayed angle. Stop returns from that angle over 200 ms with ease-out. This replaces the earlier return with stiffness 500, damping 25, and inherited angular velocity, as authorized by the owner.

The cycle compiler now accepts separate return timing and the folder path selector. Existing cycles retain their entry timing as the default for return. A focused test rejects a return that incorrectly uses Folder's entry duration. Production bundle checks include Folder's generated sheet and its composition with FileText.

## Verification

Commands ran with Node 22.20.0 and pnpm 12.5.1 in the animated-folder worktree.

```sh
rtk node --test scripts/cycle-css.test.mjs
rtk pnpm validate
rtk proxy env FOLDER_RESULT=/tmp/animated-folder-payloads.json node scripts/measure-folder.mjs
rtk proxy env ICON_TEST_PORT=45329 pnpm fixture:serve
rtk git diff --check
```

The focused compiler and stylesheet tests passed. Full validation passed in 106.174 seconds with zero Astro diagnostics, 470 initial drawings, 944 bundle cases, seven CSS pilot routes, and all 31 Node tests. These checks establish initial geometry, catalogue agreement, selected generated CSS, registrations in emitted code, and combined chunk unions.

The separate in-app browser run passed 182 assertions. It compared 32 entry poses at 14, 16, 24, and 28 px against the previous Motion adapter. Maximum angular error was 0.005013 degrees against a 0.03 degree tolerance. The new return matched its declared ease-out curve within 0.0000021 degrees. Checks also covered stop and replay during entry and return, stale completion, completed return, disconnection, clones, parent input, controlled mode, disabled controls, and reduced-motion cleanup.

Pointer and preference tests use synthetic events and a matchMedia stub. Safari, Firefox, real touch or hybrid hardware, native operating-system preference changes, and frame pacing remain unverified. The owner visually accepted the CSS implementation and its 200 ms return on 2026-10-23, then authorized the commit, pull request, and code review. The [Folder comparison](../../tests/fixtures/astro/src/pages/folder-css.astro) remains available for review.

## Payloads

The [recorded results](2026-10-23-folder-css.json) compare references and public components in the same production build. Each route counts unique reachable JavaScript chunks once. The reference shares the drawing and entry data and retains the previous Motion mechanism.

| Composition | Motion raw / gzip bytes | CSS raw / gzip bytes | Gzip bytes saved |
| --- | ---: | ---: | ---: |
| Folder | 71833 / 30340 | 5018 / 2359 | 27981 |
| Folder + FileText | 73207 / 31108 | 19212 / 8838 | 22270 |

Totals include JavaScript and CSS. Gzip uses Node zlib defaults per resource with a cold cache. Inline CSS is compressed separately as an estimate. HTML, HTTP headers, latency, Brotli, and warm caches are excluded. FileText still loads Motion. These measurements establish a smaller payload for the two tested compositions, without establishing smoother animation.
