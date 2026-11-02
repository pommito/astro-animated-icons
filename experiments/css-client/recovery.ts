import { ensureRecipeCSS } from "../../packages/animated-icons/src/shared/recipe-css";

export interface PreparedRecord {
  data: any;
  css: string;
  basis?: { base: number[][]; weights: number[][] }[];
}

export function ensurePrepared(record: PreparedRecord, document: Document) {
  const id = Array.isArray(record.data) ? record.data[0] : record.data.id;
  ensureRecipeCSS(id, document, () => record.css);
}
