import { expect } from "@playwright/test";

interface ComparisonOptions {
  seekEvent: string;
  times: number[];
  origin: "svg" | "wrapper";
}

export function sampleUpstreamPoses({ seekEvent, times, origin }: ComparisonOptions) {
  return times.flatMap((time) => {
    document.dispatchEvent(new CustomEvent(seekEvent, { detail: time }));
    return [...document.querySelectorAll<HTMLTableRowElement>("tr[data-icon]")].map((row) => {
      const pose = (selector: string) => {
        const container = row.querySelector(selector)!;
        const anchor = (origin === "wrapper" ? container.firstElementChild! : container.querySelector("svg")!).getBoundingClientRect();
        return [...container.querySelectorAll<SVGGeometryElement>("path, circle, line, rect")].map((shape) => {
          const box = shape.getBoundingClientRect();
          let opacity = 1;
          let parent: Element | null = shape;
          while (parent && parent !== container) {
            opacity *= Number(getComputedStyle(parent).opacity);
            parent = parent.parentElement;
          }
          const length = Number(shape.getAttribute("pathLength")) || shape.getTotalLength();
          const dash = parseFloat(getComputedStyle(shape).strokeDasharray);
          return [
            box.x - anchor.x, box.y - anchor.y, box.width, box.height, opacity,
            Number.isNaN(dash) ? 1 : dash / length,
            parseFloat(getComputedStyle(shape).strokeDashoffset) / length,
          ];
        });
      };
      return { time, icon: row.dataset.icon, size: row.dataset.size, adapter: pose("[data-adapter]"), reference: pose("[data-reference]") };
    });
  });
}

export function compareUpstreamPoses(samples: ReturnType<typeof sampleUpstreamPoses>, context = "") {
  let maximumGeometry = 0;
  let maximumPaint = 0;
  for (const sample of samples) {
    expect(sample.adapter.length).toBe(sample.reference.length);
    sample.adapter.forEach((shape, index) => shape.forEach((value, coordinate) => {
      const difference = Math.abs(value - sample.reference[index][coordinate]);
      if (coordinate < 4) maximumGeometry = Math.max(maximumGeometry, difference);
      else maximumPaint = Math.max(maximumPaint, difference);
      const tolerance = coordinate < 4 ? 0.03 : 0.005;
      if (difference >= tolerance) {
        expect(difference, `${sample.icon}, ${sample.size}px, ${sample.time}ms, ${context}, shape ${index}, coordinate ${coordinate}`).toBeLessThan(tolerance);
      }
    }));
  }
  expect(maximumGeometry).toBeLessThan(0.03);
  expect(maximumPaint).toBeLessThan(0.005);
  return { maximumGeometry, maximumPaint };
}
