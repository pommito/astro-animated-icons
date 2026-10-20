import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const sunMediumRecipe = createStaggeredRevealRecipe(
  Array.from({ length: 8 }, (_, index) => ({
    child: index + 2,
    delay: (index + 1) * 0.1,
    opacityOnly: true, preservePose: "until-clear" as const,
    opacityEase: "easeOut" as const,
  })),
  "restore",
);
