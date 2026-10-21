import { expect, test } from "@playwright/test";
import { healthScience } from "./helpers/health-science.js";
import { transportRoutes } from "./helpers/transport-routes.js";
import { handsGestures } from "./helpers/hands-gestures.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";
import type { IconHandle } from "../packages/animated-icons/src/element.js";

test("Flask keeps separate rotation, translation, and spring scale timelines", async ({ page }) => {
  const response = await page.goto("/flask/");
  expect(response!.status()).toBe(200);
  await page.waitForFunction(() => !!customElements.get("grave-flask"));
  const timings = await page.locator("#controlled grave-flask").evaluate((element: HTMLElement & IconHandle) => {
    element.startAnimation();
    return element.getAnimations({ subtree: true }).map(animation => {
      animation.pause();
      return Number(animation.effect!.getComputedTiming().duration);
    });
  });
  expect(timings).toContain(800);
  expect(timings.some(duration => duration > 800)).toBe(true);
});

testIconBehavior(healthScience, [50, 150, 350, 650, 950, 1700, 3500]);

for (const icon of healthScience) {
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

for (const interruption of [0, 150, 450, 1700, 3505]) {
  test(`Health and science match pinned React ${interruption ? `return from ${interruption} ms` : "entry"} at four sizes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/health-science-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), healthScience.map(icon => icon.tag));
    if (!interruption) {
      const idle = await page.evaluate(sampleUpstreamPoses, { seekEvent: "health-science-seek", times: [0], origin: "wrapper" as const, includeStrokeWidth: true });
      compareUpstreamPoses(idle, "complete idle drawing");
    }
    await page.evaluate(() => document.querySelector<HTMLButtonElement>("#play")!.click());
    await page.waitForTimeout(100);
    await page.evaluate(interruption => {
      document.dispatchEvent(new CustomEvent("health-science-seek", { detail: interruption }));
      if (interruption) {
        document.dispatchEvent(new Event("health-science-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
        document.dispatchEvent(new CustomEvent("health-science-seek", { detail: 0 }));
      }
    }, interruption);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "health-science-seek", times: [0, 25, 50, 100, 150, 200, 250, 280, 300, 350, 400, 450, 520, 600, 690, 750, 800, 1005, 1405, 1705, 2105, 2805, 3505, 4205],
      origin: "wrapper" as const, includeStrokeWidth: true,
    });
    const comparable = samples;
    if (!interruption) for (const icon of healthScience) {
      const poses = comparable.filter(sample => sample.icon === icon.slug && sample.size === "28");
      expect(new Set(poses.map(sample => JSON.stringify(sample.reference))).size, `${icon.name} reference changes`).toBeGreaterThan(1);
      expect(new Set(poses.map(sample => JSON.stringify(sample.adapter))).size, `${icon.name} adapter changes`).toBeGreaterThan(1);
    }
    const result = compareUpstreamPoses(comparable, `interruption ${interruption} ms`);
    expect(errors).toEqual([]);
    console.log(`Health and science ${interruption ? `captured return ${interruption}ms` : "entry"}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; paint ${result.maximumPaint.toFixed(6)}.`);
  });
}


for (const icon of [...healthScience, ...transportRoutes.filter(icon => ["car", "truck"].includes(icon.slug)), ...handsGestures.filter(icon => icon.slug === "biceps-flexed")]) for (const returning of [false, true]) {
  test(`${icon.name} replays continuously during ${returning ? "return" : "entry"}`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const controlled = page.locator(`#controlled ${icon.tag}`);
    const pose = await controlled.evaluate((element: HTMLElement & IconHandle, returning) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const read = () => [...element.querySelectorAll("svg, g, path, circle, line")].map(shape => {
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


for (const slug of ["syringe", "flask"]) {
  test(`${slug} preserves its filled source coordinates and paint without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/${slug}/`);
    const drawing = await page.locator("#primary [data-grave-icon] > svg").evaluate(svg => {
      const source = svg.querySelector<SVGSVGElement>("svg[data-source]")!;
      const shape = source.querySelector<SVGGeometryElement>("path")!;
      return {
        scale: source.getCTM()!.a,
        viewport: source.getAttribute("viewBox"),
        overflow: getComputedStyle(source).overflow,
        fill: getComputedStyle(shape).fill,
        color: getComputedStyle(shape).color,
        stroke: getComputedStyle(shape).stroke,
        width: getComputedStyle(shape).strokeWidth,
        visible: [...source.querySelectorAll<SVGGeometryElement>("path, circle")].every(shape => shape.getBoundingClientRect().width > 0 && Number(getComputedStyle(shape).opacity) === 1),
      };
    });
    expect(drawing.scale).toBeCloseTo(16 / 512, 8);
    expect(drawing.viewport).toBe("0 0 512 512");
    expect(drawing.overflow).toBe("hidden");
    expect(drawing.fill).toBe(drawing.color);
    expect(drawing.stroke).toBe(slug === "flask" ? "none" : drawing.color);
    expect(drawing.width).toBe("5.632px");
    expect(drawing.visible).toBe(true);
    await context.close();
  });
}

test("Ambulance keeps its speed lines hidden and its complete vehicle visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/ambulance/");
  expect(await page.locator("#primary [data-speed]").evaluateAll(lines => lines.map(line => Number(getComputedStyle(line).opacity)))).toEqual([0, 0, 0]);
  expect(await page.locator("#primary path, #primary circle").evaluateAll(shapes => shapes.every(shape => Number(getComputedStyle(shape).opacity) === 1 && (shape.getBoundingClientRect().width > 0 || shape.getBoundingClientRect().height > 0)))).toBe(true);
  await context.close();
});

for (const slug of ["atom", "stethoscope"]) for (const completeAll of [false, true]) {
  test(`${slug} restarts its completed reveal after ${completeAll ? "all tracks" : "only the first stroke"} finish`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const dash = await page.locator(`#controlled grave-${slug}`).evaluate(async (element: HTMLElement & IconHandle, completeAll) => {
      element.startAnimation();
      const first = element.querySelector("[data-part='0']")!;
      element.getAnimations({ subtree: true }).forEach(animation => {
        if (completeAll || (animation.effect as KeyframeEffect).target === first) animation.finish();
        else { animation.pause(); animation.currentTime = 100; }
      });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
      return parseFloat(getComputedStyle(first).strokeDasharray);
    }, completeAll);
    expect(dash).toBe(0);
  });
}

for (const subject of [
  { slug: "ambulance", selector: "[data-body]", period: 400, scale: 1, opacity: 1, length: 1 },
  { slug: "ambulance", selector: "[data-cross]", period: 600, scale: 1, opacity: 1, length: 1 },
  { slug: "ambulance", selector: "[data-speed='0']", period: 500, scale: 0.2, opacity: 0, length: 1 },
  { slug: "brain", selector: "svg", period: 1400, scale: 1, opacity: 1, length: 1 },
  { slug: "brain", selector: "[data-part='0']", period: 1400, scale: 1, opacity: 1, length: 1 },
  { slug: "biceps-flexed", selector: "[data-part=path-1]", period: 2000, scale: 1, opacity: 1, length: 1 },
]) {
  test(`${subject.slug} restores the original cycle after an interrupted replay of ${subject.selector}`, async ({ page }) => {
    await page.goto(`/${subject.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${subject.slug}`);
    const poses = await page.locator(`#controlled grave-${subject.slug}`).evaluate(async (element: HTMLElement & IconHandle, subject) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      element.startAnimation();
      seek(137);
      element.startAnimation();
      const bridge = element.getAnimations({ subtree: true });
      const finite = bridge.filter(animation => Number.isFinite(animation.effect!.getComputedTiming().endTime));
      finite.forEach(animation => animation.finish());
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const read = (time: number) => {
        seek(time);
        const style = getComputedStyle(element.querySelector(subject.selector)!);
        const matrix = new DOMMatrix(style.transform);
        const dash = parseFloat(style.strokeDasharray);
        return { scale: matrix.a, x: matrix.e, y: matrix.f, opacity: Number(style.opacity), length: Number.isNaN(dash) ? 1 : dash, offset: parseFloat(style.strokeDashoffset) };
      };
      const loops = element.getAnimations({ subtree: true }).filter(animation => !Number.isFinite(animation.effect!.getComputedTiming().endTime)).length;
      return { bridge: finite.length, loops, first: read(0), middle: read(subject.period / 4), later: read(subject.period * 3) };
    }, subject);
    expect(poses.bridge).toBeGreaterThan(0);
    expect(poses.loops).toBeGreaterThan(0);
    expect(poses.middle).not.toEqual(poses.first);
    for (const pose of [poses.first, poses.later]) {
      expect(pose.scale).toBeCloseTo(subject.scale, 5);
      expect(pose.x).toBeCloseTo(0, 5);
      expect(pose.y).toBeCloseTo(0, 5);
      expect(pose.opacity).toBeCloseTo(subject.opacity, 5);
      expect(pose.length).toBeCloseTo(subject.length, 5);
      expect(pose.offset).toBeCloseTo(0, 5);
    }
  });
}

