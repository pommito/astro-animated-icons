import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { cloudIcons } from "./helpers/cloud-icons.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

test("CloudRain staggers three repeating strokes while its cloud stays fixed", async ({ page }) => {
  await page.goto("/cloud-rain/");
  await page.waitForFunction(() => !!customElements.get("grave-cloud-rain"));
  const samples = await page.locator("#controlled grave-cloud-rain").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    return [0, 500, 700, 900, 1500].map((time) => {
      element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      return [...element.querySelectorAll("path")].map((path) => Number(getComputedStyle(path).opacity));
    });
  });
  expect(samples[0]).toEqual([1, 1, 1, 1]);
  expect(samples[1][0]).toBe(1);
  expect(samples[1][1]).toBeCloseTo(0.2, 4);
  expect(samples[2][2]).toBeCloseTo(0.2, 4);
  expect(samples[3][3]).toBeCloseTo(0.2, 4);
  expect(samples[4][1]).toBeCloseTo(0.2, 4);
});

testIconBehavior(cloudIcons, [100, 300, 650, 1600]);

for (const { slug, rotation, y } of [
  { slug: "cloud-backup", rotation: -360, y: 0 },
  { slug: "cloud-sync", rotation: -360, y: 0 },
  { slug: "cloud-cog", rotation: 180, y: 0 },
  { slug: "cloud-download", rotation: 0, y: 2 },
  { slug: "cloud-upload", rotation: 0, y: -2 },
]) {
  test(`${slug} completes one finite entry and holds until stopped`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), `grave-${slug}`);
    const icon = page.locator(`#controlled grave-${slug}`);
    const finite = await icon.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      const animations = element.getAnimations({ subtree: true });
      const finite = animations.length > 0 && animations.every((animation) => Number.isFinite(animation.effect!.getComputedTiming().endTime));
      animations.forEach((animation) => animation.finish());
      return finite;
    });
    expect(finite).toBe(true);
    await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const held = await icon.locator('[data-motion="0"]').evaluate((element) => {
      const matrix = new DOMMatrix(getComputedStyle(element).transform);
      return { transform: element.getAttribute("style"), a: matrix.a, y: matrix.m42 };
    });
    expect(held.a).toBeCloseTo(Math.cos(rotation * Math.PI / 180), 4);
    expect(held.y).toBeCloseTo(y, 4);
    await page.waitForTimeout(100);
    expect(await icon.locator('[data-motion="0"]').getAttribute("style")).toBe(held.transform);
    await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
    await expect.poll(() => icon.locator('[data-motion="0"]').evaluate((element) => (element as SVGElement).style.transform)).toBe("");
  });
}

for (const phase of ["entry", "return"] as const) {
  test(`Cloud ${phase} matches all ten pinned React components at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/cloud-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), cloudIcons.map((icon) => icon.tag));
    await page.evaluate((phase) => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("cloud-seek", { detail: phase === "entry" ? 0 : 3250 }));
      if (phase === "return") {
        document.dispatchEvent(new Event("cloud-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("cloud-seek", { detail: 0 }));
      }
    }, phase);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "cloud-seek",
      times: [0, 50, 100, 150, 200, 300, 400, 500, 650, 800, 1000, 1200, 1600, 2200, 3000],
      origin: "svg" as const,
    });
    for (const icon of cloudIcons) {
      if (phase === "return" && icon.slug === "cloud-sun") continue;
      const poses = samples.filter((sample) => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map((sample) => JSON.stringify(sample.reference))).size, `${icon.name} reference must move`).toBeGreaterThan(1);
      expect(new Set(poses.map((sample) => JSON.stringify(sample.adapter))).size, `${icon.name} adapter must move`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, phase);
    expect(errors).toEqual([]);
    console.log(`Cloud ${phase} comparison: ten original React components at 14, 16, 24 and 28 px; maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)}.`);
  });
}
