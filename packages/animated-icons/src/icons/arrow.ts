import { animate } from "motion/mini";

const playbackDuration = 0.4;
const returnDuration = 0.12;

interface ArrowReturnOptions {
  head(head: SVGPathElement, onComplete: () => void): ReturnType<typeof animate>;
  shaftDuration: number;
  shaftEase: [number, number, number, number];
}

export function createArrowRecipe(axis: "X" | "Y", headTravel: number, shaftRetraction: number, returningOptions?: ArrowReturnOptions) {
  return {
    animate(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
      const paths = drawing.querySelectorAll("path");
      const [head, shaft] = paths;
      const shaftLength = shaft.getTotalLength();
      const fullShaft = `${shaftLength}px ${shaftLength}px`;
      const retractedShaft = `${shaftLength - shaftRetraction}px ${shaftLength}px`;
      shaft.style.strokeDasharray ||= fullShaft;
      let remaining = paths.length;
      const options = {
        duration: returning ? returnDuration : playbackDuration,
        ease: "easeInOut" as const,
        onComplete: () => {
          onComplete(--remaining === 0);
        },
      };
      const rest = `translate${axis}(0px)`;
      const headAnimation = returning && returningOptions
        ? returningOptions.head(head, options.onComplete)
        : animate(head, { transform: returning ? rest : [null, `translate${axis}(${headTravel}px)`, rest] }, options);
      const shaftOptions = returning && returningOptions
        ? { ...options, duration: returningOptions.shaftDuration, ease: returningOptions.shaftEase }
        : options;
      return [
        headAnimation,
        animate(shaft, { strokeDasharray: returning ? fullShaft : [null, retractedShaft, fullShaft] }, shaftOptions),
      ];
    },
    clear(drawing: SVGGElement) {
      drawing.querySelectorAll("path").forEach((path) => {
        path.style.removeProperty("transform");
        path.style.removeProperty("stroke-dasharray");
      });
    },
  };
}
