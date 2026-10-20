import { createIconElement, type IconHandle } from "../../element";
import { bookmarkPlusRecipe } from "./definition";

export type BookmarkPlusIconHandle = IconHandle;

const BookmarkPlusElement = createIconElement(bookmarkPlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bookmark-plus": InstanceType<typeof BookmarkPlusElement>;
  }
}

if (!customElements.get("grave-bookmark-plus")) {
  customElements.define("grave-bookmark-plus", BookmarkPlusElement);
}
