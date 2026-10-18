import { folders } from "./folders.js";
import { clockCalendarIcons } from "./clock-calendar.js";
import { energyBluetoothIcons } from "./energy-bluetooth.js";
import { securityIcons } from "./security-icons.js";

export const sharedCases = [
  { name: "ArrowLeft", route: "/", tag: "grave-arrow-left", animationCount: 2, label: "Left arrow" },
  { name: "MapPin", route: "/map-pin/", tag: "grave-map-pin", animationCount: 4, label: "Location pin" },
  { name: "Check", route: "/check/", tag: "grave-check", animationCount: 3, label: "Check icon" },
  ...[
    ...folders.filter(({ slug }) => slug === "folder-heart"),
    ...clockCalendarIcons.filter(({ slug }) => slug === "alarm-clock"),
    ...energyBluetoothIcons.filter(({ slug }) => slug === "battery-full"),
    ...securityIcons.filter(({ slug }) => slug === "scan-face"),
  ].map(({ name, slug, tag, animationCount }) => ({ name, route: `/${slug}/`, tag, animationCount, label: `${name} icon` })),
].map((icon) => ({ ...icon, axis: icon.name === "MapPin" ? "y" as const : "x" as const }));

export const renderingCases = [
  { name: "ArrowLeft", route: "/props/", label: "Back arrow" },
  { name: "Archive", route: "/archive-props/", label: "Archive icon" },
  { name: "SlidersHorizontal", route: "/sliders-horizontal-props/", label: "SlidersHorizontal icon" },
  { name: "Bluetooth", route: "/bluetooth-props/", label: "Bluetooth icon" },
];
