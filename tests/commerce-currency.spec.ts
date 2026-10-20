import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { sampleUpstreamPoses, compareUpstreamPoses } from "./helpers/upstream-comparison.js";
import { commerceCurrencyIcons } from "./helpers/commerce-currency.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";

testIconBehavior(commerceCurrencyIcons, [100, 300, 550, 750, 1000]);

test("Cart holds its scale after both vertical pulses until stopped", async ({ page }) => {
  await page.goto("/cart/");
  await page.waitForFunction(() => !!customElements.get("grave-cart"));
  const icon = page.locator("#controlled grave-cart");
  await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect.poll(() => icon.evaluate(element => getComputedStyle(element.querySelector("svg")!).transform)).toBe("matrix(1.1, 0, 0, 1.1, 0, 0)");
  await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
  await expect.poll(() => icon.evaluate(element => getComputedStyle(element.querySelector("svg")!).transform)).toBe("none");
});

for (const capturedTime of [undefined, 300, 550, 750, 1000]) {
  test(`Commerce and currency ${capturedTime === undefined ? "entry" : `return from ${capturedTime} ms`} matches the pinned React sources`, async ({ page }) => {
    test.setTimeout(60000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/commerce-currency-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), commerceCurrencyIcons.map(icon => icon.tag));
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("commerce-currency-seek", { detail: 0 }));
    });
    if (capturedTime !== undefined) {
      await page.evaluate(time => {
        document.dispatchEvent(new CustomEvent("commerce-currency-seek", { detail: time }));
        document.dispatchEvent(new CustomEvent("commerce-currency-capture-return", { detail: time }));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("commerce-currency-seek", { detail: 0 }));
      }, capturedTime);
    }
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "commerce-currency-seek",
      times: [0, 50, 100, 150, 200, 300, 400, 499, 500, 550, 600, 750, 900, 1000, 1300],
      origin: "wrapper" as const,
    });
    const result = compareUpstreamPoses(samples, `captured ${capturedTime ?? "entry"}`);
    expect(errors).toEqual([]);
    console.log(`Commerce and currency ${capturedTime ?? "entry"}: maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)} at 14, 16, 24 and 28 px.`);
  });
}

for (const icon of commerceCurrencyIcons) {
  test(`${icon.name} replays during delayed and active returns without stale cleanup`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const target = page.locator(`#controlled ${icon.tag}`);
    const result = await target.evaluate(async (element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const counts = [];
      for (const time of [100, 350]) {
        element.startAnimation();
        seek(550);
        element.stopAnimation();
        seek(time);
        element.startAnimation();
        seek(550);
        await new Promise(requestAnimationFrame);
        counts.push(element.getAnimations({ subtree: true }).length);
      }
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
      return counts;
    });
    expect(result.every(count => count > 0)).toBe(true);
    await expect.poll(() => target.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      clean: [...element.querySelectorAll<SVGElement>("svg, g, path, rect, line")].every(shape => !shape.style.transform && !shape.style.opacity && !shape.style.strokeDasharray && !shape.style.strokeDashoffset),
    }))).toEqual({ tracks: 0, clean: true });
  });
}
