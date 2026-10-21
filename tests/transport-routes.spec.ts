import { expect, test } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

for (const interruption of ["stop", "remove", "reduce"] as const) {
  for (const phase of ["entry", "return"] as const) {
    test(`Rocket cancels its morph and JS frame work after ${interruption} during ${phase}`, async ({ page }) => {
      await page.clock.install({ time: 0 });
      await page.clock.pauseAt(1000);
      await page.addInitScript(() => {
        const request = window.requestAnimationFrame;
        Object.assign(window, { observedFrames: 0 });
        window.requestAnimationFrame = callback => request(time => {
          (window as typeof window & { observedFrames: number }).observedFrames++;
          callback(time);
        });
      });
      await page.goto("/rocket/");
      await page.waitForFunction(() => !!customElements.get("grave-rocket"), null, { polling: 10 });
      const icon = await page.locator("#controlled grave-rocket").elementHandle();
      const read = (element: Element) => element.querySelector("path")!.getAttribute("d");
      const idle = await icon!.evaluate(read);
      for (let cycle = 0; cycle < 3; cycle++) {
        await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
        await page.clock.runFor(200);
        await icon!.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
        await page.clock.runFor(32);
      }
      await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
      await page.clock.runFor(6800);
      expect(await icon!.evaluate(read)).not.toBe(idle);
      expect(await page.locator("#secondary").evaluate(read)).toBe(idle);
      if (phase === "return") {
        const poses = await icon!.evaluate((element: HTMLElement & IconHandle) => {
          const before = element.querySelector("path")!.getAttribute("d");
          element.stopAnimation();
          return { before, after: element.querySelector("path")!.getAttribute("d") };
        });
        expect(poses.after).toBe(poses.before);
        await page.clock.runFor(64);
      }
      if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
      else await icon!.evaluate((element: HTMLElement & IconHandle, interruption) => {
        if (interruption === "remove") element.remove(); else element.stopAnimation();
      }, interruption);
      await page.clock.runFor(1600);
      expect(await icon!.evaluate(read)).toBe(idle);
      const frames = await page.evaluate(() => (window as typeof window & { observedFrames: number }).observedFrames);
      await page.clock.runFor(14000);
      expect(await page.evaluate(() => (window as typeof window & { observedFrames: number }).observedFrames)).toBe(frames);
      expect(await icon!.evaluate(read)).toBe(idle);
      if (interruption === "reduce") {
        await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
        await page.clock.runFor(400);
        expect(await icon!.evaluate(read)).toBe(idle);
      }
      if (interruption === "remove") {
        await page.locator("#secondary").evaluate((control, icon) => { icon!.removeAttribute("data-controlled"); control.append(icon!); }, icon);
        await page.locator("#secondary").dispatchEvent("pointerenter", { pointerType: "mouse" });
        await page.clock.runFor(400);
        expect(await icon!.evaluate(read)).not.toBe(idle);
        await page.locator("#secondary").dispatchEvent("pointerleave", { pointerType: "mouse" });
        await page.clock.runFor(1600);
        expect(await icon!.evaluate(read)).toBe(idle);
      }
    });
  }
}
