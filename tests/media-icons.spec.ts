import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("Volume waits for the outgoing branch and cancels pending replacements on removal", async ({ page }) => {
  await page.goto("/volume/");
  await page.waitForFunction(() => !!customElements.get("grave-volume"));
  const icon = page.locator("#controlled grave-volume");
  await expect(icon.locator("line")).toHaveCount(2);
  await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await expect(icon.locator("[data-wave]")).toHaveCount(2);
  await expect(icon.locator("line")).toHaveCount(0);
  await expect.poll(() => icon.locator("[data-wave]").last().evaluate(shape => Number(getComputedStyle(shape).opacity))).toBe(1);
  await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
  await expect(icon.locator("[data-wave]")).toHaveCount(2);
  await expect(icon.locator("line")).toHaveCount(0);
  await expect(icon.locator("line")).toHaveCount(2);
  await expect(icon.locator("[data-wave]")).toHaveCount(0);
  const handle = await icon.elementHandle();
  await handle!.evaluate((element: HTMLElement & IconHandle) => { element.startAnimation(); element.remove(); });
  await page.waitForTimeout(800);
  expect(await handle!.evaluate(element => ({ lines: element.querySelectorAll("line").length, waves: element.querySelectorAll("[data-wave]").length, animations: element.getAnimations({subtree:true}).length }))).toEqual({lines:2,waves:0,animations:0});
});

import { mediaIcons } from "./helpers/media-icons.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(mediaIcons, [50, 200, 450, 1000]);

