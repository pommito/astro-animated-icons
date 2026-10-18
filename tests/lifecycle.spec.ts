import { userIcons } from "./helpers/user-icons.js";
import { displayIcons } from "./helpers/display-icons.js";
import { folders } from "./helpers/folders.js";
import { gitIcons } from "./helpers/git-icons.js";
import { grips } from "./helpers/grips.js";
import { chevrons } from "./helpers/chevrons.js";
import { expect, test } from "@playwright/test";
import { pauseAnimationsOnPointer } from "./helpers/pause-animations.js";

for (const { name, route, tag, animationCount } of [
  ...userIcons.map(({ name, slug, tag, animationCount }) => ({ name, route: `/${slug}/`, tag, animationCount, label: `${name} icon`, axis: "x" as const })),
  ...displayIcons.map(({ name, slug, tag, animationCount }) => ({ name, route: `/${slug}/`, tag, animationCount, label: `${name} icon`, axis: "x" as const })),
  ...folders.map(({ name, slug, tag, animationCount }) => ({ name, route: `/${slug}/`, tag, animationCount, label: `${name} icon`, axis: "x" as const })),
  ...gitIcons.filter(({ slug }) => !slug.startsWith("folder-")).map(({ name, slug, tag, animationCount }) => ({ name, route: `/${slug}/`, tag, animationCount, label: `${name} icon`, axis: "x" as const })),
  ...chevrons.map(({ name, slug, tag, kind, axis }) => ({ name, route: `/${slug}/`, tag, animationCount: kind === "spring" ? 2 : 1, label: `${name} icon`, axis: axis === "X" ? "x" as const : "y" as const })),
  ...grips.map(({ name, slug, tag, pulse, circles }) => ({ name, route: `/${slug}/`, tag, animationCount: circles.length * (pulse ? 2 : 1), label: `${name} icon`, axis: "x" as const })),
  { name: "Home", route: "/home/", tag: "grave-home", animationCount: 2 },
  { name: "ArrowDown", route: "/arrow-down/", tag: "grave-arrow-down", animationCount: 2 },
  { name: "ArrowLeft", route: "/", tag: "grave-arrow-left", animationCount: 2 },
  { name: "ArrowRight", route: "/arrow-right/", tag: "grave-arrow-right", animationCount: 2 },
  { name: "MapPin", route: "/map-pin/", tag: "grave-map-pin", animationCount: 4 },
  { name: "Copy", route: "/copy/", tag: "grave-copy", animationCount: 2 },
  { name: "AtSign", route: "/at-sign/", tag: "grave-at-sign", animationCount: 5 },
  { name: "AttachFile", route: "/attach-file/", tag: "grave-attach-file", animationCount: 2 },
  { name: "Check", route: "/check/", tag: "grave-check", animationCount: 3 },
  { name: "ArrowUp", route: "/arrow-up/", tag: "grave-arrow-up", animationCount: 2 },
  { name: "FileText", route: "/file-text/", tag: "grave-file-text", animationCount: 4 },

  { name: "Bot", route: "/bot/", tag: "grave-bot", animationCount: 4 },
  { name: "ArrowUpRight", route: "/arrow-up-right/", tag: "grave-arrow-up-right", animationCount: 1 },
  { name: "ArrowUpLeft", route: "/arrow-up-left/", tag: "grave-arrow-up-left", animationCount: 1 },
  { name: "AudioLines", route: "/audio-lines/", tag: "grave-audio-lines", animationCount: 8 },
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

      await pauseAnimationsOnPointer(dynamic);
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
      await pauseAnimationsOnPointer(page.locator("#primary"));
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
      await pauseAnimationsOnPointer(dynamic);
      await dynamic.hover();
      await expect.poll(() => dynamic.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(animationCount);
    });
  });
}
