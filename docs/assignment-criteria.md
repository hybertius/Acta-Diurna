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
