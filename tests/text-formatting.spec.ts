import { expect, test } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("Bold clears its held stroke width after stop, removal, and reduced motion", async ({ page }) => {
  await page.goto("/bold/");
  await page.waitForFunction(() => !!customElements.get("grave-bold"));
  const icon = await page.locator("#controlled grave-bold").elementHandle();
  const read = (element: Element) => ({ width: getComputedStyle(element.querySelector("path")!).strokeWidth, style: element.querySelector("path")!.getAttribute("style") || "" });
  for (const action of ["stop", "reduce", "remove"] as const) {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => icon!.evaluate(element => getComputedStyle(element.querySelector("path")!).strokeWidth)).toBe("3.5px");
    if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else await icon!.evaluate((element: HTMLElement & IconHandle, action) => { if (action === "remove") element.remove(); else element.stopAnimation(); }, action);
    await expect.poll(() => icon!.evaluate(read)).toEqual({ width: action === "remove" ? "" : "2px", style: "" });
    await page.waitForTimeout(100);
    expect(await icon!.evaluate(read)).toEqual({ width: action === "remove" ? "" : "2px", style: "" });
  }
});

for (const time of [150]) {
  test(`Bold keeps its stroke width continuous on stop at ${time} ms and replay during return`, async ({ page }) => {
    await page.goto("/bold/");
    await page.waitForFunction(() => !!customElements.get("grave-bold"));
    const icon = page.locator("#controlled grave-bold");
    const poses = await icon.evaluate((element: HTMLElement & IconHandle, time) => {
      const read = () => Number.parseFloat(getComputedStyle(element.querySelector("path")!).strokeWidth);
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      element.startAnimation();
      seek(time);
      const before = read();
      element.stopAnimation();
      seek(0);
      const after = read();
      seek(50);
      const returning = read();
      element.startAnimation();
      seek(0);
      const replayed = read();
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return { before, after, returning, replayed };
    }, time);
    expect(poses.before).toBeGreaterThan(2);
    expect(poses.before).toBeLessThan(3.5);
    expect(poses.after).toBe(poses.before);
    expect(poses.returning).toBeGreaterThan(2);
    expect(poses.returning).toBeLessThan(poses.before);
    expect(poses.replayed).toBe(poses.returning);
    await expect.poll(() => icon.evaluate(element => ({ width: getComputedStyle(element.querySelector("path")!).strokeWidth, style: element.querySelector("path")!.getAttribute("style") || "" }))).toEqual({ width: "2px", style: "" });
  });
}
