import * as originals from "./references/charts";
import { AsyncMotionValueAnimation, visualElementStore } from "motion";
import { mountReferences } from "./upstream-reference";

mountReferences(originals, "charts-seek");

const cycles = [...document.querySelectorAll<HTMLTableRowElement>("tr[data-icon]")].filter(row =>
  !["chart-line", "chart-spline", "chart-pie"].includes(row.dataset.icon!),
);

document.addEventListener("charts-redraw", async () => {
  for (const row of cycles) {
    row.querySelectorAll("[data-reference] svg *").forEach(element => {
      visualElementStore.get(element)?.values.forEach(value => {
        if (value.animation instanceof AsyncMotionValueAnimation) value.animation.complete();
      });
    });
  }
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
  document.dispatchEvent(new CustomEvent("charts-redraw-seek", { detail: 0 }));
  document.body.dataset.redrawReady = "true";
});

document.addEventListener("charts-redraw-seek", event => {
  const time = (event as CustomEvent<number>).detail;
  document.dispatchEvent(new CustomEvent("charts-seek", { detail: time }));
  for (const row of cycles) {
    const phaseStart = row.dataset.icon === "chart-scatter" ? 200 : 500;
    row.querySelector("[data-adapter]")!.getAnimations({ subtree: true }).forEach(animation => {
      animation.pause();
      animation.currentTime = time + phaseStart;
    });
  }
});
