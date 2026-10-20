import { createVehicleRecipe } from "../../shared/vehicle";

export const carRecipe = createVehicleRecipe({
  body: [0, -0.6, 0, -0.4, 0], duration: 0.7, speedDuration: 0.6,
  wheel: {
    targets: { scaleX: [1, 1.12, 1, 1.06, 1], scaleY: [1, 0.9, 1, 0.95, 1] },
    transition: { duration: 0.6, ease: "easeInOut", repeat: Infinity },
    returnTransition: { duration: 0.2, ease: "easeOut" },
  },
});
