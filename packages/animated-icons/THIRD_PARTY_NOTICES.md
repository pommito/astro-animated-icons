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

FileText uses Lucide geometry and adapts the pinned Lucide Animated FileText recipe. The whole SVG scales to 1.05 over 300 ms with ease-out. Three text paths shrink and redraw over 700 ms, with delays of 300, 500, and 700 ms and ease-out per segment. Native stroke dashes replace normalized path lengths. The upstream x1 and x2 attributes do not affect path geometry. Returning uses a scale spring with stiffness 550, damping 30, mass 1, rest speed 10, and inherited velocity. The text returns over 300 ms without delay. The shared lifecycle cancels delayed tracks on removal or reduced motion.

Bot uses Lucide geometry and adapts the pinned Lucide Animated Bot recipe. Both eyes blink once after a 200 ms delay, over 500 ms with ease-in-out per segment. Centered stroke dashes reproduce y1=13,14,13 and y2=15,14,15 while retaining the round dot at the closed midpoint. Returning uses the upstream default 300 ms tween with cubic Bézier (0.25, 0.1, 0.35, 1), without a delay. It reuses the shared Web Component lifecycle, CSS, and Motion's vanilla browser API.

ArrowUpRight uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowUpRight recipe. The complete arrow scales through 1, 0.85, and 1 while translating through (0, 0), (-4, 4), and (0, 0) in SVG units over 500 ms, with ease-in-out on each segment. The explicit SVG origin (17, 7) matches the upstream group's top-right bounding-box corner. Interrupted return retains velocity and uses the default scale spring (stiffness 550, damping 30) and translation springs (stiffness 500, damping 25). Motion's spring generators are sampled into native transform keyframes.

AttachFile uses the pinned Lucide Animated AttachFile drawing and recipe. After a 100 ms delay, opacity reveals over 100 ms and path length reveals over 400 ms with ease-out. The complete drawing stays visible until stopped. Return uses a 300 ms tween with cubic Bézier (0.25, 0.1, 0.35, 1). Native stroke dash lengths replace normalized path length. The implementation uses Motion's vanilla browser API and the shared Web Component lifecycle.

AudioLines uses Lucide geometry and adapts the pinned Lucide Animated AudioLines recipe. Four inner lines loop with periods of 1.5, 1, 0.8, and 1.5 seconds while the outer lines stay fixed. Native stroke dash lengths and offsets reproduce the source's endpoints and rounded caps. Each half-cycle uses ease-out. Returning uses the default 300 ms path curve. Removal and reduced motion restore the complete normal drawing through the shared lifecycle.

Sources:

- [Lucide Animated AudioLines, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/audio-lines.tsx)
- [Lucide license](https://github.com/lucide-icons/lucide/blob/main/LICENSE)
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
- [Lucide Animated license](https://github.com/pqoqubbw/icons/blob/main/LICENSE)

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

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

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
