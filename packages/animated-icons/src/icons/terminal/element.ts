import { createIconElement, type IconHandle } from "../../element";
import { terminalRecipe } from "./definition";

export type TerminalIconHandle = IconHandle;

const TerminalElement = createIconElement(terminalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-terminal": InstanceType<typeof TerminalElement>;
  }
}

if (!customElements.get("grave-terminal")) {
  customElements.define("grave-terminal", TerminalElement);
}
