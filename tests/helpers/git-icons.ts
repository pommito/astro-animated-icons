export const gitIcons = [
  {
    name: "FolderGit", slug: "folder-git", tag: "grave-folder-git",
    animationCount: 6, shapes: 4,
    drawing: [
      {"tag": "path", "attrs": {"d": "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"}},
      {"tag": "circle", "attrs": {"cx": "12", "cy": "13", "r": "2"}},
      {"tag": "path", "attrs": {"d": "M14 13h3"}},
      {"tag": "path", "attrs": {"d": "M7 13h3"}},
    ],
    steps: [
      {"child": 2, "delay": 0.15, "mode": "draw", "opacityDelay": 0.1},
      {"child": 3, "delay": 0.3, "mode": "draw", "opacityDelay": 0.2},
      {"child": 4, "delay": 0, "mode": "draw", "opacityDelay": 0},
    ],
  },
  {
    name: "FolderGit2", slug: "folder-git-2", tag: "grave-folder-git-2",
    animationCount: 7, shapes: 4,
    drawing: [
      {"tag": "path", "attrs": {"d": "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"}},
      {"tag": "circle", "attrs": {"cx": "13", "cy": "12", "r": "2"}},
      {"tag": "path", "attrs": {"d": "M18 19c-2.8 0-5-2.2-5-5v8"}},
      {"tag": "circle", "attrs": {"cx": "20", "cy": "19", "r": "2"}},
    ],
    steps: [
      {"child": 2, "delay": 0.1, "mode": "draw"},
      {"child": 3, "delay": 0.4, "mode": "reverse"},
      {"child": 4, "delay": 0.7, "mode": "draw"},
    ],
  },
  {
    name: "GitBranch", slug: "git-branch", tag: "grave-git-branch",
    animationCount: 10, shapes: 4,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "18", "cy": "6", "r": "3"}},
      {"tag": "line", "attrs": {"x1": "6", "x2": "6", "y1": "3", "y2": "15"}},
      {"tag": "circle", "attrs": {"cx": "6", "cy": "18", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M18 9a9 9 0 0 1-9 9"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.4, "mode": "reverse"},
      {"child": 3, "delay": 0.7, "mode": "draw"},
      {"child": 4, "delay": 0.4, "mode": "reverse"},
    ],
  },
  {
    name: "GitCommitHorizontal", slug: "git-commit-horizontal", tag: "grave-git-commit-horizontal",
    animationCount: 6, shapes: 3,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "12", "cy": "12", "r": "3"}},
      {"tag": "line", "attrs": {"x1": "3", "x2": "9", "y1": "12", "y2": "12"}},
      {"tag": "line", "attrs": {"x1": "15", "x2": "21", "y1": "12", "y2": "12"}},
    ],
    steps: [
      {"child": 1, "delay": 0.15, "mode": "default", "opacityDelay": 0.1},
      {"child": 2, "delay": 0, "mode": "default", "opacityDelay": 0},
      {"child": 3, "delay": 0.3, "mode": "default", "opacityDelay": 0.2},
    ],
  },
  {
    name: "GitCommitVertical", slug: "git-commit-vertical", tag: "grave-git-commit-vertical",
    animationCount: 6, shapes: 3,
    drawing: [
      {"tag": "path", "attrs": {"d": "M12 3v6"}},
      {"tag": "circle", "attrs": {"cx": "12", "cy": "12", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M12 15v6"}},
    ],
    steps: [
      {"child": 1, "delay": 0, "mode": "default", "opacityDelay": 0},
      {"child": 2, "delay": 0.15, "mode": "default", "opacityDelay": 0.1},
      {"child": 3, "delay": 0.3, "mode": "default", "opacityDelay": 0.2},
    ],
  },
  {
    name: "GitCompareArrows", slug: "git-compare-arrows", tag: "grave-git-compare-arrows",
    animationCount: 12, shapes: 6,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "5", "cy": "6", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M12 6h5a2 2 0 0 1 2 2v7"}},
      {"tag": "path", "attrs": {"d": "m15 9-3-3 3-3"}},
      {"tag": "circle", "attrs": {"cx": "19", "cy": "18", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M12 18H7a2 2 0 0 1-2-2V9"}},
      {"tag": "path", "attrs": {"d": "m9 15 3 3-3 3"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.4, "mode": "reverse"},
      {"child": 3, "delay": 0.4, "mode": "fade-delayed-return"},
      {"child": 4, "delay": 0.7, "mode": "draw"},
      {"child": 5, "delay": 0.4, "mode": "reverse"},
      {"child": 6, "delay": 0.4, "mode": "fade-delayed-return"},
    ],
  },
  {
    name: "GitCompare", slug: "git-compare", tag: "grave-git-compare",
    animationCount: 10, shapes: 4,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "18", "cy": "18", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M13 6h3a2 2 0 0 1 2 2v7"}},
      {"tag": "path", "attrs": {"d": "M11 18H8a2 2 0 0 1-2-2V9"}},
      {"tag": "circle", "attrs": {"cx": "6", "cy": "6", "r": "3"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.4, "mode": "reverse"},
      {"child": 3, "delay": 0.4, "mode": "reverse"},
      {"child": 4, "delay": 0.7, "mode": "draw"},
    ],
  },
  {
    name: "GitFork", slug: "git-fork", tag: "grave-git-fork",
    animationCount: 12, shapes: 5,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "12", "cy": "18", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"}},
      {"tag": "circle", "attrs": {"cx": "6", "cy": "6", "r": "3"}},
      {"tag": "circle", "attrs": {"cx": "18", "cy": "6", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M12 12v3"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.4, "mode": "reverse"},
      {"child": 3, "delay": 0.7, "mode": "draw"},
      {"child": 4, "delay": 0.7, "mode": "draw"},
      {"child": 5, "delay": 0.4, "mode": "reverse"},
    ],
  },
  {
    name: "GitGraph", slug: "git-graph", tag: "grave-git-graph",
    animationCount: 15, shapes: 6,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "5", "cy": "6", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M5 9v6"}},
      {"tag": "circle", "attrs": {"cx": "5", "cy": "18", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M12 3v18"}},
      {"tag": "circle", "attrs": {"cx": "19", "cy": "6", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M16 15.7A9 9 0 0 0 19 9"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.4, "mode": "reverse"},
      {"child": 3, "delay": 0.7, "mode": "draw"},
      {"child": 4, "delay": 0.4, "mode": "reverse"},
      {"child": 5, "delay": 0.7, "mode": "draw"},
      {"child": 6, "delay": 0.4, "mode": "reverse"},
    ],
  },
  {
    name: "GitMerge", slug: "git-merge", tag: "grave-git-merge",
    animationCount: 7, shapes: 3,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "18", "cy": "18", "r": "3"}},
      {"tag": "circle", "attrs": {"cx": "6", "cy": "6", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M6 21V9a9 9 0 0 0 9 9"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.7, "mode": "draw"},
      {"child": 3, "delay": 0.4, "mode": "reverse"},
    ],
  },
  {
    name: "GitPullRequestClosed", slug: "git-pull-request-closed", tag: "grave-git-pull-request-closed",
    animationCount: 12, shapes: 6,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "6", "cy": "6", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M6 9v12"}},
      {"tag": "path", "attrs": {"d": "m21 3-6 6"}},
      {"tag": "path", "attrs": {"d": "m21 9-6-6"}},
      {"tag": "path", "attrs": {"d": "M18 11.5V15"}},
      {"tag": "circle", "attrs": {"cx": "18", "cy": "18", "r": "3"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.4, "mode": "reverse"},
      {"child": 3, "delay": 0.7, "mode": "fade"},
      {"child": 4, "delay": 0.7, "mode": "fade"},
      {"child": 5, "delay": 1, "mode": "reverse"},
      {"child": 6, "delay": 1.3, "mode": "draw"},
    ],
  },
  {
    name: "GitPullRequestCreate", slug: "git-pull-request-create", tag: "grave-git-pull-request-create",
    animationCount: 12, shapes: 5,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "6", "cy": "6", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M6 9v12"}},
      {"tag": "path", "attrs": {"d": "M13 6h3a2 2 0 0 1 2 2v3"}},
      {"tag": "path", "attrs": {"d": "M18 15v6"}},
      {"tag": "path", "attrs": {"d": "M21 18h-6"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.4, "mode": "reverse"},
      {"child": 3, "delay": 0.7, "mode": "reverse"},
      {"child": 4, "delay": 0.7, "mode": "reverse"},
      {"child": 5, "delay": 1, "mode": "fade"},
    ],
  },
  {
    name: "GitPullRequest", slug: "git-pull-request", tag: "grave-git-pull-request",
    animationCount: 9, shapes: 4,
    drawing: [
      {"tag": "circle", "attrs": {"cx": "18", "cy": "18", "r": "3"}},
      {"tag": "circle", "attrs": {"cx": "6", "cy": "6", "r": "3"}},
      {"tag": "path", "attrs": {"d": "M13 6h3a2 2 0 0 1 2 2v7"}},
      {"tag": "line", "attrs": {"x1": "6", "x2": "6", "y1": "9", "y2": "21"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "draw"},
      {"child": 2, "delay": 0.7, "mode": "draw"},
      {"child": 3, "delay": 0.4, "mode": "reverse"},
      {"child": 4, "delay": 1, "mode": "draw"},
    ],
  },
  {
    name: "Github", slug: "github", tag: "grave-github",
    animationCount: 5, shapes: 2,
    drawing: [
      {"tag": "path", "attrs": {"d": "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"}},
      {"tag": "path", "attrs": {"d": "M9 18c-4.51 2-5-2-7-2"}},
    ],
    steps: [
    ],
  },
  {
    name: "Gitlab", slug: "gitlab", tag: "grave-gitlab",
    animationCount: 2, shapes: 1,
    drawing: [
      {"tag": "path", "attrs": {"d": "m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z"}},
    ],
    steps: [
      {"child": 1, "delay": 0.1, "mode": "long"},
    ],
  },
] as const;
