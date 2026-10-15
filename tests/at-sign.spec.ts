import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type AtSignElement = HTMLElement & IconHandle;

test("AtSign renders the complete accessible drawing without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/at-sign/");
  const link = page.getByRole("link", { name: "AtSign example", exact: true });
  await expect(link.locator("circle")).toHaveAttribute("cx", "12");
  await expect(link.locator("circle")).toHaveAttribute("cy", "12");
  await expect(link.locator("circle")).toHaveAttribute("r", "4");
  await expect(link.locator("path")).toHaveAttribute("d", "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8");
  for (const shape of await link.locator("circle, path").all()) {
    await expect(shape).toHaveCSS("opacity", "1");
    await expect(shape).toHaveCSS("stroke-dasharray", "none");
    await expect(shape).toHaveCSS("stroke-dashoffset", "0px");
    await expect(shape).toHaveCSS("stroke-linecap", "round");
    await expect(shape).toHaveCSS("stroke-linejoin", "round");
  }
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("img", { name: "AtSign icon" })).toBeVisible();
  expect(await link.locator("grave-at-sign").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover reveals the circle then the delayed outer path and holds the complete drawing", async ({ page }) => {
  await page.goto("/at-sign/");
  await page.waitForFunction(() => !!customElements.get("grave-at-sign"));
  const link = page.locator("#primary");
  await link.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
  }, { once: true }));
  await link.hover();
  const samples = await link.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    const circle = element.querySelector("circle")!;
    const path = element.querySelector("path")!;
    const pose = (shape: SVGGeometryElement) => {
      const style = getComputedStyle(shape);
      return {
        opacity: Number(style.opacity),
        length: parseFloat(style.strokeDasharray) / shape.getTotalLength(),
        offset: parseFloat(style.strokeDashoffset) / shape.getTotalLength(),
      };
    };
    return [0, 50, 100, 150, 299, 300, 350, 400, 450, 600].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return { time, circle: pose(circle), path: pose(path) };
    });
  });
  expect(samples[0].circle.opacity).toBe(0);
  expect(samples[0].circle.length).toBe(0);
  expect(samples[0].circle.offset).toBeCloseTo(-1, 4);
  expect(samples[1].circle.opacity).toBeCloseTo(0.5, 4);
  expect(samples[2].circle.opacity).toBe(1);
  expect(samples[3].circle.length).toBeCloseTo(0.5, 4);
  expect(samples[3].circle.offset).toBeCloseTo(-0.5, 4);
  expect(samples[4].path.opacity).toBe(0);
  expect(samples[4].path.length).toBe(0);
  expect(samples[5].circle.length).toBeCloseTo(1, 4);
  expect(samples[6].path.opacity).toBeCloseTo(0.5, 4);
  expect(samples[7].path.opacity).toBe(1);
  expect(samples[8].path.length).toBeCloseTo(0.5, 4);
  expect(samples[9].path.length).toBeCloseTo(1, 4);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await page.waitForTimeout(100);
  await expect(link.locator("circle")).toHaveCSS("opacity", "1");
  await expect(link.locator("path")).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await expect(link.locator("circle")).toHaveCSS("stroke-dasharray", "none");
  await expect(link.locator("path")).toHaveCSS("stroke-dasharray", "none");
});

