import { checkSyntheticLifecycle } from "./synthetic-lifecycle";
import type { IconHandle } from "../../../../packages/animated-icons/src/element";

type Handle = HTMLElement & IconHandle;
const rows = [...document.querySelectorAll<HTMLElement>("[data-pair]")];
const samples = () => [...document.querySelectorAll<Handle>("[data-sample]")];
await Promise.all([...new Set(samples().map(icon => icon.localName))].map(tag => customElements.whenDefined(tag)));
const animations = (icon: HTMLElement) => icon.getAnimations({ subtree: true });
const target = (icon: HTMLElement) => icon.querySelector<SVGElement>("[data-chevron]")!;
const seek = (icon: HTMLElement, time: number) => animations(icon).forEach(animation => { animation.pause(); animation.currentTime = time; });
const reconnect = (icon: HTMLElement) => { const parent = icon.parentElement!; icon.remove(); parent.append(icon); };
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const settle = async () => { await frame(); await frame(); };

document.querySelector("#play")!.addEventListener("click", () => samples().forEach(icon => icon.startAnimation()));
document.querySelector("#stop")!.addEventListener("click", () => samples().forEach(icon => icon.stopAnimation()));
document.querySelector<HTMLButtonElement>("#parity")!.addEventListener("click", async event => {
  const button = event.currentTarget as HTMLButtonElement;
  button.disabled = true;
  const result = document.querySelector("#parity-result")!;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { result.textContent = "Skipped under reduced motion"; button.disabled = false; return; }
  let assertions = 0;
  let snapshots = 0;
  let maxTranslationError = 0;
  const failures: string[] = [];
  const check = (pass: boolean, message: string) => { assertions++; if (!pass) failures.push(message); };
  for (const row of rows) {
    const icons = [...row.querySelectorAll<Handle>("[data-sample]")];
    const kind = row.closest<HTMLElement>("[data-kind]")!.dataset.kind!;
    const context = kind + "/" + row.dataset.size;
    const duration = kind === "chevron-first" ? 600 : 500;
    const returnDuration = kind === "chevron-first" ? 300 : 500;
    const initial = kind === "chevron-first" ? -2 : 0;
    const reset = () => icons.forEach(reconnect);
    const start = () => icons.forEach(icon => icon.startAnimation());
    const stop = () => icons.forEach(icon => icon.stopAnimation());
    const pause = (time: number) => icons.forEach(icon => seek(icon, time));
    const compare = (scenario: string) => {
      const targets = icons.map(icon => [...icon.querySelectorAll<SVGElement>("g, path, circle, rect")]);
      let error = 0;
      targets[0].forEach((element, index) => {
        const a = new DOMMatrix(getComputedStyle(element).transform);
        const b = new DOMMatrix(getComputedStyle(targets[1][index]).transform);
        error = Math.max(error, ...["a", "b", "c", "d", "e", "f"].map(key => Math.abs((a[key as keyof DOMMatrix] as number) - (b[key as keyof DOMMatrix] as number))));
      });
      maxTranslationError = Math.max(maxTranslationError, error);
      snapshots++;
      check(error <= 0.005, context + ": " + scenario + " matrix error=" + error);
    };
    reset(); start();
    icons.forEach(icon => check(animations(icon).length === 1 && animations(icon)[0].effect?.getTiming().duration === duration, context + ": entry duration and track count"));
    for (const time of [0, 31, 83, 125, 199, 250, 371, duration - 1]) { pause(time); compare("entry at " + time); }
    for (const interrupted of [31, 83, 199, 371]) {
      for (const operation of ["stop", "replay"] as const) {
        reset(); start(); pause(interrupted);
        const pose = new DOMMatrix(getComputedStyle(target(icons[1])).transform);
        if (operation === "stop") stop(); else start();
        pause(0);
        const next = new DOMMatrix(getComputedStyle(target(icons[1])).transform);
        check(operation === "replay" ? Math.abs(next.e - initial) < 0.005 && Math.abs(next.f) < 0.005 : Math.abs(pose.e - next.e) < 0.005 && Math.abs(pose.f - next.f) < 0.005, context + ": " + operation + " initial pose at " + interrupted);
        const expectedDuration = operation === "stop" ? returnDuration : duration;
        icons.forEach(icon => check(animations(icon)[0].effect?.getTiming().duration === expectedDuration, context + ": " + operation + " duration"));
        for (const time of [0, 31, 125, expectedDuration / 2, expectedDuration - 1]) { pause(time); compare(operation + " from " + interrupted + " at " + time); }
      }
    }
    for (const operation of ["stop", "replay"] as const) {
      reset(); start(); pause(199); stop(); pause(83);
      if (operation === "stop") stop(); else start();
      const expectedDuration = operation === "stop" ? returnDuration : duration;
      for (const time of [0, 31, 125, expectedDuration / 2, expectedDuration - 1]) { pause(time); compare(operation + " during return at " + time); }
    }
    reset(); start();
    icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    await settle(); compare("completed entry");
    check(animations(icons[1]).length === 0 && !icons[1].hasAttribute("data-cycle-state"), context + ": completion clears CSS playback");
    stop(); check(animations(icons[1]).length === 0, context + ": stop after completion stays idle");
    start(); pause(125); compare("replay after completion");
    stop(); icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    await settle(); compare("completed return");
    check(animations(icons[1]).length === 0 && !icons[1].hasAttribute("data-cycle-state") && !icons[1].style.getPropertyValue("--grave-cycle-from") && target(icons[1]).style.transform === "", context + ": return clears state, pose, and variable");
    start(); icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    start(); pause(83); await settle(); compare("queued old completion after replay");
    icons.forEach(icon => icon.remove());
    check(icons.every(icon => animations(icon).length === 0 && !icon.hasAttribute("data-cycle-state") && target(icon).style.transform === ""), context + ": disconnect clears");
    [...row.querySelectorAll("td")].forEach((cell, index) => cell.append(icons[index]));
    start(); pause(83); compare("reconnected replay");
    reset();
  }
  result.textContent = JSON.stringify({ userAgent: navigator.userAgent, assertions, snapshots, failures, maxTranslationError, rows: rows.length });
  button.disabled = false;
});

document.querySelector("#runtime")!.addEventListener("click", () => {
  const reports: Record<string, Record<string, boolean>> = {};
  for (const section of document.querySelectorAll<HTMLElement>("[data-kind]")) {
    reports[section.dataset.kind!] = checkSyntheticLifecycle(section.querySelector<HTMLElement>("[data-parent]")!);
  }
  document.querySelector("#runtime-result")!.textContent = JSON.stringify(reports);
});
