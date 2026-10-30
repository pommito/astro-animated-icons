import type { IconHandle } from "../../../../packages/animated-icons/src/element";
import { checkSyntheticLifecycle } from "./synthetic-lifecycle";

interface CapturedPose { slug: string; size: number; scenario: string; time: number; matrix: number[]; origin: string; }
interface ComparisonConfiguration { target: string; duration: number; returnDuration?: number; clearOrigin?: boolean; linear?: boolean; }

export async function installFiniteComparisonChecks(captured: { poses: CapturedPose[] }, configurations: Record<string, ComparisonConfiguration>) {
  type Handle = HTMLElement & IconHandle;
  const samples = () => [...document.querySelectorAll<Handle>("[data-sample]")];
  await Promise.all([...new Set(samples().map(icon => icon.localName))].map(tag => customElements.whenDefined(tag)));
  const animations = (icon: HTMLElement) => icon.getAnimations({ subtree: true });
  const seek = (icon: HTMLElement, time: number) => animations(icon).forEach(animation => { animation.pause(); animation.currentTime = time; });
  const reconnect = (icon: HTMLElement) => { const parent = icon.parentElement!; icon.remove(); parent.append(icon); };
  const settle = async () => { await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); };
  const configFor = (icon: HTMLElement) => configurations[icon.localName.replace(/^grave-(?:reference-)?/, "")];
  const target = (icon: HTMLElement) => icon.querySelector<SVGElement>(configFor(icon).target)!;
  const matrix = (icon: HTMLElement) => {
    const value = new DOMMatrix(getComputedStyle(target(icon)).transform);
    return [value.a, value.b, value.c, value.d, value.e, value.f];
  };
  const error = (a: number[], b: number[]) => Math.max(...a.map((value, index) => Math.abs(value - b[index])));
  const clean = (icon: HTMLElement) => animations(icon).length === 0 && !icon.hasAttribute("data-cycle-state") &&
    [...icon.style].every(property => !property.startsWith("--grave-cycle-")) &&
    target(icon).style.transform === "" && (target(icon).style.transformOrigin === "" || !configFor(icon).clearOrigin);

  document.querySelector("#play")!.addEventListener("click", () => samples().forEach(icon => icon.startAnimation()));
  document.querySelector("#stop")!.addEventListener("click", () => samples().forEach(icon => icon.stopAnimation()));
  document.querySelector<HTMLButtonElement>("#parity")!.addEventListener("click", async event => {
    const button = event.currentTarget as HTMLButtonElement;
    button.disabled = true;
    const output = document.querySelector("#parity-result")!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { output.textContent = "Skipped under reduced motion"; button.disabled = false; return; }
    let assertions = 0, snapshots = 0, savedSnapshots = 0, maxMatrixError = 0, maxSavedError = 0;
    const failures: string[] = [];
    const check = (pass: boolean, context: string) => { assertions++; if (!pass) failures.push(context); };
    try {
      for (const row of document.querySelectorAll<HTMLElement>("[data-pair]")) {
        const icons = [...row.querySelectorAll<Handle>("[data-sample]")];
        const kind = row.closest<HTMLElement>("[data-kind]")!.dataset.kind!;
        const size = Number(row.dataset.size);
        const context = kind + "/" + size;
        const duration = configurations[kind].duration;
        const back = configurations[kind].returnDuration ?? duration;
        const reset = () => icons.forEach(reconnect);
        const start = () => icons.forEach(icon => check(icon.startAnimation() === undefined, context + ": start returns void"));
        const stop = () => icons.forEach(icon => check(icon.stopAnimation() === undefined, context + ": stop returns void"));
        const pause = (time: number) => icons.forEach(icon => seek(icon, time));
        const compare = (scenario: string) => {
          const difference = error(matrix(icons[0]), matrix(icons[1]));
          maxMatrixError = Math.max(maxMatrixError, difference); snapshots++;
          check(difference <= 0.005, context + ": " + scenario + " matrix=" + difference);
          const origins = icons.map(icon => getComputedStyle(target(icon)).transformOrigin);
          check(origins[0] === origins[1], context + ": " + scenario + " origin");
        };
        const timing = (expected: number) => icons.forEach(icon => {
          check(animations(icon).length === 1, context + ": one transform track");
          animations(icon).forEach(animation => {
            const value = animation.effect!.getTiming();
            check(value.duration === expected && value.delay === 0 && value.iterations === 1 && (!configurations[kind].linear || value.easing === "linear"), context + ": native timing");
          });
        });
        const times = (end: number) => [...new Set([0, 1, 2.5, 4.9, 5, 31, 83, 125, 199, end / 4, end / 3, end * 0.45, end / 2, end * 2 / 3, end * 3 / 4, end - 1, end])];
        reset(); start(); timing(duration);
        for (const time of times(duration)) { pause(time); compare("entry at " + time); }
        for (const interrupted of [31, 83, 199, duration - 1, duration]) for (const operation of ["stop", "replay"]) {
          reset(); start(); pause(interrupted);
          const before = icons.map(matrix);
          if (operation === "stop") stop(); else start();
          timing(operation === "stop" ? back : duration); pause(0);
          icons.forEach((icon, index) => check(error(matrix(icon), before[index]) <= 0.005, context + ": displayed pose retained"));
          for (const time of times(operation === "stop" ? back : duration)) { pause(time); compare(operation + " from " + interrupted + " at " + time); }
        }
        for (const operation of ["stop", "replay"]) {
          reset(); start(); pause(199); stop(); pause(83);
          if (operation === "stop") stop(); else start();
          timing(operation === "stop" ? back : duration);
          for (const time of times(operation === "stop" ? back : duration)) { pause(time); compare(operation + " during return at " + time); }
        }
        reset(); start(); icons.forEach(icon => animations(icon).forEach(animation => animation.finish())); await settle();
        compare("held completion");
        stop(); timing(back);
        icons.forEach(icon => animations(icon).forEach(animation => animation.finish())); await settle();
        check(icons.every(clean), context + ": completed return clears all state"); stop();
        check(icons.every(clean), context + ": stop after completed return stays idle");
        start(); pause(83);
        const stale = icons.flatMap(icon => animations(icon).map(animation => ({ animation, callback: animation.onfinish })));
        start(); pause(125);
        stale.forEach(({ animation, callback }) => callback?.call(animation, new AnimationPlaybackEvent("finish")));
        await settle(); compare("synthetic stale callback after replay");
        check(icons.every(icon => animations(icon).length === 1), context + ": stale callback preserves active playback");
        reset(); start(); pause(83);
        const disconnected = icons.flatMap(icon => animations(icon).map(animation => ({ animation, callback: animation.onfinish })));
        icons.forEach(icon => icon.remove());
        disconnected.forEach(({ animation, callback }) => callback?.call(animation, new AnimationPlaybackEvent("finish")));
        await settle(); check(icons.every(clean), context + ": stale callbacks after disconnect stay clean");
        [...row.querySelectorAll("td")].forEach((cell, index) => cell.append(icons[index]));
        start(); pause(83); compare("reconnected playback"); reset();
        let scenario = "";
        const icon = icons[1];
        for (const pose of captured.poses.filter(pose => pose.slug === kind && pose.size === size)) {
          if (pose.scenario !== scenario) {
            reset(); icon.startAnimation(); scenario = pose.scenario;
            if (scenario === "held completion" || scenario === "stop after hold") {
              animations(icon).forEach(animation => animation.finish()); await settle();
              if (scenario === "stop after hold") icon.stopAnimation();
            }
            const interruption = /^(stop|replay) from (\d+)$/.exec(scenario);
            if (interruption) {
              seek(icon, Number(interruption[2]));
              if (interruption[1] === "stop") icon.stopAnimation(); else icon.startAnimation();
            } else if (scenario.endsWith("during return")) {
              seek(icon, 199); icon.stopAnimation(); seek(icon, 83);
              if (scenario.startsWith("stop")) icon.stopAnimation(); else icon.startAnimation();
            }
          }
          seek(icon, pose.time);
          const difference = error(matrix(icon), pose.matrix);
          maxSavedError = Math.max(maxSavedError, difference); savedSnapshots++;
          check(difference <= 0.005 && getComputedStyle(target(icon)).transformOrigin === pose.origin,
            context + ": saved Motion " + scenario + " at " + pose.time + " matrix=" + difference);
        }
        reset();
      }
      output.textContent = JSON.stringify({ userAgent: navigator.userAgent, assertions, snapshots, savedSnapshots, maxMatrixError, maxSavedError, failures });
    } catch (error) { output.textContent = JSON.stringify({ error: String(error), failures }); }
    finally { button.disabled = false; }
  });

  document.querySelector("#runtime")!.addEventListener("click", () => {
    const reports = Object.fromEntries([...document.querySelectorAll<HTMLElement>("[data-kind]")].map(section => [section.dataset.kind!, checkSyntheticLifecycle(section.querySelector<HTMLElement>("[data-parent]")!)]));
    document.querySelector("#runtime-result")!.textContent = JSON.stringify(reports);
  });
}
