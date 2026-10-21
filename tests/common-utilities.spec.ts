import { expect, test } from "@playwright/test";

import type { IconHandle } from "../packages/animated-icons/src/element.js";

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

for (const phase of [350, 1100]) for (const action of ["stop", "replay", "remove", "reduce"] as const) {
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

test("BotMessageSquare replays its staggered dots without pausing again before later cycles", async ({ page }) => {
  await page.goto("/bot-message-square/");
  await page.waitForFunction(() => !!customElements.get("grave-bot-message-square"));
  const icon = page.locator("#controlled grave-bot-message-square");
  const result = await icon.evaluate(async (element: HTMLElement & IconHandle) => {
    const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const dots = [...element.querySelectorAll("circle")];
    element.startAnimation();
    dots.forEach(dot => dot.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 800; }));
    element.startAnimation();
    const entryDelays = dots.map(dot => dot.getAnimations()[0].effect!.getTiming().delay);
    dots.forEach(dot => dot.getAnimations().forEach(animation => animation.finish()));
    await settle();
    const looping = dots.map(dot => dot.getAnimations().some(animation => animation.effect!.getTiming().iterations === Infinity));
    const poses = [100, 1300, 2500].map(time => dots.map(dot => {
      dot.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = time; });
      return Number(getComputedStyle(dot).opacity);
    }));
    element.stopAnimation();
    return { entryDelays, looping, poses };
  });
  expect(result.entryDelays).toEqual([0, 300, 600]);
  expect(result.looping).toEqual([true, true, true]);
  for (const pose of result.poses) for (const opacity of pose) {
    expect(opacity).toBeGreaterThan(0.3);
    expect(opacity).toBeCloseTo(pose[0], 6);
  }
  await expect.poll(() => icon.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
});
