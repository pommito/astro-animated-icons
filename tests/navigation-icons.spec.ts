import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { expect, test } from "@playwright/test";
import { testUpstreamComparison } from "./helpers/upstream-comparison.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { navigationIcons } from "./helpers/navigation-icons.js";

testIconBehavior(navigationIcons, [100, 300, 650]);

testUpstreamComparison({
  name: "Navigation", route: "/navigation-comparison/", seekEvent: "navigation-seek",
  tags: navigationIcons.map((icon) => icon.tag),
});

for (const icon of navigationIcons.filter(({ slug }) => slug.startsWith("refresh-") || slug.startsWith("rotate-"))) {
  test(`${icon.name} settles at its held angle and returns from an interrupted spring`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
    const element = page.locator(`#controlled ${icon.tag}`);
    await element.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const angle = await element.locator("g").evaluate((drawing) => {
      const matrix = new DOMMatrix(getComputedStyle(drawing).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
    expect(angle).toBeCloseTo(icon.slug.endsWith("ccw") ? -50 : 50, 3);
    const poses = await element.evaluate((element: HTMLElement & IconHandle) => {
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 100; });
      const before = getComputedStyle(element.querySelector("g")!).transform;
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
      const after = getComputedStyle(element.querySelector("g")!).transform;
      element.stopAnimation();
      return { before, after };
    });
    expect(poses.after).toEqual(poses.before);
    await expect.poll(() => element.evaluate((element) => ({
      tracks: element.getAnimations({ subtree: true }).length,
      transform: element.querySelector<SVGElement>("g")!.style.transform,
    }))).toEqual({ tracks: 0, transform: "" });
  });
}

for (const icon of navigationIcons.filter(({ slug }) => !slug.startsWith("refresh-") && !slug.startsWith("rotate-"))) {
  test(`${icon.name} replays from its current pose during entry and return`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
    const element = page.locator(`#controlled ${icon.tag}`);
    const samples = await element.evaluate((element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause(); animation.currentTime = time;
      });
      const pose = () => [...element.querySelectorAll("path, polyline, line, circle")].map((shape) => {
        const style = getComputedStyle(shape);
        return [style.transform, style.strokeDasharray];
      });
      element.startAnimation();
      seek(100);
      const entry = pose();
      element.startAnimation();
      seek(0);
      const replayedEntry = pose();
      element.stopAnimation();
      seek(100);
      const returning = pose();
      element.startAnimation();
      seek(0);
      const replayedReturn = pose();
      element.stopAnimation();
      return { entry, replayedEntry, returning, replayedReturn };
    });
    expect(samples.replayedEntry).toEqual(samples.entry);
    expect(samples.replayedReturn).toEqual(samples.returning);
    await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}
