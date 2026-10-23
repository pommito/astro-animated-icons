import type { IconHandle } from "../../../../packages/animated-icons/src/element";

type Handle = HTMLElement & IconHandle;
await Promise.all(["grave-folder", "grave-reference-folder"].map(tag => customElements.whenDefined(tag)));
const pairs = [...document.querySelectorAll<HTMLElement>("[data-pair]")];
const icons = (scope: ParentNode) => [...scope.querySelectorAll<Handle>("[data-sample]")];
const animations = (icon: Handle) => icon.getAnimations({ subtree: true });
const path = (icon: Handle) => icon.querySelector<SVGElement>("path")!;
const angle = (icon: Handle) => {
  const matrix = new DOMMatrix(getComputedStyle(path(icon)).transform);
  return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
};
const seek = (icon: Handle, time: number) => animations(icon).forEach(animation => { animation.pause(); animation.currentTime = time; });
const reconnect = (icon: Handle) => { const parent = icon.parentNode!; const next = icon.nextSibling; icon.remove(); parent.insertBefore(icon, next); };
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const settle = async () => { await frame(); await frame(); };
const play = (scope: ParentNode, returning = false) => icons(scope).forEach(icon => returning ? icon.stopAnimation() : icon.startAnimation());
document.querySelector("#play")!.addEventListener("click", () => play(document));
document.querySelector("#stop")!.addEventListener("click", () => play(document, true));
for (const row of pairs) {
  row.querySelector("[data-play]")!.addEventListener("click", () => play(row));
  row.querySelector("[data-stop]")!.addEventListener("click", () => play(row, true));
  row.addEventListener("pointerenter", event => { if (event.pointerType === "mouse") play(row); });
  row.addEventListener("pointerleave", event => { if (event.pointerType === "mouse") play(row, true); });
}

function easeOut(progress: number) {
  let low = 0;
  let high = 1;
  for (let i = 0; i < 30; i++) {
    const t = (low + high) / 2;
    const x = 3 * 0.58 * (1 - t) * t * t + t * t * t;
    if (x < progress) low = t; else high = t;
  }
  const t = (low + high) / 2;
  return 3 * (1 - t) * t * t + t * t * t;
}

document.querySelector<HTMLButtonElement>("#check")!.addEventListener("click", async event => {
  const button = event.currentTarget as HTMLButtonElement;
  const output = document.querySelector("#result")!;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { output.textContent = "Skipped under reduced motion"; return; }
  button.disabled = true;
  let assertions = 0;
  let snapshots = 0;
  let maxEntryError = 0;
  let maxReturnError = 0;
  const failures: string[] = [];
  const check = (pass: boolean, message: string) => { assertions++; if (!pass) failures.push(message); };
  try {
    for (const row of pairs) {
      const [motion, css] = icons(row);
      const label = row.dataset.size + " px";
      const reset = () => icons(row).forEach(reconnect);
      const start = () => play(row);
      reset(); start();
      check(animations(css)[0]?.effect?.getTiming().duration === 400, label + ": entry duration");
      for (const time of [0, 31, 83, 125, 199, 250, 371, 399]) {
        icons(row).forEach(icon => seek(icon, time));
        const error = Math.abs(angle(motion) - angle(css));
        maxEntryError = Math.max(maxEntryError, error);
        snapshots++;
        check(error < 0.03, label + ": entry at " + time);
      }
      for (const time of [31, 83, 199, 371]) for (const operation of ["stop", "replay"] as const) {
        reset(); css.startAnimation(); seek(css, time);
        const from = angle(css);
        if (operation === "stop") css.stopAnimation(); else css.startAnimation();
        seek(css, 0);
        check(Math.abs(angle(css) - from) < 0.001, label + ": " + operation + " continuity at " + time);
        if (operation === "stop") {
          check(animations(css)[0]?.effect?.getTiming().duration === 200, label + ": return duration");
          for (const elapsed of [31, 83, 125, 199]) {
            seek(css, elapsed);
            const error = Math.abs(angle(css) - from * (1 - easeOut(elapsed / 200)));
            maxReturnError = Math.max(maxReturnError, error);
            check(error < 0.003, label + ": return at " + elapsed);
          }
        }
      }
      for (const operation of ["stop", "replay"] as const) {
        reset(); css.startAnimation(); seek(css, 83); css.stopAnimation(); seek(css, 31);
        const from = angle(css);
        if (operation === "stop") css.stopAnimation(); else css.startAnimation();
        seek(css, 0);
        check(Math.abs(angle(css) - from) < 0.001, label + ": " + operation + " during return");
      }
      reset(); css.startAnimation(); animations(css).forEach(animation => animation.finish());
      css.startAnimation(); seek(css, 83); await settle();
      check(animations(css).length === 1 && Math.abs(angle(css)) > 0.1, label + ": stale finish does not clear replay");
      css.stopAnimation(); animations(css).forEach(animation => animation.finish()); await settle();
      check(animations(css).length === 0 && path(css).style.transform === "" && !css.hasAttribute("data-cycle-state"), label + ": completed return clears");
      css.startAnimation(); seek(css, 83); reconnect(css);
      check(animations(css).length === 0 && path(css).style.transform === "", label + ": disconnect clears");
      const clone = css.cloneNode(true) as Handle;
      row.append(clone); clone.startAnimation();
      check(animations(clone).length === 1, label + ": cloned drawing starts");
      clone.remove(); reset();
    }
    const parent = document.querySelector<HTMLElement>("[data-parent]")!;
    const icon = parent.querySelector<Handle>("grave-folder")!;
    const nativeMatchMedia = window.matchMedia;
    const preference = new EventTarget() as MediaQueryList;
    let reduced = false;
    Object.defineProperty(preference, "matches", { get: () => reduced });
    try {
      window.matchMedia = query => query === "(prefers-reduced-motion: reduce)" ? preference : nativeMatchMedia.call(window, query);
      reconnect(icon);
      parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }));
      check(animations(icon).length === 0, "touch ignored");
      parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
      check(animations(icon).length === 1, "parent hover starts");
      reconnect(icon); parent.setAttribute("aria-disabled", "true");
      parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
      check(animations(icon).length === 0, "disabled ignored");
      parent.removeAttribute("aria-disabled"); icon.dataset.controlled = "";
      parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
      check(animations(icon).length === 0, "controlled hover ignored");
      check(icon.startAnimation() === undefined && animations(icon).length === 1, "manual start returns void");
      check(icon.stopAnimation() === undefined, "manual stop returns void");
      reduced = true; preference.dispatchEvent(new Event("change"));
      check(animations(icon).length === 0 && path(icon).style.transform === "", "preference change clears");
      icon.startAnimation(); check(animations(icon).length === 0, "reduced manual stays static");
      reduced = false; preference.dispatchEvent(new Event("change"));
      icon.startAnimation(); check(animations(icon).length === 1, "playback restored");
    } finally {
      window.matchMedia = nativeMatchMedia; delete icon.dataset.controlled;
      parent.removeAttribute("aria-disabled"); reconnect(icon);
    }
    check(document.querySelectorAll('style[data-grave-cycle-style="folder"]').length === 1, "one active stylesheet");
  } catch (error) {
    failures.push(String(error));
  } finally {
    icons(document).forEach(reconnect);
    output.textContent = JSON.stringify({ assertions, snapshots, maxEntryError, maxReturnError, failures }, null, 2);
    button.disabled = false;
  }
});
document.body.dataset.folderReady = "true";
