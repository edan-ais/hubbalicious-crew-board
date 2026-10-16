# Hubbalicious Crew Board

Employee dashboard template: task list, music stations that unlock as tasks get done (default is the Hubbalicious songs loop), and a leaderboard with smiley awards.

`index.html` is a single static page with demo data. Open it in a browser or serve it with GitHub Pages.

## Design notes (not built yet)

- **County assessment export.** The store hires kids through a county second-chances program and sends assessments back to the county. The shift and score data should export as a per-kid report: shifts worked, reliability (clock-ins, on-time), tasks done, approved vs sent-back, improvement trend, and Scout/Kristen-approved notes. The county's actual assessment form is still to come, so the export should be shaped to match it once we have it.
- **Privacy.** This is data about program participants. Real build needs access limits (Kristen and David only), and only Kristen-approved notes should ever leave the system.
- **Scoring is an input, not a verdict.** Kristen's judgment stays the final word on promotions, raises and county assessments.
- **Architecture preference (David, for Edan's handoff).** Put a thin software layer in front of the data. Scout and Kristen manage tasks, approvals and notes through that layer, and never touch the repo or the code. Once the app is locked down, nothing Scout or Kristen does can break it. The Scout approval queue and the task-list chat in this mock would call that layer. Whether Scout talks to it directly or through another service is Edan's call.

### Hubba the dog (brand note)
The assistant shows up as **Hubba**, the Hubbalicious dog mascot (it is Scout behind the scenes; the name is presentation only). The plan is for Hubba to become the store's character across every screen, store TVs included, not just this app. So keep Hubba's treatment friendly and consistent: same name, a dog avatar (a 🐶 placeholder for now, to be swapped for real mascot art), and the same warm voice anywhere it appears. The real Hubba art, once it exists, should go in `img/` and replace the avatar in the chat header.

### Idle check-in (backend phase, not built in the template)
Intended behavior: when the inactivity signal trips (no register sales, no tasks checked off and no tablet activity for a set window), the store music ducks and Hubba says a short check-in over the TV or speakers, something like "Hey, just checking in." It uses the same signal as the slow-sales ding, so one detector drives both: the tablet dings and shows the banner, and the TV or speakers duck the music and speak. This needs real register and activity data plus a TV or speaker that is playing the music, so it waits for the backend. The voice line should be Hubba's, consistent with the mascot treatment above. Thresholds (the window length, how often to repeat, quiet hours) should be set by Kristen.

### Urgent "Need a manager ASAP" button (backend phase for the alert)
The red button is on every screen, front and back. In the template, tapping it asks for the employee code, logs who pressed it and when, shows a "Help is on the way" confirmation, and adds an URGENT line to Kristen's review. The real build should fire an immediate alert to Kristen and David (text and push notification) with who pressed it, the time and which tablet it came from, and should keep nagging until someone acknowledges it. It needs a backend and a messaging service to send the alerts, so none of that exists yet.

### Cameras and the urgent button (backend phase, planned)
Security cameras with two-way talk are planned as a core store feature. Managers will be able to see the floor and talk to staff through them, and the cameras will tie into the dashboard over time. The "Need a manager" button should be designed with that in mind:
- Pressing it texts both David and Kristen right away (with push as a second channel). The message says who pressed it, the time and which tablet or area.
- The alert record should be able to carry camera context later: which camera covers that tablet or area, a snapshot or short clip from just before the press, and a link that opens a live view with two-way talk. Leave room for a camera reference on each alert even though nothing is attached today.
- Keep the alert open until a manager acknowledges it, and log who picked it up and when. If nobody acknowledges within a set window, escalate to the other manager.
- The camera disclosure in the app footer ("You're on camera") already covers the staff-facing notice. When two-way talk goes live, check what the disclosure and any posted signs need to say. Recording and audio rules are legal items for David to verify, not something the app decides.
Nothing in this section is built in the template. It is a note so the alert and its data are shaped to take camera context later.
