import { createIconElement, type IconHandle } from "../../element";
import { chessKingRecipe } from "./definition";

export type ChessKingIconHandle = IconHandle;

const ChessKingElement = createIconElement(chessKingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chess-king": InstanceType<typeof ChessKingElement>;
  }
}

if (!customElements.get("grave-chess-king")) {
  customElements.define("grave-chess-king", ChessKingElement);
}
