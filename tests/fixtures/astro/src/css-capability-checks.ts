import { checkSyntheticLifecycle } from "./synthetic-lifecycle";
import type { IconHandle } from "../../../../packages/animated-icons/src/element";
type Handle = HTMLElement & IconHandle;
const rows = [...document.querySelectorAll<HTMLElement>("[data-pair]")];
const samples = () => [...document.querySelectorAll<Handle>("[data-sample]")];
await Promise.all([...new Set(samples().map(icon => icon.localName))].map(tag => customElements.whenDefined(tag)));
const animations = (icon: HTMLElement) => icon.getAnimations({ subtree: true });
const seek = (icon: HTMLElement, time: number) => animations(icon).forEach(animation => { animation.pause(); animation.currentTime = time; });
const reconnect = (icon: HTMLElement) => { const parent = icon.parentElement!; icon.remove(); parent.append(icon); };
const settle = async () => { await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); };
document.querySelector("#play")!.addEventListener("click", () => samples().forEach(icon => icon.startAnimation()));
document.querySelector("#stop")!.addEventListener("click", () => samples().forEach(icon => icon.stopAnimation()));
document.querySelector<HTMLButtonElement>("#parity")!.addEventListener("click", async event => {
  const button = event.currentTarget as HTMLButtonElement;
  button.disabled = true;
  const result = document.querySelector("#parity-result")!;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { result.textContent = "Skipped under reduced motion"; button.disabled = false; return; }
  let assertions = 0;
  let snapshots = 0;
  let maxMatrixError = 0;
  let maxOpacityError = 0;
  const failures: string[] = [];
  const check = (pass: boolean, message: string) => { assertions++; if (!pass) failures.push(message); };
  for (const row of rows) {
    const icons = [...row.querySelectorAll<Handle>("[data-sample]")];
    const kind = row.closest<HTMLElement>("[data-kind]")!.dataset.kind!;
    const context = kind + "/" + row.dataset.size;
    const opacity = ["calendar-days", "circle-dashed"].includes(kind);
    const count = kind === "calendar-days" ? 6 : kind === "circle-dashed" ? 8 : 1;
    const duration = kind === "calendar-days" ? 900 : kind === "circle-dashed" ? 1100 : 500;
    const reset = () => icons.forEach(reconnect);
    const start = () => icons.forEach(icon => icon.startAnimation());
    const stop = () => icons.forEach(icon => icon.stopAnimation());
    const pause = (time: number) => icons.forEach(icon => seek(icon, time));
    const compare = (scenario: string) => {
      const targets = icons.map(icon => [...icon.querySelectorAll<SVGElement>("svg, g, path, circle, rect")]);
      let matrixError = 0;
      let opacityError = 0;
      targets[0].forEach((element, index) => {
        const a = new DOMMatrix(getComputedStyle(element).transform);
        const b = new DOMMatrix(getComputedStyle(targets[1][index]).transform);
        matrixError = Math.max(matrixError, ...["a", "b", "c", "d", "e", "f"].map(key => Math.abs((a[key as keyof DOMMatrix] as number) - (b[key as keyof DOMMatrix] as number))));
        opacityError = Math.max(opacityError, Math.abs(Number(getComputedStyle(element).opacity) - Number(getComputedStyle(targets[1][index]).opacity)));
      });
      maxMatrixError = Math.max(maxMatrixError, matrixError);
      maxOpacityError = Math.max(maxOpacityError, opacityError);
      snapshots++;
      check(matrixError <= 0.005 && opacityError <= 0.001, context + ": " + scenario + " matrix=" + matrixError + " opacity=" + opacityError);
    };
    const checkTiming = (returning: boolean) => {
      icons.forEach(icon => {
        const tracks = animations(icon);
        check(tracks.length === count, context + ": track count " + tracks.length);
        tracks.forEach((animation, index) => {
          const expectedDuration = kind === "calendar-days" ? returning ? 200 : 400 : kind === "circle-dashed" ? 300 : 500;
          const expectedDelay = returning ? 0 : kind === "calendar-days" ? index * 100 : kind === "circle-dashed" ? (index + 1) * 100 : 0;
          const timing = animation.effect!.getTiming();
          check(Math.abs(Number(timing.duration) - expectedDuration) < 0.01 && Math.abs(Number(timing.delay) - expectedDelay) < 0.01, context + ": track duration and delay");
        });
      });
    };
    reset(); start(); checkTiming(false);
    for (const time of [0, 31, 83, 125, 199, 250, 371, 499, 650, duration - 1]) { pause(Math.min(time, duration - 1)); compare("entry at " + time); }
    for (const interrupted of [31, 83, 199, 371, 650]) {
      for (const operation of ["stop", "replay"] as const) {
        reset(); start(); pause(Math.min(interrupted, duration - 1));
        if (operation === "stop") stop(); else start();
        checkTiming(operation === "stop");
        for (const time of [0, 31, 125, 250, 499]) { pause(time); compare(operation + " from " + interrupted + " at " + time); }
      }
    }
    for (const operation of ["stop", "replay"] as const) {
      reset(); start(); pause(199); stop(); pause(83);
      if (operation === "stop") stop(); else start();
      for (const time of [0, 31, 125, 250, 499]) { pause(time); compare(operation + " during return at " + time); }
    }
    reset(); start();
    icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    await settle(); compare("completed entry");
    start(); pause(83); compare("replay after completion");
    stop(); icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    await settle(); compare("completed return");
    check(animations(icons[1]).length === 0 && !icons[1].hasAttribute("data-cycle-state") && !icons[1].hasAttribute("data-opacity-state") && !icons[1].style.getPropertyValue("--grave-cycle-from") && [...icons[1].querySelectorAll<SVGElement>("svg, g, path, rect")].every(element => element.style.opacity === "" && element.style.transform === "" && !element.style.getPropertyValue("--grave-opacity-from") && !element.style.getPropertyValue("--grave-opacity-entry-from")), context + ": return clears state, poses and variables");
    start(); icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    start(); pause(83); await settle(); compare("queued old completion after replay");
    icons.forEach(icon => icon.remove());
    check(icons.every(icon => animations(icon).length === 0 && !icon.hasAttribute("data-cycle-state") && !icon.hasAttribute("data-opacity-state")), context + ": disconnect clears");
    [...row.querySelectorAll("td")].forEach((cell, index) => cell.append(icons[index]));
    start(); pause(83); compare("reconnected replay"); reset();
    if (opacity) {
      reset(); start();
      const early = icons.map(icon => animations(icon)[0]);
      early.forEach(animation => animation.finish()); await settle();
      icons.forEach(icon => animations(icon).forEach(animation => { if (animation.playState !== "finished") { animation.pause(); animation.currentTime = 250; } }));
      start(); pause(0); compare("replay with one completed track"); reset();
    }
  }
  result.textContent = JSON.stringify({ userAgent: navigator.userAgent, assertions, snapshots, failures, maxMatrixError, maxOpacityError, rows: rows.length });
  button.disabled = false;
});

document.querySelector("#runtime")!.addEventListener("click", () => {
  const reports: Record<string, Record<string, boolean>> = {};
  for (const section of document.querySelectorAll<HTMLElement>("[data-kind]")) {
    const count = section.dataset.kind === "calendar-days" ? 6 : section.dataset.kind === "circle-dashed" ? 8 : 1;
    reports[section.dataset.kind!] = checkSyntheticLifecycle(section.querySelector<HTMLElement>("[data-parent]")!, count);
  }
  document.querySelector("#runtime-result")!.textContent = JSON.stringify(reports);
});
