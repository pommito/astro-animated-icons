import migration from "../tests/helpers/css-migration-cases.json" with { type: "json" };
const all = migration.icons.map(icon => icon.slug);
const ten = ["bell", "chevron-right", "folder-down", "calendar-days", "circle-dashed", "folder", "circle-help", "chevron-down", "folder-up", "square-chevron-right"];
export const supportedSix = ["disc-3", "panel-left-close", "panel-left-open", "panel-right-open", "briefcase-business", "tree-pine"];
const combined = ["key-square", "wallet", "key-circle"];

export const loadingCases = {
  one: ["circle-dashed"],
  four: migration.cases.interface,
  ten,
  "legacy-21": all.filter(slug => !["folder", "user-round-cog", ...combined, ...supportedSix].includes(slug)),
  "legacy-23": all.filter(slug => ![...combined, ...supportedSix].includes(slug)),
  all,
  repeated: Array(20).fill("circle-dashed"),
  "repeated-all": all.flatMap(slug => [slug, slug, slug]),
  loader: ["loader-circle"],
  "one-loader": ["circle-dashed", "loader-circle"],
  "four-loader": [...migration.cases.interface, "loader-circle"],
  "ten-loader": [...ten, "loader-circle"],
  "all-loader": [...all, "loader-circle"],
  unused: [],
  cog: ["user-round-cog"],
  "cog-repeated": Array(20).fill("user-round-cog"),
  "cog-css": ["user-round-cog", "bell", "circle-dashed"],
  "cog-loader": ["user-round-cog", "loader-circle"],
  "cog-css-loader": ["user-round-cog", "bell", "circle-dashed", "loader-circle"],
  ...Object.fromEntries([...[...combined, ...supportedSix].map(slug => [slug, [slug]]), ["combined", combined], ["supported-six", supportedSix]].flatMap(([name, slugs]) => [
    [name, slugs],
    [name + "-repeated", Array.from({ length: 20 }, () => slugs).flat()],
    [name + "-css", [...slugs, "bell", "circle-dashed", "user-round-cog"]],
    [name + "-loader", [...slugs, "loader-circle"]],
    [name + "-css-loader", [...slugs, "bell", "circle-dashed", "user-round-cog", "loader-circle"]],
  ])),
};

export const loadingIcons = [...new Map([...migration.icons,
  { slug: "disc-3", name: "Disc3" },
  { slug: "panel-left-close", name: "PanelLeftClose" },
  { slug: "panel-left-open", name: "PanelLeftOpen" },
  { slug: "panel-right-open", name: "PanelRightOpen" },
  { slug: "briefcase-business", name: "BriefcaseBusiness" },
  { slug: "tree-pine", name: "TreePine" }, { slug: "user-round-cog", name: "UserRoundCog" }, { slug: "loader-circle", name: "LoaderCircle" },
  { slug: "key-square", name: "KeySquare" }, { slug: "wallet", name: "Wallet" }, { slug: "key-circle", name: "KeyCircle" },
].map(icon => [icon.slug, icon])).values()];
