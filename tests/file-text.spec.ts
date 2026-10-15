import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type FileTextElement = HTMLElement & IconHandle;

test("FileText renders the complete accessible drawing without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/file-text/");
  const link = page.getByRole("link", { name: "FileText example", exact: true });
  expect(await link.locator("path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d")))).toEqual([
    "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4", "M10 9H8", "M16 13H8", "M16 17H8",
  ]);
  for (const shape of await link.locator("path").all()) {
    await expect(shape).toHaveCSS("stroke-dasharray", "none");
    await expect(shape).toHaveCSS("stroke-linecap", "round");
    await expect(shape).toHaveCSS("stroke-linejoin", "round");
  }
  await expect(link.locator("svg")).toHaveCSS("transform", "none");
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("img", { name: "FileText icon" })).toBeVisible();
  expect(await link.locator("grave-file-text").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover scales the whole SVG and staggers a single shrink-and-draw cycle", async ({ page }) => {
  await page.goto("/file-text/");
  await page.waitForFunction(() => !!customElements.get("grave-file-text"));
  const link = page.locator("#primary");
  await link.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
  }, { once: true }));
  await link.hover();
  const result = await link.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    const svg = element.querySelector("svg")!;
    const paths = [...element.querySelectorAll("path")];
    const timings = animations.map((animation) => {
      const { duration, delay, iterations } = animation.effect!.getTiming();
      return { duration, delay, iterations };
    });
    const samples = [0, 150, 299, 300, 475, 650, 850, 1050, 1400].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return {
        time, scale: new DOMMatrix(getComputedStyle(svg).transform).a,
        text: paths.slice(2).map((path) => parseFloat(getComputedStyle(path).strokeDasharray) / path.getTotalLength()),
        fixed: paths.slice(0, 2).map((path) => ({ dash: getComputedStyle(path).strokeDasharray, transform: getComputedStyle(path).transform })),
      };
    });
    animations.forEach((animation) => animation.finish());
    return { timings, samples };
  });
  expect(result.timings).toEqual([
    { duration: 300, delay: 0, iterations: 1 },
    { duration: 700, delay: 300, iterations: 1 },
    { duration: 700, delay: 500, iterations: 1 },
    { duration: 700, delay: 700, iterations: 1 },
  ]);
  expect(result.samples[0].scale).toBe(1);
  expect(result.samples[1].scale).toBeGreaterThan(1.025);
  expect(result.samples[3].scale).toBeCloseTo(1.05, 5);
  expect(result.samples[2].text).toEqual([1, 1, 1]);
  expect(result.samples[4].text[0]).toBeCloseTo(0.31536, 4);
  expect(result.samples[5].text[0]).toBeCloseTo(0, 6);
  expect(result.samples[6].text[1]).toBeCloseTo(0, 6);
  expect(result.samples[7].text[2]).toBeCloseTo(0, 6);
  expect(result.samples[8].text).toEqual([1, 1, 1]);
  for (const sample of result.samples) expect(sample.fixed).toEqual([{ dash: "none", transform: "none" }, { dash: "none", transform: "none" }]);
  await expect(link.locator("svg")).toHaveCSS("transform", "matrix(1.05, 0, 0, 1.05, 0, 0)");
  await page.mouse.move(0, 0);
  await expect(link.locator("svg")).toHaveCSS("transform", "none");
  for (const path of await link.locator("path").all()) await expect(path).toHaveCSS("stroke-dasharray", "none");
});

