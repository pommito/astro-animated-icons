import type { PaintRecipe } from "../../shared/paint-recipe";

export const routePaint = {
  "id": "route",
  "finish": "hold",
  "replay": "active",
  "entry": [
    {
      "target": 1,
      "property": "opacity",
      "values": [
        0,
        1
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 150,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    },
    {
      "target": 1,
      "property": "strokeDasharray",
      "values": [
        [
          0,
          1
        ],
        [
          1,
          1
        ]
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 100,
      "ease": "ease-out"
    },
    {
      "target": 2,
      "property": "opacity",
      "values": [
        0,
        1
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 500,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    },
    {
      "target": 2,
      "property": "strokeDasharray",
      "values": [
        [
          0,
          1
        ],
        [
          1,
          1
        ]
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 700,
      "delay": 500,
      "ease": "ease-out"
    },
    {
      "target": 2,
      "property": "strokeDashoffset",
      "values": [
        [
          -1
        ],
        [
          0
        ]
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 700,
      "delay": 500,
      "ease": "ease-out"
    },
    {
      "target": 3,
      "property": "opacity",
      "values": [
        0,
        1
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 150,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    },
    {
      "target": 3,
      "property": "strokeDasharray",
      "values": [
        [
          0,
          1
        ],
        [
          1,
          1
        ]
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 100,
      "ease": "ease-out"
    }
  ],
  "returning": [
    {
      "target": 1,
      "property": "opacity",
      "values": [
        null,
        1
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 150,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    },
    {
      "target": 1,
      "property": "strokeDasharray",
      "values": [
        null,
        [
          1,
          1
        ]
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 100,
      "ease": "ease-out"
    },
    {
      "target": 2,
      "property": "opacity",
      "values": [
        null,
        1
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 500,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    },
    {
      "target": 2,
      "property": "strokeDasharray",
      "values": [
        null,
        [
          1,
          1
        ]
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 700,
      "delay": 500,
      "ease": "ease-out"
    },
    {
      "target": 2,
      "property": "strokeDashoffset",
      "values": [
        null,
        [
          0
        ]
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 700,
      "delay": 500,
      "ease": "ease-out"
    },
    {
      "target": 3,
      "property": "opacity",
      "values": [
        null,
        1
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 150,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    },
    {
      "target": 3,
      "property": "strokeDasharray",
      "values": [
        null,
        [
          1,
          1
        ]
      ],
      "offsets": [
        0,
        1
      ],
      "intervalEase": [
        "linear",
        "linear"
      ],
      "duration": 300,
      "delay": 100,
      "ease": "ease-out"
    }
  ]
} satisfies PaintRecipe;
