import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type AttachFileElement = HTMLElement & IconHandle;
const pathData = "M6 7.90909V16C6 19.3137 8.68629 22 12 22V22C15.3137 22 18 19.3137 18 16V6C18 3.79086 16.2091 2 14 2V2C11.7909 2 10 3.79086 10 6V15.1818C10 16.2864 10.8954 17.1818 12 17.1818V17.1818C13.1046 17.1818 14 16.2864 14 15.1818V8";

test("AttachFile renders the complete accessible drawing without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/attach-file/");
  const link = page.getByRole("link", { name: "AttachFile example", exact: true });
  await expect(link.locator("path")).toHaveAttribute("d", pathData);
  await expect(link.locator("path")).toHaveCSS("opacity", "1");
  await expect(link.locator("path")).toHaveCSS("stroke-dasharray", "none");
  await expect(link.locator("path")).toHaveCSS("stroke-linecap", "round");
  await expect(link.locator("path")).toHaveCSS("stroke-linejoin", "round");
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("img", { name: "AttachFile icon" })).toBeVisible();
  expect(await link.locator("grave-attach-file").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover waits 100 ms then reveals opacity in 100 ms and the path in 400 ms without repeat", async ({ page }) => {
  await page.goto("/attach-file/");
  await page.waitForFunction(() => !!customElements.get("grave-attach-file"));
  const link = page.locator("#primary");
  await link.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
  }, { once: true }));
  await link.hover();
  const result = await link.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    const path = element.querySelector("path")!;
    const timings = animations.map((animation) => {
      const timing = animation.effect!.getTiming();
      return [timing.delay, timing.duration, timing.iterations];
    });
    const samples = [0, 50, 99, 100, 150, 200, 300, 500, 900].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      const style = getComputedStyle(path);
      return { opacity: Number(style.opacity), length: parseFloat(style.strokeDasharray) / path.getTotalLength() };
    });
    animations.forEach((animation) => animation.finish());
    return { samples, timings };
  });
  expect(result.timings).toEqual([[100, 100, 1], [100, 400, 1]]);
  for (const sample of result.samples.slice(0, 4)) expect(sample).toEqual({ opacity: 0, length: 0 });
  expect(result.samples[4].opacity).toBeCloseTo(0.684643, 4);
  expect(result.samples[5].opacity).toBe(1);
  expect(result.samples[6].length).toBeCloseTo(0.684643, 4);
  expect(result.samples[7].length).toBeCloseTo(1, 4);
  expect(result.samples[8]).toEqual(result.samples[7]);
  await page.waitForTimeout(100);
  await expect(link.locator("path")).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await expect(link.locator("path")).toHaveAttribute("style", "");
});

