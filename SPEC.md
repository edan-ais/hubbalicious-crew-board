# Hubbalicious Crew Board: what it does, the rules, and why

For Edan, who is wiring this up for real. Written from the working template at https://edan-ais.github.io/hubbalicious-crew-board/ (repo `edan-ais/hubbalicious-crew-board`). This describes behavior as built and the reasoning David gave. Where something is not built, it says so.

## 0. Read this first

- **It is a template, not a system.** `index.html` is one static page. All state lives in the browser's `localStorage` under the key `hcb-v1`. Two tablets do not share anything. Nothing is sent anywhere.
- **Test data is baked in.** The schedule, the 7 past shifts in the staffing view, the shift history that feeds the scores, the staffing and sales numbers, and the crew list are made up. Replace them with real sources.
- **Identity is by personal code, and the codes are in the page source.** That is fine for a template and wrong for production. Codes need to be checked server-side. The template codes are Kristen 1111, Ava 2222, Jake 3333, Mia 4444, Noah 5555, Haley 6666.
- **The assistant is called Hubba in the UI.** Internally it was "Scout" (Kristen's agent). Hubba is the presentation name for a mascot dog. Function names in the code still say `scout`.
- **The chat bot is a keyword stand-in.** It is a set of regexes, not an AI. The real version calls the thin software layer described in section 9.
- **Handbook text is draft.** It carries yellow "David to verify" and blue "Fill in or confirm" markers on purpose. Do not ship it to staff as policy.

## 1. Two tablets, one codebase

| Tablet | Address | Purpose |
|---|---|---|
| Front of house | `/` | Keeps the store clean and the front running. Wall-mounted iPad. |
| Back of house | `/?station=back` | Cooking and packaging. Planned second tablet in the back. |

**Why.** David wants the front tablet to be "all about keeping the store clean and letting the front of the store run properly," with a separate tablet for production. So production work is a distinct list on its own tablet, not mixed into the front task list.

**How it works.** Same page, switched by the query string. In back mode the title becomes "Back of House", the subtitle "Cooking and packaging tablet.", and only two tabs show: Production and Handbook. The Production list is placeholder content: cook fudge, caramel corn and peanut brittle; pack gift boxes and 1 lb bags; label and date everything; clean the kitchen station. It follows the same attribution rule as the front lists (section 4). It has no music, scoring or crew board.

**Wiring note.** Make "station" a real device setting instead of a URL flag, and give each tablet its own task and checklist set.

## 2. Header and shared chrome (every tab, both tablets)

- **Header.** The real Hubbalicious Sweet Shoppe logo (from hubbalicious.com), the page title ("Crew Board" or "Back of House"), a one-line description, and a link to the other tablet's view. The gumball icon is the favicon and home-screen icon.
- **Need a manager button.** Red pill, top right of the header. See section 8.
- **Clock in (left, green) and Clock out (right, grey until someone is in).** See section 3.
- **Tabs, in order:** Dashboard, Tasks & Music, Opening & Closing Checklist, Crew, Handbook. David set this order and these names.
- **Footer.** "You're on camera. Store cameras are recording in this area." It is the only disclosure in the app. David asked for all demo language to come out and for this camera notice to replace it.

**Why the top-right button.** David wanted it where staff look without hunting. The header is shared by every tab, so one button covers every screen.

## 3. Identity, clock in, clock out

**Rule: no one is ever recorded without typing their own code.** No name pickers, no tap-to-select. The old "I am" picker is hidden and unreachable.

- **Clock in.** Prompts for a personal code. A wrong code is refused. A valid code opens a briefing: how many tasks are on the board, the opening and closing item counts, and a manager note. The person must tick "I've read this" before "Start shift" enables. The briefing's manager note is a placeholder line.
- **Clock out.** Prompts for the code again. It must match the person clocked in, or it is refused. Then the closing wall applies (section 5).
- **One person at a time is "the current user" on this tablet.** The template tracks a `clocked` map of who is in, plus the current user. Real deployments with several people logged in at once need real sessions.
- **Who's working today** (Dashboard). A schedule (placeholder: Kristen 11-4, Haley 11-2, Mia 1-4, Jake 1-4) with live status: "Not in yet" or "Clocked in at time". Anyone who clocks in without being scheduled still appears, marked "not on schedule". Real scheduling is a separate project (David called it the HUBLHours conversation).

**Why codes.** Every action has to be attributable to a real person, and the tablet is shared. David's words: no anonymous check-offs.

**Wiring note.** Replace the hard-coded code table with server verification. Rate-limit and lock out on repeated wrong codes. Never ship codes in client code. Consider short PINs plus a per-device token.

## 4. Attribution on every check-off

**Rule: nothing gets checked off without a typed code, and the result shows on the item itself.**

- Tapping an item asks for a code. Team items and every checklist item also accept a second code, which marks the item "done together".
- The item then shows a pill with the person's initials: green "JA Done by Jake", or blue "JA MI Jake + Mia - done together". It is visible at a glance, not buried in a log.
- Only the person who confirmed an item, or Kristen, can undo it.
- This applies to tasks, the opening and closing checklist, and the back-of-house production list.

**Why.** David: "Each task needs to be confirmed by who did it, or did both employees do it, before it gets checked off." Two people working together is a normal case, so it has to be representable, and it must not be anonymous.

## 5. The opening and closing checklist (one list that flips)

**Concept.** One checklist, not two. The opener works the opening list. When every item is checked and the opener signs off (with a code), the list clears and becomes the closing list for the closer. Signing off the closing list flips it back to opening.

- **Items.** Opening: turn on lights and TVs; count the register drawer; fire up the shake machine and soda station; fill candy bins; check dates on fresh items; unlock the front door. Closing: wipe all counters; clean the shake machine; empty trash; sweep and mop; restock cups and lids; lock up and set the alarm. (Placeholder lists. Kristen should set the real ones.)
- **Sign-off** needs every item confirmed, then a code. It logs who and when, shows "Last sign-off", and flips the phase.
- **Closing is locked until 3:00 PM.** The closing list cannot be started until one hour before the 4:00 PM close. Before 3 PM it shows locked with the unlock time. The 4 PM close time is fixed in the code. Real build: read store hours from config.
- **The store cannot close until the closing list is checked off and signed off.** Enforced at clock-out (below).
- **Peer grading and notes.** After a handoff, the incoming person can grade the previous person's list item by item (Good or needs work) and leave a note on how to improve. Notes go to Kristen. The graded teammate sees a note only after Kristen approves it. A simple tone check flags harsh words. Notes are framed as improvement notes. The grading data is not persisted in the template.

**The closing wall (clock-out rule).** When the last person clocked in tries to clock out while the closing list is still pending, they see a message that the store cannot close until the list is checked off and signed off. It lists each outstanding item (or says the list is locked, or all checked but not signed). They choose one of three:
1. Cancel and go finish.
2. Type **INCOMPLETE** ("I didn't get everything completed"). The clock-out goes through. It is logged with who and when. The unfinished items carry over to the next closer as a yellow "Carried over" note on the list. Kristen gets a red-flag line with the items.
3. **Kristen's code** overrides, and the override is logged.

Clock-outs while others are still clocked in, or before the opening list is done, are not blocked.

**Why.** David wants a hard rule that the store is not closed until the checklist is done, but also an honest exit: "At the end of their shift... there needs to be an override that says I didn't get everything completed." The goal is that incomplete work is declared and handed forward, not silently bypassed and not trapping a kid who has to go home.

**Not built.** INCOMPLETE is available any time the wall shows. It is not yet tied to a person's scheduled shift end, because the schedule is placeholder. David was asked whether to restrict it to the actual shift end and has not answered.

## 6. Tasks, tiers, timing, and approvals

### Tasks and Music tab
Tasks and music sit side by side (David said he likes them that way). Tasks on the left, music on the right, stacked on narrow screens.

- **Today's Tasks.** Eight placeholder tasks (wipe counters, restock cups and lids, refill candy bins, clean the shake machine, sweep, wipe the soda station, take out trash, front window). A kid taps a task, enters a code (two for team tasks), and it checks off and counts right away, with an attribution pill.
- **Points.** Each task has a point value (default 1 or 2). Kristen can change points, add or remove tasks, mark a task as a "team task", and set tiers, all through the Hubba chat (section 7). No one else can change tasks.
- **No approval step.** David removed the Scout approval queue. Tasks check off on the person's code alone. Kristen's oversight happens through her own view (notes, flags, staffing signal), not a gate. Note: David had earlier described a yellow/green/red redo flow, then said to remove approval. The final instruction was to remove it. A one-more-chance redo rule was also described and then superseded. Confirm with David before rebuilding any gate.
- **Priority tiers.** Each task carries a tier: Priority 1 - Production, Priority 2 - Restock, Priority 3 - Cleaning. The list is sorted by tier, and each task shows a colored tag. A short legend above the list explains the order in plain words, and tapping a tag explains it in one line. Defaults: restock cups and refill bins are Restock; everything else is Cleaning. No front-of-house task is Production yet.
  **Why.** David first wanted production (packaging, cooking) to outrank wiping the counter. Then he reframed: "it's all important." The store has to hit a standard and the work has to get done. So tiers order the work but do not mean lower tiers are optional. The real signal is staffing (below).
- **Expected time per task.** Each task shows "about N min" (placeholder baselines, 5-25 min). Flags: finished in under 40% of baseline ("quick one, quality beats speed") or taking over 2x baseline ("anything in the way? ask Kristen"). Either one creates a constructive note that goes into Kristen's review as a "Hubba (timing)" item. The kid does not see it until Kristen approves it. Timing runs from the person's last check-off or clock-in to this check-off. The 40% and 2x cutoffs are guesses.
  **Why.** David: "When we find the baseline, we'll know how long each task should take, where kids aren't just burning through it or spending an hour on a task that should take 10 minutes... those notes we can leave as constructive criticism."
  **Wiring note.** Baselines are meant to be tuned from real data over time, per task. Store each completion's duration to make that possible.

### Music
Stations unlock as total points rise. Points thresholds: Songs Loop (0, the deliberately bad default), Pop Hits (2), Throwback Jams (4), Chill Lo-fi (6), Your Pick (8). Music is only on the Tasks & Music tab (David asked to remove it from the Dashboard). The template plays no audio; the stations list stands in for a real music source.
**Why.** The default station is bad on purpose so that finishing tasks earns better music.

## 7. Dashboard and the Hubba chat

**Dashboard** holds Who's working today and the Hubba chat. Nothing else. (The slow-sales log line appears there too when an alert is acknowledged.)

**Hubba chat.**
- A large chat panel with Hubba's avatar (a dog emoji placeholder; the real mascot art has not been found, see section 10), chat bubbles, and quick-reply chips: Share an idea, Ask a question, Who's working?, My tasks. Greeting: "Hubba's here to help! Ask anything about the store, share what you'd like to see improved, or ask me questions."
- You must be clocked in to chat.
- **Every message has a speaker button** that reads it aloud with the browser's speech synthesis. This includes the greeting and the user's own messages. Emoji are stripped before speaking. Same approach as the help audio. Real build: use a real TTS voice for Hubba, consistent across the store.
- **What Hubba answers:** who's working today, what tasks are still open, and store questions, which it points to the matching handbook section by title. Anything else from a kid becomes a named idea or question for Kristen. **Kids' messages are never edits.** Only Kristen's messages can change tasks.
- **Kristen's chat commands:** add a task, remove a task, make a task a team task, set a task's points, set a task's tier ("set Sweep floor to production").
- Kristen sees an ideas list under the chat.

**Why.** David wants the assistant to invite store questions and improvement ideas, not read like a suggestion box. The kid-facing view stays simple. Kristen controls the task list.

**Help buttons.** Each task and checklist item has a "?" button that opens plain-language steps with an audio button. The steps are generic placeholders. Kristen would write or record the real ones.

## 8. Urgent "Need a manager" button

- **Where.** Top right of the header, red, on every tab on both tablets. On narrow screens it moves under the title as a full-width bar.
- **Template behavior.** Tap, then enter a code. A wrong code is refused. A valid code shows a red banner for 60 seconds ("Manager alerted at 7:50 PM by Ava. Help is on the way.") and adds a red URGENT line to Kristen's review with who and when.
- **Not built.** Nothing is sent to anyone's phone. The confirmation text is shown regardless. Do not present this as a working alarm yet.
- **Real build.** Text David and Kristen immediately (push as backup) with who pressed it, the time, and which tablet or area. Keep the alert open until a manager acknowledges it, log who picked it up and when, and escalate to the other manager after a set window. Leave room on each alert record for camera context (section 9).

**Why.** David: "There should be an urgent button, need to get a hold of manager ASAP." The word "ASAP" was dropped from the label per his request. He expects it to end up "sending a signal out, like a text to me and Kristen, and through the security cameras we can talk to them."

## 9. Backend-phase design notes (none of this is built)

### Slow-sales signal and alert
**What exists.** A banner and a ding on the tablet. It is an orange pulsing banner ("Slow store - come look at me! Slow means task time."). It dings every 4 seconds until someone taps "I'm here - silence it" and types a code. A wrong code leaves it on. The Dashboard logs who silenced it and when. Hidden test control: add `?demo` to the address for a "Simulate slow sales" button.
**What it means.** A slow store is task time. David: when sales are low, the tablet dings to pull the kids in, and someone has to physically acknowledge it to silence it.
**Browser caveat.** Browsers block sound until the page has been tapped once, so the iPad needs one tap after each load. A kiosk setup or a native wrapper avoids this.
**Real build.** Key it off register sales. Define the window and threshold, owned by Kristen.

### Idle voice check-in
When the inactivity signal trips (no sales, no tasks, no activity for a set window), the store music ducks and Hubba says a check-in line ("Hey, just checking in") over the TV or speakers. It uses the same detector as the slow-sales ding, so one signal drives both: the tablet dings and shows the banner, and the TV or speakers duck the music and speak. This needs register and activity data and a TV or speaker that is playing the music. Window length, repeat interval and quiet hours should be Kristen's settings.

### Texts to David and Kristen
See section 8: the urgent button should text both of them. Slow-sales and idle alerts may reuse the same notification path.

### Cameras
Security cameras with two-way talk are planned as a core store feature. Managers will see and talk to staff through them, and they will tie into the dashboard over time. Design the alert flow so each alert can carry camera context later: the camera covering that tablet or area, a snapshot or clip from just before the press, and a link to a live view with two-way talk. Alerts should stay open until acknowledged, with escalation.
The in-app "You're on camera" footer covers the staff-facing notice. When two-way audio goes live, David needs to check what the notice and any posted signs must say. Recording and audio rules are legal items for him to verify, not something the app decides.

### Staffing signal (built in the template, on fake data)
**Where.** Crew tab, visible only when Kristen is clocked in. A per-shift list shows how many people were on shift next to how many items were left unfinished, plus a plain verdict. Example: "Looks like a staffing problem, not a worker problem. Shifts with unfinished work averaged 2.2 people. Shifts that finished everything averaged 3.5." If staffing was similar on good and bad shifts, it says it is not clearly a staffing issue and points to which tasks keep carrying over. An INCOMPLETE declaration adds a row for today.
**Why.** David: "It's all important. The store needs to be at a certain level and then the work has to get done, but if we're being unfair and not scheduling enough people on staff to handle it all, we need to know that." Repeated carry-overs mean scheduling, not a worker problem.
**Caveats.** The 7 past shifts are made-up numbers, now unlabeled. The count is people clocked in during the shift, not coverage by time of day. Real hours need real schedule and clock data. David has no personal code yet, so there is no David view.

### Shift scores and the crew board
- **Crew tab, kids' view.** A simple board: stars, streaks ("3 great shifts in a row"), and a plain-words trend ("Better than last week!", "Fresh start next shift"). No scores, medians, rates, or negative labels. Getting better is celebrated, wherever you rank.
- **Manager view (Kristen only).** A median shift score per person, where 1.00 means expectations were met. The score uses about 1 task per person per hour, softened when sales are high (customers come first) and scaled to staffing. Hidden background values stand in for sales and staffing (2 staff, $250/hr). David did not want those inputs shown, so they are not in the UI.
- **Why.** The math is Kristen's alone; kids see encouragement. Scoring is an input, not a verdict. Kristen's judgment is final on promotions and raises.
- **Wiring note.** Feed the score from real clock-ins, register sales and task data. Score on a median over several shifts, not one shift.

### County reports
The store hires kids through a county second-chances program and sends assessments back to the county. The shift and score data should export as a per-kid report: shifts worked, reliability (clock-ins, on-time), tasks done, improvement trend, and Kristen-approved notes. The county's assessment form has not been received, so shape the export to match once we have it. This is data about program participants, so the real build needs access limits (Kristen and David only), and only Kristen-approved notes should ever leave the system.

### Thin-layer architecture (David's preference, for your handoff)
Put a thin software layer in front of the data. Hubba and Kristen manage tasks, notes and settings through that layer and never touch the repo or the code. Once the app is locked down, nothing they do can break it. The task-list chat commands in this template are what would call that layer. Whether Hubba talks to it directly or through another service is your call. This is why Kristen's controls today are all chat commands, not code edits.

## 10. Handbook tab

Ten sections plus an overview and a closing list of open questions for David and Kristen: how we work; schedule and breaks; clock in/out; phones; food safety and hygiene; dress code; the task board; raises and promotions; conduct; pay. It has a search box and collapsible sections, a "Draft - not final store policy" banner, and a count of open items.

- Yellow callouts are **[DAVID TO VERIFY]** items: California rest and meal break rules, minors' work permits and hour limits, food handler cards, current minimum wage, discipline and harassment-notice wording, and the county program's rules. They are not stated as fact.
- Blue callouts are **[FILL IN OR CONFIRM]** items: shop facts we do not know (call-out notice, pay dates, review cadence, grading scale).
- The text is in `handbook.md`. Run `node build-handbook.mjs` to regenerate `handbook-data.js` after edits.
- The task-board section still describes photos and approvals. That is draft text predating David's decision to remove approvals, and it needs a pass.
- Not legal advice. Do not publish to staff until David has checked the flagged items.

**Why.** David did not want to do paperwork that night, so the draft went in as-is with the open decisions clearly marked for later.

## 11. Legacy and loose ends

- **Phone page** (`/#phone`). Left over from the photo-approval flow: sign in with a code, upload task photos, Kristen sets baseline photos. It syncs only through the same browser's localStorage. It is unused now that approvals are gone. Remove it or repurpose it.
- **Baseline photos.** Same story: they were for photo comparison and are no longer used.
- **Hubba mascot art.** The avatar is a dog emoji. A search of three Drive accounts and hubbalicious.com found no pink Hubba dog art. Two other Drive accounts were not searched (info@aicd10.com is disconnected; info@helpingunitebusinesses.com was skipped), and the main Hubbalicious Drive folder would not list. Ask David for the file. Put it in `img/` and swap it into the chat header. Hubba is meant to become the store's character across every screen, TVs included, so keep the name, the avatar and the voice consistent.
- **Logo.** The real Hubbalicious Sweet Shoppe logo is in `img/`, from hubbalicious.com. That site's terms reserve its logos, which is fine for the owner's own use but worth knowing.
- **Hidden test controls.** `?demo` shows: simulate slow sales, pretend a task took N minutes, unlock the closing list early, reset data. They are not in the normal UI.
- **Persisted vs session state.** Saved in `hcb-v1`: tasks, points, tiers, who is clocked in, checklist phase and progress, sign-offs, done tasks. Session only: peer grades, timing notes, the INCOMPLETE flags and carry-over, urgent-button log, overrides, the slow-sales log. Decide what must survive a reload.

## 12. Open questions for David

1. Should INCOMPLETE be limited to a person's actual scheduled shift end?
2. Is the approval queue gone for good? He also described a yellow, green and red redo flow with one more chance and a Kristen conversation. The latest word was to remove approval.
3. Real checklist items, task list, points and tiers, and which tasks are Production.
4. Real baseline times per task.
5. Store hours, and whether the closing unlock stays at one hour before close.
6. Hubba art, and a voice for Hubba.
7. The legal items in the handbook and the camera and audio notice.

## 13. Files in the repo

| File | What it is |
|---|---|
| `index.html` | The whole app: markup, styles, script |
| `handbook.md` | Handbook source text |
| `build-handbook.mjs` | Builds `handbook-data.js` from `handbook.md` |
| `handbook-data.js` | Generated handbook data the page loads |
| `img/` | Logo and gumball icon |
| `README.md` | Short overview and design notes |
| `SPEC.md` | This document |
