import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { loadingView } from "./helpers/loading-view.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(loadingView, [50, 250, 700, 950, 1750, 2900]);

for (const icon of loadingView) {
  test(`${icon.name} hover animates only its own instance`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    await page.locator("#primary").hover();
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const interruption of [0, 150, 750, 800, 801, 950, 1000, 1001, 1600, 1601, 1750, 2000, 2001, 2900]) {
  test(`Loading and viewport match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/loading-view-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), loadingView.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("loading-view-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("loading-view-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("loading-view-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "loading-view-seek", times: [0, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 600, 700, 750, 790, 800, 850, 950, 1000, 1100, 1600, 1750, 2400, 2900],
      origin: "wrapper" as const,
    });
    if (!interruption) for (const icon of loadingView) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Loading and viewport ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const icon of loadingView) for (const returning of [false, true]) {
  test(`${icon.name} replays continuously during ${returning ? "return" : "entry"}`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const controlled = page.locator(`#controlled ${icon.tag}`);
    const pose = await controlled.evaluate((element: HTMLElement & IconHandle, returning) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const read = () => [...element.querySelectorAll("svg, g, path, circle")].map(shape => {
        const style = getComputedStyle(shape);
        return [style.transform, style.opacity];
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

for (const icon of loadingView.filter(icon => icon.slug.startsWith("loader"))) {
  test(`${icon.name} stops from its late-cycle angle without normalizing to a different turn`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const result = await page.locator(`#controlled ${icon.tag}`).evaluate((element: HTMLElement & IconHandle, slug) => {
      const duration = slug === "loader-pinwheel" ? 1000 : 800;
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const angle = () => {
        const shape = element.querySelector<SVGElement>("[data-spin]")!;
        const matrix = new DOMMatrix(getComputedStyle(shape).transform);
        const value = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
        return value < 0 ? value + 360 : value;
      };
      element.startAnimation();
      seek(duration * 3.9);
      const before = angle();
      element.stopAnimation();
      seek(0);
      const stopped = angle();
      seek(100);
      const returning = angle();
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return { before, stopped, returning };
    }, icon.slug);
    expect(result.before).toBeCloseTo(324, 3);
    expect(result.stopped).toBeCloseTo(result.before, 3);
    expect(result.returning).toBeGreaterThan(250);
    expect(result.returning).toBeLessThan(324);
    await expect.poll(() => page.locator(`#controlled ${icon.tag}`).evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });

  test(`${icon.name} cancels its loop on removal, reconnects, and stays static with reduced motion`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const handle = await page.locator(`#controlled ${icon.tag}`).elementHandle();
    const clean = () => handle!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      transform: element.querySelector<SVGElement>("[data-spin]")!.style.transform,
    }));
    await handle!.evaluate((element: HTMLElement & IconHandle) => { element.startAnimation(); element.remove(); });
    expect(await clean()).toEqual({ tracks: 0, transform: "" });
    await page.waitForTimeout(1100);
    expect(await clean()).toEqual({ tracks: 0, transform: "" });
    await page.locator("#secondary").evaluate((control, element) => { element!.removeAttribute("data-controlled"); control.append(element!); }, handle);
    await page.locator("#secondary").hover();
    await expect.poll(() => handle!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(clean).toEqual({ tracks: 0, transform: "" });
    await handle!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await page.waitForTimeout(1100);
    expect(await clean()).toEqual({ tracks: 0, transform: "" });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.mouse.move(0, 0);
    await page.locator("#secondary").hover();
    await expect.poll(() => handle!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    await page.mouse.move(0, 0);
    await expect.poll(clean).toEqual({ tracks: 0, transform: "" });
  });
}

test("CircleDashed restarts its completed staggered fade", async ({ page }) => {
  await page.goto("/circle-dashed/");
  await page.waitForFunction(() => !!customElements.get("grave-circle-dashed"));
  const opacities = await page.locator("#controlled grave-circle-dashed").evaluate(async (element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 250; });
    return [...element.querySelectorAll("path")].map(path => Number(getComputedStyle(path).opacity));
  });
  expect(opacities[0]).toBeGreaterThan(opacities[1]);
  expect(opacities[1]).toBeGreaterThan(opacities[2]);
  expect(opacities.slice(2)).toEqual([0, 0, 0, 0, 0, 0]);
});

test("Maximize preserves upstream butt caps and miter joins", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/maximize/");
  const styles = await page.locator("#primary path").evaluateAll(paths => paths.map(path => ({ cap: getComputedStyle(path).strokeLinecap, join: getComputedStyle(path).strokeLinejoin })));
  expect(styles).toEqual(Array(4).fill({ cap: "butt", join: "miter" }));
  await context.close();
});

for (const icon of loadingView.filter(icon => icon.slug.startsWith("loader"))) {
  test(`${icon.name} returns without spurious reverse turns just after its loop boundary`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const result = await page.locator(`#controlled ${icon.tag}`).evaluate((element: HTMLElement & IconHandle, slug) => {
      const duration = slug === "loader-pinwheel" ? 1000 : 800;
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      element.startAnimation();
      seek(duration * 3 + 1);
      element.stopAnimation();
      seek(100);
      const transform = getComputedStyle(element.querySelector("[data-spin]")!).transform;
      const matrix = new DOMMatrix(transform);
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    }, icon.slug);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(40);
    await expect.poll(() => page.locator(`#controlled ${icon.tag}`).evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const time of [500, 501]) {
  test(`FilePenLine keeps its existing finite-repeat stop pose at ${time} ms`, async ({ page }) => {
    await page.goto("/file-pen-line/");
    await page.waitForFunction(() => !!customElements.get("grave-file-pen-line"));
    const controlled = page.locator("#controlled grave-file-pen-line");
    const pose = await controlled.evaluate((element: HTMLElement & IconHandle, time) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const read = () => [...element.querySelectorAll("path")].map(path => getComputedStyle(path).transform);
      element.startAnimation();
      seek(time);
      const before = read();
      element.stopAnimation();
      seek(0);
      const after = read();
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return { before, after };
    }, time);
    expect(pose.after).toEqual(pose.before);
    await expect.poll(() => controlled.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}
