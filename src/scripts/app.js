import { trainingPlannerDomain as domain } from "./domain.js";

const STORAGE_KEY = "training-planner.scheduled-activities.v1";
const appRoot = document.querySelector("#app");
const statusRegion = document.querySelector("#app-status");
let startupStorageWarning = null;

if (
  !domain ||
  !(appRoot instanceof HTMLElement) ||
  !(statusRegion instanceof HTMLElement)
) {
  throw new Error("Required app elements or domain data are missing from the page.");
}

const { activityGroups } = domain;
const timeSlots = domain.createTimeSlots();
const state = {
  screen: "home",
  selectedTimeId: null,
  selectedActivityId: null,
  scheduledActivities: loadScheduledActivities(),
  storageWarning: startupStorageWarning,
};

function isValidStoredActivity(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
    typeof item.time === "string" &&
    /^\d{2}:\d{2}$/.test(item.time) &&
    item.slotId === `${item.date}|${item.time}` &&
    domain.getActivity(item.activityId) !== null
  );
}

function loadScheduledActivities() {
  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    if (savedValue === null) {
      return [];
    }

    const parsedValue = JSON.parse(savedValue);
    if (
      parsedValue.version !== 1 ||
      !Array.isArray(parsedValue.items) ||
      !parsedValue.items.every(isValidStoredActivity)
    ) {
      throw new Error("Saved activity data has an unexpected format.");
    }

    return parsedValue.items;
  } catch (error) {
    console.error("Unable to load saved activities.", error);
    startupStorageWarning = "Det gick inte att läsa sparad planering. En ny bokning kan ersätta tidigare uppgifter.";
    return [];
  }
}

function saveScheduledActivities(items) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, items }),
    );
    state.storageWarning = null;
    return true;
  } catch (error) {
    console.error("Unable to save the scheduled activity.", error);
    state.storageWarning = "Det gick inte att spara aktiviteten. Kontrollera webbläsarens lagring och försök igen.";
    return false;
  }
}

function getActivity(activityId) {
  return domain.getActivity(activityId);
}

function getTimeSlot(slotId) {
  return timeSlots.find((slot) => slot.id === slotId) ?? null;
}

function getAvailableTimeSlots() {
  const bookedSlotIds = new Set(
    state.scheduledActivities.map((activity) => activity.slotId),
  );
  return timeSlots.filter((slot) => !bookedSlotIds.has(slot.id));
}

function formatWeekday(dateKey, options = { weekday: "long" }) {
  const label = new Intl.DateTimeFormat("sv-SE", options).format(domain.dateFromKey(dateKey));
  return label.charAt(0).toLocaleUpperCase("sv-SE") + label.slice(1);
}

function formatActivityDetails(activity) {
  return `${activity.durationMinutes} min · ${activity.environment} · ${activity.equipment}`;
}

function getUpcomingActivity() {
  const now = new Date();
  return state.scheduledActivities
    .filter((scheduled) => new Date(`${scheduled.date}T${scheduled.time}:00`) > now)
    .sort((left, right) =>
      `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`),
    )[0] ?? null;
}

function renderHeader() {
  return `
    <header class="screen-header" data-node-id="166:261">
      <h1 id="screen-title">Träningsplanerare</h1>
    </header>
  `;
}

function renderStorageWarning() {
  return state.storageWarning
    ? `<p class="storage-warning" role="alert">${state.storageWarning}</p>`
    : "";
}