for (const time of [50, 350]) {
  test(`manual stop at ${time} ms preserves the current pose and the outer return delay`, async ({ page }) => {
    await page.goto("/at-sign/");
    await page.waitForFunction(() => !!customElements.get("grave-at-sign"));
    const control = page.locator("#controlled");
    await control.hover();
    expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const result = await control.locator("grave-at-sign").evaluate((element: AtSignElement, time) => {
      const pose = () => [...element.querySelectorAll("circle, path")].flatMap((shape) => {
        const style = getComputedStyle(shape);
        return [Number(style.opacity), parseFloat(style.strokeDasharray), parseFloat(style.strokeDashoffset)];
      });
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      const before = pose();
      element.stopAnimation();
      const animations = element.getAnimations({ subtree: true });
      const timings = animations.map((animation) => {
        animation.pause(); animation.currentTime = 0;
        const timing = animation.effect!.getTiming();
        return [timing.delay, timing.duration];
      });
      const start = pose();
      animations.forEach((animation) => { animation.currentTime = 299; });
      const delayed = pose();
      animations.forEach((animation) => animation.finish());
      return { before, start, delayed, timings };
    }, time);
    result.start.forEach((value, index) => expect(value).toBeCloseTo(result.before[index], 4));
    result.delayed.slice(3).forEach((value, index) => expect(value).toBeCloseTo(result.before[index + 3], 4));
    expect(result.timings).toEqual([[0, 100], [0, 400], [0, 400], [300, 100], [300, 300]]);
    for (const shape of await control.locator("circle, path").all()) await expect(shape).toHaveAttribute("style", "");
  });
}

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} cancels delayed tracks after rapid replay and queued completion`, async ({ page }) => {
    await page.goto("/at-sign/");
    await page.waitForFunction(() => !!customElements.get("grave-at-sign"));
    const icon = page.locator("#controlled grave-at-sign");
    const instance = await icon.elementHandle();
    const count = await icon.evaluate((element: AtSignElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 50; });
      const count = element.getAnimations({ subtree: true }).length;
      if (interruption === "remove") element.remove();
      if (interruption === "stop") element.stopAnimation();
      return count;
    }, interruption);
    expect(count).toBe(5);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => instance!.evaluate((element) => ({
      count: element.getAnimations({ subtree: true }).length,
      styles: [...element.querySelectorAll<SVGElement>("circle, path")].map((shape) => shape.style.cssText),
    }))).toEqual({ count: 0, styles: ["", ""] });
    await page.waitForTimeout(650);
    expect(await instance!.evaluate((element) => [...element.querySelectorAll<SVGElement>("circle, path")].map((shape) => shape.style.cssText))).toEqual(["", ""]);
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("standalone hover and manual playback respect reduced motion", async ({ page }) => {
  await page.goto("/at-sign/");
  await page.waitForFunction(() => !!customElements.get("grave-at-sign"));
  const icon = page.locator("#standalone");
  await expect(icon.locator("svg")).toHaveAttribute("width", "28");
  await icon.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
  }, { once: true }));
  await icon.hover();
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(5);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#controlled").click();
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const shape of await page.locator("circle, path").all()) {
    await expect(shape).toHaveCSS("opacity", "1");
    await expect(shape).toHaveCSS("stroke-dasharray", "none");
    await expect(shape).toHaveCSS("stroke-dashoffset", "0px");
  }
});

test("small-size drawing matches the independent normalized-path reference on entry and interrupted returns", async ({ page }) => {
  await page.goto("/at-sign-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-at-sign"));
  for (const interruption of [null, 50, 350]) {
    const comparison = await page.evaluate((interruption) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruption ?? 0; });
      if (interruption !== null) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = [0, 25, 50, 100, 150, 299, 300, 350, 400, 450, 600].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].flatMap((row) => ["circle", "path"].map((shape) => {
          const pose = (selector: string) => {
            const drawing = row.querySelector<SVGGeometryElement>(selector)!;
            const style = getComputedStyle(drawing);
            const box = drawing.getBoundingClientRect();
            const origin = drawing.ownerSVGElement!.getBoundingClientRect();
            const length = drawing.hasAttribute("pathLength") ? 1 : drawing.getTotalLength();
            return {
              opacity: Number(style.opacity), length: parseFloat(style.strokeDasharray) / length,
              offset: parseFloat(style.strokeDashoffset) / length,
              x: box.x - origin.x, y: box.y - origin.y, width: box.width, height: box.height,
            };
          };
          return { time, shape, size: row.getAttribute("data-size"), adapter: pose(`[data-adapter] ${shape}`), reference: pose(`[data-reference] ${shape}`) };
        }));
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, interruption);
    for (const sample of comparison) {
      const message = `${interruption === null ? "entry" : `return at ${interruption}ms`}, ${sample.size}px, ${sample.shape}, ${sample.time}ms`;
      for (const property of ["opacity", "length", "offset"] as const) expect(sample.adapter[property], message).toBeCloseTo(sample.reference[property], 4);
      for (const property of ["x", "y", "width", "height"] as const) expect(Math.abs(sample.adapter[property] - sample.reference[property]), message).toBeLessThan(0.03);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const shape of await page.locator("circle, path").all()) {
    await expect(shape).toHaveCSS("opacity", "1");
    await expect(shape).toHaveCSS("stroke-dasharray", "none");
    await expect(shape).toHaveCSS("stroke-dashoffset", "0px");
  }
});
