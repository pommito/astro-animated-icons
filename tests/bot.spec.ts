import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type BotElement = HTMLElement & IconHandle;

test("Bot renders its full accessible drawing without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/bot/");
  const link = page.getByRole("link", { name: "Bot example", exact: true });
  expect(await link.locator("path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d"))))
    .toEqual(["M12 8V4H8", "M2 14h2", "M20 14h2"]);
  for (const [attribute, value] of Object.entries({ height: "12", rx: "2", width: "16", x: "4", y: "8" })) {
    await expect(link.locator("rect")).toHaveAttribute(attribute, value);
  }
  expect(await link.locator("line").evaluateAll((eyes) => eyes.map((eye) => ["x1", "x2", "y1", "y2"].map((key) => eye.getAttribute(key)))))
    .toEqual([["15", "15", "13", "15"], ["9", "9", "13", "15"]]);
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  for (const eye of await link.locator("line").all()) {
    await expect(eye).toHaveCSS("stroke-linecap", "round");
    await expect(eye).toHaveCSS("stroke-linejoin", "round");
    await expect(eye).toHaveCSS("stroke-dasharray", "none");
  }
  await expect(page.getByRole("img", { name: "Bot icon" })).toBeVisible();
  expect(await link.locator("grave-bot").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("hover delays both eyes, closes to round dots, and completes one blink", async ({ page }) => {
  await page.goto("/bot/");
  await page.waitForFunction(() => !!customElements.get("grave-bot"));
  const link = page.locator("#primary");
  await link.evaluate((element) => element.addEventListener("pointerenter", () => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
  }, { once: true }));
  await link.hover();
  const result = await link.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    const staticBefore = [...element.querySelectorAll("path, rect")].map((shape) => shape.outerHTML);
    const timings = animations.map((animation) => {
      const timing = animation.effect!.getTiming();
      return [timing.delay, timing.duration, timing.iterations];
    });
    const samples = [0, 199, 200, 325, 450, 575, 700].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return [...element.querySelectorAll("line")].map((eye) => {
        const style = getComputedStyle(eye);
        const y1 = 13 - parseFloat(style.strokeDashoffset);
        return [y1, y1 + parseFloat(style.strokeDasharray), parseFloat(style.strokeWidth)];
      });
    });
    animations.forEach((animation) => animation.finish());
    return { timings, samples, staticBefore, staticAfter: [...element.querySelectorAll("path, rect")].map((shape) => shape.outerHTML) };
  });
  expect(result.timings).toEqual(Array(4).fill([200, 500, 1]));
  const expected = [[13, 15, 2], [13, 15, 2], [13, 15, 2], [13.5, 14.5, 2], [14, 14, 2], [13.5, 14.5, 2], [13, 15, 2]];
  result.samples.forEach((eyes, index) => eyes.forEach((eye) => eye.forEach((value, key) => expect(value).toBeCloseTo(expected[index][key], 4))));
  expect(result.staticAfter).toEqual(result.staticBefore);
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  for (const eye of await link.locator("line").all()) await expect(eye).toHaveAttribute("style", "");
});

