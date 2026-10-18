export const navigationIcons = [
  {
    "name": "Login",
    "slug": "login",
    "tag": "grave-login",
    "animationCount": 2,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
        }
      },
      {
        "tag": "polyline",
        "attrs": {
          "points": "10 17 15 12 10 7"
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
      }
    ]
  },
  {
    "name": "Logout",
    "slug": "logout",
    "tag": "grave-logout",
    "animationCount": 2,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        }
      },
      {
        "tag": "polyline",
        "attrs": {
          "points": "16 17 21 12 16 7"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "21",
          "x2": "9",
          "y1": "12",
          "y2": "12"
        }
      }
    ]
  },
  {
    "name": "RefreshCw",
    "slug": "refresh-cw",
    "tag": "grave-refresh-cw",
    "animationCount": 1,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M21 3v5h-5"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 16H3v5"
        }
      }
    ]
  },
  {
    "name": "RefreshCcw",
    "slug": "refresh-ccw",
    "tag": "grave-refresh-ccw",
    "animationCount": 1,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3 2v6h6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M21 12A9 9 0 0 0 6 5.3L3 8"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M21 22v-6h-6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 12a9 9 0 0 0 15 6.7l3-2.7"
        }
      }
    ]
  },
  {
    "name": "RotateCw",
    "slug": "rotate-cw",
    "tag": "grave-rotate-cw",
    "animationCount": 1,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M21 3v5h-5"
        }
      }
    ]
  },
  {
    "name": "RotateCcw",
    "slug": "rotate-ccw",
    "tag": "grave-rotate-ccw",
    "animationCount": 1,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 3v5h5"
        }
      }
    ]
  },
  {
    "name": "Undo",
    "slug": "undo",
    "tag": "grave-undo",
    "animationCount": 2,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3 7v6h6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"
        }
      }
    ]
  },
  {
    "name": "Redo",
    "slug": "redo",
    "tag": "grave-redo",
    "animationCount": 2,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M21 7v6h-6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"
        }
      }
    ]
  },
  {
    "name": "UndoDot",
    "slug": "undo-dot",
    "tag": "grave-undo-dot",
    "animationCount": 3,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3 7v6h6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M21 17a9 9 0 0 0-15-6.7L3 13"
        }
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": "12",
          "cy": "17",
          "r": "1"
        }
      }
    ]
  },
  {
    "name": "RedoDot",
    "slug": "redo-dot",
    "tag": "grave-redo-dot",
    "animationCount": 3,
    "drawing": [
      {
        "tag": "path",
        "attrs": {
          "d": "M21 7v6h-6"
        }
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"
        }
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": "12",
          "cy": "17",
          "r": "1"
        }
      }
    ]
  }
] as const;
