import { expect, test } from "@playwright/test";

interface ComparisonOptions {
  seekEvent: string;
  times: number[];
  origin: "svg" | "svg-center" | "wrapper";
}

export function sampleUpstreamPoses({ seekEvent, times, origin }: ComparisonOptions) {
  return times.flatMap((time) => {
    document.dispatchEvent(new CustomEvent(seekEvent, { detail: time }));
    return [...document.querySelectorAll<HTMLTableRowElement>("tr[data-icon]")].map((row) => {
      const pose = (selector: string) => {
        const container = row.querySelector(selector)!;
        const anchor = (origin === "wrapper" ? container.firstElementChild! : container.querySelector("svg")!).getBoundingClientRect();
        const originX = anchor.x + (origin === "svg-center" ? anchor.width / 2 : 0);
        const originY = anchor.y + (origin === "svg-center" ? anchor.height / 2 : 0);
        return [...container.querySelectorAll<SVGGeometryElement>("path, circle, line, rect, polyline")].map((shape) => {
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
            box.x - originX, box.y - originY, box.width, box.height, opacity,
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

interface Comparison {
  name: string;
  route: string;
  seekEvent: string;
  tags: string[];
  times?: number[];
}

export function testUpstreamComparison({ name, route, seekEvent, tags, times = [0, 50, 100, 150, 200, 300, 400, 600, 800, 1000, 1500] }: Comparison) {
  test(`${name} adapters match the original React components at small sizes`, async ({ page }) => {
    test.setTimeout(60000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), tags);
    await page.locator("#play").click();
    await page.waitForTimeout(100);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent,
      times,
      origin: "svg-center" as const,
    });
    const { maximumGeometry, maximumPaint } = compareUpstreamPoses(samples);
    expect(errors).toEqual([]);
    console.log(
      `${name} comparison: ${tags.length} original React components at 14, 16, 24, and 28 px; maximum geometry difference ${maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${maximumPaint.toFixed(6)}.`,
    );
  });
}
