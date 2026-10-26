---
doc: prd
status: approved
---

# FreshStep — Product Requirements

> Shipping revision approved October 26, 2026: ship the session-only tracking/activity loop. Reload or closing the page loses progress and returns to setup. Persistence, automatic day rollover, and daily check-in are deferred. Earlier descriptions of those features below are retained as deferred design, not shipped behavior.

A clean, encouraging web app for smokers taking manageable daily steps toward quitting.
Source: `scope.md > Who It's For`, `The Unique Kernel`, and `The POC Boundary`.

## The Core Journey
1. Open FreshStep and enter the number of cigarettes currently smoked per day.
2. See a suggested daily limit equal to 75% of that number, rounded up. Adjust it if desired, then begin.
3. See today's count start at zero, a clearly labeled count circle, and a minus/count/plus control.
4. Use plus to log a cigarette and minus to correct the count. The circle and support update immediately.
5. At two-thirds of the daily limit, rounded up, the circle turns yellow and craving support becomes prominent. Above the limit, the circle turns orange/red and remains supportive.
6. Choose an alternative activity, read a short summary with a representative cartoon, and follow it.
7. Tap “I did it” to see “Great work—you’re on your way!” with a short confetti animation.
8. On a new day, start the count at zero. Show the previous chosen limit and ask “How are you doing? Would you like to change your limit?” Let the person proceed with it or change it.

Source: `scope.md > The Core Loop` and `What "Working" Looks Like`.

## Screens and Layout
The agreed surfaces are first-use setup, the main daily tracker, a daily check-in, an activity detail, and a celebration popup. These do not require separate pages.
The opening view includes the FreshStep brand. The tracker prominently presents the circle and a control with minus on the left, the count in the middle, and plus on the right. Activity details pair a concise summary with its matching cartoon and an “I did it” action.
Exact placement of secondary elements remains a design detail; no additional navigation areas are required.

## Look and Feel
Clean, simple, modern, and motivational. Light green and light yellow surfaces with gray lettering; gray text must remain readable against the light backgrounds. Nature and fresh-air imagery communicate the healthy-lifestyle theme. Activity illustrations are representative cartoons, such as someone walking or stretching. Use friendly, nonjudgmental language, including after exceeding a limit.
A motivational tagline is wanted; final copy remains open. “A fresh start, one small step at a time” is an agent-proposed option, not a confirmed learner choice. Typography may be chosen during technical planning to support the agreed clean, readable style.
Source: `scope.md > Inspiration & Identity`.

## Features and Behavior

### Starting Limit
Ask for current cigarettes per day. Calculate the suggested limit as ceiling(current count × 0.75). Permit adjustment before proceeding.
- Entering 20 suggests 15; entering 10 suggests 8.
- The chosen limit is visibly identified as the daily limit.
- This calculation is a user-requested planning feature, not an individualized medical recommendation.

### Daily Counter and Circle
Plus adds one cigarette; minus removes one. Show the actual count and the chosen limit together, such as “10 of 15 today.” The circle represents cigarettes logged, rather than a reward for consuming cigarettes.
Let T = ceiling(daily limit × 2/3). Green applies below T, yellow from T through the limit inclusive, and orange/red above the limit.
- Limit 15: 0–9 green, 10–15 yellow, 16 and above orange/red.
- Limit 8: 0–5 green, 6–8 yellow, 9 and above orange/red.
- Changes made through either control immediately update the count, color, and relevant support prominence.
- Logging remains possible above the limit; the actual number remains visible.

### Craving Activities
Provide a small set of workplace-friendly activities covering breathing, gentle stretches or yoga, and walking where practical. Choosing one shows brief instructions and a matching cartoon.
- At T and above, bring the friendly support and alternatives forward visibly.
- Completing an activity is distinct from selecting it: only “I did it” triggers the celebration.
- Completion does not subtract a cigarette from the recorded count.
- Activity copy will need appropriate sourcing and review during implementation; no medical outcome is promised.

### Completion Celebration
After “I did it,” display “Great work—you’re on your way!” and a short confetti animation. Make it possible to return to the tracker. Provide the same encouragement without motion when reduced motion is requested.

### Daily Check-In
On a new day, reset cigarettes logged to zero while retaining the previous chosen limit. Show that limit and ask how the person is doing and whether they wish to change it. They can confirm it or set a different limit. Changing it recalculates the color/support threshold.
Source for all behaviors: `scope.md > The Core Loop`, `The POC Boundary`, and `Questions for Product Definition`.

## States and Boundaries
- **First use:** ask for the current smoking count before calculating the starting limit.
- **No cigarettes logged:** show zero and the chosen limit clearly.
- **Approaching the limit:** yellow circle and prominent activity support.
- **Over the limit:** orange/red circle, accurate count, and friendly support without punishment.
- **Activity selected:** show instructions and cartoon; no completion celebration yet.
- **Activity completed:** encouragement and confetti; cigarette count unchanged.
- **New day:** count starts at zero, prior limit is offered through the check-in.
- **Input safeguards:** accept whole-number current counts and limits of at least 1; explain invalid or missing entries without losing a valid saved setting. Disable minus at zero. Zero-smoking goals are deferred pending a distinct design because percentage-based progress needs special handling at zero.
- **Same-day persistence:** reopening on the same browser/device preserves today's count and chosen limit. Cross-device synchronization is outside this first version.
- **Activity access:** activities remain available before the threshold; reaching it changes prominence rather than unlocking support. The activity view can be closed without completing it.

## Product Decisions
- Name: FreshStep, chosen by the learner.
- Starting suggestion: 75% of current daily smoking, rounded up; the learner explicitly wanted upward rounding and adjustable limits.
- Daily check-in: show the previous chosen limit and ask whether to proceed; count resets to zero each day.
- Support threshold: two-thirds of the daily limit rounded up, explicitly confirmed after the examples of 10/15 and 6/8.
- Logging: minus on the left and plus on the right of the displayed count for easy correction.
- Activity presentation: a short summary and corresponding cartoon.
- Activity completion: explicit “I did it,” encouraging popup, and confetti, confirmed during scope.
- Colors: light green, light yellow, and gray lettering.

## What We're Building
The setup, daily counter and circle, threshold-based support, a small illustrated activity collection, completion celebration, and daily check-in/reset described above. A working web app suitable for a short demo and public GitHub repository, with deployment as a learner goal.

## Deferred From the POC
Savings calculations, quitting-product information, a broader health library, and a more extensive quit plan remain deferred to protect the agreed core loop. Accounts, cross-device sync, external notifications, and a history dashboard are not required to demonstrate it and are approved exclusions from this first version.

## Non-Goals
This experiment does not demonstrate smoking-cessation effectiveness or provide personalized medical treatment. It demonstrates tracking, practical activity access, and encouragement. No product recommendations are part of this version.

## Open Questions
The learner approved same-day persistence, activity access below the threshold, input safeguards including deferring zero limits, and the stated exclusions during PRD review. No product-defining questions remain open.
Final tagline, activity wording and illustrations, exact layout, and the single orange/red over-limit color can be finalized during implementation within the agreed direction. Technical choices and hosting belong in `4-spec`.
