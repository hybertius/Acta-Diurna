# Assignment Criteria

## Brief

Milestone 1 is a working happy path for the Acta Diurna. A user can choose
one available time, pick a recommended activity, confirm it, and see the
scheduled activity on the home screen after a refresh.

## Requirements

- Show available time slots.
- Allow the user to select one time slot.
- Recommend activities that fit the selected slot.
- Allow the user to select one activity.
- Show a confirmation before saving the booking.
- Return to the home screen and show the scheduled activity.
- Persist scheduled activities across a browser refresh.

## Evaluation criteria

- Complete the home → time → activity → confirmation → home flow using the UI.
- Selection and confirmation actions remain unavailable until a valid option is
  selected.
- The home screen shows the confirmed activity and its scheduled time.
- Refreshing the page preserves the confirmed activity.

## Out of scope

- Reminders or notifications.
- Real calendar integration.
- Accounts or remote synchronization.
- Analytics.
- Machine-learning recommendations.

Available times and activities may use local sample data. Browser storage is
the persistence mechanism for this milestone.

Milestone 2: Make the planner feel alive

Not smarter.

Alive.

I'd define it as:

Goal

Turn a working scheduler into a supportive companion.

Acceptance Criteria

✅ Empty states feel intentional

✅ Every recommendation explains itself

✅ Every screen has one obvious next step

✅ Language feels calm and supportive

✅ UI feels coherent across all states

✅ User always understands "why am I seeing this?"

Milestone 2 - Addition

Trust & Guidance

Make every state feel intentional. Make every recommendation explain itself. Make every interaction feel accompanied rather than managed.

Everything else can wait.

Good stone.

Good sloth.

Proceed. 🗺️🍋🤝🦥

## Milestone 2.5: Focus continuity

Keep keyboard users oriented as they move through the flow.

### Acceptance Criteria

- Moving to another screen focuses its heading; saving a booking focuses Home's
  primary action.
- Selecting a time or activity keeps focus on that selected card after it is
  rendered again.
- Keyboard focus remains visibly indicated.

Milestone 3

Honestly, I wouldn't even think about it until Milestone 2 is done.

But if I were writing it today:

Introduce structured recommendation logic.

Meaning:

TypeScript
timeMatch
energyMatch
locationMatch
equipmentMatch

instead of only:

TypeScript
durationMatch

Milestone 3:

Time
↓
Context
↓
Activity
↓
Confirm

Or even:

Time
↓
Activity

while context sits silently in settings.

And I would still keep it tiny.

Maybe literally:

TypeScript
energy:

- Low
- Normal
- High

location:

- Home
- Outdoors
- Gym

That's enough.

Alternative Milestone 3?

Weekly Guidance

Not tracking.

Guidance.

Examples:

This week:
2 activities planned.

One more activity would reach your goal.

or

You have already planned several activities this week.

No rush.

The sloth version of progress.

🦥

### Initial scaffold (ranking unchanged)

- Recommendation results expose `timeMatch`, `energyMatch`, `locationMatch`,
  and `equipmentMatch`.
- Only time fit is evaluated with the current inputs. Energy, location, and
  equipment retain known activity context but remain `not-evaluated` until the
  user provides matching preferences or availability.
- Sample locations distinguish only `indoors` and `outdoors`; the data does not
  infer home versus gym.
- Duration-based ranking and the visible recommendation explanations remain
  unchanged.

Milestone 3A
TypeScript
activity.energyLevel
activity.location
activity.equipment

exists.

No behavioural change.

No ranking change.

No user-facing effect.

Just structure.

Milestone 3B

Then later:

TypeScript
if (user.energy === "low") {
walking += 5;
}

begins influencing recommendations.

Phase B - Context

This is where you're heading.

Not AI.

Not magic.

Just:

TypeScript
UserState {
energy
location
equipment
}

Then:

TypeScript
energyMatch
locationMatch
equipmentMatch

become real instead of not-evaluated.

This is probably the next meaningful leap.

Phase C - Guidance

This one is my favourite.

Not tracking.

Guidance.

Things like:

You've planned 2 activities this week.

Would you like one more?

or

