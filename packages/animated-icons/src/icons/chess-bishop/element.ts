import { createIconElement, type IconHandle } from "../../element";
import { chessBishopRecipe } from "./definition";

export type ChessBishopIconHandle = IconHandle;

const ChessBishopElement = createIconElement(chessBishopRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chess-bishop": InstanceType<typeof ChessBishopElement>;
  }
}

if (!customElements.get("grave-chess-bishop")) {
  customElements.define("grave-chess-bishop", ChessBishopElement);
}
