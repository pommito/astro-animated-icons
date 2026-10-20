import { createIconElement, type IconHandle } from "../../element";
import { trainTrackRecipe } from "./definition";

export type TrainTrackIconHandle = IconHandle;

const TrainTrackElement = createIconElement(trainTrackRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-train-track": InstanceType<typeof TrainTrackElement>;
  }
}

if (!customElements.get("grave-train-track")) {
  customElements.define("grave-train-track", TrainTrackElement);
}
