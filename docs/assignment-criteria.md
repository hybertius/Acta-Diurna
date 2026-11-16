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

Plain Text
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

Plain Text
Time
↓
Context
↓
Activity
↓
Confirm

Or even:

Plain Text
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

Plain Text
This week:
2 activities planned.

One more activity would reach your goal.

or

Plain Text
You have already planned several activities this week.

No rush.

The sloth version of progress.

🦥
