import { expect, test } from "@playwright/test";

for (const { name, route, tag, animationCount, label, axis } of [
  { name: "ArrowDown", route: "/arrow-down/", tag: "grave-arrow-down", animationCount: 2, label: "Down arrow", axis: "y" as const },
  { name: "ArrowLeft", route: "/", tag: "grave-arrow-left", animationCount: 2, label: "Left arrow", axis: "x" as const },
  { name: "ArrowRight", route: "/arrow-right/", tag: "grave-arrow-right", animationCount: 2, label: "Right arrow", axis: "x" as const },
  { name: "MapPin", route: "/map-pin/", tag: "grave-map-pin", animationCount: 4, label: "Location pin", axis: "y" as const },
  { name: "Copy", route: "/copy/", tag: "grave-copy", animationCount: 2, label: "Copy icon", axis: "x" as const },
  { name: "AtSign", route: "/at-sign/", tag: "grave-at-sign", animationCount: 5, label: "AtSign icon", axis: "x" as const },
  { name: "Check", route: "/check/", tag: "grave-check", animationCount: 3, label: "Check icon", axis: "x" as const },
  { name: "ArrowUp", route: "/arrow-up/", tag: "grave-arrow-up", animationCount: 2, label: "Up arrow", axis: "y" as const },
  { name: "Bot", route: "/bot/", tag: "grave-bot", animationCount: 4, label: "Bot icon", axis: "y" as const },
  { name: "ArrowUpRight", route: "/arrow-up-right/", tag: "grave-arrow-up-right", animationCount: 1, label: "Up-right arrow", axis: "y" as const },
]) {
  test.describe(name, () => {
    test("reduced motion keeps the icon static and preserves the native control", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      const link = page.locator("#primary");
      const resting = await link.locator("path").first().boundingBox();
      await link.hover();
      await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      expect(await link.locator("path").first().boundingBox()).toEqual(resting);
      await link.focus();
      await expect(link).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#destination$/);
      await expect(page.getByRole("img", { name: label })).toBeVisible();
    });

    test("changing the motion preference during playback cancels travel immediately", async ({ page }) => {
      await page.goto(route);
      await page.waitForFunction((tag) => customElements.get(tag) !== undefined, tag);
      const link = page.locator("#primary");
      await link.evaluate((control) => control.addEventListener("pointerenter", () => {
        control.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
      }));
      const resting = (await link.locator("path").first().boundingBox())![axis];
      await link.hover();
      await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(animationCount);
      await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.pause()));
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      expect((await link.locator("path").first().boundingBox())![axis]).toBeCloseTo(resting, 1);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.mouse.move(0, 0);
      await link.hover();
      await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(animationCount);
    });

    test("touch does not trigger decorative hover playback", async ({ browser }) => {
      const context = await browser.newContext({ hasTouch: true, isMobile: true });
      const page = await context.newPage();
      await page.goto(route);
      const button = page.locator("button").first();
      await button.tap();
      expect(await button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      await context.close();
    });

    test("keyboard focus keeps the icon static and the link usable", async ({ page }) => {
      await page.goto(route);
      const link = page.locator("#primary");
      await link.focus();
      await expect(link).toBeFocused();
      expect(await link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#destination$/);
    });

    test("a mouse still triggers hover when the primary pointer is touch", async ({ browser }) => {
      const context = await browser.newContext({ hasTouch: true, isMobile: true });
      const page = await context.newPage();
      await page.goto(route);
      await page.waitForFunction((tag) => customElements.get(tag) !== undefined, tag);
      expect(await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(false);
      const link = page.locator("#primary");
      await link.evaluate((element) => element.addEventListener("pointerenter", () => {
        element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
      }));
      await link.hover();
      await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(animationCount);
      await context.close();
    });
  });
}