function renderCalendar() {
  const monday = domain.startOfWeek(new Date());
  const labels = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

  return `
    <section class="week-calendar" aria-label="Den här veckan">
      <h2>Den här veckan</h2>
      <div class="week-calendar__days">
        ${labels
          .map((label, index) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + index);
            const dateKey = domain.localDateKey(date);
            const hasActivity = state.scheduledActivities.some(
              (scheduled) => scheduled.date === dateKey,
            );
            return `
              <div class="week-calendar__day" aria-label="${label} ${date.getDate()}${hasActivity ? ", aktivitet planerad" : ""}">
                <span class="week-calendar__label">${label}</span>
                <span class="week-calendar__date">${date.getDate()}</span>
                <span class="week-calendar__marker${hasActivity ? " is-active" : ""}" aria-hidden="true"></span>
              </div>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderHomeScreen() {
  const upcoming = getUpcomingActivity();
  const activity = upcoming ? getActivity(upcoming.activityId) : null;
  const upcomingTitle = upcoming && activity
    ? `${formatWeekday(upcoming.date)} ${upcoming.time} · ${activity.name}`
    : "Inget planerat ännu";
  const upcomingDetails = upcoming && activity
    ? formatActivityDetails(activity)
    : "Välj en tid när det passar dig.";

  appRoot.innerHTML = `
    ${renderHeader()}
    <section class="home-screen" aria-labelledby="home-heading" data-node-id="237:324">
      <h2 class="visually-hidden" id="home-heading">Veckoöversikt</h2>
      ${renderCalendar()}
      <article class="upcoming-card">
        <img class="upcoming-card__icon" src="../assets/activity-home.svg" alt="">
        <div class="upcoming-card__content">
          <p class="upcoming-card__eyebrow">Nästa planerade aktivitet</p>
          <p class="upcoming-card__title">${upcomingTitle}</p>
          <p class="upcoming-card__details">${upcomingDetails}</p>
        </div>
      </article>
      ${renderStorageWarning()}
      <button class="primary-action" type="button" data-action="show-times">Visa lediga tider</button>
    </section>
  `;
  appRoot.dataset.screen = "home";
}

function renderTimeSlot(slot, selectedTimeId) {
  const selected = slot.id === selectedTimeId;
  const dayLabel = formatWeekday(slot.date);
  return `
    <li>
      <button
        class="time-slot-card"
        type="button"
        data-action="select-time"
        data-time-id="${slot.id}"
        aria-pressed="${selected}"
        aria-label="${dayLabel} ${slot.time}, 30 minuter"
      >
        <img class="time-slot-card__icon" src="../assets/activity-time.svg" alt="">
        <span class="time-slot-card__content">
          <span>${dayLabel}</span>
          <span>${slot.time}</span>
        </span>
        <span class="selection-indicator${selected ? " is-selected" : ""}" aria-hidden="true">
          <img src="../assets/selection-time.svg" alt="">
        </span>
      </button>
    </li>
  `;
}

function renderTimeScreen() {
  const availableSlots = getAvailableTimeSlots();
  const hasSelection = getTimeSlot(state.selectedTimeId) !== null;

  appRoot.innerHTML = `
    ${renderHeader()}
    <section class="time-screen" aria-labelledby="time-heading" data-node-id="197:387">
      <h2 class="screen-title-pill" id="time-heading">${availableSlots.length > 0 ? "Lediga tider" : "Inga lediga tider"}</h2>
      ${availableSlots.length > 0 ? '<p class="time-screen__hint">Välj en tid som passar dig.</p>' : ""}
      ${renderStorageWarning()}
      ${
        availableSlots.length > 0
          ? `
            <ul class="time-slot-list">
              ${availableSlots.map((slot) => renderTimeSlot(slot, state.selectedTimeId)).join("")}
            </ul>
            <button class="primary-action" type="button" data-action="confirm-time" ${hasSelection ? "" : "disabled"}>
              Fortsätt
            </button>
          `
          : `
            <div class="empty-state">
              <img class="empty-state__illustration" src="../assets/empty-state-sloth.png" alt="">
              <p class="empty-message">Mycket planerat denna vecka. Ta det lugnt 🦥</p>
            </div>
            <button class="primary-action" type="button" data-action="return-home">Till startsidan</button>
          `
      }
    </section>
  `;
  appRoot.dataset.screen = "times";
}

function renderActivityCard(activity, recommendation) {
  const selected = activity.id === state.selectedActivityId;
  const recommended = recommendation?.activity.id === activity.id;
  const ariaLabel = [
    activity.name,
    `${activity.durationMinutes} minuter`,
    activity.environment,
    recommended ? `Förslag. ${recommendation.reason}` : "",
  ].filter(Boolean).join(", ");

  return `
    <li>
      <button
        class="activity-option-card"
        type="button"
        data-action="select-activity"
        data-activity-id="${activity.id}"
        aria-pressed="${selected}"
        aria-label="${ariaLabel}"
      >
        <img class="activity-option-card__icon" src="${activity.icon}" alt="">
        <span class="activity-option-card__content">
          <span class="activity-option-card__title">${activity.name}</span>
          <span class="activity-option-card__description">${activity.durationMinutes} min · ${activity.environment}</span>
          ${recommended ? '<span class="activity-option-card__recommendation">Förslag · passar din tid</span>' : ""}
        </span>
        <span class="selection-indicator${selected ? " is-selected" : ""}" aria-hidden="true">
          <img src="../assets/selection-activity.svg" alt="">
        </span>
      </button>
    </li>
  `;
}

function renderActivityScreen() {
  const selectedTime = getTimeSlot(state.selectedTimeId);
  if (!selectedTime) {
    state.screen = "times";
    renderTimeScreen();
    return;
  }

  const recommendations = domain.getRecommendations(selectedTime);
  const recommendation = recommendations[0] ?? null;
  const hasSelection = getActivity(state.selectedActivityId) !== null;

  appRoot.innerHTML = `
    ${renderHeader()}
    <section class="activity-screen" aria-labelledby="activity-heading" data-node-id="139:156">
      <h2 class="screen-title-pill" id="activity-heading">Välj aktivitet</h2>
      <p class="activity-screen__hint">Pass som ryms på ${selectedTime.durationMinutes} minuter. Välj det som känns lagom.</p>
      ${renderStorageWarning()}
      <div class="activity-groups">
        ${activityGroups
          .map(
            (group) => `
              <section class="activity-group" aria-labelledby="group-${group.activities[0].id}">
                <h3 id="group-${group.activities[0].id}">${group.name}</h3>
                <ul class="activity-option-list">
                  ${group.activities.map((activity) => renderActivityCard(activity, recommendation)).join("")}
                </ul>
              </section>
            `,
          )
          .join("")}
      </div>
      <button class="primary-action" type="button" data-action="confirm-activity" ${hasSelection ? "" : "disabled"}>
        Fortsätt
      </button>
    </section>
  `;
  appRoot.dataset.screen = "activities";
}

function renderConfirmationScreen() {
  const timeSlot = getTimeSlot(state.selectedTimeId);
  const activity = getActivity(state.selectedActivityId);
  if (!timeSlot || !activity) {
    state.screen = "activities";
    renderActivityScreen();
    return;
  }

  appRoot.innerHTML = `
    ${renderHeader()}
    <section class="confirmation-screen" aria-labelledby="confirmation-heading" data-node-id="164:165">
      <h2 class="confirmation-screen__heading" id="confirmation-heading">Din plan</h2>
      ${renderStorageWarning()}
      <article class="confirmed-activity">
        <img class="confirmed-activity__icon" src="../assets/activity-confirmed.svg" alt="">
        <div class="confirmed-activity__content">
          <p class="confirmed-activity__title">${activity.name}</p>
          <p class="confirmed-activity__time">${formatWeekday(timeSlot.date)} ${timeSlot.time}</p>
          <p class="confirmed-activity__details">${formatActivityDetails(activity)}</p>
        </div>
      </article>
      <p class="confirmation-screen__note">Ta en titt – bekräfta när du är redo.</p>
      <button class="primary-action" type="button" data-action="confirm-booking">Spara planen</button>
    </section>
  `;
  appRoot.dataset.screen = "confirmation";
}

function render() {
  switch (state.screen) {
    case "home":
      renderHomeScreen();
      break;
    case "times":
      renderTimeScreen();
      break;
    case "activities":
      renderActivityScreen();
      break;
    case "confirmation":
      renderConfirmationScreen();
      break;
    default:
      throw new Error(`Unknown screen: ${state.screen}`);
  }
}

appRoot.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!(actionButton instanceof HTMLButtonElement) || actionButton.disabled) {
    return;
  }

  switch (actionButton.dataset.action) {
    case "show-times":
      state.selectedTimeId = null;
      state.selectedActivityId = null;
      state.screen = "times";
      statusRegion.textContent = getAvailableTimeSlots().length > 0
        ? "Välj en tid som passar dig."
        : "Mycket planerat denna vecka. Ta det lugnt 🦥";
      render();
      break;
    case "select-time": {
      const slot = getTimeSlot(actionButton.dataset.timeId);
      if (!slot || !getAvailableTimeSlots().some((available) => available.id === slot.id)) {
        return;
      }
      state.selectedTimeId = slot.id;
      statusRegion.textContent = `Tid vald: ${formatWeekday(slot.date)} ${slot.time}. Välj ett pass som känns lagom.`;
      render();
      break;
    }
    case "confirm-time":
      if (!getTimeSlot(state.selectedTimeId)) {
        return;
      }
      state.selectedActivityId = null;
      state.screen = "activities";
      statusRegion.textContent = "Du kan välja förslaget eller ett annat pass som passar dig.";
      render();
      break;
    case "select-activity": {
      const activity = getActivity(actionButton.dataset.activityId);
      if (!activity) {
        return;
      }
      state.selectedActivityId = activity.id;
      statusRegion.textContent = `Du valde ${activity.name}.`;
      render();
      break;
    }
    case "confirm-activity":
      if (!getActivity(state.selectedActivityId)) {
        return;
      }
      state.screen = "confirmation";
      statusRegion.textContent = "Ta en titt på planen. Bekräfta när du är redo.";
      render();
      break;
    case "confirm-booking": {
      const slot = getTimeSlot(state.selectedTimeId);
      const activity = getActivity(state.selectedActivityId);
      if (!slot || !activity || !getAvailableTimeSlots().some((available) => available.id === slot.id)) {
        state.storageWarning = "Den tiden är inte längre ledig. Välj en annan tid.";
        state.screen = "times";
        render();
        return;
      }

      const scheduledActivity = {
        slotId: slot.id,
        date: slot.date,
        time: slot.time,
        activityId: activity.id,
      };
      const updatedActivities = [...state.scheduledActivities, scheduledActivity];
      if (!saveScheduledActivities(updatedActivities)) {
        render();
        return;
      }

      state.scheduledActivities = updatedActivities;
      state.selectedTimeId = null;
      state.selectedActivityId = null;
      state.screen = "home";
      statusRegion.textContent = `${activity.name} planerad ${formatWeekday(slot.date)} ${slot.time}.`;
      render();
      break;
    }
    case "return-home":
      state.screen = "home";
      render();
      break;
    default:
      throw new Error(`Unknown action: ${actionButton.dataset.action}`);
  }
});

render();
