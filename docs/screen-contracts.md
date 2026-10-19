# Screen Contracts

Define each screen's purpose, content, states, and interactions here.

## Screen template

### _Screen name_

- **Purpose:** _Why this screen exists._
- **Entry:** _How the user arrives._
- **Content:** _Information and controls shown._
- **Actions:** _Available user actions and their outcomes._
- **States:** _Loading, empty, error, and success states._

Screen: Choose activity

Purpose:
Allow the user to choose one activity after selecting a time.

Structure:
- App header
- Screen heading
- Activity group
  - Group heading
  - Activity option list
- Activity group
  - Group heading
  - Activity option list
- Primary action

States:
- Default activity option
- Selected activity option
- Primary action available

Entry conditions:

The user has selected an available time.
Successful outcome:

One activity is selected.
The primary action advances to the confirmation screen.
Rules:

Only one activity can be selected at a time.
Activity choices remain grouped by category.
The selected state must not rely on colour alone.