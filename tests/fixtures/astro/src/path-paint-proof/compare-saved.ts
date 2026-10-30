import { paintDelta, poseCoverage } from "./comparison.mjs";

export function compareSavedPaint(baseline: any, actual: any) {
  const expected = new Map(baseline.poses.map((pose: any) => [[pose.slug,pose.size,pose.scenario,pose.time].join("/"),pose]));
  const coverage=poseCoverage(actual.poses,baseline.poses);
  const failures: unknown[] = [...actual.failures,...coverage.failures];
  const maximum = { dash: 0, offset: 0, opacity: 0, matrix: 0 };
  let compared = 0;
  for (const pose of actual.poses) {
    const key = [pose.slug,pose.size,pose.scenario,pose.time].join("/");
    const saved: any = expected.get(key);
    if (!saved || saved.shapes.length !== pose.shapes.length) { failures.push({ key, reason: "missing pose or shape" }); continue; }
    pose.shapes.forEach((shape: any, index: number) => {
      const previous = saved.shapes[index];
      for (const [property, category, tolerance] of [["dash","dash",.005],["offset","offset",.005],["opacity","opacity",.001],["matrix","matrix",.005]] as const) {
        const error = paintDelta(property,shape[property],previous[property]);
        maximum[category] = Math.max(maximum[category],error);
        if (error > tolerance) failures.push({ key,index,property,error,actual:shape[property],expected:previous[property] });
      }
      if (shape.origin !== previous.origin) failures.push({key,index,property:"origin",actual:shape.origin,expected:previous.origin});
      compared++;
    });
  }
  return { userAgent: navigator.userAgent,
    tolerances: { dash:.005,offset:.005,opacity:.001,matrix:.005 }, coverage:coverage.counts, poses:actual.poses.length, shapes:compared, maximum, checks:actual.checks, failureCount:failures.length, failures:failures.slice(0,100) };
}
