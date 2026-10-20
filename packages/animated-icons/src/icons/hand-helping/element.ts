import { createIconElement, type IconHandle } from "../../element";
import { handHelpingRecipe } from "./definition";

export type HandHelpingIconHandle = IconHandle;
const HandHelpingElement = createIconElement(handHelpingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hand-helping": InstanceType<typeof HandHelpingElement>;
  }
}

if (!customElements.get("grave-hand-helping")) {
  customElements.define("grave-hand-helping", HandHelpingElement);
}