for (const slug of ["ambulance", "brain", "biceps-flexed"]) for (const action of ["stop", "remove", "reduce"] as const) {
  test(`${slug} cancels the pending original loop after ${action} during a replay bridge`, async ({ page }) => {
    await page.goto(`/${slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), `grave-${slug}`);
    const icon = await page.locator(`#controlled grave-${slug}`).elementHandle();
    await icon!.evaluate((element: HTMLElement & IconHandle) => {
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 137; });
      element.startAnimation();
      element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 75; });
    });
    if (action === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    else await icon!.evaluate((element: HTMLElement & IconHandle, action) => {
      if (action === "remove") element.remove(); else element.stopAnimation();
    }, action);
    const clean = () => icon!.evaluate(element => ({
      tracks: element.getAnimations({ subtree: true }).length,
      drawing: [...element.querySelectorAll<SVGElement>("svg, g, path, circle, line")].every(shape => !shape.style.transform && !shape.style.opacity && !shape.style.strokeDasharray && !shape.style.strokeDashoffset && !shape.style.strokeWidth),
    }));
    await expect.poll(clean).toEqual({ tracks: 0, drawing: true });
    await page.waitForTimeout(2500);
    expect(await clean()).toEqual({ tracks: 0, drawing: true });
    expect(await page.locator("#secondary").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}
