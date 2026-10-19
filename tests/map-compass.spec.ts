import { expect, test } from "@playwright/test";
import { mapCompassIcons } from "./helpers/map-compass.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { sampleUpstreamPoses, compareUpstreamPoses } from "./helpers/upstream-comparison.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("MapPinPlusInside reveals horizontal before vertical and holds the raised pin", async ({ page }) => {
  await page.goto("/map-pin-plus-inside/");
  await page.waitForFunction(() => !!customElements.get("grave-map-pin-plus-inside"), undefined, { timeout: 5000 });
  const samples = await page.locator("#controlled grave-map-pin-plus-inside").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    return [150, 400, 700, 900].map((time) => {
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      const paths = [...element.querySelectorAll("path")];
      return { y: new DOMMatrix(getComputedStyle(element.querySelector("svg")!).transform).m42,
        symbols: paths.slice(1).map((path) => ({ opacity: Number(getComputedStyle(path).opacity), length: parseFloat(getComputedStyle(path).strokeDasharray) / path.getTotalLength() })) };
    });
  });
  expect(samples[0].symbols.map((shape) => shape.opacity)).toEqual([0, 0]);
  expect(samples[1].symbols[0].opacity).toBe(0);
  expect(samples[1].symbols[1].opacity).toBe(1);
  expect(samples[1].symbols[1].length).toBeGreaterThan(0.5);
  expect(samples[2].symbols[0].opacity).toBe(1);
  expect(samples[2].symbols[0].length).toBeGreaterThan(0.5);
  expect(samples[3].y).toBe(-3);
});


testIconBehavior(mapCompassIcons, [100, 300, 350, 650, 1000]);

for (const icon of mapCompassIcons) {
  test(`${icon.name} plays, holds, and replays its moving transform continuously`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
    const element = page.locator(`#controlled ${icon.tag}`);
    const result = await element.evaluate((element: HTMLElement & IconHandle, compass) => {
      const shape = element.querySelector(compass ? "polygon" : "svg")!;
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      const pose = () => getComputedStyle(shape).transform;
      element.startAnimation();
      seek(100);
      const entry = pose();
      element.startAnimation();
      seek(0);
      const replayedEntry = pose();
      element.stopAnimation();
      seek(75);
      const returning = pose();
      element.startAnimation();
      seek(0);
      const replayedReturn = pose();
      element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      return { entry, replayedEntry, returning, replayedReturn };
    }, icon.slug === "compass");
    expect(result.entry).not.toBe("none");
    expect(result.replayedEntry).toBe(result.entry);
    expect(result.replayedReturn).toBe(result.returning);
    await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    if (icon.slug !== "compass") await expect(element.locator("svg")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
    else await expect(element.locator("circle")).toHaveCSS("transform", "none");
    await element.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
    await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    await expect(element.locator(icon.slug === "compass" ? "polygon" : "svg")).toHaveCSS("transform", "none");
  });
}

test("Map and compass entries match all ten pinned React components at four sizes", async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/map-compass-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), mapCompassIcons.map((icon) => icon.tag));
  await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>("#play")!.click();
    document.dispatchEvent(new CustomEvent("map-compass-seek", { detail: 0 }));
  });
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "map-compass-seek", times: [0, 50, 100, 150, 200, 300, 350, 400, 500, 600, 650, 700, 800, 1000, 1500], origin: "wrapper" as const,
  });
  for (const icon of mapCompassIcons) {
    const poses = samples.filter((sample) => sample.icon === icon.slug && sample.size === "28");
    expect(new Set(poses.map((sample) => JSON.stringify(sample.reference))).size, `${icon.name} reference must move`).toBeGreaterThan(1);
  }
  const result = compareUpstreamPoses(samples);
  expect(errors).toEqual([]);
  console.log(`Map and compass entry: ten original React components at 14, 16, 24 and 28 px; maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)}.`);
});

test("Map and compass completed-pose returns match the pinned React components", async ({ page }) => {
  test.setTimeout(120000);
  await page.goto("/map-compass-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), mapCompassIcons.map((icon) => icon.tag));
  await page.locator("#play").click();
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>("#stop")!.click();
    document.dispatchEvent(new CustomEvent("map-compass-seek", { detail: 0 }));
  });
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "map-compass-seek", times: [0, 25, 50, 75, 100, 150, 200, 300, 400, 650, 1000, 1500], origin: "wrapper" as const,
  });
  const result = compareUpstreamPoses(samples);
  console.log(`Map and compass return: maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)}.`);
});
