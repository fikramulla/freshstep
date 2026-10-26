---
doc: spec
status: approved
---

# FreshStep — Technical Spec

> Shipping revision approved October 26, 2026: ship the session-only tracking/activity loop. Reload or closing the page loses progress and returns to setup. Persistence, automatic day rollover, and daily check-in are deferred. Earlier descriptions of those features below are retained as deferred design, not shipped behavior.

## How This Works, In Plain Language
FreshStep is a website whose HTML supplies the page, CSS gives it its calm green/yellow styling, and JavaScript makes it respond to actions. Clicking plus changes the cigarette count, updates the circle, and saves the new count in this browser. Returning to the site reads that saved count and checks whether a new day has begun.

Node.js serves the files during local development and runs checks. Once deployed, GitHub Pages serves those same files; visitors need only a browser. There is no Python, account system, hosted database, or application server. Each person's count stays in their own browser and does not sync between devices.

## The Core Journey Through the System
Implements `prd.md > The Core Journey`.
1. The browser loads the page, styles, scripts, and bundled images.
2. The app reads and validates its saved record. Without a valid record, it shows setup.
3. Setup validates the current daily smoking count, calculates `Math.ceil(current * 0.75)`, and lets the person adjust the suggestion. Confirming saves the chosen limit, today's date, and count zero.
4. Each plus/minus action first checks the date, updates the count, saves it, and redraws the label, circle, and support. Counts cannot go below zero.
5. At `Math.ceil(limit * 2 / 3)`, support becomes prominent. Activities remain available below this threshold.
6. Selecting an activity opens its summary and cartoon. Closing it changes nothing. “I did it” closes the activity and opens encouragement/confetti; it does not change the count.
7. On a later local calendar date, the app saves a zero count and marks the daily check-in pending. The prior limit is displayed for confirmation or adjustment. Confirmation clears the pending flag so the check-in appears once per day.

