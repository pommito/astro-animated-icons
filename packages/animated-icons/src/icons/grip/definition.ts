import { createGripRecipe } from "../../shared/grip";

export const gripRecipe = createGripRecipe({
  opacity: [1, 0.3, 0.3, 1],
  duration: 1.1,
  times: [0, 0.2, 0.8, 1],
  ease: "easeOut",
  delay: (index) => index * 0.07,
});
