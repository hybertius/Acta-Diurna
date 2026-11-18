# Assignment Criteria

## Brief

Milestone 1 is a working happy path for the Training Planner. A user can choose
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

Hur känns det idag?

○ Låg
○ Normal
○ Hög

Requirements:

✅ Optional

✅ Applies only to current booking flow

✅ Resets for next booking

✅ Does not persist

✅ Does not change ranking yet

1. Location preference can be stored

Users can provide a preferred environment.

Example:

Inomhus
Utomhus

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

Guidance 🌱
 Reality 🌍
Milestone 4: Weekly Guidance
Goal

Help the user understand their planning situation without creating pressure.

Examples

The document already hints at things such as: "You've planned 2 activities this week. Would you like one more?" or "Looks like a busy week. No rush."

Acceptance Criteria

✅ User sees a lightweight weekly summary

✅ Guidance is supportive, not judgemental

✅ No streaks

✅ No gamification

✅ No penalties

✅ No "you failed"

✅ Existing booking flow remains unchanged

✅ Home screen can surface one contextual guidance message

Possible implementation order

4A - Weekly awareness

Count activities planned during the current week.

Examples:

This week: 2 activities planned.

One activity planned so far.

No activities planned yet.

4B - Guidance messages

Generate small supportive messages based on the count.

Examples:

Count Message
0 No activities planned yet. A small step is enough.
1-2 A good start for the week.
3-4 Several activities planned. Nice balance.
5+ Looks like a full week. Remember to rest too.
4C - Home integration

Place the guidance directly beneath:

WeekCalendar
UpcomingActivityCard

which already exist in the component inventory

Task 1 - Weekly Summary Engine

Goal:

Given bookings, answer:

TypeScript
{
activitiesThisWeek: 2
}

Acceptance:

✅ Counts activities in current week

✅ Ignores other weeks

✅ Returns 0 if none exist

No messages yet.

No UI yet.

Just facts.

Task 2 - Guidance Rules

Convert:

TypeScript
2 activities

into:

TypeScript
"A good start for the week."

Acceptance:

✅ One message returned

✅ Deterministic

✅ Supportive

✅ No guilt

✅ No pressure

A tiny function.

Something like:

TypeScript
getWeeklyGuidance(count)

Task 3 - Guidance Component

Build:

🌱 This week
A good start for the week.
2 activities planned.

as its own component.

Acceptance:

✅ Can render any guidance

✅ Handles empty state

✅ Uses design tokens

No Home integration yet.

Task 4 - Home Screen Integration

Now attach it beneath:

WeekCalendar
UpcomingActivityCard

Exactly where the roadmap suggests.

Acceptance:

✅ Appears automatically

✅ Updates after booking

✅ Survives refresh

Task 5 - Empty Week Experience

This is where Milestone 2 whispers from the bushes.

Instead of:

0 activities

show:

No activities planned yet.

A small step is enough.

Acceptance:

✅ Intentional

✅ Calm

✅ Friendly

✅ No judgement

This is the "alive" part.

Task 6 - Weekly Transition Check

Verify behaviour when:

week changes
old bookings exist
no bookings exist
many bookings exist

Acceptance:

✅ Messages remain sensible

✅ No weird counts

✅ No negative encouragement

If we were pair-programming tonight, I'd actually stop after Task 1.

Not because it's hard.

Because it's the foundation stone.

Current planner:

Bookings
↓
Home

Milestone 4 foundation:

Bookings
↓
Weekly Summary
↓
Guidance
↓
Home

Get the weekly summary working first and the rest becomes mostly UI and wording.

Actual Milestones

Milestone 4A - Weekly Awareness
TypeScript
activitiesThisWeek -> label

Examples:

No bookings
Lightly booked
Moderately booked
Busy day
Very busy day

Purely descriptive.

Milestone 4B - Guidance

Only later decide whether the planner should actually say things like:

A small step is enough.

or

Looks like a busy week.

Because that's a much bigger product decision than counting bookings.

Open Horizon - Empty day
Quiet Activity - Lightly booked
Steady Activity - Moderately booked
High Activity - Busy day
Maximum Activity - Very busy day
