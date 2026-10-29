import { FolderDown, FolderUp, FolderInput, FolderOutput, CircleHelp, UserRoundCog, CalendarDays, CircleDashed, LoaderCircle } from "@grave/animated-icons/astro";
import ReferenceFolderDown from "./css-references/FolderDown.astro";
import ReferenceFolderUp from "./css-references/FolderUp.astro";
import ReferenceFolderInput from "./css-references/FolderInput.astro";
import ReferenceFolderOutput from "./css-references/FolderOutput.astro";
import ReferenceCircleHelp from "./css-references/CircleHelp.astro";
import ReferenceCalendarDays from "./css-references/CalendarDays.astro";
import ReferenceCircleDashed from "./css-references/CircleDashed.astro";

import ReferenceUserRoundCog from "./css-references/UserRoundCog.astro";

export const capabilities = [
  { slug: "folder-down", name: "FolderDown", family: "folders", Managed: FolderDown, Reference: ReferenceFolderDown },
  { slug: "folder-up", name: "FolderUp", family: "folders", Managed: FolderUp, Reference: ReferenceFolderUp },
  { slug: "folder-input", name: "FolderInput", family: "folders", Managed: FolderInput, Reference: ReferenceFolderInput },
  { slug: "folder-output", name: "FolderOutput", family: "folders", Managed: FolderOutput, Reference: ReferenceFolderOutput },
  { slug: "circle-help", name: "CircleHelp", family: "group", Managed: CircleHelp, Reference: ReferenceCircleHelp },
  { slug: "calendar-days", name: "CalendarDays", family: "opacity", Managed: CalendarDays, Reference: ReferenceCalendarDays },
  { slug: "circle-dashed", name: "CircleDashed", family: "opacity", Managed: CircleDashed, Reference: ReferenceCircleDashed },
  { slug: "user-round-cog", name: "UserRoundCog", family: "half-turn", Managed: UserRoundCog, Reference: ReferenceUserRoundCog },
];
export { LoaderCircle };
