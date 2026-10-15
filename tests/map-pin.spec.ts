import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type PinElement = HTMLElement & IconHandle;

for (const interruption of ["leave", "stop", "remove", "reduce"] as const) {
  test(`${interruption} before the reveal cancels delayed work and restores the complete circle`, async ({ page }) => {
    await page.goto("/map-pin/");
    await page.waitForFunction(() => !!customElements.get("grave-map-pin"));
    const icon = page.locator(interruption === "stop" ? "#controlled grave-map-pin" : "#primary grave-map-pin");
    const instance = await icon.elementHandle();
    await icon.evaluate((element: PinElement) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause();
        animation.currentTime = 150;
      });
    });
    await expect(icon.locator("circle")).toHaveCSS("opacity", "0");
    if (interruption === "leave") {
      await page.locator("#primary").dispatchEvent("pointerleave", { pointerType: "mouse" });
    } else if (interruption === "stop") {
      await icon.evaluate((element: PinElement) => element.stopAnimation());
    } else if (interruption === "remove") {
      await icon.evaluate((element: PinElement) => element.remove());
    } else {
      await page.emulateMedia({ reducedMotion: "reduce" });
    }
    await expect.poll(() => instance!.evaluate((element) => ({
      animations: element.getAnimations({ subtree: true }).length,
      styles: [...element.querySelectorAll("svg, circle")].map((part) => part.getAttribute("style") ?? ""),
    }))).toEqual({ animations: 0, styles: ["", ""] });
    await page.waitForTimeout(850);
    expect(await instance!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    expect(await instance!.evaluate((element) => element.querySelector("circle")!.getAttribute("style") ?? "")).toBe("");
  });
}

