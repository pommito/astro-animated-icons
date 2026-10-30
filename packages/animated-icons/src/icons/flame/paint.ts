import type { PaintRecipe } from "../../shared/paint-recipe";

export const flamePaint = {
  "id": "flame",
  "finish": "restore",
  "replay": "until-clear",
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
      "duration": 100,
      "delay": 100,
      "ease": "ease-out"
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
      "duration": 400,
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
      "delay": 0,
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
      "delay": 0,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    }
  ]
} satisfies PaintRecipe;
