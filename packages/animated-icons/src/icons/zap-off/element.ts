import { createIconElement, type IconHandle } from "../../element";
import { zapOffRecipe } from "./definition";

export type ZapOffIconHandle = IconHandle;

const ZapOffElement = createIconElement(zapOffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-zap-off": InstanceType<typeof ZapOffElement>;
  }
}

if (!customElements.get("grave-zap-off")) {
  customElements.define("grave-zap-off", ZapOffElement);
}
