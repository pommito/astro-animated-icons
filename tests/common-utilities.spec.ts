import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { commonUtilities } from "./helpers/common-utilities.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(commonUtilities, [50, 250, 450, 950, 1450, 1800]);


test("Accessibility restores its real initial path after an interrupted morph", async ({ page }) => {
  const response = await page.goto("/accessibility/");
  expect(response!.status()).toBe(200);
  await page.waitForFunction(() => !!customElements.get("grave-accessibility"));
  const icon = page.locator("#controlled grave-accessibility");
  await icon.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
  await expect.poll(() => icon.locator("[data-part='2']").getAttribute("d")).not.toBe("M8 5 L5 8");
  await icon.evaluate((element: HTMLElement & IconHandle) => element.stopAnimation());
  await expect(icon.locator("[data-part='2']")).toHaveAttribute("d", "M8 5 L5 8");
  await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
});

 test("Pinned CursorClick runs without a production runtime error", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/common-utilities-comparison/");
  await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
  await page.locator("tr[data-icon=cursor-click]").last().getByRole("button").click();
  await page.waitForTimeout(2400);
  expect(errors).toEqual([]);
});

for (const interruption of [0, 150, 450, 1450, 1800]) {
  test(`Common utilities match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/common-utilities-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), commonUtilities.map(icon => icon.tag));
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(25);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("common-utilities-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("common-utilities-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("common-utilities-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "common-utilities-seek", times: [0, 25, 50, 100, 150, 200, 250, 300, 400, 450, 520, 600, 750, 800, 950, 1000, 1300, 1450, 1600, 1800, 2200, 2600],
      origin: "wrapper" as const,
    });
    if (!interruption) for (const icon of commonUtilities) {
      const poses = samples.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(samples, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Common utilities ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}

for (const icon of commonUtilities) {
  test(`${icon.name} hover plays independently and returns to rest`, async ({ page }) => {
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
        const read = () => [...element.querySelectorAll("svg, g, path, circle, rect, line")].map(shape => {
          const style = getComputedStyle(shape);
          return [style.transform, style.opacity, style.strokeDasharray, style.strokeDashoffset, shape.getAttribute("d")];
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

for (const phase of [100, 350, 650, 1100]) for (const action of ["stop", "replay", "remove", "reduce"] as const) {
  test(`Accessibility cancels its morph on ${action} at ${phase} ms`, async ({ page }) => {
    await page.goto("/accessibility/");
    await page.waitForFunction(() => !!customElements.get("grave-accessibility"));
    const icon = await page.locator("#controlled grave-accessibility").elementHandle();
    await icon!.evaluate((element: HTMLElement & IconHandle) => element.startAnimation());
    await page.waitForTimeout(phase);
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
      path: element.querySelector("[data-part='2']")!.getAttribute("d"),
      transforms: [...element.querySelectorAll<SVGElement>("svg, g, path, circle")].every(shape => !shape.style.transform),
    }));
    await expect.poll(clean).toEqual({ tracks: 0, path: "M8 5 L5 8", transforms: true });
    await page.waitForTimeout(1100);
    expect(await clean()).toEqual({ tracks: 0, path: "M8 5 L5 8", transforms: true });
    if (action === "remove") {
      await page.locator("#secondary").evaluate((control, icon) => { icon!.removeAttribute("data-controlled"); control.append(icon!); }, icon);
      await page.locator("#secondary").hover();
      await expect.poll(() => icon!.evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
      await page.mouse.move(0, 0);
      await expect.poll(clean).toEqual({ tracks: 0, path: "M8 5 L5 8", transforms: true });
    }
  });
}

test("SquareActivity leaves its square static while drawing its activity path", async ({ page }) => {
  await page.goto("/square-activity/");
  await page.waitForFunction(() => !!customElements.get("grave-square-activity"));
  const result = await page.locator("#controlled grave-square-activity").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 300; });
    return { square: element.querySelector("rect")!.getAnimations().length, length: parseFloat(getComputedStyle(element.querySelector("path")!).strokeDasharray) };
  });
  expect(result.square).toBe(0);
  expect(result.length).toBeCloseTo(0.5, 4);
});

test("CursorClick's control override preserves the four-frame spread and seven-frame opacity", async ({ page }) => {
  await page.goto("/cursor-click/");
  await page.waitForFunction(() => !!customElements.get("grave-cursor-click"));
  const result = await page.locator("#controlled grave-cursor-click").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
    const line = element.querySelector("[data-part='1']")!;
    seek(1200);
    const before = Number(getComputedStyle(line).opacity);
    seek(1450);
    const spread = new DOMMatrix(getComputedStyle(line).transform).m41;
    seek(1800);
    const hidden = Number(getComputedStyle(line).opacity);
    seek(2100);
    return { before, spread, hidden, final: Number(getComputedStyle(line).opacity) };
  });
  expect(result.before).toBe(0);
  expect(result.spread).toBeGreaterThan(0.5);
  expect(result.hidden).toBe(0);
  expect(result.final).toBe(1);
});

for (const completeAll of [false, true]) {
  test(`UsersRound replays its completed opacity after ${completeAll ? "all tracks" : "only opacity"} finish`, async ({ page }) => {
    await page.goto("/users-round/");
    await page.waitForFunction(() => !!customElements.get("grave-users-round"));
    const opacity = await page.locator("#controlled grave-users-round").evaluate(async (element: HTMLElement & IconHandle, completeAll) => {
      const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      element.startAnimation();
      await settle();
      const opacityTracks = element.getAnimations({ subtree: true }).filter(animation => (animation.effect as KeyframeEffect).getKeyframes().some(frame => frame.opacity !== undefined)).length;
      element.getAnimations({ subtree: true }).forEach(animation => {
        const effect = animation.effect as KeyframeEffect;
        if (completeAll || effect.getKeyframes().some(frame => frame.opacity !== undefined)) animation.finish();
        else { animation.pause(); animation.currentTime = 150; }
      });
      await settle();
      element.startAnimation();
      await settle();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 150; });
      return { opacityTracks, value: Number(getComputedStyle(element.querySelector("[data-part='0']")!).opacity) };
    }, completeAll);
    expect(opacity.opacityTracks).toBe(1);
    expect(opacity.value).toBeGreaterThan(0);
    expect(opacity.value).toBeLessThan(0.5);
  });
}

for (const time of [150, 350]) for (const replay of [false, true]) {
  test(`UsersRound preserves its resolved opacity on ${replay ? "replay" : "stop"} at ${time} ms`, async ({ page }) => {
    await page.goto("/users-round/");
    await page.waitForFunction(() => !!customElements.get("grave-users-round"));
    const icon = page.locator("#controlled grave-users-round");
    const result = await icon.evaluate(async (element: HTMLElement & IconHandle, { time, replay }) => {
      const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const opacity = () => Number(getComputedStyle(element.querySelector("[data-part='0']")!).opacity);
      element.startAnimation();
      await settle();
      seek(time);
      const before = opacity();
      if (replay) element.startAnimation();
      else element.stopAnimation();
      await settle();
      seek(0);
      const after = opacity();
      element.stopAnimation();
      return { before, after };
    }, { time, replay });
    expect(result.after).toBeCloseTo(result.before, 6);
    await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}
