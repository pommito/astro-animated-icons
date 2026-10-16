import type { IconRecipe, IconTrack } from "../../element";
import { animate } from "motion/mini";

function animateFolderRoot(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  track((onComplete) =>
    animate(
      drawing.querySelector<SVGElement>('[data-motion="0"]')!,
      { opacity: returning ? 0.6 : [0.6, 1, 0.3, 0.6] },
      {
        ...(returning
          ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 }
          : { ease: "easeInOut", duration: 0.8, repeat: Infinity }),
        onComplete,
      },
    ),
  );
  track((onComplete) =>
    animate(
      drawing.querySelector<SVGElement>('[data-motion="1"]')!,
      { opacity: returning ? 0.6 : [0.6, 1, 0.3, 0.6] },
      {
        ...(returning
          ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 }
          : { ease: "easeInOut", duration: 0.8, repeat: Infinity }),
        onComplete,
      },
    ),
  );
}

export const folderRootRecipe = {
  finish: "hold",
  animate: animateFolderRoot,
  clear(drawing) {
    drawing.querySelector<SVGElement>('[data-motion="0"]')!.style.removeProperty("opacity");
    drawing.querySelector<SVGElement>('[data-motion="1"]')!.style.removeProperty("opacity");
  },
} satisfies IconRecipe;
