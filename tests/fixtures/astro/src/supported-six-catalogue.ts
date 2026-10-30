import { Disc3, PanelLeftClose, PanelLeftOpen, PanelRightOpen, BriefcaseBusiness, TreePine } from "@grave/animated-icons/astro";
import ReferenceDisc3 from "./css-references/Disc3.astro";
import ReferencePanelLeftClose from "./css-references/PanelLeftClose.astro";
import ReferencePanelLeftOpen from "./css-references/PanelLeftOpen.astro";
import ReferencePanelRightOpen from "./css-references/PanelRightOpen.astro";
import ReferenceBriefcaseBusiness from "./css-references/BriefcaseBusiness.astro";
import ReferenceTreePine from "./css-references/TreePine.astro";

export const supportedSix = [
  { slug: "disc-3", name: "Disc3", Managed: Disc3, Reference: ReferenceDisc3 },
  { slug: "panel-left-close", name: "PanelLeftClose", Managed: PanelLeftClose, Reference: ReferencePanelLeftClose },
  { slug: "panel-left-open", name: "PanelLeftOpen", Managed: PanelLeftOpen, Reference: ReferencePanelLeftOpen },
  { slug: "panel-right-open", name: "PanelRightOpen", Managed: PanelRightOpen, Reference: ReferencePanelRightOpen },
  { slug: "briefcase-business", name: "BriefcaseBusiness", Managed: BriefcaseBusiness, Reference: ReferenceBriefcaseBusiness },
  { slug: "tree-pine", name: "TreePine", Managed: TreePine, Reference: ReferenceTreePine },
];
