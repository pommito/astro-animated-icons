import { createTransformRecipe } from "../../packages/animated-icons/src/shared/css-transform";
import { ensurePrepared, type PreparedRecord } from "./recovery";

export function create(record: PreparedRecord) {
  return createTransformRecipe(record.data, document => ensurePrepared(record, document));
}
