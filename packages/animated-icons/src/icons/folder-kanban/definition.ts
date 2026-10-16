import type { IconRecipe, IconTrack } from "../../element";
import { animate } from "motion/mini";

function animateFolderKanban(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  track((onComplete) =>
    animate(
      drawing.querySelector<SVGElement>('[data-motion="0"]')!,
      { opacity: returning ? 1 : [1, 0.2, 1] },
      {
        ...(returning
          ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 }
          : { ease: "easeInOut", duration: 1, repeat: Infinity }),
        onComplete,
      },
    ),
  );
  track((onComplete) =>
    animate(
      drawing.querySelector<SVGElement>('[data-motion="1"]')!,
      { opacity: returning ? 1 : [1, 0.2, 1] },
      {
        ...(returning
          ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 }
          : { ease: "easeInOut", duration: 1, repeat: Infinity, delay: 0.2 }),
        onComplete,
      },
    ),
  );
  track((onComplete) =>
    animate(
      drawing.querySelector<SVGElement>('[data-motion="2"]')!,
      { opacity: returning ? 1 : [1, 0.2, 1] },
      {
        ...(returning
          ? { ease: [0.25, 0.1, 0.35, 1], duration: 0.3 }
          : { ease: "easeInOut", duration: 1, repeat: Infinity, delay: 0.4 }),
        onComplete,
      },
    ),
  );
}

export const folderKanbanRecipe = {
  finish: "hold",
  animate: animateFolderKanban,
  clear(drawing) {
    drawing.querySelector<SVGElement>('[data-motion="0"]')!.style.removeProperty("opacity");
    drawing.querySelector<SVGElement>('[data-motion="1"]')!.style.removeProperty("opacity");
    drawing.querySelector<SVGElement>('[data-motion="2"]')!.style.removeProperty("opacity");
  },
} satisfies IconRecipe;
