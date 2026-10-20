import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { foodPlants } from "./helpers/food-plants.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(foodPlants, [25, 100, 350, 700, 1050, 1600]);

test("Coffee exposes its complete cup and three independently delayed steam tracks", async ({ page }) => {
  const response = await page.goto("/coffee/");
  expect(response!.status()).toBe(200);
  await page.waitForFunction(() => !!customElements.get("grave-coffee"));
  await page.locator("#controlled").click();
  const result = await page.locator("#controlled grave-coffee").evaluate(element => ({
    paths: element.querySelectorAll("path").length,
    tracks: element.getAnimations({ subtree: true }).map(animation => ({
      delay: animation.effect!.getTiming().delay ?? 0,
      iterations: animation.effect!.getTiming().iterations,
    })),
  }));
  expect(result.paths).toBe(4);
  expect(result.tracks.map(track => track.delay).sort((a, b) => a - b)).toEqual([0, 0, 40, 40, 80, 80]);
  expect(result.tracks.every(track => track.iterations === Infinity)).toBe(true);
});

for (const interruption of [0, 150, 700, 1600]) {
  test(`Food and plants match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/food-plants-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), foodPlants.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("food-plants-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("food-plants-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("food-plants-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "food-plants-seek",
      times: [0, 25, 40, 50, 80, 100, 120, 150, 200, 250, 300, 350, 450, 500, 550, 650, 700, 750, 900, 1000, 1050, 1200, 1490, 1510, 1530, 1550, 1570, 1590, 1600, 1750, 1800, 2040, 2060, 2540, 2560, 2990, 3010],
      origin: "wrapper" as const,
    });
    if (!interruption) for (const icon of foodPlants) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Food and plants ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const icon of foodPlants) {
  test(`${icon.name} hover isolates its other instance`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    await page.locator("#primary").hover();
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
  for (const returning of [false, true]) {
    test(`${icon.name} replays continuously during ${returning ? "return" : "entry"}`, async ({ page }) => {
      await page.goto(`/${icon.slug}/`);
      await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
      const controlled = page.locator(`#controlled ${icon.tag}`);
      const pose = await controlled.evaluate((element: HTMLElement & IconHandle, returning) => {
        const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
        const read = () => [...element.querySelectorAll("svg, g, path, circle")].map(shape => {
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
}

for (const slug of ["coffee", "soup", "cup-soda"]) {
  test(`${slug} cancels looping work and reconnects to a new control`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
    await icon!.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 1600; });
      element.remove();
    });
    const read = () => icon!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      clean: [...element.querySelectorAll<SVGElement>("svg, g, path, circle")].every(shape => !shape.style.opacity && !shape.style.transform),
      bubbles: [...element.querySelectorAll("circle")].every(shape => getComputedStyle(shape).opacity === "0"),
    }));
    await expect.poll(read).toEqual({ tracks: 0, clean: true, bubbles: true });
    await page.locator("#secondary").evaluate((control, icon) => {
      icon!.removeAttribute("data-controlled");
      control.append(icon!);
    }, icon);
    await page.locator("#controlled").hover();
    expect((await read()).tracks).toBe(0);
    await page.locator("#secondary").hover();
    await expect.poll(async () => (await read()).tracks).toBeGreaterThan(0);
    await page.mouse.move(0, 0);
    await expect.poll(read).toEqual({ tracks: 0, clean: true, bubbles: true });
    await page.waitForTimeout(1700);
    expect(await read()).toEqual({ tracks: 0, clean: true, bubbles: true });
  });
}

test("CupSoda keeps bubbles hidden at rest and retains a finite straw beside independent loops", async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/cup-soda/");
  expect(await staticPage.locator("#primary circle").evaluateAll(circles => circles.map(circle => getComputedStyle(circle).opacity))).toEqual(["0", "0", "0", "0", "0"]);
  expect(await staticPage.locator("#primary svg").evaluate(svg => getComputedStyle(svg).overflow)).toBe("hidden");
  await context.close();
  await page.goto("/cup-soda/");
  await page.waitForFunction(() => !!customElements.get("grave-cup-soda"));
  const result = await page.locator("#controlled grave-cup-soda").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    return element.getAnimations({ subtree: true }).map(animation => ({
      part: ((animation.effect as KeyframeEffect).target as Element).getAttribute("data-part"),
      timing: animation.effect!.getTiming(),
    }));
  });
  expect(result.filter(track => track.part === "3").map(track => [track.timing.duration, track.timing.iterations])).toEqual([[500, 1]]);
  expect(result.filter(track => track.part === "2").map(track => [track.timing.duration, track.timing.iterations])).toEqual([[1800, Infinity]]);
  expect(result.filter(track => Number(track.part) >= 4).map(track => track.timing.delay ?? 0).sort((a, b) => a - b)).toEqual([0, 0, 350, 350, 550, 550, 700, 700, 1050, 1050]);
});

test("Steam and bubble repeat boundaries stay invisible in both renderers", async ({ page }) => {
  await page.goto("/food-plants-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
  await page.waitForTimeout(100);
  const opacity = await page.evaluate(() => {
    const cases = [
      { slug: "coffee", indices: [0, 1, 2], delays: [40, 80, 0] },
      { slug: "soup", indices: [3, 4, 5], delays: [0, 40, 80] },
      { slug: "cup-soda", indices: [4, 5, 6, 7, 8], delays: [0, 350, 700, 1050, 550] },
    ];
    return cases.flatMap(({ slug, indices, delays }) => indices.flatMap((index, part) => {
      const row = document.querySelector(`tr[data-icon='${slug}'][data-size='28']`)!;
      return [1, 2].map(iteration => {
        document.dispatchEvent(new CustomEvent("food-plants-seek", { detail: delays[part] + 1500 * iteration }));
        return ["[data-adapter]", "[data-reference]"].map(selector => Number(getComputedStyle(row.querySelectorAll(`${selector} path, ${selector} circle`)[index]).opacity));
      });
    }));
  });
  expect(opacity.every(pair => pair.every(value => value === 0))).toBe(true);
});

for (const slug of ["banana", "fish-symbol", "cup-soda"]) {
  test(`${slug} restarts completed finite tracks while preserving active loops`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const result = await page.locator(`#controlled grave-${slug}`).evaluate(async (element: HTMLElement & IconHandle, slug) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => {
        if (animation.effect!.getTiming().iterations === Infinity) { animation.pause(); animation.currentTime = 700; }
        else animation.finish();
      });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const bubble = element.querySelector("circle");
      const before = bubble ? [getComputedStyle(bubble).transform, getComputedStyle(bubble).opacity] : [];
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      const after = bubble ? [getComputedStyle(bubble).transform, getComputedStyle(bubble).opacity] : [];
      const finite = element.querySelector(slug === "cup-soda" ? "[data-part='3']" : "path")!;
      const start = [getComputedStyle(finite).transform, getComputedStyle(finite).opacity, getComputedStyle(finite).strokeDasharray];
      element.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 100; });
      const next = [getComputedStyle(finite).transform, getComputedStyle(finite).opacity, getComputedStyle(finite).strokeDasharray];
      return { before, after, start, next };
    }, slug);
    expect(result.after).toEqual(result.before);
    if (slug === "cup-soda") expect(result.next[0]).not.toBe(result.start[0]);
    else expect(parseFloat(result.start[2])).toBe(0);
  });
}
