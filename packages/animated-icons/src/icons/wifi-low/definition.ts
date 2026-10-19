import { easeOut, spring } from "motion";
import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { createSignalRecipe } from "../../shared/signal";

const signal = createSignalRecipe([{ child: 2, delay: 0.1 }], 0.2, true);

export const wifiLowRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    signal.animate(drawing, returning, track);
    const question = drawing.querySelector<SVGTextElement>("text")!;
    const style = getComputedStyle(question);
    const opacity = Number(style.opacity);
    const scale = new DOMMatrix(style.transform).a;
    if (returning) {
      track(onComplete => animate(question, { opacity: 0, transform: [`scale(${scale})`, "scale(0)"] }, { duration: 0.15, ease: "easeOut", onComplete }));
      return;
    }
    const opacitySpring = spring({ keyframes: [opacity, 1], stiffness: 400, damping: 18 });
    const scaleSpring = spring({ keyframes: [scale, 1], stiffness: 400, damping: 18 });
    const value = (time: number, generator: ReturnType<typeof spring>, initial: number) => {
      if (time < 300) return initial;
      if (time < 1700) return generator.next(time - 300).value;
      return 1 - easeOut((time - 1700) / 150);
    };
    const times = Array.from({ length: 371 }, (_, index) => index * 5);
    track(onComplete => animate(question, {
      opacity: times.map(time => value(time, opacitySpring, opacity)),
      transform: times.map(time => `scale(${value(time, scaleSpring, scale)})`),
    }, { duration: 1.85, ease: "linear", onComplete }));
  },
  clear(drawing) {
    signal.clear(drawing);
    const question = drawing.querySelector<SVGTextElement>("text")!;
    question.style.removeProperty("opacity");
    question.style.transform = "scale(0)";
  },
} satisfies IconRecipe;
