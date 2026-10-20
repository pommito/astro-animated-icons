import { expect, test } from "@playwright/test";
import { infrastructureIcons } from "./helpers/infrastructure-icons.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("Binary flips the first outgoing glyph before its incoming glyph", async ({ page }) => {
  await page.goto("/binary/");
  await page.waitForFunction(() => !!customElements.get("grave-binary"));
  const icon = page.locator("#controlled grave-binary");
  const poses = await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const pose = (time: number) => {
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      return [...element.querySelectorAll("[data-motion]")].map(shape => ({ opacity: Number(getComputedStyle(shape).opacity), height: shape.getBoundingClientRect().height }));
    };
    return { hidden: pose(120), incoming: pose(180), held: pose(450) };
  });
  expect(poses.hidden[0].opacity).toBe(0);
  expect(poses.hidden[0].height).toBeLessThan(0.001);
  expect(poses.hidden[1].opacity).toBe(0);
  expect(poses.incoming[1].opacity).toBeGreaterThan(0);
  expect(poses.incoming[1].opacity).toBeLessThan(1);
  expect(poses.held.map(pose => pose.opacity)).toEqual([0, 1, 0, 1, 0, 1, 0, 1]);
});


testIconBehavior(infrastructureIcons, [50, 120, 225, 400, 650, 1200]);

for (const phase of ["entry", "return"] as const) {
  test(`Infrastructure ${phase} matches pinned React recipes at four sizes`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/infrastructure-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), infrastructureIcons.map(icon => icon.tag));
    await page.evaluate(async phase => {
      const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await settle();
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("infrastructure-seek", { detail: 0 }));
      await settle();
      document.dispatchEvent(new CustomEvent("infrastructure-seek", { detail: phase === "entry" ? 0 : 2200 }));
      if (phase === "return") {
        document.dispatchEvent(new CustomEvent("infrastructure-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("infrastructure-seek", { detail: 0 }));
        await settle();
      }
    }, phase);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "infrastructure-seek", times: [0, 30, 60, 90, 120, 150, 180, 240, 300, 400, 500, 650, 900, 1200, 1800], origin: "svg" as const,
    });
    if (phase === "entry") for (const icon of infrastructureIcons) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference must move`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter must move`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, phase);
    expect(errors).toEqual([]);
    console.log(`Infrastructure ${phase}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; normalized paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const icon of infrastructureIcons) {
  test(`${icon.name} animates on hover and leaves its other instance idle`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    await page.locator("#primary").hover();
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}


test("Binary renders only its four idle digits without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/binary/");
  expect(await page.locator("#primary [data-motion]").evaluateAll(glyphs => glyphs.map(glyph => Number(getComputedStyle(glyph).opacity)))).toEqual([1, 0, 1, 0, 1, 0, 1, 0]);
  await context.close();
});

test("Cpu returns both interrupted axes to one", async ({ page }) => {
  await page.goto("/cpu/");
  await page.waitForFunction(() => !!customElements.get("grave-cpu"));
  const poses = await page.locator("#controlled grave-cpu").evaluate((element: HTMLElement & IconHandle) => {
    const pose = () => [...element.querySelectorAll("[data-motion]")].map(pin => { const matrix = new DOMMatrix(getComputedStyle(pin).transform); return [matrix.a, matrix.d]; });
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 250; });
    const peak = pose();
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
    const stopped = pose();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 1000; });
    return { peak, stopped, rest: pose() };
  });
  expect(poses.peak).toEqual([[1, 1.5], [1, 1.5], [1.5, 1], [1.5, 1], [1.5, 1], [1.5, 1], [1, 1.5], [1, 1.5]]);
  expect(poses.stopped).toEqual(poses.peak);
  expect(poses.rest).toEqual(Array.from({ length: 8 }, () => [1, 1]));
});

test("Terminal keeps the original infinite linear blink", async ({ page }) => {
  await page.goto("/terminal/");
  await page.waitForFunction(() => !!customElements.get("grave-terminal"));
  const result = await page.locator("#controlled grave-terminal").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const animation = element.getAnimations({ subtree: true })[0];
    animation.pause();
    const opacity = (time: number) => { animation.currentTime = time; return Number(getComputedStyle(element.querySelector("line")!).opacity); };
    return { iterations: animation.effect!.getTiming().iterations, opacity: [0, 200, 400, 600, 800, 1200].map(opacity) };
  });
  expect(result.iterations).toBe(Infinity);
  result.opacity.forEach((opacity, index) => expect(opacity).toBeCloseTo([1, 0.5, 0, 0.5, 1, 0][index], 12));
});

for (const slug of ["binary", "terminal"]) {
  test(`${slug} cancels its queued work and reconnects to the current control`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    await page.getByRole("button", { name: "Add instance" }).click();
    const oldControl = await page.locator("#dynamic a").elementHandle();
    const instance = await page.locator(`#dynamic grave-${slug}`).elementHandle();
    await page.locator("#dynamic a").hover();
    await expect.poll(() => instance!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    await instance!.evaluate((element: HTMLElement & IconHandle) => {
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 120; });
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
      element.remove();
    });
    await page.waitForTimeout(900);
    expect(await instance!.evaluate(element => ({ tracks: element.getAnimations({ subtree: true }).length, clean: [...element.querySelectorAll<SVGElement>("[data-motion]")].every(glyph => !glyph.style.opacity && !glyph.style.transform) }))).toEqual({ tracks: 0, clean: true });
    await page.mouse.move(0, 0);
    await page.locator("#secondary").evaluate((control, element) => control.append(element!), instance);
    await page.locator("#secondary").hover();
    await expect.poll(() => instance!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(slug === "binary" ? 16 : 1);
    await page.mouse.move(0, 0);
    await expect.poll(() => instance!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await oldControl!.hover();
    expect(await instance!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const time of [60, 120, 180, 300]) {
  for (const phase of ["entry", "return"] as const) {
    test(`Binary cancels hidden and delayed glyphs on reduced motion during ${phase} at ${time} ms`, async ({ page }) => {
      await page.goto("/binary/");
      await page.waitForFunction(() => !!customElements.get("grave-binary"));
      const icon = page.locator("#controlled grave-binary");
      await icon.evaluate((element: HTMLElement & IconHandle, { time, phase }) => {
        element.startAnimation();
        if (phase === "return") {
          element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 450; });
          element.stopAnimation();
        }
        element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      }, { time, phase });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(500);
      await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
      expect(await icon.evaluate(element => ({ tracks: element.getAnimations({ subtree: true }).length, opacity: [...element.querySelectorAll("[data-motion]")].map(glyph => Number(getComputedStyle(glyph).opacity)), clean: [...element.querySelectorAll<SVGElement>("[data-motion]")].every(glyph => !glyph.style.transform && !glyph.style.opacity) }))).toEqual({ tracks: 0, opacity: [1, 0, 1, 0, 1, 0, 1, 0], clean: true });
    });
  }
}


