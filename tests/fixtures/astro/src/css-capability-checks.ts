import { checkSyntheticLifecycle } from "./synthetic-lifecycle";
import capturedCog from "../../../../docs/history/2026-10-29-user-round-cog-motion-before.json";
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
  let maxCapturedCogError = 0;
  let capturedCogSnapshots = 0;
  const failures: string[] = [];
  const check = (pass: boolean, message: string) => { assertions++; if (!pass) failures.push(message); };
  for (const row of rows) {
    const icons = [...row.querySelectorAll<Handle>("[data-sample]")];
    const kind = row.closest<HTMLElement>("[data-kind]")!.dataset.kind!;
    const context = kind + "/" + row.dataset.size;
    const opacity = ["calendar-days", "circle-dashed"].includes(kind);
    const count = kind === "calendar-days" ? 6 : kind === "circle-dashed" ? 8 : 1;
    const duration = kind === "user-round-cog" ? 300 : kind === "calendar-days" ? 900 : kind === "circle-dashed" ? 1100 : 500;
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
          const expectedDuration = kind === "user-round-cog" ? 300 : kind === "calendar-days" ? returning ? 200 : 400 : kind === "circle-dashed" ? 300 : 500;
          const expectedDelay = returning ? 0 : kind === "calendar-days" ? index * 100 : kind === "circle-dashed" ? (index + 1) * 100 : 0;
          const timing = animation.effect!.getTiming();
          check(Math.abs(Number(timing.duration) - expectedDuration) < 0.01 && Math.abs(Number(timing.delay) - expectedDelay) < 0.01, context + ": track duration and delay");
        });
      });
    };
    reset(); start(); checkTiming(false);
    if (kind === "user-round-cog") {
      pause(83);
      check(icons.every(icon => new DOMMatrix(getComputedStyle(icon.querySelector("[data-cog]")!).transform).b > 0), context + ": positive rotation before the half-turn");
      pause(300); compare("exact positive half-turn");
      check(icons.every(icon => { const matrix = new DOMMatrix(getComputedStyle(icon.querySelector("[data-cog]")!).transform); return Math.abs(matrix.a + 1) <= 0.005 && Math.abs(matrix.b) <= 0.005 && Math.abs(matrix.d + 1) <= 0.005; }), context + ": half-turn matrix");
    }
    for (const time of [0, 31, 83, 125, 199, 250, 371, 499, 650, duration - 1]) { pause(Math.min(time, duration - 1)); compare("entry at " + time); }
    for (const interrupted of kind === "user-round-cog" ? [31, 83, 199, 299, 300] : [31, 83, 199, 371, 650]) {
      for (const operation of ["stop", "replay"] as const) {
        reset(); start(); pause(Math.min(interrupted, duration));
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
    if (kind === "user-round-cog") {
      stop(); checkTiming(true);
      for (const time of [0, 31, 83, 150, 250, 299, 300]) { pause(time); compare("return from completed half-turn at " + time); }
      reset(); start();
      icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
      await settle();
    }
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
    start(); icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    icons.forEach(icon => icon.remove()); await settle();
    check(icons.every(icon => animations(icon).length === 0 && [...icon.querySelectorAll<SVGElement>("svg, g, path, rect")].every(element => element.style.transform === "" && element.style.opacity === "")), context + ": stale completion after disconnect stays clean");
    [...row.querySelectorAll("td")].forEach((cell, index) => cell.append(icons[index]));
    if (kind === "user-round-cog") {
      const icon = icons[1];
      let scenario = "";
      for (const pose of capturedCog.poses.filter(pose => pose.size === Number(row.dataset.size))) {
        if (pose.scenario !== scenario) {
          reset(); icon.startAnimation();
          scenario = pose.scenario;
          const interrupted = /^(stop|replay) from (\d+)$/.exec(scenario);
          if (interrupted) {
            seek(icon, Number(interrupted[2]));
            if (interrupted[1] === "stop") icon.stopAnimation(); else icon.startAnimation();
          } else if (scenario.endsWith("during return")) {
            seek(icon, 300); icon.stopAnimation(); seek(icon, 83);
            if (scenario.startsWith("stop")) icon.stopAnimation(); else icon.startAnimation();
          }
        }
        seek(icon, pose.time);
        const target = icon.querySelector("[data-cog]")!;
        const matrix = new DOMMatrix(getComputedStyle(target).transform);
        const error = Math.max(...[matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f].map((value, index) => Math.abs(value - pose.matrix[index])));
        maxCapturedCogError = Math.max(maxCapturedCogError, error);
        capturedCogSnapshots++;
        check(error <= 0.005 && getComputedStyle(target).transformOrigin === pose.origin, context + ": captured Motion " + scenario + " at " + pose.time + " matrix=" + error);
      }
      reset();
    }
    if (opacity) {
      reset(); start();
      const early = icons.map(icon => animations(icon)[0]);
      early.forEach(animation => animation.finish()); await settle();
      icons.forEach(icon => animations(icon).forEach(animation => { if (animation.playState !== "finished") { animation.pause(); animation.currentTime = 250; } }));
      start(); pause(0); compare("replay with one completed track"); reset();
    }
  }
  result.textContent = JSON.stringify({ userAgent: navigator.userAgent, assertions, snapshots, failures, maxMatrixError, maxOpacityError, capturedCogSnapshots, maxCapturedCogError, rows: rows.length });
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
