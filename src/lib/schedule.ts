import { CLASS_TYPES, INSTRUCTORS, findClassBySlug, findInstructorBySlug } from "./data";

// Recurring weekly template — used to generate the fallback schedule when
// Supabase `class_sessions` isn't populated yet. dayOfWeek: 0=Sun..6=Sat.
// Times are in the studio's local wall-clock (America/Chicago), stored as
// simple hour/minute for display; ISO dates are generated relative to
// "today" so the schedule always shows the current + next week.
type Template = { classSlug: string; instructorSlug: string; dayOfWeek: number; hour: number; minute: number };

const TEMPLATE: Template[] = [
  { classSlug: "reformer-pilates", instructorSlug: "jane-doe", dayOfWeek: 1, hour: 6, minute: 0 },
  { classSlug: "mat-pilates", instructorSlug: "maria-lopez", dayOfWeek: 1, hour: 9, minute: 0 },
  { classSlug: "barre-fusion", instructorSlug: "maria-lopez", dayOfWeek: 1, hour: 17, minute: 30 },
  { classSlug: "reformer-pilates", instructorSlug: "sarah-kim", dayOfWeek: 2, hour: 7, minute: 0 },
  { classSlug: "prenatal-pilates", instructorSlug: "emily-chen", dayOfWeek: 2, hour: 10, minute: 0 },
  { classSlug: "reformer-pilates", instructorSlug: "jane-doe", dayOfWeek: 2, hour: 18, minute: 0 },
  { classSlug: "mat-pilates", instructorSlug: "emily-chen", dayOfWeek: 3, hour: 6, minute: 0 },
  { classSlug: "barre-fusion", instructorSlug: "maria-lopez", dayOfWeek: 3, hour: 9, minute: 0 },
  { classSlug: "reformer-pilates", instructorSlug: "sarah-kim", dayOfWeek: 3, hour: 17, minute: 30 },
  { classSlug: "reformer-pilates", instructorSlug: "jane-doe", dayOfWeek: 4, hour: 7, minute: 0 },
  { classSlug: "prenatal-pilates", instructorSlug: "emily-chen", dayOfWeek: 4, hour: 10, minute: 0 },
  { classSlug: "mat-pilates", instructorSlug: "maria-lopez", dayOfWeek: 4, hour: 18, minute: 0 },
  { classSlug: "reformer-pilates", instructorSlug: "sarah-kim", dayOfWeek: 5, hour: 6, minute: 0 },
  { classSlug: "barre-fusion", instructorSlug: "maria-lopez", dayOfWeek: 5, hour: 9, minute: 0 },
  { classSlug: "mat-pilates", instructorSlug: "jane-doe", dayOfWeek: 5, hour: 17, minute: 0 },
  { classSlug: "reformer-pilates", instructorSlug: "jane-doe", dayOfWeek: 6, hour: 9, minute: 0 },
  { classSlug: "mat-pilates", instructorSlug: "sarah-kim", dayOfWeek: 6, hour: 10, minute: 30 },
  { classSlug: "prenatal-pilates", instructorSlug: "emily-chen", dayOfWeek: 0, hour: 10, minute: 0 },
  { classSlug: "mat-pilates", instructorSlug: "maria-lopez", dayOfWeek: 0, hour: 11, minute: 30 },
];

export type SessionSlot = {
  id: string;
  classSlug: string;
  className: string;
  instructorSlug: string;
  instructorName: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number;
  bookedCount: number;
  priceCents: number;
};

export function generateWeekSchedule(daysAhead = 9): SessionSlot[] {
  const now = new Date();
  const slots: SessionSlot[] = [];

  for (let d = 0; d < daysAhead; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    const dow = day.getDay();
    const todays = TEMPLATE.filter((t) => t.dayOfWeek === dow);
    for (const t of todays) {
      const cls = findClassBySlug(t.classSlug);
      const instructor = findInstructorBySlug(t.instructorSlug);
      if (!cls || !instructor) continue;
      const starts = new Date(day);
      starts.setHours(t.hour, t.minute, 0, 0);
      // skip slots in the past (today's earlier classes)
      if (starts.getTime() < now.getTime() - 60 * 60 * 1000) continue;
      const ends = new Date(starts.getTime() + cls.duration_minutes * 60 * 1000);
      const id = `${t.classSlug}__${starts.toISOString()}`;
      // deterministic pseudo-booked count so the schedule feels alive
      const seed = (t.classSlug.length * 7 + t.hour * 3 + day.getDate()) % 6;
      slots.push({
        id,
        classSlug: cls.slug,
        className: cls.name,
        instructorSlug: instructor.slug,
        instructorName: instructor.name,
        startsAt: starts,
        endsAt: ends,
        capacity: cls.slug === "private-sessions" ? 1 : 8,
        bookedCount: cls.slug === "private-sessions" ? 0 : seed,
        priceCents: cls.price_cents,
      });
    }
  }

  return slots.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export function findSlotById(id: string): SessionSlot | undefined {
  return generateWeekSchedule(14).find((s) => s.id === id);
}

export function groupByDay(slots: SessionSlot[]): Record<string, SessionSlot[]> {
  const groups: Record<string, SessionSlot[]> = {};
  for (const s of slots) {
    const key = s.startsAt.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    (groups[key] ??= []).push(s);
  }
  return groups;
}
