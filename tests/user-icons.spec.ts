import { testUpstreamComparison } from "./helpers/upstream-comparison.js";
import { testIconBehavior } from "./helpers/icon-behavior.js";
import { userIcons } from "./helpers/user-icons.js";

testIconBehavior(userIcons, [100, 450, 650]);

testUpstreamComparison({
  name: "all user adapters match the original React components at small sizes",
  route: "/users-comparison/",
  seekEvent: "user-seek",
  tags: userIcons.map((icon) => icon.tag),
});
