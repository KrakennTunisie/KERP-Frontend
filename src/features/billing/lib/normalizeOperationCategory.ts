// operationCategory.ts
import { z } from "zod";

export const operationCategorySchema = z.enum([
  "OFFICE_SUPPLIES",
  "SOFTWARE",
  "TRANSPORT",
  "BANK",
  "INSURANCE",
  "ACCOUNTING",
  "EVENT",
  "MARKETING",
  "DEPRECIABLE_EQUIPMENT",
  "SERVICE_PROVISION",
  "RESTAURANT",
  "GOODS",
  "OTHER",
]);
export type OperationCategory = z.infer<typeof operationCategorySchema>;

export const OperationCategoryLabels: Record<OperationCategory, string> = {
  OFFICE_SUPPLIES: "Fourniture du bureau",
  SOFTWARE: "Logiciels",
  TRANSPORT: "Bureau Transport",
  BANK: "Banque",
  INSURANCE: "Assurance",
  ACCOUNTING: "Comptabilité",
  EVENT: "Event",
  MARKETING: "Marketing",
  DEPRECIABLE_EQUIPMENT: "Matériel amortissable",
  SERVICE_PROVISION: "Prestation de Service",
  RESTAURANT: "Restaurant",
  GOODS: "Biens",
  OTHER: "Autre",
};

const operationCategoryAliases: Record<string, OperationCategory> = {
  "fourniture du bureau": "OFFICE_SUPPLIES",
  "fournitures de bureau": "OFFICE_SUPPLIES",
  "fourniture de bureau": "OFFICE_SUPPLIES",
  "fournitures": "OFFICE_SUPPLIES",
  "office supplies": "OFFICE_SUPPLIES",

  "logiciel": "SOFTWARE",
  "logiciels": "SOFTWARE",
  "software": "SOFTWARE",
  "abonnement logiciel": "SOFTWARE",
  "saas": "SOFTWARE",

  "transport": "TRANSPORT",
  "bureau transport": "TRANSPORT",
  "deplacement": "TRANSPORT",
  "déplacement": "TRANSPORT",
  "deplacements": "TRANSPORT",
  "déplacements": "TRANSPORT",
  "carburant": "TRANSPORT",
  "essence": "TRANSPORT",

  "banque": "BANK",
  "frais bancaires": "BANK",
  "bank": "BANK",

  "assurance": "INSURANCE",
  "assurances": "INSURANCE",
  "insurance": "INSURANCE",

  "comptabilite": "ACCOUNTING",
  "comptabilité": "ACCOUNTING",
  "accounting": "ACCOUNTING",
  "expert comptable": "ACCOUNTING",

  "event": "EVENT",
  "evenement": "EVENT",
  "événement": "EVENT",
  "evenements": "EVENT",
  "événements": "EVENT",

  "marketing": "MARKETING",
  "publicite": "MARKETING",
  "publicité": "MARKETING",
  "communication": "MARKETING",

  "materiel amortissable": "DEPRECIABLE_EQUIPMENT",
  "matériel amortissable": "DEPRECIABLE_EQUIPMENT",
  "equipement": "DEPRECIABLE_EQUIPMENT",
  "équipement": "DEPRECIABLE_EQUIPMENT",
  "materiel": "DEPRECIABLE_EQUIPMENT",
  "matériel": "DEPRECIABLE_EQUIPMENT",

  "prestation de service": "SERVICE_PROVISION",
  "prestation de services": "SERVICE_PROVISION",
  "prestation": "SERVICE_PROVISION",
  "service": "SERVICE_PROVISION",
  "services": "SERVICE_PROVISION",
  "main d'oeuvre": "SERVICE_PROVISION",
  "main d'œuvre": "SERVICE_PROVISION",

  "restaurant": "RESTAURANT",
  "repas": "RESTAURANT",
  "restauration": "RESTAURANT",

  "biens": "GOODS",
  "bien": "GOODS",
  "marchandise": "GOODS",
  "marchandises": "GOODS",
  "produit": "GOODS",
  "produits": "GOODS",
  "achat de biens": "GOODS",
  "goods": "GOODS",
  "materiels": "GOODS",

  "autre": "OTHER",
  "other": "OTHER",
  "divers": "OTHER",
};

/**
 * Traduit n'importe quelle valeur (enum anglais, texte libre FR/EN, alias, null/undefined)
 * vers le libellé français correspondant. Retourne "Autre" par défaut si non reconnu.
 */
export const formatOperationCategoryLabel = (
  value?: string | null
): string => {
  if (!value) return OperationCategoryLabels.OTHER;

  // essai direct sur l'enum (ex: "SOFTWARE", "GOODS")
  const direct = operationCategorySchema.safeParse(value.trim().toUpperCase());
  if (direct.success) return OperationCategoryLabels[direct.data];

  // essai via alias texte libre (français/anglais)
  const normalized = value.toLowerCase().trim();
  const category = operationCategoryAliases[normalized];

  return category ? OperationCategoryLabels[category] : OperationCategoryLabels.OTHER;
};