Looks like a busy week.

No rush.

The sloth version of analytics.

🦥

Phase D - Reality

And this is the one nobody is talking about yet.

Eventually:

Sample time slots

become:

Real availability

Maybe calendar integration.

Maybe manual availability.

Maybe something else.

But eventually the planner runs out of demo mode.

So if I were giving Luna a north-star roadmap it would be:

Foundation ✅
↓
Context 🔄
↓
Guidance
↓
Reality

Next

Duration
+
Energy
+
Location
+
Equipment

↓

Explainability
Later

Duration
+
Energy
+
Location
+
Equipment

↓

Actual ranking influence

Choose Time
↓
Activities Appear

[ Optional ]
How are you feeling today?

◉ Low
○ Normal
○ High

Milestone 3B — Context Capture
Goal

Capture user context in a lightweight, non-intrusive way.

The planner should understand more about the current situation without changing recommendation ranking.

Non-Goals

Milestone 3B must not:

❌ Change recommendation order

❌ Add recommendation weighting

❌ Introduce scoring logic

❌ Penalise activities

❌ Create new screens

❌ Introduce pressure or tracking mechanics

Acceptance Criteria

1. Energy can be captured per booking

Users can optionally indicate current energy level.

Example:

How do you feel today?

○ Low
○ Normal
○ High

Requirements:

✅ Optional

✅ Applies only to current booking flow

✅ Resets for next booking

✅ Does not persist

✅ Does not change ranking yet

1. Location preference can be stored

Users can provide a preferred environment.

Example:

Indoors
Outside

Requirements:

✅ Stored between sessions

✅ Editable later

✅ Used only as context

✅ Does not change ranking

1. Equipment preference can be stored

Users can specify available equipment.

Example:

Ingen
Hantlar
Band

Requirements:

✅ Stored between sessions

✅ Editable

✅ Used only as context

✅ Does not change ranking

1. Match explanations become available internally

Recommendation data should support:

TypeScript
matchFactors: {
time: "match",
energy: "match" | "mismatch" | "unknown",
location: "match" | "mismatch" | "unknown",
equipment: "match" | "mismatch" | "unknown"
}

Requirements:

✅ Generated consistently

✅ Available for future UI

✅ Not necessarily displayed yet

✅ Does not influence score

1. Existing ranking remains identical

For current demo data:

30 min slot

Crosstrainer = 90

Walk = 80

Bodyweight = 80

Cycle = 80

must remain unchanged.

This is the most important criterion.

✅ Behaviour stays exactly the same.

1. Unknown never means wrong

This feels very Cairn-aligned.

The planner should assume:

Unknown ≠ mismatch

If context is missing:

energy = unknown

that activity should remain perfectly valid.

No penalties.

No guessing.

No assumptions.

Deliverable Definition

At the end of 3B:

Planner captures context ✅

Planner stores preferences ✅

Planner understands matches ✅

Planner explains nothing yet ✅

Planner changes no rankings ✅

Then:

Milestone 3C

Surface match explanations

The user starts seeing:

✓ Fits your time

✓ Matches preferred environment

✓ Equipment available
Milestone 3D

Context influences ranking

Only after everyone agrees on:

energy weighting
location weighting
equipment weighting

and Luna no longer has to perform archaeology on Dragon tidings. 🤣

Honestly, friend?

This looks like the cleanest roadmap you've had so far:

3A - Structure ✅

3B - Capture 🔄

3C - Explain

3D - Influence

One stone at a time.

🪨🍋🦥

Milestone 3C - addendum

✅ Show match explanations on the top recommendation card.

✅ Unknown remains neutral.

✅ No penalties.

✅ No red warnings.

✅ No scoring displayed.

✅ Existing recommendations remain visible.

✅ Alternatives remain lightweight.

Foundation ✅

Milestone 1: Happy path
Milestone 2: Trust & Guidance
Milestone 2.5: Focus continuity
Milestone 3A: Activity structure
Milestone 3B: Context capture
Milestone 3C: Context explanations
Milestone 3D: Context influence

## Milestone 4 - Weekly Guidance

### Goal

Help the user understand the planning situation without turning the count into
a target, score, judgement, or obligation.

