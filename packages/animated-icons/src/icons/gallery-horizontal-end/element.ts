import { createIconElement, type IconHandle } from "../../element";
import { galleryHorizontalEndRecipe } from "./definition";

export type GalleryHorizontalEndIconHandle = IconHandle;

const GalleryHorizontalEndElement = createIconElement(galleryHorizontalEndRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-gallery-horizontal-end": InstanceType<typeof GalleryHorizontalEndElement>;
  }
}

if (!customElements.get("grave-gallery-horizontal-end")) {
  customElements.define("grave-gallery-horizontal-end", GalleryHorizontalEndElement);
}
