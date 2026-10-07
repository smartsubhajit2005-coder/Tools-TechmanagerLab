# Tools Site — Standing Instructions (locked 2026-10-07, evolves by owner call only)

Repo: smartsubhajit2005-coder/Tools-TechmanagerLab (public, Pages → branch `main`, root).
Live: https://smartsubhajit2005-coder.github.io/Tools-TechmanagerLab/
Social (published: Instagram only): https://www.instagram.com/techmanagerlab/ — Facebook/LinkedIn pending owner URLs.
Local: E:\Projects\techmanagerlab-site\

## House rules
- Brand system = Video 1 (navy #02143F→#013091→#0247C4, circuit SVG, cyan #2EE6FF, Montserrat, logo.png badge). No other palette.
- Hero = brand name + brand info, never campaign titles.
- SEO: keywords front-loaded, numbers, INR only, active voice. No next-upload-date on general content (Series only).
- One microsite per project: `tools/<slug>/index.html` (episode embed + downloads + offer) + chips link on landing.
- Published videos live at page bottom, newest first, thumbnail rows (168px), data-driven from `videos.json`.
- Hero featured block shows newest upload (auto from `videos.json`).
- Downloads are direct files (.xlsx/.md). No signup gates, no backend.

## Pipeline (on every YouTube publish)
1. Run `workflows/list_videos.js` → refreshes `videos.json` in site repo.
2. Add `tools/<slug>/` microsite + landing chip + project block.
3. Commit + push `main`. Pages rebuilds in ~1 min.

## Hardening (locked)
- Issues/Wiki/Projects/Discussions: off. Branch `main`: no force-push, no delete.
- Owner pushes directly. Public = read-only for strangers.

## Decisions log
- 2026-10-07: repo created as Tools-TechmanagerLab (@ invalid in names).
- 2026-10-07: Pages workflow→branch deploy (workflow 404, fixed).
- 2026-10-07: logo.png in header. Microsites section → compact chips (owner pick).
- 2026-10-07: hero renamed to brand name + brand info.
- 2026-10-07: brand block drafted, SEO version shown, posting pending owner approval.
- OPEN: ads on Pages (allowed by GitHub; needs AdSense account, unapplied).
