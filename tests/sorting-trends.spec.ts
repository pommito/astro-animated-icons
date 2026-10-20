import { expect, test } from "@playwright/test";
import { sortingTrends } from "./helpers/sorting-trends.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

for (const slug of ["square-arrow-down", "square-arrow-left", "square-arrow-right", "square-arrow-up"]) test(`${slug} restores its morphed shaft after stop`, async ({ page }) => {
  await page.goto(`/${slug}/`);
  await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
  const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
  const read = (element: Element) => element.querySelector("[data-part=shaft]")!.getAttribute("d");
  const rest = await icon!.evaluate(read);
  await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await expect.poll(() => icon!.evaluate(read)).not.toEqual(rest);
  const continuity = await icon!.evaluate((element: HTMLElement & IconHandle) => {
    const path = element.querySelector("[data-part=shaft]")!;
    const before = path.getAttribute("d");
    element.stopAnimation();
    return { before, after: path.getAttribute("d") };
  });
  expect(continuity.after).toEqual(continuity.before);
  await expect.poll(() => icon!.evaluate(read)).toEqual(rest);
  await page.waitForTimeout(650);
  expect(await icon!.evaluate(read)).toEqual(rest);
});


testIconBehavior(sortingTrends, [50, 200, 350, 700]);

for (const icon of sortingTrends) {
  test(`${icon.name} hover starts playback independently and returns to rest`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    await page.locator("#primary").hover();
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const interruption of [0, 50, 200, 350, 700]) {
  test(`Sorting and trends match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/sorting-trends-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), sortingTrends.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(20);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("sorting-trends-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new CustomEvent("sorting-trends-capture-return", { detail: interruption }));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("sorting-trends-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "sorting-trends-seek", times: [0, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 800, 1000],
      origin: "wrapper" as const,
    });
    if (!interruption) for (const icon of sortingTrends) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Sorting and trends ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const slug of ["square-arrow-down", "square-arrow-left", "square-arrow-right", "square-arrow-up"]) {
  for (const action of ["stop", "remove", "reduce"] as const) for (const returning of [false, true]) {
    test(`${slug} cancels shaft frame work on ${action} during ${returning ? "return" : "entry"}`, async ({ page }) => {
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
      await page.goto(`/${slug}/`);
      await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`, { polling: 10 });
      const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
      const read = (element: Element) => element.querySelector("[data-part=shaft]")!.getAttribute("d");
      const idle = await icon!.evaluate(read);
      for (let cycle = 0; cycle < 3; cycle++) {
        await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
        await page.clock.runFor(120);
        await icon!.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
        await page.clock.runFor(32);
      }
      await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
      await page.clock.runFor(180);
      expect(await icon!.evaluate(read)).not.toBe(idle);
      expect(await page.locator("#secondary").evaluate(read)).toBe(idle);
      if (returning) {
        await icon!.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
        await page.clock.runFor(64);
      }
      if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
      else await icon!.evaluate((element: HTMLElement & IconHandle, action) => {
        if (action === "remove") element.remove(); else element.stopAnimation();
      }, action);
      await page.clock.runFor(1000);
      expect(await icon!.evaluate(read)).toBe(idle);
      const frames = await page.evaluate(() => (window as typeof window & { observedFrames: number }).observedFrames);
      await page.clock.runFor(2000);
      expect(await page.evaluate(() => (window as typeof window & { observedFrames: number }).observedFrames)).toBe(frames);
      expect(await icon!.evaluate(read)).toBe(idle);
      if (action === "remove") {
        await page.locator("#secondary").evaluate((control, icon) => { icon!.removeAttribute("data-controlled"); control.append(icon!); }, icon);
        await page.locator("#secondary").dispatchEvent("pointerenter", { pointerType: "mouse" });
        await page.clock.runFor(180);
        expect(await icon!.evaluate(read)).not.toBe(idle);
        await page.locator("#secondary").dispatchEvent("pointerleave", { pointerType: "mouse" });
        await page.clock.runFor(1000);
        expect(await icon!.evaluate(read)).toBe(idle);
      }
      if (action === "reduce") {
        await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
        await page.clock.runFor(180);
        expect(await icon!.evaluate(read)).toBe(idle);
      }
    });
  }
}

for (const slug of ["trending-down", "trending-up"]) {
  test(`${slug} replays both completed reveals from their explicit offsets`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const icon = page.locator(`#controlled grave-${slug}`);
    await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    const offsets = await icon.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      return [...element.querySelectorAll("polyline")].map(shape => parseFloat(getComputedStyle(shape).strokeDashoffset));
    });
    expect(offsets).toEqual([-1, -0.5]);
  });
}

for (const slug of ["arrow-down-a-z", "square-arrow-right", "trending-up"]) for (const returning of [false, true]) {
  test(`${slug} replays continuously during ${returning ? "return" : "entry"}`, async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`, { polling: 10 });
    const icon = page.locator(`#controlled grave-${slug}`);
    await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await page.clock.runFor(150);
    if (returning) {
      await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
      await page.clock.runFor(32);
    }
    const poses = await icon.evaluate((element: HTMLElement & IconHandle) => {
      const read = () => [...element.querySelectorAll("path, rect, polyline")].map(shape => {
        const box = shape.getBoundingClientRect();
        return [box.x, box.y, box.width, box.height];
      });
      const before = read();
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      return { before, after: read() };
    });
    poses.before.forEach((shape, index) => shape.forEach((value, coordinate) => expect(Math.abs(poses.after[index][coordinate] - value)).toBeLessThan(0.03)));
  });
}
