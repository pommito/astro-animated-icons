export function paintDelta(property, actual, expected) {
  if (property === "dash" || property === "offset") {
    if (actual === "none" || expected === "none") return actual === expected ? 0 : Infinity;
    const parse = value => [...value.matchAll(/(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(px|%|[a-z]*)/gi)].map(match => [Number(match[1]),match[2].toLowerCase()]);
    const a=parse(actual), b=parse(expected);
    if (!a.length || a.length !== b.length || a.some((value,index)=>value[1]!==b[index][1])) return Infinity;
    return Math.max(...a.map((value,index)=>Math.abs(value[0]-b[index][0])));
  }
  const a=[actual].flat(), b=[expected].flat();
  return a.length === b.length ? Math.max(0,...a.map((value,index)=>Math.abs(value-b[index]))) : Infinity;
}
