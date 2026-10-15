import { expect, test } from "@playwright/test";

for (const { name, route, label } of [
  { name: "ArrowLeft", route: "/props/", label: "Back arrow" },
  { name: "MapPin", route: "/map-pin-props/", label: "Location pin" },
  { name: "Copy", route: "/copy-props/", label: "Copy icon" },
  { name: "Archive", route: "/archive-props/", label: "Archive icon" },
  { name: "AtSign", route: "/at-sign-props/", label: "AtSign icon" },
  { name: "Check", route: "/check-props/", label: "Check icon" },
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
