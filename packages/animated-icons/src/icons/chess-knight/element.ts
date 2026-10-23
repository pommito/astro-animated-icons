import { createIconElement, type IconHandle } from "../../element";
import { chessKnightRecipe } from "./definition";

export type ChessKnightIconHandle = IconHandle;

const ChessKnightElement = createIconElement(chessKnightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chess-knight": InstanceType<typeof ChessKnightElement>;
  }
}

if (!customElements.get("grave-chess-knight")) {
  customElements.define("grave-chess-knight", ChessKnightElement);
}
