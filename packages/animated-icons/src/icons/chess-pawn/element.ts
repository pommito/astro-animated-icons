import { createIconElement, type IconHandle } from "../../element";
import { chessPawnRecipe } from "./definition";

export type ChessPawnIconHandle = IconHandle;

const ChessPawnElement = createIconElement(chessPawnRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chess-pawn": InstanceType<typeof ChessPawnElement>;
  }
}

if (!customElements.get("grave-chess-pawn")) {
  customElements.define("grave-chess-pawn", ChessPawnElement);
}
