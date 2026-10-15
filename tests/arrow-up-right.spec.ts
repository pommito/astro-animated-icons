import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
type ArrowElement = HTMLElement & IconHandle;

test("ArrowUpRight renders the complete drawing and usable link without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/arrow-up-right/");
  const link = page.getByRole("link", { name: "ArrowUpRight example", exact: true });
  await expect(link.locator("svg")).toBeVisible();
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  expect(await link.locator("path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d")))).toEqual(["M7 7H17", "M17 7V17", "M7 17L17 7"]);
  await expect(link.locator("g")).toHaveCSS("transform", "none");
  for (const path of await link.locator("path").all()) {
    await expect(path).toHaveCSS("stroke-linecap", "round");
    await expect(path).toHaveCSS("stroke-linejoin", "round");
  }
  await expect(page.getByRole("img", { name: "Up-right arrow" })).toBeVisible();
  expect(await link.locator("grave-arrow-up-right").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover runs a single 500 ms cycle around the drawing's top-right corner", async ({ page }) => {
  await page.goto("/arrow-up-right/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up-right"));
  const link = page.locator("#primary");
  await link.hover();
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(1);
  const result = await link.evaluate((element) => {
    const drawing = element.querySelector("g")!;
    const animation = drawing.getAnimations()[0];
    animation.pause();
    animation.currentTime = 250;
    const matrix = new DOMMatrix(getComputedStyle(drawing).transform);
    const { duration, iterations, delay } = animation.effect!.getTiming();
    const point = new DOMPoint(17, 7).matrixTransform(drawing.getCTM()!);
    const svg = element.querySelector("svg")!;
    return { scale: matrix.a, x: matrix.m41, y: matrix.m42, origin: getComputedStyle(drawing).transformOrigin, box: getComputedStyle(drawing).transformBox, duration, iterations, delay, pivotX: point.x * 24 / svg.width.baseVal.value, pivotY: point.y * 24 / svg.height.baseVal.value };
  });
  expect(result).toMatchObject({ scale: 0.85, x: -4, y: 4, origin: "17px 7px", box: "view-box", duration: 500, iterations: 1, delay: 0 });
  expect(result.pivotX).toBeCloseTo(13, 5);
  expect(result.pivotY).toBeCloseTo(11, 5);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(link.locator("g")).toHaveCSS("transform", "none");
});

test("standalone and controlled playback follow the shared contract and preserve the interrupted pose", async ({ page }) => {
  await page.goto("/arrow-up-right/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up-right"));
  await page.locator("#standalone").hover();
  await expect.poll(() => page.locator("#standalone").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(1);
  const control = page.locator("#controlled");
  const icon = control.locator("grave-arrow-up-right");
  await control.hover();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await control.click();
  const poses = await icon.evaluate((element: ArrowElement) => {
    const pose = () => getComputedStyle(element.querySelector("g")!).transform;
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 100; });
    const before = pose();
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    return { before, after: pose() };
  });
  expect(poses.after).toEqual(poses.before);
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("g")).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await control.click();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("g")).toHaveCSS("transform", "none");
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} after rapid replay and queued finish events cannot alter the new drawing`, async ({ page }) => {
    await page.goto("/arrow-up-right/");
    await page.waitForFunction(() => !!customElements.get("grave-arrow-up-right"));
    const icon = await page.locator("#controlled grave-arrow-up-right").elementHandle();
    await icon!.evaluate((element: ArrowElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 250; });
      if (interruption === "stop") element.stopAnimation();
      if (interruption === "reduce") element.stopAnimation();
      if (interruption === "remove") element.remove();
    }, interruption);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => icon!.evaluate((element) => ({ tracks: element.getAnimations({ subtree: true }).length, transform: element.querySelector("g")!.style.transform }))).toEqual({ tracks: 0, transform: "" });
    await page.waitForTimeout(550);
    expect(await icon!.evaluate((element) => element.querySelector("g")!.style.transform)).toBe("");
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("an old completion cannot clear a newer paused playback", async ({ page }) => {
  await page.goto("/arrow-up-right/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up-right"));
  const icon = page.locator("#controlled grave-arrow-up-right");
  await icon.evaluate((element: ArrowElement) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 250; });
  });
  await page.waitForTimeout(100);
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(1);
  await expect(icon.locator("g")).toHaveCSS("transform", "matrix(0.85, 0, 0, 0.85, -4, 4)");
  await icon.evaluate((element: ArrowElement) => element.stopAnimation());
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test("small-size entry and interrupted returns match an independent reference", async ({ page }) => {
  await page.goto("/arrow-up-right-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up-right"));
  for (const interruptionTime of [0, 50, 125, 250, 350]) {
    const samples = await page.evaluate((interruptionTime) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruptionTime; });
      if (interruptionTime) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = [0, 25, 50, 100, 125, 200, 250, 300, 400, 500, 700].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].map((row) => {
          const pose = (selector: string) => {
            const drawing = row.querySelector<SVGGElement>(selector)!;
            const matrix = drawing.getCTM()!;
            return [new DOMPoint(7, 17), new DOMPoint(17, 7), new DOMPoint(17, 17)].flatMap((point) => {
              const transformed = point.matrixTransform(matrix);
              return [transformed.x, transformed.y];
            });
          };
          return { time, size: row.getAttribute("data-size"), adapter: pose("[data-adapter] g"), reference: pose("[data-reference] g") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, interruptionTime);
    for (const sample of samples) {
      sample.adapter.forEach((value, index) => expect(Math.abs(value - sample.reference[index]), `${sample.size}px, interrupted at ${interruptionTime}ms, sample ${sample.time}ms`).toBeLessThan(0.03));
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
