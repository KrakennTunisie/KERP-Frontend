export function formatNotificationShortDate(date: string) {
  const diff = Date.now() - new Date(date).getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}s`;
  }

  if (minutes < 60) {
    return `${minutes}min`;
  }

  if (hours < 24) {
    return `${hours}h`;
  }

  if (days === 1) {
    return "hier";
  }

  return `${days}j`;
}