import { createIconElement } from "../../../../../packages/animated-icons/src/element";
import { createSvgPartsRecipe } from "../../../../../packages/animated-icons/src/shared/svg-parts";
import { folderCycle } from "../../../../../packages/animated-icons/src/icons/folder/cycle";

const recipe = createSvgPartsRecipe([{
  selector: folderCycle.target,
  variants: {
    normal: { rotate: 0, transition: { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } },
    animate: { rotate: folderCycle.values, transition: { duration: folderCycle.duration, ease: folderCycle.ease, times: folderCycle.times } },
  },
}]);

if (!customElements.get("grave-reference-folder")) {
  customElements.define("grave-reference-folder", createIconElement(recipe));
}
