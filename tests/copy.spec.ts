import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type CopyElement = HTMLElement & IconHandle;

test("Copy renders its complete SVG and a working native link without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/copy/");
  const link = page.getByRole("link", { name: "Copy example", exact: true });
  const svg = link.locator("svg");
  await expect(svg).toBeVisible();
  await expect(svg).toHaveAttribute("width", "16");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
  await expect(svg).toHaveAttribute("stroke", "currentColor");
  await expect(svg).toHaveAttribute("stroke-width", "2");
  await expect(svg.locator("rect")).toHaveAttribute("x", "8");
  await expect(svg.locator("rect")).toHaveAttribute("y", "8");
  await expect(svg.locator("rect")).toHaveAttribute("width", "14");
  await expect(svg.locator("rect")).toHaveAttribute("height", "14");
  await expect(svg.locator("path")).toHaveAttribute("d", "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2");
  await expect(page.getByRole("img", { name: "Copy icon" })).toBeVisible();
  expect(await link.locator("grave-copy").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover separates the shapes with the upstream spring, holds, and returns on leave", async ({ page }) => {
  await page.goto("/copy/");
  const link = page.locator("#primary");
  const front = link.locator("rect");
  const back = link.locator("path");
  await expect(front).toHaveCSS("transform", "none");
  await link.hover();
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  const samples = await link.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    return [100, 200, 350].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return [...element.querySelectorAll("rect, path")].map((part) => {
        const matrix = new DOMMatrix(getComputedStyle(part).transform);
        return [matrix.m41, matrix.m42];
      });
    });
  });
  for (const [index, travel] of [1.30303, 2.68869, 3.17069].entries()) {
    expect(samples[index][0][0]).toBeCloseTo(-travel, 1);
    expect(samples[index][0][1]).toBeCloseTo(-travel, 1);
    expect(samples[index][1][0]).toBeCloseTo(travel, 1);
    expect(samples[index][1][1]).toBeCloseTo(travel, 1);
  }
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect(front).toHaveCSS("transform", "matrix(1, 0, 0, 1, -3, -3)");
  await expect(back).toHaveCSS("transform", "matrix(1, 0, 0, 1, 3, 3)");
  await page.waitForTimeout(150);
  await expect(front).toHaveCSS("transform", "matrix(1, 0, 0, 1, -3, -3)");
  await page.mouse.move(0, 0);
  await expect(front).toHaveCSS("transform", "none");
  await expect(back).toHaveCSS("transform", "none");
});

test("controlled playback ignores hover, holds on leave, and returns with the same spring", async ({ page }) => {
  await page.goto("/copy/");
  await page.waitForFunction(() => !!customElements.get("grave-copy"));
  const control = page.locator("#controlled");
  await control.hover();
  expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await control.click();
  await expect(control.locator("rect")).toHaveCSS("transform", "matrix(1, 0, 0, 1, -3, -3)");
  await page.mouse.move(0, 0);
  await expect(control.locator("path")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 3, 3)");
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  const returnTravel = await control.evaluate((element) => {
    element.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = 100;
    });
    const travel = new DOMMatrix(getComputedStyle(element.querySelector("rect")!).transform).m41;
    element.getAnimations({ subtree: true }).forEach((animation) => animation.play());
    return travel;
  });
  expect(returnTravel).toBeCloseTo(-1.69697, 1);
  await expect(control.locator("rect")).toHaveCSS("transform", "none");
  await expect(control.locator("path")).toHaveCSS("transform", "none");
});

