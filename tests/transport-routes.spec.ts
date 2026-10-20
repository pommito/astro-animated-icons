import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { transportRoutes } from "./helpers/transport-routes.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";


test("Rocket morphs its fire and restores it without late writes after removal", async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto("/rocket/");
  await page.waitForFunction(() => !!customElements.get("grave-rocket"), null, { polling: 10 });
  const icon = await page.locator("#controlled grave-rocket").elementHandle();
  const idle = await icon!.evaluate(element => element.querySelector("path")!.getAttribute("d"));
  await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await page.clock.runFor(400);
  expect(await icon!.evaluate(element => element.querySelector("path")!.getAttribute("d"))).not.toBe(idle);
  await icon!.evaluate(element => element.remove());
  await page.clock.runFor(8000);
  expect(await icon!.evaluate(element => element.querySelector("path")!.getAttribute("d"))).toBe(idle);
});


testIconBehavior(transportRoutes, [50, 200, 450, 900, 1600, 6800]);

for (const interruption of [0, 200, 900, 6800]) {
  test(`Transport matches pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/transport-routes-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), transportRoutes.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("transport-routes-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("transport-routes-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("transport-routes-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "transport-routes-seek", times: interruption ? [0, 25, 50, 100, 150, 200, 300, 450, 600, 900, 1200, 1800] : [0, 25, 50, 100, 150, 200, 305, 455, 605, 905, 1205, 1605, 2405, 4005, 6205, 6805, 9005, 11505, 12505],
      origin: "wrapper" as const,
    });
    if (!interruption) for (const icon of transportRoutes) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    console.log(`Transport ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const icon of transportRoutes) {
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

for (const slug of ["airplane", "car", "truck"]) {
  test(`${slug} keeps decorative speed lines hidden without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/${slug}/`);
    expect(await page.locator("#primary [data-streak], #primary [data-speed]").evaluateAll(lines => lines.map(line => Number(getComputedStyle(line).opacity)))).toEqual([0, 0, 0]);
    expect(await page.locator("#primary path, #primary circle").evaluateAll(shapes => shapes.every(shape => Number(getComputedStyle(shape).opacity) === 1 && shape.getBoundingClientRect().width > 0))).toBe(true);
    await context.close();
  });
}
