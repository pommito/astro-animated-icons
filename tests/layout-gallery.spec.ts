import { expect, test } from "@playwright/test";
import { layoutGallery } from "./helpers/layout-gallery.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("PanelLeftClose moves only its arrow in the upstream direction", async ({ page }) => {
  await page.goto("/panel-left-close/");
  expect((await page.request.get("/panel-left-close/")).status()).toBe(200);
  await page.waitForFunction(() => !!customElements.get("grave-panel-left-close"));
  const poses = await page.locator("#controlled grave-panel-left-close").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 200; });
    return [...element.querySelectorAll("rect, path")].map(shape => new DOMMatrix(getComputedStyle(shape).transform).m41);
  });
  expect(poses).toEqual([0, 0, -1.5]);
});

testIconBehavior(layoutGallery, [50, 225, 400, 650, 1200]);

for (const interruption of [0, 150, 350]) {
  test(`Layout/gallery matches pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/layout-gallery-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), layoutGallery.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("layout-gallery-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("layout-gallery-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("layout-gallery-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "layout-gallery-seek", times: [0, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 800, 1000, 1500],
      origin: "svg" as const,
    });
    if (!interruption) for (const icon of layoutGallery) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Layout/gallery ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}


for (const icon of layoutGallery) {
  test(`${icon.name} hover and manual playback change the drawing`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const read = (element: Element) => [...element.querySelectorAll("path, line, rect")].map(shape => {
      const style = getComputedStyle(shape);
      return [style.transform, style.opacity, style.strokeDasharray, style.strokeWidth, shape.getAttribute("x1"), shape.getAttribute("x2")];
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
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.waitForTimeout(50);
      await controlled.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
      await page.waitForTimeout(50);
      await controlled.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    }
    await controlled.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
    await expect.poll(() => controlled.evaluate(read)).toEqual(rest);
  });
}


test("Layers waits for both first-stage springs before starting its return", async ({ page }) => {
  await page.goto("/layers/");
  await page.waitForFunction(() => !!customElements.get("grave-layers"));
  const result = await page.locator("#controlled grave-layers").evaluate(async (element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const first = element.getAnimations({ subtree: true });
    first.forEach(animation => animation.pause());
    const read = () => [...element.querySelectorAll("path")].map(path => new DOMMatrix(getComputedStyle(path).transform).m42);
    first[0].finish();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const waiting = element.getAnimations({ subtree: true }).filter(animation => !first.includes(animation)).length;
    first[1].finish();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const second = element.getAnimations({ subtree: true }).filter(animation => !first.includes(animation));
    second.forEach(animation => { animation.pause(); animation.currentTime = 0; });
    const start = read();
    second.forEach(animation => animation.currentTime = 200);
    const middle = read();
    second.forEach(animation => animation.finish());
    return { waiting, tracks: second.length, start, middle, end: read() };
  });
  expect(result.waiting).toBe(0);
  expect(result.tracks).toBe(2);
  expect(result.start).toEqual([0, -9, -5]);
  expect(result.middle[1]).toBeGreaterThan(-9);
  expect(result.middle[2]).toBeGreaterThan(-5);
  expect(result.end).toEqual([0, 0, 0]);
});

test("Layers second stage matches the original completed-spring boundary", async ({ page }) => {
  await page.goto("/layout-gallery-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true" && !!customElements.get("grave-layers"));
  await page.evaluate(async () => {
    document.querySelector<HTMLButtonElement>("#play")!.click();
    document.dispatchEvent(new CustomEvent("layout-gallery-seek", { detail: 0 }));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.dispatchEvent(new Event("layout-gallery-next-stage"));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.dispatchEvent(new CustomEvent("layout-gallery-seek", { detail: 0 }));
  });
  const durations = await page.locator("tr[data-icon='layers']").evaluateAll(rows => rows.map(row => JSON.parse((row as HTMLElement).dataset.stageDurations!)));
  for (const duration of durations) expect(duration.adapter).toEqual(duration.reference);
  console.log("Layers first-stage durations in seconds: " + JSON.stringify(durations[0]));
  const samples = (await page.evaluate(sampleUpstreamPoses, {
    seekEvent: "layout-gallery-seek", times: [0, 50, 100, 200, 350, 500, 650, 1000, 1500], origin: "svg" as const,
  })).filter(sample => sample.icon === "layers");
  const result = compareUpstreamPoses(samples, "Layers second stage");
  console.log("Layers second stage: " + JSON.stringify(result));
});

for (const phase of ["first", "second"] as const) for (const action of ["stop", "remove", "reduce", "replay"] as const) {
  test("Layers cancels pending " + phase + "-stage work on " + action, async ({ page }) => {
    await page.goto("/layers/");
    await page.waitForFunction(() => !!customElements.get("grave-layers"));
    const icon = await page.locator("#controlled grave-layers").elementHandle();
    await icon!.evaluate(async (element: HTMLElement & IconHandle, phase) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 200; });
      if (phase === "second") {
        element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 200; });
      }
    }, phase);
    if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else await icon!.evaluate((element: HTMLElement & IconHandle, action) => {
      if (action === "remove") element.remove();
      else {
        if (action === "replay") element.startAnimation();
        element.stopAnimation();
        element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      }
    }, action);
    const clean = () => icon!.evaluate(element => ({ tracks: element.getAnimations({ subtree: true }).length, clean: [...element.querySelectorAll<SVGElement>("path")].every(path => !path.style.transform) }));
    await expect.poll(clean).toEqual({ tracks: 0, clean: true });
    await page.waitForTimeout(1200);
    expect(await clean()).toEqual({ tracks: 0, clean: true });
    if (action === "remove") {
      await page.locator("#secondary").evaluate((control, icon) => { icon!.removeAttribute("data-controlled"); control.append(icon!); }, icon);
      await page.locator("#secondary").hover();
      await expect.poll(() => icon!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(2);
      await page.mouse.move(0, 0);
      await expect.poll(clean).toEqual({ tracks: 0, clean: true });
    }
  });
}
