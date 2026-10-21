import { createIconElement, type IconHandle } from "../../element";
import { treePineRecipe } from "./definition";

export type TreePineIconHandle = IconHandle;
const TreePineElement = createIconElement(treePineRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-tree-pine": InstanceType<typeof TreePineElement>;
  }
}

if (!customElements.get("grave-tree-pine")) {
  customElements.define("grave-tree-pine", TreePineElement);
}
