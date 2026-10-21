import type { IconHandle } from "../packages/animated-icons/src/element.js";

import { expect, test } from "@playwright/test";

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`SlidersHorizontal preserves moving endpoints and restores attributes after ${interruption}`, async ({ page }) => {
    await page.goto("/sliders-horizontal/");
    await page.waitForFunction(() => !!customElements.get("grave-sliders-horizontal"));
    const icon = await page.locator("#controlled grave-sliders-horizontal").elementHandle();
    const resting = await icon!.evaluate((element) => [...element.querySelectorAll("line")].map((line) => [line.getAttribute("x1"), line.getAttribute("x2")]));
    await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => icon!.evaluate((element) => element.querySelector("line")!.getAttribute("x2"))).not.toBe("14");
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else {
      const pose = await icon!.evaluate((element: HTMLElement & IconHandle, interruption) => {
        const read = () => [...element.querySelectorAll("line")].map((line) => [line.getAttribute("x1"), line.getAttribute("x2")]);
        const before = read();
        if (interruption === "stop") element.stopAnimation();
        else element.remove();
        return { before, after: read() };
      }, interruption);
      if (interruption === "stop") expect(pose.after).toEqual(pose.before);
    }
    await expect.poll(() => icon!.evaluate((element) => [...element.querySelectorAll("line")].map((line) => [line.getAttribute("x1"), line.getAttribute("x2")]))).toEqual(resting);
    await page.waitForTimeout(150);
    expect(await icon!.evaluate((element) => [...element.querySelectorAll("line")].map((line) => [line.getAttribute("x1"), line.getAttribute("x2")]))).toEqual(resting);
  });
}

test("SlidersHorizontal reconnects to its current control and detaches the old control", async ({ page }) => {
  await page.goto("/sliders-horizontal/");
  await page.getByRole("button", { name: "Add instance" }).click();
  const oldControl = await page.locator("#dynamic a").elementHandle();
  const icon = await page.locator("#dynamic grave-sliders-horizontal").elementHandle();
  await oldControl!.hover();
  await expect.poll(() => icon!.evaluate((element) => element.querySelector("line")!.getAttribute("x2"))).not.toBe("14");
  await icon!.evaluate((element) => element.remove());
  expect(await icon!.evaluate((element) => element.querySelector("line")!.getAttribute("x2"))).toBe("14");
  await page.mouse.move(0, 0);
  await page.locator("#secondary").evaluate((element, icon) => element.append(icon!), icon);
  await oldControl!.hover();
  await page.waitForTimeout(100);
  expect(await icon!.evaluate((element) => element.querySelector("line")!.getAttribute("x2"))).toBe("14");
  await page.locator("#secondary").hover();
  await expect.poll(() => icon!.evaluate((element) => element.querySelector("line")!.getAttribute("x2"))).not.toBe("14");
});

test("SlidersHorizontal upgrades a template inserted before registration", async ({ page }) => {
  let release!: () => void;
  const registration = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/_astro/*.js", async (route) => {
    await registration;
    await route.continue();
  });
  try {
    await page.goto("/sliders-horizontal/", { waitUntil: "commit" });
    await expect(page.locator("#primary svg")).toBeVisible();
    expect(await page.evaluate(() => !!customElements.get("grave-sliders-horizontal"))).toBe(false);
    await page.evaluate(() => {
      const template = document.querySelector<HTMLTemplateElement>("#instance-template")!;
      document.querySelector("#dynamic")!.append(template.content.cloneNode(true));
    });
  } finally {
    release();
  }
  await page.waitForFunction(() => !!customElements.get("grave-sliders-horizontal"));
  await page.locator("#dynamic a").hover();
  await expect.poll(() => page.locator("#dynamic line").first().getAttribute("x2")).not.toBe("14");
});
