# Third-party notices

ArrowLeft uses Lucide geometry derived from Feather. Its motion adapts Lucide Animated's ArrowLeft recipe. The arrowhead translates three SVG units to the right while the shaft shortens, then both return over 400 ms. This implementation animates the shaft's stroke dash instead of morphing its path. The visible endpoints follow the reference and the rounded caps keep their shape. The implementation uses Motion's vanilla browser APIs.

MapPin uses Lucide geometry and adapts Lucide Animated's MapPin recipe. The whole SVG moves through y=0, -5, and -3 px over 500 ms. The inner circle reveals after 300 ms through opacity and stroke dash animations. Native dash lengths represent the source's normalized path length and path offset.

Copy uses Lucide geometry and adapts Lucide Animated's Copy recipe. Its front rectangle translates by -3 on both axes and its back path by +3, using a spring with stiffness 160, damping 17, and mass 1. The shapes hold until stopped, then return with the same spring.

Check uses Lucide geometry derived from Feather and adapts Lucide Animated's Check recipe. Opacity reveals over 100 ms while path length grows from zero to one and scale grows from 0.5 to one over 400 ms. Returning restores the complete drawing over 300 ms with a 100 ms opacity transition. Native stroke dash lengths replace the source's normalized path length, and the path scales around its bounding-box center. These icons use Motion's vanilla browser APIs.

ArrowDown uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowDown recipe at commit 4662fff2b60fdcf4751b32013606756caf7c4c26. The head translates through y=0, -3, and 0 while the shaft retracts from 14 to 9 units and back over 400 ms. Native stroke dashes preserve the fixed top endpoint, stroke thickness, and rounded caps. Interrupted returns use the source's default spring for the head and a 300 ms transition for the shaft. Motion's vanilla spring generator supplies native transform keyframes with sampled entry velocity.

Archive uses Lucide geometry and adapts Lucide Animated's Archive recipe pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`. Its lid rises by 1.5 SVG units with stiffness 200 and damping 25. The physics override the declared 200 ms duration. The body and handle morph over 300 ms with Motion's default cubic Bezier curve `[0.25, 0.1, 0.35, 1]`. Entry and return use the same transitions. The vanilla Motion API interpolates the path strings and preserves the lid's velocity during interruption.

AtSign uses Lucide geometry derived from Feather and adapts Lucide Animated's pinned AtSign recipe. Its circle reveals over 300 ms with a full-length negative dash offset returning to zero. The outer path reveals after a 300 ms delay. Returning restores the circle over 400 ms and preserves the outer path's 300 ms delay and 300 ms duration. Both shapes use a 100 ms opacity transition. Native stroke dash lengths replace normalized path values.

ArrowRight uses Lucide geometry derived from Feather and adapts Lucide Animated's pinned ArrowRight recipe. Its head moves through x=0, -3, and 0 while its shaft shortens from 14 to 9 units and returns in 400 ms. Each segment uses ease-out. Returning uses a 300 ms shaft tween and a head spring with stiffness 500, damping 25, mass 1, and rest speed 10. Native stroke dashes preserve rounded caps. The spring is sampled in SVG units to carry interruption velocity into native keyframes, driven by Motion's vanilla browser API.

ArrowUp uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowUp recipe. Its head moves through y=0, 3, and 0 while the shaft's upper endpoint moves from y=5 to y=10 and back in 400 ms. Native stroke dash lengths replace path morphing and retain the fixed lower endpoint and rounded caps. Entry uses the upstream implicit ease-out curve per segment. Interrupted return uses the default transform spring for the head and the default 300 ms path easing for the shaft. It shares the directional animation helper with ArrowLeft and the existing Web Component lifecycle.

ArrowUpLeft uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowUpLeft recipe. Its three paths move as one group through scale 1, 0.85, 1 and translation (0, 0), (4, 4), (0, 0) over 500 ms with ease-in-out. An explicit SVG origin at (7, 7) reproduces the source's top-left fill-box origin. Interrupted return samples Motion's default translation and scale springs with inherited velocity into native transform keyframes.

