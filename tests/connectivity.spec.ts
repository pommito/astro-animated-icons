import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

import { connectivityIcons } from "./helpers/connectivity.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(connectivityIcons.filter(icon => icon.slug !== "wifi-low"), [100, 300, 650, 1600]);
testIconBehavior(connectivityIcons.filter(icon => icon.slug === "wifi-low"), [100, 300, 650, 1600, 1750]);

test("Wifi fades signal arcs together before their staggered spring return", async ({ page }) => {
  await page.goto("/wifi/");
  await page.waitForFunction(() => !!customElements.get("grave-wifi"));
  const samples = await page.locator("#controlled grave-wifi").evaluate((icon: HTMLElement & IconHandle) => {
    icon.startAnimation();
    const animations = icon.getAnimations({ subtree: true });
    animations.forEach(animation => animation.pause());
    return [0, 100, 200, 350, 450, 1600].map(time => {
      animations.forEach(animation => { animation.currentTime = time; });
      return [...icon.querySelectorAll("path")].map(path => Number(getComputedStyle(path).opacity));
    });
  });
  expect(samples[0]).toEqual([1, 1, 1, 1]);
  expect(samples[1][1]).toBeGreaterThan(0);
  expect(samples[1][1]).toBeLessThan(0.5);
  expect(samples[2]).toEqual([1, 0, 0, 0]);
  expect(samples[3][1]).toBeGreaterThan(0);
  expect(samples[3].slice(2)).toEqual([0, 0]);
  expect(samples[4][2]).toBeGreaterThan(0);
  expect(samples[4][3]).toBe(0);
  expect(samples[5]).toEqual([1, 1, 1, 1]);
});


const signals = ["wifi", "wifi-low", "nfc", "router", "radio", "radio-tower"];

test("connectivity adapters match the pinned React entry phases and completed-entry returns", async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const ready = async () => {
    await page.goto("/connectivity-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), connectivityIcons.map(icon => icon.tag));
  };
  await ready();
  await page.locator("#play").click();
  const first = compareUpstreamPoses((await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "connectivity-seek", times: [0, 50, 100, 150, 200, 300, 400, 600, 790, 810, 1200, 1600], origin: "svg" as const,
  })).filter(sample => !signals.includes(sample.icon!) || sample.time <= (sample.icon!.startsWith("wifi") ? 200 : 300)), "entry");
  await ready();
  await page.locator("#play").click();
  await expect.poll(() => page.locator('[data-icon="nfc"] [data-reference]').first().evaluate(element => {
    const animations = element.getAnimations({ subtree: true });
    return animations.length === 4 && animations.some(animation => Number(animation.effect!.getTiming().duration) > 300);
  })).toBe(true);
  const secondSamples = [];
  for (const time of [0, 50, 100, 150, 200, 300, 400, 600, 800, 1200]) {
    await page.evaluate(time => document.dispatchEvent(new CustomEvent("connectivity-seek", { detail: time })), time);
    secondSamples.push(...await page.evaluate(sampleUpstreamPoses, { seekEvent: "connectivity-signal-seek", times: [time], origin: "svg" as const }));
  }
  const second = compareUpstreamPoses(secondSamples.filter(sample => signals.includes(sample.icon!)), "signal spring phase");
  await ready();
  await page.locator("#play").click();
  await page.waitForTimeout(2200);
  await page.locator("#stop").click();
  const returning = compareUpstreamPoses((await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "connectivity-seek", times: [0, 50, 100, 150, 200, 300, 400, 600, 1000], origin: "svg" as const,
  })).filter(sample => sample.icon !== "bluetooth-searching"), "completed-entry return");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#play").click();
  expect(await page.locator("[data-adapter]").evaluateAll(elements => elements.reduce((count, element) => count + element.getAnimations({ subtree: true }).length, 0))).toBe(0);
  expect(errors).toEqual([]);
  console.log(`Connectivity comparison: ten pinned React components, four sizes except fixed-size WifiCog/WifiSync at 24 px; maximum geometry difference ${Math.max(first.maximumGeometry, second.maximumGeometry, returning.maximumGeometry).toFixed(6)} screen pixels, maximum normalized paint difference ${Math.max(first.maximumPaint, second.maximumPaint, returning.maximumPaint).toFixed(6)}.`);
});

test("WifiLow keeps its question hidden at rest, shows it after the signal fade, then hides it", async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/wifi-low/");
  const text = staticPage.locator("#primary text");
  await expect(text).toHaveText("?");
  await expect(text).toHaveAttribute("opacity", "0");
  expect(await text.evaluate(element => getComputedStyle(element).opacity)).toBe("0");
  await context.close();
  await page.goto("/wifi-low/");
  await page.waitForFunction(() => !!customElements.get("grave-wifi-low"));
  const samples = await page.locator("#controlled grave-wifi-low").evaluate((icon: HTMLElement & IconHandle) => {
    icon.startAnimation();
    const animations = icon.getAnimations({ subtree: true });
    animations.forEach(animation => animation.pause());
    return [0, 250, 300, 450, 1000, 1700, 1775, 1850].map(time => {
      animations.forEach(animation => { animation.currentTime = time; });
      const style = getComputedStyle(icon.querySelector("text")!);
      return [Number(style.opacity), new DOMMatrix(style.transform).a];
    });
  });
  expect(samples[0]).toEqual([0, 0]);
  expect(samples[1]).toEqual([0, 0]);
  expect(samples[2]).toEqual([0, 0]);
  expect(samples[3][0]).toBeGreaterThan(0.9);
  expect(samples[4]).toEqual([1, 1]);
  expect(samples[5]).toEqual([1, 1]);
  expect(samples[6][0]).toBeGreaterThan(0);
  expect(samples[6][0]).toBeLessThan(1);
  expect(samples[7]).toEqual([0, 0]);
});

for (const interruption of ["stop", "remove", "reduce"] as const) {
  test(`WifiLow cancels its temporary question after ${interruption} without late callbacks`, async ({ page }) => {
    await page.goto("/wifi-low/");
    await page.waitForFunction(() => !!customElements.get("grave-wifi-low"));
    const icon = await page.locator("#controlled grave-wifi-low").elementHandle();
    await icon!.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 500; });
    });
    if (interruption === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else await icon!.evaluate((element: HTMLElement & IconHandle, interruption) => {
      if (interruption === "remove") element.remove();
      else element.stopAnimation();
    }, interruption);
    await page.waitForTimeout(2000);
    const state = await icon!.evaluate(element => {
      const question = element.querySelector<SVGTextElement>("text")!;
      return { tracks: element.getAnimations({ subtree: true }).length, opacity: question.style.opacity, transform: question.style.transform };
    });
    expect(state).toEqual({ tracks: 0, opacity: "", transform: "scale(0)" });
  });
}
