import { expect, test } from "@playwright/test";
import { gitIcons } from "./helpers/git-icons.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

for (const icon of gitIcons) {
  test(`${icon.name} renders the complete drawing and usable link without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/${icon.slug}/`);
    const link = page.locator("#primary");
    await expect(link.locator("svg")).toBeVisible();
    await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
    await expect(link.locator("path, circle, line")).toHaveCount(icon.shapes);
    for (const [index, shape] of icon.drawing.entries()) {
      const actual = link.locator("path, circle, line").nth(index);
      expect(await actual.evaluate((element) => element.localName)).toBe(shape.tag);
      for (const [attribute, value] of Object.entries(shape.attrs)) await expect(actual).toHaveAttribute(attribute, value);
    }
    await expect(page.getByRole("img", { name: `${icon.name} icon` })).toBeVisible();
    await expect(link.locator(icon.tag)).not.toHaveAttribute("tabindex");
    await link.click();
    await expect(page).toHaveURL(/#destination$/);
    await context.close();
  });

  test(`${icon.name} supports manual playback and returns continuously from its current pose`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
    const control = page.locator("#controlled");
    const element = control.locator(icon.tag);
    await control.hover();
    expect(await element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const poses = await element.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 250; });
      const pose = () => [...element.querySelectorAll("path, circle, line")].map((shape) => {
        const style = getComputedStyle(shape);
        return [style.opacity, style.strokeDasharray, style.strokeDashoffset, style.transform];
      });
      const before = pose();
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
      const after = pose();
      element.getAnimations({ subtree: true }).forEach((animation) => animation.play());
      return { before, after };
    });
    expect(poses.after).toEqual(poses.before);
    await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    for (const shape of await element.locator("path, circle, line").all()) {
      await expect(shape).toHaveCSS("opacity", "1");
      await expect(shape).toHaveCSS("stroke-dasharray", "none");
      await expect(shape).toHaveCSS("stroke-dashoffset", "0px");
      await expect(shape).toHaveCSS("transform", "none");
    }
  });

  for (const interruption of ["stop", "remove", "reduce"] as const) {
    test(`${icon.name} cleans rapid replays after ${interruption}`, async ({ page }) => {
      await page.goto(`/${icon.slug}/`);
      await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
      const element = await page.locator(`#controlled ${icon.tag}`).elementHandle();
      await element!.evaluate((element: HTMLElement & IconHandle, interruption) => {
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
      await expect.poll(() => element!.evaluate((element) => ({
        tracks: element.getAnimations({ subtree: true }).length,
        styles: [...element.querySelectorAll<SVGElement>("path, circle, line")].map((shape) => [shape.style.opacity, shape.style.strokeDasharray, shape.style.strokeDashoffset, shape.style.transform]),
      }))).toEqual({ tracks: 0, styles: Array.from({ length: icon.shapes }, () => ["", "", "", ""]) });
      await page.waitForTimeout(icon.slug === "github" ? 600 : 100);
      expect(await element!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    });
  }
}

test("GitBranch redraws its nodes and reverse-offset edges in the upstream order", async ({ page }) => {
  await page.goto("/git-branch/");
  await page.waitForFunction(() => !!customElements.get("grave-git-branch"));
  const samples = await page.locator("#controlled grave-git-branch").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    return [0, 100, 400, 700, 1000].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return [...element.querySelectorAll<SVGGeometryElement>("circle, line, path")].map((shape) => {
        const style = getComputedStyle(shape);
        const length = shape.getTotalLength();
        return { opacity: Number(style.opacity), length: parseFloat(style.strokeDasharray) / length, offset: parseFloat(style.strokeDashoffset) / length };
      });
    });
  });
  expect(samples[0].map((shape) => shape.opacity)).toEqual([0, 0, 0, 0]);
  expect(samples[1].map((shape) => shape.length)).toEqual([0, 0, 0, 0]);
  expect(samples[2][0].length).toBeCloseTo(1, 4);
  expect(samples[2][1].length).toBe(0);
  expect(samples[2][1].offset).toBeCloseTo(-1, 4);
  expect(samples[3][1].length).toBeCloseTo(1, 4);
  expect(samples[3][2].length).toBe(0);
  for (const shape of samples[4]) {
    expect(shape.opacity).toBe(1);
    expect(shape.length).toBeCloseTo(1, 4);
    expect(shape.offset).toBe(0);
  }
});

