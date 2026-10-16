import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { displayIcons } from "./helpers/display-icons.js";

for (const icon of displayIcons) {
  test(`${icon.name} renders its complete drawing and a usable link without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/${icon.slug}/`);
    const link = page.locator("#primary");
    await expect(link.locator("svg")).toBeVisible();
    await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
    await expect(link.locator("path, circle, rect, line")).toHaveCount(icon.drawing.length);
    for (const [index, shape] of icon.drawing.entries()) {
      const actual = link.locator("path, circle, rect, line").nth(index);
      expect(await actual.evaluate((element) => element.localName)).toBe(shape.tag);
      for (const [attribute, value] of Object.entries(shape.attrs)) await expect(actual).toHaveAttribute(attribute, value);
    }
    await expect(page.getByRole("img", { name: `${icon.name} icon` })).toBeVisible();
    await expect(link.locator(icon.tag)).not.toHaveAttribute("tabindex");
    await link.click();
    await expect(page).toHaveURL(/#destination$/);
    await context.close();
  });

  for (const interruption of ["stop", "remove", "reduce"] as const) {
    test(`${icon.name} preserves its pose on stop and cleans rapid replays after ${interruption}`, async ({ page }) => {
      await page.goto(`/${icon.slug}/`);
      await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
      const control = page.locator("#controlled");
      await control.hover();
      expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      const element = await control.locator(icon.tag).elementHandle();
      const poses = await element!.evaluate((element: HTMLElement & IconHandle, interruption) => {
        for (let cycle = 0; cycle < 4; cycle++) {
          element.startAnimation();
          element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
        }
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 250; });
        const pose = () => [...element.querySelectorAll("g, path, circle, rect, line")].map((shape) => {
          const style = getComputedStyle(shape);
          return [style.opacity, style.strokeDasharray, style.strokeDashoffset, style.transform];
        });
        const before = pose();
        if (interruption === "stop") element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
        const after = pose();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.play());
        if (interruption === "remove") element.remove();
        return { before, after };
      }, interruption);
      if (interruption === "stop") expect(poses.after).toEqual(poses.before);
      if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(() => element!.evaluate((element) => ({
        tracks: element.getAnimations({ subtree: true }).length,
        styles: [...element.querySelectorAll<SVGElement>("g, path, circle, rect, line")].map((shape) => [shape.style.opacity, shape.style.strokeDasharray, shape.style.strokeDashoffset, shape.style.transform]),
      }))).toEqual({ tracks: 0, styles: Array.from({ length: icon.drawing.length + 1 }, () => ["", "", "", ""]) });
      if (interruption === "reduce") {
        await element!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
        expect(await element!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      }
      expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    });
  }
}

test("Linkedin redraws all three shapes linearly with a reverse offset", async ({ page }) => {
  await page.goto("/linkedin/");
  await page.waitForFunction(() => !!customElements.get("grave-linkedin"));
  const samples = await page.locator("#controlled grave-linkedin").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    return [0, 100, 300, 600].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return [...element.querySelectorAll<SVGGeometryElement>("path, rect, circle")].map((shape) => {
        const style = getComputedStyle(shape);
        return [Number(style.opacity), parseFloat(style.strokeDasharray) / shape.getTotalLength(), parseFloat(style.strokeDashoffset) / shape.getTotalLength()];
      });
    });
  });
  for (let index = 0; index < 3; index++) {
    expect(samples[0][index][0]).toBe(0);
    expect(samples[0][index][1]).toBe(0);
    expect(samples[0][index][2]).toBeCloseTo(-1, 5);
    expect(samples[1][index][0]).toBe(1);
    expect(samples[2][index][1]).toBeCloseTo(0.5, 5);
    expect(samples[2][index][2]).toBeCloseTo(-0.5, 5);
    expect(samples[3][index][1]).toBeCloseTo(1, 5);
    expect(samples[3][index][2]).toBe(0);
  }
});

