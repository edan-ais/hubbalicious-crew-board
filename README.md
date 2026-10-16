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
