import { expect, test } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

for (const subject of [
  { slug: "ambulance", selector: "[data-body]", period: 400, scale: 1, opacity: 1, length: 1 },
  { slug: "ambulance", selector: "[data-cross]", period: 600, scale: 1, opacity: 1, length: 1 },
  { slug: "ambulance", selector: "[data-speed='0']", period: 500, scale: 0.2, opacity: 0, length: 1 },
  { slug: "brain", selector: "svg", period: 1400, scale: 1, opacity: 1, length: 1 },
  { slug: "brain", selector: "[data-part='0']", period: 1400, scale: 1, opacity: 1, length: 1 },
  { slug: "biceps-flexed", selector: "[data-part=path-1]", period: 2000, scale: 1, opacity: 1, length: 1 },
]) {
  test(`${subject.slug} restores the original cycle after an interrupted replay of ${subject.selector}`, async ({ page }) => {
    await page.goto(`/${subject.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${subject.slug}`);
    const poses = await page.locator(`#controlled grave-${subject.slug}`).evaluate(async (element: HTMLElement & IconHandle, subject) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      element.startAnimation();
      seek(137);
      element.startAnimation();
      const bridge = element.getAnimations({ subtree: true });
      const finite = bridge.filter(animation => Number.isFinite(animation.effect!.getComputedTiming().endTime));
      finite.forEach(animation => animation.finish());
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const read = (time: number) => {
        seek(time);
        const style = getComputedStyle(element.querySelector(subject.selector)!);
        const matrix = new DOMMatrix(style.transform);
        const dash = parseFloat(style.strokeDasharray);
        return { scale: matrix.a, x: matrix.e, y: matrix.f, opacity: Number(style.opacity), length: Number.isNaN(dash) ? 1 : dash, offset: parseFloat(style.strokeDashoffset) };
      };
      const loops = element.getAnimations({ subtree: true }).filter(animation => !Number.isFinite(animation.effect!.getComputedTiming().endTime)).length;
      return { bridge: finite.length, loops, first: read(0), middle: read(subject.period / 4), later: read(subject.period * 3) };
    }, subject);
    expect(poses.bridge).toBeGreaterThan(0);
    expect(poses.loops).toBeGreaterThan(0);
    expect(poses.middle).not.toEqual(poses.first);
    for (const pose of [poses.first, poses.later]) {
      expect(pose.scale).toBeCloseTo(subject.scale, 5);
      expect(pose.x).toBeCloseTo(0, 5);
      expect(pose.y).toBeCloseTo(0, 5);
      expect(pose.opacity).toBeCloseTo(subject.opacity, 5);
      expect(pose.length).toBeCloseTo(subject.length, 5);
      expect(pose.offset).toBeCloseTo(0, 5);
    }
  });
}

for (const slug of ["ambulance"]) for (const action of ["stop", "remove", "reduce"] as const) {
  test(`${slug} cancels the pending original loop after ${action} during a replay bridge`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
    await icon!.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 137; });
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 75; });
    });
    if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else await icon!.evaluate((element: HTMLElement & IconHandle, action) => {
      if (action === "remove") element.remove(); else element.stopAnimation();
    }, action);
    const clean = () => icon!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      drawing: [...element.querySelectorAll<SVGElement>("svg, g, path, circle, line")].every(shape => !shape.style.transform && !shape.style.opacity && !shape.style.strokeDasharray && !shape.style.strokeDashoffset && !shape.style.strokeWidth),
    }));
    await expect.poll(clean).toEqual({ tracks: 0, drawing: true });
    await page.waitForTimeout(2500);
    expect(await clean()).toEqual({ tracks: 0, drawing: true });
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}