for (const phase of ["entry", "return", "reverse return"] as const) {
  test(`Media ${phase} matches pinned React recipes at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/media-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), mediaIcons.map(icon => icon.tag));
    await page.evaluate(phase => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("media-seek", { detail: phase === "entry" ? 0 : phase === "return" ? 3250 : 850 }));
      if (phase !== "entry") {
        document.dispatchEvent(new CustomEvent("media-capture-return", { detail: phase === "return" ? 3250 : 850 }));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("media-seek", { detail: 0 }));
      }
    }, phase);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "media-seek", times: [0, 50, 100, 150, 200, 300, 400, 500, 650, 800, 1000, 1200], origin: "svg" as const,
    });
    if (phase === "entry") for (const icon of mediaIcons.filter(icon => icon.slug !== "volume")) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference must move`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter must move`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples.filter(sample => sample.icon !== "volume"), phase);
    expect(errors).toEqual([]);
    console.log(`Media ${phase}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; normalized paint ${result.maximumPaint.toFixed(6)}. Volume branch transitions use a separate real-time comparison.`);
  });
}

test("Volume branch entry and return match the original component after ordered exits", async ({ page }) => {
  await page.goto("/media-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  const row = page.locator('tr[data-icon="volume"][data-size="28"]');
  await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
  await expect(row.locator("[data-adapter] line")).toHaveCount(0);
  await expect(row.locator("[data-reference] line")).toHaveCount(0);
  await page.waitForFunction(() => [...document.querySelectorAll('tr[data-icon="volume"]')].every(row => row.querySelectorAll("[data-reference] path").length === 3 && row.querySelectorAll("[data-adapter] path").length === 3));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const entry = await page.evaluate(sampleUpstreamPoses, { seekEvent: "media-seek", times: [0, 50, 100, 150, 200, 300, 400, 500], origin: "svg" as const });
  console.log("Volume entry", compareUpstreamPoses(entry.filter(sample => sample.icon === "volume"), "incoming waves"));
  await page.evaluate(() => {
    document.dispatchEvent(new Event("media-capture-return"));
    document.querySelector<HTMLButtonElement>("#stop")!.click();
  });
  await page.waitForTimeout(30);
  const exit = await page.evaluate(sampleUpstreamPoses, { seekEvent: "media-seek", times: [0, 50, 100, 150, 200], origin: "svg" as const });
  console.log("Volume exit", compareUpstreamPoses(exit.filter(sample => sample.icon === "volume"), "outgoing waves"));
  await page.evaluate(() => document.getAnimations().forEach(animation => animation.play()));
  await expect(row.locator("[data-adapter] line")).toHaveCount(2);
  await expect(row.locator("[data-reference] line")).toHaveCount(2);
  await page.waitForFunction(() => [...document.querySelectorAll('tr[data-icon="volume"]')].every(row => row.querySelectorAll("[data-reference] line").length === 2 && row.querySelectorAll("[data-adapter] line").length === 2));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const returned = await page.evaluate(sampleUpstreamPoses, { seekEvent: "media-seek", times: [0, 50, 100, 150, 200, 300, 400, 500], origin: "svg" as const });
  console.log("Volume cross", compareUpstreamPoses(returned.filter(sample => sample.icon === "volume"), "incoming cross"));
});

test("Airplay awaits its entry before the automatic 300 ms return", async ({ page }) => {
  await page.goto("/airplay/");
  await page.waitForFunction(() => !!customElements.get("grave-airplay"));
  const icon = page.locator("#controlled grave-airplay");
  await icon.evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
  });
  await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).map(animation => animation.effect!.getTiming().duration))).toEqual([300, 300, 300, 300, 300]);
  await expect.poll(() => icon.evaluate(element => [...element.querySelectorAll<SVGElement>("path")].every(path => !path.style.transform && !path.style.opacity && !path.style.strokeDasharray && !path.style.strokeDashoffset))).toBe(true);
});

for (const time of [50, 200, 450, 1000]) {
  test(`Volume keeps the visible branch continuous when stopped and replayed after ${time} ms`, async ({ page }) => {
    await page.goto("/volume/");
    await page.waitForFunction(() => !!customElements.get("grave-volume"));
    const icon = page.locator("#controlled grave-volume");
    await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await page.waitForTimeout(time);
    const poses = await icon.evaluate((element: HTMLElement & IconHandle) => {
      const pose = () => [...element.querySelectorAll("path,line")].map(shape => [shape.localName, getComputedStyle(shape).opacity, getComputedStyle(shape).strokeDasharray]);
      const before = pose();
      element.stopAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      const after = pose();
      element.startAnimation();
      return { before, after };
    });
    expect(poses.after).toEqual(poses.before);
    await expect(icon.locator("[data-wave]")).toHaveCount(2);
    await expect.poll(() => icon.locator("[data-wave]").last().evaluate(shape => Number(getComputedStyle(shape).opacity))).toBe(1);
    await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
    await expect(icon.locator("line")).toHaveCount(2);
    await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const interruption of ["remove", "reduce"] as const) {
  test(`Volume cancels the active branch and queued exit replacement on ${interruption}`, async ({ page }) => {
    await page.goto("/volume/");
    await page.waitForFunction(() => !!customElements.get("grave-volume"));
    const icon = page.locator("#controlled grave-volume");
    const handle = await icon.elementHandle();
    await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect(icon.locator("[data-wave]")).toHaveCount(2);
    await expect.poll(() => icon.locator("[data-wave]").last().evaluate(shape => Number(getComputedStyle(shape).opacity))).toBe(1);
    await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
    if (interruption === "remove") await handle!.evaluate(element => element.remove());
    else await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(800);
    expect(await handle!.evaluate(element => ({ lines: element.querySelectorAll("line").length, waves: element.querySelectorAll("[data-wave]").length, tracks: element.getAnimations({ subtree: true }).length }))).toEqual({ lines: 2, waves: 0, tracks: 0 });
  });
}

test("Volume keeps the original branch replacement timing in both directions", async ({ page }) => {
  await page.goto("/media-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.waitForTimeout(600);
  const measure = ({ action, shape }: { action: string; shape: string }) => new Promise<Record<string, number>>(resolve => {
    const row = document.querySelector('tr[data-icon="volume"][data-size="28"]')!;
    const times: Record<string, number> = {};
    const started = performance.now();
    const observer = new MutationObserver(() => {
      for (const side of ["adapter", "reference"]) {
        if (times[side] === undefined && row.querySelector(`[data-${side}] ${shape}`)) times[side] = performance.now() - started;
      }
      if (times.adapter !== undefined && times.reference !== undefined) { observer.disconnect(); resolve(times); }
    });
    observer.observe(row, { childList: true, subtree: true });
    document.querySelector<HTMLButtonElement>(action)!.click();
  });
  const entry = await page.evaluate(measure, { action: "#play", shape: 'path[d="M16 9a5 5 0 0 1 0 6"]' });
  expect(entry.adapter).toBeLessThan(150);
  expect(entry.reference).toBeLessThan(150);
  await page.waitForTimeout(600);
  const returning = await page.evaluate(measure, { action: "#stop", shape: "line" });
  expect(returning.adapter).toBeGreaterThanOrEqual(280);
  expect(returning.reference).toBeGreaterThanOrEqual(280);
  expect(Math.abs(returning.adapter - returning.reference)).toBeLessThan(150);
  console.log(`Volume branch replacement in ms: ${JSON.stringify({ entry, returning })}.`);
});

test("Volume continues a partial cross after a repeated stop", async ({ page }) => {
  await page.goto("/volume/");
  await page.waitForFunction(() => !!customElements.get("grave-volume"));
  const icon = page.locator("#controlled grave-volume");
  await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await expect.poll(() => icon.locator("[data-wave]").last().evaluate(shape => Number(getComputedStyle(shape).opacity))).toBe(1);
  const poses = await icon.evaluate(async (element: HTMLElement & IconHandle) => {
    await new Promise<void>(resolve => {
      const observer = new MutationObserver(() => {
        if (!element.querySelector("line")) return;
        element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 200; });
        observer.disconnect();
        resolve();
      });
      observer.observe(element, { childList: true, subtree: true });
      element.stopAnimation();
    });
    const progress = () => parseFloat(getComputedStyle(element.querySelector("line")!).strokeDasharray);
    const before = progress();
    element.stopAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
    const after = progress();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 150; });
    const later = progress();
    element.getAnimations({ subtree: true }).forEach(animation => animation.play());
    return { before, after, later };
  });
  expect(poses.after).toBeCloseTo(poses.before, 4);
  expect(poses.later).toBeGreaterThan(poses.before);
  await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test("Volume templates cloned before registration upgrade with independent branch playback", async ({ page }) => {
  let release!: () => void;
  const registration = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/_astro/*.js", async route => { await registration; await route.continue(); });
  try {
    await page.goto("/volume/", { waitUntil: "commit" });
    await expect(page.locator("#primary svg")).toBeVisible();
    expect(await page.evaluate(() => !!customElements.get("grave-volume"))).toBe(false);
    await page.evaluate(() => document.querySelector("#dynamic")!.append(document.querySelector<HTMLTemplateElement>("#instance-template")!.content.cloneNode(true)));
  } finally { release(); }
  await page.waitForFunction(() => !!customElements.get("grave-volume"));
  const dynamic = page.locator("#dynamic a");
  await dynamic.hover();
  await expect(dynamic.locator("[data-wave]")).toHaveCount(2);
  await expect(page.locator("#primary line")).toHaveCount(2);
  expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.mouse.move(0, 0);
  await expect.poll(() => dynamic.evaluate(element => ({ waves: element.querySelectorAll("[data-wave]").length, lines: element.querySelectorAll("line").length, tracks: element.getAnimations({ subtree: true }).length }))).toEqual({ waves: 0, lines: 2, tracks: 0 });
  await dynamic.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#destination$/);
});

test("Volume template instances cancel a pending replacement and reconnect to the current control", async ({ page }) => {
  await page.goto("/volume/");
  await page.waitForFunction(() => !!customElements.get("grave-volume"));
  await page.getByRole("button", { name: "Add instance" }).click();
  const dynamic = page.locator("#dynamic a");
  const oldControl = await dynamic.elementHandle();
  const instance = await dynamic.locator("grave-volume").elementHandle();
  await dynamic.hover();
  await expect.poll(() => dynamic.locator("[data-wave]").last().evaluate(shape => Number(getComputedStyle(shape).opacity))).toBe(1);
  const cancelled = await instance!.evaluate((element: HTMLElement & IconHandle) => {
    element.stopAnimation();
    const animations = element.getAnimations({ subtree: true });
    element.remove();
    return animations.map(animation => animation.playState);
  });
  expect(cancelled.length).toBeGreaterThan(0);
  expect(cancelled.every(state => state === "idle")).toBe(true);
  await page.waitForTimeout(800);
  expect(await instance!.evaluate(element => ({ lines: element.querySelectorAll("line").length, waves: element.querySelectorAll("[data-wave]").length, tracks: element.getAnimations({ subtree: true }).length }))).toEqual({ lines: 2, waves: 0, tracks: 0 });
  await page.mouse.move(0, 0);
  await page.locator("#primary").evaluate((control, element) => control.append(element!), instance);
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.locator("#primary").hover();
    await expect.poll(() => instance!.evaluate(element => {
      const wave = element.querySelector("[data-wave]:last-child");
      return wave ? Number(getComputedStyle(wave).opacity) : 0;
    })).toBe(1);
    const poses = await instance!.evaluate(async (element: HTMLElement & IconHandle) => {
      await new Promise<void>(resolve => {
        const observer = new MutationObserver(() => {
          if (!element.querySelector("line")) return;
          element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 200; });
          observer.disconnect();
          resolve();
        });
        observer.observe(element, { childList: true, subtree: true });
        element.stopAnimation();
      });
      const pose = () => [...element.querySelectorAll("line")].map(shape => [getComputedStyle(shape).opacity, getComputedStyle(shape).strokeDasharray]);
      const before = pose();
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      const after = pose();
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return { before, after };
    });
    expect(poses.after).toEqual(poses.before);
    await expect.poll(() => instance!.evaluate(element => element.querySelectorAll("[data-wave]").length)).toBe(2);
    await page.mouse.move(0, 0);
    await expect.poll(() => instance!.evaluate(element => ({ waves: element.querySelectorAll("[data-wave]").length, tracks: element.getAnimations({ subtree: true }).length }))).toEqual({ waves: 0, tracks: 0 });
  }
  await oldControl!.hover();
  expect(await instance!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  expect(await instance!.evaluate(element => [...element.querySelectorAll<SVGElement>("line")].every(line => !line.style.opacity && !line.style.strokeDasharray))).toBe(true);
});

test("Airplay interrupted return matches the original screen and triangle tracks", async ({ page }) => {
  await page.goto("/media-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true" && !!customElements.get("grave-airplay"));
  await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>("#play")!.click();
    document.dispatchEvent(new CustomEvent("media-seek", { detail: 300 }));
    document.dispatchEvent(new CustomEvent("media-capture-return", { detail: 300 }));
    document.querySelector<HTMLButtonElement>("#stop")!.click();
  });
  const samples = await page.evaluate(sampleUpstreamPoses, { seekEvent: "media-seek", times: [0, 50, 100, 150, 200, 300, 400], origin: "svg" as const });
  const result = compareUpstreamPoses(samples.filter(sample => sample.icon === "airplay"), "return interrupted at 300 ms");
  console.log(`Airplay interrupted return: geometry ${result.maximumGeometry.toFixed(6)} px, normalized paint ${result.maximumPaint.toFixed(6)}.`);
});
