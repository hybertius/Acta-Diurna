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

function getRecommendations(timeSlot) {
  return activities
    .filter((activity) => activity.durationMinutes <= timeSlot.durationMinutes)
    .map((activity) => ({
      activity,
      score: 100 - (timeSlot.durationMinutes - activity.durationMinutes) * 2,
      reasons: [
        `Passar bäst i din lediga tid (${activity.durationMinutes} av ${timeSlot.durationMinutes} min).`,
        activity.equipmentReason,
        ...(activity.effortReason ? [activity.effortReason] : []),
      ],
    }))
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
  getActivity: (activityId) => activityById.get(activityId) ?? null,
  getRecommendations,
  localDateKey,
  startOfWeek,
});
