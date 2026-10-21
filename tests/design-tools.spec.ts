import { expect, test } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("ScanText waits for every erase track before starting the staggered redraw", async ({ page }) => {
  await page.goto("/scan-text/");
  await page.waitForFunction(() => !!customElements.get("grave-scan-text"));
  const result = await page.locator("#controlled grave-scan-text").evaluate(async (element: HTMLElement & IconHandle) => {
    const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    element.startAnimation();
    const erase = element.getAnimations({ subtree: true });
    erase.forEach(animation => animation.pause());
    const durations = erase.map(animation => Number(animation.effect!.getComputedTiming().endTime));
    erase.slice(0, 2).forEach(animation => animation.finish());
    await settle();
    const waiting = element.getAnimations({ subtree: true }).filter(animation => !erase.includes(animation)).length;
    erase.slice(2).forEach(animation => animation.finish());
    await settle();
    const redraw = element.getAnimations({ subtree: true }).filter(animation => !erase.includes(animation));
    redraw.forEach(animation => { animation.pause(); animation.currentTime = 150; });
    const lines = [...element.querySelectorAll<SVGElement>("path")];
    return {
      waiting, durations, redraw: redraw.length,
      corners: lines.slice(0, 4).every(path => !path.style.opacity && !path.style.strokeDasharray),
      dashes: lines.slice(4).map(path => parseFloat(getComputedStyle(path).strokeDasharray)),
    };
  });
  expect(result.waiting).toBe(0);
  expect(result.durations.sort()).toEqual([300, 300, 400, 400, 500, 500]);
  expect(result.redraw).toBe(6);
  expect(result.corners).toBe(true);
  expect(result.dashes[0]).toBeGreaterThan(result.dashes[1]);
  expect(result.dashes[1]).toBeGreaterThan(result.dashes[2]);
  expect(result.dashes[2]).toBe(0);
});

for (const phase of [0, 1]) for (const action of ["stop", "replay", "remove", "reduce"] as const) {
  test(`ScanText cancels queued redraw on ${action} during stage ${phase + 1}`, async ({ page }) => {
    await page.goto("/scan-text/");
    await page.waitForFunction(() => !!customElements.get("grave-scan-text"));
    const icon = await page.locator("#controlled grave-scan-text").elementHandle();
    await icon!.evaluate(async (element: HTMLElement & IconHandle, phase) => {
      element.startAnimation();
      if (phase) {
        element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 150; });
    }, phase);
    if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else await icon!.evaluate((element: HTMLElement & IconHandle, action) => {
      if (action === "remove") element.remove();
      else {
        element.stopAnimation();
        if (action === "replay") { element.startAnimation(); element.stopAnimation(); }
      }
    }, action);
    const clean = () => icon!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      clean: [...element.querySelectorAll<SVGElement>("path")].every(path => !path.style.opacity && !path.style.strokeDasharray && !path.style.strokeDashoffset),
    }));
    await expect.poll(clean).toEqual({ tracks: 0, clean: true });
    await page.waitForTimeout(1100);
    expect(await clean()).toEqual({ tracks: 0, clean: true });
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    if (action === "remove") {
      await page.locator("#secondary").evaluate((control, icon) => { icon!.removeAttribute("data-controlled"); control.append(icon!); }, icon);
      await page.locator("#secondary").hover();
      await expect.poll(() => icon!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
      await page.mouse.move(0, 0);
      await expect.poll(clean).toEqual({ tracks: 0, clean: true });
    }
  });
}
