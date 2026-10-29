import migration from "../tests/helpers/css-migration-cases.json" with { type: "json" };
const all = migration.icons.map(icon => icon.slug);
const ten = ["bell", "chevron-right", "folder-down", "calendar-days", "circle-dashed", "folder", "circle-help", "chevron-down", "folder-up", "square-chevron-right"];

export const loadingCases = {
  one: ["circle-dashed"],
  four: migration.cases.interface,
  ten,
  "legacy-21": all.filter(slug => !["folder", "user-round-cog"].includes(slug)),
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
};

export const loadingIcons = [...new Map([...migration.icons, { slug: "user-round-cog", name: "UserRoundCog" }, { slug: "loader-circle", name: "LoaderCircle" }].map(icon => [icon.slug, icon])).values()];
