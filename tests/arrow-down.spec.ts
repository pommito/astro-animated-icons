import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type ArrowElement = HTMLElement & IconHandle;

test("ArrowDown renders its full drawing and usable link without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/arrow-down/");
  const link = page.locator("#primary");
  await expect(link).toHaveAccessibleName("Next section 14 px");
  await expect(link.locator("svg")).toBeVisible();
  await expect(link.locator("svg")).toHaveAttribute("width", "14");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(link.locator("path").first()).toHaveAttribute("d", "m19 12-7 7-7-7");
  await expect(link.locator("path").nth(1)).toHaveAttribute("d", "M12 5v14");
  await expect(link.locator("path").nth(1)).toHaveCSS("stroke-dasharray", "none");
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover runs one 400 ms cycle with fixed shaft top, rounded caps, and no scale", async ({ page }) => {
  await page.goto("/arrow-down/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-down"));
  const link = page.locator("#primary");
  await link.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
  }, { once: true }));
  await link.hover();
  const pose = await link.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => { animation.pause(); animation.currentTime = 200; });
    const [head, shaft] = element.querySelectorAll("path");
    return {
      durations: animations.map((animation) => animation.effect!.getTiming().duration),
      travel: new DOMMatrix(getComputedStyle(head).transform).m42,
      shaft: getComputedStyle(shaft).strokeDasharray,
      start: shaft.getPointAtLength(0).y,
      transform: getComputedStyle(shaft).transform,
    };
  });
  expect(pose).toEqual({ durations: [400, 400], travel: -3, shaft: "9px, 14px", start: 5, transform: "none" });
  await expect(link.locator("path").nth(1)).toHaveCSS("stroke-width", "2px");
  await expect(link.locator("path").nth(1)).toHaveCSS("stroke-linecap", "round");
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.play()));
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(link.locator("path").first()).toHaveCSS("transform", "none");
  await expect(link.locator("path").nth(1)).toHaveCSS("stroke-dasharray", "none");
});

test("controlled playback ignores hover and preserves position through stop and rapid replay", async ({ page }) => {
  await page.goto("/arrow-down/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-down"));
  const icon = page.locator("#controlled grave-arrow-down");
  await page.locator("#controlled").hover();
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  const poses = await icon.evaluate((element: ArrowElement) => {
    const pose = () => [...element.querySelectorAll("path")].map((path) => ({ transform: getComputedStyle(path).transform, dash: getComputedStyle(path).strokeDasharray }));
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 100; });
    const before = pose();
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const stopped = pose();
    const durations = element.getAnimations({ subtree: true }).map((animation) => Number(animation.effect!.getTiming().duration));
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const restarted = pose();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    return { before, stopped, restarted, durations };
  });
  expect(poses.stopped).toEqual(poses.before);
  expect(poses.restarted).toEqual(poses.before);
  expect(poses.durations).toContain(300);
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("path").first()).toHaveCSS("transform", "none");
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} cancels rapid replay and queued finish callbacks without late style writes`, async ({ page }) => {
    await page.goto("/arrow-down/");
    await page.waitForFunction(() => !!customElements.get("grave-arrow-down"));
    const icon = await page.locator("#controlled grave-arrow-down").elementHandle();
    await icon!.evaluate((element: ArrowElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      if (interruption === "remove") {
        element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 100; });
        element.stopAnimation();
        element.remove();
      }
      if (interruption === "stop") element.stopAnimation();
    }, interruption);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => icon!.evaluate((element) => ({ tracks: element.getAnimations({ subtree: true }).length, styles: [...element.querySelectorAll("path")].map((path) => path.style.cssText) }))).toEqual({ tracks: 0, styles: ["", ""] });
    await page.waitForTimeout(650);
    expect(await icon!.evaluate((element) => [...element.querySelectorAll("path")].map((path) => path.style.cssText))).toEqual(["", ""]);
  });
}

test("standalone hover and manual reduced motion follow the shared contract", async ({ page }) => {
  await page.goto("/arrow-down/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-down"));
  const icon = page.locator("#standalone");
  await icon.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 100; });
  }, { once: true }));
  await icon.hover();
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await icon.evaluate((element: ArrowElement) => element.stopAnimation());
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await icon.evaluate((element: ArrowElement) => { element.startAnimation(); element.stopAnimation(); });
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("path").first()).toHaveCSS("transform", "none");
  await expect(icon.locator("path").nth(1)).toHaveCSS("stroke-dasharray", "none");
});

test("four sizes match the independent path-morph reference during entry and interrupted return", async ({ page }) => {
  await page.goto("/arrow-down-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-arrow-down"));
  for (const interruptionTime of [100, 200]) {
    for (const returning of [false, true]) {
      const samples = await page.evaluate(({ returning, interruptionTime }) => {
        document.querySelector<HTMLButtonElement>("#play")!.click();
        let tracks = document.getAnimations();
        tracks.forEach((animation) => { animation.pause(); animation.currentTime = interruptionTime; });
        if (returning) {
          document.querySelector<HTMLButtonElement>("#stop")!.click();
          tracks = document.getAnimations();
          tracks.forEach((animation) => animation.pause());
        }
        const samples = (returning ? [0, 25, 50, 100, 150, 200, 300] : [0, 50, 100, 150, 200, 300, 400]).flatMap((time) => {
          tracks.forEach((animation) => { animation.currentTime = time; });
          return [...document.querySelectorAll("tr[data-size]")].map((row) => {
            const pose = (selector: string, adapter: boolean) => {
              const [head, shaft] = row.querySelectorAll<SVGPathElement>(`${selector} path`);
              const svg = head.ownerSVGElement!;
              const size = Number(svg.getAttribute("width"));
              const length = adapter ? parseFloat(getComputedStyle(shaft).strokeDasharray) : shaft.getTotalLength();
              return { head: new DOMMatrix(getComputedStyle(head).transform).m42 * size / 24, endpoint: (5 + length) * size / 24, top: shaft.getPointAtLength(0).y, stroke: getComputedStyle(shaft).strokeWidth, cap: getComputedStyle(shaft).strokeLinecap };
            };
            return { time, size: row.getAttribute("data-size"), adapter: pose("[data-adapter]", true), reference: pose("[data-reference]", false) };
          });
        });
        tracks.forEach((animation) => animation.finish());
        return samples;
      }, { returning, interruptionTime });
      for (const sample of samples) {
        const message = `${returning ? "return" : "entry"}, interrupted at ${interruptionTime}ms, ${sample.size}px, ${sample.time}ms: ${JSON.stringify(sample)}`;
        expect(Math.abs(sample.adapter.head - sample.reference.head), message).toBeLessThan(0.03);
        expect(Math.abs(sample.adapter.endpoint - sample.reference.endpoint), message).toBeLessThan(0.03);
        expect(sample.adapter.top).toBe(5);
        expect(sample.adapter.stroke).toBe("2px");
        expect(sample.adapter.cap).toBe("round");
      }
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
