import { createIconElement } from "../../element";
import { historyRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type HistoryIconHandle = IconHandle;

const HistoryElement = createIconElement(historyRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-history": InstanceType<typeof HistoryElement>;
  }
}

if (!customElements.get("grave-history")) {
  customElements.define("grave-history", HistoryElement);
}
