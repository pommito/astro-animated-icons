import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { weatherNature } from "./helpers/weather-nature.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(weatherNature, [50, 250, 650, 1400]);

for (const interruption of [0, 150, 450, 1100, 1800]) {
  test(`Weather nature matches pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/weather-nature-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), weatherNature.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("weather-nature-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("weather-nature-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("weather-nature-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "weather-nature-seek", times: [0, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 650, 700, 800, 900, 1000, 1100, 1300, 1500, 1700, 2000],
      origin: "svg-center" as const,
    });
    if (!interruption) for (const icon of weatherNature) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Weather nature ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const icon of weatherNature) {
  test(`${icon.name} hover and manual playback change the drawing`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const read = (element: Element) => [...element.querySelectorAll("svg, g, path, circle")].map(shape => {
      const style = getComputedStyle(shape);
      return [style.transform, style.opacity, style.strokeDasharray, style.strokeDashoffset];
    });
    const primary = page.locator("#primary");
    const rest = await primary.evaluate(read);
    await primary.hover();
    await expect.poll(() => primary.evaluate(read)).not.toEqual(rest);
    await page.mouse.move(0, 0);
    await expect.poll(() => primary.evaluate(read)).toEqual(rest);
    const controlled = page.locator(`#controlled ${icon.tag}`);
    await controlled.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => controlled.evaluate(read)).not.toEqual(rest);
    await controlled.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
    await expect.poll(() => controlled.evaluate(read)).toEqual(rest);
  });
}

for (const icon of weatherNature) {
  test(`${icon.name} preserves the current pose when replay interrupts a return`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const result = await page.locator(`#controlled ${icon.tag}`).evaluate((element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const pose = () => [...element.querySelectorAll("svg, g, path, circle")].map(shape => {
        const style = getComputedStyle(shape);
        return [style.transform, style.opacity, style.strokeDasharray, style.strokeDashoffset];
      });
      element.startAnimation();
      seek(450);
      element.stopAnimation();
      seek(50);
      const before = pose();
      element.startAnimation();
      seek(0);
      const after = pose();
      element.remove();
      return { before, after };
    });
    expect(result.after).toEqual(result.before);
  });
}

for (const slug of ["sun-dim", "sun-moon", "wind", "wind-arrow-down", "droplet", "flame"]) {
  test(`${slug} starts a fresh reveal after the previous entry completes`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const result = await page.locator(`#controlled grave-${slug}`).evaluate(async (element: HTMLElement & IconHandle, slug) => {
      element.startAnimation();
      const animations = element.getAnimations({ subtree: true });
      animations.forEach(animation => animation.finish());
      await Promise.all(animations.map(animation => animation.finished));
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      const paths = [...element.querySelectorAll("path")].slice(slug === "sun-moon" ? 1 : 0);
      const opacity = paths.map(path => Number(getComputedStyle(path).opacity));
      const arrowY = slug === "wind-arrow-down" ? paths.slice(2).map(path => new DOMMatrix(getComputedStyle(path).transform).m42) : [];
      element.remove();
      return { opacity, arrowY };
    }, slug);
    expect(result.opacity.every(opacity => opacity === 0)).toBe(true);
    if (slug === "wind-arrow-down") expect(result.arrowY).toEqual([-10, -10]);
  });
}

for (const slug of ["sun-dim", "sun-medium", "sun-moon", "sunset", "wind", "wind-arrow-down"]) {
  test(`${slug} preserves finished layers when replay interrupts a late entry`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const result = await page.locator(`#controlled grave-${slug}`).evaluate(async (element: HTMLElement & IconHandle, time) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const pose = () => [...element.querySelectorAll("svg, g, path, circle")].map(shape => {
        const style = getComputedStyle(shape);
        return [style.transform, style.opacity, style.strokeDasharray, style.strokeDashoffset];
      });
      element.startAnimation();
      seek(time);
      const finished = element.getAnimations({ subtree: true }).filter(animation => Number(animation.effect!.getComputedTiming().endTime) <= time);
      finished.forEach(animation => animation.finish());
      await Promise.all(finished.map(animation => animation.finished));
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const before = pose();
      element.startAnimation();
      seek(0);
      const after = pose();
      element.remove();
      return { before, after };
    }, slug === "wind-arrow-down" ? 875 : 650);
    expect(result.after).toEqual(result.before);
  });
}
