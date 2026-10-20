import { createIconElement, type IconHandle } from "../../element";
import { poundSterlingRecipe } from "./definition";

export type PoundSterlingIconHandle = IconHandle;

const PoundSterlingElement = createIconElement(poundSterlingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-pound-sterling": InstanceType<typeof PoundSterlingElement>;
  }
}

if (!customElements.get("grave-pound-sterling")) {
  customElements.define("grave-pound-sterling", PoundSterlingElement);
}
