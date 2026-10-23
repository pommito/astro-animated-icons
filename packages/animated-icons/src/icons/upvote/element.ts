import { createIconElement, type IconHandle } from "../../element";
import { upvoteRecipe } from "./definition";

export type UpvoteIconHandle = IconHandle;

const UpvoteElement = createIconElement(upvoteRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-upvote": InstanceType<typeof UpvoteElement>;
  }
}

if (!customElements.get("grave-upvote")) {
  customElements.define("grave-upvote", UpvoteElement);
}
