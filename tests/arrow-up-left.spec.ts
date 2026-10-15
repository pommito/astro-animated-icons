import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
type ArrowElement = HTMLElement & IconHandle;

test("ArrowUpLeft renders all three paths and a usable native link without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/arrow-up-left/");
  const link = page.getByRole("link", { name: "ArrowUpLeft example", exact: true });
  await expect(link.locator("svg")).toBeVisible();
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  expect(await link.locator("path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d")))).toEqual(["M7 7H17", "M7 7V17", "M17 17L7 7"]);
  for (const path of await link.locator("path").all()) {
    await expect(path).toHaveCSS("stroke-dasharray", "none");
    await expect(path).toHaveCSS("stroke-linecap", "round");
    await expect(path).toHaveCSS("stroke-linejoin", "round");
  }
  await expect(link.locator("g")).toHaveCSS("transform", "none");
  await expect(page.getByRole("img", { name: "Up-left arrow" })).toBeVisible();
  expect(await link.locator("grave-arrow-up-left").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover runs one 500 ms group cycle with the top-left SVG pivot and no delayed tracks", async ({ page }) => {
  await page.goto("/arrow-up-left/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up-left"));
  const link = page.locator("#primary");
  await link.hover();
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(1);
  const result = await link.evaluate((element) => {
    const animation = element.getAnimations({ subtree: true })[0];
    animation.pause();
    animation.currentTime = 250;
    const group = element.querySelector("g")!;
    const style = getComputedStyle(group);
    const matrix = group.getCTM()!;
    return {
      transform: style.transform,
      origin: style.transformOrigin,
      box: style.transformBox,
      pivot: { x: matrix.a * 7 + matrix.e, y: matrix.d * 7 + matrix.f },
      duration: animation.effect!.getTiming().duration,
      iterations: animation.effect!.getTiming().iterations,
      delay: animation.effect!.getTiming().delay,
      easing: (animation.effect as KeyframeEffect).getKeyframes().map((frame) => frame.easing),
    };
  });
  expect(result.transform).toBe("matrix(0.85, 0, 0, 0.85, 4, 4)");
  expect(result.origin).toBe("7px 7px");
  expect(result.box).toBe("view-box");
  expect(result.pivot.x).toBeCloseTo(11 * 16 / 24, 4);
  expect(result.pivot.y).toBeCloseTo(11 * 16 / 24, 4);
  expect(result.duration).toBe(500);
  expect(result.iterations).toBe(1);
  expect(result.delay).toBe(0);
  expect(result.easing.slice(0, 2)).toEqual(["ease-in-out", "ease-in-out"]);
  await page.mouse.move(0, 0);
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(link.locator("g")).toHaveCSS("transform", "none");
});

test("standalone hover and manual control match entry, interruption and explicit replay", async ({ page }) => {
  await page.goto("/arrow-up-left/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up-left"));
  const standalone = page.locator("#standalone");
  await standalone.hover();
  await expect.poll(() => standalone.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(1);
  const control = page.locator("#controlled");
  const icon = control.locator("grave-arrow-up-left");
  await control.hover();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await control.click();
  const poses = await icon.evaluate((element: ArrowElement) => {
    const pose = () => getComputedStyle(element.querySelector("g")!).transform;
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 100; });
    const before = pose();
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const after = pose();
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    return { before, after, replay: pose() };
  });
  expect(poses.after).toBe(poses.before);
  expect(poses.replay).toBe("matrix(1, 0, 0, 1, 0, 0)");
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("g")).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await control.click();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} after rapid replay and queued finishes restores the complete drawing`, async ({ page }) => {
    await page.goto("/arrow-up-left/");
    await page.waitForFunction(() => !!customElements.get("grave-arrow-up-left"));
    const icon = await page.locator("#controlled grave-arrow-up-left").elementHandle();
    await icon!.evaluate((element: ArrowElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 250; });
      if (interruption === "stop") element.stopAnimation();
      if (interruption === "remove") element.remove();
    }, interruption);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => icon!.evaluate((element) => ({ tracks: element.getAnimations({ subtree: true }).length, transform: element.querySelector("g")!.style.transform }))).toEqual({ tracks: 0, transform: "" });
    await page.waitForTimeout(550);
    expect(await icon!.evaluate((element) => element.querySelector("g")!.style.transform)).toBe("");
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("an old completion cannot overwrite a newer paused group animation", async ({ page }) => {
  await page.goto("/arrow-up-left/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up-left"));
  const icon = page.locator("#controlled grave-arrow-up-left");
  await icon.evaluate((element: ArrowElement) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 250; });
  });
  await page.waitForTimeout(100);
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(1);
  await expect(icon.locator("g")).toHaveCSS("transform", "matrix(0.85, 0, 0, 0.85, 4, 4)");
  await icon.evaluate((element: ArrowElement) => element.stopAnimation());
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test("small-size entry and spring return match the independent fill-box reference", async ({ page }) => {
  await page.goto("/arrow-up-left-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-up-left"));
  for (const interruptionTime of [0, 50, 100, 250, 350]) {
    const samples = await page.evaluate((interruptionTime) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruptionTime; });
      if (interruptionTime) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const times = interruptionTime ? [0, 25, 50, 75, 100, 150, 200, 300, 500, 700] : [0, 50, 100, 150, 250, 350, 450, 500];
      const samples = times.flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].map((row) => {
          const pose = (selector: string) => {
            const svg = row.querySelector<SVGSVGElement>(selector)!;
            const group = svg.querySelector("g")!;
            const matrix = group.getScreenCTM()!;
            const bounds = svg.getBoundingClientRect();
            const points = [[7, 7], [17, 7], [7, 17], [17, 17]].flatMap(([x, y]) => {
              const point = new DOMPoint(x, y).matrixTransform(matrix);
              return [point.x - bounds.x, point.y - bounds.y];
            });
            return { points, scale: new DOMMatrix(getComputedStyle(group).transform).a, cap: getComputedStyle(group.querySelector("path")!).strokeLinecap };
          };
          return { time, size: row.getAttribute("data-size"), adapter: pose("[data-adapter] svg"), reference: pose("[data-reference] svg") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, interruptionTime);
    for (const sample of samples) {
      const message = `interrupted at ${interruptionTime}ms, ${sample.size}px, sample ${sample.time}ms`;
      sample.adapter.points.forEach((point, index) => expect(Math.abs(point - sample.reference.points[index]), message).toBeLessThan(0.03));
      expect(sample.adapter.scale, message).toBeCloseTo(sample.reference.scale, 3);
      expect(sample.adapter.cap).toBe("round");
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
