import { expect, test } from "@playwright/test";

test("the named Astro export renders a visible arrow and working link without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const link = page.getByRole("link", { name: "Back to articles 14 px", exact: true });
  const svg = link.locator("svg");
  await expect(svg).toBeVisible();
  await expect(svg).toHaveAttribute("width", "14");
  await expect(svg).toHaveAttribute("height", "14");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
  await expect(svg.locator("path")).toHaveCount(2);
  await expect(svg.locator("path").nth(0)).toHaveAttribute("d", "m12 19-7-7 7-7");
  await expect(svg.locator("path").nth(1)).toHaveAttribute("d", "M19 12H5");
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("the containing link compresses the arrow like the reference and restores its geometry", async ({ page }) => {
  await page.goto("/");
  const link = page.locator("#primary");
  const tip = link.locator("path").first();
  const resting = (await tip.boundingBox())!.x;
  const shaft = link.locator("path").nth(1);
  const shaftAtRest = (await shaft.boundingBox())!;
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await link.hover({ position: { x: 80, y: 8 } });
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await link.evaluate((element) => {
    for (const animation of element.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
    }
  });
  expect((await tip.boundingBox())!.x).toBeGreaterThan(resting + 0.5);
  const compressed = (await shaft.boundingBox())!;
  expect(compressed.width).toBeLessThan(shaftAtRest.width - 0.5);
  expect(compressed.x + compressed.width).toBeCloseTo(shaftAtRest.x + shaftAtRest.width, 1);
  await link.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.play()));
  await expect.poll(() => link.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  expect((await tip.boundingBox())!.x).toBeCloseTo(resting, 1);
});
