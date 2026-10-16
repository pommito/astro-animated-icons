import { animate } from "motion/mini";
import type { IconTrack } from "../element";

type RevealOptions = NonNullable<Parameters<typeof animate>[2]> & {
  opacityDuration: number;
  opacityDelay?: number;
  opacityEase?: NonNullable<Parameters<typeof animate>[2]>["ease"];
  pathOffset?: boolean;
};

export function animatePathReveal(
  path: SVGGeometryElement,
  returning: boolean,
  track: IconTrack,
  options: RevealOptions,
) {
  const length = path.getTotalLength();
  const fullPath = `${length}px ${length}px`;
  const { opacityDuration, opacityDelay, opacityEase, pathOffset, ...transition } = options;

  track((onComplete) =>
    animate(
      path,
      { opacity: returning ? 1 : [0, 1] },
      {
        ...transition,
        duration: opacityDuration,
        ...(opacityDelay === undefined ? {} : { delay: opacityDelay }),
        ...(opacityEase === undefined ? {} : { ease: opacityEase }),
        onComplete,
      },
    ),
  );
  track((onComplete) =>
    animate(
      path,
      { strokeDasharray: returning ? fullPath : [`0px ${length}px`, fullPath] },
      { ...transition, onComplete },
    ),
  );
  if (pathOffset)
    track((onComplete) =>
      animate(path, { strokeDashoffset: returning ? "0px" : [`${-length}px`, "0px"] }, { ...transition, onComplete }),
    );
}

export function clearPathReveal(path: SVGGeometryElement) {
  path.style.removeProperty("opacity");
  path.style.removeProperty("stroke-dasharray");
  path.style.removeProperty("stroke-dashoffset");
}
