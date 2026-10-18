import { energyBluetoothIcons } from "./helpers/energy-bluetooth.js";
import { securityIcons } from "./helpers/security-icons.js";
import { clockCalendarIcons } from "./helpers/clock-calendar.js";

import { chartIcons } from "./helpers/chart-icons.js";
import { navigationIcons } from "./helpers/navigation-icons.js";
import { documentIcons } from "./helpers/documents.js";
import { commands } from "./helpers/commands.js";
import { userIcons } from "./helpers/user-icons.js";
import { displayIcons } from "./helpers/display-icons.js";
import { folders } from "./helpers/folders.js";
import { gitIcons } from "./helpers/git-icons.js";
import { grips } from "./helpers/grips.js";
import { chevrons } from "./helpers/chevrons.js";
import { expect, test } from "@playwright/test";

for (const { name, route, label } of [
  ...energyBluetoothIcons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...securityIcons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...clockCalendarIcons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),

  ...chartIcons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...navigationIcons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...documentIcons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...messageIcons.map(({ name, slug, tag, animationCount }) => ({ name, route: `/${slug}-props/`, tag, animationCount, label: `${name} icon`, axis: "x" as const })),
  ...commands.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...userIcons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...displayIcons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...folders.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...gitIcons.filter(({ slug }) => !slug.startsWith("folder-")).map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...chevrons.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  ...grips.map(({ name, slug }) => ({ name, route: `/${slug}-props/`, label: `${name} icon` })),
  { name: "Home", route: "/home-props/", label: "Home icon" },
  { name: "ArrowDown", route: "/arrow-down-props/", label: "Down arrow" },
  { name: "ArrowLeft", route: "/props/", label: "Back arrow" },
  { name: "ArrowRight", route: "/arrow-right-props/", label: "Right arrow" },
  { name: "MapPin", route: "/map-pin-props/", label: "Location pin" },
  { name: "Copy", route: "/copy-props/", label: "Copy icon" },
  { name: "Archive", route: "/archive-props/", label: "Archive icon" },
  { name: "AtSign", route: "/at-sign-props/", label: "AtSign icon" },
  { name: "AttachFile", route: "/attach-file-props/", label: "AttachFile icon" },
  { name: "Check", route: "/check-props/", label: "Check icon" },
  { name: "ArrowUp", route: "/arrow-up-props/", label: "Up arrow" },
  { name: "FileText", route: "/file-text-props/", label: "FileText icon" },

  { name: "Bot", route: "/bot-props/", label: "Bot icon" },
  { name: "ArrowUpRight", route: "/arrow-up-right-props/", label: "Up-right arrow" },
  { name: "ArrowUpLeft", route: "/arrow-up-left-props/", label: "Up-left arrow" },
  { name: "AudioLines", route: "/audio-lines-props/", label: "AudioLines icon" },
]) {
  test.describe(name, () => {
    test("HTML attributes, scoped classes, inline styles, and the upstream default size reach the icon", async ({ page }) => {
      await page.goto(route);
      const scoped = page.getByTestId("scoped-icon");
      const control = page.locator("p.icon");
      await expect(scoped).toHaveAttribute("id", "scoped");
      await expect(scoped).toHaveAttribute("title", "Back");
      expect(await scoped.evaluate((element) => getComputedStyle(element).color)).toBe(
        await control.evaluate((element) => getComputedStyle(element).color),
      );
      await expect(scoped).toHaveCSS("margin-inline-start", "32px");
      await expect(scoped.locator("svg")).toHaveAttribute("width", "28");
      await expect(scoped.locator("svg")).toHaveAttribute("height", "28");
      await expect(page.locator("#inline")).toHaveCSS("color", "rgb(102, 51, 153)");
      await expect(page.locator("#inline svg")).toHaveCSS("stroke", "rgb(102, 51, 153)");
      await expect(page.locator("#string-style")).toHaveCSS("color", "rgb(0, 128, 0)");
      await expect(page.locator("#string-style svg")).toHaveAttribute("width", "16");
      await expect(page.locator("#class-list")).toHaveClass("icon extra-class");
      await expect(page.getByRole("img", { name: label })).toBeVisible();
    });
  });
}

test("an uncontrolled standalone icon animates on hover", async ({ page }) => {
  await page.goto("/");
  const icon = page.locator("#standalone");
  await icon.hover();
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
});

test("controlled icons use startAnimation and stopAnimation without automatic hover", async ({ page }) => {
  await page.goto("/");
  const button = page.locator("#controlled");
  await button.hover();
  expect(await button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await button.click();
  await expect.poll(() => button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(2);
  await button.evaluate((element) => {
    for (const animation of element.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
    }
  });
  await page.mouse.move(0, 0);
  const shaft = button.locator("path").nth(1);
  await expect(shaft).toHaveCSS("stroke-dasharray", "9px, 14px");
  await page.getByRole("button", { name: "Stop manual animation" }).click();
  await expect.poll(() => button.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(shaft).toHaveCSS("stroke-dasharray", "none");
});

test("manual playback also respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#controlled").click();
  expect(await page.locator("#controlled").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});
import { messageIcons } from "./helpers/message-icons.js";
