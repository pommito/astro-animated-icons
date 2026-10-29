import { KeySquare, Wallet, KeyCircle } from "@grave/animated-icons/astro";
import ReferenceKeySquare from "./css-references/KeySquare.astro";
import ReferenceWallet from "./css-references/Wallet.astro";
import ReferenceKeyCircle from "./css-references/KeyCircle.astro";

export const combinedTransforms = [
  { slug: "key-square", name: "KeySquare", Managed: KeySquare, Reference: ReferenceKeySquare },
  { slug: "wallet", name: "Wallet", Managed: Wallet, Reference: ReferenceWallet },
  { slug: "key-circle", name: "KeyCircle", Managed: KeyCircle, Reference: ReferenceKeyCircle },
];
