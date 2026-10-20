import { createVehicleRecipe } from "../../shared/vehicle";

export const truckRecipe = createVehicleRecipe({
  body: [0, -1, 0, -0.5, 0], duration: 0.4, speedDuration: 0.5,
  wheel: {
    targets: { rotate: 360 },
    transition: { duration: 0.5, ease: "linear", repeat: Infinity },
    returnTransition: { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  },
});
