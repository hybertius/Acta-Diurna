import { trainingPlannerDomain as domain } from "./domain.js";

const STORAGE_KEY = "training-planner.scheduled-activities.v1";
const PREFERENCES_STORAGE_KEY = "training-planner.user-preferences.v1";
const appRoot = document.querySelector("#app");
const statusRegion = document.querySelector("#app-status");
let startupStorageWarning = null;
let startupPreferencesWarning = null;

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
  energyLevel: null,
  userPreferences: loadUserPreferences(),
  preferencesPanelOpen: false,
  storageWarning: startupStorageWarning,
  preferencesWarning: startupPreferencesWarning,
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

function getDefaultUserPreferences() {
  return { location: null, equipment: null };
}

function isValidStoredPreferences(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const validLocation =
    value.location === null ||
    Object.prototype.hasOwnProperty.call(domain.locationLabels, value.location);
  const validEquipment =
    value.equipment === null ||
    (Array.isArray(value.equipment) &&
      value.equipment.every((item) =>
        Object.prototype.hasOwnProperty.call(domain.equipmentLabels, item),
      ) &&
      new Set(value.equipment).size === value.equipment.length);

  return (
    value.version === 1 &&
    validLocation &&
    validEquipment
  );
}

function loadUserPreferences() {
  try {
    const savedValue = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (savedValue === null) {
      return getDefaultUserPreferences();
    }

    const parsedValue = JSON.parse(savedValue);
    if (!isValidStoredPreferences(parsedValue)) {
      throw new Error("Saved user preferences have an unexpected format.");
    }

    return {
      location: parsedValue.location,
      equipment: parsedValue.equipment === null ? null : [...parsedValue.equipment],
    };
  } catch (error) {
    console.error("Unable to load saved user preferences.", error);
    startupPreferencesWarning = "Det gick inte att läsa sparade preferenser. Dina val kan behöva anges igen.";
    return getDefaultUserPreferences();
  }
}

