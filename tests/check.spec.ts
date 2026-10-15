import { expect, test } from "@playwright/test";
import { pauseAnimationsOnPointer } from "./helpers/pause-animations.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type CheckElement = HTMLElement & IconHandle;

test("controlled playback ignores hover and returns from an interrupted reveal", async ({ page }) => {
  await page.goto("/check/");
  await page.waitForFunction(() => !!customElements.get("grave-check"));
  const control = page.locator("#controlled");
  const icon = control.locator("grave-check");
  await control.hover();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  const poses = await icon.evaluate((element: CheckElement) => {
    const path = element.querySelector("path")!;
    const pose = () => {
      const style = getComputedStyle(path);
      return [Number(style.opacity), parseFloat(style.strokeDasharray), new DOMMatrix(style.transform).m11];
    };
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 50; });
    const before = pose();
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const returning = pose();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.currentTime = 100; });
    const opacityAt100 = pose()[0];
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    return { before, returning, opacityAt100 };
  });
  poses.returning.forEach((value, index) => expect(value).toBeCloseTo(poses.before[index], 4));
  expect(poses.opacityAt100).toBe(1);
  await expect(icon.locator("path")).toHaveCSS("transform", "none");
  await expect(icon.locator("path")).toHaveCSS("stroke-dasharray", "none");
  await control.click();
  await page.mouse.move(0, 0);
  await expect(icon.locator("path")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  await expect(icon.locator("path")).toHaveCSS("transform", "none");
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} after rapid retriggers and queued completions restores the full checkmark`, async ({ page }) => {
    await page.goto("/check/");
    await page.waitForFunction(() => !!customElements.get("grave-check"));
    const icon = page.locator("#controlled grave-check");
    const instance = await icon.elementHandle();
    const originalStyle = await icon.locator("path").evaluate((element: SVGElement) => element.style.cssText);
    const tracks = await icon.evaluate((element: CheckElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      const tracks = element.getAnimations({ subtree: true }).length;
      if (interruption === "remove") element.remove();
      if (interruption === "stop") element.stopAnimation();
      return tracks;
    }, interruption);
    expect(tracks).toBe(3);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => instance!.evaluate((element) => ({
      tracks: element.getAnimations({ subtree: true }).length,
      style: element.querySelector("path")!.style.cssText,
    }))).toEqual({ tracks: 0, style: originalStyle });
    await page.waitForTimeout(450);
    expect(await instance!.evaluate((element) => element.querySelector("path")!.style.cssText)).toBe(originalStyle);
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("reduced motion preserves the success state and ignores manual playback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/check/");
  const button = page.getByRole("button", { name: "Copy link", exact: true });
  await button.click();
  await page.getByRole("button", { name: "Resolve clipboard promise" }).click();
  await expect(page.getByRole("status")).toHaveText("Link copied");
  const icon = button.locator("grave-check");
  await expect(icon).toBeVisible();
  await icon.evaluate((element: CheckElement) => { element.startAnimation(); element.stopAnimation(); });
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("path")).toHaveCSS("opacity", "1");
  await expect(icon.locator("path")).toHaveCSS("stroke-dasharray", "none");
  await expect(icon.locator("path")).toHaveCSS("transform", "none");
  await expect(button).toHaveAccessibleName("Copy link");
});

test("the standalone icon reveals on hover with the default size", async ({ page }) => {
  await page.goto("/check/");
  await page.waitForFunction(() => !!customElements.get("grave-check"));
  const icon = page.locator("#standalone");
  await expect(icon.locator("svg")).toHaveAttribute("width", "28");
  await icon.hover();
  await expect(icon.locator("path")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await page.mouse.move(0, 0);
  await expect(icon.locator("path")).toHaveCSS("transform", "none");
});

test("small-size preview matches the independent normalized-path reference on reveal and interrupted return", async ({ page }) => {
  await page.goto("/check-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-check"));
  for (const returning of [false, true]) {
    const comparison = await page.evaluate((returning) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = 50; });
      if (returning) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = (returning ? [0, 50, 100, 150, 300] : [0, 25, 50, 100, 200, 400]).flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].map((row) => {
          const pose = (selector: string) => {
            const path = row.querySelector<SVGPathElement>(selector)!;
            const svg = path.ownerSVGElement!;
            const style = getComputedStyle(path);
            const box = path.getBoundingClientRect();
            const origin = svg.getBoundingClientRect();
            return {
              opacity: Number(style.opacity),
              length: parseFloat(style.strokeDasharray) / (path.hasAttribute("pathLength") ? 1 : path.getTotalLength()),
              x: box.x - origin.x,
              y: box.y - origin.y,
              width: box.width,
              height: box.height,
              cap: style.strokeLinecap,
              stroke: style.strokeWidth,
            };
          };
          return { time, size: row.getAttribute("data-size"), adapter: pose("[data-adapter] path"), reference: pose("[data-reference] path") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, returning);
    for (const sample of comparison) {
      const message = `${returning ? "return" : "reveal"}, ${sample.size}px, ${sample.time}ms`;
      expect(sample.adapter.opacity, message).toBeCloseTo(sample.reference.opacity, 4);
      expect(sample.adapter.length, message).toBeCloseTo(sample.reference.length, 4);
      for (const property of ["x", "y", "width", "height"] as const) {
        expect(Math.abs(sample.adapter[property] - sample.reference[property]), message).toBeLessThan(0.03);
      }
      expect(sample.adapter.cap).toBe("round");
      expect(sample.adapter.stroke).toBe("2px");
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const path of await page.locator("path").all()) {
    await expect(path).toHaveCSS("opacity", "1");
    await expect(path).toHaveCSS("transform", "none");
    await expect(path).toHaveCSS("stroke-dasharray", "none");
  }
});

test("the consumer reveals success only after its clipboard promise resolves", async ({ page }) => {
  await page.goto("/check/");
  const button = page.getByRole("button", { name: "Copy link", exact: true });
  await expect(button).toBeVisible();
  for (const outcome of ["reject", "resolve"] as const) {
    await button.click();
    await expect(page.getByRole("status")).toHaveText("Copying link");
    await expect(button.locator("grave-check")).toHaveCount(0);
    await expect(button.locator("grave-copy")).toBeVisible();
    const completion = page.getByRole("button", { name: outcome === "resolve" ? "Resolve clipboard promise" : "Reject clipboard promise" });
    await completion.evaluate((element) => element.addEventListener("click", () => {
      queueMicrotask(() => document.getAnimations().forEach((animation) => animation.pause()));
    }, { once: true }));
    await completion.click();
    await expect(button).toHaveAccessibleName("Copy link");
    if (outcome === "reject") {
      await expect(page.getByRole("status")).toHaveText("Could not copy link");
      await expect(button.locator("grave-check")).toHaveCount(0);
      expect(await button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    } else {
      await expect(page.getByRole("status")).toHaveText("Link copied");
      await expect(button.locator("grave-check")).toBeVisible();
      expect(await button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(3);
    }
  }
});

test("hover reveals the checkmark in 400 ms, holds it, and resets in 300 ms", async ({ page }) => {
  await page.goto("/check/");
  const link = page.locator("#primary");
  const path = link.locator("path");
  await page.waitForFunction(() => !!customElements.get("grave-check"));
  await link.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
  }, { once: true }));
  await link.hover();
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(3);
  const samples = await link.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    const path = element.querySelector("path")!;
    return [0, 50, 100, 200, 400].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      const style = getComputedStyle(path);
      return {
        opacity: Number(style.opacity),
        length: parseFloat(style.strokeDasharray) / path.getTotalLength(),
        scale: new DOMMatrix(style.transform).m11,
      };
    });
  });
  expect(samples[0]).toEqual({ opacity: 0, length: 0, scale: 0.5 });
  expect(samples[1].opacity).toBeCloseTo(0.5, 3);
  expect(samples[2].opacity).toBe(1);
  expect(samples[3].length).toBeCloseTo(0.5, 3);
  expect(samples[3].scale).toBeCloseTo(0.75, 3);
  expect(samples[4].length).toBeCloseTo(1, 3);
  expect(samples[4].scale).toBe(1);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect(path).toHaveCSS("opacity", "1");
  await page.waitForTimeout(150);
  await expect(path).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await pauseAnimationsOnPointer(link, "pointerleave");
  await page.mouse.move(0, 0);
  const durations = await link.evaluate((element) => element.getAnimations({ subtree: true }).map((animation) => animation.effect!.getTiming().duration).sort());
  expect(durations).toEqual([100, 300, 300]);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect(path).toHaveCSS("transform", "none");
  await expect(path).toHaveCSS("stroke-dasharray", "none");
  await expect(path).toHaveCSS("opacity", "1");
});

test("Check renders the complete accessible checkmark before JavaScript runs", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/check/");
  const link = page.getByRole("link", { name: "Check example", exact: true });
  const path = link.locator("path");
  await expect(path).toHaveAttribute("d", "M4 12 9 17L20 6");
  await expect(path).toHaveCSS("opacity", "1");
  await expect(path).toHaveCSS("stroke-dasharray", "none");
  await expect(path).toHaveCSS("transform", "none");
  await expect(path).toHaveCSS("stroke-linecap", "round");
  await expect(path).toHaveCSS("stroke-linejoin", "round");
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("img", { name: "Check icon" })).toBeVisible();
  expect(await link.locator("grave-check").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});
