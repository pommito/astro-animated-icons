import { createIconElement, type IconHandle } from "../../element";
import { rabbitRecipe } from "./definition";

export type RabbitIconHandle = IconHandle;
const RabbitElement = createIconElement(rabbitRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-rabbit": InstanceType<typeof RabbitElement>;
  }
}

if (!customElements.get("grave-rabbit")) {
  customElements.define("grave-rabbit", RabbitElement);
}
