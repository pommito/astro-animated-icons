import { createIconElement, type IconHandle } from "../../element";
import { bookmarkXRecipe } from "./definition";

export type BookmarkXIconHandle = IconHandle;

const BookmarkXElement = createIconElement(bookmarkXRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bookmark-x": InstanceType<typeof BookmarkXElement>;
  }
}

if (!customElements.get("grave-bookmark-x")) {
  customElements.define("grave-bookmark-x", BookmarkXElement);
}
