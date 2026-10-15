export interface IconHandle {
  startAnimation(): void;
  stopAnimation(): void;
}

interface IconRecipe {
  animate(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void): { stop(): void; cancel(): void }[];
  clear(drawing: SVGGElement): void;
}

export function createIconElement(recipe: IconRecipe) {
  return class AnimatedIconElement extends HTMLElement implements IconHandle {
    private listeners?: AbortController;
    private animation?: ReturnType<IconRecipe["animate"]>;
    private playbackId = 0;

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

      const playbackId = ++this.playbackId;
      this.animation?.forEach((animation) => {
        animation.stop();
        animation.cancel();
      });
      this.animation = recipe.animate(drawing, returning, (restoreDrawing) => {
        if (playbackId !== this.playbackId) {
          // A queued Motion finish event can commit styles after cancellation.
          if (!this.animation) this.clearDrawing();
          return;
        }
        if (restoreDrawing) {
          this.clearDrawing();
          this.animation = undefined;
        }
      });
    }

    private reset() {
      this.playbackId++;
      this.animation?.forEach((animation) => animation.cancel());
      this.animation = undefined;
      this.clearDrawing();
    }

    private clearDrawing() {
      const drawing = this.querySelector("g");
      if (drawing) recipe.clear(drawing);
    }
  };
}
