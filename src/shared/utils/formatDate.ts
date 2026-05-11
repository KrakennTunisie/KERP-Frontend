export const formatDateLong = (dateString?: Date): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatDateLongWithTime = (dateString?: Date): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};