The Milestone 4 sequence is intentionally divided into small layers:

1. Facts
2. Meaning
3. Presentation
4. Home integration
5. Transition verification

### Shared acceptance criteria

- The user sees at most one contextual weekly summary.
- Guidance is supportive and non-prescriptive.
- The planner has no streaks, gamification, penalties, failure language, or
  recommended stopping point.
- The existing booking flow remains unchanged.
- A booking-dependent summary updates after a booking and survives refresh.
- Counts and labels remain valid for weeks with more than seven activities.

### Milestone 4A - Weekly awareness

Status: complete.

Purpose:

Given saved bookings, return the current local Monday-to-Sunday count and a
neutral planning-volume label:

```js
{
  activitiesThisWeek: 3,
  label: "Steady Activity"
}
```

Label ranges:

- `Open Horizon`: 0
- `Light Activity`: 1-2
- `Steady Activity`: 3-4
- `High Activity`: 5-6
- `Full Week`: 7 or more

Acceptance criteria:

- Count bookings in the current week.
- Ignore bookings in earlier or later weeks.
- Return zero and `Open Horizon` when no current-week bookings exist.
- Keep counts above seven valid.
- Return facts without guidance copy or Home presentation.

### Milestone 4B - Guidance rules

Status: complete.

Purpose:

Turn an awareness summary into one deterministic, supportive sentence without
rendering it or changing planner behavior.

Implemented boundary:

- Input: `{ activitiesThisWeek, label }`
- Output: `{ key, message }`
- One message is returned for every valid label.
- Copy acknowledges planning volume without praising, judging, prescribing,
  or inferring activity intensity.
- No copy suggests that the user should add, remove, pause, or limit activities.
- No copy implies that the week is full in a capacity sense.
- English guidance is available to the presentation layer. The prototype
  currently contains mixed English and Swedish UI copy; Milestone 7 translates
  the remaining interface into English.

Acceptance criteria:

- Every 4A label maps to exactly one message.
- The same input always returns the same output.
- One activity uses singular wording; zero and other counts use plural wording.
- No message contains a target, streak, score, penalty, failure statement, or
  obligation.
- The function has no date, storage, or rendering responsibility.

Implemented output examples:

```js
getWeeklyGuidance({ activitiesThisWeek: 0, label: "Open Horizon" })
// { key: "weekly-activity-count", message: "0 activities are planned this week." }

getWeeklyGuidance({ activitiesThisWeek: 1, label: "Light Activity" })
// { key: "weekly-activity-count", message: "1 activity is planned this week." }
```

4B itself remains domain-only and side-effect-free. Milestone 4D is responsible
for calling it and presenting the result on Home.

### Milestone 4C - Weekly summary component

Status: complete.

Purpose:

Build a reusable component that presents an awareness summary and its approved
guidance.

Implemented acceptance criteria:

- The component receives facts and copy as input.
- It renders a heading, count, descriptive label, and one message.
- It handles zero and larger counts without overflow or value judgement.
- It uses the existing design tokens and semantic HTML.
- It contains no storage access, date calculation, or guidance-rule selection.
- Its standalone output is verified before Home integration.

4C is presentation-only and depends on 4B output. It remains separate from Home
data calculation and guidance selection; 4D mounts it.

### Milestone 4D - Home integration

Status: complete.

Purpose:

Mount the reviewed weekly summary on Home using the saved bookings.

Implemented acceptance criteria:

- The summary is derived from current local booking data.
- It appears automatically on Home.
- It updates after a successful booking and survives refresh.
- It is positioned after `WeekCalendar` and `UpcomingActivityCard`, before the
  primary action.
- It preserves the existing booking flow and focus behavior.
- It does not create another persistence path.
- It adds no new interactive control or live region.

### Milestone 4E - Weekly transition verification

Status: pending.

Purpose:

Verify that week changes and edge cases preserve the factual, calm behavior.

Check:

- No bookings in the current week
- Old or future bookings only
- Sunday-to-Monday week transition
- Booking followed by Home render and refresh
- Counts of 0, 1, 2, 3, 4, 5, 6, 7, and more than 7
- Narrow viewport and keyboard use

