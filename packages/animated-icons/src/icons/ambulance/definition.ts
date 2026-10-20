import { createVehicleRecipe } from "../../shared/vehicle";
import { createSvgPartsRecipe } from "../../shared/svg-parts";

const vehicle = createVehicleRecipe({
  body: [0, -1, 0, -0.5, 0], duration: 0.4, speedDuration: 0.5,
  wheel: {
    targets: { rotate: 360 },
    transition: { duration: 0.5, ease: "linear", repeat: Infinity },
    returnTransition: { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  },
});
const cross = createSvgPartsRecipe([{
  selector: "[data-cross]",
  variants: {
    normal: { opacity: 1 },
    animate: { opacity: [1, 0.3, 1], transition: { duration: 0.6, ease: "easeInOut", repeat: Infinity } },
  },
}]);

export const ambulanceRecipe = {
  ...vehicle,
  animate(...args: Parameters<typeof vehicle.animate>) { vehicle.animate(...args); cross.animate(...args); },
  clear(...args: Parameters<typeof vehicle.clear>) { vehicle.clear(...args); cross.clear(...args); },
};
