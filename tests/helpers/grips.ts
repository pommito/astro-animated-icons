export const grips = [
  { name: "Grip", slug: "grip", tag: "grave-grip", pulse: false,
    circles: [[19, 5], [19, 12], [12, 5], [19, 19], [12, 12], [5, 5], [12, 19], [5, 12], [5, 19]],
    delays: [0, 70, 140, 210, 280, 350, 420, 490, 560] },
  { name: "GripHorizontal", slug: "grip-horizontal", tag: "grave-grip-horizontal", pulse: true,
    circles: [[5, 9], [12, 9], [19, 9], [5, 15], [12, 15], [19, 15]],
    delays: [0, 150, 300, 250, 400, 550] },
  { name: "GripVertical", slug: "grip-vertical", tag: "grave-grip-vertical", pulse: true,
    circles: [[9, 5], [9, 12], [9, 19], [15, 5], [15, 12], [15, 19]],
    delays: [0, 150, 300, 250, 400, 550] },
] as const;
