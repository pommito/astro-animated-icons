import { expect, test } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

for (const time of [900]) {
  test(`Keyboard resets keys immediately on stop at ${time} ms and replays after stop`, async ({ page }) => {
    await page.goto("/keyboard/");
    await page.waitForFunction(() => !!customElements.get("grave-keyboard"));
    const poses = await page.locator("#controlled grave-keyboard").evaluate((element: HTMLElement & IconHandle, time) => {
      const read = () => [...element.querySelectorAll("[data-key]")].map(key => Number(getComputedStyle(key).opacity));
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const before = read();
      element.stopAnimation();
      const stopped = read();
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 750; });
      return { before, stopped, replay: read() };
    }, time);
    expect(poses.before.some(value => value < 1)).toBe(true);
    expect(poses.stopped).toEqual(Array(8).fill(1));
    expect(poses.replay[0]).toBeCloseTo(0.2, 4);
  });
}

test("Keyboard keeps per-key random delays and explicitly replays repeated starts", async ({ page }) => {
  await page.goto("/keyboard/");
  await page.waitForFunction(() => !!customElements.get("grave-keyboard"));
  const playback = await page.locator("#controlled grave-keyboard").evaluate((element: HTMLElement & IconHandle) => {
    const timings = () => [...element.querySelectorAll("[data-key]")].map(key => {
      const timing = key.getAnimations()[0].effect!.getTiming();
      return { delay: timing.delay, duration: timing.duration, iterations: timing.iterations, direction: timing.direction };
    });
    element.startAnimation();
    const first = timings();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 750; });
    const dimmed = Number(getComputedStyle(element.querySelector("[data-key='0']")!).opacity);
    element.startAnimation();
    const second = timings();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
    const replay = Number(getComputedStyle(element.querySelector("[data-key='0']")!).opacity);
    return { first, second, dimmed, replay, tracks: element.getAnimations({ subtree: true }).length };
  });
  for (const timings of [playback.first, playback.second]) timings.forEach((timing, index) => {
    expect(timing.delay).toBeGreaterThanOrEqual(0);
    expect(timing.delay).toBeLessThanOrEqual(index * 200);
    expect(timing.duration).toBe(1500);
    expect(timing.iterations).toBe(2);
    expect(timing.direction).toBe("alternate");
  });
  expect(playback.first.map(timing => timing.delay)).not.toEqual(playback.second.map(timing => timing.delay));
  expect(playback.dimmed).toBeCloseTo(0.2, 4);
  expect(playback.replay).toBe(1);
  expect(playback.tracks).toBe(8);
});
