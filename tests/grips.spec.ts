import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { grips } from "./helpers/grips.js";

type GripElement = HTMLElement & IconHandle;

for (const icon of grips) {
  test.describe(icon.name, () => {
    test("renders every upstream circle and a usable link without JavaScript", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`/${icon.slug}/`);
      const link = page.locator("#primary");
      expect(await link.locator("circle").evaluateAll((circles) => circles.map((circle) => [
        Number(circle.getAttribute("cx")), Number(circle.getAttribute("cy")),
      ]))).toEqual(icon.circles);
      for (const circle of await link.locator("circle").all()) {
        await expect(circle).toHaveAttribute("r", "1");
        await expect(circle).toHaveCSS("opacity", "1");
        await expect(circle).toHaveCSS("transform", "none");
      }
      await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
      await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
      await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
      await expect(page.getByRole("img", { name: `${icon.name} icon` })).toBeVisible();
      await expect(link.locator(icon.tag)).not.toHaveAttribute("tabindex");
      await link.click();
      await expect(page).toHaveURL(/#destination$/);
      await context.close();
    });

    test("manual playback follows the stagger, extrema, and centers before restoring", async ({ page }) => {
      await page.goto(`/${icon.slug}/`);
      await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
      const control = page.locator("#controlled");
      const element = control.locator(icon.tag);
      await control.hover();
      expect(await element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      const result = await element.evaluate((element: GripElement, pulse) => {
        element.startAnimation();
        const circles = [...element.querySelectorAll("circle")];
        const animations = element.getAnimations({ subtree: true });
        animations.forEach((animation) => animation.pause());
        const timings = animations.map((animation) => {
          const timing = animation.effect!.getTiming();
          return [timing.delay, timing.duration, timing.iterations];
        });
        const samples = circles.map((circle) => {
          const own = circle.getAnimations();
          const delay = own[0].effect!.getTiming().delay ?? 0;
          return (pulse ? [0, 500, 1000] : [0, 220, 880, 1100]).map((time) => {
            own.forEach((animation) => { animation.currentTime = delay + time; });
            const style = getComputedStyle(circle);
            const matrix = new DOMMatrix(style.transform);
            const bounds = circle.getBoundingClientRect();
            const svg = circle.ownerSVGElement!.getBoundingClientRect();
            return [Number(style.opacity), matrix.a, (bounds.x + bounds.width / 2 - svg.x) * 24 / svg.width, (bounds.y + bounds.height / 2 - svg.y) * 24 / svg.height];
          });
        });
        animations.forEach((animation) => animation.finish());
        return { timings, samples };
      }, icon.pulse);
      expect(result.timings).toHaveLength(icon.circles.length * (icon.pulse ? 2 : 1));
      icon.delays.forEach((delay, index) => {
        const timing = result.timings[index * (icon.pulse ? 2 : 1)];
        expect(timing[0]).toBeCloseTo(delay, 5);
        expect(timing.slice(1)).toEqual([icon.pulse ? 1000 : 1100, 1]);
        if (icon.pulse) expect(result.timings[index * 2 + 1]).toEqual(timing);
      });
      result.samples.forEach((samples, index) => {
        expect(samples.map((sample) => sample[0])).toEqual(icon.pulse ? [1, 0.4, 1] : [1, 0.3, 0.3, 1]);
        expect(samples.map((sample) => sample[1])).toEqual(icon.pulse ? [1, 0.85, 1] : [1, 1, 1, 1]);
        samples.forEach((sample) => {
          expect(sample[2]).toBeCloseTo(icon.circles[index][0], 3);
          expect(sample[3]).toBeCloseTo(icon.circles[index][1], 3);
        });
      });
      await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      for (const circle of await element.locator("circle").all()) {
        await expect(circle).toHaveCSS("opacity", "1");
        await expect(circle).toHaveCSS("transform", "none");
      }
    });

    for (const interruption of ["stop", "remove", "reduce"] as const) {
      test(`${interruption} cleans delayed tracks and queued replay completions`, async ({ page }) => {
        await page.goto(`/${icon.slug}/`);
        await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
        const element = await page.locator(`#controlled ${icon.tag}`).elementHandle();
        const result = await element!.evaluate((element: GripElement, interruption) => {
          const circles = [...element.querySelectorAll("circle")];
          const pose = () => circles.map((circle) => [Number(getComputedStyle(circle).opacity), getComputedStyle(circle).transform]);
          for (let cycle = 0; cycle < 4; cycle++) {
            element.startAnimation();
            element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
          }
          element.startAnimation();
          const previous = element.getAnimations({ subtree: true });
          previous.forEach((animation) => { animation.pause(); animation.currentTime = 300; });
          element.startAnimation();
          const current = element.getAnimations({ subtree: true });
          current.forEach((animation) => { animation.pause(); animation.currentTime = 0; });
          const restart = pose();
          current.forEach((animation) => { animation.currentTime = 100; });
          const before = pose();
          if (interruption === "stop") element.stopAnimation();
          const returning = element.getAnimations({ subtree: true });
          returning.forEach((animation) => { animation.pause(); animation.currentTime = 0; });
          const after = pose();
          const timings = returning.map((animation) => [animation.effect!.getTiming().delay, animation.effect!.getTiming().duration]);
          if (interruption === "stop") returning.forEach((animation) => animation.finish());
          if (interruption === "remove") element.remove();
          return { restart, before, after, timings, previous: previous.map((animation) => animation.playState) };
        }, interruption);
        expect(result.previous).toEqual(Array(icon.circles.length * (icon.pulse ? 2 : 1)).fill("idle"));
        expect(result.restart.map((sample) => sample[0])).toEqual(icon.circles.map(() => 1));
        if (interruption === "stop") {
          expect(result.after).toEqual(result.before);
          expect(result.timings).toEqual(Array(icon.circles.length * (icon.pulse ? 2 : 1)).fill([0, 250]));
        }
        if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
        await expect.poll(() => element!.evaluate((element) => ({
          tracks: element.getAnimations({ subtree: true }).length,
          styles: [...element.querySelectorAll("circle")].map((circle) => [circle.style.opacity, circle.style.transform]),
        }))).toEqual({ tracks: 0, styles: icon.circles.map(() => ["", ""]) });
        await page.waitForTimeout(600);
        expect(await element!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
        if (interruption === "reduce") {
          await element!.evaluate((element: GripElement) => element.startAnimation());
          expect(await element!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
        }
        expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      });
    }
  });
}

test("all grips match normalized native references during entry and interrupted returns", async ({ page }) => {
  await page.goto("/grips-comparison/");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), grips.map((icon) => icon.tag));
  let maximumOpacityDifference = 0;
  let maximumGeometryDifference = 0;
  for (const interruption of [null, 100, 500, 1200]) {
    const samples = await page.evaluate((interruption) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruption ?? 0; });
      if (interruption !== null) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = [0, 50, 100, 150, 220, 250, 500, 750, 880, 1100, 1660].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll<HTMLTableRowElement>("tr[data-size]")].map((row) => {
          const pose = (selector: string) => [...row.querySelectorAll<SVGCircleElement>(`${selector} circle`)].map((circle) => {
            const box = circle.getBoundingClientRect();
            const svg = circle.ownerSVGElement!.getBoundingClientRect();
            return [Number(getComputedStyle(circle).opacity), box.x - svg.x, box.y - svg.y, box.width, box.height];
          });
          return { time, icon: row.dataset.icon, size: row.dataset.size, adapter: pose("[data-adapter]"), reference: pose("[data-reference]") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, interruption);
    for (const sample of samples) {
      const message = `${sample.icon}, ${sample.size}px, ${sample.time}ms, interruption ${interruption}`;
      sample.adapter.forEach((circle, index) => circle.forEach((value, property) => {
        const difference = Math.abs(value - sample.reference[index][property]);
        if (property === 0) maximumOpacityDifference = Math.max(maximumOpacityDifference, difference);
        else maximumGeometryDifference = Math.max(maximumGeometryDifference, difference);
        expect(difference, message).toBeLessThan(property === 0 ? 0.0001 : 0.03);
      }));
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  console.log(`Grip comparison: three icons at 14, 16, 24, and 28 px; entry and three interrupted returns; maximum opacity difference ${maximumOpacityDifference.toFixed(6)}, maximum geometry difference ${maximumGeometryDifference.toFixed(6)} screen pixels.`);
});
