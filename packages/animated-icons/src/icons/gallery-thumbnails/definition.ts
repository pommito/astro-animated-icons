import { createShapeTransformRecipe } from "../../shared/shape-transform";

export const galleryThumbnailsRecipe = createShapeTransformRecipe(
  [1, 2, 3, 4].map(child => ({ child, targets: { opacity: [0, 1] }, transition: { delay: child * 0.15, duration: 0.2 }, returning: { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] } })),
);
