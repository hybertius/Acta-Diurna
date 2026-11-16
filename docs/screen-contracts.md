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
  When all sample slots are booked, a confirmed reset clears locally saved
  bookings and returns to the available-time choices.

## Choose activity

- **Purpose:** Recommend activities that fit the selected time and let the user
  choose one.
- **Entry:** The user confirms an available time.
- **Actions:** Select one activity and continue to confirmation.
- **States:** Recommended activity identified; selected activity; optional
  booking energy selected; saved location and equipment preferences edited.
- **Rules:** Choices remain grouped by category. The recommendation has a
  visible label and explains its time fit, equipment needs, and known intensity.
  Every activity has a short, descriptive line. The selected state must not
  rely on colour alone. The optional energy check-in applies only to the current
  booking flow and is not persisted. Location and equipment preferences are
  saved locally and can be edited here on a later booking. Context match
  factors are computed for future use but are not shown to users and do not
  change recommendation scores or order in Milestone 3B.

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

## Keyboard focus

- Moving to another screen places focus on that screen's heading, except after
  saving a booking, when focus moves to Home's primary action.
- Re-rendering a selected time or activity keeps focus on the selected card.