test("interruption and rapid retriggering preserve the current pose and independent instances", async ({ page }) => {
  await page.goto("/copy/");
  await page.waitForFunction(() => !!customElements.get("grave-copy"));
  const icon = page.locator("#controlled grave-copy");
  const poses = await icon.evaluate((element: CopyElement) => {
    const pose = () => new DOMMatrix(getComputedStyle(element.querySelector("rect")!).transform).m41;
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = 100;
    });
    const before = pose();
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const returning = pose();
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const restarted = pose();
    for (let cycle = 0; cycle < 4; cycle++) {
      element.stopAnimation();
      element.startAnimation();
    }
    return { before, returning, restarted, tracks: element.getAnimations({ subtree: true }).length };
  });
  expect(poses.before).toBeCloseTo(-1.30303, 1);
  expect(poses.returning).toBeCloseTo(poses.before, 4);
  expect(poses.restarted).toBeCloseTo(poses.before, 4);
  expect(poses.tracks).toBe(2);
  expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("rect")).toHaveCSS("transform", "matrix(1, 0, 0, 1, -3, -3)");
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} after a queued completion and restart restores Copy without late style writes`, async ({ page }) => {
    await page.goto("/copy/");
    await page.waitForFunction(() => !!customElements.get("grave-copy"));
    const icon = page.locator("#controlled grave-copy");
    const instance = await icon.elementHandle();
    await icon.evaluate((element: CopyElement, interruption) => {
      element.startAnimation();
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      element.startAnimation();
      if (interruption === "remove") element.remove();
      if (interruption === "stop") element.stopAnimation();
    }, interruption);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => instance!.evaluate((element) => ({
      tracks: element.getAnimations({ subtree: true }).length,
      styles: [...element.querySelectorAll("rect, path")].map((part) => part.getAttribute("style") ?? ""),
    }))).toEqual({ tracks: 0, styles: ["", ""] });
    await page.waitForTimeout(1000);
    expect(await instance!.evaluate((element) => [...element.querySelectorAll("rect, path")].map((part) => part.getAttribute("style") ?? ""))).toEqual(["", ""]);
  });
}

test("standalone hover preserves proportional travel and visible strokes at small sizes", async ({ page }) => {
  await page.goto("/copy/");
  await page.waitForFunction(() => !!customElements.get("grave-copy"));
  const icon = page.locator("#standalone");
  await icon.hover();
  await expect(icon.locator("rect")).toHaveCSS("transform", "matrix(1, 0, 0, 1, -3, -3)");
  for (const size of [14, 16, 24, 28]) {
    await icon.evaluate((element: CopyElement) => element.stopAnimation());
    await expect(icon.locator("rect")).toHaveCSS("transform", "none");
    const geometry = await icon.evaluate((element: CopyElement, size) => {
      const svg = element.querySelector("svg")!;
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
      const parts = [...element.querySelectorAll("rect, path")];
      const resting = parts.map((part) => part.getBoundingClientRect());
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause();
        animation.currentTime = 200;
      });
      return {
        overflow: getComputedStyle(svg).overflow,
        travel: parts.map((part, index) => {
          const box = part.getBoundingClientRect();
          return { x: box.x - resting[index].x, y: box.y - resting[index].y, stroke: getComputedStyle(part).strokeWidth };
        }),
      };
    }, size);
    expect(geometry.overflow).toBe("visible");
    expect(geometry.travel[0].x).toBeCloseTo(-2.68869 * size / 24, 1);
    expect(geometry.travel[0].y).toBeCloseTo(-2.68869 * size / 24, 1);
    expect(geometry.travel[1].x).toBeCloseTo(2.68869 * size / 24, 1);
    expect(geometry.travel[1].y).toBeCloseTo(2.68869 * size / 24, 1);
    expect(geometry.travel.map((part) => part.stroke)).toEqual(["2px", "2px"]);
  }
});

test("manual calls stay static under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/copy/");
  await page.waitForFunction(() => !!customElements.get("grave-copy"));
  const icon = page.locator("#controlled grave-copy");
  await icon.evaluate((element: CopyElement) => { element.startAnimation(); element.stopAnimation(); });
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("rect")).toHaveCSS("transform", "none");
  await expect(icon.locator("path")).toHaveCSS("transform", "none");
});

test("small-size preview matches the independent spring reference on entry and return", async ({ page }) => {
  await page.goto("/copy-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-copy"));
  for (const action of ["Play all", "Stop all"]) {
    await page.getByRole("button", { name: action, exact: true }).click();
    const comparison = await page.evaluate(() => {
      const animations = document.getAnimations();
      animations.forEach((animation) => animation.pause());
      const samples = [50, 100, 200, 350, 700].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].map((row) => {
          const positions = (selector: string) => [...row.querySelectorAll<SVGGraphicsElement>(selector)].map((part) => {
            const matrix = part.getScreenCTM()!;
            const origin = part.ownerSVGElement!.getScreenCTM()!;
            return [matrix.e - origin.e, matrix.f - origin.f];
          });
          return { time, size: Number(row.getAttribute("data-size")), adapter: positions("[data-adapter] rect, [data-adapter] path"), reference: positions("[data-reference] rect, [data-reference] path") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    });
    for (const sample of comparison) {
      for (let part = 0; part < 2; part++) {
        for (let axis = 0; axis < 2; axis++) {
          expect(Math.abs(sample.adapter[part][axis] - sample.reference[part][axis]), `${action}, ${sample.size}px, ${sample.time}ms`).toBeLessThan(0.03);
        }
      }
    }
    await expect.poll(() => page.locator("grave-copy").evaluateAll((icons) => icons.flatMap((icon) => icon.getAnimations({ subtree: true })).length)).toBe(0);
  }
});