for (const time of [100, 250, 450, 650, 825, 1025]) {
  test(`manual stop at ${time} ms cancels delayed entry and returns continuously`, async ({ page }) => {
    await page.goto("/file-text/");
    await page.waitForFunction(() => !!customElements.get("grave-file-text"));
    const control = page.locator("#controlled");
    await control.hover();
    expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const result = await control.locator("grave-file-text").evaluate((element: FileTextElement, time) => {
      const svg = element.querySelector("svg")!;
      const paths = [...element.querySelectorAll("path")].slice(2);
      const pose = () => [new DOMMatrix(getComputedStyle(svg).transform).a, ...paths.map((path) => parseFloat(getComputedStyle(path).strokeDasharray) / path.getTotalLength())];
      element.startAnimation();
      const entry = element.getAnimations({ subtree: true });
      entry.forEach((animation) => { animation.pause(); animation.currentTime = time; });
      const before = pose();
      element.stopAnimation();
      const returning = element.getAnimations({ subtree: true });
      returning.forEach((animation) => { animation.pause(); animation.currentTime = 0; });
      const start = pose();
      const timings = returning.map((animation) => animation.effect!.getTiming());
      returning.forEach((animation) => { animation.currentTime = 300; });
      const end = pose();
      returning.forEach((animation) => animation.finish());
      return { before, start, end, timings, old: entry.map((animation) => animation.playState) };
    }, time);
    result.start.forEach((value, index) => expect(value).toBeCloseTo(result.before[index], 4));
    expect(result.end).toEqual([1, 1, 1, 1]);
    expect(result.old).toEqual(["idle", "idle", "idle", "idle"]);
    expect(result.timings.map((timing) => timing.delay)).toEqual([0, 0, 0, 0]);
    expect(result.timings.slice(1).map((timing) => timing.duration)).toEqual([300, 300, 300]);
    await expect(control.locator("svg")).toHaveCSS("transform", "none");
    for (const path of await control.locator("path").all()) await expect(path).toHaveCSS("stroke-dasharray", "none");
    await page.waitForTimeout(1450 - time);
    expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("replaying during a text cycle restarts its full-length keyframes while scale stays continuous", async ({ page }) => {
  await page.goto("/file-text/");
  await page.waitForFunction(() => !!customElements.get("grave-file-text"));
  const icon = page.locator("#controlled grave-file-text");
  const result = await icon.evaluate((element: FileTextElement) => {
    const scale = () => new DOMMatrix(getComputedStyle(element.querySelector("svg")!).transform).a;
    const lengths = () => [...element.querySelectorAll("path")].slice(2).map((path) => parseFloat(getComputedStyle(path).strokeDasharray) / path.getTotalLength());
    element.startAnimation();
    const previous = element.getAnimations({ subtree: true });
    previous.forEach((animation) => { animation.pause(); animation.currentTime = 825; });
    const before = { scale: scale(), lengths: lengths() };
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    return { before, after: { scale: scale(), lengths: lengths() }, previous: previous.map((animation) => animation.playState) };
  });
  expect(result.before.lengths.some((length) => length < 0.1)).toBe(true);
  expect(result.after.lengths).toEqual([1, 1, 1]);
  expect(result.after.scale).toBeCloseTo(result.before.scale, 5);
  expect(result.previous).toEqual(["idle", "idle", "idle", "idle"]);
  await page.waitForTimeout(100);
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).map((animation) => animation.playState))).toEqual(["paused", "paused", "paused", "paused"]);
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} prevents delayed work and stale finishes after rapid replay`, async ({ page }) => {
    await page.goto("/file-text/");
    await page.waitForFunction(() => !!customElements.get("grave-file-text"));
    const icon = page.locator("#controlled grave-file-text");
    const instance = await icon.elementHandle();
    const count = await icon.evaluate((element: FileTextElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 600; });
      const count = element.getAnimations({ subtree: true }).length;
      if (interruption === "remove") element.remove();
      if (interruption === "stop") element.stopAnimation();
      return count;
    }, interruption);
    expect(count).toBe(4);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    const clean = () => instance!.evaluate((element) => ({
      count: element.getAnimations({ subtree: true }).length,
      styles: [...element.querySelectorAll<SVGElement>("svg, path")].map((shape) => shape.style.cssText),
    }));
    await expect.poll(clean).toEqual({ count: 0, styles: ["", "", "", "", "", ""] });
    await page.waitForTimeout(1500);
    expect(await clean()).toEqual({ count: 0, styles: ["", "", "", "", "", ""] });
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("standalone and manual playback respect reduced motion", async ({ page }) => {
  await page.goto("/file-text/");
  await page.waitForFunction(() => !!customElements.get("grave-file-text"));
  await page.locator("#standalone").hover();
  await expect.poll(() => page.locator("#standalone").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(4);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#controlled").click();
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const svg of await page.locator("svg").all()) await expect(svg).toHaveCSS("transform", "none");
  for (const path of await page.locator("path").all()) await expect(path).toHaveCSS("stroke-dasharray", "none");
});

test("small-size scale, path lengths and painted endpoints match an independent reference", async ({ page }) => {
  await page.goto("/file-text-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-file-text"));
  for (const interruption of [null, 100, 250, 450, 650, 825, 1025]) {
    const samples = await page.evaluate((interruption) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruption ?? 0; });
      if (interruption !== null) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = [0, 25, 50, 100, 150, 200, 250, 299, 300, 475, 650, 700, 825, 850, 1000, 1050, 1200, 1400].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].flatMap((row) => {
          const pose = (selector: string) => {
            const svg = row.querySelector<SVGSVGElement>(`${selector} svg`)!;
            const transform = svg.getScreenCTM()!;
            return [...svg.querySelectorAll("path")].map((path, index) => {
              const style = getComputedStyle(path);
              const length = style.strokeDasharray === "none" ? 1 : parseFloat(style.strokeDasharray) / (path.hasAttribute("pathLength") ? 1 : path.getTotalLength());
              const start = path.getPointAtLength(0).matrixTransform(transform);
              const end = path.getPointAtLength(path.getTotalLength() * length).matrixTransform(transform);
              const bounds = path.getBoundingClientRect();
              const center = svg.getBoundingClientRect();
              return { index, scale: new DOMMatrix(getComputedStyle(svg).transform).a, length, startX: start.x - center.x, startY: start.y - center.y, endX: end.x - center.x, endY: end.y - center.y, width: bounds.width, height: bounds.height, stroke: parseFloat(style.strokeWidth), cap: style.strokeLinecap };
            });
          };
          return pose("[data-adapter]").map((adapter, index) => ({ time, size: row.getAttribute("data-size"), adapter, reference: pose("[data-reference]")[index] }));
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, interruption);
    expect(samples).toHaveLength(360);
    for (const property of ["scale", "length", "startX", "startY", "endX", "endY", "width", "height"] as const) {
      const worst = samples.reduce((worst, sample) => Math.abs(sample.adapter[property] - sample.reference[property]) > Math.abs(worst.adapter[property] - worst.reference[property]) ? sample : worst);
      const message = `${interruption === null ? "entry" : `return at ${interruption}ms`}, ${worst.size}px, path ${worst.adapter.index}, ${worst.time}ms, ${property}`;
      expect(Math.abs(worst.adapter[property] - worst.reference[property]), message).toBeLessThan(property === "scale" || property === "length" ? 0.00005 : 0.03);
    }
    expect(samples.every((sample) => sample.adapter.stroke === 2 && sample.adapter.cap === "round")).toBe(true);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