FileText uses Lucide geometry and adapts the pinned Lucide Animated FileText recipe. The whole SVG scales to 1.05 over 300 ms with ease-out. Three text paths shrink and redraw over 700 ms, with delays of 300, 500, and 700 ms and ease-out per segment. Native stroke dashes replace normalized path lengths. The upstream x1 and x2 attributes do not affect path geometry. Returning uses a scale spring with stiffness 550, damping 30, mass 1, rest speed 10, and inherited velocity. The text returns over 300 ms without delay. The shared lifecycle cancels delayed tracks on removal or reduced motion.

Bot uses Lucide geometry and adapts the pinned Lucide Animated Bot recipe. Both eyes blink once after a 200 ms delay, over 500 ms with ease-in-out per segment. Centered stroke dashes reproduce y1=13,14,13 and y2=15,14,15 while retaining the round dot at the closed midpoint. Returning uses the upstream default 300 ms tween with cubic Bézier (0.25, 0.1, 0.35, 1), without a delay. It reuses the shared Web Component lifecycle, CSS, and Motion's vanilla browser API.

ArrowUpRight uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowUpRight recipe. The complete arrow scales through 1, 0.85, and 1 while translating through (0, 0), (-4, 4), and (0, 0) in SVG units over 500 ms, with ease-in-out on each segment. The explicit SVG origin (17, 7) matches the upstream group's top-right bounding-box corner. Interrupted return retains velocity and uses the default scale spring (stiffness 550, damping 30) and translation springs (stiffness 500, damping 25). Motion's spring generators are sampled into native transform keyframes.

AttachFile uses the pinned Lucide Animated AttachFile drawing and recipe. After a 100 ms delay, opacity reveals over 100 ms and path length reveals over 400 ms with ease-out. The complete drawing stays visible until stopped. Return uses a 300 ms tween with cubic Bézier (0.25, 0.1, 0.35, 1). Native stroke dash lengths replace normalized path length. The implementation uses Motion's vanilla browser API and the shared Web Component lifecycle.

AudioLines uses Lucide geometry and adapts the pinned Lucide Animated AudioLines recipe. Four inner lines loop with periods of 1.5, 1, 0.8, and 1.5 seconds while the outer lines stay fixed. Native stroke dash lengths and offsets reproduce the source's endpoints and rounded caps. Each half-cycle uses ease-out. Returning uses the default 300 ms path curve. Removal and reduced motion restore the complete normal drawing through the shared lifecycle.

Home uses Lucide geometry and adapts Lucide Animated's Home recipe pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`. The outer house stays fixed while the door reveals over 600 ms, with opacity revealing over 200 ms. Entry and return use ease-out and the same durations. Native stroke dash lengths replace normalized path length. Home shares its path reveal mechanism with AttachFile and uses the existing Web Component lifecycle and Motion's vanilla browser API.

The 17 chevron variants adapt Lucide Animated's drawings and recipes at commit `4662fff2b60fdcf4751b32013606756caf7c4c26`. ChevronDown, ChevronLeft, ChevronRight, ChevronUp, and their CircleChevron and SquareChevron variants move two SVG units and return over 500 ms, with the peak at 200 ms and ease-out per segment. Their surrounding circle or square stays fixed. Interrupted returns use a 500 ms ease-out tween from the current pose.

ChevronFirst moves through x=-2, 1, -1, and 0 over 600 ms with offsets 0, 0.3, 0.7, and 1 and ease-in-out per segment. Its vertical bar stays fixed. Return uses a 300 ms ease-out tween. ChevronsDownUp, ChevronsLeftRight, ChevronsRightLeft, and ChevronsUpDown move their two paths by opposing two-unit translations with stiffness 250 and damping 25. They hold their final pose until stopped. Motion's spring generator supplies native keyframes in SVG units and preserves sampled velocity during interruption. All variants reuse the shared lifecycle and reduced-motion behavior.

