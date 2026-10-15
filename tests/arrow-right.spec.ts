import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type ArrowRightElement = HTMLElement & IconHandle;

test("ArrowRight renders its complete drawing and a usable native link without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/arrow-right/");
  const link = page.getByRole("link", { name: "Next article 14 px", exact: true });
  const svg = link.locator("svg");
  await expect(svg).toBeVisible();
  await expect(svg).toHaveAttribute("width", "14");
  await expect(svg).toHaveAttribute("height", "14");
  await expect(svg).toHaveAttribute("stroke", "currentColor");
  await expect(svg).toHaveAttribute("stroke-width", "2");
  await expect(svg).toHaveAttribute("stroke-linecap", "round");
  await expect(svg).toHaveAttribute("stroke-linejoin", "round");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
  await expect(svg.locator("path").nth(0)).toHaveAttribute("d", "M5 12h14");
  await expect(svg.locator("path").nth(1)).toHaveAttribute("d", "m12 5 7 7-7 7");
  await expect(svg.locator("path").first()).toHaveCSS("stroke-dasharray", "none");
  expect(await link.locator("grave-arrow-right").getAttribute("tabindex")).toBeNull();
  await expect(page.getByRole("img", { name: "Right arrow" })).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover runs one 400 ms compression cycle and restores the complete arrow", async ({ page }) => {
  await page.goto("/arrow-right/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-right"));
  const link = page.locator("#primary");
  await link.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
  }, { once: true }));
  await link.hover();
  const samples = await link.evaluate((element) => {
    const [shaft, head] = element.querySelectorAll("path");
    const animations = element.getAnimations({ subtree: true });
    const timing = animations.map((animation) => animation.effect!.getTiming());
    const poses = [0, 100, 200, 300, 400].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return { x: new DOMMatrix(getComputedStyle(head).transform).m41, length: parseFloat(getComputedStyle(shaft).strokeDasharray) };
    });
    animations.forEach((animation) => animation.finish());
    return { poses, timing };
  });
  expect(samples.timing.map((timing) => timing.duration)).toEqual([400, 400]);
  expect(samples.timing.every((timing) => timing.iterations === 1 && timing.delay === 0)).toBe(true);
  expect(samples.poses[0]).toEqual({ x: 0, length: 14 });
  expect(samples.poses[2]).toEqual({ x: -3, length: 9 });
  expect(samples.poses[4]).toEqual({ x: 0, length: 14 });
  expect(samples.poses[1].x).toBeCloseTo(-2.05393, 3);
  expect(samples.poses[3].x).toBeCloseTo(-0.94607, 3);
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(link.locator("path").first()).toHaveCSS("stroke-dasharray", "none");
  await expect(link.locator("path").nth(1)).toHaveCSS("transform", "none");
  await page.waitForTimeout(450);
  expect(await link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test("controlled playback ignores hover and preserves its pose through stop and rapid replay", async ({ page }) => {
  await page.goto("/arrow-right/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-right"));
  const control = page.locator("#controlled");
  const icon = control.locator("grave-arrow-right");
  await control.hover();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  const samples = await icon.evaluate((element: ArrowRightElement) => {
    const pose = () => {
      const [shaft, head] = element.querySelectorAll("path");
      return [parseFloat(getComputedStyle(shaft).strokeDasharray), new DOMMatrix(getComputedStyle(head).transform).m41];
    };
    const seek = (time: number) => element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
    element.startAnimation();
    seek(100);
    const before = pose();
    element.stopAnimation();
    seek(0);
    const returning = pose();
    seek(10);
    const inherited = pose();
    seek(0);
    const durations = element.getAnimations({ subtree: true }).map((animation) => animation.effect!.getTiming().duration);
    element.startAnimation();
    seek(0);
    const restarted = pose();
    for (let cycle = 0; cycle < 5; cycle++) { element.stopAnimation(); element.startAnimation(); }
    seek(200);
    const peak = pose();
    return { before, returning, restarted, peak, inherited, durations, tracks: element.getAnimations({ subtree: true }).length };
  });
  expect(samples.durations).toContain(300);
  expect(samples.durations.every((duration) => Number(duration) > 0)).toBe(true);
  expect(samples.inherited[1]).toBeLessThan(samples.before[1]);
  samples.before.forEach((value, index) => {
    expect(samples.returning[index]).toBeCloseTo(value, 4);
    expect(samples.restarted[index]).toBeCloseTo(value, 4);
  });
  expect(samples.peak).toEqual([9, -3]);
  expect(samples.tracks).toBe(2);
  await page.mouse.move(0, 0);
  await expect(icon.locator("path").first()).toHaveCSS("stroke-dasharray", "9px, 14px");
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  await expect(icon.locator("path").first()).toHaveCSS("stroke-dasharray", "none");
  await expect(icon.locator("path").nth(1)).toHaveCSS("transform", "none");
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} after queued completions and restart leaves no late ArrowRight styles`, async ({ page }) => {
    await page.goto("/arrow-right/");
    await page.waitForFunction(() => !!customElements.get("grave-arrow-right"));
    const icon = page.locator("#controlled grave-arrow-right");
    const instance = await icon.elementHandle();
    await icon.evaluate((element: ArrowRightElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      if (interruption === "remove") element.remove();
      if (interruption === "stop") element.stopAnimation();
    }, interruption);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => instance!.evaluate((element) => ({
      tracks: element.getAnimations({ subtree: true }).length,
      styles: [...element.querySelectorAll("path")].map((part) => part.style.cssText),
    }))).toEqual({ tracks: 0, styles: ["", ""] });
    await page.waitForTimeout(450);
    expect(await instance!.evaluate((element) => [...element.querySelectorAll("path")].map((part) => part.style.cssText))).toEqual(["", ""]);
    expect(await page.locator("#primary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("standalone hover works and manual calls remain static under reduced motion", async ({ page }) => {
  await page.goto("/arrow-right/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-right"));
  await page.locator("#standalone").hover();
  await expect.poll(() => page.locator("#standalone").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#controlled grave-arrow-right").evaluate((element: ArrowRightElement) => { element.startAnimation(); element.stopAnimation(); });
  await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const path of await page.locator("path").all()) {
    await expect(path).toHaveCSS("stroke-dasharray", "none");
    await expect(path).toHaveCSS("transform", "none");
  }
});

test("the small-size preview matches independent path morphing during compression and interrupted return", async ({ page }) => {
  await page.goto("/arrow-right-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-right"));
  for (const returning of [false, true]) {
    const comparisons = await page.evaluate((returning) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = 100; });
      if (returning) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = (returning ? [0, 30, 60, 120, 200, 300, 500] : [0, 50, 100, 150, 200, 250, 300, 350, 400]).flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].map((row) => {
          const pose = (selector: string) => {
            const [shaft, head] = row.querySelectorAll<SVGPathElement>(`${selector} path`);
            const style = getComputedStyle(shaft);
            const length = style.strokeDasharray === "none" ? shaft.getTotalLength() : parseFloat(style.strokeDasharray);
            const origin = shaft.ownerSVGElement!.getScreenCTM()!;
            const start = new DOMPoint(5, 12).matrixTransform(shaft.getScreenCTM()!);
            const end = new DOMPoint(5 + length, 12).matrixTransform(shaft.getScreenCTM()!);
            return { start: start.x - origin.e, end: end.x - origin.e, head: head.getScreenCTM()!.e - origin.e, width: style.strokeWidth, cap: style.strokeLinecap };
          };
          return { time, size: row.getAttribute("data-size"), adapter: pose("[data-adapter]"), reference: pose("[data-reference]") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, returning);
    for (const sample of comparisons) {
      const message = `${returning ? "return" : "entry"}, ${sample.size}px, ${sample.time}ms`;
      for (const property of ["start", "end", "head"] as const) {
        expect(Math.abs(sample.adapter[property] - sample.reference[property]), message).toBeLessThan(0.03);
      }
      expect(sample.adapter.start).toBeCloseTo(5 * Number(sample.size) / 24, 4);
      expect(sample.adapter.width).toBe("2px");
      expect(sample.adapter.cap).toBe("round");
      if (!returning && sample.time === 200) expect(sample.adapter.head).toBeCloseTo(-3 * Number(sample.size) / 24, 4);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
});