function saveUserPreferences(preferences) {
  try {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({ version: 1, ...preferences }),
    );
    state.preferencesWarning = null;
    return true;
  } catch (error) {
    console.error("Unable to save user preferences.", error);
    state.preferencesWarning = "Det gick inte att spara preferenserna. Kontrollera webbläsarens lagring och försök igen.";
    return false;
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

function resetBookingContext() {
  state.energyLevel = null;
  state.preferencesPanelOpen = false;
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
  return [state.storageWarning, state.preferencesWarning]
    .filter(Boolean)
    .map((warning) => `<p class="storage-warning" role="alert">${warning}</p>`)
    .join("");
}

function focusTarget(selector) {
  const target = appRoot.querySelector(selector);
  if (target instanceof HTMLElement) {
    target.focus();
  }
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
      <p class="week-calendar__legend">
        <span class="week-calendar__marker is-active" aria-hidden="true"></span>
        <span>Planerad aktivitet</span>
      </p>
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
      <h2 class="screen-title-pill" id="time-heading" tabindex="-1">${availableSlots.length > 0 ? "Lediga tider" : "Inga lediga tider"}</h2>
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
            <button class="primary-action" type="button" data-action="reset-plan">Återställ exempelplan</button>
          `
      }
    </section>
  `;
  appRoot.dataset.screen = "times";
}

function renderContextCapture() {
  const { location, equipment } = state.userPreferences;
  const equipmentOptions = Object.entries(domain.equipmentLabels);
  const noEquipmentSelected = equipment !== null && equipment.length === 0;

  return `
    <section class="activity-context" aria-label="Valfria förutsättningar">
      <fieldset class="activity-context__energy">
        <legend>Hur känns det idag? <span>Valfritt</span></legend>
        <div class="activity-context__choices">
          ${Object.entries(domain.energyLabels)
            .map(
              ([value, label]) => `
                <label class="activity-context__choice" for="context-energy-${value}">
                  <input
                    id="context-energy-${value}"
                    type="radio"
                    name="booking-energy"
                    value="${value}"
                    data-context-field="energy"
                    ${state.energyLevel === value ? "checked" : ""}
                  >
                  <span>${label}</span>
                </label>
              `,
            )
            .join("")}
        </div>
      </fieldset>
      <details class="activity-context__preferences" ${state.preferencesPanelOpen ? "open" : ""}>
        <summary>Sparade preferenser</summary>
        <p class="activity-context__help">Plats och utrustning sparas på den här enheten och kan ändras vid ett senare tillfälle.</p>
        <label class="activity-context__label" for="context-location">Föredragen miljö</label>
        <select id="context-location" data-context-field="location">
          <option value="" ${location === null ? "selected" : ""}>Ingen preferens</option>
          ${Object.entries(domain.locationLabels)
            .map(
              ([value, label]) =>
                `<option value="${value}" ${location === value ? "selected" : ""}>${label}</option>`,
            )
            .join("")}
        </select>
        <fieldset class="activity-context__equipment">
          <legend>Utrustning du har tillgång till</legend>
          <p class="activity-context__help">Välj utrustning, eller lämna allt omarkerat om du inte vill ange det.</p>
          <div class="activity-context__choices">
            ${equipmentOptions
              .map(
                ([value, label]) => `
                  <label class="activity-context__choice" for="context-equipment-${value}">
                    <input
                      id="context-equipment-${value}"
                      type="checkbox"
                      value="${value}"
                      data-context-field="equipment"
                      ${equipment?.includes(value) ? "checked" : ""}
                    >
                    <span>${label}</span>
                  </label>
                `,
              )
              .join("")}
            <label class="activity-context__choice" for="context-equipment-none">
              <input
                id="context-equipment-none"
                type="checkbox"
                value="none"
                data-context-field="equipment"
                ${noEquipmentSelected ? "checked" : ""}
              >
              <span>Ingen utrustning</span>
            </label>
          </div>
        </fieldset>
      </details>
      <p class="activity-context__note">Energi gäller bara den här bokningen. Dina val ändrar inte förslagens ordning.</p>
    </section>
  `;
}

const matchStatusLabels = {
  match: "Matchar",
  mismatch: "Skiljer sig",
  unknown: "Inte jämförd",
};

function getMatchExplanations(recommendation, selectedTime) {
  const { activity, matchFactors } = recommendation;
  const energyPreference = state.energyLevel;
  const locationPreference = state.userPreferences.location;
  const equipmentPreference = state.userPreferences.equipment;
  const equipmentLabel = domain.equipmentLabels[activity.requiredEquipment];
  const energyDetail =
    matchFactors.energy === "match"
      ? `Aktivitetens märkning (${domain.energyLabels[activity.energyLevel]}) passar din valda nivå.`
      : matchFactors.energy === "mismatch"
        ? `Aktiviteten är märkt ${domain.energyLabels[activity.energyLevel]}; du valde ${domain.energyLabels[energyPreference]}.`
        : energyPreference === null
          ? activity.energyLevel === null
            ? "Ingen nivå vald och aktiviteten saknar energimärkning."
            : `Ingen energinivå vald. Aktiviteten är märkt ${domain.energyLabels[activity.energyLevel]}.`
          : "Aktiviteten saknar energimärkning.";
  const locationDetail =
    matchFactors.location === "match"
      ? `Matchar din sparade preferens (${domain.locationLabels[locationPreference]}).`
      : matchFactors.location === "mismatch"
        ? `Aktiviteten är ${domain.locationLabels[activity.location]}; din sparade preferens är ${domain.locationLabels[locationPreference]}.`
        : locationPreference === null
          ? activity.location === null
            ? "Ingen miljöpreferens sparad och aktivitetens miljö är inte känd."
            : `Ingen miljöpreferens sparad. Aktiviteten är ${domain.locationLabels[activity.location]}.`
          : "Aktiviteten saknar miljömärkning.";
  const equipmentDetail =
    activity.requiredEquipment === null
      ? "Ingen utrustning behövs."
      : matchFactors.equipment === "match"
        ? `Aktiviteten behöver ${equipmentLabel}, och tillgången är markerad.`
        : matchFactors.equipment === "mismatch"
          ? equipmentPreference.length === 0
            ? `Aktiviteten behöver ${equipmentLabel}, men du har angett att du saknar utrustning.`
            : `Aktiviteten behöver ${equipmentLabel}, men tillgången är inte markerad i dina preferenser.`
          : `Aktiviteten behöver ${equipmentLabel}; din tillgång är inte angiven.`;

  return [
    {
      label: "Tid",
      status: matchFactors.time,
      detail: `Passar bäst i din lediga tid (${activity.durationMinutes} av ${selectedTime.durationMinutes} min).`,
    },
    {
      label: "Energi",
      status: matchFactors.energy,
      detail: energyDetail,
    },
    {
      label: "Plats",
      status: matchFactors.location,
      detail: locationDetail,
    },
    {
      label: "Utrustning",
      status: matchFactors.equipment,
      detail: equipmentDetail,
    },
  ].map((factor) => ({
    ...factor,
    statusLabel: matchStatusLabels[factor.status] ?? matchStatusLabels.unknown,
  }));
}

function renderActivityCard(activity, recommendation, selectedTime) {
  const selected = activity.id === state.selectedActivityId;
  const recommended = recommendation?.activity.id === activity.id;
  const matchExplanations = recommended
    ? getMatchExplanations(recommendation, selectedTime)
    : [];
  const ariaLabel = [
    activity.name,
    `${activity.durationMinutes} minuter`,
    activity.environment,
    activity.description,
    recommended
      ? `Förslag. Varför det här förslaget? ${matchExplanations.map(({ label, statusLabel, detail }) => `${label}: ${statusLabel}. ${detail}`).join(" ")}`
      : activity.equipmentReason,
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
          <span class="activity-option-card__personality">${activity.description}</span>
          ${
            recommended
              ? `
                <span class="activity-option-card__recommendation">Förslag</span>
                <span class="activity-option-card__why">
                  <span class="activity-option-card__why-title">Varför det här förslaget?</span>
                  <span class="activity-match-factors">
                    ${matchExplanations
                      .map(
                        ({ label, status, statusLabel, detail }) => `
                          <span class="activity-match-factor" data-status="${status}">
                            <span class="activity-match-factor__label">${label}</span>
                            <span class="activity-match-factor__status">${statusLabel}</span>
                            <span class="activity-match-factor__detail">${detail}</span>
                          </span>
                        `,
                      )
                      .join("")}
                  </span>
                </span>
              `
              : ""
          }
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

  const recommendations = domain.getRecommendations(selectedTime, {
    energy: state.energyLevel,
    location: state.userPreferences.location,
    equipment: state.userPreferences.equipment,
  });
  const recommendation = recommendations[0] ?? null;
  const hasSelection = getActivity(state.selectedActivityId) !== null;

  appRoot.innerHTML = `
    ${renderHeader()}
    <section class="activity-screen" aria-labelledby="activity-heading" data-node-id="139:156">
      <h2 class="screen-title-pill" id="activity-heading" tabindex="-1">Välj aktivitet</h2>
      <p class="activity-screen__hint">Pass som ryms på ${selectedTime.durationMinutes} minuter. Välj det som känns lagom.</p>
      ${renderStorageWarning()}
      ${renderContextCapture()}
      <div class="activity-groups">
        ${activityGroups
          .map(
            (group) => `
              <section class="activity-group" aria-labelledby="group-${group.activities[0].id}">
                <h3 id="group-${group.activities[0].id}">${group.name}</h3>
                <ul class="activity-option-list">
                  ${group.activities.map((activity) => renderActivityCard(activity, recommendation, selectedTime)).join("")}
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
      <h2 class="confirmation-screen__heading" id="confirmation-heading" tabindex="-1">Din plan</h2>
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

appRoot.addEventListener("change", (event) => {
  const control = event.target;
  if (
    state.screen !== "activities" ||
    (!(control instanceof HTMLInputElement) &&
      !(control instanceof HTMLSelectElement)) ||
    !control.dataset.contextField
  ) {
    return;
  }

  if (!control.id) {
    throw new Error("Context controls must have an id to preserve keyboard focus.");
  }

  const preferencesPanel = appRoot.querySelector(".activity-context__preferences");
  state.preferencesPanelOpen =
    preferencesPanel instanceof HTMLDetailsElement && preferencesPanel.open;

  if (control.dataset.contextField === "energy") {
    const energy = control.value;
    if (!Object.prototype.hasOwnProperty.call(domain.energyLabels, energy)) {
      return;
    }

    state.energyLevel = energy;
    statusRegion.textContent = `${domain.energyLabels[energy]} energinivå vald för den här bokningen. Förslagens ordning är oförändrad.`;
    renderActivityScreen();
    focusTarget(`#${control.id}`);
    return;
  }

  const previousPreferences = state.userPreferences;
  const updatedPreferences = { ...previousPreferences };

  if (control.dataset.contextField === "location") {
    const location = control.value || null;
    if (
      location !== null &&
      !Object.prototype.hasOwnProperty.call(domain.locationLabels, location)
    ) {
      return;
    }
    updatedPreferences.location = location;
  } else if (control.dataset.contextField === "equipment") {
    const noEquipmentControl = appRoot.querySelector("#context-equipment-none");
    if (!(noEquipmentControl instanceof HTMLInputElement)) {
      throw new Error("The no-equipment preference control is missing.");
    }

    if (control.value === "none" && control.checked) {
      appRoot
        .querySelectorAll('input[data-context-field="equipment"]:not(#context-equipment-none)')
        .forEach((input) => {
          if (input instanceof HTMLInputElement) {
            input.checked = false;
          }
        });
    } else if (control.value !== "none" && control.checked) {
      noEquipmentControl.checked = false;
    }

    const selectedEquipment = [
      ...appRoot.querySelectorAll('input[data-context-field="equipment"]:checked'),
    ]
      .filter((input) => input instanceof HTMLInputElement && input.value !== "none")
      .map((input) => input.value);

    updatedPreferences.equipment = noEquipmentControl.checked
      ? []
      : selectedEquipment.length > 0
        ? selectedEquipment
        : null;
  } else {
    return;
  }

  state.userPreferences = updatedPreferences;
  if (!saveUserPreferences(updatedPreferences)) {
    state.userPreferences = previousPreferences;
    statusRegion.textContent = "Det gick inte att spara preferenserna. Ändringen återställdes.";
  } else {
    statusRegion.textContent = "Preferenserna sparades på den här enheten. De ändrar inte förslagens ordning.";
  }

  renderActivityScreen();
  focusTarget(`#${control.id}`);
});

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
      resetBookingContext();
      state.selectedTimeId = null;
      state.selectedActivityId = null;
      state.screen = "times";
      statusRegion.textContent = getAvailableTimeSlots().length > 0
        ? "Välj en tid som passar dig."
        : "Mycket planerat denna vecka. Ta det lugnt 🦥";
      render();
      focusTarget("#time-heading");
      break;
    case "select-time": {
      const slot = getTimeSlot(actionButton.dataset.timeId);
      if (!slot || !getAvailableTimeSlots().some((available) => available.id === slot.id)) {
        return;
      }
      state.selectedTimeId = slot.id;
      statusRegion.textContent = `Tid vald: ${formatWeekday(slot.date)} ${slot.time}. Välj ett pass som känns lagom.`;
      render();
      focusTarget('.time-slot-card[aria-pressed="true"]');
      break;
    }
    case "confirm-time":
      if (!getTimeSlot(state.selectedTimeId)) {
        return;
      }
      resetBookingContext();
      state.selectedActivityId = null;
      state.screen = "activities";
      statusRegion.textContent = "Du kan välja förslaget eller ett annat pass som passar dig.";
      render();
      focusTarget("#activity-heading");
      break;
    case "select-activity": {
      const activity = getActivity(actionButton.dataset.activityId);
      if (!activity) {
        return;
      }
      state.selectedActivityId = activity.id;
      statusRegion.textContent = `Du valde ${activity.name}.`;
      render();
      focusTarget('.activity-option-card[aria-pressed="true"]');
      break;
    }
    case "confirm-activity":
      if (!getActivity(state.selectedActivityId)) {
        return;
      }
      state.screen = "confirmation";
      statusRegion.textContent = "Ta en titt på planen. Bekräfta när du är redo.";
      render();
      focusTarget("#confirmation-heading");
      break;
    case "confirm-booking": {
      const slot = getTimeSlot(state.selectedTimeId);
      const activity = getActivity(state.selectedActivityId);
      if (!slot || !activity || !getAvailableTimeSlots().some((available) => available.id === slot.id)) {
        state.storageWarning = "Den tiden är inte längre ledig. Välj en annan tid.";
        state.screen = "times";
        render();
        focusTarget("#time-heading");
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
        focusTarget('[data-action="confirm-booking"]');
        return;
      }

      state.scheduledActivities = updatedActivities;
      state.selectedTimeId = null;
      state.selectedActivityId = null;
      resetBookingContext();
      state.screen = "home";
      statusRegion.textContent = `${activity.name} planerad ${formatWeekday(slot.date)} ${slot.time}.`;
      render();
      focusTarget('[data-action="show-times"]');
      break;
    }
    case "reset-plan":
      if (!window.confirm("Återställa exempelplanen? Alla sparade aktiviteter i den här webbläsaren tas bort.")) {
        break;
      }
      if (!saveScheduledActivities([])) {
        render();
        focusTarget('[data-action="reset-plan"]');
        break;
      }
      state.scheduledActivities = [];
      state.selectedTimeId = null;
      state.selectedActivityId = null;
      resetBookingContext();
      state.screen = "times";
      statusRegion.textContent = "Exempelplanen återställd. Välj en tid som passar dig.";
      render();
      focusTarget("#time-heading");
      break;
    default:
      throw new Error(`Unknown action: ${actionButton.dataset.action}`);
  }
});

render();
