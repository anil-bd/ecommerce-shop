// Rotation boundary: 3:00 UTC. Before that, the site still shows "yesterday's" variant;
// at 3am UTC sharp, seed and prices flip to the new business day.
const ROTATION_HOUR_UTC = 3;

function businessDate(offsetDays = 0): string {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() - ROTATION_HOUR_UTC);
  now.setUTCDate(now.getUTCDate() + offsetDays);
  return now.toISOString().slice(0, 10);
}

export function todayBusinessDate(): string {
  return businessDate(0);
}

export function yesterdayBusinessDate(): string {
  return businessDate(-1);
}

export function daysSinceEpoch(date: string): number {
  return Math.floor(new Date(date + "T00:00:00Z").getTime() / 86_400_000);
}
