import { createCSSPaintRecipe } from "../../shared/css-paint";
import { attachFilePaint } from "./paint";

export const attachFileRecipe = createCSSPaintRecipe(attachFilePaint);
export { attachFilePath } from "./drawing";
