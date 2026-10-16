import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { pauseAnimationsOnPointer } from "./helpers/pause-animations.js";

type HomeElement = HTMLElement & IconHandle;

test("Home renders its complete accessible drawing without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/home/");
  const link = page.getByRole("link", { name: "Home example", exact: true });
  expect(await link.locator("path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d"))))
    .toEqual([
      "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
    ]);
  for (const path of await link.locator("path").all()) {
    await expect(path).toHaveCSS("opacity", "1");
    await expect(path).toHaveCSS("stroke-dasharray", "none");
    await expect(path).toHaveCSS("stroke-linecap", "round");
    await expect(path).toHaveCSS("stroke-linejoin", "round");
  }
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("img", { name: "Home icon" })).toBeVisible();
  expect(await link.locator("grave-home").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover reveals only the door in 600 ms with 200 ms opacity and holds the completed drawing", async ({ page }) => {
  await page.goto("/home/");
  await page.waitForFunction(() => !!customElements.get("grave-home"));
  const link = page.locator("#primary");
  await pauseAnimationsOnPointer(link);
  await link.hover();
  const result = await link.evaluate((element) => {
    const outline = element.querySelector("path")!;
    const door = element.querySelector<SVGPathElement>("path:last-child")!;
    const original = outline.outerHTML;
    const animations = element.getAnimations({ subtree: true });
    const timings = animations.map((animation) => {
      const timing = animation.effect!.getTiming();
      return [timing.delay, timing.duration, timing.iterations];
    });
    const samples = [0, 100, 200, 300, 600, 900].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      const style = getComputedStyle(door);
      return [Number(style.opacity), parseFloat(style.strokeDasharray) / door.getTotalLength()];
    });
    animations.forEach((animation) => animation.finish());
    return { timings, samples, original, after: outline.outerHTML, outlineTracks: outline.getAnimations().length };
  });
  expect(result.timings).toEqual([[0, 200, 1], [0, 600, 1]]);
  expect(result.samples[0]).toEqual([0, 0]);
  expect(result.samples[1][0]).toBeCloseTo(0.684643, 4);
  expect(result.samples[2][0]).toBe(1);
  expect(result.samples[3][1]).toBeCloseTo(0.684643, 4);
  expect(result.samples[4][1]).toBeCloseTo(1, 4);
  expect(result.samples[5]).toEqual(result.samples[4]);
  expect(result.after).toBe(result.original);
  expect(result.outlineTracks).toBe(0);
  await page.waitForTimeout(100);
  await expect(link.locator("path").last()).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await expect(link.locator("path").last()).toHaveAttribute("style", "");
});

for (const time of [50, 150, 350]) {
  test(`manual stop at ${time} ms returns continuously with the original durations`, async ({ page }) => {
    await page.goto("/home/");
    await page.waitForFunction(() => !!customElements.get("grave-home"));
    const control = page.locator("#controlled");
    await control.hover();
    expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const result = await control.locator("grave-home").evaluate((element: HomeElement, time) => {
      const door = element.querySelector<SVGPathElement>("path:last-child")!;
      const pose = () => {
        const style = getComputedStyle(door);
        return [Number(style.opacity), parseFloat(style.strokeDasharray) / door.getTotalLength()];
      };
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      const before = pose();
      element.stopAnimation();
      const animations = element.getAnimations({ subtree: true });
      animations.forEach((animation) => { animation.pause(); animation.currentTime = 0; });
      const start = pose();
      animations.forEach((animation) => { animation.currentTime = 300; });
      const middle = pose();
      const durations = animations.map((animation) => animation.effect!.getTiming().duration);
      animations.forEach((animation) => animation.finish());
      return { before, start, middle, durations };
    }, time);
    result.start.forEach((value, index) => expect(value).toBeCloseTo(result.before[index], 4));
    expect(result.durations).toEqual([200, 600]);
    expect(result.middle[0]).toBe(1);
    expect(result.middle[1]).toBeGreaterThan(result.before[1]);
    expect(result.middle[1]).toBeLessThan(1);
    await expect(control.locator("path").last()).toHaveAttribute("style", "");
  });
}

