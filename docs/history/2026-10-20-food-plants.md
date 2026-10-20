# Food and plant icon verification

This batch adds Banana, Coffee, CookingPot, CupSoda, Soup, LeafyGreen, Leaf, TreeDeciduous, TreePine, and FishSymbol from Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

The isolated checkout is `/private/tmp/astro-food-plants-20261020-45404` on `feat/food-plants-icons`. Its base is `00a7f5189119251da6dc2621391b5dbb27b88fcd`. The repository moved to `/Users/victor/Developer/products/astro-animated-icons`. The app's managed worktree call failed with `Git ref lookup failed`, so this batch used a normal Git worktree from the actual repository path. The shared checkout was not edited.

## Implementation and comparison

Each icon has its own Astro adapter, recipe, Web Component registration, public component and handle exports, consumer fixture, and single-icon and combined bundle routes. Coffee and Soup share a steam recipe. Leaf and LeafyGreen share Feather's drift recipe. Existing SVG-parts handles separate transform and paint tracks, implicit spring returns, finite-track completion, and interrupted replay.

CupSoda's bubbles start hidden in server-rendered SVG and return to that state after cleanup. Its SVG retains viewport clipping through an internal `Icon.astro` option. That option does not change the public icon props. Existing consumer routes retain shared CSS.

The comparison route is `http://127.0.0.1:45404/food-plants-comparison/`. It executes the ten original pinned React components at 14, 16, 24, and 28 px with the existing reference runner. The source copies redirect their class utility import. Soup's fixed dimensions use the supplied size in the fixture. The adapter honors the package's size contract. CookingPot follows the fill-box centers Motion actually applies rather than the group origins declared in the source.

The browser suite compares entry and captured returns interrupted at 150, 700, and 1600 ms. Samples include steam delays, bubble delays, straw completion, wave motion, and either side of repeat boundaries. Separate assertions check full transparency at the exact steam and bubble repeat boundaries. The JavaScript reference and native adapter choose different transform endpoints at those fully transparent instants. Captured returns reset spring velocity. The measurements do not establish real interrupted spring velocity parity. Numerical evidence supports the user's manual visual review.

## Validation evidence

All browser commands use `ICON_TEST_PORT=45404` and at most two workers. Chrome is the checked browser. Safari and Firefox remain unverified.

The initial test-first Coffee scenario requested `/coffee/` before implementation. It failed with expected status 200 and observed status 404. After implementing Coffee, the same test passed. It checks the cup's four paths, six infinite native tracks, and delays of 0, 40, and 80 ms.

The first comparison found CookingPot's origin mismatch. Inspection of the executing React groups showed `transform-origin: 50% 50%` and `transform-box: fill-box`. The adapter now uses those actual origins. Separate measurements identified the fully transparent loop-boundary endpoint difference, which the comparison documents and tests through opacity at the boundary and geometry on either side.

The shell's pnpm launcher initially worked, then pointed to an incomplete global shim. Commands use the existing Homebrew pnpm 12.5.1 with Node 22.20.0 through a local `PATH` override. No global configuration was changed. One fixture startup exceeded the existing 60000 ms server timeout under machine contention. A subsequent run found its abandoned lock. The recorded PID no longer existed, so the stale lock was removed before retrying with one worker. Assertions and repository timeouts were not changed.

Final validation and review results will be recorded after completion.
