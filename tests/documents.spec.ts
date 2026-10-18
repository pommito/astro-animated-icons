import { testIconBehavior } from "./helpers/icon-behavior.js";
import { testUpstreamComparison } from "./helpers/upstream-comparison.js";
import { documentIcons } from "./helpers/documents.js";

testIconBehavior(documentIcons, [100, 450, 650]);

for (const returnFrom of [undefined, 100, 650]) {
  testUpstreamComparison({
    name: `document and transfer ${returnFrom === undefined ? "entries" : `returns interrupted at ${returnFrom} ms`} match the original React components at small sizes`,
    route: "/documents-comparison/",
    seekEvent: "documents-seek",
    tags: documentIcons.map((icon) => icon.tag),
    returnFrom,
    ignoredOpacity: ["clipboard-check"],
  });
}
