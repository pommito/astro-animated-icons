import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { energyBluetoothIcons } from "./helpers/energy-bluetooth.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(energyBluetoothIcons, [100, 300, 650, 1600]);

test("all energy and Bluetooth adapters match the pinned React components", async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/energy-bluetooth-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), energyBluetoothIcons.map((icon) => icon.tag));
  await page.locator("#play").click();
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "energy-bluetooth-seek",
    times: [0, 50, 100, 150, 200, 300, 400, 600, 800, 1200, 1600],
    origin: "svg" as const,
  });
  const levels = ["battery-full", "battery-low", "battery-medium"];
  const first = compareUpstreamPoses(samples.filter((sample) => sample.time <= 400 || !levels.includes(sample.icon!)), "entry, first battery phase");
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), energyBluetoothIcons.map((icon) => icon.tag));
  await page.locator("#play").click();
  await expect.poll(() => page.locator('[data-icon="battery-full"] [data-reference]').first().evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    return animations.length === 3 && animations.every((animation) => animation.effect!.getTiming().duration === 600);
  })).toBe(true);
  const second = compareUpstreamPoses((await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "energy-bluetooth-level-seek",
    times: [0, 100, 200, 300, 400, 600, 800, 1000, 1200, 1400],
    origin: "svg" as const,
  })).filter((sample) => levels.includes(sample.icon!)), "second battery phase");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#play").click();
  await expect.poll(() => page.locator("[data-adapter]").evaluateAll((elements) => elements.reduce((count, element) => count + element.getAnimations({ subtree: true }).length, 0))).toBe(0);
  expect(errors).toEqual([]);
  console.log(`Energy and Bluetooth comparison: ten original React components at 14, 16, 24, and 28 px; both battery phases; maximum geometry difference ${Math.max(first.maximumGeometry, second.maximumGeometry).toFixed(6)} screen pixels, maximum normalized paint difference ${Math.max(first.maximumPaint, second.maximumPaint).toFixed(6)}.`);
});

test("Bluetooth reveals from a positive offset and BluetoothOff delays its slash", async ({ page }) => {
  for (const [slug, times] of [["bluetooth", [0, 150, 300]], ["bluetooth-off", [0, 300, 400, 500]]] as const) {
    await page.goto(`/${slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), `grave-${slug}`);
    const samples = await page.locator(`#controlled grave-${slug}`).evaluate((icon: HTMLElement & IconHandle, times) => {
      icon.startAnimation();
      const animations = icon.getAnimations({ subtree: true });
      animations.forEach((animation) => animation.pause());
      return times.map((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...icon.querySelectorAll("path")].map((path) => {
          const style = getComputedStyle(path);
          return [Number(style.opacity), parseFloat(style.strokeDasharray) / path.getTotalLength(), parseFloat(style.strokeDashoffset) / path.getTotalLength()];
        });
      });
    }, [...times]);
    expect(samples[0][0][0]).toBe(0);
    expect(samples[0][0][1]).toBe(0);
    expect(samples[0][0][2]).toBeCloseTo(-1, 5);
    if (slug === "bluetooth") {
      samples[1].forEach((shape) => shape.forEach((value, index) => expect(value).toBeCloseTo(index === 2 ? -0.5 : 0.5, 3)));
    } else {
      expect(samples[1][1]).toEqual([0, 0, 0]);
      expect(samples[2][1][0]).toBeGreaterThan(0);
      expect(samples[2][1][0]).toBeLessThan(1);
    }
    samples.at(-1)!.forEach((shape) => shape.forEach((value, index) => expect(value).toBeCloseTo(index === 2 ? 0 : 1, 5)));
  }
});

test("BatteryCharging pulses its bolt repeatedly while its outline stays still", async ({ page }) => {
  await page.goto("/battery-charging/");
  await expect(page.locator("#controlled grave-battery-charging")).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-battery-charging"));
  const samples = await page.locator("#controlled grave-battery-charging").evaluate((icon: HTMLElement & IconHandle) => {
    icon.startAnimation();
    const animations = icon.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    return [0, 400, 800, 1200].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return [...icon.querySelectorAll("path")].map((shape) => {
        const style = getComputedStyle(shape);
        return [new DOMMatrix(style.transform).a, Number(style.opacity)];
      });
    });
  });
  expect(samples[0]).toEqual([[1, 1], [1, 1], [1, 1], [1, 1]]);
  expect(samples[1].slice(0, 3)).toEqual(samples[0].slice(0, 3));
  expect(samples[1][3][0]).toBeCloseTo(1.2, 4);
  expect(samples[1][3][1]).toBeCloseTo(0.8, 4);
  expect(samples[2][3]).toEqual([1, 1]);
  expect(samples[3][3][0]).toBeCloseTo(1.2, 4);
});

test("Battery preserves its empty outline at rest and fills only its interior", async ({ page }) => {
  await page.goto("/battery/");
  await expect(page.locator("#controlled grave-battery")).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-battery"));
  const samples = await page.locator("#controlled grave-battery").evaluate((icon: HTMLElement & IconHandle) => {
    const pose = () => [...icon.querySelectorAll("rect, path")].map((shape) => {
      const style = getComputedStyle(shape);
      return { opacity: Number(style.opacity), width: shape.getBoundingClientRect().width };
    });
    const rest = pose();
    icon.startAnimation();
    const animations = icon.getAnimations({ subtree: true });
    animations.forEach((animation) => { animation.pause(); animation.currentTime = 400; });
    return { rest, filled: pose() };
  });
  expect(samples.rest[2].opacity).toBe(0);
  expect(samples.rest[2].width).toBe(0);
  expect(samples.filled[2].opacity).toBe(1);
  expect(samples.filled[2].width).toBeCloseTo(14, 3);
  expect(samples.filled.slice(0, 2)).toEqual(samples.rest.slice(0, 2));
});

test("BatteryFull fades all bars then charges from left to right", async ({ page }) => {
  await page.goto("/battery-full/");
  await expect(page.locator("#controlled grave-battery-full")).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-battery-full"));
  const samples = await page.locator("#controlled grave-battery-full").evaluate((icon: HTMLElement & IconHandle) => {
    icon.startAnimation();
    const animations = icon.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    return [0, 400, 700, 1000, 1400, 1800].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return [...icon.querySelectorAll("[data-bar]")].map((bar) => Number(getComputedStyle(bar).opacity));
    });
  });
  expect(samples[0]).toEqual([1, 1, 1]);
  expect(samples[1]).toEqual([0, 0, 0]);
  expect(samples[2][0]).toBeCloseTo(0.5, 3);
  expect(samples[2].slice(1)).toEqual([0, 0]);
  expect(samples[3][0]).toBe(1);
  expect(samples[3][2]).toBe(0);
  expect(samples[4][0]).toBe(1);
  expect(samples[4][1]).toBe(1);
  expect(samples[5]).toEqual([1, 1, 1]);
});
