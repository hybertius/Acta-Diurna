# Milestone 4 - Weekly Guidance

Milestone 4 separates weekly awareness into small, independently verifiable
layers. The planner can gain meaning and presentation without combining facts,
copy, storage, and Home layout in one step.

See [Known Planner Quirks](./known-quirks.md) for prioritized prototype
limitations and usability issues.

## Milestone 4A - Facts

Status: complete.

4A derives one factual summary from the current local Monday-to-Sunday week:

```js
{
  activitiesThisWeek: 3,
  label: "Steady Activity"
}
```

The label describes planning volume only:

- `Open Horizon`: 0 activities
- `Light Activity`: 1-2 activities
- `Steady Activity`: 3-4 activities
- `High Activity`: 5-6 activities
- `Full Week`: 7 or more activities

The count ignores other weeks. The labels are not targets, intensity ratings,
daily-coverage claims, stopping points, or booking restrictions.

4A adds no guidance copy and no Home interface.

## Milestone 4B - Meaning

Status: complete.

Purpose: turn the 4A summary into one deterministic, factual English sentence
without rendering it or changing the booking flow.

The guidance function:

- Accepts a valid awareness summary.
- Returns `{ key: "weekly-activity-count", message }`.
- Uses singular wording for one activity and plural wording otherwise.
- Makes no assumptions about activity intensity, capacity, or how the week
  feels.
- Does not prevent or discourage another booking.

4B itself remains domain-only and side-effect-free. Milestone 4D calls it when
rendering Home; the resulting English summary is currently visible in the
otherwise Swedish interface. Milestone 7 will bring the rest of the interface
into English while preserving the planner's calm tone.

## Milestone 4C - Presentation

Status: complete.

Purpose: create a reusable weekly-awareness component that receives 4A facts and
4B guidance.

The component:

- Renders a weekly heading, count, category label, and guidance sentence.
- Handles zero and larger counts.
- Uses existing tokens, spacing, and semantic text.
- Contains no storage access, date calculation, or copy-selection logic.
- Lives in a standalone module so its rendered output can be verified without
  changing the Home screen.

4C remains a component-only renderer. Milestone 4D mounts that existing component
on Home without moving storage, date, or copy-selection logic into it.

## Milestone 4D - Home integration

Status: complete.

Purpose: place the reviewed component in Home and derive it from saved bookings.

The summary:

- Appears automatically after a booking and after refresh.
- Recalculates from the existing local booking data.
- Sits after the week calendar and upcoming-activity card, before the primary
  action.
- Preserves the existing booking flow and keyboard focus behavior.

4D has no new persistence path and adds no interactive controls.

## Milestone 4E - Weekly transition verification

Status: pending.

Purpose: verify the summary remains factual as dates and stored data change.

Check:

- No bookings in the current week
- Bookings in earlier or later weeks
- Movement from Sunday to Monday
- Booking and refresh behavior
- Counts above seven

## Milestone 5 - In-flow Back Navigation

Status: pending.

Purpose: let the user move back one step in the unconfirmed booking flow using
a back-arrow button in the upper-left corner.

The back destinations are:

- Available times to Home
- Choose activity to available times
- Confirmation to choose activity

Back navigation preserves selections that remain valid. If the user changes an
earlier choice, only later choices that no longer apply are cleared. Going back
does not save or change any scheduled activity. Each button has an accessible
name that identifies its destination and returns focus to the preserved choice
or the destination heading.

## Milestone 6 - Plan Flexibility

Purpose: let the user change an existing plan without treating the change as a
failure.

### Milestone 6A - Remove one booking

The user can remove one scheduled activity while keeping every other booking
unchanged.

The removal flow should:

- Ask for calm, explicit confirmation.
- Remove only the chosen booking.
- Return its sample time slot to availability.
- Persist the updated plan after refresh.
- Avoid failure language or guilt.

### Milestone 6B - Reschedule one booking

Let the user move an existing activity to another available sample time while
preserving the activity identity and the rest of the plan. The old slot remains
booked until the replacement is confirmed.

### Milestone 6C - Plan-change reconciliation

Verify that removal and rescheduling update persistence, available slots, the
Home calendar, and the Milestone 4 summary without disturbing unrelated
bookings. Removing the final booking should produce an intentional zero-count
state.

## Milestone 7 - English Language Consistency

Make English the canonical user-facing language and remove the temporary
English/Swedish mix.

The milestone should:

- Translate all visible interface copy, including booking, recommendations,
  calendar labels, empty states, errors, and weekly guidance.
- Set the document language and use consistent English date and time formatting.
- Keep accessible names, validation messages, and announcements in English.
- Preserve the existing calm, non-judgmental voice and domain/display-copy
  boundary.
- Leave planner behavior, booking flow, and stored-data shape unchanged.
- Verify the key screens and booking flow in the browser at desktop and mobile
  widths, with no remaining Swedish UI strings.

This is product-language work, not a new planner capability.

## Milestone 8 - Integration Readiness

Only after plan changes and language behavior are stable, decide whether the
prototype should connect to reminders or a real calendar. Accounts, analytics,
and machine-learning recommendations remain separate product decisions.

## Dependency flow

The dependency order is 4A facts, 4B meaning, 4C presentation, and 4D Home
integration, followed by 4E verification. Milestone 5 adds in-flow back
navigation, Milestone 6 adds controlled plan changes, and Milestone 7 makes
English consistent across the interface before Milestone 8 considers external
integration.

This preserves the useful separation of:

```text
Facts + Meaning + Presentation
```

The final sum is assembled in stages rather than treated as one indivisible UI
decision.
