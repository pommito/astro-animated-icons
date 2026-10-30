import type { PaintRecipe } from "../../shared/paint-recipe";

export const eyeOffPaint = {
  "id": "eye-off",
  "finish": "hold",
  "replay": "restart",
  "entry": [
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
      "duration": 600,
      "delay": 0,
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
          2,
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
    },
    {
      "target": 4,
      "property": "strokeDashoffset",
      "values": [
        [
          0
        ],
        [
          -2
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
    },
    {
      "target": 4,
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
    },
    {
      "target": 4,
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
      "duration": 300,
      "delay": 0,
      "ease": "cubic-bezier(0.25, 0.1, 0.35, 1)"
    }
  ]
} satisfies PaintRecipe;
