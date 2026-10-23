import type { IconRecipe } from "../../element";
import { animatePathMorph, clearPathMorph } from "../../shared/path-morph";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const transition = { type: "spring", stiffness: 500, damping: 30 } as const;
const wires = [
  { part: 0, normal: "M19 5l3 -3", animate: "M17 7l5 -5" },
  { part: 1, normal: "m2 22 3-3", animate: "m2 22 6-6" },
  { part: 3, normal: "M7.5 13.5 l2.5 -2.5", animate: "M10.43 10.57 l0.10 -0.10" },
  { part: 4, normal: "M10.5 16.5 l2.5 -2.5", animate: "M13.43 13.57 l0.10 -0.10" },
];

export const connectRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    for (const wire of wires) {
      animatePathMorph(drawing.children[wire.part] as SVGPathElement, wire[returning ? "normal" : "animate"], track, transition);
    }
    for (const [part, x, y] of [[2, 3, -3], [5, -3, 3]]) {
      animateSvgTransform(drawing.children[part] as SVGElement, returning, track, { x, y }, transition);
    }
  },
  clear(drawing) {
    for (const wire of wires) clearPathMorph(drawing.children[wire.part] as SVGPathElement, wire.normal);
    for (const part of [2, 5]) clearSvgTransform(drawing.children[part] as SVGElement);
  },
} satisfies IconRecipe;
