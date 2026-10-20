import { createIconElement, type IconHandle } from "../../element";
import { galleryThumbnailsRecipe } from "./definition";

export type GalleryThumbnailsIconHandle = IconHandle;

const GalleryThumbnailsElement = createIconElement(galleryThumbnailsRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-gallery-thumbnails": InstanceType<typeof GalleryThumbnailsElement>;
  }
}

if (!customElements.get("grave-gallery-thumbnails")) {
  customElements.define("grave-gallery-thumbnails", GalleryThumbnailsElement);
}
