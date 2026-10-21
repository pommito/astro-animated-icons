import { expect, test } from "@playwright/test";
import type { IconHandle } from "../../packages/animated-icons/src/element.js";

interface FixtureIcon {
  name: string;
  slug: string;
  tag: string;
  drawing: readonly { tag: string; attrs: Readonly<Record<string, string>> }[];
}

export function testIconBehavior(icons: readonly FixtureIcon[], stopTimes: readonly number[] = [250]) {
  for (const icon of icons) {
    test(`${icon.name} renders its complete drawing and a usable link without JavaScript`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`/${icon.slug}/`);
      const link = page.locator("#primary");
      await expect(link.locator("[data-grave-icon] > svg")).toBeVisible();
      await expect(link.locator("[data-grave-icon] > svg")).toHaveAttribute("aria-hidden", "true");
      await expect(link.locator("[data-grave-icon] > svg")).toHaveAttribute("stroke-width", "2");
      await expect(link.locator("path, circle, rect, line, polyline, polygon, ellipse")).toHaveCount(icon.drawing.length);
      for (const [index, shape] of icon.drawing.entries()) {
        const actual = link.locator("path, circle, rect, line, polyline, polygon, ellipse").nth(index);
        expect(await actual.evaluate((element) => element.localName)).toBe(shape.tag);
        for (const [attribute, value] of Object.entries(shape.attrs)) await expect(actual).toHaveAttribute(attribute, value);
      }
      await expect(page.getByRole("img", { name: `${icon.name} icon` })).toBeVisible();
      await expect(link.locator(icon.tag)).not.toHaveAttribute("tabindex");
      await link.click();
      await expect(page).toHaveURL(/#destination$/);
      await context.close();
    });

    for (const { interruption, time } of [
      ...stopTimes.map((time) => ({ interruption: "stop" as const, time })),
      { interruption: "remove", time: 250 },
      { interruption: "reduce", time: 250 },
    ] as const) {
      test(`${icon.name} preserves its pose on stop and cleans rapid replays after ${interruption} at ${time} ms`, async ({ page }) => {
        await page.goto(`/${icon.slug}/`);
        await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
        const control = page.locator("#controlled");
        await control.hover();
        expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
        const element = await control.locator(icon.tag).elementHandle();
        const poses = await element!.evaluate(async (element: HTMLElement & IconHandle, { interruption, time }) => {
          for (let cycle = 0; cycle < 4; cycle++) {
            element.startAnimation();
            element.getAnimations({ subtree: true }).forEach((animation) => {
              if (Number.isFinite(animation.effect!.getComputedTiming().endTime)) animation.finish();
              else { animation.pause(); animation.currentTime = 150; }
            });
          }
          element.startAnimation();
          element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
          if (!element.getAnimations({ subtree: true }).length) await new Promise((resolve) => setTimeout(resolve, time));
          const pose = () => [...element.querySelectorAll("svg, g, path, circle, rect, line, polyline, polygon, ellipse")].map((shape) => {
            const style = getComputedStyle(shape);
            return [style.opacity, style.width, style.strokeDasharray, style.strokeDashoffset, style.transform, style.getPropertyValue("d"), shape.getAttribute("x1"), shape.getAttribute("x2")];
          });
          const before = pose();
          if (interruption === "stop") element.stopAnimation();
          element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
          const after = pose();
          element.getAnimations({ subtree: true }).forEach((animation) => animation.play());
          if (interruption === "remove") element.remove();
          return { before, after };
        }, { interruption, time });
        if (interruption === "stop") expect(poses.after).toEqual(poses.before);
        if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
        await expect.poll(() => element!.evaluate((element, drawing) => ({
          tracks: element.getAnimations({ subtree: true }).length,
          shapes: element.querySelectorAll("path, circle, rect, line, polyline, polygon, ellipse").length,
          clean: [...element.querySelectorAll<SVGElement>("svg, g, path, circle, rect, line, polyline, polygon, ellipse")].every((shape) => !shape.style.opacity && !shape.style.width && !shape.style.strokeDasharray && !shape.style.strokeDashoffset && !shape.style.transform && !shape.style.getPropertyValue("d")) && drawing.every((shape, index) => Object.entries(shape.attrs).every(([attribute, value]) => element.querySelectorAll("path, circle, rect, line, polyline, polygon, ellipse")[index].getAttribute(attribute) === value)),
        }), icon.drawing)).toEqual({ tracks: 0, shapes: icon.drawing.length, clean: true });
        if (interruption === "reduce") {
          await element!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
          expect(await element!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
        }
        expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      });
    }
  }
}