for (const time of [50, 150, 250]) {
  test(`manual stop at ${time} ms cancels the delay and returns continuously over 300 ms`, async ({ page }) => {
    await page.goto("/attach-file/");
    await page.waitForFunction(() => !!customElements.get("grave-attach-file"));
    const control = page.locator("#controlled");
    await control.hover();
    expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const result = await control.locator("grave-attach-file").evaluate((element: AttachFileElement, time) => {
      const path = element.querySelector("path")!;
      const pose = () => {
        const style = getComputedStyle(path);
        return [Number(style.opacity), parseFloat(style.strokeDasharray) / path.getTotalLength()];
      };
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      const before = pose();
      element.stopAnimation();
      const animations = element.getAnimations({ subtree: true });
      const timings = animations.map((animation) => {
        animation.pause(); animation.currentTime = 0;
        const timing = animation.effect!.getTiming();
        return [timing.delay, timing.duration];
      });
      const start = pose();
      animations.forEach((animation) => { animation.currentTime = 150; });
      const middle = pose();
      animations.forEach((animation) => animation.finish());
      return { before, start, middle, timings };
    }, time);
    result.start.forEach((value, index) => expect(value).toBeCloseTo(result.before[index], 4));
    expect(result.middle[1]).toBeGreaterThan(result.start[1]);
    expect(result.timings).toEqual([[0, 300], [0, 300]]);
    await expect(control.locator("path")).toHaveAttribute("style", "");
    await page.waitForTimeout(550);
    expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("replaying during the reveal restarts the delayed keyframes", async ({ page }) => {
  await page.goto("/attach-file/");
  await page.waitForFunction(() => !!customElements.get("grave-attach-file"));
  const result = await page.locator("#controlled grave-attach-file").evaluate((element: AttachFileElement) => {
    element.startAnimation();
    const previous = element.getAnimations({ subtree: true });
    previous.forEach((animation) => { animation.pause(); animation.currentTime = 250; });
    element.startAnimation();
    const current = element.getAnimations({ subtree: true });
    current.forEach((animation) => { animation.pause(); animation.currentTime = 50; });
    const style = getComputedStyle(element.querySelector("path")!);
    return { previous: previous.map((animation) => animation.playState), count: current.length, opacity: style.opacity, dash: parseFloat(style.strokeDasharray) };
  });
  expect(result).toEqual({ previous: ["idle", "idle"], count: 2, opacity: "0", dash: 0 });
});

test("queued return completions cannot clear a newer paused reveal", async ({ page }) => {
  await page.goto("/attach-file/");
  await page.waitForFunction(() => !!customElements.get("grave-attach-file"));
  const icon = page.locator("#controlled grave-attach-file");
  await icon.evaluate((element: AttachFileElement) => {
    element.startAnimation(); element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 50; });
  });
  await page.waitForTimeout(100);
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await expect(icon.locator("path")).toHaveCSS("opacity", "0");
  expect(await icon.locator("path").evaluate((path) => parseFloat(getComputedStyle(path).strokeDasharray))).toBe(0);
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  for (const time of [50, 250]) {
    test(`${interruption} at ${time} ms cancels delayed work after rapid replay and queued completion`, async ({ page }) => {
      await page.goto("/attach-file/");
      await page.waitForFunction(() => !!customElements.get("grave-attach-file"));
      const icon = page.locator("#controlled grave-attach-file");
      const instance = await icon.elementHandle();
      await icon.evaluate((element: AttachFileElement, { interruption, time }) => {
        for (let cycle = 0; cycle < 4; cycle++) {
          element.startAnimation(); element.stopAnimation();
          element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
        }
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
        if (interruption === "remove") element.remove();
        if (interruption === "stop") element.stopAnimation();
      }, { interruption, time });
      if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(() => instance!.evaluate((element) => ({
        count: element.getAnimations({ subtree: true }).length,
        style: element.querySelector("path")!.style.cssText,
      }))).toEqual({ count: 0, style: "" });
      await page.waitForTimeout(550);
      expect(await instance!.evaluate((element) => element.querySelector("path")!.style.cssText)).toBe("");
      expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    });
  }
}

test("standalone hover and manual playback respect reduced motion", async ({ page }) => {
  await page.goto("/attach-file/");
  await page.waitForFunction(() => !!customElements.get("grave-attach-file"));
  const icon = page.locator("#standalone");
  await expect(icon.locator("svg")).toHaveAttribute("width", "28");
  await icon.hover();
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#controlled").click();
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const path of await page.locator("path").all()) {
    await expect(path).toHaveCSS("opacity", "1");
    await expect(path).toHaveCSS("stroke-dasharray", "none");
  }
});

test("small-size drawing matches the normalized-path reference on entry and interrupted returns", async ({ page }) => {
  await page.goto("/attach-file-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-attach-file"));
  for (const interruption of [null, 50, 150, 250]) {
    const comparison = await page.evaluate((interruption) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruption ?? 0; });
      if (interruption !== null) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const samples = [0, 25, 50, 99, 100, 150, 200, 300, 400, 500, 700].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        return [...document.querySelectorAll("tr[data-size]")].map((row) => {
          const pose = (selector: string) => {
            const path = row.querySelector<SVGPathElement>(selector)!;
            const style = getComputedStyle(path);
            const box = path.getBoundingClientRect();
            const origin = path.ownerSVGElement!.getBoundingClientRect();
            return {
              opacity: Number(style.opacity), length: parseFloat(style.strokeDasharray) / (path.hasAttribute("pathLength") ? 1 : path.getTotalLength()),
              x: box.x - origin.x, y: box.y - origin.y, width: box.width, height: box.height,
            };
          };
          return { time, size: row.getAttribute("data-size"), adapter: pose("[data-adapter] path"), reference: pose("[data-reference] path") };
        });
      });
      animations.forEach((animation) => animation.finish());
      return samples;
    }, interruption);
    for (const sample of comparison) {
      const message = `${interruption === null ? "entry" : `return at ${interruption}ms`}, ${sample.size}px, ${sample.time}ms`;
      for (const property of ["opacity", "length"] as const) expect(sample.adapter[property], message).toBeCloseTo(sample.reference[property], 4);
      for (const property of ["x", "y", "width", "height"] as const) expect(Math.abs(sample.adapter[property] - sample.reference[property]), message).toBeLessThan(0.03);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const path of await page.locator("path").all()) {
    await expect(path).toHaveCSS("opacity", "1");
    await expect(path).toHaveCSS("stroke-dasharray", "none");
  }
});
