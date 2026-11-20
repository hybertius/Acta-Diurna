# Known Planner Quirks

This list records current prototype behavior that can be confusing or limiting.
The order below is a proposed fix priority, not a claim that every item is a
technical bug. The [milestone roadmap](./Milestones.md) remains the guide for
implementation order.

## 1. Two open tabs can overwrite saved bookings

**Status:** Reproduced bug; highest priority.

Each tab loads bookings into its own memory. If two tabs are open before either
one saves, a booking made in the second tab can overwrite the first tab's
booking instead of preserving both. The second tab does not warn that its copy
of the plan is stale.

**Next step:** Reconcile changes between tabs and prevent stale saves from
silently replacing other bookings. Cover different bookings and competing
selections of the same slot.

## 2. A long-open tab can offer a time that has passed

**Status:** Reproduced bug; higher priority.

The sample slots are generated when the page loads and are not refreshed as
time passes. A tab left open can therefore show and save a slot whose start
time is already in the past. Home then omits that activity from the upcoming
card even though it remains in the current week's count.

**Next step:** Refresh available slots as needed and recheck the selected time
before saving. Verify behavior when time passes during the booking flow as well
as when the page remains open across a day or week boundary.

## 3. Only the next activity is visible on Home

**Status:** Current documented design; potentially confusing.

Multiple bookings are saved, but Home's upcoming-activity card is designed to
display only the next one. This week's calendar can mark multiple planned
days, and the weekly summary counts bookings in that week. Later bookings
can still be easy to overlook.

**Next step:** When planning Milestone 6, discuss how users will find and
select a booking to remove or reschedule without assuming that Home itself
needs a full list.

## 4. Available times do not show their dates

**Status:** Known usability issue; higher priority.

Time cards show a weekday and time, but not the date or week. The rolling
sample pool can therefore show the same weekday and time for different weeks,
without making the difference clear. Confirmation also shows only the weekday
and time.

**Next step:** Show enough date or week information to distinguish choices and
confirmations, including accessible names. Keep the sample-slot model; this
does not require a real calendar integration.

## 5. The sample time pool can run out

**Status:** Intentional prototype limit; medium priority.

The app generates a pool of ten future sample slots at page load and shows up
to five unbooked choices. After five bookings from that pool, five remain;
after six, four remain; after ten, none remain. The pool moves forward as time
passes and the page is reloaded, but booking a slot does not create an
unlimited replacement.

The empty state offers to reset the example plan, which removes **all** saved
activities after confirmation. Its message says the week is heavily planned,
although the sample slots can span more than one week.

**Next step:** Decide whether the finite pool remains intentional or should
refill further, and clarify the empty-state message and reset consequence.
Keep this decision separate from real calendar integration.

## 6. No back button during booking

**Status:** Known limitation; medium priority.

There is no in-app way to return to a previous booking step to revise a choice.
Milestone 5 plans a top-left back button that preserves valid selections.

## 7. The weekly summary can show zero alongside an upcoming booking

**Status:** Expected behavior that may be unclear; medium priority.

The summary counts activities in the current local Monday-to-Sunday week. An
upcoming activity in a later week appears on Home but does not increase this
week's count or add a marker to this week's calendar.

**Next step:** Verify week boundaries and refresh behavior in Milestone 4E,
then consider clearer wording or context without changing what the count means.

## 8. The interface mixes Swedish and English

**Status:** Known inconsistency; lower priority.

Most of the interface is Swedish, while the weekly summary is English.
Milestone 7 plans a coordinated change to English, including dates, accessible
names, announcements, and the planner's calm tone.

## Verification so far

An isolated browser check booked ten sample activities and refreshed after
each one. All ten remained in local storage, Home continued to show the
earliest upcoming activity, and the available choices decreased to zero as
the finite pool was used. This confirms that multiple bookings persisted in
that test; it does not prove all date transitions or storage-error cases.

Separate browser checks reproduced a lost booking when two already-open tabs
saved different slots, and a past booking when a simulated clock advanced past
the selected slot. These checks used a separate local test origin and did not
change the user's regular saved plan.
