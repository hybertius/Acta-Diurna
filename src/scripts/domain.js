const activityGroups = [
  {
    name: "Korta utepass",
    activities: [
      {
        id: "cycle",
        name: "Cykelrunda",
        durationMinutes: 20,
        environment: "Utomhus",
        equipment: "Cykel",
        requiredEquipment: "bike",
        location: "outdoors",
        energyLevel: null,
        description: "En kort cykeltur utomhus.",
        equipmentReason: "Du behöver en cykel.",
        icon: "../assets/activity-option.svg",
      },
      {
        id: "walk",
        name: "Promenad",
        durationMinutes: 20,
        environment: "Utomhus",
        equipment: "Ingen utrustning",
        requiredEquipment: null,
        location: "outdoors",
        energyLevel: null,
        description: "En promenad i din egen takt.",
        equipmentReason: "Ingen utrustning behövs.",
        icon: "../assets/activity-option.svg",
      },
    ],
  },
  {
    name: "Låg intensitet",
    activities: [
      {
        id: "cross-trainer",
        name: "Crosstrainer",
        durationMinutes: 25,
        environment: "Inomhus",
        equipment: "Maskin",
        requiredEquipment: "cross-trainer",
        location: "indoors",
        energyLevel: "low",
        description: "Jämn rörelse i ett tempo du väljer.",
        equipmentReason: "Du behöver tillgång till en crosstrainer.",
        effortReason: "Låg intensitet.",
        icon: "../assets/activity-option.svg",
      },
      {
        id: "bodyweight",
        name: "Kroppsviktsträning",
        durationMinutes: 20,
        environment: "Inomhus",
        equipment: "Ingen utrustning",
        requiredEquipment: null,
        location: "indoors",
        energyLevel: "low",
        description: "Bra när du vill röra på dig utan utrustning.",
        equipmentReason: "Ingen utrustning behövs.",
        effortReason: "Låg intensitet.",
        icon: "../assets/activity-option.svg",
      },
    ],
  },
];
const activities = activityGroups.flatMap((group) => group.activities);
const activityById = new Map(activities.map((activity) => [activity.id, activity]));
const energyLabels = {
  low: "Låg",
  normal: "Normal",
  high: "Hög",
};
const locationLabels = {
  indoors: "Inomhus",
  outdoors: "Utomhus",
};
const equipmentLabels = {
  bike: "Cykel",
  "cross-trainer": "Crosstrainer",
};
const energyLevels = new Set(Object.keys(energyLabels));
const locations = new Set(Object.keys(locationLabels));
const equipmentTypes = new Set(Object.keys(equipmentLabels));
const contextMatchBonuses = {
  energy: 2,
  location: 1,
  equipment: 1,
};
const slotDefinitions = [
  { weekdayOffset: 1, time: "10:30" },
  { weekdayOffset: 2, time: "10:30" },
  { weekdayOffset: 3, time: "16:30" },
  { weekdayOffset: 4, time: "15:30" },
];

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfWeek(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

function getWeeklyAwareness(bookings, referenceDate = new Date()) {
  const start = startOfWeek(referenceDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  const startKey = localDateKey(start);
  const endKey = localDateKey(end);
  const activitiesThisWeek = Array.isArray(bookings)
    ? bookings.filter(
        (booking) =>
          booking !== null &&
          typeof booking === "object" &&
          typeof booking.date === "string" &&
          booking.date >= startKey &&
          booking.date < endKey,
      ).length
    : 0;

  let label;
  if (activitiesThisWeek === 0) {
    label = "Open Horizon";
  } else if (activitiesThisWeek <= 2) {
    label = "Light Activity";
  } else if (activitiesThisWeek <= 4) {
    label = "Steady Activity";
  } else if (activitiesThisWeek <= 6) {
    label = "High Activity";
  } else {
    label = "Full Week";
  }

  return { activitiesThisWeek, label };
}

function createTimeSlots() {
  const now = new Date();
  const monday = startOfWeek(now);

  return slotDefinitions.map((definition) => {
    const [hour, minute] = definition.time.split(":").map(Number);
    const date = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + definition.weekdayOffset,
      hour,
      minute,
    );

    if (date <= now) {
      date.setDate(date.getDate() + 7);
    }

    const dateKey = localDateKey(date);
    return {
      id: `${dateKey}|${definition.time}`,
      date: dateKey,
      time: definition.time,
      durationMinutes: 30,
    };
  });
}

function compareMatch(activityValue, userValue, allowedValues) {
  if (!allowedValues.has(activityValue) || !allowedValues.has(userValue)) {
    return "unknown";
  }
  return activityValue === userValue ? "match" : "mismatch";
}

function getEquipmentMatch(activity, availableEquipment) {
  if (activity.requiredEquipment === null) {
    return "match";
  }
  if (
    !equipmentTypes.has(activity.requiredEquipment) ||
    !Array.isArray(availableEquipment) ||
    availableEquipment.some((item) => !equipmentTypes.has(item))
  ) {
    return "unknown";
  }
  return availableEquipment.includes(activity.requiredEquipment) ? "match" : "mismatch";
}

function getMatchFactors(activity, userState) {
  return {
    time: "match",
    energy: compareMatch(activity.energyLevel, userState.energy, energyLevels),
    location: compareMatch(activity.location, userState.location, locations),
    equipment: getEquipmentMatch(activity, userState.equipment),
  };
}

function getContextMatchBonus(matchFactors) {
  return Object.entries(contextMatchBonuses).reduce(
    (bonus, [factor, weight]) =>
      bonus + (matchFactors[factor] === "match" ? weight : 0),
    0,
  );
}

function getRecommendations(timeSlot, userState = {}) {
  const context = userState && typeof userState === "object" ? userState : {};

  return activities
    .filter((activity) => activity.durationMinutes <= timeSlot.durationMinutes)
    .map((activity) => {
      const matchFactors = getMatchFactors(activity, context);
      return {
        activity,
        score:
          100 -
          (timeSlot.durationMinutes - activity.durationMinutes) * 2 +
          getContextMatchBonus(matchFactors),
        matchFactors,
        reasons: [
          `Passar bäst i din lediga tid (${activity.durationMinutes} av ${timeSlot.durationMinutes} min).`,
          activity.equipmentReason,
          ...(activity.effortReason ? [activity.effortReason] : []),
        ],
      };
    })
    .filter(
      ({ activity, matchFactors }) =>
        activity.requiredEquipment === null || matchFactors.equipment === "match",
    )
    .sort(
      (left, right) =>
        right.score - left.score || left.activity.name.localeCompare(right.activity.name),
    );
}

export const trainingPlannerDomain = Object.freeze({
  activityGroups,
  activities,
  createTimeSlots,
  dateFromKey,
  energyLabels,
  equipmentLabels,
  getActivity: (activityId) => activityById.get(activityId) ?? null,
  getRecommendations,
  getWeeklyAwareness,
  locationLabels,
  localDateKey,
  startOfWeek,
});
