import type { PaintRecipe } from "../../shared/paint-recipe";

export const circleCheckPaint = {
  "id": "circle-check",
  "finish": "hold",
  "replay": "active",
  "entry": [
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
      "duration": 100,
      "delay": 0,
      "ease": "ease-out"
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
      "duration": 400,
      "delay": 0,
      "ease": "ease-out"
    }
  ],
  "returning": [
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
      "duration": 100,
      "delay": 0,
      "ease": "ease-out"
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
      "duration": 300,
      "delay": 0,
      "ease": "ease-out"
    }
  ]
} satisfies PaintRecipe;
