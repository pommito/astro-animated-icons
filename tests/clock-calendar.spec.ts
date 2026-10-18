import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { clockCalendarIcons } from "./helpers/clock-calendar.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses, testUpstreamComparison } from "./helpers/upstream-comparison.js";

testIconBehavior(clockCalendarIcons, [50, 300, 950, 1600]);
testUpstreamComparison({
  name: "Clock and calendar", route: "/clock-calendar-comparison/", seekEvent: "clock-calendar-seek",
  tags: clockCalendarIcons.map((icon) => icon.tag),
  times: [0, 50, 100, 150, 200, 299, 301, 400, 599, 601, 800, 1000, 1499, 1501],
});

test("finite clock and calendar returns match the original React components", async ({ page }) => {
  await page.goto("/clock-calendar-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.locator("#play").click();
  await page.waitForTimeout(2000);
  await page.locator("#stop").click();
  await page.waitForTimeout(50);
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "clock-calendar-seek", times: [0, 50, 100, 150, 200, 300, 400, 600, 800, 1500], origin: "svg-center" as const,
  });
  const differences = compareUpstreamPoses(samples.filter((sample) => !sample.icon!.startsWith("alarm-clock")), "return");
  console.log(`Clock and calendar return comparison: ${JSON.stringify(differences)}`);
});

for (const icon of clockCalendarIcons.filter((icon) => icon.slug.startsWith("alarm-clock"))) {
  for (const interruption of ["remove", "reduce"] as const) {
    test(`${icon.name} clears queued spring callbacks and loops after ${interruption}`, async ({ page }) => {
      await page.goto(`/${icon.slug}/`);
      await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
      const element = await page.locator(`#controlled ${icon.tag}`).elementHandle();
      await element!.evaluate((element: HTMLElement & IconHandle) => {
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => {
          if (Number.isFinite(animation.effect!.getTiming().iterations)) animation.finish();
        });
        element.startAnimation();
      });
      await page.waitForTimeout(950);
      expect(await element!.evaluate((element) => element.getAnimations({ subtree: true }).some((animation) => animation.effect!.getTiming().iterations === Infinity))).toBe(true);
      if (interruption === "remove") await element!.evaluate((element) => element.remove());
      else await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(350);
      expect(await element!.evaluate((element) => ({
        animations: element.getAnimations({ subtree: true }).length,
        clean: [...element.querySelectorAll<SVGElement>("g, path, circle")].every((shape) => !shape.style.transform),
      }))).toEqual({ animations: 0, clean: true });
    });
  }
}

test("AlarmClock keeps both oscillations active across loops and stops cleanly", async ({ page }) => {
  await page.goto("/alarm-clock/");
  await page.waitForFunction(() => !!customElements.get("grave-alarm-clock"));
  const icon = page.locator("#controlled grave-alarm-clock");
  await icon.evaluate((element: HTMLElement & { startAnimation(): void }) => element.startAnimation());
  await page.waitForTimeout(950);
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.effect?.getTiming().iterations === Infinity).length)).toBe(6);
  await icon.evaluate((element: HTMLElement & { stopAnimation(): void }) => element.stopAnimation());
  await expect.poll(() => icon.evaluate((element) => ({
    animations: element.getAnimations({ subtree: true }).length,
    clean: [...element.querySelectorAll<SVGElement>("g, path")].every((shape) => !shape.style.transform),
  }))).toEqual({ animations: 0, clean: true });
});

for (const icon of clockCalendarIcons) {
  test(`${icon.name} replays from the current pose during entry and return`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
    const element = page.locator(`#controlled ${icon.tag}`);
    const samples = await element.evaluate((element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause(); animation.currentTime = time;
      });
      const pose = () => [...element.querySelectorAll("g, path, line")].map((shape) => {
        const style = getComputedStyle(shape);
        return [style.transform, style.opacity, style.strokeDasharray];
      });
      element.startAnimation();
      seek(125);
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
      element.stopAnimation();
      return { entry, replayedEntry, returning, replayedReturn };
    });
    expect(samples.replayedEntry).toEqual(samples.entry);
    expect(samples.replayedReturn).toEqual(samples.returning);
    await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}
