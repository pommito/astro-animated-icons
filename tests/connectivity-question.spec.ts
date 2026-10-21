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
