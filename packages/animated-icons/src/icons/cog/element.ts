import { createIconElement, type IconHandle } from "../../element";
import { cogRecipe } from "./definition";

export type CogIconHandle = IconHandle;

const CogElement = createIconElement(cogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cog": InstanceType<typeof CogElement>;
  }
}

if (!customElements.get("grave-cog")) {
  customElements.define("grave-cog", CogElement);
}
