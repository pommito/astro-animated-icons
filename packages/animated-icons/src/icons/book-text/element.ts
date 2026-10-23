import { createIconElement, type IconHandle } from "../../element";
import { bookTextRecipe } from "./definition";

export type BookTextIconHandle = IconHandle;

const BookTextElement = createIconElement(bookTextRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-book-text": InstanceType<typeof BookTextElement>;
  }
}

if (!customElements.get("grave-book-text")) {
  customElements.define("grave-book-text", BookTextElement);
}
