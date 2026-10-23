import { checkSyntheticLifecycle } from "./synthetic-lifecycle";
import type { IconHandle } from "../../../../packages/animated-icons/src/element";

type Handle = HTMLElement & IconHandle;
await Promise.all(["grave-reference-bell", "grave-reference-chevron-right", "grave-loader-circle", "grave-bell", "grave-chevron-right"].map(tag => customElements.whenDefined(tag)));
const samples = () => [...document.querySelectorAll<Handle>("[data-sample]")];
const animations = (icon: HTMLElement) => icon.getAnimations({ subtree: true });
const target = (icon: HTMLElement) => icon.querySelector<SVGElement>(icon.closest("[data-kind]")?.getAttribute("data-kind") === "chevron-right" ? "[data-chevron]" : "svg")!;
const seek = (icon: HTMLElement, time: number) => animations(icon).forEach(animation => { animation.pause(); animation.currentTime = time; });
const reconnect = (icon: HTMLElement) => { const parent = icon.parentElement!; icon.remove(); parent.append(icon); };
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const settle = async () => { await frame(); await frame(); };

document.querySelector("#play")!.addEventListener("click", () => samples().forEach(icon => icon.startAnimation()));
document.querySelector("#stop")!.addEventListener("click", () => samples().forEach(icon => icon.stopAnimation()));
document.querySelector("#seek")!.addEventListener("click", () => {
  const time = Number(document.querySelector<HTMLInputElement>("#time")!.value);
  samples().forEach(icon => { icon.startAnimation(); seek(icon, time); });
});

document.querySelector<HTMLButtonElement>("#parity")!.addEventListener("click", async event => {
  const button = event.currentTarget as HTMLButtonElement;
  button.disabled = true;
  const result = document.querySelector("#parity-result")!;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { result.textContent = "Skipped under reduced motion"; button.disabled = false; return; }
  let assertions = 0;
  let snapshots = 0;
  let maxAngleError = 0;
  let maxTranslationError = 0;
  const failures: string[] = [];
  const check = (pass: boolean, message: string) => { assertions++; if (!pass) failures.push(message); };
  for (const row of document.querySelectorAll<HTMLElement>("[data-pair]")) {
    const icons = [...row.querySelectorAll<Handle>("[data-sample]")];
    const kind = row.closest<HTMLElement>("[data-kind]")!.dataset.kind!;
    const context = kind + "/" + row.dataset.size;
    const reset = () => icons.forEach(reconnect);
    const start = () => icons.forEach(icon => icon.startAnimation());
    const stop = () => icons.forEach(icon => icon.stopAnimation());
    const pause = (time: number) => icons.forEach(icon => seek(icon, time));
    const compare = (scenario: string) => {
      const matrices = icons.map(icon => new DOMMatrix(getComputedStyle(target(icon)).transform));
      const angle = (matrix: DOMMatrix) => Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
      const angleError = Math.abs(angle(matrices[0]) - angle(matrices[1]));
      const translationError = Math.abs(matrices[0].e - matrices[1].e);
      maxAngleError = Math.max(maxAngleError, angleError);
      maxTranslationError = Math.max(maxTranslationError, translationError);
      snapshots++;
      check(angleError <= 0.03 && translationError <= 0.005, context + ": " + scenario + " angle=" + angleError + " translation=" + translationError);
    };
    reset(); start();
    icons.forEach(icon => check(animations(icon).every(animation => animation.effect?.getTiming().duration === 500), context + ": duration"));
    for (const time of [0, 31, 83, 125, 199, 250, 371, 499]) { pause(time); compare("entry at " + time); }
    for (const interrupted of [31, 83, 199, 371]) {
      for (const operation of ["stop", "replay"] as const) {
        reset(); start(); pause(interrupted);
        const pose = new DOMMatrix(getComputedStyle(target(icons[1])).transform);
        if (operation === "stop") stop(); else start();
        pause(0);
        const next = new DOMMatrix(getComputedStyle(target(icons[1])).transform);
        check(operation === "replay" && kind === "chevron-right" ? Math.abs(next.e) < 0.005 :
          Math.max(...["a", "b", "c", "d", "e", "f"].map(key => Math.abs(pose[key as keyof DOMMatrix] as number - (next[key as keyof DOMMatrix] as number)))) < 0.001,
          context + ": " + operation + " initial pose at " + interrupted);
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
    await settle();
    compare("completed entry");
    if (kind === "chevron-right") {
      check(animations(icons[1]).length === 0 && !icons[1].hasAttribute("data-cycle-state"), context + ": completion clears CSS playback");
      stop();
      check(animations(icons[1]).length === 0, context + ": stop after completion is idle");
    }
    start(); pause(125); compare("replay after completion");
    stop(); icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    await settle();
    compare("completed return");
    check(animations(icons[1]).length === 0 && !icons[1].hasAttribute("data-cycle-state") && target(icons[1]).style.transform === "", context + ": return clears drawing");
    start(); icons.forEach(icon => animations(icon).forEach(animation => animation.finish()));
    start(); pause(83); await settle(); compare("queued old completion after replay");
    reset();
  }
  result.textContent = JSON.stringify({ assertions, snapshots, failures, maxAngleError, maxTranslationError });
  button.disabled = false;
});

document.querySelector("#runtime")!.addEventListener("click", () => {
  const results = checkSyntheticLifecycle(document.querySelector<HTMLElement>("[data-parent]")!);
  document.querySelector("#runtime-result")!.textContent = JSON.stringify(results);
});

document.querySelector("#benchmark")!.addEventListener("click", () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { document.querySelector("#benchmark-result")!.textContent = "Skipped under reduced motion"; return; }
  const groups = ["original", "managed"].map(mode => document.querySelector<HTMLElement>("#bench-" + mode)!);
  const times: number[][] = [[], []];
  for (let batch = 0; batch < 35; batch++) for (const index of batch % 2 ? [1, 0] : [0, 1]) {
    const group = groups[index]; const parent = group.parentElement!;
    group.remove(); parent.append(group);
    const icons = [...group.querySelectorAll<Handle>("[data-grave-icon]")];
    const start = performance.now(); icons.forEach(icon => icon.startAnimation());
    const duration = performance.now() - start;
    if (batch >= 5) times[index].push(duration);
    group.remove(); parent.append(group);
  }
  const stats = times.map(values => { values.sort((a, b) => a - b); return { median: values[15], p95: values[28], batches: values.length, instances: 20 }; });
  document.querySelector("#benchmark-result")!.textContent = JSON.stringify({ userAgent: navigator.userAgent, original: stats[0], managed: stats[1] });
});
