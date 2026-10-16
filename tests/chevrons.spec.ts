import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { chevrons } from "./helpers/chevrons.js";

type ChevronElement = HTMLElement & IconHandle;

for (const icon of chevrons) {
  test.describe(icon.name, () => {
    test("renders the complete upstream drawing and usable link without JavaScript", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`/${icon.slug}/`);
      const link = page.locator("#primary");
      await expect(link.locator("svg")).toBeVisible();
      await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
      await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
      expect(await link.locator("path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d")))).toEqual(icon.paths);
      if (icon.frame === "circle") await expect(link.locator("circle")).toHaveAttribute("r", "10");
      if (icon.frame === "square") await expect(link.locator("rect")).toHaveAttribute("rx", "2");
      await expect(page.getByRole("img", { name: `${icon.name} icon` })).toBeVisible();
      await expect(link.locator(icon.tag)).not.toHaveAttribute("tabindex");
      await link.click();
      await expect(page).toHaveURL(/#destination$/);
      await context.close();
    });

    test("manual playback follows the upstream keyframes and finish policy", async ({ page }) => {
      await page.goto(`/${icon.slug}/`);
      await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
      const control = page.locator("#controlled");
      const element = control.locator(icon.tag);
      await control.hover();
      expect(await element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      await control.click();
      const samples = await element.evaluate((element, icon) => {
        const paths = [...element.querySelectorAll("path")];
        const animations = element.getAnimations({ subtree: true });
        animations.forEach((animation) => animation.pause());
        const times = icon.kind === "first" ? [0, 180, 420, 600] : icon.kind === "spring" ? [100, 1000] : [0, 200, 500];
        return times.map((time) => {
          animations.forEach((animation) => { animation.currentTime = time; });
          return {
            positions: paths.map((path) => {
              const matrix = new DOMMatrix(getComputedStyle(path).transform);
              return icon.axis === "X" ? matrix.m41 : matrix.m42;
            }),
            timings: animations.map((animation) => animation.effect!.getTiming()),
            frameTransform: getComputedStyle(element.querySelector("circle, rect") ?? element.querySelector("g")!).transform,
          };
        });
      }, icon);
      for (const sample of samples) expect(sample.frameTransform).toBe("none");
      if (icon.kind === "spring") {
        expect(samples[0].positions[0]).toBeCloseTo(icon.values[0] * 0.532886, 3);
        expect(samples[1].positions).toEqual(icon.values);
      } else {
        expect(samples.map((sample) => sample.positions[0])).toEqual(icon.values);
        for (const sample of samples) {
          expect(sample.timings).toHaveLength(1);
          expect(sample.timings[0].duration).toBe(icon.kind === "first" ? 600 : 500);
          expect(sample.timings[0].iterations).toBe(1);
          if (icon.kind === "first") expect(sample.positions[1]).toBe(0);
        }
      }
      await element.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
      await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      if (icon.kind === "spring") {
        expect(await element.locator("path").evaluateAll((paths, axis) => paths.map((path) => {
          const matrix = new DOMMatrix(getComputedStyle(path).transform);
          return axis === "X" ? matrix.m41 : matrix.m42;
        }), icon.axis)).toEqual(icon.values);
      } else {
        for (const path of await element.locator("path").all()) await expect(path).toHaveCSS("transform", "none");
      }
      await element.evaluate((element: ChevronElement) => element.stopAnimation());
      await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      for (const path of await element.locator("path").all()) await expect(path).toHaveCSS("transform", "none");
    });

    for (const interruption of ["stop", "remove", "reduce"] as const) {
      test(`${interruption} preserves the interrupted pose and cleans rapid replays`, async ({ page }) => {
        await page.goto(`/${icon.slug}/`);
        await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
        const element = await page.locator(`#controlled ${icon.tag}`).elementHandle();
        const poses = await element!.evaluate((element: ChevronElement, interruption) => {
          for (let cycle = 0; cycle < 4; cycle++) {
            element.startAnimation();
            element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
          }
          element.startAnimation();
          element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 100; });
          const pose = () => [...element.querySelectorAll("path")].map((path) => getComputedStyle(path).transform);
          const before = pose();
          if (interruption === "stop") {
            element.stopAnimation();
            element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
          }
          const after = pose();
          if (interruption === "remove") element.remove();
          return { before, after };
        }, interruption);
        expect(poses.after).toEqual(poses.before);
        if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
        if (interruption === "stop") await element!.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.play()));
        await expect.poll(() => element!.evaluate((element) => ({
          tracks: element.getAnimations({ subtree: true }).length,
          styles: [...element.querySelectorAll("path")].map((path) => path.style.transform),
        }))).toEqual({ tracks: 0, styles: icon.paths.map(() => "") });
        await page.waitForTimeout(100);
        expect(await element!.evaluate((element) => [...element.querySelectorAll("path")].map((path) => path.style.transform))).toEqual(icon.paths.map(() => ""));
        if (interruption === "reduce") {
          await element!.evaluate((element: ChevronElement) => element.startAnimation());
          expect(await element!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
        }
        expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      });
    }
  });
}

test("all chevrons match independent native references at small sizes during entry and interrupted returns", async ({ page }) => {
  await page.goto("/chevrons-comparison/");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), chevrons.map((icon) => icon.tag));
  let maximumDifference = 0;
  for (const interruptionTime of [0, 100, 200, 1000]) {
    const samples = await page.evaluate((interruptionTime) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruptionTime; });
      if (interruptionTime) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = [0, 50, 100, 180, 200, 300, 420, 500, 600, 1000].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll<HTMLTableRowElement>("tr[data-size]")].map((row) => {
          const pose = (selector: string) => [...row.querySelectorAll<SVGGeometryElement>(`${selector} path, ${selector} circle, ${selector} rect`)].map((path) => {
            const box = path.getBoundingClientRect();
            const svg = path.ownerSVGElement!.getBoundingClientRect();
            return [box.x - svg.x, box.y - svg.y, box.width, box.height];
          });
          return { time, icon: row.dataset.icon, size: row.dataset.size, adapter: pose("[data-adapter]"), reference: pose("[data-reference]") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, interruptionTime);
    for (const sample of samples) {
      const message = `${sample.icon}, ${sample.size}px, ${sample.time}ms, interrupted at ${interruptionTime}ms`;
      expect(sample.adapter.length, message).toBe(sample.reference.length);
      sample.adapter.forEach((shape, index) => shape.forEach((value, coordinate) => {
        const difference = Math.abs(value - sample.reference[index][coordinate]);
        maximumDifference = Math.max(maximumDifference, difference);
        expect(difference, message).toBeLessThan(0.03);
      }));
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  console.log(`Chevron comparison: 17 icons at 14, 16, 24, and 28 px; entry and three interrupted returns; maximum geometry difference ${maximumDifference.toFixed(6)} screen pixels.`);
});
