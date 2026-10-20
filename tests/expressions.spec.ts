import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { expressions } from "./helpers/expressions.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(expressions, [50, 250, 650, 1400]);
for (const icon of expressions) {
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

for (const interruption of [0, 150, 350, 1600]) {
  test(`Expressions match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/expressions-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), expressions.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("expressions-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("expressions-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("expressions-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "expressions-seek", times: [0, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 800, 1000, 1500],
      origin: "svg" as const, includeStrokeWidth: true,
    });
    const comparable = samples.filter(sample => sample.icon !== "heart-pulse");
    if (!interruption) for (const icon of expressions.filter(icon => icon.slug !== "heart-pulse")) {
      const poses = comparable.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(comparable, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Expressions ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const phase of [0, 1, 2]) for (const returning of [false, true]) {
  test(`HeartPulse matches the original React stage ${phase + 1} ${returning ? "return" : "entry"}`, async ({ page }) => {
    await page.goto("/expressions-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(() => !!customElements.get("grave-heart-pulse"));
    await page.evaluate(async phase => {
      const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("expressions-seek", { detail: 0 }));
      await settle();
      for (let index = 0; index < phase; index++) {
        document.dispatchEvent(new Event("expressions-complete-phase"));
        await settle();
        document.dispatchEvent(new CustomEvent("expressions-seek", { detail: 0 }));
      }
    }, phase);
    if (returning) await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent("expressions-seek", { detail: 150 }));
      document.dispatchEvent(new Event("expressions-capture-return"));
      document.querySelector<HTMLButtonElement>("#stop")!.click();
      document.dispatchEvent(new CustomEvent("expressions-seek", { detail: 0 }));
    });
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "expressions-seek", times: phase === 2 ? [0, 100, 225, 450, 675, 900, 1125, 1350, 1575, 1800] : [0, 25, 50, 100, 150, 250, 400, 500],
      origin: "svg" as const, includeStrokeWidth: true,
    });
    const result = compareUpstreamPoses(samples.filter(sample => sample.icon === "heart-pulse"), `stage ${phase + 1} ${returning ? "return" : "entry"}`);
    console.log(`HeartPulse stage ${phase + 1} ${returning ? "return" : "entry"}: geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const phase of [0, 1, 2]) for (const action of ["stop", "replay", "remove", "reduce"] as const) {
  test(`HeartPulse cancels later stages on ${action} during stage ${phase + 1}`, async ({ page }) => {
    await page.goto("/heart-pulse/");
    await page.waitForFunction(() => !!customElements.get("grave-heart-pulse"));
    const icon = await page.locator("#controlled grave-heart-pulse").elementHandle();
    await icon!.evaluate(async (element: HTMLElement & IconHandle, phase) => {
      element.startAnimation();
      for (let index = 0; index < phase; index++) {
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
    await page.waitForTimeout(2100);
    expect(await icon!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      clean: [...element.querySelectorAll<SVGElement>("g, path")].every(shape => !shape.style.transform && !shape.style.opacity && !shape.style.strokeDasharray && !shape.style.strokeDashoffset),
    }))).toEqual({ tracks: 0, clean: true });
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

for (const slug of ["frown", "smile"]) for (const action of ["stop", "remove", "reduce"] as const) {
  test(`${slug} restores its moving mouth path after ${action}`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
    const read = (element: Element) => element.querySelector("[data-part=mouth]")!.getAttribute("d");
    const rest = await icon!.evaluate(read);
    await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await expect.poll(() => icon!.evaluate(read)).not.toEqual(rest);
    if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else {
      const pose = await icon!.evaluate((element: HTMLElement & IconHandle, action) => {
        const mouth = element.querySelector("[data-part=mouth]")!;
        const before = mouth.getAttribute("d");
        if (action === "remove") element.remove();
        else element.stopAnimation();
        return { before, after: mouth.getAttribute("d") };
      }, action);
      if (action === "stop") expect(pose.after).toEqual(pose.before);
    }
    await expect.poll(() => icon!.evaluate(read)).toEqual(rest);
    await page.waitForTimeout(650);
    expect(await icon!.evaluate(read)).toEqual(rest);
  });
}

test("Laugh returns its mouth transform progressively before cleanup", async ({ page }) => {
  await page.goto("/laugh/");
  await page.waitForFunction(() => !!customElements.get("grave-laugh"));
  const poses = await page.locator("#controlled grave-laugh").evaluate((element: HTMLElement & IconHandle) => {
    const mouth = element.querySelector("[data-part=mouth]")!;
    const read = () => new DOMMatrix(getComputedStyle(mouth).transform).d;
    const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
    element.startAnimation();
    seek(600);
    const held = read();
    element.stopAnimation();
    seek(150);
    return { held, returning: read() };
  });
  expect(poses.held).toBeCloseTo(1.1, 4);
  expect(poses.returning).toBeGreaterThan(1);
  expect(poses.returning).toBeLessThan(poses.held);
});

for (const slug of ["party-popper", "heart-pulse"]) for (const completeAll of [false, true]) {
  test(`${slug} replays its explicit first keyframes after completing ${completeAll ? "all tracks" : "its first stage"}`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const pose = await page.locator(`#controlled grave-${slug}`).evaluate(async (element: HTMLElement & IconHandle, { slug, completeAll }) => {
      const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      element.startAnimation();
      for (let phase = 0; phase < (slug === "heart-pulse" && completeAll ? 3 : 1); phase++) {
        element.getAnimations({ subtree: true }).forEach(animation => {
          const shape = (animation.effect as KeyframeEffect).target;
          if (completeAll || slug === "heart-pulse" || shape?.matches("[data-part=cone]")) animation.finish();
          else { animation.pause(); animation.currentTime = 100; }
        });
        await settle();
      }
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 100; });
      const shape = element.querySelector(slug === "heart-pulse" ? "[data-part=ecg]" : "[data-part=cone]")!;
      return slug === "heart-pulse" ? parseFloat(getComputedStyle(shape).strokeDasharray) : new DOMMatrix(getComputedStyle(shape).transform).e;
    }, { slug, completeAll });
    if (slug === "heart-pulse") expect(pose).toBeLessThan(0.5);
    else expect(pose).toBeLessThan(-0.05);
  });
}
