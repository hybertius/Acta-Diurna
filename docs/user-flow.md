# User Flow

## Primary task

Schedule one activity in an available time slot and see it on the home screen.

## Flow

1. The user starts on the weekly home screen and chooses **Visa lediga tider**.
2. The user selects an available time and continues.
3. The planner recommends activities that fit the selected time.
4. The user selects an activity and reviews the scheduled time and activity.
5. The user saves the plan and returns to the home screen.
6. The home screen shows the upcoming activity; the booking remains after a
   page refresh.

## Alternate and error paths

- The time and activity confirmation buttons stay disabled until a choice is
  selected.
- If no sample times remain, the user can return to the home screen.
- If browser storage cannot save the booking, show an error and keep the user
  on the confirmation screen.

## Milestone assumptions

- Available times and activities are local sample data.
- Browser `localStorage` is sufficient; no account or server is required.
- Reminders, calendar integration, analytics, and machine learning are out of
  scope.
