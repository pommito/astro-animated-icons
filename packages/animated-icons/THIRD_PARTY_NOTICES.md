# Third-party notices

ArrowLeft uses Lucide geometry derived from Feather. Its motion adapts Lucide Animated's ArrowLeft recipe. The arrowhead translates three SVG units to the right while the shaft shortens, then both return over 400 ms. This implementation animates the shaft's stroke dash instead of morphing its path. The visible endpoints follow the reference and the rounded caps keep their shape. The implementation uses Motion's vanilla browser APIs.

MapPin uses Lucide geometry and adapts Lucide Animated's MapPin recipe. The whole SVG moves through y=0, -5, and -3 px over 500 ms. The inner circle reveals after 300 ms through opacity and stroke dash animations. Native dash lengths represent the source's normalized path length and path offset.

Copy uses Lucide geometry and adapts Lucide Animated's Copy recipe. Its front rectangle translates by -3 on both axes and its back path by +3, using a spring with stiffness 160, damping 17, and mass 1. The shapes hold until stopped, then return with the same spring.

Check uses Lucide geometry derived from Feather and adapts Lucide Animated's Check recipe. Opacity reveals over 100 ms while path length grows from zero to one and scale grows from 0.5 to one over 400 ms. Returning restores the complete drawing over 300 ms with a 100 ms opacity transition. Native stroke dash lengths replace the source's normalized path length, and the path scales around its bounding-box center. All icons use Motion's vanilla browser APIs.

AtSign uses Lucide geometry derived from Feather and adapts Lucide Animated's pinned AtSign recipe. Its circle reveals over 300 ms with a full-length negative dash offset returning to zero. The outer path reveals after a 300 ms delay. Returning restores the circle over 400 ms and preserves the outer path's 300 ms delay and 300 ms duration. Both shapes use a 100 ms opacity transition. Native stroke dash lengths replace normalized path values.

ArrowRight uses Lucide geometry derived from Feather and adapts Lucide Animated's pinned ArrowRight recipe. Its head moves through x=0, -3, and 0 while its shaft shortens from 14 to 9 units and returns in 400 ms. Each segment uses ease-out. Returning uses a 300 ms shaft tween and a head spring with stiffness 500, damping 25, mass 1, and rest speed 10. Native stroke dashes preserve rounded caps. The spring is sampled in SVG units to carry interruption velocity into native keyframes, driven by Motion's vanilla browser API.

Sources:

- [Lucide license](https://github.com/lucide-icons/lucide/blob/main/LICENSE)
- [Lucide Animated MapPin](https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx)
- [Lucide Animated ArrowRight](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-right.tsx)
- [Lucide Animated ArrowLeft](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx)
- [Lucide Animated Copy](https://github.com/pqoqubbw/icons/blob/main/icons/copy.tsx)
- [Lucide Animated Check](https://github.com/pqoqubbw/icons/blob/main/icons/check.tsx)
- [Lucide Animated AtSign](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/at-sign.tsx)
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
