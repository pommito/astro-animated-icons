import { createSvgPartsRecipe } from "./svg-parts";

export function createSquareArrowRecipe({ axis, distance, shaft }: {
  axis: "y" | "translateX";
  distance: number;
  shaft: [string, string, string];
}) {
  return createSvgPartsRecipe([
    {
      selector: "[data-part=head]",
      variants: {
        normal: { [axis]: 0, opacity: 1 },
        animate: { [axis]: [0, distance, 0], transition: { duration: 0.4 } },
      },
    },
    {
      selector: "[data-part=shaft]",
      variants: {
        normal: { d: shaft[0], opacity: 1 },
        animate: { d: shaft, transition: { duration: 0.4 } },
      },
    },
  ]);
}
