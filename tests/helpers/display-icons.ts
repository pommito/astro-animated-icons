export const displayIcons = [
  {
    name: "Sun", slug: "sun", tag: "grave-sun",
    animationCount: 8,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "12", "cy": "12", "r": "4"}},
      {"tag": "path", "attrs": {"d": "M12 2v2"}},
      {"tag": "path", "attrs": {"d": "m19.07 4.93-1.41 1.41"}},
      {"tag": "path", "attrs": {"d": "M20 12h2"}},
      {"tag": "path", "attrs": {"d": "m17.66 17.66 1.41 1.41"}},
      {"tag": "path", "attrs": {"d": "M12 20v2"}},
      {"tag": "path", "attrs": {"d": "m6.34 17.66-1.41 1.41"}},
      {"tag": "path", "attrs": {"d": "M2 12h2"}},
      {"tag": "path", "attrs": {"d": "m4.93 4.93 1.41 1.41"}},
    ],
  },
  {
    name: "Moon", slug: "moon", tag: "grave-moon",
    animationCount: 1,
    drawing: [
      {"tag": "path", "attrs": {"d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"}},
    ],
  },
  {
    name: "Monitor", slug: "monitor", tag: "grave-monitor",
    animationCount: 1,
    drawing: [
      {"tag": "rect", "attrs": {"width": "20", "height": "14", "x": "2", "y": "3", "rx": "2"}},
      {"tag": "line", "attrs": {"x1": "8", "x2": "16", "y1": "21", "y2": "21"}},
      {"tag": "line", "attrs": {"x1": "12", "x2": "12", "y1": "17", "y2": "21"}},
    ],
  },
  {
    name: "Linkedin", slug: "linkedin", tag: "grave-linkedin",
    animationCount: 9,
    drawing: [
      {"tag": "path", "attrs": {"d": "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"}},
      {"tag": "rect", "attrs": {"height": "12", "width": "4", "x": "2", "y": "9"}},
      {"tag": "circle", "attrs": {"cx": "4", "cy": "4", "r": "2"}},
    ],
  },
] as const;
