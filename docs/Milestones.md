# Milestone 4 - Weekly Guidance

Milestone 4 separates weekly awareness into small, independently verifiable
layers. The planner can gain meaning and presentation without combining facts,
copy, storage, and Home layout in one step.

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
otherwise Swedish interface.

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

## Milestone 5 - Plan Flexibility

Purpose: let the user change an existing plan without treating the change as a
failure.

### Milestone 5A - Remove one booking

The user can remove one scheduled activity while keeping every other booking
unchanged.

The removal flow should:

- Ask for calm, explicit confirmation.
- Remove only the chosen booking.
- Return its sample time slot to availability.
- Persist the updated plan after refresh.
- Avoid failure language or guilt.

### Milestone 5B - Reschedule one booking

Let the user move an existing activity to another available sample time while
preserving the activity identity and the rest of the plan. The old slot remains
booked until the replacement is confirmed.

### Milestone 5C - Plan-change reconciliation

Verify that removal and rescheduling update persistence, available slots, the
Home calendar, and the Milestone 4 summary without disturbing unrelated
bookings. Removing the final booking should produce an intentional zero-count
state.

## Milestone 6 - Language and Content Consistency

Choose the canonical user-facing language and remove the temporary mixed
English/Swedish presentation. Centralize user copy, update page language and
date formatting, and review accessible names and announcements as one
coordinated change.

This is product-language work, not a new planner capability.

## Milestone 7 - Integration Readiness

Only after plan changes and language behavior are stable, decide whether the
prototype should connect to reminders or a real calendar. Accounts, analytics,
and machine-learning recommendations remain separate product decisions.

## Dependency flow

The dependency order is 4A facts, 4B meaning, 4C presentation, and 4D Home
integration, followed by 4E verification. Milestone 5 then adds controlled plan
changes. Milestone 6 resolves language consistency before Milestone 7 considers
external integration.

This preserves the useful separation of:

```text
Facts + Meaning + Presentation
```

The final sum is assembled in stages rather than treated as one indivisible UI
decision.
