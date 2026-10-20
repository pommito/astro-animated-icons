export const textFormatting = [
  {
    "name": "Bold",
    "slug": "bold",
    "tag": "grave-bold",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"
        }
      }
    ]
  },
  {
    "name": "Italic",
    "slug": "italic",
    "tag": "grave-italic",
    "drawing": [
      {
        "tag": "line",
        "attrs": {
          "x1": "19",
          "x2": "10",
          "y1": "4",
          "y2": "4"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "14",
          "x2": "5",
          "y1": "20",
          "y2": "20"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "15",
          "x2": "9",
          "y1": "4",
          "y2": "20"
        }
      }
    ]
  },
  {
    "name": "Underline",
    "slug": "underline",
    "tag": "grave-underline",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6 4v6a6 6 0 0 0 12 0V4"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "4",
          "x2": "20",
          "y1": "20",
          "y2": "20"
        }
      }
    ]
  },
  {
    "name": "AArrowDown",
    "slug": "a-arrow-down",
    "tag": "grave-a-arrow-down",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3.5 13h6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "m2 16 4.5-9 4.5 9"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18 7v9"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "m14 12 4 4 4-4"
        }
      }
    ]
  },
  {
    "name": "AArrowUp",
    "slug": "a-arrow-up",
    "tag": "grave-a-arrow-up",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3.5 13h6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "m2 16 4.5-9 4.5 9"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18 16V7"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "m14 11 4-4 4 4"
        }
      }
    ]
  },
  {
    "name": "AlignCenter",
    "slug": "align-center",
    "tag": "grave-align-center",
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M17 12H7"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M19 18H5"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M21 6H3"
        }
      }
    ]
  },
  {
    "name": "AlignLeft",
    "slug": "align-left",
    "tag": "grave-align-left",
    "drawing": [
      {
        "tag": "line",
        "attrs": {
          "x1": "3",
          "x2": "21",
          "y1": "6",
          "y2": "6"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "3",
          "x2": "15",
          "y1": "12",
          "y2": "12"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "3",
          "x2": "17",
          "y1": "18",
          "y2": "18"
        }
      }
    ]
  },
  {
    "name": "AlignRight",
    "slug": "align-right",
    "tag": "grave-align-right",
    "drawing": [
      {
        "tag": "line",
        "attrs": {
          "x1": "3",
          "x2": "21",
          "y1": "6",
          "y2": "6"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "9",
          "x2": "21",
          "y1": "12",
          "y2": "12"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "7",
          "x2": "21",
          "y1": "18",
          "y2": "18"
        }
      }
    ]
  },
  {
    "name": "AlignHorizontal",
    "slug": "align-horizontal",
    "tag": "grave-align-horizontal",
    "drawing": [
      {
        "tag": "rect",
        "attrs": {
          "height": "10",
          "rx": "2",
          "width": "6",
          "x": "9",
          "y": "7"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 22V2"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M20 22V2"
        }
      }
    ]
  },
  {
    "name": "AlignVertical",
    "slug": "align-vertical",
    "tag": "grave-align-vertical",
    "drawing": [
      {
        "tag": "rect",
        "attrs": {
          "height": "6",
          "rx": "2",
          "width": "10",
          "x": "7",
          "y": "9"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M22 20H2"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M22 4H2"
        }
      }
    ]
  }
] as const;