test("Monitor blinks its screen once while its stand stays visible", async ({ page }) => {
  await page.goto("/monitor/");
  await page.waitForFunction(() => !!customElements.get("grave-monitor"));
  const samples = await page.locator("#controlled grave-monitor").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const animation = element.getAnimations({ subtree: true })[0];
    animation.pause();
    return [0, 300, 600].map((time) => {
      animation.currentTime = time;
      return [...element.querySelectorAll("rect, line")].map((shape) => Number(getComputedStyle(shape).opacity));
    });
  });
  expect(samples).toEqual([[1, 1, 1], [0, 1, 1], [1, 1, 1]]);
});

test("Moon rocks around the SVG center over 1200 ms", async ({ page }) => {
  await page.goto("/moon/");
  await page.waitForFunction(() => !!customElements.get("grave-moon"));
  const angles = await page.locator("#controlled grave-moon").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const animation = element.getAnimations({ subtree: true })[0];
    animation.pause();
    return [0, 240, 480, 720, 960, 1200].map((time) => {
      animation.currentTime = time;
      const matrix = new DOMMatrix(getComputedStyle(element.querySelector("g")!).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
  });
  angles.forEach((angle, index) => expect(angle).toBeCloseTo([0, -10, 10, -5, 5, 0][index], 3));
});

test("Sun reveals eight rays clockwise while its center stays visible", async ({ page }) => {
  await page.goto("/sun/");
  await page.waitForFunction(() => !!customElements.get("grave-sun"));
  const samples = await page.locator("#controlled grave-sun").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    return [0, 100, 400, 800, 1100].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return [...element.querySelectorAll("circle, path")].map((shape) => Number(getComputedStyle(shape).opacity));
    });
  });
  expect(samples[0]).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect(samples[1]).toEqual(samples[0]);
  expect(samples[2][1]).toBe(1);
  expect(samples[2].slice(4)).toEqual([0, 0, 0, 0, 0]);
  expect(samples[3].slice(0, 6)).toEqual([1, 1, 1, 1, 1, 1]);
  expect(samples[4]).toEqual(Array(9).fill(1));
});

test("display icons match independent references during entry and interrupted returns", async ({ page }) => {
  await page.goto("/display-icons-comparison/");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), displayIcons.map((icon) => icon.tag));
  let maximumGeometryDifference = 0;
  let maximumStrokeDifference = 0;
  for (const interruption of [null, 100, 450, 850]) {
    const samples = await page.evaluate((interruption) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruption ?? 0; });
      if (interruption !== null) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = [0, 50, 100, 240, 300, 400, 480, 600, 720, 960, 1100, 1200].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll<HTMLTableRowElement>("tr[data-size]")].map((row) => {
          const pose = (selector: string, normalized: boolean) => [...row.querySelectorAll<SVGGeometryElement>(`${selector} path, ${selector} circle, ${selector} rect, ${selector} line`)].map((shape) => {
            const style = getComputedStyle(shape);
            const length = normalized ? 1 : shape.getTotalLength();
            const box = shape.getBoundingClientRect();
            const svg = shape.ownerSVGElement!.getBoundingClientRect();
            return [Number(style.opacity), style.strokeDasharray === "none" ? 1 : parseFloat(style.strokeDasharray) / length, parseFloat(style.strokeDashoffset) / length, box.x - svg.x, box.y - svg.y, box.width, box.height];
          });
          return { time, icon: row.dataset.icon, size: row.dataset.size, adapter: pose("[data-adapter]", false), reference: pose("[data-reference]", row.dataset.icon === "linkedin") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, interruption);
    for (const sample of samples) {
      sample.adapter.forEach((shape, index) => shape.forEach((value, property) => {
        const difference = Math.abs(value - sample.reference[index][property]);
        if (property < 3) maximumStrokeDifference = Math.max(maximumStrokeDifference, difference);
        else maximumGeometryDifference = Math.max(maximumGeometryDifference, difference);
        expect(difference, `${sample.icon}, ${sample.size}px, ${sample.time}ms, interruption ${interruption}`).toBeLessThan(property < 3 ? 0.0001 : 0.03);
      }));
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  console.log(`Display icon comparison: four icons at 14, 16, 24, and 28 px; entry and three interrupted returns; maximum geometry difference ${maximumGeometryDifference.toFixed(6)} screen pixels, maximum normalized stroke or opacity difference ${maximumStrokeDifference.toFixed(6)}.`);
});
