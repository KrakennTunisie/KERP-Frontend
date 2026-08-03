// paymentCondition.ts

/**
 * Table d'alias pour les libellés en texte libre (français)
 * vers un nombre de jours — utile pour les données extraites par l'IA.
 */
const paymentTermAliases: Record<string, number> = {
  "immédiatement": 0,
  "immediat": 0,
  "le jour meme": 0,
  "le jour même": 0, // ⚠️ corrigé : la clé doit être en minuscules car normalized est lowercased
  "comptant": 0,
  "à réception": 0,
  "a reception": 0,
  "5 jours": 5,
  "10 jours": 10,
  "15 jours": 15,
  "25 jours": 25,
  "30 jours": 30,
  "30 jours fin de mois": 30,
  "40 jours": 40,
  "45 jours": 45,
  "60 jours": 60,
  "60 jours fin de mois": 60,
};

/**
 * Convertit une valeur quelconque (string libre, format "NET_X", ou number)
 * en nombre de jours. Retourne 0 par défaut si la valeur est null/undefined
 * ou non reconnue.
 *
 * Exemples :
 *  - "NET_30"         → 30
 *  - "immédiatement"  → 0
 *  - "30 jours"       → 30
 *  - 45               → 45
 *  - "inconnu"        → 0
 *  - undefined        → 0
 *  - null             → 0
 */
export const normalizePaymentTermFromDb = (
  value?: string | number | null
): number => {
  if (value === undefined || value === null) return 0;

  if (typeof value === "number") return value; // déjà au bon format

  const normalized = value.toLowerCase().trim();

  // format base de données : "NET_30", "NET_0", etc.
  const netMatch = normalized.match(/^net_(\d+)$/);
  if (netMatch) {
    return parseInt(netMatch[1], 10);
  }

  // format libellé français libre (ex: extraction IA)
  return paymentTermAliases[normalized] ?? 0;
};

/**
 * Convertit un nombre de jours vers le format stocké en base : "NET_X"
 */
export const daysToPaymentTerm = (days: number): string => {
  return `NET_${days}`;
};

/**
 * Normalise n'importe quelle valeur d'entrée (string libre, "NET_X", ou number)
 * directement vers le format string attendu par la base / le formulaire : "NET_X"
 * Retourne "NET_0" par défaut si la valeur est absente ou non reconnue.
 */
export const normalizePaymentConditionToDbFormat = (
  value?: string | number | null
): string => {
  const days = normalizePaymentTermFromDb(value);
  return daysToPaymentTerm(days);
};

/**
 * Formate une valeur "NET_X" en libellé français lisible pour l'affichage.
 */
export const formatPaymentTermLabel = (value?: string | number | null): string => {
  const days = normalizePaymentTermFromDb(value);
  return days === 0 ? "Immédiatement" : `${days} jours`;
};