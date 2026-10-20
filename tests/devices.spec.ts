import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { devices } from "./helpers/devices.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(devices.filter(icon => icon.slug !== "keyboard"), [50, 250, 650, 1600]);
testIconBehavior(devices.filter(icon => icon.slug === "keyboard"), []);

for (const icon of devices) {
  test(`${icon.name} animates on hover and keeps its second instance idle`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    await page.locator("#primary").hover();
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => page.locator("#primary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const interruption of [0, 150, 650, 1600]) {
  test(`Devices match pinned React ${interruption ? `captured return ${interruption} ms` : "entry"}`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/devices-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), devices.map(icon => icon.tag));
    await page.evaluate(async interruption => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      document.dispatchEvent(new CustomEvent("devices-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("devices-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("devices-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "devices-seek", times: [0, 25, 50, 100, 150, 200, 250, 300, 400, 600, 800, 1000, 1500, 2500, 3400], origin: "svg" as const,
    });
    const comparable = samples.filter(sample => !["smartphone-nfc", "projector"].includes(sample.icon!));
    if (!interruption) for (const icon of devices.filter(icon => !["smartphone-nfc", "projector"].includes(icon.slug))) {
      const poses = comparable.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(comparable, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Devices ${interruption ? `captured return ${interruption}ms` : "entry"}: geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const slug of ["smartphone-nfc", "projector"]) for (const phase of [0, 1]) for (const returning of [false, true]) {
  test(`${slug} matches pinned React stage ${phase + 1} ${returning ? "return" : "entry"}`, async ({ page }) => {
    await page.goto("/devices-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    if (slug === "smartphone-nfc" && phase) await page.waitForFunction(() => {
      const animations = document.querySelector('tr[data-icon="smartphone-nfc"] [data-reference]')!.getAnimations({ subtree: true });
      return animations.length === 3 && animations.every(animation => Number(animation.effect!.getTiming().duration) > 300);
    });
    await page.evaluate(async ({ slug, phase, returning }) => {
      const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await settle();
      document.dispatchEvent(new CustomEvent("devices-seek", { detail: 0 }));
      if (phase) {
        document.dispatchEvent(new CustomEvent("devices-complete-phase", { detail: slug }));
        await settle();
        document.dispatchEvent(new CustomEvent("devices-seek", { detail: 0 }));
      }
      if (returning) {
        document.dispatchEvent(new CustomEvent("devices-seek", { detail: 150 }));
        document.dispatchEvent(new Event("devices-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("devices-seek", { detail: 0 }));
      }
    }, { slug, phase, returning });
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "devices-seek", times: phase || returning ? [0, 25, 50, 100, 150, 200, 300, 400, 600, 800] : [0, 25, 50, 100, 150, 200, 250, 299], origin: "svg" as const,
    });
    const result = compareUpstreamPoses(samples.filter(sample => sample.icon === slug), `stage ${phase + 1} ${returning ? "return" : "entry"}`);
    console.log(`${slug} stage ${phase + 1} ${returning ? "return" : "entry"}: geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const slug of ["smartphone-nfc", "projector"]) for (const phase of [0, 1]) for (const action of ["stop", "replay", "remove", "reduce"] as const) {
  test(`${slug} cancels pending stage work after ${action} in stage ${phase + 1}`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
    await icon!.evaluate(async (element: HTMLElement & IconHandle, { slug, phase }) => {
      element.startAnimation();
      if (phase && slug === "projector") {
        element.querySelectorAll("path[data-motion]").forEach(path => path.getAnimations().forEach(animation => animation.finish()));
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = phase && slug === "smartphone-nfc" ? 450 : 150; });
    }, { slug, phase });
    if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else await icon!.evaluate((element: HTMLElement & IconHandle, action) => {
      if (action === "remove") element.remove();
      else {
        element.stopAnimation();
        if (action === "replay") { element.startAnimation(); element.stopAnimation(); }
      }
    }, action);
    await page.waitForTimeout(1200);
    expect(await icon!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      clean: [...element.querySelectorAll<SVGElement>("g, path")].every(shape => !shape.style.transform && !shape.style.opacity && !shape.style.strokeDasharray),
    }))).toEqual({ tracks: 0, clean: true });
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const time of [50, 900, 1800, 2500]) {
  test(`Keyboard resets keys immediately on stop at ${time} ms and replays after stop`, async ({ page }) => {
    await page.goto("/keyboard/");
    await page.waitForFunction(() => !!customElements.get("grave-keyboard"));
    const poses = await page.locator("#controlled grave-keyboard").evaluate((element: HTMLElement & IconHandle, time) => {
      const read = () => [...element.querySelectorAll("[data-key]")].map(key => Number(getComputedStyle(key).opacity));
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const before = read();
      element.stopAnimation();
      const stopped = read();
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 750; });
      return { before, stopped, replay: read() };
    }, time);
    expect(poses.before.some(value => value < 1)).toBe(true);
    expect(poses.stopped).toEqual(Array(8).fill(1));
    expect(poses.replay[0]).toBeCloseTo(0.2, 4);
  });
}

test("Keyboard keeps per-key random delays and explicitly replays repeated starts", async ({ page }) => {
  await page.goto("/keyboard/");
  await page.waitForFunction(() => !!customElements.get("grave-keyboard"));
  const playback = await page.locator("#controlled grave-keyboard").evaluate((element: HTMLElement & IconHandle) => {
    const timings = () => [...element.querySelectorAll("[data-key]")].map(key => {
      const timing = key.getAnimations()[0].effect!.getTiming();
      return { delay: timing.delay, duration: timing.duration, iterations: timing.iterations, direction: timing.direction };
    });
    element.startAnimation();
    const first = timings();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 750; });
    const dimmed = Number(getComputedStyle(element.querySelector("[data-key='0']")!).opacity);
    element.startAnimation();
    const second = timings();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
    const replay = Number(getComputedStyle(element.querySelector("[data-key='0']")!).opacity);
    return { first, second, dimmed, replay, tracks: element.getAnimations({ subtree: true }).length };
  });
  for (const timings of [playback.first, playback.second]) timings.forEach((timing, index) => {
    expect(timing.delay).toBeGreaterThanOrEqual(0);
    expect(timing.delay).toBeLessThanOrEqual(index * 200);
    expect(timing.duration).toBe(1500);
    expect(timing.iterations).toBe(2);
    expect(timing.direction).toBe("alternate");
  });
  expect(playback.first.map(timing => timing.delay)).not.toEqual(playback.second.map(timing => timing.delay));
  expect(playback.dimmed).toBeCloseTo(0.2, 4);
  expect(playback.replay).toBe(1);
  expect(playback.tracks).toBe(8);
});

test("MonitorCheck reveals its check with independent 400 ms opacity and length tracks", async ({ page }) => {
  await page.goto("/monitor-check/");
  await page.waitForFunction(() => !!customElements.get("grave-monitor-check"));
  const pose = await page.locator("#controlled grave-monitor-check").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 200; });
    const check = element.querySelector("[data-motion]")!;
    return { opacity: Number(getComputedStyle(check).opacity), length: parseFloat(getComputedStyle(check).strokeDasharray) };
  });
  expect(pose.opacity).toBeCloseTo(0.5, 3);
  expect(pose.length).toBeCloseTo(0.5, 3);
});
