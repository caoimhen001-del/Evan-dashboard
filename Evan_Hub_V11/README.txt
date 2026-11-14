EVAN'S HUB – V11 (Navy Tactical)

FILES: index.html + app.js + icons + netlify/functions/health.mjs (Garmin sync). Deploy the whole folder.

HOW IT WORKS
- Mon–Sun weeks. Target every week: 4 gym + 3 cardio (a refereed match counts as cardio).
- Sunday: "Plan next week" prompt. Shifts are pre-filled from his rota (Day 1 = Fri 20 Nov; overtime nights 14–15 Nov).
  He adds matches, places 4 + 3, then commits. A default plan is pre-filled and counts even if he never opens it.
- One free move per week; extra moves, removals and late logs show in the Sunday review.
- Monday morning check-in: weight + front/side photo. Due every Monday, marked late on any other day.
  The first check-in is Mon 16 Nov (the rest of this week is a starter week with pro-rated targets).
- Weekly streak = weeks in a row hitting 4 + 3.
- Milestones: every 3 kg, goal weight, streak and check-in milestones, monthly step challenge.
- Monthly step challenge: steps/day × days in the month (or a custom goal), with a daily +/- and running balance.
- Home banner: wedding + next big-day countdown, week streak, rotating motivational line (or his own 'why'), and a live line on this week's target.
- Daily essentials as 4 rings: steps, water (tap +500ml), protein (tap +20g), training. Undo button.
- Big days (Progress tab): suit fitting + wedding built in; add stag, holidays etc. with an optional target weight. These count as milestones.
- Workout logger: PT programme (all 4 days + PT notes), last weights pre-filled, tick a set to start the 60s rest timer,
  history, Smart Swap (remembered per exercise), progressive overload prompts, + warm-up set / + extra set on every exercise,
  15-min cardio finisher: StairMaster, Run or Row (calories or a reason required).
- Share my week: one tap, opens the iPhone share sheet (Messages/WhatsApp) with a weekly summary.

DEPLOY (his Netlify site only)
Drag-and-drop deploys don't reliably include the Netlify function (and its @netlify/blobs package),
so for automatic steps use GitHub or the Netlify CLI:
  Option A – GitHub (same as your own hub, separate repo): upload this folder to a new repo
             > Netlify > his site > Site configuration > Build & deploy > Link repository.
             Build command: (blank)  Publish directory: .  Functions directory: netlify/functions
  Option B – Netlify CLI on the Mac:  cd ~/Downloads/Evan_Hub_V10 && npm install && npx netlify deploy --prod
Then:
1. Site configuration > Environment variables > HEALTH_TOKEN = a long random phrase. Redeploy once.
2. iPhone: open the site in Safari > Share > Add to Home Screen.
3. Settings > Sync key = same phrase > Save > Test connection (it says 'Connected' or explains what's wrong).
4. Build the 'Evan Steps' Shortcut + 5 daily automations (steps shown in Settings > Garmin sync).
5. Settings > "Add reminders to Calendar".
6. With Evan: Settings > Your rules; Progress > Big days (targets, add the stag).

DATA
- Everything, including photos, is stored on his phone only. Settings > Export every couple of weeks (photos included).
- V10 uses a new storage key, so it starts fresh (V9 test data is not carried over).

V11 DESIGN
- Navy Tactical theme: navy base, amber-orange for actions, mint green for done, red for misses.
- Line icons throughout (no emojis); DIN condensed numbers; new EH app icon.
- Week shown as a scoreboard; yellow / red card warnings for 1 / 2 missed sessions.
- After each workout: Full Time summary (minutes, kg lifted, beat-last-time, PBs) + celebration on a new PB or week won.
- Milestone celebration on the Monday check-in.
- Same storage key as V10, so any data already on his phone carries over.