## Stack
Learner accepted HTML, CSS, plain JavaScript, browser storage, and GitHub Pages after the tradeoffs were explained.
- **HTML and browser JavaScript modules:** no framework or compilation. [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
- **CSS:** responsive layout, circle styling, short confetti animation, and reduced-motion support. [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- **localStorage:** save one versioned JSON record. It persists across sessions but can be cleared or blocked and is tied to the site's origin. Local-development data does not automatically transfer to the deployed site. [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- **Node.js:** installed v24.21.0; npm.cmd v12.1.0 verified. Use built-in HTTP/file modules for a small local server and the built-in test runner for logic checks; no runtime npm dependencies needed. [HTTP](https://nodejs.org/docs/latest-v24.x/api/http.html), [test runner](https://nodejs.org/docs/latest-v24.x/api/test.html).
- **GitHub Pages:** serves the static application from the public repository's `/docs` directory. Available for public repositories on GitHub Free. [Overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

No Java, Python, API keys, external font service, or third-party confetti package is required.

## Where It Runs and How Someone Tries It
These are planned commands; the application files will be created in `5-build`.
- From the project root: `node scripts/serve.mjs` (also expose as `npm.cmd start`).
- Open `http://localhost:4173/` in a modern Edge, Chrome, Firefox, or Safari browser. The server binds to `127.0.0.1` and serves only `docs/`, including correct JavaScript MIME types and rejecting traversal paths. It must not expose project files or the learner profile.
- Run logic checks with `node --test` (also expose as `npm.cmd test`).
- Do not use a double-clicked `file:` URL for the app: module loading and storage behavior require serving it over HTTP/HTTPS. The planning HTML files remain standalone review artifacts.
- Stop the local server with Ctrl+C. If port 4173 is unavailable, report it clearly rather than silently selecting a new origin and appearing to lose saved data.

### Deployment and Recording
Create/use a public GitHub repository during shipping, push the reviewed source, then select Settings → Pages → Deploy from a branch → the publishing branch → `/docs`. Check the resulting `https://<username>.github.io/<repository>/` URL. Use relative asset/module links so repository subpaths work. Include `docs/.nojekyll` to publish the static files directly.
The actual account, repository name, and final URL remain shipping-time configuration. Deployment occurs after a working build is reviewed; this spec does not publish anything. No custom domain is required.

Record a short demo of setup 20 → 15, logging through 10 and 16, correction with minus, an activity, and the celebration. Use synthetic demo entries. Submission still requires the short demo video and public GitHub repository; the deployed link is an additional learner goal.

## Look and Feel
Implements `prd.md > Look and Feel` and `Screens and Layout`.
Use CSS variables for light green, light yellow, neutral light surfaces, and readable dark gray type. A system sans-serif font avoids downloading fonts. Keep generous spacing and a clear hierarchy: FreshStep brand and motivational copy, main count/circle and controls, then the activity collection. Collapse into one column on narrow screens without horizontal overflow.
Bundle a nature/fresh-air visual and representative cartoon illustrations for breathing, stretching, and walking. Original SVG illustrations can supply these without introducing a raster generation dependency; any sourced asset needs a recorded license and attribution. Do not rely on remote image URLs during use.
Use visible text alongside colors. Accessible labels, keyboard controls, visible focus, politely announced count updates, and readable contrast are part of implementation. Dialogs must support Escape, focus containment, and focus restoration. Confetti is brief, decorative, cleaned up after completion, and disabled with reduced motion.

## Components

### Page Shell and Styling
`docs/index.html` and `docs/styles.css`: responsive branded setup/tracker sections, activity cards, and native dialogs for activity detail and celebration. All image paths are relative. Implements `prd.md > Screens and Layout` and `Look and Feel`.

### Setup and Check-In Controller
`docs/js/app.js` connects the setup/check-in forms to pure rules. Require positive safe whole numbers for current count and chosen limit; display inline errors and retain previous valid values. On setup, calculate the suggestion and allow adjustment before confirmation. On the daily check-in, offer the prior limit and permit a changed value. Implements `prd.md > Starting Limit` and `Daily Check-In`.

### Daily Rules
`docs/js/domain.js`: pure functions for input validation, suggested limit, warning threshold, count adjustments, visual band, and local-day rollover. The visual band follows the agreed inclusive boundaries. Clamp graphical circle fill to 100% while always displaying the true count above the limit. Derive local `YYYY-MM-DD` from local date parts, not UTC `toISOString()`.
Check the day on load, when the tab regains visibility/focus, before mutations, and on a lightweight periodic check while visible. On date change, reset once and show the check-in even if the tab remained open overnight. A changed device calendar/time zone follows the current device date; there is no trusted server clock.
Implements `prd.md > Daily Counter and Circle`, `Daily Check-In`, and `States and Boundaries`.

### Browser Storage Adapter
`docs/js/storage.js`: read/write only key `freshstep:v1`, serialize JSON, validate schema/version, and catch storage-access errors. Never clear unrelated site storage. Maintain the usable record in memory if persistence fails and display “Your changes won’t be saved after you close this page.” An unreadable record leads to setup with an explanation; no claim of successful restoration. Implements `prd.md > States and Boundaries`.

### Activity Collection and Detail
`docs/js/activities.js`: a small fixed collection with stable ID, title, brief summary/steps, illustration path, alternative text, and source URL(s). Initial categories are comfortable breathing, gentle desk stretching, and a short walk where practical. No personalization service or content API.
During build, research authoritative sources for the actual exercise guidance and record links in `docs/sources.md`; this spec does not assert that unresearched instructions are ready. Show concise source links in activity details. Selecting a card opens the details; leaving does not mark completion. Implements `prd.md > Craving Activities`.

### Completion Celebration
`docs/js/app.js` and CSS: “I did it” triggers the agreed message and transient decorative confetti, then offers return to the tracker. Prevent duplicate completion events from repeated clicks while transitioning. No cigarette data is altered and no completion history is required. Implements `prd.md > Completion Celebration`.

### Local Server and Verification
`scripts/serve.mjs`: dependency-free Node HTTP server with a confined `docs/` root. `tests/domain.test.mjs` covers the meaningful arithmetic and daily transition cases; `tests/storage.test.mjs` covers invalid records and blocked storage through an injected fake storage object. Browser checks cover actual controls, dialogs, persistence, responsiveness, and motion behavior. Implements `prd.md > Features and Behavior` acceptance criteria.

## Data Model
One saved JSON object under `freshstep:v1`:
```json
{
  "version": 1,
  "baselinePerDay": 20,
  "dailyLimit": 15,
  "dateKey": "2026-10-09",
  "count": 0,
  "checkInPending": false
}
```
- Baseline is captured at setup and retained; it is not recalculated from logged counts.
- Limit changes at setup/check-in. Count changes through plus/minus and resets on date change.
- Date key tracks the device's current local calendar day. Pending survives a reload until the check-in is confirmed.
- Validate finite safe integers: baseline/limit ≥1 and count ≥0, with a valid calendar date, known schema version, and boolean pending flag.
- Threshold, circle fill, and color are derived, not saved. Open dialogs, selected activity, and confetti live only in memory and close on reload or day rollover.
- No name, smoking history, account credentials, activity log, or medical profile is collected. There is no network upload of the saved record.

## File Structure
```text
project_1/
├── docs/                       # Only this folder is published/served as the app
│   ├── index.html              # Setup, tracker, check-in, and dialogs
│   ├── styles.css              # Layout, colors, circle, and motion
│   ├── .nojekyll               # GitHub Pages static publishing marker
│   ├── sources.md              # Guidance sources and asset attribution
│   ├── js/
│   │   ├── app.js              # User events, rendering, and orchestration
│   │   ├── domain.js           # Pure count, limit, and date rules
│   │   ├── storage.js          # Validated persistence with fallback
│   │   └── activities.js       # Curated activity content and references
│   └── assets/
│       ├── nature.svg          # Original nature/fresh-air visual
│       ├── breathing.svg       # Representative cartoon
│       ├── stretching.svg      # Representative cartoon
│       └── walking.svg         # Representative cartoon
├── scripts/
│   └── serve.mjs               # Local development server
├── tests/
│   ├── domain.test.mjs         # Arithmetic and local-day transition checks
│   └── storage.test.mjs        # Persistence failure and validation checks
├── package.json               # type: module; start/test scripts; no dependencies
├── README.md                  # Setup, testing, demo, deployment, limitations
├── .gitignore                 # Preserve credential/profile exclusions
└── devpost/                   # Canonical learning/planning docs, not deployed
```
Existing curriculum folders remain untouched. The learner profile stays ignored by Git.

## External Services and Dependencies
GitHub Pages is the only runtime hosting service. Browser requests are ordinary `GET` requests for the app HTML, CSS, JavaScript, and images, returning static file bytes; no authentication or API keys are needed by visitors. No application API, database service, analytics, or third-party runtime requests are planned. Source links are visited only when selected.
Public-repository hosting availability and publishing steps were checked against GitHub's official documentation linked under Stack. No paid plan is required for this approach; hosting is subject to [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), which should be rechecked at deployment. No API rate limit is on the app's core path. GitHub authentication for publishing remains with the learner; never put credentials in chat or committed files.

## Important Failure Modes
- **Invalid input or decrement at zero:** inline explanation for invalid forms; disable minus at zero; preserve last valid data.
- **Blocked storage, malformed JSON, or unknown version:** explicit storage warning or setup recovery; usable in-memory session when saving is unavailable.
- **New day while the tab is open:** check date before interactions and on visibility/timer; close stale activity views, reset count, and request check-in once.
- **Missing illustration:** keep activity text and useful alternative text available; missing assets fail verification before shipping.

## Verification Approach
- Node checks: 20 → 15 and 10 → 8 suggestions; thresholds 15 → 10 and 8 → 6; count transitions at 9/10/15/16 and 5/6/8/9; nonnegative corrections; invalid numeric inputs; year/month/local-midnight rollover; check-in pending survives reload and clears on confirmation; storage throws and malformed/unknown records.
- Browser walkthrough: first-use setup and adjustment, plus/minus update all outputs, activities available below threshold and prominent at it, activity close versus completion, count unchanged by celebration, reload retention, new-day reset/check-in, invalid forms, keyboard dialog behavior, narrow-screen layout, and reduced-motion behavior.
- Deployment smoke check: repository-subpath module/image loading, no errors, synthetic setup/log/complete flow, and reload persistence. Confirm the published directory excludes `devpost/` and personal context.
- No test framework install is required. If browser automation is unavailable, document manual browser results rather than claiming automated coverage.

## What Was Simplified and Why
The learner accepted browser-only storage and plain JavaScript for a lightweight proof of concept, with no cross-device sync. Fixed activity content avoids a content service. Node's built-in tools avoid framework setup. CSS supplies confetti, and bundled original illustrations avoid runtime image dependencies. Deferred product features remain as recorded in the approved PRD.

## Decisions and Open Issues
**Learner choices:** no Python installation; Node already installed; lightweight additional tools acceptable. Accepted the proposed HTML/CSS/plain-JavaScript/localStorage/GitHub-Pages approach and its device-local persistence tradeoff.
**Implementation details derived from those choices:** dependency-free local server, `/docs` publishing root, module boundaries, one validated storage record, local-day rollover checks, and original bundled SVGs. Review of this spec confirms these details.
**Learning discussion:** the agent explained the click → JavaScript → circle/storage → return/load flow and Node's local role. The learner said they understood; no additional uncertainty was identified. This is reported understanding, not demonstrated implementation mastery.
**Environment:** Node v24.21.0 and npm.cmd v12.1.0 verified. PowerShell blocks npm.ps1; use npm.cmd or direct node commands without changing execution policy.
**Build-time tasks:** research and source the final activity summaries; create/verify illustrations and finalize tagline; verify browser behavior and accessibility. These do not change the agreed architecture. The repository/account and live URL are shipping configuration, not unresolved product choices.
