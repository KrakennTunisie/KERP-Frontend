  export const passwordStrength = (pw: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map: Record<number, { label: string; color: string }> = {
      0: { label: "", color: "bg-gray-200" },
      1: { label: "Faible", color: "bg-red-400" },
      2: { label: "Moyen", color: "bg-amber-400" },
      3: { label: "Bon", color: "bg-blue-400" },
      4: { label: "Fort", color: "bg-green-500" },
    };
    return { score, ...map[score] };
  };