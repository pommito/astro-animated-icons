import { opacityTiming, type OpacityPart } from "./opacity-parts";

type Point = [number, number];
function split(points: Point[], t: number) {
  const mix = (a: Point, b: Point): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const [a, b, c] = [mix(points[0], points[1]), mix(points[1], points[2]), mix(points[2], points[3])];
  const [d, e] = [mix(a, b), mix(b, c)];
  const f = mix(d, e);
  return [[points[0], a, d, f], [f, e, c, points[3]]];
}

function globalEaseFrames(timing: ReturnType<typeof opacityTiming>) {
  const [x1, y1, x2, y2] = timing.ease;
  const points: Point[] = [[0, 0], [x1, y1], [x2, y2], [1, 1]];
  const parameter = (offset: number) => {
    if (offset === 0 || offset === 1) return offset;
    let low = 0, high = 1;
    for (let index = 0; index < 40; index++) {
      const middle = (low + high) / 2;
      if (split(points, middle)[0][3][1] < offset) low = middle;
      else high = middle;
    }
    return (low + high) / 2;
  };
  const parameters = timing.times.map(parameter);
  const number = (value: number) => Number(value.toFixed(10));
  return parameters.map((start, index) => {
    const offset = number(split(points, start)[0][3][0] * 100);
    if (index === parameters.length - 1) return { offset, ease: "linear" };
    const end = parameters[index + 1];
    const segment = split(split(points, end)[0], start / end)[1];
    const [a, b, c, d] = segment;
    const controls = [b, c].flatMap(point => [number((point[0] - a[0]) / (d[0] - a[0])), number((point[1] - a[1]) / (d[1] - a[1]))]);
    return { offset, ease: "cubic-bezier(" + controls.join(",") + ")" };
  });
}

export function opacityCSS(id: string, parts: OpacityPart[]) {
  const host = '[data-css-opacity="' + id + '"]';
  return parts.map((part, index) => {
    const entry = opacityTiming(part, false);
    const back = opacityTiming(part, true);
    const name = "grave-opacity-" + id + "-" + index;
    // Motion mini eases the whole effect; CSS eases each keyframe interval.
    const intervals = globalEaseFrames(entry);
    const frames = entry.values.map((value, index) => intervals[index].offset + "%{opacity:" +
      (index === 0 ? "var(--grave-opacity-entry-from," + value + ")" : value) + ";animation-timing-function:" + intervals[index].ease + ";}").join("");
    const timing = (value: typeof entry, ease: string) => "animation-duration:" + value.duration + "s;animation-delay:" + value.delay + "s;animation-timing-function:" + ease + ";animation-fill-mode:both;";
    return "@keyframes " + name + "-entry{" + frames + "}" +
      "@keyframes " + name + "-return{from{opacity:var(--grave-opacity-from);}to{opacity:" + back.values[0] + ";}}" +
      "@media(prefers-reduced-motion:no-preference){" +
      host + '[data-opacity-state="entry"] ' + part.selector + "{animation-name:" + name + "-entry;" + timing(entry, "linear") + "}" +
      host + '[data-opacity-state="return"] ' + part.selector + "{animation-name:" + name + "-return;" + timing(back, "cubic-bezier(" + back.ease.join(",") + ")") + "}}";
  }).join("");
}
