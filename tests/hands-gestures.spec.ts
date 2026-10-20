import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { handsGestures } from "./helpers/hands-gestures.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(handsGestures, [50, 250, 650, 2600]);
for (const icon of handsGestures) {
  test(`${icon.name} changes its drawing on hover and isolates its second instance`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    await page.locator("#primary").hover();
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const interruption of [0, 50, 150, 350, 2600]) {
  test(`Hands and gestures match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/hands-gestures-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), handsGestures.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("hands-gestures-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("hands-gestures-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("hands-gestures-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "hands-gestures-seek", times: [...(interruption ? [] : [0]), 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 800, 1000, 1500, 2005, 2500, 3000, 4005, 4500],
      origin: "svg" as const, includeStrokeWidth: true,
    });
    const comparable = samples;
    if (!interruption) for (const icon of handsGestures) {
      const poses = comparable.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(comparable, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Hands and gestures ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const icon of handsGestures) for (const returning of [false, true]) {
  test(`${icon.name} preserves its current pose when replay interrupts ${returning ? "return" : "entry"}`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const poses = await page.locator(`#controlled ${icon.tag}`).evaluate((element: HTMLElement & IconHandle, returning) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const pose = () => [...element.querySelectorAll("svg, g, path, circle")].map(shape => [getComputedStyle(shape).transform, getComputedStyle(shape).opacity]);
      element.startAnimation();
      seek(150);
      if (returning) { element.stopAnimation(); seek(100); }
      const before = pose();
      element.startAnimation();
      seek(0);
      const after = pose();
      seek(50);
      const replay = pose();
      element.stopAnimation();
      return { before, after, replay };
    }, returning);
    expect(poses.after).toEqual(poses.before);
    expect(poses.replay).not.toEqual(poses.before);
  });
}

for (const slug of ["hand-coins", "hand-heart", "clap"]) {
  test(`${slug} replays completed tracks while other tracks remain active`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const result = await page.locator(`#controlled grave-${slug}`).evaluate(async (element: HTMLElement & IconHandle, slug) => {
      element.startAnimation();
      const completed = slug === "hand-coins" ? "opacity" : "transform";
      const target = slug === "hand-coins" ? "[data-part=coin-1]" : slug === "hand-heart" ? "[data-part=heart]" : "[data-part=inner]";
      element.getAnimations({ subtree: true }).forEach(animation => {
        const effect = animation.effect as KeyframeEffect;
        if (effect.target?.matches(target) && effect.getKeyframes().some(frame => completed in frame)) animation.finish();
        else { animation.pause(); animation.currentTime = 50; }
      });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 50; });
      const style = getComputedStyle(element.querySelector(target)!);
      return { opacity: Number(style.opacity), matrix: [new DOMMatrix(style.transform).a, new DOMMatrix(style.transform).b] };
    }, slug);
    if (slug === "hand-coins") expect(result.opacity).toBeLessThan(0.5);
    else if (slug === "hand-heart") {
      expect(result.matrix[0]).toBeGreaterThan(1);
      expect(result.matrix[0]).toBeLessThan(1.05);
    } else expect(Math.atan2(result.matrix[1], result.matrix[0]) * 180 / Math.PI).toBeLessThan(-0.5);
  });
}

for (const scenario of ["hover", "leave"]) {
  test(`comparison controls track independent row returns after ${scenario}`, async ({ page }) => {
    await page.goto("/hands-gestures-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), handsGestures.map(icon => icon.tag));
    await page.evaluate(scenario => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("hands-gestures-seek", { detail: 150 }));
      document.dispatchEvent(new Event("hands-gestures-capture-return"));
      if (scenario === "hover") {
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.querySelector("tr[data-icon=hand][data-size='28']")!.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
      } else {
        document.querySelectorAll("tr[data-icon=hand-coins]").forEach(row => row.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" })));
      }
    }, scenario);
    const samples = await page.evaluate(sampleUpstreamPoses, { seekEvent: "hands-gestures-seek", times: [400, 500], origin: "svg" as const });
    compareUpstreamPoses(samples.filter(sample => sample.icon === "hand-coins"), `row ${scenario}`);
  });
}