test("replaying during the door reveal restarts its keyframes and cancels previous tracks", async ({ page }) => {
  await page.goto("/home/");
  await page.waitForFunction(() => !!customElements.get("grave-home"));
  const result = await page.locator("#controlled grave-home").evaluate((element: HomeElement) => {
    element.startAnimation();
    const previous = element.getAnimations({ subtree: true });
    previous.forEach((animation) => { animation.pause(); animation.currentTime = 350; });
    element.startAnimation();
    const current = element.getAnimations({ subtree: true });
    current.forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const style = getComputedStyle(element.querySelector("path:last-child")!);
    return { previous: previous.map((animation) => animation.playState), count: current.length, opacity: style.opacity, dash: parseFloat(style.strokeDasharray) };
  });
  expect(result).toEqual({ previous: ["idle", "idle"], count: 2, opacity: "0", dash: 0 });
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} after rapid replay and queued completion restores the entire door`, async ({ page }) => {
    await page.goto("/home/");
    await page.waitForFunction(() => !!customElements.get("grave-home"));
    const icon = page.locator("#controlled grave-home");
    const instance = await icon.elementHandle();
    await icon.evaluate((element: HomeElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation(); element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 50; });
      if (interruption === "remove") element.remove();
      if (interruption === "stop") element.stopAnimation();
    }, interruption);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => instance!.evaluate((element) => ({
      count: element.getAnimations({ subtree: true }).length,
      styles: [...element.querySelectorAll("path")].map((path) => path.style.cssText),
    }))).toEqual({ count: 0, styles: ["", ""] });
    await page.waitForTimeout(650);
    expect(await instance!.evaluate((element) => [...element.querySelectorAll("path")].map((path) => path.style.cssText))).toEqual(["", ""]);
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("standalone hover and manual playback respect reduced motion", async ({ page }) => {
  await page.goto("/home/");
  await page.waitForFunction(() => !!customElements.get("grave-home"));
  await page.locator("#standalone").hover();
  await expect.poll(() => page.locator("#standalone").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#controlled").click();
  await page.locator("#stop-controlled").click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const path of await page.locator("path").all()) {
    await expect(path).toHaveCSS("opacity", "1");
    await expect(path).toHaveCSS("stroke-dasharray", "none");
  }
});

test("the door matches the normalized reference at small sizes during entry and interrupted return", async ({ page }) => {
  await page.goto("/home-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-home"));
  for (const interruption of [null, 50, 150, 350]) {
    const samples = await page.evaluate((interruption) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruption ?? 0; });
      if (interruption !== null) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const result = [0, 50, 100, 150, 200, 300, 450, 600, 900].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].map((row) => {
          const pose = (selector: string) => {
            const path = row.querySelector<SVGPathElement>(selector)!;
            const style = getComputedStyle(path);
            const box = path.getBoundingClientRect();
            const origin = path.ownerSVGElement!.getBoundingClientRect();
            return {
              opacity: Number(style.opacity), length: parseFloat(style.strokeDasharray) / (path.hasAttribute("pathLength") ? 1 : path.getTotalLength()),
              x: box.x - origin.x, y: box.y - origin.y, width: box.width, height: box.height,
            };
          };
          return { time, size: row.getAttribute("data-size"), adapter: pose("[data-adapter] path:last-child"), reference: pose("[data-reference] path:last-child") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return result;
    }, interruption);
    for (const sample of samples) {
      const message = `${interruption ?? "entry"}, ${sample.size}px, ${sample.time}ms`;
      for (const property of ["opacity", "length"] as const) expect(sample.adapter[property], message).toBeCloseTo(sample.reference[property], 4);
      for (const property of ["x", "y", "width", "height"] as const) expect(Math.abs(sample.adapter[property] - sample.reference[property]), message).toBeLessThan(0.03);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
