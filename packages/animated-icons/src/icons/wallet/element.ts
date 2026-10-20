import { createIconElement, type IconHandle } from "../../element";
import { walletRecipe } from "./definition";

export type WalletIconHandle = IconHandle;

const WalletElement = createIconElement(walletRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wallet": InstanceType<typeof WalletElement>;
  }
}

if (!customElements.get("grave-wallet")) {
  customElements.define("grave-wallet", WalletElement);
}
