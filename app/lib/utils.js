export function roundMinutes (minutes) {
  return {hours: Math.floor(minutes / 60), minutes: minutes % 60};
}