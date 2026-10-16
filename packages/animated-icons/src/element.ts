export interface IconHandle {
  startAnimation(): void;
  stopAnimation(): void;
}

export interface IconAnimation {
  stop(): void;
  cancel(): void;
}

export type IconTrack = (start: (onComplete: () => void) => IconAnimation) => IconAnimation;

export interface IconRecipe {
  finish: "hold" | "restore";
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack): void;
  clear(drawing: SVGGElement): void;
}

export function createIconElement(recipe: IconRecipe) {
  return class AnimatedIconElement extends HTMLElement implements IconHandle {
    private listeners?: AbortController;
    private animation?: IconAnimation[];
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
      const controls: IconAnimation[] = [];
      this.animation = controls;
      let remaining = 0;
      let ready = false;
      const finish = () => {
        if (ready && remaining === 0 && (returning || recipe.finish === "restore")) {
          this.clearDrawing();
          this.animation = undefined;
        }
      };
      const track: IconTrack = (start) => {
        remaining++;
        let completed = false;
        const control = start(() => {
          if (playbackId !== this.playbackId) {
            // A queued Motion finish event can commit styles after cancellation.
            if (!this.animation) this.clearDrawing();
            return;
          }
          if (!completed) {
            completed = true;
            remaining--;
            finish();
          }
        });
        controls.push(control);
        return control;
      };
      recipe.animate(drawing, returning, track);
      ready = true;
      finish();
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
