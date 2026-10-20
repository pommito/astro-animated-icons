import { createIconElement, type IconHandle } from "../../element";
import { treeDeciduousRecipe } from "./definition";

export type TreeDeciduousIconHandle = IconHandle;
const TreeDeciduousElement = createIconElement(treeDeciduousRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-tree-deciduous": InstanceType<typeof TreeDeciduousElement>;
  }
}

if (!customElements.get("grave-tree-deciduous")) {
  customElements.define("grave-tree-deciduous", TreeDeciduousElement);
}