for (const time of [50, 325, 450, 575]) {
  test(`manual stop at ${time} ms cancels entry delay and returns continuously over 300 ms`, async ({ page }) => {
    await page.goto("/bot/");
    await page.waitForFunction(() => !!customElements.get("grave-bot"));
    const control = page.locator("#controlled");
    await control.hover();
    expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const result = await control.locator("grave-bot").evaluate((element: BotElement, time) => {
      const pose = () => [...element.querySelectorAll("line")].flatMap((eye) => {
        const style = getComputedStyle(eye);
        return [parseFloat(style.strokeDasharray), parseFloat(style.strokeDashoffset)];
      });
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
    expect(result.start).toEqual(result.before);
    expect(result.timings).toEqual(Array(4).fill([0, 300]));
    result.middle.forEach((value, index) => {
      const end = index % 2 === 0 ? 2 : 0;
      expect(value).toBeGreaterThanOrEqual(result.before[index]);
      expect(value).toBeLessThanOrEqual(end);
    });
    await expect.poll(() => control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    for (const eye of await control.locator("line").all()) await expect(eye).toHaveAttribute("style", "");
    await page.waitForTimeout(720);
    expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} cancels delayed replay despite queued finish callbacks`, async ({ page }) => {
    await page.goto("/bot/");
    await page.waitForFunction(() => !!customElements.get("grave-bot"));
    const icon = page.locator("#controlled grave-bot");
    const instance = await icon.elementHandle();
    const count = await icon.evaluate((element: BotElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 50; });
      const count = element.getAnimations({ subtree: true }).length;
      if (interruption === "remove") element.remove();
      if (interruption === "stop") element.stopAnimation();
      return count;
    }, interruption);
    expect(count).toBe(4);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => instance!.evaluate((element) => ({
      count: element.getAnimations({ subtree: true }).length,
      styles: [...element.querySelectorAll("line")].map((eye) => eye.style.cssText),
    }))).toEqual({ count: 0, styles: ["", ""] });
    await page.waitForTimeout(720);
    expect(await instance!.evaluate((element) => [...element.querySelectorAll("line")].map((eye) => eye.style.cssText))).toEqual(["", ""]);
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("a queued completion cannot clear a newer blink or its interrupted return", async ({ page }) => {
  await page.goto("/bot/");
  await page.waitForFunction(() => !!customElements.get("grave-bot"));
  const icon = page.locator("#controlled grave-bot");
  await icon.evaluate((element: BotElement) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 450; });
  });
  await page.waitForTimeout(100);
  await expect(icon.locator("line").first()).toHaveCSS("stroke-dasharray", "0px, 4px");
  expect(await icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(4);
  await icon.evaluate((element: BotElement) => element.stopAnimation());
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("line").first()).toHaveCSS("stroke-dasharray", "none");
});

test("standalone hover and manual calls keep the complete static drawing under reduced motion", async ({ page }) => {
  await page.goto("/bot/");
  await page.waitForFunction(() => !!customElements.get("grave-bot"));
  await page.locator("#standalone").hover();
  await expect.poll(() => page.locator("#standalone").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(4);
  await page.locator("#standalone").evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => {
    animation.pause(); animation.currentTime = 450;
  }));
  await expect(page.locator("#standalone line").first()).toHaveCSS("stroke-dasharray", "0px, 4px");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#controlled").click();
  await page.locator("#stop-controlled").click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const eye of await page.locator("line").all()) {
    await expect(eye).toHaveCSS("stroke-dasharray", "none");
    await expect(eye).toHaveCSS("stroke-dashoffset", "0px");
    await expect(eye).toHaveAttribute("y1", "13");
    await expect(eye).toHaveAttribute("y2", "15");
  }
});

test("painted eye endpoints match the independent attribute reference at every small size", async ({ page }) => {
  await page.goto("/bot-comparison/");
  await page.waitForFunction(() => !!customElements.get("grave-bot"));
  for (const interruption of [null, 50, 325, 450, 575]) {
    const samples = await page.evaluate((interruption) => {
      const sampleReference = () => document.querySelectorAll("[data-reference]").forEach((control) => control.dispatchEvent(new Event("bot-sample")));
      document.querySelector<HTMLButtonElement>("#play")!.click();
      let animations = document.getAnimations();
      animations.forEach((animation) => { animation.pause(); animation.currentTime = interruption ?? 0; });
      sampleReference();
      if (interruption !== null) {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        animations = document.getAnimations();
        animations.forEach((animation) => animation.pause());
      }
      const result = [0, 50, 150, 199, 200, 250, 325, 400, 450, 500, 575, 650, 700].flatMap((time) => {
        animations.forEach((animation) => { animation.currentTime = time; });
        sampleReference();
        return [...document.querySelectorAll("tr[data-size]")].flatMap((row) => {
          const size = Number(row.getAttribute("data-size"));
          const pose = (eye: SVGLineElement, adapter: boolean) => {
            const style = getComputedStyle(eye);
            const dashed = adapter && style.strokeDasharray !== "none";
            const y1 = dashed ? 13 - parseFloat(style.strokeDashoffset) : Number(eye.getAttribute("y1"));
            return [Number(eye.getAttribute("x1")), Number(eye.getAttribute("x2")), y1,
              dashed ? y1 + parseFloat(style.strokeDasharray) : Number(eye.getAttribute("y2")), parseFloat(style.strokeWidth)].map((value) => value * size / 24);
          };
          return [...row.querySelectorAll<SVGLineElement>("[data-adapter] line")].map((eye, index) => ({
            time, size, adapter: pose(eye, true), reference: pose(row.querySelectorAll<SVGLineElement>("[data-reference] line")[index], false),
          }));
        });
      });
      animations.forEach((animation) => animation.finish());
      return result;
    }, interruption);
    for (const sample of samples) sample.adapter.forEach((value, index) => {
      expect(Math.abs(value - sample.reference[index]), `${interruption ?? "entry"}, ${sample.time}ms, ${sample.size}px`).toBeLessThan(0.001);
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const eye of await page.locator("line").all()) {
    await expect(eye).toHaveAttribute("y1", "13");
    await expect(eye).toHaveAttribute("y2", "15");
    await expect(eye).toHaveCSS("stroke-dasharray", "none");
  }
});
