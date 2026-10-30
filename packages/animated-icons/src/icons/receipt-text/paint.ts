import type { PaintRecipe } from "../../shared/paint-recipe";

export const receiptTextPaint = {
  "id": "receipt-text",
  "finish": "hold",
  "replay": "current",
  "entry": [
    {
      "target": 2,
      "property": "strokeDasharray",
      "values": [
        [
          1,
          1
        ],
        [
          0,
          1
        ],
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
        0.3636363636363637,
        0.3636363636363637,
        1
      ],
      "intervalEase": [
        "linear",
        "linear",
        "linear",
        "linear"
      ],
      "duration": 549.9999999999999,
      "delay": 120,
      "ease": "linear"
    },
    {
      "target": 3,
      "property": "strokeDasharray",
      "values": [
        [
          1,
          1
        ],
        [
          0,
          1
        ],
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
        0.28169014084507044,
        0.5070422535211269,
        1
      ],
      "intervalEase": [
        "linear",
        "linear",
        "linear",
        "linear"
      ],
      "duration": 710,
      "delay": 60,
      "ease": "linear"
    },
    {
      "target": 4,
      "property": "strokeDasharray",
      "values": [
        [
          1,
          1
        ],
        [
          0,
          1
        ],
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
        0.2298850574712644,
        0.5977011494252874,
        1
      ],
      "intervalEase": [
        "linear",
        "linear",
        "linear",
        "linear"
      ],
      "duration": 870,
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
      "duration": 350,
      "delay": 0,
      "ease": "linear"
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
      "duration": 350,
      "delay": 100,
      "ease": "linear"
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
      "duration": 350,
      "delay": 200,
      "ease": "linear"
    }
  ]
} satisfies PaintRecipe;
