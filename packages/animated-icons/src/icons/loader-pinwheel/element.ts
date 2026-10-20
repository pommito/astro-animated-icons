import { createIconElement, type IconHandle } from "../../element";
import { loaderPinwheelRecipe } from "./definition";

export type LoaderPinwheelIconHandle = IconHandle;

const LoaderPinwheelElement = createIconElement(loaderPinwheelRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-loader-pinwheel": InstanceType<typeof LoaderPinwheelElement>;
  }
}

if (!customElements.get("grave-loader-pinwheel")) {
  customElements.define("grave-loader-pinwheel", LoaderPinwheelElement);
}
