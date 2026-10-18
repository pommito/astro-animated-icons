import { securityIcons } from "./helpers/security-icons.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { sampleUpstreamPoses, compareUpstreamPoses } from "./helpers/upstream-comparison.js";
import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("Lock holds the pinned partial shackle and returns without a pose jump", async ({ page }) => {
  await page.goto("/lock/");
  await page.waitForFunction(() => !!customElements.get("grave-lock"));
  const element = page.locator("#controlled grave-lock");
  const pose = await element.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 300; });
    const path = element.querySelector("path")!;
    const length = Number(path.getAttribute("pathLength")) || path.getTotalLength();
    const before = getComputedStyle(path).strokeDasharray;
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const after = getComputedStyle(path).strokeDasharray;
    return { progress: parseFloat(before) / length, before, after };
  });
  expect(pose.progress).toBeCloseTo(0.7, 4);
  expect(pose.after).toEqual(pose.before);
});

test("ShieldCheck reveals the check while its shield stays visible", async ({ page }) => {
  await page.goto("/shield-check/");
  await page.waitForFunction(() => !!customElements.get("grave-shield-check"));
  const pose = await page.locator("#controlled grave-shield-check").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const paths = element.querySelectorAll("path");
    return { shield: getComputedStyle(paths[0]).opacity, check: getComputedStyle(paths[1]).opacity };
  });
  expect(pose).toEqual({ shield: "1", check: "0" });
});

test("Fingerprint starts scanning over nine faint fixed paths", async ({ page }) => {
  await page.goto("/fingerprint/");
  await page.waitForFunction(() => !!customElements.get("grave-fingerprint"));
  const pose = await page.locator("#controlled grave-fingerprint").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
    const paths = [...element.querySelectorAll("path")];
    return paths.map((path) => ({ opacity: getComputedStyle(path).opacity, base: path.getAttribute("stroke-opacity"), dash: parseFloat(getComputedStyle(path).strokeDasharray) / path.getTotalLength() }));
  });
  expect(pose.filter((path) => path.base === "0.4")).toHaveLength(9);
  for (const path of pose.filter((path) => !path.base)) {
    expect(path.opacity).toBe("0");
    expect(path.dash).toBeCloseTo(0.1, 4);
  }
});

test("ScanFace completes its hidden phase before returning and cancels the queued phase on removal", async ({ page }) => {
  await page.goto("/scan-face/");
  await page.waitForFunction(() => !!customElements.get("grave-scan-face"));
  const icon = page.locator("#controlled grave-scan-face");
  const instance = await icon.elementHandle();
  const hidden = await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 200; });
    return Number(getComputedStyle(element.querySelector("path")!).opacity);
  });
  expect(hidden).toBeLessThan(0.3);
  await icon.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
  await expect.poll(() => icon.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(icon.locator("path").first()).toHaveCSS("opacity", "1");
  await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
    element.remove();
  });
  await page.waitForTimeout(800);
  expect(await instance!.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

testIconBehavior(securityIcons, [100, 300, 650]);

test("Security adapters match the pinned React components at four sizes", async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/security-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForFunction((tags) => tags.every((tag) => !!customElements.get(tag)), securityIcons.map((icon) => icon.tag));
  await page.locator("#play").click();
  await page.waitForTimeout(100);
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "security-seek", times: [0, 50, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000], origin: "wrapper" as const,
  });
  for (const icon of securityIcons.filter((icon) => icon.slug !== "scan-face")) {
    const poses = samples.filter((sample) => sample.icon === icon.slug && sample.size === "28");
    expect(new Set(poses.map((sample) => JSON.stringify(sample.reference))).size, `${icon.name} reference must move`).toBeGreaterThan(1);
  }
  const result = compareUpstreamPoses(samples.filter((sample) => sample.icon !== "scan-face"));
  expect(errors).toEqual([]);
  console.log(`Security comparison: nine original React components at 14, 16, 24 and 28 px; maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)}.`);
});

test("ScanFace hidden phase matches the pinned React component at four sizes", async ({ page }) => {
  await page.goto("/security-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.locator("#play").click();
  await page.waitForTimeout(100);
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "security-seek", times: [0, 50, 100, 150, 200, 300], origin: "wrapper" as const,
  });
  const poses = samples.filter((sample) => sample.icon === "scan-face" && sample.size === "28");
  expect(new Set(poses.map((sample) => JSON.stringify(sample.reference))).size, "ScanFace reference must move").toBeGreaterThan(1);
  const result = compareUpstreamPoses(samples.filter((sample) => sample.icon === "scan-face"));
  console.log(`ScanFace hidden comparison: maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)}.`);
});

for (const icon of securityIcons) {
  test(`${icon.name} replays from its current pose during entry and return`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction((tag) => !!customElements.get(tag), icon.tag);
    const element = page.locator(`#controlled ${icon.tag}`);
    const samples = await element.evaluate((element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time; });
      const pose = () => [...element.querySelectorAll("svg, g, path, rect, circle, line")].map((shape) => {
        const style = getComputedStyle(shape);
        return [style.transform, style.opacity, style.strokeDasharray, style.strokeDashoffset];
      });
      element.startAnimation();
      seek(100);
      const entry = pose();
      element.startAnimation();
      seek(0);
      const replayedEntry = pose();
      element.stopAnimation();
      seek(100);
      const returning = pose();
      element.startAnimation();
      seek(0);
      const replayedReturn = pose();
      element.stopAnimation();
      return { entry, replayedEntry, returning, replayedReturn };
    });
    expect(samples.replayedEntry).toEqual(samples.entry);
    expect(samples.replayedReturn).toEqual(samples.returning);
    await expect.poll(() => element.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("ScanFace visible phase matches the pinned React component at four sizes", async ({ page }) => {
  await page.goto("/security-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.locator("#play").click();
  await page.waitForTimeout(100);
  await page.evaluate(() => document.dispatchEvent(new Event("security-finish-hidden")));
  await page.waitForTimeout(50);
  const samples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "security-seek", times: [0, 50, 100, 150, 200, 300, 400, 600], origin: "wrapper" as const,
  });
  const poses = samples.filter((sample) => sample.icon === "scan-face" && sample.size === "28");
  expect(new Set(poses.map((sample) => JSON.stringify(sample.reference))).size, "ScanFace reference must move").toBeGreaterThan(1);
  const result = compareUpstreamPoses(samples.filter((sample) => sample.icon === "scan-face"));
  console.log(`ScanFace visible comparison: maximum geometry difference ${result.maximumGeometry.toFixed(6)} screen pixels, maximum normalized paint difference ${result.maximumPaint.toFixed(6)}.`);
});
