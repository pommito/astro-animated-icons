import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { receiptIcons } from "./helpers/receipt-icons.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { sampleUpstreamPoses, compareUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(receiptIcons, [100, 300, 550, 750, 1000]);

test("ReceiptText erases in reverse order before redrawing forward", async ({ page }) => {
  await page.goto("/receipt-text/");
  await page.waitForFunction(() => !!customElements.get("grave-receipt-text"));
  const samples = await page.locator("#controlled grave-receipt-text").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    return [100, 320, 420, 600, 900].map((time) => {
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      return [...element.querySelectorAll("path")].slice(1).map((path) => parseFloat(getComputedStyle(path).strokeDasharray) / path.getTotalLength());
    });
  });
  expect(samples[0][0]).toBeCloseTo(1, 4);
  expect(samples[0][1]).toBeCloseTo(0.8, 4);
  expect(samples[0][2]).toBeCloseTo(0.5, 4);
  for (const value of samples[1]) expect(value).toBeCloseTo(0, 4);
  expect(samples[2][0]).toBeCloseTo(2 / 7, 4);
  expect(samples[2][1]).toBeCloseTo(0, 4);
  expect(samples[2][2]).toBeCloseTo(0, 4);
  expect(samples[3][0]).toBeGreaterThan(samples[3][1]);
  expect(samples[3][1]).toBeGreaterThan(samples[3][2]);
  for (const value of samples[4]) expect(value).toBeCloseTo(1, 4);
});


for (const phase of ["currency entry", "currency stroke return", "text hidden", "text visible"] as const) {
  test(`Receipt ${phase} matches the pinned React components at four sizes`, async ({ page }) => {
    test.setTimeout(60000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/receipts-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), receiptIcons.map((icon) => icon.tag));
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("receipts-seek", { detail: 0 }));
    });
    if (phase === "currency stroke return") {
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("receipts-seek", { detail: 550 }));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("receipts-seek", { detail: 0 }));
      });
    }
    if (phase === "text visible") {
      await page.evaluate(() => document.dispatchEvent(new Event("receipts-finish-hidden")));
      await page.waitForTimeout(50);
    }
    const samples = (await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "receipts-seek",
      times: phase === "text hidden" ? [0, 50, 100, 150, 200, 250, 300, 320] : [0, 50, 100, 200, 300, 400, 500, 550, 600, 700, 900, 1100],
      origin: "svg" as const,
    })).filter((sample) => phase.startsWith("currency") ? sample.icon !== "receipt-text" : sample.icon === "receipt-text");
    for (const icon of new Set(samples.map((sample) => sample.icon))) {
      const poses = samples.filter((sample) => sample.icon === icon && sample.size === "28");
      expect(new Set(poses.map((sample) => JSON.stringify(sample.reference))).size, `${icon} reference must move`).toBeGreaterThan(1);
    }
    const withoutOpacity = (shapes: number[][]) => shapes.map((shape) => [...shape.slice(0, 4), ...shape.slice(5)]);
    const comparable = phase === "currency stroke return" ? samples.map((sample) => ({
      ...sample, adapter: withoutOpacity(sample.adapter), reference: withoutOpacity(sample.reference),
    })) : samples;
    const result = compareUpstreamPoses(comparable, phase);
    expect(errors).toEqual([]);
    console.log(`Receipt ${phase}: maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized ${phase === "currency stroke return" ? "stroke" : "paint"} difference ${result.maximumPaint.toFixed(6)} at 14, 16, 24 and 28 px.`);
  });
}
