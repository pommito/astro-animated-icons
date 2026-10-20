import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { designTools } from "./helpers/design-tools.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(designTools, [50, 250, 450, 750, 1400]);

for (const icon of designTools) {
  test(`${icon.name} hover changes its drawing and isolates its second instance`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    await page.locator("#primary").hover();
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const interruption of [0, 150, 450, 1600]) {
  test(`Design tools match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/design-tools-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), designTools.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("design-tools-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("design-tools-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("design-tools-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "design-tools-seek", times: [0, 25, 50, 100, 150, 200, 250, 280, 300, 350, 400, 450, 520, 600, 690, 750, 800, 1000, 1600],
      origin: "wrapper" as const,
    });
    const comparable = samples.filter(sample => sample.icon !== "scan-text");
    if (!interruption) for (const icon of designTools.filter(icon => icon.slug !== "scan-text")) {
      const poses = comparable.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(comparable, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Design tools ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const phase of [0, 1]) for (const returning of [false, true]) {
  test(`ScanText matches the original React stage ${phase + 1} ${returning ? "return" : "entry"}`, async ({ page }) => {
    await page.goto("/design-tools-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true" && !!customElements.get("grave-scan-text"));
    await page.evaluate(async phase => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("design-tools-seek", { detail: 0 }));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (phase) {
        document.dispatchEvent(new Event("design-tools-complete-phase"));
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        document.dispatchEvent(new CustomEvent("design-tools-seek", { detail: 0 }));
      }
    }, phase);
    if (returning) await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent("design-tools-seek", { detail: 150 }));
      document.dispatchEvent(new Event("design-tools-capture-return"));
      document.querySelector<HTMLButtonElement>("#stop")!.click();
      document.dispatchEvent(new CustomEvent("design-tools-seek", { detail: 0 }));
    });
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "design-tools-seek", times: [0, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500], origin: "wrapper" as const,
    });
    const result = compareUpstreamPoses(samples.filter(sample => sample.icon === "scan-text"), `ScanText stage ${phase + 1} ${returning ? "return" : "entry"}`);
    console.log(`ScanText stage ${phase + 1} ${returning ? "return" : "entry"}: geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

test("Wrench reaches its pinned 12 degree pose around its off-center origin", async ({ page }) => {
  const response = await page.goto("/wrench/");
  expect(response!.status()).toBe(200);
  await page.waitForFunction(() => !!customElements.get("grave-wrench"));
  const pose = await page.locator("#controlled grave-wrench").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 441; });
    const svg = element.querySelector("svg")!;
    return { matrix: [...new DOMMatrix(getComputedStyle(svg).transform).toFloat64Array()], origin: getComputedStyle(svg).transformOrigin };
  });
  expect(pose.matrix[0]).toBeCloseTo(Math.cos(12 * Math.PI / 180), 4);
  expect(pose.matrix[1]).toBeCloseTo(Math.sin(12 * Math.PI / 180), 4);
  expect(pose.origin).not.toBe("14px 14px");
});

test("ScanText waits for every erase track before starting the staggered redraw", async ({ page }) => {
  await page.goto("/scan-text/");
  await page.waitForFunction(() => !!customElements.get("grave-scan-text"));
  const result = await page.locator("#controlled grave-scan-text").evaluate(async (element: HTMLElement & IconHandle) => {
    const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    element.startAnimation();
    const erase = element.getAnimations({ subtree: true });
    erase.forEach(animation => animation.pause());
    const durations = erase.map(animation => Number(animation.effect!.getComputedTiming().endTime));
    erase.slice(0, 2).forEach(animation => animation.finish());
    await settle();
    const waiting = element.getAnimations({ subtree: true }).filter(animation => !erase.includes(animation)).length;
    erase.slice(2).forEach(animation => animation.finish());
    await settle();
    const redraw = element.getAnimations({ subtree: true }).filter(animation => !erase.includes(animation));
    redraw.forEach(animation => { animation.pause(); animation.currentTime = 150; });
    const lines = [...element.querySelectorAll<SVGElement>("path")];
    return {
      waiting, durations, redraw: redraw.length,
      corners: lines.slice(0, 4).every(path => !path.style.opacity && !path.style.strokeDasharray),
      dashes: lines.slice(4).map(path => parseFloat(getComputedStyle(path).strokeDasharray)),
    };
  });
  expect(result.waiting).toBe(0);
  expect(result.durations.sort()).toEqual([300, 300, 400, 400, 500, 500]);
  expect(result.redraw).toBe(6);
  expect(result.corners).toBe(true);
  expect(result.dashes[0]).toBeGreaterThan(result.dashes[1]);
  expect(result.dashes[1]).toBeGreaterThan(result.dashes[2]);
  expect(result.dashes[2]).toBe(0);
});

