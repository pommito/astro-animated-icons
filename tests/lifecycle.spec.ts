import { expect, test } from "@playwright/test";

test("a template instance inserted after registration animates independently and reconnects to a new control", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add instance" }).click();
  const dynamic = page.locator("#dynamic a").first();
  const arrow = dynamic.locator("grave-arrow-left");
  await expect(arrow).toBeVisible();
  const oldControl = await dynamic.elementHandle();
  const instance = await arrow.elementHandle();

  await dynamic.hover();
  await expect.poll(() => dynamic.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  expect(await page.locator("#primary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  const running = await arrow.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    element.remove();
    return animations.map((animation) => animation.playState);
  });
  expect(running).toEqual(["idle", "idle"]);
  await page.mouse.move(0, 0);
  await page.locator("#primary").evaluate((control, element) => control.append(element!), instance);
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.locator("#primary").hover();
    await expect.poll(() => instance!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
    await page.mouse.move(0, 0);
  }
  await expect.poll(() => instance!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await oldControl!.hover();
  expect(await instance!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.getByRole("button", { name: "Remove instance" }).click();
  await expect(page.locator("#dynamic a")).toHaveCount(0);
});

test("an instance inserted before registration upgrades without consumer registration code", async ({ page }) => {
  let release!: () => void;
  const registration = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/_astro/*.js", async (route) => {
    await registration;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator("#primary svg")).toBeVisible();
    expect(await page.evaluate(() => customElements.get("grave-arrow-left") !== undefined)).toBe(false);
    await page.evaluate(() => {
      const template = document.querySelector<HTMLTemplateElement>("#instance-template")!;
      document.querySelector("#dynamic")!.append(template.content.cloneNode(true));
    });
  } finally {
    release();
  }
  await page.waitForFunction(() => customElements.get("grave-arrow-left") !== undefined);
  const dynamic = page.locator("#dynamic a");
  await dynamic.hover();
  await expect.poll(() => dynamic.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
});
