import { createIconElement, type IconHandle } from "../../element";
import { bookmarkMinusRecipe } from "./definition";

export type BookmarkMinusIconHandle = IconHandle;

const BookmarkMinusElement = createIconElement(bookmarkMinusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bookmark-minus": InstanceType<typeof BookmarkMinusElement>;
  }
}

if (!customElements.get("grave-bookmark-minus")) {
  customElements.define("grave-bookmark-minus", BookmarkMinusElement);
}
