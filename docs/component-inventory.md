# Component Inventory

Semantic target architecture derived from the audited Figma frames. This
inventory describes reusable UI responsibilities and states rather than
preserving Figma layer names as implementation names.

Milestone 1 follows the main path on the newer `01 - Reconstructed flow` page:
Home (`237:324`), available times (`197:387`), choose activity (`139:156`), and
confirmation (`164:165`). The original five-frame audit remains useful as
design history, but Frame 3 is no longer the sole implementation target.

## Shared components

| Component | Responsibility | Variants / states | Frame usage |
| --- | --- | --- | --- |
| `ScreenShell` | Provides the 360px mobile viewport, canvas background, and consistent screen padding. | Standard screen; content may scroll if it exceeds viewport height. | Frames 1–5 |
| `ScreenHeader` | Displays the planner title and provides a consistent top-level heading treatment. | Default title; heading text supplied by screen. | Frames 1–5 |
| `PrimaryButton` | Renders a prominent action with a consistent label, hit area, and visual treatment. | Enabled, disabled; primary action. | Frame 1: show available times; Frame 2: confirm time; Frame 3: choose activity; Frame 4: confirm selection; Frame 5: go back |
| `SelectionCard` | Presents one selectable item with its primary content and optional supporting detail or icon. | Available, selected, unselected; content-specific presentation. | Frames 2–5 |

## Frame-specific components

| Component | Responsibility | Variants / states | Frame usage |
| --- | --- | --- | --- |
| `WeekCalendar` | Shows the current week, weekday labels, dates, and a legend for small pebble markers on days with scheduled activities. | Current week; day with or without activity; selected day if interaction requires it. | Frame 1 |
| `UpcomingActivityCard` | Summarizes the next scheduled activity with an icon or visual marker and concise activity/time text. | Populated; optional activity icon. | Frame 1 |
| `AvailabilitySection` | Groups available time choices under a section heading. | One or more selectable time slots. | Frame 2 |
| `TimeSlotCard` | Shows a time option and communicates its selection state. | Available, selected; selection marker shown as appropriate. | Frame 2 |
| `SelectedActivitySummary` | Confirms the chosen activity and its details (day/time, duration, activity type, equipment). | Populated selection. | Frame 4 |
| `ActivityGroup` | Groups related activity options under a semantic category heading. | Populated group. | Frame 3 |
| `ActivityOptionCard` | Presents an activity with a short personality description and selection control. In Milestone 3C, only the top recommendation explains its time, energy, location, and equipment match statuses; unknown factors are distinct from mismatches. In 3D, matches add energy +2, location +1, or equipment +1 to the duration score, while mismatches and unknowns add nothing. Separately from scoring, equipment-dependent activities remain visible but are eligible for the recommendation only when required equipment is explicitly marked available. Cards remain grouped by category and sort by rank within each group; scores stay hidden and alternatives lightweight. Activity icons are 32px; the recommendation icon is hidden to give its explanation more width, while alternatives keep their strong-green icons. Frame 3 should render repeated options from activity data rather than duplicate bespoke markup. | Default; selectable; selected; recommended with four match-factor explanations. | Frame 3 (four cards in audited hierarchy); Frame 4 alternatives; Frame 5 suggested alternatives |
| `ActivityContextCapture` | Captures optional energy for the current booking and lets the user edit locally saved location and equipment preferences without leaving the activity flow. | Energy unset or selected; preferences unset, selected, or explicitly no equipment. | Choose Activity |
| `EmptyAvailabilityState` | Explains that all sample times are planned, shows the sloth illustration, and offers a confirmed reset of locally saved sample bookings. | No available times; reset cancelled; sample plan restored. | Frame 5 |

## Frame 3 composition

Build the Choose Activity screen from:

- `ScreenShell`
- `ScreenHeader`
- Screen heading
- Two `ActivityGroup` containers, each containing:
  - A category heading
  - A data-driven list of `ActivityOptionCard` items
- An optional `ActivityContextCapture` for booking energy and saved preferences
- `PrimaryButton`

The audited hierarchy contains four activity cards and two separate text layers, “Korta Utepass” and “Låg Intensitet”. Treat these text layers as category headings above their corresponding option lists, not as card content.

Store the selected activity as screen state so that only one activity is selected at a time, the selected card communicates its state visually and structurally, and the primary action can respond to whether a valid selection exists.

## Implementation notes

- Use semantic state (`selected`, `available`, `disabled`, and `empty`) rather than encoding state only in color or layer names.
- Use the warm paper, forest, and moss palette recorded in [figma-decisions.md](./figma-decisions.md), with Inter typography; keep color and text treatment centralized in design tokens.
- The Figma extraction identified duplicate overlapping upcoming-activity structures in Frame 1. Do not replicate that duplication as two rendered cards without confirming it is intentional.
- The original five-frame audit has incomplete details for Frames 3–5. The
  newer reconstructed main-flow frames have since been inspected through
  Figma MCP. Milestone 1 uses local sample times and activities and intentionally
  omits the optional calendar and reminder choices shown on the confirmation
  design.
