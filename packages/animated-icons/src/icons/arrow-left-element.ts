import { animateArrowLeft } from "./arrow-left";

class ArrowLeftElement extends HTMLElement {
  private listeners?: AbortController;
  private animation?: ReturnType<typeof animateArrowLeft>;

  connectedCallback() {
    const control = this.closest("a[href], button");
    if (!control) return;

    this.listeners = new AbortController();
    const options = { signal: this.listeners.signal };
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    control.addEventListener("pointerenter", (event) => {
      if (
        (event as PointerEvent).pointerType === "touch" ||
        !matchMedia("(hover: hover) and (pointer: fine)").matches ||
        reducedMotion.matches ||
        control.matches(":disabled, [aria-disabled='true']")
      ) return;
      this.play(false);
    }, options);

    control.addEventListener("pointerleave", () => {
      if (this.animation) this.play(true);
    }, options);

    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) this.reset();
    }, options);
  }

  disconnectedCallback() {
    this.listeners?.abort();
    this.listeners = undefined;
    this.reset();
  }

  private play(returning: boolean) {
    const drawing = this.querySelector("g");
    if (!drawing) return;

    this.animation = animateArrowLeft(drawing, returning, () => {
      drawing.querySelectorAll("path").forEach((path) => path.style.removeProperty("transform"));
      this.animation = undefined;
    });
  }

  private reset() {
    this.animation?.forEach((animation) => animation.cancel());
    this.animation = undefined;
    this.querySelectorAll("path").forEach((path) => path.style.removeProperty("transform"));
  }
}

if (!customElements.get("grave-arrow-left")) {
  customElements.define("grave-arrow-left", ArrowLeftElement);
}
