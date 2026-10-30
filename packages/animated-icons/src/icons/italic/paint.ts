import type { PaintRecipe } from "../../shared/paint-recipe";

export const italicPaint = {
  "id": "italic",
  "finish": "hold",
  "replay": "restart",
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
      "duration": 200,
      "delay": 0,
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
      "duration": 200,
      "delay": 0,
      "ease": "ease-out"
    },
    {
      "target": 1,
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
      "duration": 200,
      "delay": 0,
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
      "duration": 200,
      "delay": 0,
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
      "duration": 200,
      "delay": 0,
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
      "duration": 400,
      "delay": 100,
      "ease": "ease-out"
    },
    {
      "target": 3,
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
      "duration": 200,
      "delay": 0,
      "ease": "ease-out"
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
      "duration": 200,
      "delay": 0,
      "ease": "ease-out"
    },
    {
      "target": 1,
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
      "duration": 200,
      "delay": 0,
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
      "duration": 200,
      "delay": 0,
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
      "duration": 200,
      "delay": 0,
      "ease": "ease-out"
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
      "duration": 400,
      "delay": 100,
      "ease": "ease-out"
    },
    {
      "target": 3,
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
      "duration": 400,
      "delay": 100,
      "ease": "ease-out"
    }
  ]
} satisfies PaintRecipe;
