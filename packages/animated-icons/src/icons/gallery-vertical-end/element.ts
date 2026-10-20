import { createIconElement, type IconHandle } from "../../element";
import { galleryVerticalEndRecipe } from "./definition";

export type GalleryVerticalEndIconHandle = IconHandle;

const GalleryVerticalEndElement = createIconElement(galleryVerticalEndRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-gallery-vertical-end": InstanceType<typeof GalleryVerticalEndElement>;
  }
}

if (!customElements.get("grave-gallery-vertical-end")) {
  customElements.define("grave-gallery-vertical-end", GalleryVerticalEndElement);
}