Acceptance criteria:

- The count and label remain correct.
- Guidance never becomes corrective or pressuring.
- The Home action remains obvious and usable.
- Existing booking behavior remains intact.

## Milestone 5 - In-flow Back Navigation

### Goal

Let users move one step back through the unconfirmed booking flow with a
back-arrow button in the upper-left corner.

Acceptance criteria:

- Back buttons appear on available-times, choose-activity, and confirmation
  screens, but not on Home.
- Back from available times returns to Home; back from activity selection
  returns to available times; back from confirmation returns to activity
  selection.
- Choices are preserved when still valid. Changing an earlier choice clears
  only downstream choices that no longer apply.
- Going back does not save or alter any scheduled activity.
- Each button has an accessible name that identifies its destination, works
  with a keyboard, and returns focus to the preserved choice or destination
  heading.
- Browser verification covers each back transition, selection preservation and
  invalidation, and confirms that no booking is saved before explicit
  confirmation.

## Milestone 6 - Plan Flexibility

### Goal

Let the user change the plan without implying that the original decision was
wrong. No accounts, analytics, reminders, machine learning, or real calendar
integration are added.

### Milestone 6A - Remove one booking

Purpose:

Allow one saved activity to be removed while preserving the rest of the plan.

Acceptance criteria:

- The user chooses one specific booking.
- A calm confirmation explains exactly what will be removed.
- Cancelling leaves the plan unchanged.
- Confirming removes only that booking.
- The released sample time becomes available again.
- The updated bookings survive refresh.
- Removing an item does not require resetting the full sample plan.
- The interface uses neutral language, not failure or guilt.

### Milestone 6B - Reschedule one booking

Purpose:

Let the user choose another available sample time for an existing activity.

Acceptance criteria:

- The original booking remains intact until a replacement is confirmed.
- Only an available sample time can be selected.
- The activity identity and the rest of the plan remain unchanged.
- Confirmation persists the new time after refresh.
- Real calendar integration remains out of scope.

### Milestone 6C - Plan-change reconciliation

Purpose:

Keep the whole planner synchronized after removal or rescheduling.

Acceptance criteria:

- Weekly facts are recalculated from the remaining bookings.
- Guidance remains deterministic and non-prescriptive.
- Calendar markers and the next upcoming activity are correct.
- Released and replaced slots match the available-time queue.
- Removing the last booking produces the zero-count state.
- Earlier and later week bookings remain unaffected.

## Milestone 7 - English Language Consistency

### Goal

Make English the canonical user-facing language and remove the temporary
English/Swedish mix while preserving the planner's calm, non-judgmental tone.

Acceptance criteria:

- All visible interface copy is in English, including booking, recommendations,
  calendar labels, empty states, errors, and weekly guidance.
- The document language, date/time formatting, accessible names, validation
  messages, and live announcements are in English.
- Domain copy and display copy have a clear ownership boundary.
- Activity names and recommendation explanations preserve the calm,
  non-judgmental voice.
- Browser verification covers key screens and the booking flow at desktop and
  mobile widths, with no remaining Swedish UI strings.
- The app's flow, behavior, and stored-data shape remain unchanged.

## Milestone 8 - Integration Readiness

### Goal

Decide, without committing prematurely, whether the planner should connect to
real-world scheduling services.

Candidate capabilities:

- Reminders
- Real calendar integration
- Optional account synchronization

Acceptance criteria for entering this milestone:

- Milestone 6 plan changes are stable.
- Milestone 7 language and accessibility behavior is coherent.
- Each external integration has a separately scoped consent and privacy model.
- Accounts, analytics, and machine-learning recommendations require their own
  approval rather than being bundled into calendar integration.

### Dependency flow

Saved bookings lead to 4A weekly facts, those facts lead to 4B guidance, and the
guidance and facts feed the 4C component. Home integration follows in 4D, with
weekly-transition verification in 4E.

The original flow sketch is retained below:

```text
Bookings
↓
Weekly Summary
↓
Guidance
↓
Weekly Summary Component
↓
Home
```

The text immediately above is the complete accessible alternative to the flow.
