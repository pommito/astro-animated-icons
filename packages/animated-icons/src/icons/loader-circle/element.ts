import { createIconElement, type IconHandle } from "../../element";
import { loaderCircleRecipe } from "./definition";

export type LoaderCircleIconHandle = IconHandle;

const LoaderCircleElement = createIconElement(loaderCircleRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-loader-circle": InstanceType<typeof LoaderCircleElement>;
  }
}

if (!customElements.get("grave-loader-circle")) {
  customElements.define("grave-loader-circle", LoaderCircleElement);
}
