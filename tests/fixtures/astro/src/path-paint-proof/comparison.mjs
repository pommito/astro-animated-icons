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

export function poseCoverage(actual, expected) {
  const count = poses => {
    const records = new Map();
    for (const pose of poses) {
      const key = [pose.slug,pose.size,pose.scenario,pose.time].join("/");
      records.set(key,(records.get(key) ?? 0) + 1);
    }
    return records;
  };
  const observed=count(actual), required=count(expected);
  const failures=[];
  for (const key of new Set([...required.keys(),...observed.keys()])) {
    if (required.get(key) !== observed.get(key)) failures.push({key,reason:"pose coverage mismatch",expected:required.get(key) ?? 0,actual:observed.get(key) ?? 0});
  }
  return {failures,counts:{expected:expected.length,actual:actual.length,expectedUnique:required.size,actualUnique:observed.size}};
}
