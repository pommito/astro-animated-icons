import type { OpacityPart } from "../../shared/opacity-parts";

export const circleDashedParts = Array.from({ length: 8 }, (_, index) => ({
  selector: `[data-part="${index}"]`,
  variants: {
    normal: { opacity: 1 },
    animate: { opacity: [0, 1], transition: { delay: (index + 1) * 0.1, duration: 0.3 } },
  },
})) satisfies OpacityPart[];
