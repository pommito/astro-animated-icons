import { expect, test } from "@playwright/test";

test("Replay visibly restarts an icon after its entry has completed", async ({ page }) => {
  await page.goto("/folders-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  const row = page.locator('tr[data-icon="folder-clock"][data-size="24"]');
  const replay = row.getByRole("button", { name: "Replay FolderClock at 24 pixels" });
  const hand = row.locator("[data-adapter] line").last();
  const rotation = () => hand.evaluate((hand) => new DOMMatrix(getComputedStyle(hand).transform).a);
  await replay.focus();
  await page.keyboard.press("Enter");
  await expect.poll(rotation).toBeCloseTo(Math.SQRT1_2, 4);
  await expect
    .poll(() => row.locator("[data-adapter]").evaluate((element) => element.getAnimations({ subtree: true }).length))
    .toBe(0);
  await page.keyboard.press("Enter");
  await expect.poll(rotation, { intervals: [20] }).toBeGreaterThan(0.999);
  await expect.poll(rotation).toBeCloseTo(Math.SQRT1_2, 4);
});

test("hovering a comparison row plays both versions and stops them on leave", async ({ page }) => {
  await page.goto("/folders-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  const row = page.locator('tr[data-icon="folder-heart"][data-size="24"]');
  await row.hover();
  await expect
    .poll(() => row.locator("[data-adapter]").evaluate((element) => element.getAnimations({ subtree: true }).length))
    .toBe(2);
  await expect
    .poll(() =>
      row
        .locator("[data-reference] path")
        .last()
        .evaluate((path) => new DOMMatrix(getComputedStyle(path).transform).a),
    )
    .toBeGreaterThan(1.001);
  expect(
    await page
      .locator('tr[data-icon="folder-heart"][data-size="16"] [data-adapter]')
      .evaluate((element) => element.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await page.mouse.move(0, 0);
  await expect.poll(() => row.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(row.locator("[data-reference] path").last()).toHaveCSS("opacity", "0.9");
});

test("the row Replay button restarts a paused pair with the keyboard", async ({ page }) => {
  await page.goto("/folders-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  const row = page.locator('tr[data-icon="folder-heart"][data-size="24"]');
  const replay = row.getByRole("button", { name: "Replay FolderHeart at 24 pixels" });
  await replay.focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(() => row.locator("[data-adapter]").evaluate((element) => element.getAnimations({ subtree: true }).length))
    .toBe(2);
  await page.locator("#seek").click();
  expect(
    await row
      .locator("[data-adapter]")
      .evaluate((element) => element.getAnimations({ subtree: true }).map((animation) => animation.playState)),
  ).toEqual(["paused", "paused"]);
  await replay.focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(() =>
      row
        .locator("[data-adapter]")
        .evaluate((element) => element.getAnimations({ subtree: true }).map((animation) => animation.playState)),
    )
    .toEqual(["running", "running"]);
  await expect
    .poll(() =>
      row
        .locator("[data-reference] path")
        .last()
        .evaluate((path) => new DOMMatrix(getComputedStyle(path).transform).a),
    )
    .toBeGreaterThan(1.001);
});

test("local hover and Replay respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/folders-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  const row = page.locator('tr[data-icon="folder-heart"][data-size="24"]');
  await row.hover();
  await row.getByRole("button", { name: "Replay FolderHeart at 24 pixels" }).click();
  expect(await row.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(row.locator("[data-adapter] path").last()).toHaveCSS("transform", "none");
  await expect(row.locator("[data-reference] path").last()).toHaveCSS("opacity", "0.9");
});
