interface DeliveryState {
  bytes: number;
  last: Map<string, number>;
}
const encoder = new TextEncoder();
const bytes = (text: string) => encoder.encode(text).byteLength;

export function chooseDelivery(locals: object, tag: string, wire: unknown, drawing: string, asset: string, recovery: string, kind: string) {
  const context = locals as { recipeDeliveryProof?: DeliveryState };
  const state = context.recipeDeliveryProof ??= { bytes: 0, last: new Map() };
  const record = JSON.stringify(wire);
  const size = bytes(' data-grave-' + kind + '-recipe="' + record.replaceAll("&", "&amp;").replaceAll('"', "&quot;") + '"');
  const previous = state.last.get(tag);
  const referenceSize = bytes(' data-grave-' + kind + '-src="' + asset + '"><script type="module" src="' + recovery + '"></script>');
  const shared = previous !== undefined && state.bytes - previous > 32768 && size > referenceSize;
  state.last.set(tag, state.bytes);
  state.bytes += bytes(drawing) + (shared ? referenceSize : size);
  return shared;
}
