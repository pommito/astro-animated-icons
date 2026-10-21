import { createIconElement, type IconHandle } from "../../element";
import { loaderRecipe } from "./definition";

export type LoaderIconHandle = IconHandle;

const LoaderElement = createIconElement(loaderRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-loader": InstanceType<typeof LoaderElement>;
  }
}

if (!customElements.get("grave-loader")) {
  customElements.define("grave-loader", LoaderElement);
}
