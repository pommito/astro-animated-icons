import { createIconElement, type IconHandle } from "../../element";
import { bookmarkRecipe } from "./definition";

export type BookmarkIconHandle = IconHandle;

const BookmarkElement = createIconElement(bookmarkRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bookmark": InstanceType<typeof BookmarkElement>;
  }
}

if (!customElements.get("grave-bookmark")) {
  customElements.define("grave-bookmark", BookmarkElement);
}
