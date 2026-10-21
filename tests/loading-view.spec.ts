import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { loadingView } from "./helpers/loading-view.js";

for (const icon of loadingView.filter(icon => icon.slug === "loader")) {
  test(`${icon.name} stops from its late-cycle angle without normalizing to a different turn`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const result = await page.locator(`#controlled ${icon.tag}`).evaluate((element: HTMLElement & IconHandle, slug) => {
      const duration = 800;
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const angle = () => {
        const shape = element.querySelector<SVGElement>("[data-spin]")!;
        const matrix = new DOMMatrix(getComputedStyle(shape).transform);
        const value = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
        return value < 0 ? value + 360 : value;
      };
      element.startAnimation();
      seek(duration * 3.9);
      const before = angle();
      element.stopAnimation();
      seek(0);
      const stopped = angle();
      seek(100);
      const returning = angle();
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return { before, stopped, returning };
    }, icon.slug);
    expect(result.before).toBeCloseTo(324, 3);
    expect(result.stopped).toBeCloseTo(result.before, 3);
    expect(result.returning).toBeGreaterThan(250);
    expect(result.returning).toBeLessThan(324);
    await expect.poll(() => page.locator(`#controlled ${icon.tag}`).evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });

  test(`${icon.name} cancels its loop on removal, reconnects, and stays static with reduced motion`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const handle = await page.locator(`#controlled ${icon.tag}`).elementHandle();
    const clean = () => handle!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      transform: element.querySelector<SVGElement>("[data-spin]")!.style.transform,
    }));
    await handle!.evaluate((element: HTMLElement & IconHandle) => { element.startAnimation(); element.remove(); });
    expect(await clean()).toEqual({ tracks: 0, transform: "" });
    await page.waitForTimeout(1100);
    expect(await clean()).toEqual({ tracks: 0, transform: "" });
    await page.locator("#secondary").evaluate((control, element) => { element!.removeAttribute("data-controlled"); control.append(element!); }, handle);
    await page.locator("#secondary").hover();
    await expect.poll(() => handle!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(clean).toEqual({ tracks: 0, transform: "" });
    await handle!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await page.waitForTimeout(1100);
    expect(await clean()).toEqual({ tracks: 0, transform: "" });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.mouse.move(0, 0);
    await page.locator("#secondary").hover();
    await expect.poll(() => handle!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    await page.mouse.move(0, 0);
    await expect.poll(clean).toEqual({ tracks: 0, transform: "" });
  });
}

test("CircleDashed restarts its completed staggered fade", async ({ page }) => {
  await page.goto("/circle-dashed/");
  await page.waitForFunction(() => !!customElements.get("grave-circle-dashed"));
  const opacities = await page.locator("#controlled grave-circle-dashed").evaluate(async (element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 250; });
    return [...element.querySelectorAll("path")].map(path => Number(getComputedStyle(path).opacity));
  });
  expect(opacities[0]).toBeGreaterThan(opacities[1]);
  expect(opacities[1]).toBeGreaterThan(opacities[2]);
  expect(opacities.slice(2)).toEqual([0, 0, 0, 0, 0, 0]);
});

for (const icon of loadingView.filter(icon => icon.slug === "loader")) {
  test(`${icon.name} returns without spurious reverse turns just after its loop boundary`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const result = await page.locator(`#controlled ${icon.tag}`).evaluate((element: HTMLElement & IconHandle, slug) => {
      const duration = 800;
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      element.startAnimation();
      seek(duration * 3 + 1);
      element.stopAnimation();
      seek(100);
      const transform = getComputedStyle(element.querySelector("[data-spin]")!).transform;
      const matrix = new DOMMatrix(transform);
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    }, icon.slug);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(40);
    await expect.poll(() => page.locator(`#controlled ${icon.tag}`).evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const time of [500, 501]) {
  test(`FilePenLine keeps its existing finite-repeat stop pose at ${time} ms`, async ({ page }) => {
    await page.goto("/file-pen-line/");
    await page.waitForFunction(() => !!customElements.get("grave-file-pen-line"));
    const controlled = page.locator("#controlled grave-file-pen-line");
    const pose = await controlled.evaluate((element: HTMLElement & IconHandle, time) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const read = () => [...element.querySelectorAll("path")].map(path => getComputedStyle(path).transform);
      element.startAnimation();
      seek(time);
      const before = read();
      element.stopAnimation();
      seek(0);
      const after = read();
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return { before, after };
    }, time);
    expect(pose.after).toEqual(pose.before);
    await expect.poll(() => controlled.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}
