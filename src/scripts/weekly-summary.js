function renderWeeklySummary(summary, guidance) {
  const validSummary =
    summary !== null &&
    typeof summary === "object" &&
    Number.isInteger(summary.activitiesThisWeek) &&
    summary.activitiesThisWeek >= 0 &&
    typeof summary.label === "string" &&
    summary.label.length > 0;
  const validGuidance =
    guidance !== null &&
    typeof guidance === "object" &&
    typeof guidance.key === "string" &&
    guidance.key.length > 0 &&
    typeof guidance.message === "string" &&
    guidance.message.length > 0;

  if (!validSummary || !validGuidance) {
    throw new TypeError("Weekly summary facts and guidance are required.");
  }

  return `
    <section class="weekly-summary">
      <h3 class="weekly-summary__heading">This week</h3>
      <div class="weekly-summary__facts">
        <p class="weekly-summary__count">${summary.activitiesThisWeek}</p>
        <p class="weekly-summary__label">${summary.label}</p>
      </div>
      <p class="weekly-summary__guidance" data-guidance-key="${guidance.key}">
        ${guidance.message}
      </p>
    </section>
  `;
}

export { renderWeeklySummary };
