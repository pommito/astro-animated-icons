import type { PaintRecipe } from "../../shared/paint-recipe";

export const homePaint = {
  "id": "home",
  "finish": "hold",
  "replay": "restart",
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
      "duration": 200,
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
      "duration": 600,
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
      "duration": 200,
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
      "duration": 600,
      "delay": 0,
      "ease": "ease-out"
    }
  ]
} satisfies PaintRecipe;
