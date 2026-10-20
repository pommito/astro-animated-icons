import { expect, test } from "@playwright/test";
import { directionalArrows } from "./helpers/directional-arrows.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(directionalArrows, [50, 200, 350, 450]);

for (const icon of directionalArrows) {
  test(`${icon.name} hover and manual playback keep the pinned peak transforms`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    await page.locator("#primary").hover();
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    await page.mouse.move(0, 0);
    const peak = await page.locator(`#controlled ${icon.tag}`).evaluate((element: HTMLElement & IconHandle, slug) => {
      element.startAnimation();
      const animations = element.getAnimations({ subtree: true });
      animations.forEach(animation => { animation.pause(); animation.currentTime = slug.startsWith("arrow-down") ? 250 : 200; });
      return {
        durations: animations.map(animation => animation.effect!.getTiming().duration),
        transforms: [...element.querySelectorAll("path")].map(path => {
          const matrix = new DOMMatrix(getComputedStyle(path).transform);
          return [matrix.m41, matrix.m42, matrix.a];
        }),
      };
    }, icon.slug);
    if (icon.slug === "arrow-down-left") {
      expect(peak.transforms).toEqual([[3, -3, 1], [3, -3, 0.85], [0, 0, 1]]);
    } else if (icon.slug === "arrow-down-right") {
      expect(peak.transforms).toEqual([[-3, -3, 0.85], [-3, -3, 1], [-3, -3, 1]]);
    } else {
      const axis = /left|right/.test(icon.slug) ? 0 : 1;
      const sign = /left|up/.test(icon.slug) ? -1 : 1;
      const travel = icon.slug.endsWith("dash") ? [1, 3] : [3];
      expect(peak.transforms.map(matrix => matrix[axis])).toEqual(travel.map(value => value * sign));
      expect(peak.transforms.every(matrix => matrix[1 - axis] === 0 && matrix[2] === 1)).toBe(true);
    }
    expect(peak.durations.every(duration => duration === (icon.slug.startsWith("arrow-down") ? 500 : 400))).toBe(true);
    await page.locator("#stop-controlled").click();
    await expect.poll(() => page.locator(`#controlled ${icon.tag}`).evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const interruption of [0, 50, 200, 350, 450]) {
  test(`Directional arrows match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/directional-arrows-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), directionalArrows.map(icon => icon.tag));
    await page.evaluate(interruption => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("directional-arrows-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("directional-arrows-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("directional-arrows-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "directional-arrows-seek",
      times: [0, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 650, 1000],
      origin: "svg" as const,
    });
    if (!interruption) for (const icon of directionalArrows) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference moves`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter moves`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Directional arrows ${interruption ? `captured return ${interruption}ms` : "entry"}: ten pinned React components at 14, 16, 24 and 28 px; maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)}.`);
  });
}
