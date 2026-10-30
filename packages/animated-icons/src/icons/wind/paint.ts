import type { PaintRecipe } from "../../shared/paint-recipe";

export const windPaint = {
  "id": "wind",
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
      "duration": 500,
      "delay": 200,
      "ease": "ease-in-out"
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
      "duration": 500,
      "delay": 200,
      "ease": "ease-in-out"
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
      "duration": 500,
      "delay": 200,
      "ease": "ease-in-out"
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
      "duration": 500,
      "delay": 0,
      "ease": "ease-in-out"
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
      "duration": 500,
      "delay": 0,
      "ease": "ease-in-out"
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
      "duration": 500,
      "delay": 0,
      "ease": "ease-in-out"
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
      "duration": 500,
      "delay": 400,
      "ease": "ease-in-out"
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
      "duration": 500,
      "delay": 400,
      "ease": "ease-in-out"
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
      "duration": 500,
      "delay": 400,
      "ease": "ease-in-out"
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
      "delay": 200,
      "ease": "ease-in-out"
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
      "delay": 200,
      "ease": "ease-in-out"
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
      "duration": 300,
      "delay": 200,
      "ease": "ease-in-out"
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
      "delay": 0,
      "ease": "ease-in-out"
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
      "ease": "ease-in-out"
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
      "duration": 300,
      "delay": 0,
      "ease": "ease-in-out"
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
      "delay": 400,
      "ease": "ease-in-out"
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
      "delay": 400,
      "ease": "ease-in-out"
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
      "duration": 300,
      "delay": 400,
      "ease": "ease-in-out"
    }
  ]
} satisfies PaintRecipe;
