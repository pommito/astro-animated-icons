import { expect, test } from "@playwright/test";

test("reduced motion keeps the icon static and preserves the native control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const link = page.getByRole("link", { name: "Back to articles 14 px" });
  const resting = await link.locator("path").first().boundingBox();
  await link.hover();
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  expect(await link.locator("path").first().boundingBox()).toEqual(resting);
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#destination$/);
  await expect(page.getByRole("img", { name: "Left arrow" })).toBeVisible();
});

test("changing the motion preference during playback cancels travel immediately", async ({ page }) => {
  await page.goto("/");
  const link = page.locator("#primary");
  const resting = (await link.locator("path").first().boundingBox())!.x;
  await link.hover();
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.pause()));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  expect((await link.locator("path").first().boundingBox())!.x).toBeCloseTo(resting, 1);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(0, 0);
  await link.hover();
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
});

test("touch does not trigger decorative hover playback", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/");
  const button = page.getByRole("button", { name: "Go back 24 px" });
  await button.tap();
  expect(await button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await context.close();
});

test("keyboard focus keeps the arrow static and the link usable", async ({ page }) => {
  await page.goto("/");
  const link = page.locator("#primary");
  await link.focus();
  await expect(link).toBeFocused();
  expect(await link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#destination$/);
});
