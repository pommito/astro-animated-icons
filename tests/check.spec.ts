import { expect, test } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

type CheckElement = HTMLElement & IconHandle;

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`${interruption} after rapid retriggers and queued completions restores the full checkmark`, async ({ page }) => {
    await page.goto("/check/");
    await page.waitForFunction(() => !!customElements.get("grave-check"));
    const icon = page.locator("#controlled grave-check");
    const instance = await icon.elementHandle();
    const originalStyle = await icon.locator("path").evaluate((element: SVGElement) => element.style.cssText);
    const tracks = await icon.evaluate((element: CheckElement, interruption) => {
      for (let cycle = 0; cycle < 4; cycle++) {
        element.startAnimation();
        element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      }
      element.startAnimation();
      const tracks = element.getAnimations({ subtree: true }).length;
      if (interruption === "remove") element.remove();
      if (interruption === "stop") element.stopAnimation();
      return tracks;
    }, interruption);
    expect(tracks).toBe(3);
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => instance!.evaluate((element) => ({
      tracks: element.getAnimations({ subtree: true }).length,
      style: element.querySelector("path")!.style.cssText,
    }))).toEqual({ tracks: 0, style: originalStyle });
    await page.waitForTimeout(450);
    expect(await instance!.evaluate((element) => element.querySelector("path")!.style.cssText)).toBe(originalStyle);
    expect(await page.locator("#secondary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("the consumer reveals success only after its clipboard promise resolves", async ({ page }) => {
  await page.goto("/check/");
  const button = page.getByRole("button", { name: "Copy link", exact: true });
  await expect(button).toBeVisible();
  for (const outcome of ["reject", "resolve"] as const) {
    await button.click();
    await expect(page.getByRole("status")).toHaveText("Copying link");
    await expect(button.locator("grave-check")).toHaveCount(0);
    await expect(button.locator("grave-copy")).toBeVisible();
    const completion = page.getByRole("button", { name: outcome === "resolve" ? "Resolve clipboard promise" : "Reject clipboard promise" });
    await completion.evaluate((element) => element.addEventListener("click", () => {
      queueMicrotask(() => document.getAnimations().forEach((animation) => animation.pause()));
    }, { once: true }));
    await completion.click();
    await expect(button).toHaveAccessibleName("Copy link");
    if (outcome === "reject") {
      await expect(page.getByRole("status")).toHaveText("Could not copy link");
      await expect(button.locator("grave-check")).toHaveCount(0);
      expect(await button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    } else {
      await expect(page.getByRole("status")).toHaveText("Link copied");
      await expect(button.locator("grave-check")).toBeVisible();
      expect(await button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(3);
    }
  }
});

test("Check renders the complete accessible checkmark before JavaScript runs", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/check/");
  const link = page.getByRole("link", { name: "Check example", exact: true });
  const path = link.locator("path");
  await expect(path).toHaveAttribute("d", "M4 12 9 17L20 6");
  await expect(path).toHaveCSS("opacity", "1");
  await expect(path).toHaveCSS("stroke-dasharray", "none");
  await expect(path).toHaveCSS("transform", "none");
  await expect(path).toHaveCSS("stroke-linecap", "round");
  await expect(path).toHaveCSS("stroke-linejoin", "round");
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("img", { name: "Check icon" })).toBeVisible();
  expect(await link.locator("grave-check").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});
