"use strict";

const activityCards = document.querySelectorAll(".activity-option-card");
const primaryAction = document.querySelector(".primary-action");

if (!(primaryAction instanceof HTMLButtonElement) || activityCards.length === 0) {
  throw new Error("Activity selection controls are missing from the page.");
}

activityCards.forEach((card) => {
  card.addEventListener("click", () => {
    activityCards.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", "false");
    });

    card.setAttribute("aria-pressed", "true");
    primaryAction.disabled = false;
  });
});
