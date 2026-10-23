import type { IconHandle } from "../../../../packages/animated-icons/src/element";

type Handle = HTMLElement & IconHandle;
const animations = (icon: HTMLElement) => icon.getAnimations({ subtree: true });

export function checkSyntheticLifecycle(parent: HTMLElement, count = 1) {
  const nativeMatchMedia = window.matchMedia;
  const results: Record<string, boolean> = {};
  let reduced = false;
  const preference = new EventTarget() as MediaQueryList;
  Object.defineProperty(preference, "matches", { get: () => reduced });
  const icon = parent.querySelector<Handle>("[data-css-cycle], [data-css-opacity]")!;
  const clean = () => { const parent = icon.parentElement!; icon.remove(); parent.append(icon); };
  try {
    window.matchMedia = query => query === "(prefers-reduced-motion: reduce)" ? preference : nativeMatchMedia.call(window, query);
    clean();
    parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }));
    results.touchIgnored = animations(icon).length === 0;
    parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    results.parentMouseStarts = animations(icon).length === count;
    clean(); results.disconnectCancels = animations(icon).length === 0;
    parent.setAttribute("aria-disabled", "true");
    parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    results.disabledIgnored = animations(icon).length === 0;
    parent.removeAttribute("aria-disabled");
    icon.dataset.controlled = "";
    parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    results.controlledIgnored = animations(icon).length === 0;
    results.startReturnsVoid = icon.startAnimation() === undefined;
    results.manualStarts = animations(icon).length === count;
    results.stopReturnsVoid = icon.stopAnimation() === undefined;
    reduced = true; preference.dispatchEvent(new Event("change"));
    results.preferenceChangeClears = animations(icon).length === 0 && !icon.hasAttribute("data-cycle-state") && !icon.hasAttribute("data-opacity-state");
    icon.startAnimation(); results.reducedManualStatic = animations(icon).length === 0;
    reduced = false; preference.dispatchEvent(new Event("change"));
    icon.startAnimation(); results.replayAfterPreference = animations(icon).length === count;
    clean(); delete icon.dataset.controlled;
    const other = document.createElement("button");
    document.body.append(other); icon.remove(); other.append(icon);
    parent.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    results.oldParentDetached = animations(icon).length === 0;
    other.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    results.newParentAttached = animations(icon).length === count;
    icon.remove(); parent.append(icon); other.remove();
    const template = document.createElement("template");
    template.content.append(icon.cloneNode(true));
    parent.append(template.content.cloneNode(true));
    const clone = parent.lastElementChild as Handle;
    clone.startAnimation(); results.templateCloneStarts = animations(clone).length === count;
    clone.remove();
  } finally {
    window.matchMedia = nativeMatchMedia;
    parent.removeAttribute("aria-disabled");
    delete icon.dataset.controlled;
    clean();
  }
  return results;
}
