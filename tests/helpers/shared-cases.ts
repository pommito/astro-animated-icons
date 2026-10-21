import { folders } from "./folders.js";
import { securityIcons } from "./security-icons.js";

export const sharedCases = [
  { name: "ArrowLeft", route: "/", tag: "grave-arrow-left", animationCount: 2, label: "Left arrow" },
  ...[
    ...folders.filter(({ slug }) => slug === "folder-heart"),
    ...securityIcons.filter(({ slug }) => slug === "scan-face"),
  ].map(({ name, slug, tag, animationCount }) => ({ name, route: `/${slug}/`, tag, animationCount, label: `${name} icon` })),
].map((icon) => ({ ...icon, axis: icon.name === "MapPin" ? "y" as const : "x" as const }));

export const renderingCases = [
  { name: "ArrowLeft", route: "/props/", label: "Back arrow" },
  { name: "Archive", route: "/archive-props/", label: "Archive icon" },
  { name: "SlidersHorizontal", route: "/sliders-horizontal-props/", label: "SlidersHorizontal icon" },
  { name: "Bluetooth", route: "/bluetooth-props/", label: "Bluetooth icon" },
];
