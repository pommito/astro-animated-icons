import { createIconElement, type IconHandle } from "../../element";
import { plugZapRecipe } from "./definition";

export type PlugZapIconHandle = IconHandle;

const PlugZapElement = createIconElement(plugZapRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-plug-zap": InstanceType<typeof PlugZapElement>;
  }
}

if (!customElements.get("grave-plug-zap")) {
  customElements.define("grave-plug-zap", PlugZapElement);
}
