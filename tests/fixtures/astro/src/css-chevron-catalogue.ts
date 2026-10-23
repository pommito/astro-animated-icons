import { ChevronDown, ChevronFirst, ChevronLeft, ChevronRight, ChevronUp, CircleChevronDown, CircleChevronLeft, CircleChevronRight, CircleChevronUp, SquareChevronDown, SquareChevronLeft, SquareChevronRight, SquareChevronUp, LoaderCircle } from "@grave/animated-icons/astro";
import ReferenceChevronDown from "./css-references/ChevronDown.astro";
import ReferenceChevronFirst from "./css-references/ChevronFirst.astro";
import ReferenceChevronLeft from "./css-references/ChevronLeft.astro";
import ReferenceChevronRight from "./css-references/ChevronRight.astro";
import ReferenceChevronUp from "./css-references/ChevronUp.astro";
import ReferenceCircleChevronDown from "./css-references/CircleChevronDown.astro";
import ReferenceCircleChevronLeft from "./css-references/CircleChevronLeft.astro";
import ReferenceCircleChevronRight from "./css-references/CircleChevronRight.astro";
import ReferenceCircleChevronUp from "./css-references/CircleChevronUp.astro";
import ReferenceSquareChevronDown from "./css-references/SquareChevronDown.astro";
import ReferenceSquareChevronLeft from "./css-references/SquareChevronLeft.astro";
import ReferenceSquareChevronRight from "./css-references/SquareChevronRight.astro";
import ReferenceSquareChevronUp from "./css-references/SquareChevronUp.astro";

export const chevrons = [
  { slug: "chevron-down", name: "ChevronDown", Managed: ChevronDown, Reference: ReferenceChevronDown },
  { slug: "chevron-first", name: "ChevronFirst", Managed: ChevronFirst, Reference: ReferenceChevronFirst },
  { slug: "chevron-left", name: "ChevronLeft", Managed: ChevronLeft, Reference: ReferenceChevronLeft },
  { slug: "chevron-right", name: "ChevronRight", Managed: ChevronRight, Reference: ReferenceChevronRight },
  { slug: "chevron-up", name: "ChevronUp", Managed: ChevronUp, Reference: ReferenceChevronUp },
  { slug: "circle-chevron-down", name: "CircleChevronDown", Managed: CircleChevronDown, Reference: ReferenceCircleChevronDown },
  { slug: "circle-chevron-left", name: "CircleChevronLeft", Managed: CircleChevronLeft, Reference: ReferenceCircleChevronLeft },
  { slug: "circle-chevron-right", name: "CircleChevronRight", Managed: CircleChevronRight, Reference: ReferenceCircleChevronRight },
  { slug: "circle-chevron-up", name: "CircleChevronUp", Managed: CircleChevronUp, Reference: ReferenceCircleChevronUp },
  { slug: "square-chevron-down", name: "SquareChevronDown", Managed: SquareChevronDown, Reference: ReferenceSquareChevronDown },
  { slug: "square-chevron-left", name: "SquareChevronLeft", Managed: SquareChevronLeft, Reference: ReferenceSquareChevronLeft },
  { slug: "square-chevron-right", name: "SquareChevronRight", Managed: SquareChevronRight, Reference: ReferenceSquareChevronRight },
  { slug: "square-chevron-up", name: "SquareChevronUp", Managed: SquareChevronUp, Reference: ReferenceSquareChevronUp },
];
export { LoaderCircle };
