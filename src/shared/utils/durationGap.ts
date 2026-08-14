export function getActiveDuration(createdAt: Date): string {
  const now = new Date();

  const creationDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (creationDate > now) {
    return "0 jour";
  }

  let years = now.getFullYear() - creationDate.getFullYear();
  let months = now.getMonth() - creationDate.getMonth();
  let days = now.getDate() - creationDate.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).getDate();

    days += previousMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    if (months > 0) {
      return `${years} an${years > 1 ? "s" : ""} et ${months} mois`;
    }

    return `${years} an${years > 1 ? "s" : ""}`;
  }

  if (months > 0) {
    if (days > 0) {
      return `${months} mois et ${days} jour${days > 1 ? "s" : ""}`;
    }

    return `${months} mois`;
  }

  return `${days} jour${days > 1 ? "s" : ""}`;
}