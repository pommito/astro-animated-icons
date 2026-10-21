import { expect, test, type Locator, type Page } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

type ArchiveElement = HTMLElement & IconHandle;

const body = "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8";

const openBody = "M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11";

async function ready(page: Page, route = "/archive/", clock = false) {
  if (clock) {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
  }
  await page.goto(route);
  await page.waitForFunction(() => !!customElements.get("grave-archive"), null, { polling: 10 });
}

async function pose(icon: Locator) {
  return icon.evaluate((element) => ({
    y: new DOMMatrix(getComputedStyle(element.querySelector("rect")!).transform).m42,
    paths: [...element.querySelectorAll("path")].map((path) => path.getAttribute("d")),
  }));
}

async function resting(icon: Locator) {
  await expect(icon.locator("path").first()).toHaveAttribute("d", body);
  await expect(icon.locator("path").nth(1)).toHaveAttribute("d", "M10 12h4");
  await expect(icon.locator("rect")).toHaveCSS("transform", "none");
}

test("Archive renders the full accessible drawing without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/archive/");
  const link = page.getByRole("link", { name: "Archive example", exact: true });
  await resting(link);
  await expect(link.locator("rect")).toHaveAttribute("x", "2");
  await expect(link.locator("rect")).toHaveAttribute("y", "3");
  await expect(link.locator("rect")).toHaveAttribute("width", "20");
  await expect(link.locator("rect")).toHaveAttribute("height", "5");
  await expect(link.locator("svg")).toHaveAttribute("stroke", "currentColor");
  await expect(link.locator("svg")).toHaveAttribute("stroke-width", "2");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(link.locator("path").first()).toHaveCSS("stroke-linecap", "round");
  await expect(link.locator("path").first()).toHaveCSS("stroke-linejoin", "round");
  await expect(page.getByRole("img", { name: "Archive icon" })).toBeVisible();
  expect(await link.locator("grave-archive").getAttribute("tabindex")).toBeNull();
  await link.click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});

test("real hover holds the open pose, leaves the other instance static, and returns", async ({ page }) => {
  await ready(page);
  const primary = page.locator("#primary");
  await primary.hover();
  await expect(primary.locator("path").first()).toHaveAttribute("d", openBody);
  await expect(primary.locator("rect")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -1.5)");
  await page.waitForTimeout(200);
  await expect(primary.locator("path").nth(1)).toHaveAttribute("d", "M10 15h4");
  await resting(page.locator("#secondary"));
  await page.mouse.move(0, 0);
  await resting(primary);
  const standalone = page.locator("#standalone");
  await standalone.hover();
  await expect(standalone.locator("path").first()).toHaveAttribute("d", openBody);
  await page.mouse.move(0, 0);
  await resting(standalone);
});

test("manual interruption preserves the current paths and spring position and velocity", async ({ page }) => {
  await ready(page, "/archive/", true);
  const icon = page.locator("#controlled grave-archive");
  await icon.dispatchEvent("pointerenter", { pointerType: "mouse" });
  await page.clock.runFor(100);
  await resting(icon);
  await icon.evaluate((element: ArchiveElement) => element.startAnimation());
  await page.clock.runFor(96);
  const before = await pose(icon);
  expect(before.paths[0]).not.toBe(body);
  expect(before.paths[0]).not.toBe(openBody);
  await icon.evaluate((element: ArchiveElement) => element.stopAnimation());
  const returning = await pose(icon);
  expect(Math.abs(returning.y - before.y)).toBeLessThan(0.15);
  expect(returning.paths[0]).not.toBe(body);
  await page.clock.runFor(16);
  const after = await pose(icon);
  expect(after.y).toBeLessThan(returning.y);
  await page.clock.runFor(1200);
  await resting(icon);
  await icon.evaluate((element: ArchiveElement) => element.startAnimation());
  await page.clock.runFor(900);
  expect((await pose(icon)).y).toBe(-1.5);
  await icon.evaluate((element: ArchiveElement) => element.stopAnimation());
  await page.clock.runFor(1200);
  await resting(icon);
});

