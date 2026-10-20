export const directionalArrows = [
  {
    "name": "ArrowDownLeft",
    "slug": "arrow-down-left",
    "tag": "grave-arrow-down-left",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M17 17H7V7"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 17 L12 12"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M17 7 L12 12"
        }
      }
    ]
  },
  {
    "name": "ArrowDownRight",
    "slug": "arrow-down-right",
    "tag": "grave-arrow-down-right",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M7 7 L17 17"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M17 7v10H7"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M17 17 L10 17"
        }
      }
    ]
  },
  {
    "name": "ArrowBigDown",
    "slug": "arrow-big-down",
    "tag": "grave-arrow-big-down",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M15 6v6h4l-7 7-7-7h4V6h6z"
        }
      }
    ]
  },
  {
    "name": "ArrowBigDownDash",
    "slug": "arrow-big-down-dash",
    "tag": "grave-arrow-big-down-dash",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M15 5H9"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 9v3h4l-7 7-7-7h4V9z"
        }
      }
    ]
  },
  {
    "name": "ArrowBigLeft",
    "slug": "arrow-big-left",
    "tag": "grave-arrow-big-left",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M18 15h-6v4l-7-7 7-7v4h6v6z"
        }
      }
    ]
  },
  {
    "name": "ArrowBigLeftDash",
    "slug": "arrow-big-left-dash",
    "tag": "grave-arrow-big-left-dash",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M19 15V9"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 15h-3v4l-7-7 7-7v4h3v6z"
        }
      }
    ]
  },
  {
    "name": "ArrowBigRight",
    "slug": "arrow-big-right",
    "tag": "grave-arrow-big-right",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6 9h6V5l7 7-7 7v-4H6V9z"
        }
      }
    ]
  },
  {
    "name": "ArrowBigRightDash",
    "slug": "arrow-big-right-dash",
    "tag": "grave-arrow-big-right-dash",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M5 9v6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 9h3V5l7 7-7 7v-4H9V9z"
        }
      }
    ]
  },
  {
    "name": "ArrowBigUp",
    "slug": "arrow-big-up",
    "tag": "grave-arrow-big-up",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M9 18v-6H5l7-7 7 7h-4v6H9z"
        }
      }
    ]
  },
  {
    "name": "ArrowBigUpDash",
    "slug": "arrow-big-up-dash",
    "tag": "grave-arrow-big-up-dash",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M9 19h6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 15v-3H5l7-7 7 7h-4v3H9z"
        }
      }
    ]
  }
] as const;
