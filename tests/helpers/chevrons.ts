export const chevrons = [
  {
    name: "ChevronDown", slug: "chevron-down", tag: "grave-chevron-down",
    axis: "Y", values: [0,2,0], kind: "cycle", frame: null,
    paths: ["m6 9 6 6 6-6"],
  },
  {
    name: "ChevronFirst", slug: "chevron-first", tag: "grave-chevron-first",
    axis: "X", values: [-2,1,-1,0], kind: "first", frame: null,
    paths: ["m17 18-6-6 6-6","M7 6v12"],
  },
  {
    name: "ChevronLeft", slug: "chevron-left", tag: "grave-chevron-left",
    axis: "X", values: [0,-2,0], kind: "cycle", frame: null,
    paths: ["m15 18-6-6 6-6"],
  },
  {
    name: "ChevronRight", slug: "chevron-right", tag: "grave-chevron-right",
    axis: "X", values: [0,2,0], kind: "cycle", frame: null,
    paths: ["m9 18 6-6-6-6"],
  },
  {
    name: "ChevronUp", slug: "chevron-up", tag: "grave-chevron-up",
    axis: "Y", values: [0,-2,0], kind: "cycle", frame: null,
    paths: ["m18 15-6-6-6 6"],
  },
  {
    name: "ChevronsDownUp", slug: "chevrons-down-up", tag: "grave-chevrons-down-up",
    axis: "Y", values: [-2,2], kind: "spring", frame: null,
    paths: ["m7 20 5-5 5 5","m7 4 5 5 5-5"],
  },
  {
    name: "ChevronsLeftRight", slug: "chevrons-left-right", tag: "grave-chevrons-left-right",
    axis: "X", values: [-2,2], kind: "spring", frame: null,
    paths: ["m9 7-5 5 5 5","m15 7 5 5-5 5"],
  },
  {
    name: "ChevronsRightLeft", slug: "chevrons-right-left", tag: "grave-chevrons-right-left",
    axis: "X", values: [-2,2], kind: "spring", frame: null,
    paths: ["m20 17-5-5 5-5","m4 17 5-5-5-5"],
  },
  {
    name: "ChevronsUpDown", slug: "chevrons-up-down", tag: "grave-chevrons-up-down",
    axis: "Y", values: [2,-2], kind: "spring", frame: null,
    paths: ["m7 15 5 5 5-5","m7 9 5-5 5 5"],
  },
  {
    name: "CircleChevronDown", slug: "circle-chevron-down", tag: "grave-circle-chevron-down",
    axis: "Y", values: [0,2,0], kind: "cycle", frame: "circle",
    paths: ["m16 10-4 4-4-4"],
  },
  {
    name: "CircleChevronLeft", slug: "circle-chevron-left", tag: "grave-circle-chevron-left",
    axis: "X", values: [0,-2,0], kind: "cycle", frame: "circle",
    paths: ["m14 16-4-4 4-4"],
  },
  {
    name: "CircleChevronRight", slug: "circle-chevron-right", tag: "grave-circle-chevron-right",
    axis: "X", values: [0,2,0], kind: "cycle", frame: "circle",
    paths: ["m10 8 4 4-4 4"],
  },
  {
    name: "CircleChevronUp", slug: "circle-chevron-up", tag: "grave-circle-chevron-up",
    axis: "Y", values: [0,-2,0], kind: "cycle", frame: "circle",
    paths: ["m8 14 4-4 4 4"],
  },
  {
    name: "SquareChevronDown", slug: "square-chevron-down", tag: "grave-square-chevron-down",
    axis: "Y", values: [0,2,0], kind: "cycle", frame: "square",
    paths: ["m16 10-4 4-4-4"],
  },
  {
    name: "SquareChevronLeft", slug: "square-chevron-left", tag: "grave-square-chevron-left",
    axis: "X", values: [0,-2,0], kind: "cycle", frame: "square",
    paths: ["m14 16-4-4 4-4"],
  },
  {
    name: "SquareChevronRight", slug: "square-chevron-right", tag: "grave-square-chevron-right",
    axis: "X", values: [0,2,0], kind: "cycle", frame: "square",
    paths: ["m10 8 4 4-4 4"],
  },
  {
    name: "SquareChevronUp", slug: "square-chevron-up", tag: "grave-square-chevron-up",
    axis: "Y", values: [0,-2,0], kind: "cycle", frame: "square",
    paths: ["m8 14 4-4 4 4"],
  },
] as const;
