import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { communicationIcons } from "./helpers/communication-icons.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(communicationIcons, [100, 300, 650, 1000]);

test("PhoneCall hides both waves before their staggered spring reveal", async ({ page }) => {
  await page.goto("/phone-call/");
  const icon = page.locator("#controlled grave-phone-call");
  await expect(icon).toBeVisible();
  await page.waitForFunction(() => !!customElements.get("grave-phone-call"));
  const samples = await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    return [0, 300, 450, 550, 1200].map(time => {
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      return [...element.querySelectorAll("path")].map(path => Number(getComputedStyle(path).opacity));
    });
  });
  expect(samples[0]).toEqual([1, 1, 1]);
  expect(samples[1]).toEqual([0, 0, 1]);
  expect(samples[2][1]).toBeGreaterThan(samples[2][0]);
  expect(samples[3][0]).toBeGreaterThan(0);
  expect(samples[4]).toEqual([1, 1, 1]);
});

test("communication adapters match pinned React entry, wave reveal, and captured-pose return", async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const ready = async () => {
    await page.goto("/communication-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), communicationIcons.map(icon => icon.tag));
  };
  await ready();
  await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
  const firstSamples = await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "communication-seek", times: [0, 50, 100, 150, 200, 300, 400, 500, 650, 800, 1000, 1600], origin: "svg-center" as const,
  });
  for (const icon of communicationIcons) {
    const poses = firstSamples.filter(sample => sample.icon === icon.slug && sample.size === "28");
    expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference moves`).toBeGreaterThan(1);
    expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter moves`).toBeGreaterThan(1);
  }
  const entry = compareUpstreamPoses(firstSamples.filter(sample => sample.icon !== "phone-call" || sample.time <= 300), "entry");
  await ready();
  await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
  await expect.poll(() => page.locator('[data-icon="phone-call"] [data-reference]').first().evaluate(element =>
    element.getAnimations({ subtree: true }).some(animation => Number(animation.effect!.getTiming().duration) > 300),
  )).toBe(true);
  const waveSamples = [];
  for (const time of [0, 50, 100, 150, 200, 300, 400, 600, 900, 1200]) {
    await page.evaluate(time => document.dispatchEvent(new CustomEvent("communication-seek", { detail: time })), time);
    waveSamples.push(...await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "communication-signal-seek", times: [time], origin: "svg-center" as const,
    }));
  }
  const waves = compareUpstreamPoses(waveSamples.filter(sample => sample.icon === "phone-call"), "wave spring reveal");
  await ready();
  await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
  await page.waitForTimeout(2200);
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent("communication-seek", { detail: 3250 }));
    document.dispatchEvent(new Event("communication-capture-return"));
    document.querySelector<HTMLButtonElement>("#stop")!.click();
    document.dispatchEvent(new CustomEvent("communication-seek", { detail: 0 }));
  });
  const returning = compareUpstreamPoses(await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "communication-seek", times: [0, 50, 100, 150, 200, 300, 400, 600, 900, 1200], origin: "svg-center" as const,
  }), "captured-pose return");
  expect(errors).toEqual([]);
  console.log(`Communication comparison: ten pinned React components at 14, 16, 24 and 28 px; maximum geometry difference ${Math.max(entry.maximumGeometry, waves.maximumGeometry, returning.maximumGeometry).toFixed(6)} screen pixels, maximum normalized paint difference ${Math.max(entry.maximumPaint, waves.maximumPaint, returning.maximumPaint).toFixed(6)}.`);
});

test("Send keeps its plane visible without JavaScript and draws only its decorative trail after the delay", async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/send/");
  expect(await staticPage.locator("#primary path").evaluateAll(paths => paths.map(path => getComputedStyle(path).opacity))).toEqual(["1", "1", "0"]);
  await context.close();
  await page.goto("/send/");
  await page.waitForFunction(() => !!customElements.get("grave-send"));
  const samples = await page.locator("#controlled grave-send").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    return [0, 100, 300, 650].map(time => {
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      return [...element.querySelectorAll("path")].map(path => Number(getComputedStyle(path).opacity));
    });
  });
  expect(samples[0]).toEqual([1, 1, 0]);
  expect(samples[1]).toEqual([1, 1, 0]);
  expect(samples[2][2]).toBeGreaterThan(0);
  expect(samples[3]).toEqual([1, 1, 1]);
});

test("Mailbox holds its raised flag until stopped", async ({ page }) => {
  await page.goto("/mailbox/");
  await page.waitForFunction(() => !!customElements.get("grave-mailbox"));
  const icon = page.locator("#controlled grave-mailbox");
  await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  const flag = icon.locator("path").nth(1);
  const held = await flag.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).b);
  expect(held).toBeCloseTo(-1, 5);
  await page.waitForTimeout(100);
  expect(await flag.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).b)).toBe(held);
  await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
  await expect.poll(() => flag.evaluate(element => (element as SVGElement).style.transform)).toBe("");
});
