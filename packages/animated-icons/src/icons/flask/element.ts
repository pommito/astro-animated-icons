import { createIconElement, type IconHandle } from "../../element";
import { flaskRecipe } from "./definition";

export type FlaskIconHandle = IconHandle;
const FlaskElement = createIconElement(flaskRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-flask": InstanceType<typeof FlaskElement>;
  }
}

if (!customElements.get("grave-flask")) {
  customElements.define("grave-flask", FlaskElement);
}
