import { chartIcons } from "./helpers/chart-icons.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { sampleUpstreamPoses, compareUpstreamPoses } from "./helpers/upstream-comparison.js";
import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

testIconBehavior(chartIcons, [100, 300, 650, 1000]);

test("ChartLine uses separate delays for the stroke and opacity", async ({ page }) => {
  await page.goto("/chart-line/");
  const icon = page.locator("#controlled grave-chart-line");
  await expect(icon).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-chart-line"));
  const pose = await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 125; });
    const style = getComputedStyle(element.querySelectorAll("path")[1]);
    return { opacity: Number(style.opacity), stroke: parseFloat(style.strokeDasharray) };
  });
  expect(pose.opacity).toBeGreaterThan(0);
  expect(pose.opacity).toBeLessThan(1);
  expect(pose.stroke).toBe(0);
});

test("ChartBarDecreasing hides every bar before the staggered redraw", async ({ page }) => {
  await page.goto("/chart-bar-decreasing/");
  const icon = page.locator("#controlled grave-chart-bar-decreasing");
  await expect(icon).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-chart-bar-decreasing"));
  const samples = await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const seek = (time: number) => {
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      return [...element.querySelectorAll("path")].map(path => Number(getComputedStyle(path).opacity));
    };
    return { before: seek(0), middle: seek(500), redraw: seek(650), end: seek(1000) };
  });
  expect(samples.before).toEqual([1, 1, 1, 1]);
  expect(samples.middle).toEqual([1, 0, 0, 0]);
  expect(samples.redraw[3]).toBeGreaterThan(samples.redraw[1]);
  expect(samples.redraw[1]).toBeGreaterThan(samples.redraw[2]);
  expect(samples.end).toEqual([1, 1, 1, 1]);
});

test("ChartScatter fades every point out before revealing points in source order", async ({ page }) => {
  await page.goto("/chart-scatter/");
  const icon = page.locator("#controlled grave-chart-scatter");
  await expect(icon).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-chart-scatter"));
  const samples = await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const seek = (time: number) => {
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      return [...element.querySelectorAll("circle")].map(point => Number(getComputedStyle(point).opacity));
    };
    return { middle: seek(200), reveal: seek(350), end: seek(1100) };
  });
  expect(samples.middle).toEqual([0, 0, 0, 0, 0]);
  expect(samples.reveal[0]).toBeGreaterThan(0);
  expect(samples.reveal.slice(1)).toEqual([0, 0, 0, 0]);
  expect(samples.end).toEqual([1, 1, 1, 1, 1]);
});

test("ChartPie holds the separated sector and returns it to rest", async ({ page }) => {
  await page.goto("/chart-pie/");
  const icon = page.locator("#controlled grave-chart-pie");
  await expect(icon).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-chart-pie"));
  const sector = icon.locator("path").first();
  const rest = (await sector.boundingBox())!;
  await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  const held = (await sector.boundingBox())!;
  expect(held.x - rest.x).toBeCloseTo(1.1 * 28 / 24, 2);
  expect(held.y - rest.y).toBeCloseTo(-1.1 * 28 / 24, 2);
  await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
  await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  expect((await sector.boundingBox())!.x).toBeCloseTo(rest.x, 3);
  expect((await sector.boundingBox())!.y).toBeCloseTo(rest.y, 3);
});


test("all chart adapters match the pinned React components in both phases at small sizes", async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const ready = async () => {
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), chartIcons.map(icon => icon.tag));
  };
  await page.goto("/charts-comparison/");
  await ready();
  await page.locator("#play").click();
  await page.waitForTimeout(75);
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "charts-seek", times: [0, 50, 100, 125, 150, 200, 300, 400, 450, 600, 800, 1000, 1500], origin: "svg" as const,
  });
  const entry = compareUpstreamPoses(samples.filter(sample =>
    sample.icon === "chart-scatter" ? sample.time <= 150 :
    sample.icon === "chart-pie" || sample.icon === "chart-line" || sample.icon === "chart-spline" ? true : sample.time <= 450,
  ), "entry");
  await page.reload();
  await ready();
  await page.locator("#play").click();
  await page.waitForTimeout(75);
  await page.evaluate(() => document.dispatchEvent(new Event("charts-redraw")));
  await page.waitForFunction(() => document.body.dataset.redrawReady === "true");
  const revealSamples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "charts-redraw-seek", times: [0, 50, 100, 150, 200, 300, 400, 600, 900], origin: "svg" as const,
  });
  const reveal = compareUpstreamPoses(revealSamples.filter(sample =>
    sample.icon !== "chart-pie" && sample.icon !== "chart-line" && sample.icon !== "chart-spline",
  ), "redraw");
  expect(errors).toEqual([]);
  console.log("Chart comparison: ten pinned React components at 14, 16, 24 and 28 px; maximum geometry difference " +
    Math.max(entry.maximumGeometry, reveal.maximumGeometry).toFixed(6) + " screen pixels, maximum normalized paint difference " +
    Math.max(entry.maximumPaint, reveal.maximumPaint).toFixed(6) + ".");
});
