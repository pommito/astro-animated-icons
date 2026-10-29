export function serializeRecipe(data: unknown) {
  // The fixture HTML parser treats angle brackets in quoted attributes as tag boundaries.
  return JSON.stringify(data).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e");
}
