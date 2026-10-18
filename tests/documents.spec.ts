import { testIconBehavior } from "./helpers/icon-behavior.js";
import { testUpstreamComparison } from "./helpers/upstream-comparison.js";
import { documentIcons } from "./helpers/documents.js";

testIconBehavior(documentIcons, [100, 450, 650]);

testUpstreamComparison({
  name: "all document and transfer adapters match the original React components at small sizes",
  route: "/documents-comparison/",
  seekEvent: "documents-seek",
  tags: documentIcons.map((icon) => icon.tag),
});
