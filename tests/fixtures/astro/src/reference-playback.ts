import { AsyncMotionValueAnimation, JSAnimation, visualElementStore } from "motion";

interface SampleOptions {
  complete?: boolean;
  resetVelocity?: boolean;
}

export function sampleReference(element: Element, milliseconds: number, { complete, resetVelocity }: SampleOptions = {}) {
  const visual = visualElementStore.get(element);
  visual?.values.forEach((value) => {
    if (value.animation instanceof AsyncMotionValueAnimation) {
      const animation = value.animation;
      animation.pause();
      animation.time = milliseconds / 1000;
      // JS seeks schedule a frame; comparison controls need the pose synchronously.
      if (animation.animation instanceof JSAnimation) animation.animation.sample(milliseconds);
      // Early spring completion would otherwise carry transient velocity into the next phase.
      if (resetVelocity) value.jump(value.get(), false);
      if (complete) animation.complete();
    }
  });
  visual?.render();
}

export function captureReferencePose(element: Element) {
  const visual = visualElementStore.get(element);
  visual?.values.forEach((value, name) => {
    // Upstream native stop samples wall time; preserve the seeked opacity for measured returns.
    const current = name === "opacity" ? Number(getComputedStyle(element).opacity) : value.get();
    value.stop();
    value.jump(current);
  });
  visual?.render();
}
