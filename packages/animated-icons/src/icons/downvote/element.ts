import { createIconElement, type IconHandle } from "../../element";
import { downvoteRecipe } from "./definition";

export type DownvoteIconHandle = IconHandle;

const DownvoteElement = createIconElement(downvoteRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-downvote": InstanceType<typeof DownvoteElement>;
  }
}

if (!customElements.get("grave-downvote")) {
  customElements.define("grave-downvote", DownvoteElement);
}
