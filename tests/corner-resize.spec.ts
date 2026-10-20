import { expect, test } from "@playwright/test";
import { cornerResizeIcons } from "./helpers/corner-resize.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

for (const { slug, axis, displacement } of [
  { slug: "corner-down-left", axis: "X", displacement: -2 },
  { slug: "corner-down-right", axis: "X", displacement: 2 },
  { slug: "corner-left-down", axis: "Y", displacement: 2 },
  { slug: "corner-left-up", axis: "Y", displacement: -2 },
  { slug: "corner-right-down", axis: "Y", displacement: 2 },
  { slug: "corner-right-up", axis: "Y", displacement: -2 },
  { slug: "corner-up-left", axis: "X", displacement: -2 },
  { slug: "corner-up-right", axis: "X", displacement: 2 },
]) {
  test(`${slug} reaches its directional stretch at 225 ms and restores after one pulse`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), `grave-${slug}`);
    const icon = page.locator(`#controlled grave-${slug}`);
    const pose = await icon.evaluate((element: HTMLElement & IconHandle, axis) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 225; });
      const matrix = new DOMMatrix(getComputedStyle(element.querySelector("svg")!).transform);
      return { scale: axis === "X" ? matrix.a : matrix.d, displacement: axis === "X" ? matrix.m41 : matrix.m42 };
    }, axis);
    expect(pose.scale).toBeCloseTo(1.15, 4);
    expect(pose.displacement).toBeCloseTo(displacement, 4);
    await icon.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
    await expect.poll(() => icon.locator("svg").evaluate((svg) => svg.style.transform)).toBe("");
  });
}

for (const { slug, displacement } of [{ slug: "expand", displacement: 2 }, { slug: "shrink", displacement: 1 }]) {
  test(`${slug} holds four finite spring translations until stopped`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), `grave-${slug}`);
    const icon = page.locator(`#controlled grave-${slug}`);
    const count = await icon.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      const animations = element.getAnimations({ subtree: true });
      if (animations.some((animation) => !Number.isFinite(animation.effect!.getComputedTiming().endTime))) return -1;
      animations.forEach((animation) => animation.finish());
      return animations.length;
    });
    expect(count).toBe(4);
    await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const held = await icon.locator("path").evaluateAll((paths) => paths.map((path) => {
      const matrix = new DOMMatrix(getComputedStyle(path).transform);
      return [matrix.m41, matrix.m42];
    }));
    expect(held).toEqual([[displacement, displacement], [-displacement, displacement], [displacement, -displacement], [-displacement, -displacement]]);
    await page.waitForTimeout(100);
    expect(await icon.locator("path").evaluateAll((paths) => paths.map((path) => {
      const matrix = new DOMMatrix(getComputedStyle(path).transform);
      return [matrix.m41, matrix.m42];
    }))).toEqual(held);
    await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
    await expect.poll(() => icon.locator("path").evaluateAll((paths) => paths.every((path) => !path.style.transform))).toBe(true);
  });
}

testIconBehavior(cornerResizeIcons, [50, 225, 400, 650]);

for (const icon of cornerResizeIcons) {
  test(`${icon.name} replays continuously during entry and return`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
    const element = page.locator(`#controlled ${icon.tag}`);
    const samples = await element.evaluate((element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      const pose = () => [...element.querySelectorAll("svg, g, path")].map((shape) => getComputedStyle(shape).transform);
      element.startAnimation();
      seek(100);
      const entry = pose();
      element.startAnimation();
      seek(0);
      const replayedEntry = pose();
      element.stopAnimation();
      seek(50);
      const returning = pose();
      element.startAnimation();
      seek(0);
      const replayedReturn = pose();
      element.stopAnimation();
      return { entry, replayedEntry, returning, replayedReturn };
    });
    expect(samples.replayedEntry).toEqual(samples.entry);
    expect(samples.replayedReturn).toEqual(samples.returning);
    await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const phase of ["entry", "return"] as const) {
  test(`Corner and resize ${phase} matches ten pinned React components at four sizes`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/corner-resize-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), cornerResizeIcons.map((icon) => icon.tag));
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("corner-resize-seek", { detail: 0 }));
    });
    if (phase === "return") {
      await page.evaluate(() => document.dispatchEvent(new Event("corner-resize-complete-entry")));
      await expect.poll(() => page.locator("[data-adapter]").evaluateAll((elements) => elements.reduce((sum, element) => sum + element.getAnimations({ subtree: true }).length, 0))).toBe(0);
      await page.evaluate(() => {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("corner-resize-seek", { detail: 0 }));
      });
    }
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "corner-resize-seek",
      times: [0, 25, 50, 100, 150, 200, 225, 250, 300, 350, 400, 450, 500, 650, 1000],
      origin: "wrapper" as const,
    });
    for (const icon of cornerResizeIcons) {
      if (phase === "return" && icon.slug.startsWith("corner-")) continue;
      const poses = samples.filter((sample) => sample.icon === icon.slug && sample.size === "28");
      for (const source of ["reference", "adapter"] as const) {
        expect(new Set(poses.map((sample) => JSON.stringify(sample[source]))).size, `${icon.name} ${source} must move`).toBeGreaterThan(1);
      }
    }
    const result = compareUpstreamPoses(samples, phase);
    expect(errors).toEqual([]);
    console.log(`Corner and resize ${phase}: ten original React components at 14, 16, 24 and 28 px; maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)}.`);
  });
}
