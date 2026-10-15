import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
type ArrowElement = HTMLElement & IconHandle;

test("ArrowUp renders the full SVG and usable control without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/arrow-up/");
  const link = page.getByRole("link", { name: "ArrowUp example", exact: true });
  await expect(link.locator("svg")).toBeVisible();
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(link.locator("path").first()).toHaveAttribute("d", "m5 12 7-7 7 7");
  await expect(link.locator("path").nth(1)).toHaveAttribute("d", "M12 19V5");
  for (const path of await link.locator("path").all()) {
    await expect(path).toHaveCSS("stroke-dasharray", "none");
    await expect(path).toHaveCSS("transform", "none");
    await expect(path).toHaveCSS("stroke-linecap", "round");
    await expect(path).toHaveCSS("stroke-linejoin", "round");
  }
  await expect(page.getByRole("img", { name: "Up arrow" })).toBeVisible();
  expect(await link.locator("grave-arrow-up").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover runs one 400 ms cycle with a fixed shaft bottom and a three-unit head movement", async ({ page }) => {
  await page.goto("/arrow-up/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up"));
  const link = page.locator("#primary");
  await link.hover();
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  const result = await link.evaluate((element) => {
    const [head, shaft] = element.querySelectorAll("path");
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => { animation.pause(); animation.currentTime = 200; });
    return {
      y: new DOMMatrix(getComputedStyle(head).transform).m42,
      dash: getComputedStyle(shaft).strokeDasharray,
      bottom: shaft.getPointAtLength(0).y,
      transform: getComputedStyle(shaft).transform,
      timing: animations.map((animation) => ({ duration: animation.effect!.getTiming().duration, iterations: animation.effect!.getTiming().iterations, delay: animation.effect!.getTiming().delay })),
    };
  });
  expect(result).toEqual({ y: 3, dash: "9px, 14px", bottom: 19, transform: "none", timing: Array(2).fill({ duration: 400, iterations: 1, delay: 0 }) });
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(link.locator("path").first()).toHaveCSS("transform", "none");
  await expect(link.locator("path").nth(1)).toHaveCSS("stroke-dasharray", "none");
});

test("standalone hover and controlled manual start and stop respect their trigger contracts", async ({ page }) => {
  await page.goto("/arrow-up/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up"));
  const standalone = page.locator("#standalone");
  await standalone.hover();
  await expect.poll(() => standalone.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  const control = page.locator("#controlled");
  const icon = control.locator("grave-arrow-up");
  await control.hover();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await control.click();
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  const poses = await icon.evaluate((element: ArrowElement) => {
    const pose = () => [...element.querySelectorAll("path")].map((path) => [getComputedStyle(path).transform, getComputedStyle(path).strokeDasharray]);
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 100; });
    const before = pose();
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    return { before, after: pose() };
  });
  expect(poses.after).toEqual(poses.before);
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("path").first()).toHaveCSS("transform", "none");
  await expect(icon.locator("path").nth(1)).toHaveCSS("stroke-dasharray", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await control.click();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} after rapid replay and queued finish events cannot alter the newer drawing`, async ({ page }) => {
    await page.goto("/arrow-up/");
    await page.waitForFunction(() => !!customElements.get("grave-arrow-up"));
    const icon = await page.locator("#controlled grave-arrow-up").elementHandle();
    await icon!.evaluate((element: ArrowElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 200; });
      if (interruption === "stop") element.stopAnimation();
      if (interruption === "remove") element.remove();
    }, interruption);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => icon!.evaluate((element) => ({
      tracks: element.getAnimations({ subtree: true }).length,
      styles: [...element.querySelectorAll("path")].map((path) => path.style.cssText),
    }))).toEqual({ tracks: 0, styles: ["", ""] });
    await page.waitForTimeout(450);
    expect(await icon!.evaluate((element) => [...element.querySelectorAll("path")].map((path) => path.style.cssText))).toEqual(["", ""]);
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("an old completion cannot clear a new paused playback", async ({ page }) => {
  await page.goto("/arrow-up/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up"));
  const icon = page.locator("#controlled grave-arrow-up");
  await icon.evaluate((element: ArrowElement) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 200; });
  });
  await page.waitForTimeout(100);
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await expect(icon.locator("path").first()).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 3)");
  await expect(icon.locator("path").nth(1)).toHaveCSS("stroke-dasharray", "9px, 14px");
  await icon.evaluate((element: ArrowElement) => element.stopAnimation());
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test("small-size drawing matches independent path morphing and spring return", async ({ page }) => {
  await page.goto("/arrow-up-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up"));
  for (const interruptionTime of [0, 50, 200]) {
    const returning = interruptionTime > 0;
    const samples = await page.evaluate(({ returning, interruptionTime }) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruptionTime; });
      if (returning) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = (returning ? [0, 50, 100, 150, 200, 300, 400, 600] : [0, 50, 100, 150, 200, 250, 300, 350, 400]).flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].map((row) => {
          const pose = (selector: string, adapter: boolean) => {
            const svg = row.querySelector<SVGSVGElement>(selector)!;
            const [head, shaft] = svg.querySelectorAll("path");
            const headStyle = getComputedStyle(head);
            const shaftStyle = getComputedStyle(shaft);
            const length = adapter ? parseFloat(shaftStyle.strokeDasharray) : shaft.getTotalLength();
            const matrix = svg.getScreenCTM()!;
            return { head: new DOMMatrix(headStyle.transform).m42 * matrix.d, top: (19 - length) * matrix.d, bottom: 19 * matrix.d, cap: shaftStyle.strokeLinecap, stroke: shaftStyle.strokeWidth };
          };
          return { time, size: row.getAttribute("data-size"), adapter: pose("[data-adapter] svg", true), reference: pose("[data-reference] svg", false) };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, { returning, interruptionTime });
    for (const sample of samples) {
      const message = `${returning ? "return" : "entry"}, ${sample.size}px, ${sample.time}ms`;
      for (const property of ["head", "top", "bottom"] as const) expect(Math.abs(sample.adapter[property] - sample.reference[property]), message).toBeLessThan(0.03);
      expect(sample.adapter.cap).toBe("round");
      expect(sample.adapter.stroke).toBe("2px");
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
