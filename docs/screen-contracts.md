# Screen Contracts

## Home

- **Purpose:** Show the current week, explain planned-day markers, and surface
  the next scheduled activity.
- **Entry:** Initial page load or successful booking.
- **Actions:** Open available times.
- **States:** No activity scheduled; upcoming activity scheduled. Filled pebble
  markers indicate days with a planned activity.

## Available times

- **Purpose:** Let the user choose a sample time slot.
- **Entry:** The user chooses to view available times from Home.
- **Actions:** Select one slot and confirm.
- **States:** No selection; selected slot; no sample slots remaining.
- **Rules:** Confirmation is disabled until one available slot is selected.
  Five available choices are shown from a ten-slot future sample pool. After a
  slot is booked, the next future slot takes its place. When all sample slots
  are booked, a confirmed reset clears locally saved bookings and returns to
  the available-time choices.

## Choose activity

- **Purpose:** Recommend activities that fit the selected time and let the user
  choose one.
- **Entry:** The user confirms an available time.
- **Actions:** Select one activity and continue to confirmation.
- **States:** Recommended activity identified; selected activity; optional
  booking energy selected; saved location and equipment preferences edited.
- **Rules:** Choices remain grouped by category. The recommendation has a
  visible label. In Milestone 3C, only the top recommendation explains time,
  energy, location, and equipment as match, mismatch, or not compared; an
  unknown factor is never presented as a mismatch, and the explanations do not
  themselves change ranking. In Milestone 3D, match-only bonuses are added to
  the existing duration score: energy +2, location +1, and equipment +1.
  Mismatch and unknown add nothing; no scores are displayed. Separately from
  scoring, equipment-dependent activities are eligible for recommendation only
  when the required equipment is explicitly marked available. Otherwise, they
  remain visible and selectable as alternatives without the recommendation
  label. Activities remain grouped by category and are sorted by rank within
  each group. Only the top-ranked eligible activity receives the recommendation
  label and explanations; alternatives remain visible and lightweight. Every
  activity has a short, descriptive line. The selected state must not rely on
  colour alone. The optional energy check-in applies only to the current
  booking flow and is not persisted. Location and equipment preferences are
  saved locally and can be edited here on a later booking.

## Confirm activity

- **Purpose:** Review the chosen activity and time before saving.
- **Entry:** The user selects an activity.
- **Actions:** Confirm the booking; return to Home only after it is saved.
- **States:** Confirmation; storage error.
- **Rules:** A storage failure must be visible and must not be presented as a
  successful booking.

## Persistence

- Confirmed bookings are saved in browser `localStorage`.
- On reload, Home reads the saved bookings and displays the next upcoming one.
- This milestone uses local sample data and does not connect to a real calendar.

## Milestone 4A weekly awareness

- The domain can summarize bookings as `{ activitiesThisWeek, label }` for the
  current local Monday-Sunday week.
- Bookings from earlier or later weeks do not contribute to the count.
- Count ranges map to `Open Horizon` (0), `Light Activity` (1-2),
  `Steady Activity` (3-4), `High Activity` (5-6), and `Full Week` (7+).
- These labels describe planning volume only. They are not targets, intensity
  ratings, daily-coverage claims, stopping points, or booking restrictions;
  counts above seven remain valid.
- Milestone 4A exposes the domain facts only. Milestone 4B owns guidance, 4C owns
  presentation, and 4D integrates them on Home.

## Keyboard focus

- Moving to another screen places focus on that screen's heading, except after
  saving a booking, when focus moves to Home's primary action.
- Re-rendering a selected time or activity keeps focus on the selected card.

## Milestone 5 in-flow back navigation (planned)

- A back-arrow button appears in the upper-left corner of available-times,
  choose-activity, and confirmation screens.
- Back returns one step: available times to Home, activity selection to
  available times, and confirmation to activity selection.
- Valid in-progress choices are preserved. Changing a time clears a selected
  activity that no longer applies.
- Going back does not save or modify scheduled activities.
- Each button's accessible name identifies its destination. Focus returns to a
  preserved selection when possible, otherwise to the destination heading.
