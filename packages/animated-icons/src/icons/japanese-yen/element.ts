import { createIconElement, type IconHandle } from "../../element";
import { japaneseYenRecipe } from "./definition";

export type JapaneseYenIconHandle = IconHandle;

const JapaneseYenElement = createIconElement(japaneseYenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-japanese-yen": InstanceType<typeof JapaneseYenElement>;
  }
}

if (!customElements.get("grave-japanese-yen")) {
  customElements.define("grave-japanese-yen", JapaneseYenElement);
}
