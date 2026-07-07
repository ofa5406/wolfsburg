---
title: "GitHub and Revision Trace"
type: "source-index"
status: "generated"
confidence: "high"
source_path:
  - "D:\vibe_lab\wolfsburg\.git\config"
  - "D:\vibe_lab\wolfsburg\wolfsburg-activity-map\.git\config"
tags:
  - "git"
  - "revision"
---

# GitHub and Revision Trace

## Main Repository

- Remote: `https://github.com/ofa5406/wolfsburg.git`
- Branch: `main`
- GitHub API audit: 3 merged PRs, no standalone issues, no PR comments or review comments found.

### Local Status at Vault Generation

```text
UNAVAILABLE: Command '['git', 'status', '--short']' returned non-zero exit status 128.
```

### Recent History

```text
UNAVAILABLE: Command '['git', 'log', '--oneline', '--decorate', '-n', '20']' returned non-zero exit status 128.
```

## Activity Map Repository

- Remote: `https://github.com/annestasiia/wolfsburg-activity-map.git`
- Branch: `master`
- GitHub API audit: 6 merged PRs, no standalone issues, no PR comments or review comments found.

### Local Status at Vault Generation

```text
M src/components/landing/CentralityMapSection.jsx
 M src/components/landing/ExportControl.jsx
 M src/components/landing/LivabilityMapSection.jsx
 M src/components/landing/MobilityMapSection.jsx
?? "cycle paths/"
?? embed/
?? vite.embed.config.js
```

### Recent History

```text
f054b6e (HEAD -> master, origin/master, origin/HEAD) feat(landing): add per-tier coverage circles to Hub Placement view
58dd9b9 fix(landing): bump export resolution to 3x (was 2x)
e4202cb fix(landing): pin Top view to a 3km scale bar, double export resolution
4478731 fix(landing): separate Top/Axonometry from Export menu, add Export Map (A3)
c099035 feat(landing): add Export button with Top/Axonometry views for all analysis maps
cb6668b (urban-design-recolor-2026-07-04) style(urban): recolor to hub-viewer palette + app-style monochrome chrome
a3ef542 fix(landing): video fully clickable, preconnect to project site
aecb9c9 feat(landing): link video to project website
f34d7ec fix(landing): reduce About/Analysis/Result body text to 14px
bef04c4 fix(landing): update description, video -15%, body text 20px
b3cabd6 fix(landing): mount maps only after typewriter completes
7c21b2d perf(landing): defer map sections 800ms so typewriter starts instantly
3067baf fix(landing): useLayoutEffect for typewriter, fires before map init
e02efe6 feat(landing): typewriter effect for <STADT.HUB> title
60f27cb fix(landing): shorten hero description
0ccf777 fix(landing): revert title/desc font to Helvetica Neue
5c52931 feat(landing): rename to <stadt.hub>, code-style description
90a0265 fix(landing): add preload=auto for video
6e94db0 fix(landing): video +30% width (494px), scroll label bigger + black
8f640df fix(landing): use BASE_URL for video path (GitHub Pages subdir)
```
