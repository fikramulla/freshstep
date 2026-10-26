# FreshStep

A calm, browser-based cigarette tracker with workplace-friendly alternatives and encouragement for completing an activity.

## Run locally

Requires Node.js 24 or later. No packages need installing.

```powershell
node scripts/serve.mjs
```

Open http://localhost:4173/ in a modern browser. Stop with Ctrl+C. Alternatively use `npm.cmd start` on Windows. Open the served URL rather than double-clicking the HTML file. Only `docs/` is served.

## Check

```powershell
node --test
```

Or `npm.cmd test`. Node checks the counting rules and server confinement. Real-browser behavior requires the hands-on walkthrough below when browser automation is unavailable.

## Demo walkthrough

Use synthetic data: enter 20 to receive a suggested limit of 15, adjust if desired, and begin. Minus should be disabled at zero. Log through 9 (green), 10 (yellow with prominent support), 15 (yellow), and 16 (orange). Use minus to correct a log. Activities should be available at any count. Closing an activity should do nothing to the counter; completing it should show encouragement without changing the count.

Try invalid inputs, a narrow window, keyboard-only dialog navigation (Tab, Shift+Tab, Escape), and your system's reduced-motion preference. On closing either dialog, focus should return to its activity card.

## Current build boundary

This release is session-only: reload or closing the page loses progress and returns to setup. Persistence, automatic day rollover, and daily check-in are deferred. Nothing is uploaded. This proof of concept demonstrates an interaction, not smoking-cessation effectiveness or personalized treatment. The 75% suggestion is an adjustable planning feature.

Guidance and original illustration attribution are recorded in [docs/sources.md](docs/sources.md). The app uses no external runtime dependencies or remote assets.

## Planned GitHub Pages publishing

After review and authorization to publish, push to a public GitHub repository and select Settings > Pages > Deploy from a branch > the publishing branch > /docs. Assets use relative paths. Check the published repository-subpath URL and repeat the demo walkthrough. Hosting is optional; the demo video and public repository are separate submission artifacts.
