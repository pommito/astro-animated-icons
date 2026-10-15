import { animateArrowLeft } from "./definition";

export interface ArrowLeftIconHandle {
  startAnimation(): void;
  stopAnimation(): void;
}

class ArrowLeftElement extends HTMLElement implements ArrowLeftIconHandle {
  private listeners?: AbortController;
  private animation?: ReturnType<typeof animateArrowLeft>;

  connectedCallback() {
    const control = this.closest("a[href], button") ?? this;

    this.listeners = new AbortController();
    const options = { signal: this.listeners.signal };
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    control.addEventListener("pointerenter", (event) => {
      if (
        (event as PointerEvent).pointerType === "touch" ||
        this.hasAttribute("data-controlled") ||
        reducedMotion.matches ||
        control.matches(":disabled, [aria-disabled='true']")
      ) return;
      this.startAnimation();
    }, options);

    control.addEventListener("pointerleave", () => {
      if (!this.hasAttribute("data-controlled")) this.stopAnimation();
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

  startAnimation() {
    if (!this.isConnected || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    this.play(false);
  }

  stopAnimation() {
    if (this.animation) this.play(true);
  }

  private play(returning: boolean) {
    const drawing = this.querySelector("g");
    if (!drawing) return;

    this.animation = animateArrowLeft(drawing, returning, () => {
      this.clearDrawing();
      this.animation = undefined;
    });
  }

  private reset() {
    this.animation?.forEach((animation) => animation.cancel());
    this.animation = undefined;
    this.clearDrawing();
  }

  private clearDrawing() {
    this.querySelectorAll("path").forEach((path) => {
      path.style.removeProperty("transform");
      path.style.removeProperty("stroke-dasharray");
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-left": ArrowLeftElement;
  }
}

if (!customElements.get("grave-arrow-left")) {
  customElements.define("grave-arrow-left", ArrowLeftElement);
}
