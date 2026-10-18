import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

for (const slug of ["calendar-check", "calendar-check-2", "timer"]) {
  test(`${slug} replays its source keyframes after completed playback`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction((slug) => !!customElements.get(`grave-${slug}`), slug);
    const icon = page.locator(`#controlled grave-${slug}`);
    await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const samples = await icon.evaluate((element: HTMLElement & IconHandle, slug) => {
      element.startAnimation();
      return [0, 200].map((time) => {
        element.getAnimations({ subtree: true }).forEach((animation) => {
          animation.pause(); animation.currentTime = time;
        });
        const shape = element.querySelector(slug === "timer" ? "line" : "path:last-child")!;
        const style = getComputedStyle(shape);
        return slug === "timer" ? new DOMMatrix(style.transform).a : Number(style.opacity);
      });
    }, slug);
    expect(samples[0]).toBeCloseTo(slug === "timer" ? 0.9 : 0, 5);
    expect(samples[1]).toBeGreaterThan(samples[0]);
    expect(samples[1]).toBeLessThan(1);
  });
}
