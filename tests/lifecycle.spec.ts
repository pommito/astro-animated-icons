import { expect, test } from "@playwright/test";

for (const { name, route, tag, animationCount } of [
  { name: "ArrowDown", route: "/arrow-down/", tag: "grave-arrow-down", animationCount: 2 },
  { name: "ArrowLeft", route: "/", tag: "grave-arrow-left", animationCount: 2 },
  { name: "ArrowRight", route: "/arrow-right/", tag: "grave-arrow-right", animationCount: 2 },
  { name: "MapPin", route: "/map-pin/", tag: "grave-map-pin", animationCount: 4 },
  { name: "Copy", route: "/copy/", tag: "grave-copy", animationCount: 2 },
  { name: "AtSign", route: "/at-sign/", tag: "grave-at-sign", animationCount: 5 },
  { name: "Check", route: "/check/", tag: "grave-check", animationCount: 3 },
  { name: "ArrowUp", route: "/arrow-up/", tag: "grave-arrow-up", animationCount: 2 },
  { name: "ArrowUpRight", route: "/arrow-up-right/", tag: "grave-arrow-up-right", animationCount: 1 },
  { name: "ArrowUpLeft", route: "/arrow-up-left/", tag: "grave-arrow-up-left", animationCount: 1 },
]) {
  test.describe(name, () => {
    test("a template instance inserted after registration animates independently and reconnects to a new control", async ({ page }) => {
      await page.goto(route);
      await page.getByRole("button", { name: "Add instance" }).click();
      const dynamic = page.locator("#dynamic a").first();
      const icon = dynamic.locator(tag);
      await expect(icon).toBeVisible();
      const oldControl = await dynamic.elementHandle();
      const instance = await icon.elementHandle();
      await dynamic.evaluate((control) => control.addEventListener("pointerenter", () => {
        control.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
      }));

      await dynamic.hover();
      await expect.poll(() => dynamic.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(animationCount);
      expect(await page.locator("#primary").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
      const running = await icon.evaluate((element) => {
        const animations = element.getAnimations({ subtree: true });
        element.remove();
        return animations.map((animation) => animation.playState);
      });
      expect(running).toEqual(Array(animationCount).fill("idle"));
      await page.mouse.move(0, 0);
      await page.locator("#primary").evaluate((control, element) => control.append(element!), instance);
      await page.locator("#primary").evaluate((control) => control.addEventListener("pointerenter", () => {
        control.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
      }));
      for (let cycle = 0; cycle < 3; cycle++) {
        await page.locator("#primary").hover();
        await expect.poll(() => instance!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(animationCount);
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
        await page.goto(route, { waitUntil: "commit" });
        await expect(page.locator("#primary svg")).toBeVisible();
        expect(await page.evaluate((tag) => customElements.get(tag) !== undefined, tag)).toBe(false);
        await page.evaluate(() => {
          const template = document.querySelector<HTMLTemplateElement>("#instance-template")!;
          document.querySelector("#dynamic")!.append(template.content.cloneNode(true));
        });
      } finally {
        release();
      }
      await page.waitForFunction((tag) => customElements.get(tag) !== undefined, tag);
      const dynamic = page.locator("#dynamic a");
      await dynamic.evaluate((element) => element.addEventListener("pointerenter", () => {
        element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
      }, { once: true }));
      await dynamic.hover();
      await expect.poll(() => dynamic.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(animationCount);
    });
  });
}
