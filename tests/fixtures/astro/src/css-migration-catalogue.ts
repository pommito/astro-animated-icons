import { Bell, Folder, ArrowLeft, LoaderCircle } from "@grave/animated-icons/astro";
import ReferenceBell from "./css-references/Bell.astro";
import ReferenceFolder from "./css-references/Folder.astro";
import { chevrons } from "./css-chevron-catalogue";
import { capabilities } from "./css-capability-catalogue";
import { combinedTransforms } from "./combined-transform-catalogue";

export const migrationIcons = [
  { slug: "bell", name: "Bell", Managed: Bell, Reference: ReferenceBell },
  ...chevrons, ...capabilities, ...combinedTransforms,
  { slug: "folder", name: "Folder", Managed: Folder, Reference: ReferenceFolder },
  { slug: "loader-circle", name: "LoaderCircle", Managed: LoaderCircle, Reference: LoaderCircle },
  { slug: "arrow-left", name: "ArrowLeft", Managed: ArrowLeft, Reference: ArrowLeft },
];
