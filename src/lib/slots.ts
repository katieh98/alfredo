export interface Slot {
  key: string;
  label: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface SlotMap {
  [key: string]: Slot;
}

export function buildSlots(): SlotMap {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSat = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;

  const sat = new Date(now);
  sat.setDate(now.getDate() + daysUntilSat);

  const sun = new Date(now);
  sun.setDate(now.getDate() + daysUntilSat + 1);

  const makeSlot = (
    base: Date,
    startHour: number,
    endHour: number,
    label: string,
    key: string,
  ): Slot => {
    const start = new Date(base);
    start.setHours(startHour, 0, 0, 0);
    const end = new Date(base);
    end.setHours(endHour, 0, 0, 0);

    return {
      key,
      label,
      date: start.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      startTime: start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      endTime: end.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  return {
    sat_afternoon: makeSlot(sat, 12, 16, "Saturday afternoon", "sat_afternoon"),
    sat_evening: makeSlot(sat, 17, 22, "Saturday evening", "sat_evening"),
    sun_afternoon: makeSlot(sun, 12, 16, "Sunday afternoon", "sun_afternoon"),
    sun_evening: makeSlot(sun, 17, 21, "Sunday evening", "sun_evening"),
  };
}

export function computeOverlap(
  responses: Array<{ slots: string[] }>,
): Slot[] {
  const allSlots = buildSlots();
  return Object.entries(allSlots)
    .filter(([key]) => responses.every((r) => r.slots.includes(key)))
    .map(([, slot]) => slot);
}
