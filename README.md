# Acta Diurna

A lightweight planner prototype with a complete local happy path:
choose a sample time, receive activity recommendations, confirm a booking, and
see it on the home screen.

## Project structure

- `docs/` — product and design decisions
- `src/` — static application markup, styles, and scripts
- `assets/` — images, icons, and other static assets

## Run locally

From the repository root, run `python -m http.server 8000` and open
`http://localhost:8000/src/` in a browser. The project uses plain HTML, CSS,
and JavaScript and does not require a build step. Bookings are saved in that
browser's `localStorage`; available times and activities are sample data.

## Planning documents

See the documents in `docs/` for assignment criteria, user flows, screen
contracts, the component inventory, and Figma decisions.

Milestone 1 intentionally excludes reminders, real calendar integration,
accounts, analytics, and machine-learning recommendations.
