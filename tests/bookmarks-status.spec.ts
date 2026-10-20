import { expect, test } from "@playwright/test";
import type { IconHandle } from "../packages/animated-icons/src/element.js";
import { bookmarksStatus } from "./helpers/bookmarks-status.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { compareUpstreamPoses, sampleUpstreamPoses } from "./helpers/upstream-comparison.js";

testIconBehavior(bookmarksStatus, [50, 200, 450, 750]);

for (const phase of ["entry", "return", "interrupted return"] as const) {
  test(`Bookmark and status ${phase} matches the pinned React components at four sizes`, async ({ page }) => {
    test.setTimeout(60000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/bookmarks-status-comparison/");
    await page.waitForFunction(() => document.body.dataset.referencesReady === "true");
    await page.waitForFunction(tags => tags.every(tag => !!customElements.get(tag)), bookmarksStatus.map(icon => icon.tag));
    await page.evaluate(phase => {
      document.querySelector<HTMLButtonElement>("#play")!.click();
      document.dispatchEvent(new CustomEvent("bookmarks-status-seek", { detail: phase === "entry" ? 0 : phase === "return" ? 3250 : 200 }));
      if (phase !== "entry") {
        document.dispatchEvent(new Event("bookmarks-status-capture-return"));
        document.querySelector<HTMLButtonElement>("#stop")!.click();
      }
    }, phase);
    const samples = await page.evaluate(sampleUpstreamPoses, {
      seekEvent: "bookmarks-status-seek", times: [0, 25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 750, 1000, 1500], origin: "svg-center" as const,
    });
    if (phase === "entry") for (const icon of bookmarksStatus) {
      for (const side of ["adapter", "reference"] as const) {
        expect(new Set(samples.filter(sample => sample.icon === icon.slug && sample.size === "28").map(sample => JSON.stringify(sample[side]))).size, `${icon.name} ${side} must move`).toBeGreaterThan(1);
      }
    }
    const measured = phase === "interrupted return" ? samples.filter(sample => ["circle-check", "circle-help", "ban"].includes(sample.icon!)) : samples;
    const result = compareUpstreamPoses(measured, phase);
    console.log(`Bookmark and status ${phase}: maximum geometry ${result.maximumGeometry.toFixed(6)} px; normalized paint ${result.maximumPaint.toFixed(6)}.`);
    expect(errors).toEqual([]);
  });
}

for (const icon of bookmarksStatus) {
  test(`${icon.name} replays continuously during entry and return`, async ({ page }) => {
    await page.goto(`/${icon.slug}/`);
    await page.waitForFunction(tag => !!customElements.get(tag), icon.tag);
    const result = await page.locator(`#controlled ${icon.tag}`).evaluate((element: HTMLElement & IconHandle) => {
      const seek = (time: number) => element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
      const pose = () => [...element.querySelectorAll("svg,g,path,line,circle")].map(shape => {
        const style = getComputedStyle(shape);
        return [style.transform, style.opacity, style.strokeDasharray, style.strokeDashoffset];
      });
      element.startAnimation(); seek(200);
      const entry = pose(); element.startAnimation(); seek(0); const replay = pose();
      seek(150); element.stopAnimation(); seek(100);
      const returning = pose(); element.startAnimation(); seek(0); const replayReturn = pose();
      element.getAnimations({ subtree: true }).forEach(animation => animation.play());
      return { entry, replay, returning, replayReturn };
    });
    expect(result.replay).toEqual(result.entry);
    expect(result.replayReturn).toEqual(result.returning);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => page.locator(`#controlled ${icon.tag}`).evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  });
}