The 15 Git-related icons adapt Lucide Animated's drawings and recipes at commit `4662fff2b60fdcf4751b32013606756caf7c4c26`. They include FolderGit, FolderGit2, GitBranch, GitCommitHorizontal, GitCommitVertical, GitCompareArrows, GitCompare, GitFork, GitGraph, GitMerge, GitPullRequestClosed, GitPullRequestCreate, GitPullRequest, Github, and Gitlab. Native stroke dash lengths and offsets replace normalized path values. They reuse the shared lifecycle, rendering, CSS, and reduced-motion behavior.

The branch, comparison, fork, graph, merge, and pull-request drawings reveal nodes and edges in 300 ms stages, with delays starting at 100 ms. Edges with a path offset draw from a negative full-length dash offset toward zero. Opacity uses Motion's default 300 ms cubic Bezier `(0.25, 0.1, 0.35, 1)`, independently of the path's ease-out transition. Return uses the default 300 ms curve without delay. GitCompareArrows retains its 400 ms opacity delay on returning arrowheads, as specified by its normal variant. GitPullRequestClosed finishes its final node at 1600 ms.

GitCommitHorizontal, GitCommitVertical, and FolderGit reveal three shapes with 150 ms path delays and 100 ms opacity delays per stage. GitCommitHorizontal and GitCommitVertical use the default 300 ms curve for both properties. FolderGit uses ease-out for the path and the default curve for opacity. FolderGit and FolderGit2 keep their folder outlines fixed. Gitlab reveals its outline over 700 ms after a 100 ms delay; opacity takes 300 ms. Its return uses the default 300 ms transition.

Github reveals and scales its body from 0.9 to 1 over 400 ms. Its tail draws over 500 ms, then rotates through 0, -15, 15, -10, 10, -5, and 5 degrees in a repeating 2500 ms cycle, with ease-in-out per segment. Both paths use their bounding-box centers as transform origins. Stop returns from the current pose over 300 ms with ease-out. Cancellation prevents a queued draw completion from starting another loop.

The Git comparison fixture uses independent native keyframes and normalized stroke lengths, without executing the upstream React components. Browser tests compare entry and interrupted returns at 14, 16, 24, and 28 px. Github's tail angles and loop cancellation are checked separately.

Grip, GripHorizontal, and GripVertical adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26` and use Lucide circle geometry. Grip fades nine circles through opacity 1, 0.3, 0.3, and 1 over 1100 ms at offsets 0, 0.2, 0.8, and 1, with 70 ms between circles and ease-out per segment. GripHorizontal and GripVertical pulse six circles through opacity 1, 0.4, and 1 and scale 1, 0.85, and 1 over 1000 ms with ease-in-out. Their delays are 0, 150, 300, 250, 400, and 550 ms in source order. Each circle scales around its own center. Interrupted returns use a 250 ms ease-out tween without delays. All three restore the drawing after entry and reuse the shared lifecycle, input, and reduced-motion behavior. Replaying restarts the sequence, following this package's playback contract rather than the upstream reentry guard. Motion's vanilla browser API supplies native opacity and transform tracks.

The 24 folder variants adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26` and use Lucide geometry. Native stroke dashes reproduce progressive drawing and path offsets, including separate opacity timings and delayed returns. Native transform keyframes sample the source tweens and springs in SVG units and preserve interruption velocity. FolderHeart, FolderKanban, FolderKey, FolderLock, and FolderRoot loop until stopped. The shared lifecycle restores each initial drawing on disconnection or reduced motion. The comparison fixture at `/folders-comparison/` runs the original React components at 14, 16, 24, and 28 px. Its vendored sources under `tests/fixtures/astro/src/references/folders/` change only the class utility import. React remains a test fixture dependency.

Sun uses the pinned Lucide Animated drawing and recipe. Its eight rays fade in clockwise, each over 300 ms with delays from 100 to 800 ms and Motion's default curve. The center stays visible. Returning restores ray opacity over 300 ms without delay. It reuses the staggered reveal recipe and holds the complete drawing until stopped.