test("controlled playback ignores hover, holds after leaving, and stops from the raised state", async ({ page }) => {
  await page.goto("/map-pin/");
  await page.waitForFunction(() => !!customElements.get("grave-map-pin"));
  const control = page.locator("#controlled");
  await control.hover();
  expect(await control.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await control.click();
  await expect(control.locator("svg")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
  await expect(control.locator("circle")).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await expect(control.locator("svg")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  await expect(control.locator("svg")).toHaveCSS("transform", "none");
  await expect(control.locator("circle")).toHaveCSS("stroke-dasharray", "none");
});

test("rapid manual retriggering keeps one recipe active and other instances static", async ({ page }) => {
  await page.goto("/map-pin/");
  await page.waitForFunction(() => !!customElements.get("grave-map-pin"));
  const icon = page.locator("#controlled grave-map-pin");
  for (let cycle = 0; cycle < 4; cycle++) {
    await icon.evaluate((element: PinElement) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause();
        animation.currentTime = 200;
      });
      element.stopAnimation();
      element.startAnimation();
    });
    expect(await icon.evaluate((element: PinElement) => element.getAnimations({ subtree: true }).length)).toBe(4);
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  }
  await expect(icon.locator("svg")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(icon.locator("svg")).toHaveCSS("transform", "none");
  await expect(icon.locator("circle")).toHaveCSS("stroke-dasharray", "none");
  await icon.evaluate((element: PinElement) => element.startAnimation());
  expect(await icon.evaluate((element: PinElement) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

for (const stopAt of ["during", "after"] as const) {
  test(`a completed return cannot interfere with stopping ${stopAt} the next playback`, async ({ page }) => {
    await page.goto("/map-pin/");
    await page.waitForFunction(() => !!customElements.get("grave-map-pin"));
    const icon = page.locator("#controlled grave-map-pin");
    await icon.evaluate((element: PinElement) => {
      element.startAnimation();
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      element.startAnimation();
    });
    if (stopAt === "during") {
      await page.waitForTimeout(50);
    } else {
      await expect(icon.locator("svg")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
      await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    }
    const returning = await icon.evaluate((element: PinElement) => {
      element.stopAnimation();
      return element.getAnimations({ subtree: true }).length;
    });
    expect(returning).toBe(4);
    await expect(icon.locator("svg")).toHaveCSS("transform", "none");
    await expect(icon.locator("circle")).toHaveCSS("stroke-dasharray", "none");
  });
}

test("completed tracks cannot repaint a removed instance after a restart", async ({ page }) => {
  await page.goto("/map-pin/");
  await page.waitForFunction(() => !!customElements.get("grave-map-pin"));
  const icon = page.locator("#controlled grave-map-pin");
  const instance = await icon.elementHandle();
  await icon.evaluate((element: PinElement) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.startAnimation();
    element.remove();
  });
  await page.waitForTimeout(850);
  expect(await instance!.evaluate((element) => [...element.querySelectorAll("svg, circle")].map((part) => part.getAttribute("style") ?? ""))).toEqual(["", ""]);
  await page.locator("#controlled").evaluate((control, element) => control.append(element!), instance);
  await expect(icon.locator("svg")).toHaveCSS("transform", "none");
});

test("standalone hover and small sizes preserve SVG travel without clipping", async ({ page }) => {
  await page.goto("/map-pin/");
  await page.waitForFunction(() => !!customElements.get("grave-map-pin"));
  const icon = page.locator("#standalone");
  await expect(icon.locator("svg")).toHaveAttribute("width", "28");
  await icon.hover();
  await expect(icon.locator("svg")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
  for (const size of [14, 16, 24, 28]) {
    const result = await icon.evaluate((element: PinElement, size) => {
      const svg = element.querySelector("svg")!;
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause();
        animation.currentTime = 300;
      });
      return {
        overflow: getComputedStyle(svg).overflow,
        travel: new DOMMatrix(getComputedStyle(element.querySelector("svg")!).transform).m42,
        width: svg.getBoundingClientRect().width,
      };
    }, size);
    expect(result.overflow).toBe("visible");
    expect(result.travel).toBe(-5);
    expect(result.width).toBe(size);
  }
});

test("hover lifts the pin, delays the circle reveal, holds, and returns on leave", async ({ page }) => {
  await page.goto("/map-pin/");
  await expect.poll(() => page.evaluate(() => !!customElements.get("grave-map-pin"))).toBe(true);
  const link = page.locator("#primary");
  const drawing = link.locator("svg");
  const circle = link.locator("circle");
  await expect(drawing).toHaveCSS("transform", "none");
  await link.hover();
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => {
    animation.pause();
    animation.currentTime = 150;
  }));
  await expect(circle).toHaveCSS("opacity", "0");
  expect(await drawing.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42)).toBeLessThan(0);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => { animation.currentTime = 300; }));
  await expect(drawing).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -5)");
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => { animation.currentTime = 400; }));
  await expect(circle).toHaveCSS("opacity", "1");
  const dash = await circle.evaluate((element) => parseFloat(getComputedStyle(element).strokeDasharray));
  expect(dash).toBeGreaterThan(0);
  expect(dash).toBeLessThan(18.85);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => { animation.currentTime = 550; }));
  const reveal = await circle.evaluate((element: SVGCircleElement) => ({
    length: parseFloat(getComputedStyle(element).strokeDasharray) / element.getTotalLength(),
    offset: parseFloat(getComputedStyle(element).strokeDashoffset) / element.getTotalLength(),
  }));
  expect(reveal.length).toBeCloseTo(0.5, 3);
  expect(reveal.offset).toBeCloseTo(-0.25, 3);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect(drawing).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
  await page.waitForTimeout(150);
  await expect(drawing).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
  await page.mouse.move(0, 0);
  await expect(drawing).toHaveCSS("transform", "none");
  await expect(circle).toHaveCSS("opacity", "1");
  await expect(circle).toHaveCSS("stroke-dasharray", "none");
  await expect(circle).toHaveCSS("stroke-dashoffset", "0px");
});

test("MapPin renders the complete accessible location without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/map-pin/");
  const location = page.locator("#location");
  await expect(location).toHaveText("Paris, France");
  await expect(location.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(location.locator("path")).toHaveAttribute("d", "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0");
  await expect(location.locator("circle")).toHaveAttribute("r", "3");
  await expect(location.locator("circle")).toHaveCSS("opacity", "1");
  await expect(location.locator("circle")).toHaveCSS("stroke-dasharray", "none");
  await expect(page.getByRole("img", { name: "Location pin" })).toBeVisible();
  expect(await location.locator("grave-map-pin").getAttribute("tabindex")).toBeNull();
  await context.close();
});
