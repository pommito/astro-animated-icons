import { expect, test } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

for (const slug of ["coffee"]) {
  test(`${slug} cancels looping work and reconnects to a new control`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
    await icon!.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 1600; });
      element.remove();
    });
    const read = () => icon!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      clean: [...element.querySelectorAll<SVGElement>("svg, g, path, circle")].every(shape => !shape.style.opacity && !shape.style.transform),
      bubbles: [...element.querySelectorAll("circle")].every(shape => shape.getAttribute("opacity") === "0" && (!element.isConnected || getComputedStyle(shape).opacity === "0")),
    }));
    await expect.poll(read).toEqual({ tracks: 0, clean: true, bubbles: true });
    await page.locator("#secondary").evaluate((control, icon) => {
      icon!.removeAttribute("data-controlled");
      control.append(icon!);
    }, icon);
    await page.locator("#controlled").hover();
    expect((await read()).tracks).toBe(0);
    await page.locator("#secondary").hover();
    await expect.poll(async () => (await read()).tracks).toBeGreaterThan(0);
    await page.mouse.move(0, 0);
    await expect.poll(read).toEqual({ tracks: 0, clean: true, bubbles: true });
    await page.waitForTimeout(1700);
    expect(await read()).toEqual({ tracks: 0, clean: true, bubbles: true });
  });
}

test("CupSoda keeps bubbles hidden at rest and retains a finite straw beside independent loops", async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/cup-soda/");
  expect(await staticPage.locator("#primary circle").evaluateAll(circles => circles.map(circle => getComputedStyle(circle).opacity))).toEqual(["0", "0", "0", "0", "0"]);
  expect(await staticPage.locator("#primary svg").evaluate(svg => getComputedStyle(svg).overflow)).toBe("hidden");
  await context.close();
  await page.goto("/cup-soda/");
  await page.waitForFunction(() => !!customElements.get("grave-cup-soda"));
  const result = await page.locator("#controlled grave-cup-soda").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    return element.getAnimations({ subtree: true }).map(animation => ({
      part: ((animation.effect as KeyframeEffect).target as Element).getAttribute("data-part"),
      timing: animation.effect!.getTiming(),
    }));
  });
  expect(result.filter(track => track.part === "3").map(track => [track.timing.duration, track.timing.iterations])).toEqual([[500, 1]]);
  expect(result.filter(track => track.part === "2").map(track => [track.timing.duration, track.timing.iterations])).toEqual([[1800, Infinity]]);
  expect(result.filter(track => Number(track.part) >= 4).map(track => track.timing.delay ?? 0).sort((a, b) => a - b)).toEqual([0, 0, 350, 350, 550, 550, 700, 700, 1050, 1050]);
});