for (const phase of [0, 1]) for (const action of ["stop", "replay", "remove", "reduce"] as const) {
  test(`ScanText cancels queued redraw on ${action} during stage ${phase + 1}`, async ({ page }) => {
    await page.goto("/scan-text/");
    await page.waitForFunction(() => !!customElements.get("grave-scan-text"));
    const icon = await page.locator("#controlled grave-scan-text").elementHandle();
    await icon!.evaluate(async (element: HTMLElement & IconHandle, phase) => {
      element.startAnimation();
      if (phase) {
        element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 150; });
    }, phase);
    if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else await icon!.evaluate((element: HTMLElement & IconHandle, action) => {
      if (action === "remove") element.remove();
      else {
        element.stopAnimation();
        if (action === "replay") { element.startAnimation(); element.stopAnimation(); }
      }
    }, action);
    const clean = () => icon!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      clean: [...element.querySelectorAll<SVGElement>("path")].every(path => !path.style.opacity && !path.style.strokeDasharray && !path.style.strokeDashoffset),
    }));
    await expect.poll(clean).toEqual({ tracks: 0, clean: true });
    await page.waitForTimeout(1100);
    expect(await clean()).toEqual({ tracks: 0, clean: true });
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    if (action === "remove") {
      await page.locator("#secondary").evaluate((control, icon) => { icon!.removeAttribute("data-controlled"); control.append(icon!); }, icon);
      await page.locator("#secondary").hover();
      await expect.poll(() => icon!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
      await page.mouse.move(0, 0);
      await expect.poll(clean).toEqual({ tracks: 0, clean: true });
    }
  });
}

for (const icon of designTools) for (const returning of [false, true]) {
  test(`${icon.name} replays continuously during ${returning ? "return" : "entry"}`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const controlled = page.locator(`#controlled ${icon.tag}`);
    const pose = await controlled.evaluate((element: HTMLElement & IconHandle, returning) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const read = () => [...element.querySelectorAll("svg, path, circle, line")].map(shape => {
        const style = getComputedStyle(shape);
        return [style.transform, style.opacity, style.strokeDasharray, style.strokeDashoffset];
      });
      element.startAnimation();
      seek(250);
      if (returning) { element.stopAnimation(); seek(100); }
      const before = read();
      element.startAnimation();
      seek(0);
      const after = read();
      element.stopAnimation();
      return { before, after };
    }, returning);
    expect(pose.after).toEqual(pose.before);
    await expect.poll(() => controlled.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const slug of ["palette", "pen-tool"]) for (const completeAll of [false, true]) {
  test(`${slug} replays completed drawing tracks after ${completeAll ? "all tracks" : "only its drawing"} finish`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const pose = await page.locator(`#controlled grave-${slug}`).evaluate(async (element: HTMLElement & IconHandle, { slug, completeAll }) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => {
        const shape = (animation.effect as KeyframeEffect).target;
        if (completeAll || shape?.matches(slug === "palette" ? "[data-part='0']" : "[data-part='2']")) animation.finish();
        else { animation.pause(); animation.currentTime = 250; }
      });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 100; });
      const path = element.querySelector(slug === "palette" ? "[data-part='0']" : "[data-part='2']")!;
      const style = getComputedStyle(path);
      return parseFloat(slug === "palette" ? style.strokeDashoffset : style.strokeDasharray);
    }, { slug, completeAll });
    if (slug === "palette") expect(pose).toBeGreaterThan(60);
    else expect(pose).toBe(0);
  });
}
