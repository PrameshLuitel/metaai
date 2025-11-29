// A simple festival calendar utility for Nepali festivals.
// In a real application, this would be more dynamic or use a proper library.

interface Festival {
  name: string;
  date: Date;
}

// Hardcoded dates for a sample year.
const festivals: Festival[] = [
  { name: "Dashain", date: new Date("2024-10-12") },
  { name: "Tihar", date: new Date("2024-11-01") },
  { name: "Chhath Parva", date: new Date("2024-11-07") },
  { name: "Holi", date: new Date("2025-03-14") },
  { name: "Nepali New Year", date: new Date("2025-04-14") },
];

/**
 * Checks if a given date is close to a major festival.
 * @param date The date to check.
 * @returns An array of active festivals.
 */
export function getNepaliFestivals(date: Date): Festival[] {
  const activeFestivals: Festival[] = [];
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);

  for (const festival of festivals) {
    const festivalDate = new Date(festival.date);
    festivalDate.setHours(0, 0, 0, 0);

    const timeDiff = festivalDate.getTime() - today.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    // Consider a festival "active" if it's within 7 days before or 3 days after.
    if (dayDiff >= -3 && dayDiff <= 7) {
      activeFestivals.push(festival);
    }
  }

  return activeFestivals;
}
