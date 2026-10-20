import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { textFormatting } from "./helpers/text-formatting.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(textFormatting, [50, 150, 350, 650]);

for (const interruption of [0, 150, 350, 1500]) {
  test(`Text formatting matches pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/text-formatting-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), textFormatting.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("text-formatting-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("text-formatting-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("text-formatting-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "text-formatting-seek", times: [0, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 800, 1000, 1500],
      origin: "svg" as const, includeStrokeWidth: true,
    });
    if (!interruption) for (const icon of textFormatting) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Text formatting ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const slug of ["align-left", "align-right"] as const) {
  for (const interruption of ["stop", "remove", "reduce"] as const) {
    test(`${slug} preserves moving endpoints and restores attributes after ${interruption}`, async ({ page }) => {
      await page.goto(`/${slug}/`);
      await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
      const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
      const attribute = slug === "align-left" ? "x2" : "x1";
      const read = (element: Element, attribute: string) => [...element.querySelectorAll("line")].map(line => line.getAttribute(attribute));
      const rest = await icon!.evaluate(read, attribute);
      await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
      await expect.poll(() => icon!.evaluate(read, attribute)).not.toEqual(rest);
      expect(await page.locator("#secondary").evaluate(read, attribute)).toEqual(rest);
      if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
      else {
        const pose = await icon!.evaluate((element: HTMLElement & IconHandle, { interruption, attribute }) => {
          const read = () => [...element.querySelectorAll("line")].map(line => line.getAttribute(attribute));
          const before = read();
          if (interruption === "stop") element.stopAnimation();
          else element.remove();
          return { before, after: read() };
        }, { interruption, attribute });
        if (interruption === "stop") expect(pose.after).toEqual(pose.before);
      }
      await expect.poll(() => icon!.evaluate(read, attribute)).toEqual(rest);
      await page.waitForTimeout(150);
      expect(await icon!.evaluate(read, attribute)).toEqual(rest);
      if (interruption === "reduce") {
        await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
        await page.waitForTimeout(100);
        expect(await icon!.evaluate(read, attribute)).toEqual(rest);
      }
    });
  }
}

for (const icon of textFormatting) {
  test(`${icon.name} hover and manual playback change the drawing`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const read = (element: Element) => [...element.querySelectorAll("path, line, rect")].map(shape => {
      const style = getComputedStyle(shape);
      return [style.transform, style.opacity, style.strokeDasharray, style.strokeWidth, shape.getAttribute("x1"), shape.getAttribute("x2")];
    });
    const primary = page.locator("#primary");
    const rest = await primary.evaluate(read);
    await primary.hover();
    await expect.poll(() => primary.evaluate(read)).not.toEqual(rest);
    await page.mouse.move(0, 0);
    await expect.poll(() => primary.evaluate(read)).toEqual(rest);
    const controlled = page.locator(`#controlled ${icon.tag}`);
    await controlled.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => controlled.evaluate(read)).not.toEqual(rest);
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.waitForTimeout(50);
      await controlled.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
      await page.waitForTimeout(50);
      await controlled.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    }
    await controlled.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
    await expect.poll(() => controlled.evaluate(read)).toEqual(rest);
  });
}

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

for (const time of [50, 150, 350]) {
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

for (const slug of ["a-arrow-down", "a-arrow-up"]) {
  test(`${slug} replays the letter and delayed arrow after the held entry completes`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const icon = page.locator(`#controlled grave-${slug}`);
    const result = await icon.evaluate((element: HTMLElement & IconHandle) => {
      const read = () => [...element.querySelectorAll("path")].map(path => {
        const style = getComputedStyle(path);
        const transform = new DOMMatrix(style.transform);
        return [Number(style.opacity), transform.a, transform.m42];
      });
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
      const held = read();
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      const replayed = read();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 500; });
      const completed = read();
      element.remove();
      return { held, replayed, completed };
    });
    expect(result.held.every(pose => pose[0] === 1 && pose[1] === 1 && pose[2] === 0)).toBe(true);
    expect(result.replayed.map(pose => pose[0])).toEqual([0, 0, 0, 0]);
    expect(result.replayed.slice(0, 2).map(pose => pose[1])).toEqual([0.8, 0.8]);
    expect(result.replayed.slice(2).map(pose => pose[2])).toEqual(slug === "a-arrow-down" ? [-10, -10] : [10, 10]);
    expect(result.completed).toEqual(result.held);
  });
}
