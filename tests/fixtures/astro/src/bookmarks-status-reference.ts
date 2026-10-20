import * as originals from "./references/bookmarks-status";
import { mountReferences } from "./upstream-reference";
import { captureReferencePose } from "./reference-playback";

mountReferences(originals, "bookmarks-status-seek");
document.addEventListener("bookmarks-status-capture-return", () => {
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});
