import { expect, test } from "@playwright/test";
import { messageIcons } from "./helpers/message-icons.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

testIconBehavior(messageIcons, [100, 300, 650, 1600]);

test("all message adapters match the pinned React components at small sizes", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let maximumGeometry = 0;
  let maximumPaint = 0;
  for (const returning of [false, true]) {
    await page.goto("/messages-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), messageIcons.map((icon) => icon.tag));
    await page.locator("#play").click();
    await page.waitForTimeout(returning ? 1700 : 100);
    if (returning) {
      await page.locator("#stop").click();
      await page.waitForTimeout(50);
    }
    const samples = await page.evaluate(() => {
      return [0, 50, 100, 150, 200, 250, 300, 375, 400, 500, 600, 800, 1000, 1200, 1500, 1600].flatMap((time) => {
        document.dispatchEvent(new CustomEvent("message-seek", { detail: time }));
        return [...document.querySelectorAll<HTMLTableRowElement>("tr[data-icon]")].map((row) => {
          const pose = (selector: string) => {
            const container = row.querySelector(selector)!;
            const origin = container.firstElementChild!.getBoundingClientRect();
            return [...container.querySelectorAll<SVGGeometryElement>("path")].map((shape) => {
              const box = shape.getBoundingClientRect();
              let opacity = 1;
              let parent: Element | null = shape;
              while (parent && parent !== container) {
                opacity *= Number(getComputedStyle(parent).opacity);
                parent = parent.parentElement;
              }
              const length = Number(shape.getAttribute("pathLength")) || shape.getTotalLength();
              const dash = parseFloat(getComputedStyle(shape).strokeDasharray);
              return [
                box.x - origin.x, box.y - origin.y, box.width, box.height, opacity,
                Number.isNaN(dash) ? 1 : dash / length,
                parseFloat(getComputedStyle(shape).strokeDashoffset) / length,
              ];
            });
          };
          return { time, icon: row.dataset.icon, size: row.dataset.size, adapter: pose("[data-adapter]"), reference: pose("[data-reference]") };
        });
      });
    });
    for (const sample of samples) {
      expect(sample.adapter.length).toBe(sample.reference.length);
      sample.adapter.forEach((shape, index) => shape.forEach((value, coordinate) => {
        const difference = Math.abs(value - sample.reference[index][coordinate]);
        if (coordinate < 4) maximumGeometry = Math.max(maximumGeometry, difference);
        else maximumPaint = Math.max(maximumPaint, difference);
        const tolerance = coordinate < 4 ? 0.03 : 0.005;
        if (difference >= tolerance) {
          expect(difference, `${sample.icon}, ${sample.size}px, ${sample.time}ms, returning ${returning}, shape ${index}, coordinate ${coordinate}`).toBeLessThan(tolerance);
        }
      }));
    }
  }
  expect(errors).toEqual([]);
  expect(maximumGeometry).toBeLessThan(0.03);
  expect(maximumPaint).toBeLessThan(0.005);
  console.log(`Message comparison: ten pinned React components at 14, 16, 24, and 28 px; entry and returns from completed playback; maximum geometry difference ${maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${maximumPaint.toFixed(6)}.`);
});

test("MessageCircleCheck redraws its check and holds the complete stroke", async ({ page }) => {
  await page.goto("/message-circle-check/");
  await page.waitForFunction(() => !!customElements.get("grave-message-circle-check"));
  await page.locator("#controlled").click();
  const check = page.locator("#controlled path").nth(1);
  await check.evaluate((shape) => shape.getAnimations().forEach((animation) => {
    animation.pause();
    animation.currentTime = 200;
  }));
  await expect(check).toHaveCSS("opacity", "0.5");
  const reveal = await check.evaluate((shape: SVGPathElement) => parseFloat(getComputedStyle(shape).strokeDasharray) / shape.getTotalLength());
  expect(reveal).toBeCloseTo(0.5, 3);
  await check.evaluate((shape) => shape.getAnimations().forEach((animation) => animation.finish()));
  await expect(check).toHaveCSS("opacity", "1");
  await page.locator("#stop-controlled").click();
  await expect.poll(() => page.locator("#controlled").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test("MessageCircleMore blinks its dots in the upstream staggered order", async ({ page }) => {
  await page.goto("/message-circle-more/");
  await page.waitForFunction(() => !!customElements.get("grave-message-circle-more"));
  await page.locator("#controlled").click();
  const dots = page.locator("#controlled path");
  await page.locator("#controlled").evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => {
    animation.pause();
    animation.currentTime = 375;
  }));
  await expect(dots.nth(1)).toHaveCSS("opacity", "1");
  await expect(dots.nth(2)).toHaveCSS("opacity", "1");
  expect(await dots.nth(3).evaluate((shape) => Number(getComputedStyle(shape).opacity))).toBeCloseTo(0.781381, 5);
});

test("MessageCirclePlus delays the second stroke by 200 ms and restores it after interruption", async ({ page }) => {
  await page.goto("/message-circle-plus/");
  await page.waitForFunction(() => !!customElements.get("grave-message-circle-plus"));
  await page.locator("#controlled").click();
  const control = page.locator("#controlled");
  await control.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => {
    animation.pause();
    animation.currentTime = 200;
  }));
  await expect(control.locator("path").nth(1)).toHaveCSS("opacity", "0.5");
  await expect(control.locator("path").nth(2)).toHaveCSS("opacity", "0");
  await page.locator("#stop-controlled").click();
  await expect.poll(() => control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(control.locator("path").nth(2)).toHaveCSS("stroke-dasharray", "none");
  await expect(control.locator("path").nth(2)).toHaveCSS("opacity", "1");
});

test("MessageCircle holds its enlarged pose until stopped", async ({ page }) => {
  await page.goto("/message-circle/");
  await page.waitForFunction(() => !!customElements.get("grave-message-circle"));
  const icon = page.locator("#controlled grave-message-circle");
  const resting = (await icon.locator("path").boundingBox())!;
  await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
  });
  await expect.poll(async () => (await icon.locator("path").boundingBox())!.width / resting.width).toBeCloseTo(1.05, 3);
  await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  expect((await icon.locator("path").boundingBox())!.width).toBeCloseTo(resting.width, 3);
});
