import { createIconElement, type IconHandle } from "../../element";
import { zapRecipe } from "./definition";

export type ZapIconHandle = IconHandle;

const ZapElement = createIconElement(zapRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-zap": InstanceType<typeof ZapElement>;
  }
}

if (!customElements.get("grave-zap")) {
  customElements.define("grave-zap", ZapElement);
}
