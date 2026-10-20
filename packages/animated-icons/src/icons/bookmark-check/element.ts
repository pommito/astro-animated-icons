import { createIconElement, type IconHandle } from "../../element";
import { bookmarkCheckRecipe } from "./definition";

export type BookmarkCheckIconHandle = IconHandle;

const BookmarkCheckElement = createIconElement(bookmarkCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bookmark-check": InstanceType<typeof BookmarkCheckElement>;
  }
}

if (!customElements.get("grave-bookmark-check")) {
  customElements.define("grave-bookmark-check", BookmarkCheckElement);
}
