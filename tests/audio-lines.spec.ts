import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type AudioLinesElement = HTMLElement & IconHandle;
const resting = [[6, 17], [3, 21], [8, 15], [5, 18]];

test.describe("AudioLines", () => {
  test("renders the complete six-line drawing without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/audio-lines/");
    const link = page.getByRole("link", { name: "AudioLines example", exact: true });
    await expect(link.locator("path")).toHaveCount(6);
    await expect(link.locator("path").first()).toHaveAttribute("d", "M2 10v3");
    await expect(link.locator("path").last()).toHaveAttribute("d", "M22 10v3");
    const endpoints = await link.locator("[data-audio-line]").evaluateAll((paths) => paths.map((path) => {
      const shape = path as SVGPathElement;
      const style = getComputedStyle(shape);
      const start = style.strokeDasharray === "none" ? 0 : -parseFloat(style.strokeDashoffset);
      const length = style.strokeDasharray === "none" ? shape.getTotalLength() : parseFloat(style.strokeDasharray);
      return [shape.getPointAtLength(start).y, shape.getPointAtLength(start + length).y];
    }));
    expect(endpoints).toEqual(resting);
    await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
    await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
    for (const path of await link.locator("path").all()) {
      await expect(path).toHaveCSS("stroke-linecap", "round");
      await expect(path).toHaveCSS("stroke-linejoin", "round");
    }
    await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByRole("img", { name: "AudioLines icon" })).toBeVisible();
    expect(await link.locator("grave-audio-lines").getAttribute("tabindex")).toBeNull();
    await context.close();
  });

  test("hover keeps four independently timed loops running and leaves outer lines static", async ({ page }) => {
    await page.goto("/audio-lines/");
    await page.waitForFunction(() => !!customElements.get("grave-audio-lines"));
    const link = page.locator("#primary");
    await link.hover();
    const timings = await link.evaluate((element) => element.getAnimations({ subtree: true }).map((animation) => {
      const timing = animation.effect!.getTiming();
      return [timing.duration, timing.iterations === Infinity];
    }));
    expect(timings).toEqual([[1500, true], [1500, true], [1000, true], [1000, true], [800, true], [800, true], [1500, true], [1500, true]]);
    await page.waitForTimeout(1650);
    expect(await link.evaluate((element) => element.getAnimations({ subtree: true }).every((animation) => animation.playState === "running"))).toBe(true);
    for (const index of [0, 5]) expect(await link.locator("path").nth(index).evaluate((path) => path.getAnimations().length)).toBe(0);
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    await expect(link.locator("[data-audio-line]").nth(2)).toHaveCSS("stroke-dasharray", "7px, 11px");
    await expect(link.locator("[data-audio-line]").nth(2)).toHaveCSS("stroke-dashoffset", "-2px");
  });

  for (const interruption of ["stop", "remove", "reduce"] as const) {
    test(`${interruption} ends every loop after rapid replay and queued completion`, async ({ page }) => {
      await page.goto("/audio-lines/");
      await page.waitForFunction(() => !!customElements.get("grave-audio-lines"));
      const icon = page.locator("#controlled grave-audio-lines");
      const instance = await icon.elementHandle();
      await icon.evaluate((element: AudioLinesElement, interruption) => {
        for (let cycle = 0; cycle < 4; cycle++) {
          element.startAnimation();
          element.stopAnimation();
          element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
        }
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 350; });
        if (interruption === "stop") element.stopAnimation();
        if (interruption === "remove") element.remove();
      }, interruption);
      if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(() => instance!.evaluate((element) => ({
        animations: element.getAnimations({ subtree: true }).length,
        styles: [...element.querySelectorAll<SVGPathElement>("[data-audio-line]")].map((path) => [path.style.strokeDasharray, path.style.strokeDashoffset]),
      }))).toEqual({ animations: 0, styles: [["", ""], ["", ""], ["7px, 11px", "-2px"], ["", ""]] });
      await page.waitForTimeout(1550);
      expect(await instance!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    });
  }

  test("queued return callbacks cannot overwrite a newer paused loop", async ({ page }) => {
    await page.goto("/audio-lines/");
    await page.waitForFunction(() => !!customElements.get("grave-audio-lines"));
    const icon = page.locator("#controlled grave-audio-lines");
    const before = await icon.evaluate((element: AudioLinesElement) => {
      element.startAnimation();
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 350; });
      return [...element.querySelectorAll("[data-audio-line]")].map((path) => {
        const style = getComputedStyle(path);
        return [style.strokeDasharray, style.strokeDashoffset];
      });
    });
    await page.waitForTimeout(100);
    expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(8);
    expect(await icon.evaluate((element) => [...element.querySelectorAll("[data-audio-line]")].map((path) => {
      const style = getComputedStyle(path);
      return [style.strokeDasharray, style.strokeDashoffset];
    }))).toEqual(before);
    await icon.evaluate((element: AudioLinesElement) => element.stopAnimation());
    await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });

  test("standalone and controlled playback follow the shared API, including reduced motion", async ({ page }) => {
    await page.goto("/audio-lines/");
    await page.waitForFunction(() => !!customElements.get("grave-audio-lines"));
    await page.locator("#standalone").hover();
    expect(await page.locator("#standalone").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(8);
    await page.locator("#controlled").hover();
    const icon = page.locator("#controlled grave-audio-lines");
    expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.locator("#controlled").click();
    expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(8);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    await icon.evaluate((element: AudioLinesElement) => { element.startAnimation(); element.stopAnimation(); });
    expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });

  for (const size of [14, 16, 24, 28]) {
    test(`visible endpoints match independent path morphing at ${size} px through loops and interrupted return`, async ({ page }) => {
      await page.goto("/audio-lines-comparison/");
      await page.waitForFunction(() => !!customElements.get("grave-audio-lines"));
      await page.locator("#play").click();
      const row = page.locator(`[data-size="${size}"]`);
      const result = await row.evaluate((row) => {
        const adapter = row.querySelector<AudioLinesElement>("grave-audio-lines")!;
        const reference = row.querySelector("[data-reference]")!;
        const samples: number[] = [];
        const pose = () => {
          const paths = [...adapter.querySelectorAll<SVGPathElement>("[data-audio-line]")];
          const refs = [...reference.querySelectorAll("path")].slice(1, 5);
          return paths.flatMap((path, index) => {
            const style = getComputedStyle(path);
            const start = -parseFloat(style.strokeDashoffset);
            const length = parseFloat(style.strokeDasharray);
            const box = refs[index].getBBox();
            return [path.getPointAtLength(start).y - box.y, path.getPointAtLength(start + length).y - box.y - box.height];
          });
        };
        const seek = (time: number) => {
          for (const control of [adapter, reference]) control.getAnimations({ subtree: true }).forEach((animation) => {
            animation.pause(); animation.currentTime = time;
          });
          samples.push(...pose());
        };
        for (const time of [0, 50, 100, 200, 400, 500, 750, 800, 1000, 1500, 1750, 2400, 3000]) seek(time);
        seek(350);
        const before = pose();
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        seek(0);
        const continuity = pose();
        const durations = adapter.getAnimations({ subtree: true }).map((animation) => animation.effect!.getTiming().duration);
        for (const time of [25, 50, 100, 150, 250, 300]) seek(time);
        return { samples, before, continuity, durations };
      });
      expect(result.durations).toEqual(Array(8).fill(300));
      for (const error of result.samples) expect(Math.abs(error) * size / 24).toBeLessThan(0.03);
      result.continuity.forEach((value, index) => expect(value).toBeCloseTo(result.before[index], 4));
    });
  }
});
