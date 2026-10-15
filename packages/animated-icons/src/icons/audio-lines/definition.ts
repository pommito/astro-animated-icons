import { animate } from "motion/mini";

export const audioLines = [
  { x: 6, top: 6, length: 11, normalTop: 6, normalLength: 11, activeTop: 10, activeLength: 3, duration: 1.5 },
  { x: 10, top: 3, length: 18, normalTop: 3, normalLength: 18, activeTop: 9, activeLength: 5, duration: 1 },
  { x: 14, top: 6, length: 11, normalTop: 8, normalLength: 7, activeTop: 6, activeLength: 11, duration: 0.8 },
  { x: 18, top: 5, length: 13, normalTop: 5, normalLength: 13, activeTop: 7, activeLength: 9, duration: 1.5 },
];

export function animateAudioLines(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  let remaining = audioLines.length * 2;
  return [...drawing.querySelectorAll<SVGPathElement>("[data-audio-line]")].flatMap((path, index) => {
    const line = audioLines[index];
    const normalDash = `${line.normalLength}px ${line.length}px`;
    const normalOffset = `${line.top - line.normalTop}px`;
    const options = {
      duration: returning ? 0.3 : line.duration,
      ease: returning ? [0.25, 0.1, 0.35, 1] as const : ["easeOut" as const, "easeOut" as const],
      repeat: returning ? 0 : Infinity,
      onComplete: () => onComplete(--remaining === 0 && returning),
    };
    return [
      animate(path, { strokeDasharray: returning ? normalDash : [normalDash, `${line.activeLength}px ${line.length}px`, normalDash] }, options),
      animate(path, { strokeDashoffset: returning ? normalOffset : [normalOffset, `${line.top - line.activeTop}px`, normalOffset] }, options),
    ];
  });
}
