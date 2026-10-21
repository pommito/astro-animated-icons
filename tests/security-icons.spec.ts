import { expect, test, type Page } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("ScanFace completes its hidden phase before returning and cancels the queued phase on removal", async ({ page }) => {
  await page.goto("/scan-face/");
  await page.waitForFunction(() => !!customElements.get("grave-scan-face"));
  const icon = page.locator("#controlled grave-scan-face");
  const instance = await icon.elementHandle();
  const hidden = await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 200; });
    return Number(getComputedStyle(element.querySelector("path")!).opacity);
  });
  expect(hidden).toBeLessThan(0.3);
  await icon.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("path").first()).toHaveCSS("opacity", "1");
  await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.remove();
  });
  await page.waitForTimeout(800);
  expect(await instance!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});
