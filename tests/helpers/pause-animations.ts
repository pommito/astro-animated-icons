import type { Locator } from "@playwright/test";

export async function pauseAnimationsOnPointer(control: Locator, type: "pointerenter" | "pointerleave" = "pointerenter") {
  await control.evaluate((element, type) => {
    element.addEventListener(type, () => {
      element.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
    });
  }, type);
}
