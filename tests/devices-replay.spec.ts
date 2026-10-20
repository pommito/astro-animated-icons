import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { devices } from "./helpers/devices.js";

for (const icon of devices.filter(icon => icon.slug !== "keyboard")) {
  test(`${icon.name} replays during its return and after a completed return`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const control = page.locator(`#controlled ${icon.tag}`);
    const poses = await control.evaluate((element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => {
        animation.pause(); animation.currentTime = time;
      });
      const read = () => [...element.querySelectorAll<SVGElement>("svg, g, path, circle, rect")].flatMap(shape => {
        const style = getComputedStyle(shape);
        const matrix = new DOMMatrix(style.transform);
        const length = parseFloat(style.strokeDasharray);
        return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f, Number(style.opacity), Number.isNaN(length) ? 1 : length];
      });
      element.startAnimation();
      seek(150);
      element.stopAnimation();
      seek(75);
      const returning = read();
      element.startAnimation();
      seek(0);
      const replay = read();
      seek(100);
      const moving = read();
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return { returning, replay, moving };
    });
    poses.returning.forEach((value, index) => expect(poses.replay[index]).toBeCloseTo(value, 3));
    expect(poses.moving).not.toEqual(poses.replay);
    const clean = (element: Element) => ({
      tracks: element.getAnimations({ subtree: true }).length,
      clean: [...element.querySelectorAll<SVGElement>("svg, g, path, circle, rect")].every(shape => !shape.style.transform && !shape.style.opacity && !shape.style.strokeDasharray),
    });
    await expect.poll(() => control.evaluate(clean)).toEqual({ tracks: 0, clean: true });
    const restarted = await page.evaluate(tag => {
      const primary = document.querySelector<HTMLElement & IconHandle>(`#controlled ${tag}`)!;
      const fresh = document.querySelector<HTMLElement & IconHandle>(`#secondary ${tag}`)!;
      const pose = (element: HTMLElement & IconHandle) => {
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 100; });
        return [...element.querySelectorAll<SVGElement>("svg, g, path, circle, rect")].map(shape => {
          const style = getComputedStyle(shape);
          return [style.transform, style.opacity, style.strokeDasharray];
        });
      };
      const result = { restarted: pose(primary), fresh: pose(fresh) };
      for (const element of [primary, fresh]) {
        element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      }
      return result;
    }, icon.tag);
    expect(restarted.restarted).toEqual(restarted.fresh);
    await expect.poll(() => control.evaluate(clean)).toEqual({ tracks: 0, clean: true });
    await expect.poll(() => page.locator(`#secondary ${icon.tag}`).evaluate(clean)).toEqual({ tracks: 0, clean: true });
  });
}