Moon uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated recipe. The drawing rotates through 0, -10, 10, -5, 5, and 0 degrees over 1200 ms with ease-in-out per segment around the SVG center (12, 12). Returning starts from the current pose and uses a 1200 ms ease-in-out tween. Completed playback restores the drawing.

Monitor uses the Lucide drawing pinned to commit `66de90d63e5e26d867a4391bd607fd7a3bbe17fd`, derived from Feather. Lucide Animated has no plain Monitor recipe at the revision used here. This package's recipe reuses the shared blink mechanism: screen opacity moves through 1, 0, and 1 over 600 ms with ease-in-out, while the stand stays fixed. Returning restores screen opacity over 300 ms with Motion's default curve.

Linkedin uses the pinned Lucide Animated drawing and recipe. Its path, rectangle, and circle reveal together over 600 ms with linear path length and reverse-offset transitions. Opacity reveals over 100 ms with Motion's default curve. Returning restores the complete drawing over 400 ms with a 100 ms opacity transition. Native SVG stroke dashes replace normalized path length and offset.

The seven user icons adapt Lucide Animated drawings and recipes pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`: User, UserCheck, UserPlus, UserRoundCheck, UserRoundCog, UserRoundPlus, and Users. They reuse the shared rendering, lifecycle, input, and reduced-motion behavior.

User redraws its head with a reverse stroke offset and a scale spring (stiffness 550, damping 30, rest speed 10). Its body redraws over 400 ms after a 200 ms delay, including on return. UserCheck and UserRoundCheck share a 400 ms ease-in-out check reveal and a 300 ms return with Motion's default curve. UserPlus scales and rotates its plus after 250 ms, with keyframes at 0, 70, and 100 percent of a 450 ms ease-out transition. It returns over 300 ms. The zero-scale entry preserves the pinned recipe.

UserRoundCog rotates its cog by 180 degrees over 300 ms with ease-out. The upstream spring settings are nested inside a second transition object, which selects Motion's fallback tween instead of configuring a spring. This adapter honors the package size prop; the upstream SVG forces 24 px. Users slides its two right-hand paths from x=-6 to zero after 100 ms using stiffness 200 and damping 13. Spring sampling retains velocity during interruption.

UserRoundPlus draws its vertical and horizontal bars after 300 and 600 ms, with 200 ms path transitions and 100 ms opacity transitions. Its upstream normal variant restores only opacity. An interrupted return keeps the partial stroke during that 300 ms opacity transition, then the shared lifecycle restores the complete drawing. The upstream component retains the partial stroke. The comparison fixture runs the pinned React components, with a local class utility import and UserRoundCog dimensions changed to the requested size.

The ten navigation and history icons adapt Lucide Animated drawings and recipes pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`: Login, Logout, RefreshCw, RefreshCcw, RotateCw, RotateCcw, Undo, Redo, UndoDot, and RedoDot. They reuse the common rendering, playback, input, and reduced-motion behavior.

Login and Logout combine the upstream x offset (-2 or 2 units) with a three-keyframe translateX excursion (0, 3, 0 or 0, -3, 0) over 400 ms with ease-out per segment. Their upstream recipes have no normal variant. This adapter returns both translations to zero over 400 ms from the current pose, then clears retained styles. The public Login name follows this package's naming, while the upstream component is named LogInIcon.

RefreshCw, RefreshCcw, RotateCw, and RotateCcw rotate to 50 or -50 degrees with stiffness 250 and damping 25, then hold. They do not loop. The adapter rotates the inner drawing around viewBox center (12, 12), matching the upstream SVG or group rotation. The shared spring sampler preserves pose and velocity when interrupted. Public handle names use the package's Cw and Ccw spelling and correct the upstream RefreshCW handle typo.