test("Github draws its tail before looping and stop prevents a late loop", async ({ page }) => {
  await page.goto("/github/");
  await page.waitForFunction(() => !!customElements.get("grave-github"));
  const element = page.locator("#controlled grave-github");
  await element.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).some((animation) => animation.effect!.getTiming().iterations === Infinity))).toBe(true);
  const angles = await element.locator("path").nth(1).evaluate((tail) => {
    const animation = tail.getAnimations().find((animation) => animation.effect!.getTiming().iterations === Infinity)!;
    animation.pause();
    return [0, 2500 / 6, 2500 / 3, 1250, 2500 * 2 / 3, 2500 * 5 / 6, 2500 - 0.001].map((time) => {
      animation.currentTime = time;
      const matrix = new DOMMatrix(getComputedStyle(tail).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
  });
  angles.forEach((angle, index) => expect(angle).toBeCloseTo([0, -15, 15, -10, 10, -5, 5][index], 3));
  const interruption = await element.evaluate((element: HTMLElement & IconHandle) => {
    const tail = element.querySelectorAll("path")[1];
    const before = getComputedStyle(tail).transform;
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const after = getComputedStyle(tail).transform;
    element.getAnimations({ subtree: true }).forEach((animation) => animation.play());
    return { before, after };
  });
  expect(interruption.after).toBe(interruption.before);
  await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await element.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.stopAnimation();
  });
  await page.waitForTimeout(650);
  expect(await element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  for (const path of await element.locator("path").all()) {
    await expect(path).toHaveCSS("transform", "none");
    await expect(path).toHaveCSS("stroke-dasharray", "none");
    await expect(path).toHaveCSS("opacity", "1");
  }
});

for (const interruption of ["remove", "reduce"] as const) {
  test(`Github cancels an active wag on ${interruption}`, async ({ page }) => {
    await page.goto("/github/");
    await page.waitForFunction(() => !!customElements.get("grave-github"));
    const element = await page.locator("#controlled grave-github").elementHandle();
    await element!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => element!.evaluate((element) => element.getAnimations({ subtree: true }).some((animation) => animation.effect!.getTiming().iterations === Infinity))).toBe(true);
    if (interruption === "remove") await element!.evaluate((element) => element.remove());
    else await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => element!.evaluate((element) => ({
      animations: element.getAnimations({ subtree: true }).length,
      tailTransform: getComputedStyle(element.querySelectorAll("path")[1]).transform,
      retainedTransform: element.querySelectorAll("path")[1].style.transform,
    }))).toEqual({ animations: 0, tailTransform: interruption === "remove" ? "" : "none", retainedTransform: "" });
    await page.waitForTimeout(600);
    expect(await element!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("Git recipes match independent normalized-path references at small sizes and on interrupted returns", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/git-comparison/");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), gitIcons.map((icon) => icon.tag));
  let maximumGeometryDifference = 0;
  let maximumStrokeDifference = 0;
  for (const interruption of [null, 100, 450, 750, 1400]) {
    const samples = await page.evaluate((interruption) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruption ?? 0; });
      if (interruption !== null) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = [0, 50, 100, 150, 250, 300, 400, 450, 499, 550, 700, 850, 1000, 1400, 1600].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll<HTMLTableRowElement>("tr[data-size]")].flatMap((row) => {
          if (row.dataset.icon === "github" && ((interruption !== null && interruption >= 500) || (interruption === null && time >= 500))) return [];
          const pose = (selector: string) => [...row.querySelectorAll<SVGGeometryElement>(`${selector} path, ${selector} circle, ${selector} line`)].map((shape) => {
            const style = getComputedStyle(shape);
            const length = shape.hasAttribute("pathLength") ? 1 : shape.getTotalLength();
            const box = shape.getBoundingClientRect();
            const svg = shape.ownerSVGElement!.getBoundingClientRect();
            return {
              opacity: Number(style.opacity),
              length: style.strokeDasharray === "none" ? 1 : parseFloat(style.strokeDasharray) / length,
              offset: parseFloat(style.strokeDashoffset) / length,
              box: [box.x - svg.x, box.y - svg.y, box.width, box.height],
            };
          });
          return [{ time, icon: row.dataset.icon, size: row.dataset.size, adapter: pose("[data-adapter]"), reference: pose("[data-reference]") }];
        });
      });
      document.querySelector<HTMLButtonElement>("#stop")!.click();
      document.getAnimations().forEach((animation) => animation.finish());
      return samples;
    }, interruption);
    for (const sample of samples) {
      const message = `${sample.icon}, ${sample.size}px, ${sample.time}ms, interruption ${interruption}`;
      expect(sample.adapter.length, message).toBe(sample.reference.length);
      sample.adapter.forEach((shape, index) => {
        const reference = sample.reference[index];
        for (const property of ["opacity", "length", "offset"] as const) {
          const difference = Math.abs(shape[property] - reference[property]);
          maximumStrokeDifference = Math.max(maximumStrokeDifference, difference);
          if (difference >= 0.0001) expect(difference, `${message}, shape ${index}, ${property}`).toBeLessThan(0.0001);
        }
        shape.box.forEach((value, coordinate) => {
          const difference = Math.abs(value - reference.box[coordinate]);
          maximumGeometryDifference = Math.max(maximumGeometryDifference, difference);
          if (difference >= 0.03) expect(difference, message).toBeLessThan(0.03);
        });
      });
    }
  }
  expect(maximumStrokeDifference).toBeLessThan(0.0001);
  expect(maximumGeometryDifference).toBeLessThan(0.03);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  console.log(`Git comparison: 15 icons at 14, 16, 24, and 28 px; entry and four interrupted returns; maximum geometry difference ${maximumGeometryDifference.toFixed(6)} screen pixels, maximum normalized stroke/opacity difference ${maximumStrokeDifference.toFixed(6)}. Github loop angles are checked separately.`);
});
