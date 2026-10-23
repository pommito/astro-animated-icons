import { createIconElement, type IconHandle } from "../../element";
import { sparklesRecipe } from "./definition";

export type SparklesIconHandle = IconHandle;
const SparklesElement = createIconElement(sparklesRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-sparkles": InstanceType<typeof SparklesElement>;
  }
}

if (!customElements.get("grave-sparkles")) {
  customElements.define("grave-sparkles", SparklesElement);
}
