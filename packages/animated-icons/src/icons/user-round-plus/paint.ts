import type { PaintRecipe } from "../../shared/paint-recipe";

export const userRoundPlusPaint = {
  "id": "user-round-plus",
  "finish": "hold",
  "replay": "restart",
  "entry": [
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
      "duration": 100,
      "delay": 300,
      "ease": "ease-out"
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
      "duration": 200,
      "delay": 300,
      "ease": "ease-out"
    },
    {
      "target": 4,
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
      "duration": 100,
      "delay": 600,
      "ease": "ease-out"
    },
    {
      "target": 4,
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
      "duration": 200,
      "delay": 600,
      "ease": "ease-out"
    }
  ],
  "returning": [
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
      "delay": 0,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    },
    {
      "target": 4,
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
      "delay": 0,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    }
  ]
} satisfies PaintRecipe;