for (const icon of infrastructureIcons) {
  test(`${icon.name} replaces active entry and return tracks on replay`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const instance = page.locator(`#controlled ${icon.tag}`);
    const states = await instance.evaluate((element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      element.startAnimation();
      seek(120);
      const entry = element.getAnimations({ subtree: true });
      element.startAnimation();
      const cancelledEntry = entry.map(animation => animation.playState);
      seek(60);
      element.stopAnimation();
      seek(60);
      const returning = element.getAnimations({ subtree: true });
      element.startAnimation();
      const cancelledReturn = returning.map(animation => animation.playState);
      element.stopAnimation();
      return { cancelledEntry, cancelledReturn };
    });
    expect(states.cancelledEntry.length).toBeGreaterThan(0);
    expect(states.cancelledEntry.every(state => state === "idle")).toBe(true);
    expect(states.cancelledReturn.length).toBeGreaterThan(0);
    expect(states.cancelledReturn.every(state => state === "idle")).toBe(true);
    await expect.poll(() => instance.evaluate(element => ({ tracks: element.getAnimations({ subtree: true }).length, clean: [...element.querySelectorAll<SVGElement>("[data-motion]")].every(shape => !shape.style.transform && !shape.style.opacity && !shape.style.strokeDasharray && !shape.style.strokeDashoffset) }))).toEqual({ tracks: 0, clean: true });
  });
}
