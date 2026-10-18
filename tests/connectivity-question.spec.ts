import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

function sampleQuestions() {
  return [...document.querySelectorAll('[data-icon="wifi-low"]')].map(row => {
    const pose = (selector: string) => {
      const svg = row.querySelector(`${selector} svg`)!;
      const text = svg.querySelector("text")!;
      const anchor = svg.getBoundingClientRect();
      const box = text.getBoundingClientRect();
      return [box.x - anchor.x, box.y - anchor.y, box.width, box.height, Number(getComputedStyle(text).opacity)];
    };
    return { size: (row as HTMLElement).dataset.size, adapter: pose("[data-adapter]"), reference: pose("[data-reference]") };
  });
}

test("WifiLow question matches the original show spring and return at all four sizes", async ({ page }) => {
  const ready = async () => {
    await page.goto("/connectivity-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true" && !!customElements.get("grave-wifi-low"));
    await page.locator("#play").click();
  };
  let maximumGeometry = 0;
  let maximumOpacity = 0;
  const compare = (samples: ReturnType<typeof sampleQuestions>, time: number, phase: string) => {
    for (const sample of samples) sample.adapter.forEach((value, coordinate) => {
      const difference = Math.abs(value - sample.reference[coordinate]);
      if (coordinate < 4) maximumGeometry = Math.max(maximumGeometry, difference);
      else maximumOpacity = Math.max(maximumOpacity, difference);
      expect(difference, `${sample.size}px, ${phase}, ${time}ms, coordinate ${coordinate}`).toBeLessThan(coordinate < 4 ? 0.03 : 0.005);
    });
  };
  await ready();
  await expect.poll(() => page.locator('[data-icon="wifi-low"] [data-reference] text').first().evaluate(text => text.getAnimations().some(animation => Number(animation.effect!.getTiming().duration) > 150))).toBe(true);
  for (const time of [0, 50, 100, 150, 200, 300, 400, 600, 800]) {
    await page.evaluate(time => {
      document.dispatchEvent(new CustomEvent("connectivity-seek", { detail: time }));
      document.dispatchEvent(new CustomEvent("connectivity-signal-seek", { detail: time }));
    }, time);
    compare(await page.evaluate(sampleQuestions), time, "show");
  }
  await ready();
  await page.waitForTimeout(1000);
  await page.locator("#stop").click();
  for (const time of [0, 25, 50, 75, 100, 125, 150]) {
    await page.evaluate(time => document.dispatchEvent(new CustomEvent("connectivity-seek", { detail: time })), time);
    compare(await page.evaluate(sampleQuestions), time, "return");
  }
  console.log(`WifiLow question comparison: maximum geometry difference ${maximumGeometry.toFixed(6)} screen pixels; maximum opacity difference ${maximumOpacity.toFixed(6)}.`);
});

test("WifiLow preserves the question pose when stopped during show, hold, or hide", async ({ page }) => {
  await page.goto("/wifi-low/");
  await page.waitForFunction(() => !!customElements.get("grave-wifi-low"));
  const icon = page.locator("#controlled grave-wifi-low");
  for (const time of [350, 650, 1750]) {
    const poses = await icon.evaluate((element: HTMLElement & IconHandle, time) => {
      const pose = () => {
        const style = getComputedStyle(element.querySelector("text")!);
        return [style.opacity, style.transform];
      };
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const before = pose();
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      const after = pose();
      element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
      return { before, after };
    }, time);
    expect(poses.after).toEqual(poses.before);
  }
});