Undo, Redo, UndoDot, and RedoDot animate for 600 ms with cubic-bezier(0.25, 0.1, 0.25, 1) per segment. The arrowhead moves by ±2.1 horizontally and -1.4 vertically, rotates by ±12 degrees, then returns. The arc shortens from full length to 80 percent and back. Dot variants scale their dot through 1, 1.2, and 1. SVG stroke dashes replace normalized pathLength. Returns use the same duration and easing from the current pose. Login, Logout, and the four history recipes also begin interrupted replays from the current pose, including the current arc length and dot scale. Their upstream keyframe arrays restart at a fixed initial pose. The comparison fixture runs all ten pinned React components at 14, 16, 24, and 28 px; only their class utility imports point to a local equivalent.

Sources:

- [Lucide Animated FolderGit, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-git.tsx)
- [Lucide Animated FolderGit2, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-git-2.tsx)
- [Lucide Animated GitBranch, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-branch.tsx)
- [Lucide Animated GitCommitHorizontal, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-commit-horizontal.tsx)
- [Lucide Animated GitCommitVertical, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-commit-vertical.tsx)
- [Lucide Animated GitCompareArrows, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-compare-arrows.tsx)
- [Lucide Animated GitCompare, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-compare.tsx)
- [Lucide Animated GitFork, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-fork.tsx)
- [Lucide Animated GitGraph, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-graph.tsx)
- [Lucide Animated GitMerge, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-merge.tsx)
- [Lucide Animated GitPullRequestClosed, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-pull-request-closed.tsx)
- [Lucide Animated GitPullRequestCreate, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-pull-request-create.tsx)
- [Lucide Animated GitPullRequest, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-pull-request.tsx)
- [Lucide Animated Github, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/github.tsx)
- [Lucide Animated Gitlab, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/gitlab.tsx)

- [Lucide Animated Grip, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/grip.tsx)

- [Lucide Animated GripHorizontal, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/grip-horizontal.tsx)

- [Lucide Animated GripVertical, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/grip-vertical.tsx)

- [Lucide Animated Home, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/home.tsx)

