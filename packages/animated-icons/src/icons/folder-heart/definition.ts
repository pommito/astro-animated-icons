import type { IconRecipe, IconTrack } from "../../element";
import { animate } from "motion/mini";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

function animateFolderHeart(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(
    drawing.querySelector<SVGElement>('[data-motion="0"]')!,
    returning,
    track,
    { scale: [1, 1.12, 1.04, 1.12, 1] },
    returning
      ? { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 }
      : { ease: "easeInOut", duration: 0.8, repeat: Infinity },
  );
  track((onComplete) =>
    animate(
      drawing.querySelector<SVGElement>('[data-motion="0"]')!,
      { opacity: returning ? 0.9 : [0.9, 1, 0.85, 1, 0.9] },
      {
        ...(returning
          ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 }
          : { ease: "easeInOut", duration: 0.8, repeat: Infinity }),
        onComplete,
      },
    ),
  );
}

export const folderHeartRecipe = {
  finish: "hold",
  animate: animateFolderHeart,
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
    drawing.querySelector<SVGElement>('[data-motion="0"]')!.style.removeProperty("opacity");
  },
} satisfies IconRecipe;
