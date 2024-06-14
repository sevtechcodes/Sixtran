export function roundMinutes (minutes: number): {hours: number; minutes: number} {
  return { hours: Math.floor(minutes / 60), minutes: minutes % 60};
}