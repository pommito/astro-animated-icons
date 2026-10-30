import type { PaintRecipe } from "../../shared/paint-recipe";

export const phoneOffPaint = {
  "id": "phone-off",
  "finish": "hold",
  "replay": "restart",
  "entry": [
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
      "ease": "linear"
    }
  ],
  "returning": [
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
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    }
  ]
} satisfies PaintRecipe;