for (const reset of ["stop", "remove", "reduce"] as const) {
  test(`${reset} after rapid playback and completed morphs clears every track without late writes`, async ({ page }) => {
    await ready(page, "/archive/", true);
    const icon = page.locator("#controlled grave-archive");
    const instance = await icon.elementHandle();
    for (let cycle = 0; cycle < 4; cycle++) {
      await icon.evaluate((element: ArchiveElement) => element.startAnimation());
      await page.clock.runFor(304);
      await icon.evaluate((element: ArchiveElement) => element.stopAnimation());
      await page.clock.runFor(32);
    }
    await icon.evaluate((element: ArchiveElement) => element.startAnimation());
    await page.clock.runFor(64);
    if (reset === "stop") await icon.evaluate((element: ArchiveElement) => element.stopAnimation());
    if (reset === "remove") await icon.evaluate((element) => element.remove());
    if (reset === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.runFor(1500);
    expect(await instance!.evaluate((element) => ({
      transform: element.querySelector("rect")!.style.transform,
      paths: [...element.querySelectorAll("path")].map((path) => path.getAttribute("d")),
    }))).toEqual({ transform: "", paths: [body, "M10 12h4"] });
    await page.clock.runFor(1500);
    expect(await instance!.evaluate((element) => element.querySelector("rect")!.style.transform)).toBe("");
    await resting(page.locator("#secondary"));
  });
}

test("template instances upgrade before registration and reconnect to the current control", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/_astro/*.js", async (route) => { await gate; await route.continue(); });
  try {
    await page.goto("/archive/", { waitUntil: "commit" });
    await expect(page.locator("#primary svg")).toBeVisible();
    expect(await page.evaluate(() => !!customElements.get("grave-archive"))).toBe(false);
    await page.evaluate(() => {
      const template = document.querySelector<HTMLTemplateElement>("#instance-template")!;
      document.querySelector("#dynamic")!.append(template.content.cloneNode(true));
    });
  } finally { release(); }
  await page.waitForFunction(() => !!customElements.get("grave-archive"));
  await page.getByRole("button", { name: "Add instance" }).click();
  const dynamic = page.locator("#dynamic a").first();
  const instance = await dynamic.locator("grave-archive").elementHandle();
  await dynamic.hover();
  await expect(dynamic.locator("path").first()).toHaveAttribute("d", openBody);
  await resting(page.locator("#dynamic a").nth(1));
  await instance!.evaluate((element) => element.remove());
  expect(await instance!.evaluate((element) => element.querySelector("path")!.getAttribute("d"))).toBe(body);
  await page.mouse.move(0, 0);
  await page.locator("#secondary").evaluate((control, icon) => control.append(icon!), instance);
  await page.locator("#secondary").hover();
  await expect(page.locator("#secondary grave-archive").nth(1).locator("path").first()).toHaveAttribute("d", openBody);
  await page.mouse.move(0, 0);
  await resting(page.locator("#secondary grave-archive").nth(1));
  await dynamic.hover();
  await page.waitForTimeout(350);
  await resting(page.locator("#secondary grave-archive").nth(1));
});

test("reduced motion blocks manual playback and a preference change immediately restores the full drawing", async ({ page }) => {
  await ready(page, "/archive/", true);
  const icon = page.locator("#controlled grave-archive");
  await icon.evaluate((element: ArchiveElement) => element.startAnimation());
  await page.clock.runFor(96);
  expect((await pose(icon)).y).toBeLessThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await resting(icon);
  await icon.evaluate((element: ArchiveElement) => { element.startAnimation(); element.stopAnimation(); });
  await page.clock.runFor(1200);
  await resting(icon);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await icon.evaluate((element: ArchiveElement) => element.startAnimation());
  await page.clock.runFor(900);
  expect((await pose(icon)).paths[0]).toBe(openBody);
});

test("touch and focus keep Archive static while a mouse on a touch-primary device still plays it", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await ready(page);
  const link = page.locator("#primary");
  await page.locator("#secondary").tap();
  await page.waitForTimeout(350);
  await resting(page.locator("#secondary"));
  await link.focus();
  await expect(link).toBeFocused();
  await resting(link);
  await expect(link).toHaveAccessibleName("Archive example");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#destination$/);
  expect(await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(false);
  await link.hover();
  await expect(link.locator("path").first()).toHaveAttribute("d", openBody);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await resting(link);
  await context.close();
});