- [Lucide Animated AudioLines, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/audio-lines.tsx)
- [Lucide license](https://github.com/lucide-icons/lucide/blob/main/LICENSE)
- [Lucide Animated ArrowUpLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up-left.tsx)

- [Lucide Animated Bot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bot.tsx)
- [Lucide Animated MapPin](https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx)
- [Lucide Animated ArrowRight](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-right.tsx)
- [Lucide Animated ArrowUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up.tsx)
- [Lucide Animated ArrowUpRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up-right.tsx)
- [Lucide Animated ArrowLeft](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx)
- [Lucide Animated Copy](https://github.com/pqoqubbw/icons/blob/main/icons/copy.tsx)
- [Lucide Animated Archive](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/archive.tsx)
- [Lucide Animated Check](https://github.com/pqoqubbw/icons/blob/main/icons/check.tsx)
- [Lucide Animated ArrowDown](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-down.tsx)
- [Lucide Animated AtSign](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/at-sign.tsx)
- [Lucide Animated FileText, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-text.tsx)

- [Lucide Animated AttachFile, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/attach-file.tsx)
- [Lucide Animated ChevronDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-down.tsx)
- [Lucide Animated ChevronFirst, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-first.tsx)
- [Lucide Animated ChevronLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-left.tsx)
- [Lucide Animated ChevronRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-right.tsx)
- [Lucide Animated ChevronUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-up.tsx)
- [Lucide Animated ChevronsDownUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevrons-down-up.tsx)
- [Lucide Animated ChevronsLeftRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevrons-left-right.tsx)
- [Lucide Animated ChevronsRightLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevrons-right-left.tsx)
- [Lucide Animated ChevronsUpDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevrons-up-down.tsx)
- [Lucide Animated CircleChevronDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-chevron-down.tsx)
- [Lucide Animated CircleChevronLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-chevron-left.tsx)
- [Lucide Animated CircleChevronRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-chevron-right.tsx)
- [Lucide Animated CircleChevronUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-chevron-up.tsx)
- [Lucide Animated SquareChevronDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/square-chevron-down.tsx)
- [Lucide Animated SquareChevronLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/square-chevron-left.tsx)
- [Lucide Animated SquareChevronRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/square-chevron-right.tsx)
- [Lucide Animated SquareChevronUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/square-chevron-up.tsx)
- [Lucide Animated FolderArchive, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-archive.tsx)
- [Lucide Animated FolderCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-check.tsx)
- [Lucide Animated FolderClock, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-clock.tsx)
- [Lucide Animated FolderCode, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-code.tsx)
- [Lucide Animated FolderCog, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-cog.tsx)
- [Lucide Animated FolderDot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-dot.tsx)
- [Lucide Animated FolderDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-down.tsx)
- [Lucide Animated FolderHeart, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-heart.tsx)
- [Lucide Animated FolderInput, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-input.tsx)
- [Lucide Animated FolderKanban, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-kanban.tsx)
- [Lucide Animated FolderKey, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-key.tsx)
- [Lucide Animated FolderLock, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-lock.tsx)
- [Lucide Animated FolderMinus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-minus.tsx)
- [Lucide Animated FolderOpen, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-open.tsx)
- [Lucide Animated FolderOutput, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-output.tsx)
- [Lucide Animated FolderPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-plus.tsx)
- [Lucide Animated FolderRoot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-root.tsx)
- [Lucide Animated FolderSync, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-sync.tsx)
- [Lucide Animated FolderTree, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-tree.tsx)
- [Lucide Animated FolderUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-up.tsx)
- [Lucide Animated FolderX, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-x.tsx)
- [Lucide Animated Folders, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folders.tsx)
- [Lucide Animated license](https://github.com/pqoqubbw/icons/blob/main/LICENSE)

- [Lucide Animated Sun, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/sun.tsx)
- [Lucide Animated Moon, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/moon.tsx)
- [Lucide Animated Linkedin, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/linkedin.tsx)
- [Lucide Monitor, pinned drawing](https://github.com/lucide-icons/lucide/blob/66de90d63e5e26d867a4391bd607fd7a3bbe17fd/icons/monitor.svg)

- [Lucide Animated User, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user.tsx)
- [Lucide Animated UserCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-check.tsx)
- [Lucide Animated UserPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-plus.tsx)
- [Lucide Animated UserRoundCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-round-check.tsx)
- [Lucide Animated UserRoundCog, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-round-cog.tsx)
- [Lucide Animated UserRoundPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-round-plus.tsx)
- [Lucide Animated Users, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/users.tsx)

- [Lucide Animated Login, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/login.tsx)
- [Lucide Animated Logout, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/logout.tsx)
- [Lucide Animated RefreshCw, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/refresh-cw.tsx)
- [Lucide Animated RefreshCcw, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/refresh-ccw.tsx)
- [Lucide Animated RotateCw, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/rotate-cw.tsx)
- [Lucide Animated RotateCcw, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/rotate-ccw.tsx)
- [Lucide Animated Undo, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/undo.tsx)
- [Lucide Animated Redo, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/redo.tsx)
- [Lucide Animated UndoDot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/undo-dot.tsx)
- [Lucide Animated RedoDot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/redo-dot.tsx)
- [Lucide Animated Search, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/search.tsx)
- [Lucide Animated Menu, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/menu.tsx)
- [Lucide Animated X, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/x.tsx)
- [Lucide Animated Plus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/plus.tsx)
- [Lucide Animated Settings, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/settings.tsx)
- [Lucide Animated SlidersHorizontal, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/sliders-horizontal.tsx)
- [Lucide Animated Eye, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/eye.tsx)
- [Lucide Animated EyeOff, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/eye-off.tsx)
- [Lucide Animated ExternalLink, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/external-link.tsx)
- [Lucide Animated Link, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/link.tsx)

## Lucide and Feather

ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, user-check, user-plus, users, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Lucide Animated

MIT License

Copyright (c) 2024-2026 pqoqubbw

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
