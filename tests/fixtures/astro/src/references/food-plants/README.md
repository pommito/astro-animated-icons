# Pinned food and plant references

These ten React components come from `pqoqubbw/icons` revision `4662fff2b60fdcf4751b32013606756caf7c4c26`. The archive at `/tmp/astro-icons-upstream-20261020.tar.gz` supplied the original files. Each component executes through the existing `mountReferences` and reference playback helpers.

The copies redirect `@/lib/utils` to `../utils`. Soup also replaces its hard-coded `height="24"` and `width="24"` with `height={size}` and `width={size}`. This lets the comparison execute the original animation at 14, 16, 24, and 28 px. Animation variants, transition settings, geometry, event handlers, and playback handles remain unchanged.

The adapter honors Soup's package `size` prop. CookingPot follows Motion's actual group origins. Motion replaces the declared `12px 16px` and `18px 6px` origins with `50% 50%` and `transform-box: fill-box`. The reference keeps the original declarations so the renderer applies that behavior itself.

The comparison samples entry and captured returns through geometry, computed opacity, and normalized stroke dashes. Captured returns reset velocity. The comparison does not establish equality of real interrupted spring velocity. At an exact loop boundary, Motion's JavaScript transform sampler retains the preceding endpoint while native animation starts the next iteration. Steam and bubbles are fully transparent there. Geometry comparisons sample either side of those boundaries; dedicated checks observe the invisible boundary itself. Numerical evidence supports manual visual review.
