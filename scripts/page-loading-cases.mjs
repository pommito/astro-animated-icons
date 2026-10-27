import migration from "../tests/helpers/css-migration-cases.json" with { type: "json" };
const all = migration.icons.map(icon => icon.slug);
const ten = ["bell", "chevron-right", "folder-down", "calendar-days", "circle-dashed", "folder", "circle-help", "chevron-down", "folder-up", "square-chevron-right"];

export const loadingCases = {
  one: ["circle-dashed"],
  four: migration.cases.interface,
  ten,
  "legacy-21": all.filter(slug => slug !== "folder"),
  all,
  repeated: Array(20).fill("circle-dashed"),
  "repeated-all": all.flatMap(slug => [slug, slug, slug]),
  loader: ["loader-circle"],
  "one-loader": ["circle-dashed", "loader-circle"],
  "four-loader": [...migration.cases.interface, "loader-circle"],
  "ten-loader": [...ten, "loader-circle"],
  "all-loader": [...all, "loader-circle"],
  unused: [],
};

export const loadingIcons = [...migration.icons, { slug: "loader-circle", name: "LoaderCircle" }];
